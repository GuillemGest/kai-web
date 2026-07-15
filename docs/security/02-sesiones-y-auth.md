# 02 · Sesiones y autenticación — base transversal

El reset de contraseña (doc 01) y el pago (doc 03) dependen de lo mismo: que
**el servidor pueda saber con certeza quién hace cada petición**. Hoy no puede:
la sesión vive en `localStorage` y los endpoints confían en el
`userId`/`email` que el propio cliente envía. Este documento define el modelo
objetivo.

## 1. Problema actual

- `HttpAuthRepository` guarda la sesión (JWT + datos) en `localStorage` y en
  una cookie legible por JS del origin de kai-web; la cookie SSO httpOnly de
  `.amplifysoft.io` existe solo para el handoff al panel.
- Consecuencias:
  - **XSS ⇒ robo de sesión completo**: cualquier script inyectado lee el token.
  - Los endpoints SSR (`/api/checkout`, `/api/invoices`, `/api/subscriptions`)
    no reciben credencial verificable y aceptan la identidad del body/query
    (ver gaps G4/G5 del README).

## 2. Modelo objetivo de sesión

### 2.1 Cookie de sesión httpOnly

- La credencial de sesión viaja en cookie con:
  - `HttpOnly` (JS no puede leerla — neutraliza el robo por XSS),
  - `Secure` (solo HTTPS),
  - `SameSite=Lax` (mitiga CSRF en navegaciones cross-site; `Strict` si el
    flujo lo tolera),
  - `Path=/`, dominio tan estrecho como permita el SSO con el panel,
  - expiración corta + mecanismo de renovación (refresh token con rotación, o
    sliding session en servidor).
- El frontend deja de tratar el token como dato: para saber "quién soy" llama
  a un endpoint `GET /me` que valida la cookie en servidor. `localStorage`
  puede conservar solo datos NO sensibles de presentación (nombre, locale) y
  nunca el token.

### 2.2 Verificación en cada endpoint del servidor

Todo endpoint SSR que actúe "como un usuario" sigue el mismo patrón:

```
1. Leer cookie de sesión (o Authorization: Bearer si es API pura).
2. Validar el token contra el backend de auth (firma + expiración + no revocado).
3. Derivar userId/email DEL TOKEN — ignorar cualquier identidad del body/query.
4. Autorizar: ¿puede ESTE usuario hacer ESTA operación sobre ESTE recurso?
5. Solo entonces, ejecutar el caso de uso.
```

El paso 4 es lo que elimina los IDOR: `/api/invoices` no recibe `email`,
lista las facturas **del usuario de la sesión**.

### 2.3 CSRF

Con cookies de sesión, los endpoints mutadores (POST/PUT/DELETE) necesitan
defensa CSRF:

- `SameSite=Lax/Strict` cubre la mayoría de vectores modernos.
- Añadir además **una** de estas capas: token CSRF (double-submit o
  sincronizado), o verificación de cabecera `Origin`/`Sec-Fetch-Site` contra
  una allowlist. Para APIs consumidas solo por fetch propio, exigir una
  cabecera custom (`X-Requested-With`) también corta el CSRF clásico de
  formulario.
- Los webhooks (Stripe) están exentos: su autenticación es la firma.

## 3. Login

- **Errores genéricos**: "credenciales incorrectas" sin distinguir si el email
  existe (ya se hace en la UI — mantenerlo en el backend: mismo código y mismo
  tiempo de respuesta).
- **Rate limiting escalonado**: por cuenta (p. ej. 5 fallos ⇒ backoff
  exponencial o CAPTCHA) y por IP (cortar credential stuffing). Evitar el
  lockout duro permanente (sería un vector de DoS contra usuarios legítimos).
- **2FA**: el código actual por email debe ser CSPRNG, ≥ 6 dígitos, TTL ≤ 10
  min, un solo uso, con máximo de intentos por código (p. ej. 5) antes de
  invalidarlo. No revelar en el error si falló el código o caducó.
- **Notificación de nuevo inicio de sesión** (dispositivo/ubicación nueva) por
  email — da a la víctima la oportunidad de reaccionar.
- Tras login exitoso, **regenerar el identificador de sesión** (evita session
  fixation).

## 4. Gestión de sesiones activas

Ya existe UI de "sesiones activas" (`GetActiveSessions`). El backend debe
soportar de verdad:

- Listado de sesiones con dispositivo/IP/fecha.
- **Revocación individual y global** ("cerrar todas las demás sesiones").
- Revocación automática al: resetear contraseña (doc 01), cambiar contraseña,
  cambiar email, desactivar 2FA.
- Si se usan JWT sin estado: mantener una versión de sesión por usuario o una
  denylist con TTL; si no, tokens opacos consultables.

## 5. Operaciones sensibles ⇒ re-autenticación (step-up)

Exigir contraseña actual (o código 2FA) aunque haya sesión válida para:

- Cambiar contraseña (doc 01 §5).
- Cambiar el email de la cuenta.
- Desactivar 2FA.
- Ver/gestionar métodos de pago fuera del checkout de Stripe.

Regla práctica: si la operación permitiría a un atacante con una sesión robada
**consolidar el control** de la cuenta, requiere step-up.

## 6. Cabeceras de seguridad (hosting/Astro)

Config global del sitio (middleware de Astro o config del hosting):

| Cabecera | Valor recomendado | Para qué |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Forzar HTTPS |
| `Content-Security-Policy` | política restrictiva; sin `unsafe-inline` en scripts (Astro islands lo permite con nonce/hashes) | Reducir impacto de XSS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` (y `no-referrer` en páginas con token, doc 01 §4.2) | No fugar URLs |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-Frame-Options` / `frame-ancestors` | `DENY` / `'none'` | Clickjacking |
| `Permissions-Policy` | denegar lo no usado | Reducir superficie |

XSS es EL riesgo que rompe todo el modelo (incluso con httpOnly, un XSS puede
operar "en nombre" del usuario): CSP estricta + escapado por defecto de
React/Astro + prohibición de `dangerouslySetInnerHTML`/`set:html` con datos de
usuario son la línea de defensa.

## 7. Secretos y configuración

- Secretos (claves Stripe, secretos de firma, credenciales SMTP) SOLO en
  variables de entorno del servidor; jamás en código, en el repo ni en
  variables `PUBLIC_`/expuestas al cliente.
- Separación estricta test/producción (claves, webhooks, dominios).
- Rotación documentada: qué rotar, cómo y con qué frecuencia; revocar
  inmediatamente ante sospecha de fuga.
- `.env` en `.gitignore` (verificar) y `.env.example` sin valores reales.

## 8. Checklist

- [ ] Sesión en cookie `HttpOnly + Secure + SameSite`; `localStorage` sin tokens.
- [ ] Todos los `/api/*` derivan la identidad de la credencial verificada, nunca del request.
- [ ] Defensa CSRF activa en endpoints mutadores con cookie.
- [ ] Rate limiting en login/2FA/forgot; errores y tiempos indistinguibles.
- [ ] Códigos 2FA: CSPRNG, TTL corto, un uso, intentos limitados.
- [ ] Revocación de sesiones: individual, global y automática en eventos sensibles.
- [ ] Step-up para operaciones sensibles.
- [ ] Cabeceras de seguridad desplegadas (incl. CSP).
- [ ] Emails de notificación: nuevo login, contraseña cambiada, email cambiado.
- [ ] Secretos solo en entorno servidor; separación test/live; plan de rotación.
