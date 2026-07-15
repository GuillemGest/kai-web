# Seguridad — Plan de referencia de kai-web

Documentación de seguridad de los flujos sensibles de kai-web: **recuperación /
cambio de contraseña** y **pago (checkout Stripe)**, más el pilar transversal
del que dependen ambos: **sesiones y autenticación**.

> Estado: **plan de diseño**. Describe QUÉ debe existir y CÓMO debe hacerse
> antes de considerar estos flujos aptos para producción. No es documentación
> de algo ya implementado: el prototipo actual incumple deliberadamente varias
> de estas reglas (están señaladas como "gap" en cada documento).

## Documentos

| Doc | Tema | Cuándo leerlo |
| --- | --- | --- |
| [01-recuperacion-contrasena.md](./01-recuperacion-contrasena.md) | Flujo completo de reset de contraseña: tokens, emails, página de restablecer | Antes de implementar el reset real |
| [02-sesiones-y-auth.md](./02-sesiones-y-auth.md) | Sesiones, cookies, rate limiting, 2FA — base de los otros dos flujos | Antes de tocar cualquier endpoint autenticado |
| [03-pagos.md](./03-pagos.md) | Checkout Stripe, webhooks, endpoints de facturación | Antes de activar pagos en modo live |

## Estado actual (julio 2026) — gaps conocidos

Resumen de lo que HOY es un prototipo y no puede pasar a producción tal cual:

| # | Gap | Dónde | Riesgo | Prioridad |
| --- | --- | --- | --- | --- |
| G1 | La página de restablecer contraseña es accesible por URL directa con `?email=` — **cualquiera que conozca un email puede cambiar su contraseña** | `src/pages/[lang]/restablecer-contrasena.astro`, `src/ui/islands/ResetPasswordApp.tsx` | Account takeover trivial | 🔴 Crítica |
| G2 | `SetPassword` no exige ninguna prueba de identidad (ni token, ni sesión) | `src/modules/registration/application/SetPassword.ts` | Account takeover | 🔴 Crítica |
| G3 | Lo mismo aplica a la confirmación de cuenta (`/confirmar-cuenta?email=`) | `src/ui/islands/ConfirmAccountApp.tsx` | Secuestro de altas pendientes | 🔴 Crítica |
| G4 | Sesión en `localStorage`; los endpoints del servidor no pueden derivar el usuario y confían en `userId`/`email` enviados por el cliente | `src/modules/auth/infrastructure/HttpAuthRepository.ts`, `src/pages/api/*` | Suplantación en API | 🔴 Crítica |
| G5 | IDOR: `/api/invoices?email=` y `/api/subscriptions` devuelven datos de CUALQUIER email sin autenticación | `src/pages/api/invoices.ts`, `src/pages/api/subscriptions.ts` | Fuga de datos de facturación de terceros | 🔴 Crítica |
| G6 | El webhook de Stripe verifica firma ✅ pero no procesa eventos ni deduplica (`event.id`) | `src/pages/api/stripe/webhook.ts` | Estados de pago inconsistentes | 🟠 Alta |
| G7 | Sin rate limiting en ningún endpoint (login, reset, checkout) | Todos los `src/pages/api/*` y el backend de auth | Fuerza bruta, card testing, spam de emails | 🟠 Alta |
| G8 | `/checkout/gracias` confía en la vuelta del navegador; no verifica `session_id` contra Stripe en servidor | `src/pages/[lang]/checkout/gracias.astro` | UI de éxito falseable (el webhook mitiga el fraude real) | 🟡 Media |
| G9 | Sin cabeceras de seguridad (CSP, HSTS, Referrer-Policy...) | Config Astro / hosting | XSS ampliado, fuga de tokens por Referer | 🟡 Media |

Lo que ya está **bien** y hay que conservar:

- ✅ Precios resueltos SIEMPRE en servidor a partir de `price_...` de entorno
  (`CreateCheckoutSession`); un total manipulado en cliente no afecta.
- ✅ Firma del webhook verificada sobre el body en crudo antes de procesar.
- ✅ Errores internos de Stripe no se filtran al cliente (solo al log).
- ✅ Política de contraseñas centralizada en el dominio (`Password`), validada
  también en servidor.
- ✅ Stripe Checkout alojado (nunca tocamos datos de tarjeta → alcance PCI SAQ A).
- ✅ Los value objects del dominio (`Email`, `Password`, `BillingDetails`)
  concentran la validación de inputs.

## Orden de implementación recomendado

1. **Fase 0 — Sesiones (doc 02):** cookie httpOnly + verificación de sesión en
   servidor. Sin esto, el resto no se puede cerrar (G4, prerequisito de G5).
2. **Fase 1 — Reset de contraseña (doc 01):** tokens de un solo uso con TTL,
   emails reales, endpoints de backend (G1, G2, G3).
3. **Fase 2 — Endpoints de facturación (doc 03 §5):** exigir sesión y derivar
   el email/userId de ella, nunca del request (G5).
4. **Fase 3 — Webhook y conciliación (doc 03 §3–4):** procesado idempotente,
   activación de suscripciones solo por webhook (G6, G8).
5. **Fase 4 — Endurecimiento (docs 01–03):** rate limiting, cabeceras,
   auditoría, alertas (G7, G9).

## Principios que aplican a todo

- **El cliente es hostil.** Nada que llegue del navegador (body, query,
  headers, cookies legibles por JS) es confiable. La identidad se deriva en
  servidor de una credencial verificable (cookie httpOnly de sesión o token
  firmado), jamás de un `userId`/`email` en el request.
- **Un secreto por canal y de un solo uso.** Los enlaces por email llevan un
  token aleatorio, no datos identificables; el token caduca, se invalida al
  usarse y se guarda hasheado.
- **Respuestas indistinguibles.** Ningún endpoint público revela si un email
  existe (ni por mensaje, ni por código de estado, ni por tiempo de respuesta).
- **La fuente de verdad del dinero es el webhook firmado**, nunca la vuelta del
  navegador.
- **Todo evento sensible deja rastro** (auditoría) **y notifica al usuario**
  (email de "tu contraseña ha cambiado", "nuevo inicio de sesión", recibos).
