# 01 · Seguridad del flujo de recuperación de contraseña

Diseño de referencia para convertir el prototipo actual (páginas
`/recuperar-contrasena` y `/restablecer-contrasena`) en un flujo de reset
seguro. Aplica igualmente a la confirmación de cuenta (`/confirmar-cuenta`),
que comparte el mismo problema y la misma solución.

## 1. El problema actual

Hoy el enlace "del correo" es simplemente
`/{lang}/restablecer-contrasena?email=<email>`. Consecuencias:

- **Cualquiera que conozca (o adivine) un email puede cambiar su contraseña.**
  No hay ninguna prueba de que quien abre la página controle ese buzón.
- El email viaja en la query string: queda en historial del navegador, logs de
  servidor/proxy, y en la cabecera `Referer` de cualquier recurso externo.
- `SetPassword.execute(email, password)` acepta cualquier email sin credencial.

El diseño correcto sustituye "conocer el email" por "poseer un token secreto de
un solo uso que solo llegó a ese buzón".

## 2. Flujo objetivo (visión completa)

```
[1] Usuario pide reset            [2] Backend                [3] Email
    POST /auth/password/forgot        genera token CSPRNG        enlace con token
    { email }                         guarda HASH(token)+TTL     (no incluye email)
    → 202 SIEMPRE                     encola email
                                      (nada si el email no existe)

[4] Usuario abre enlace           [5] Backend                [6] Usuario envía
    GET /restablecer?token=T          POST /auth/password/       nueva contraseña
    página valida token                 reset/validate            POST /auth/password/reset
    ANTES de mostrar el form           → válido / inválido        { token, newPassword }
                                                                  → verifica todo de nuevo
[7] Éxito
    - contraseña actualizada (hash Argon2id/bcrypt)
    - token invalidado (y todos los demás tokens del usuario)
    - TODAS las sesiones/refresh tokens revocados
    - email de notificación "tu contraseña ha cambiado"
    - registro de auditoría
    - redirección a login (sin iniciar sesión automáticamente)
```

## 3. Solicitud del reset (`/recuperar-contrasena`)

### 3.1 Anti-enumeración de usuarios

- La respuesta es **siempre la misma** (202 + "si existe una cuenta, recibirás
  un correo"), exista o no el email. La página ya muestra este patrón — debe
  mantenerse cuando haya backend.
- **Tiempo de respuesta constante**: si el email existe se hace trabajo (crear
  token, encolar email) y si no, no. Encolar el trabajo (job async) y responder
  inmediato en ambos casos; no hacer el envío inline.
- No usar códigos de estado distintos ni mensajes de error distintos.

### 3.2 Rate limiting y abuso

- Límite **por email destino**: p. ej. máx. 3 solicitudes / hora / cuenta
  (evita bombardear el buzón de la víctima — "email bombing").
- Límite **por IP**: p. ej. 10 solicitudes / hora (evita enumeración masiva y
  spam a costa de nuestra reputación de envío).
- A partir de N intentos, exigir CAPTCHA (Turnstile/hCaptcha) en el formulario.
- Reintentos dentro de la ventana: responder 202 igualmente pero NO reenviar
  el email (o reenviar el MISMO token si sigue vigente, nunca acumular tokens).

### 3.3 Generación del token

- **CSPRNG**: mínimo 32 bytes de `crypto.randomBytes` (o equivalente),
  codificados en base64url. Jamás `Math.random()`, jamás derivado del email,
  userId o timestamp.
- **Almacenar SOLO el hash** del token (SHA-256 es suficiente al ser un secreto
  de alta entropía; no necesita salt ni KDF lento). Si la BD se filtra, los
  tokens no son utilizables.
- Registro en BD: `{ tokenHash, userId, expiresAt, usedAt, createdAt,
  requestIp, requestUserAgent }`.
- **TTL corto**: 15–30 minutos (máximo 1 hora). Es un compromiso: suficiente
  para leer el correo, insuficiente para un atacante con acceso posterior al
  buzón/logs.
- **Un token vigente por usuario**: al crear uno nuevo, invalidar los
  anteriores. Nunca reutilizable: `usedAt` se marca al consumirse.
- El token **identifica por sí solo** al usuario (lookup por hash). El enlace
  NO lleva email ni userId.

### 3.4 El email de recuperación

- Enlace: `https://<dominio-canónico>/{lang}/restablecer-contrasena?token=<T>`.
- **La URL base viene de configuración del servidor, NUNCA de la cabecera
  `Host`/`X-Forwarded-Host` del request** (ataque de host header injection: el
  atacante provoca que el enlace del email apunte a su dominio y captura el
  token cuando la víctima hace clic).
- Contenido del email: quién lo pidió no importa; sí incluir "si no has sido
  tú, ignora este correo — tu contraseña no ha cambiado" y una vía de reporte.
- No incluir la contraseña actual ni ningún dato sensible.
- Envío con SPF/DKIM/DMARC correctos (evita que el dominio sea suplantable en
  phishing de "reset de KAI").

## 4. Página de restablecer (`/restablecer-contrasena`)

### 4.1 Acceso a la página

- La página se abre con `?token=T`. **Antes de mostrar el formulario**, validar
  el token contra el backend (`POST /auth/password/reset/validate`). Si es
  inválido/caducado/usado → vista de error con CTA "solicitar un nuevo enlace",
  sin formulario.
- La validación previa es UX (no mostrar un formulario que fallará); la
  validación **autoritativa se repite en el submit**. Nunca confiar en que "ya
  se validó al cargar".
- Sin token en la URL → misma vista de error. La página no tiene ningún modo
  "abierto".

### 4.2 Manejo del token en el navegador

- **Referrer-Policy**: la página debe servirse con
  `Referrer-Policy: no-referrer` (o `same-origin`) para que el token no se
  fugue por `Referer` hacia recursos/enlaces externos.
- **Sin analytics ni scripts de terceros** en esta página (capturarían la URL
  completa con el token).
- **No cachear**: `Cache-Control: no-store` (proxies/navegadores compartidos).
- Mejora opcional: al cargar, mover el token de la URL a memoria y limpiar la
  query con `history.replaceState` (reduce exposición en historial).
- El token nunca se persiste en `localStorage`/`sessionStorage`.

### 4.3 Endpoint de consumo (`POST /auth/password/reset`)

- Input: `{ token, newPassword }`. Nada más — ni email ni userId (se derivan
  del token).
- Comprobaciones, en orden:
  1. `hash(token)` existe en BD, `usedAt IS NULL`, `expiresAt > now()`.
     **Comparación en tiempo constante** si se compara contra un valor
     recuperado por otra clave (con lookup por hash exacto no aplica).
  2. Política de contraseña (ya existe en el dominio: `Password.fromString`,
     que lanza `WeakPasswordError`). La validación del cliente es solo UX.
  3. Recomendado: rechazar contraseñas filtradas (API de HaveIBeenPwned por
     k-anonimato — se envían solo los 5 primeros caracteres del SHA-1).
  4. Recomendado: rechazar que la nueva contraseña sea igual a la anterior.
- Efectos atómicos del éxito:
  - Hash de la nueva contraseña con **Argon2id** (o bcrypt/scrypt con coste
    actualizado). Nunca almacenar en claro ni con hash rápido sin salt.
  - `usedAt = now()` en el token usado + invalidar cualquier otro token del
    usuario.
  - **Revocar TODAS las sesiones y refresh tokens del usuario** (si un
    atacante tenía una sesión robada, el reset la mata). Si el backend usa
    JWT sin estado, hace falta versión de sesión / lista de revocación.
  - Enviar email de notificación: "tu contraseña ha cambiado; si no has sido
    tú, contacta soporte" (esta es la última línea de defensa de la víctima).
  - Registrar en auditoría (ver §6).
- **No iniciar sesión automáticamente** tras el reset: redirigir al login. Un
  auto-login convierte cualquier fuga de token en sesión directa y complica el
  razonamiento sobre 2FA.
- Rate limiting también aquí: N intentos de token inválido por IP → bloquear
  temporalmente (evita fuerza bruta del token, que aunque es inviable con 256
  bits, no debe ser gratis).

### 4.4 Interacción con 2FA

El login de KAI tiene segundo factor por código. El reset de contraseña **no
debe convertirse en el bypass del 2FA**:

- Restablecer la contraseña NO desactiva el 2FA ni lo salta: tras el reset, el
  login sigue pidiendo el código.
- Cambiar el email de la cuenta o desactivar 2FA son operaciones separadas que
  exigen sesión + re-autenticación reciente (ver doc 02).

## 5. Cambio de contraseña con sesión (área de cuenta)

Distinto del reset (usuario SÍ autenticado), pero con reglas propias:

- Exigir la **contraseña actual** además de la nueva (una sesión robada/dejada
  abierta no debe poder fijar contraseña nueva sin conocer la actual).
- Revocar el resto de sesiones (todas menos la actual) tras el cambio.
- Email de notificación, auditoría y rate limiting igual que el reset.
- Si la cuenta tiene 2FA, opcionalmente pedir código para esta operación
  (patrón "step-up / re-auth reciente").

## 6. Auditoría y monitorización

Registrar (sin guardar nunca contraseñas ni tokens en claro):

| Evento | Datos |
| --- | --- |
| `password_reset_requested` | userId (si existe), IP, user-agent, timestamp |
| `password_reset_email_sent` | userId, message-id del email |
| `password_reset_token_invalid` | hash truncado del token probado, IP |
| `password_reset_completed` | userId, IP, user-agent |
| `password_changed` (con sesión) | userId, IP |
| `sessions_revoked` | userId, motivo |

Alertas recomendadas: pico de `reset_requested` (enumeración/bombing), ratio
alto de `token_invalid` (fuerza bruta), resets seguidos de cambio de email.

## 7. Aplicación a la confirmación de cuenta

`/confirmar-cuenta?email=` tiene el mismo defecto: quien conozca el email de
un registro pendiente puede fijar su contraseña y quedarse la cuenta. La
solución es idéntica y puede **compartir la infraestructura de tokens**:

- Al registrarse, se genera un token de confirmación (mismo diseño: CSPRNG,
  hash en BD, TTL más largo — p. ej. 24–72 h — un solo uso).
- El enlace del email es `/confirmar-cuenta?token=T`.
- Consumirlo fija la contraseña Y marca el email como verificado.
- Diferenciar el **tipo** de token en BD (`purpose: 'account_confirmation' |
  'password_reset'`): un token de un propósito jamás vale para el otro.

## 8. Mapa a la arquitectura del proyecto (DDD)

Cuando se implemente (backend de auth de Amplify o módulo propio):

```
modules/auth/
  domain/
    PasswordResetToken.ts        # VO/entidad: hash, expiresAt, usedAt, purpose
    IPasswordResetRepository.ts  # guardar/buscar por hash/invalidar por usuario
  application/
    RequestPasswordReset.ts      # caso de uso [1]-[3]  (respuesta ciega)
    ValidateResetToken.ts        # caso de uso [5]
    ResetPassword.ts             # caso de uso [6]-[7]  (sustituye al uso
                                 #   provisional de registration/SetPassword)
  infrastructure/
    HttpPasswordResetRepository.ts (o la impl. del backend real)
```

- La política de contraseña sigue viviendo en `registration/domain/Password`
  (o se promociona a un módulo compartido si auth y registration la comparten).
- Las islas `ForgotPasswordApp` y `ResetPasswordApp` pasan a llamar a estos
  casos de uso; los botones "simular enlace del correo" (marcados
  `⚠️ PROVISIONAL`) se eliminan.
- Tests esperados: casos de uso (token caducado, usado, inválido, contraseña
  débil, revocación de sesiones) con Object Mothers para tokens.

## 9. Checklist de salida a producción

- [ ] El enlace del email lleva token CSPRNG ≥ 32 bytes, no email.
- [ ] Token hasheado en BD, TTL ≤ 1 h, un solo uso, un vigente por usuario.
- [ ] Respuesta del "forgot" indistinguible exista o no la cuenta (contenido y tiempo).
- [ ] Rate limiting por email y por IP en forgot y en reset.
- [ ] La página de reset no muestra formulario sin token válido; el submit revalida.
- [ ] `Referrer-Policy: no-referrer` + `Cache-Control: no-store` + sin scripts de terceros en la página.
- [ ] URL base de los enlaces desde configuración, no de la cabecera Host.
- [ ] Contraseña con Argon2id/bcrypt; política validada en servidor; (opcional) HIBP.
- [ ] Éxito ⇒ token consumido + resto de tokens invalidados + TODAS las sesiones revocadas + email de aviso.
- [ ] Sin auto-login tras el reset; 2FA sigue aplicando en el siguiente login.
- [ ] Confirmación de cuenta migrada al mismo esquema de tokens (`purpose` distinto).
- [ ] Auditoría + alertas configuradas.
- [ ] Botones "simular enlace del correo" eliminados de `ForgotPasswordApp`, `RegisterApp` y afines.
