# Billing multi-organización — pendientes tras esta tanda

Esta tanda implementó el rename `email` → `organizationId` en dominio, infraestructura
Stripe y application de `modules/billing` (§3, §4, §5 de
[billing-multi-organizacion.md](./billing-multi-organizacion.md)), y el rename mecánico
en los 10 endpoints `/api/*` y en la UI (`AccountShell.tsx`, `CheckoutWizard.tsx`) para
que todo compile y sea visible/funcional en local. **No es seguro para producción.**
Pendiente explícito:

## 1. Autorización — bloqueante antes de cualquier despliegue real

Ninguno de los 10 endpoints verifica que el usuario pertenezca a `organizationId`. Es
exactamente el IDOR que describe el documento original en §7: cualquiera que conozca o
adivine un `organizationId` puede leer/tocar la facturación de esa organización.

Cada endpoint tiene un comentario `TODO(billing-multi-org, seguridad)` señalando esto.
Afectados:

- `src/pages/api/payment-methods.ts`
- `src/pages/api/payment-methods/set-default.ts`
- `src/pages/api/payment-methods/remove.ts`
- `src/pages/api/payment-methods/setup-session.ts`
- `src/pages/api/subscriptions.ts`
- `src/pages/api/subscriptions/cancel.ts`
- `src/pages/api/subscriptions/reactivate.ts`
- `src/pages/api/subscriptions/change-plan.ts`
- `src/pages/api/invoices.ts`
- `src/pages/api/checkout.ts` (aquí el riesgo es mayor: permite iniciar cargos a nombre
  de otra organización)

Falta implementar `assertOrganizationAccess` (§7.1 del documento original) y añadirlo en
cada uno de estos endpoints, antes de cualquier llamada a Stripe.

## 2. Backend Amplify — bloqueante para que `resolveCustomerId` sea óptimo

El backend Amplify todavía no expone:

- Cómo leer el `stripeCustomerId` de una organización.
- Cómo persistirlo tras crear un Customer nuevo.
- Un endpoint/claim de "organizaciones del usuario actual" verificado (necesario para
  `assertOrganizationAccess`).

Mientras tanto, `src/modules/billing/infrastructure/StripeMetadataOrganizationBillingRepository.ts`
resuelve el Customer buscando en Stripe por `metadata['organizationId']` (Search API) en
vez de crear uno nuevo en cada request — evita duplicar Customers sin depender del
backend. Limitaciones de este puente temporal:

- La Search API de Stripe indexa con unos segundos de retraso: un Customer recién creado
  puede no aparecer todavía en una búsqueda inmediatamente posterior (edge case raro en
  uso normal, pero puede pasar justo tras un primer checkout).
- Una llamada extra a Stripe por request (la búsqueda) que desaparecería con el campo
  persistido en Amplify.
- Sigue dependiendo de que `metadata['organizationId']` se mantenga siempre correcto en
  el Customer — si algún flujo futuro crea un Customer sin esa metadata, quedaría
  invisible para esta búsqueda.

Sustituir por una implementación HTTP real (contra Amplify) en cuanto el backend soporte
el campo, e inyectarla en las factories (`paymentMethodFactory.ts`,
`subscriptionFactory.ts`, `checkoutFactory.ts`, `invoicesFactory.ts`).

## 3. UI — asume una única organización por usuario

`AccountShell.tsx` y `CheckoutWizard.tsx` usan `session.organization?.id` directamente
como identidad de facturación (sin selector de organización de facturación). Si el
usuario no tiene organización en la sesión, la sección de facturación queda vacía en
vez de romper. No se implementó el selector de organización de facturación que describe
el documento original en §8 (reutilizando el patrón de `TeamSection`) — pendiente si el
producto necesita que un usuario facture desde más de una organización.

## 4. Migración de datos — no aplica todavía

No se ha tocado nada de Stripe en producción ni se ha escrito el script de backfill
(§9 del documento original). Sigue pendiente en su totalidad.

## Qué SÍ quedó cerrado en esta tanda

- Dominio: `Organization` con `stripeCustomerId`; interfaces de billing
  (`IPaymentMethodRepository`, `ISubscriptionRepository`, `IInvoiceRepository`,
  `ICheckoutGateway`, `ICardSetupGateway`) en `organizationId`.
- Infraestructura Stripe: los 4 repos/gateways usan `resolveCustomerId` (Customer 1:1
  por organización, ya no se busca por email ni se agregan varios Customers).
- `IOrganizationBillingRepository`: puerto para desacoplar billing del backend Amplify
  cuando esté listo.
