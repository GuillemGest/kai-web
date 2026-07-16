# De facturación por email a facturación por organización

## 1. El problema, en concreto

Hoy **todo** el módulo `billing` usa el email del usuario como identidad de facturación frente a Stripe. Se ve en cuatro sitios que son en realidad el mismo patrón repetido:

- [`StripePaymentMethodRepository.ts`](../src/modules/billing/infrastructure/StripePaymentMethodRepository.ts): `listByEmail`, `setDefault`, `remove` → todos hacen `stripe.customers.list({ email })`.
- [`StripeSubscriptionRepository.ts`](../src/modules/billing/infrastructure/StripeSubscriptionRepository.ts): suscripciones se buscan/gestionan por email.
- [`StripeInvoiceRepository.ts`](../src/modules/billing/infrastructure/StripeInvoiceRepository.ts): facturas por email.
- [`StripeCheckoutGateway.ts`](../src/modules/billing/infrastructure/StripeCheckoutGateway.ts) y [`StripeCardSetupGateway.ts`](../src/modules/billing/infrastructure/StripeCardSetupGateway.ts): el Customer de Stripe se crea/busca por email al iniciar checkout o al añadir una tarjeta.

Y en el lado del endpoint SSR, **todos** los `/api/*` de billing reciben `email` desde el cliente (`AccountShell.tsx` llama `billingUseCases.getSubscriptions.execute(currentUser.email)`, etc.) y no reciben ni conocen ningún `organizationId`.

Esto significa: **un email = un Customer (o varios, agregados) de Stripe = una única "cuenta de facturación"**. Si `guillem.garcia@gestmusic.es` pertenece a dos organizaciones, hoy comparte tarjetas, facturas y plan entre ambas — o peor, no hay forma de distinguir a cuál pertenece cada cosa.

La app **ya tiene** el concepto de organización en otra parte del dominio (`modules/auth/domain/Organization.ts`, `modules/admin/domain/ManagedUser.ts` con `organizations: string[]`, `modules/team/domain/Team.ts` con `organizationId`). El billing es el único módulo que no lo usa. Esto es una buena noticia: no hay que inventar el concepto, solo conectarlo.

## 2. Objetivo del cambio

La identidad de facturación pasa de ser `email` a ser `organizationId`. Cada organización tiene:

- Su propio Stripe Customer (uno, no varios agregados por email).
- Sus propias tarjetas guardadas.
- Sus propias suscripciones y su propio plan.
- Su propio historial de facturas.

Un usuario (`User`, identificado por email) puede pertenecer a N organizaciones, y al entrar en `/admin/facturacio` opera **sobre la organización seleccionada**, no sobre su email.

## 3. Diseño del dominio

### 3.1. Relación User ↔ Organization

Ya existe el germen de esto en `ManagedUser.organizations: string[]` y en `TeamMember.organizationId`, pero son dos modelos distintos y ninguno cubre el caso general "¿a qué organizaciones pertenece el usuario logueado, y con qué rol". Hace falta unificar esto en un caso de uso de auth:

```
GetUserOrganizations(userId | email) -> Organization[]
```

Backend: un endpoint tipo `GET /organizations/mine` (o ampliar el JWT para incluir las organizaciones del usuario como claim, evitando una llamada extra — a valorar con quien mantenga el backend Amplify). Si el JWT ya trae `organizations` como claim, `User.fromJwt` se extiende para parsearlo y no hace falta ni endpoint nuevo.

### 3.2. Organization como Stripe Customer

`Organization` (`modules/auth/domain/Organization.ts`) gana un campo opcional:

```ts
export interface OrganizationPrimitive {
  id: string
  name: string
  stripeCustomerId: string | null
}
```

`stripeCustomerId` es el enlace 1:1 organización↔Customer de Stripe. Se guarda la primera vez que la organización paga algo (en el checkout o en el setup de tarjeta) y desde ahí ya no se busca el Customer por email nunca más — se busca por `stripeCustomerId` directo (`stripe.customers.retrieve(id)`), que es más barato y no ambiguo.

Este campo vive en el backend de Amplify (la fuente de verdad de `Organization`), no en Stripe ni en el cliente. El código de este repo lo consume, no lo inventa.

### 3.3. Contrato de los repositorios de billing

El cambio mecánico central: **todo método que hoy recibe `email: string` pasa a recibir `organizationId: string`**. Por ejemplo:

```ts
// IPaymentMethodRepository.ts — antes
listByEmail(email: string): Promise<PaymentMethod[]>
setDefault(email: string, paymentMethodId: string): Promise<void>
remove(email: string, paymentMethodId: string): Promise<void>

// después
listByOrganization(organizationId: string): Promise<PaymentMethod[]>
setDefault(organizationId: string, paymentMethodId: string): Promise<void>
remove(organizationId: string, paymentMethodId: string): Promise<void>
```

Mismo patrón para `ISubscriptionRepository`, `IInvoiceRepository`, `ICheckoutGateway`, `ICardSetupGateway`. Es un rename de parámetro + cambio de la query subyacente, no un rediseño de la forma de las interfaces — el resto de la firma no cambia.

`Subscription.userId` y `PaymentMethod.userId` pasan a ser conceptualmente `organizationId` (hoy ya guardan el id del Customer de Stripe como "informativo", según el comentario en `StripePaymentMethodRepository.toDomain`; ese id pasa a ser trazable 1:1 a una organización en vez de a un email agregando varios Customers).

## 4. Cambios en infraestructura (Stripe)

### 4.1. Resolución de Customer: de "buscar por email" a "id directo o crear"

Patrón nuevo, común a los cuatro repos Stripe:

```ts
async function resolveCustomerId(
  stripe: Stripe,
  organizationId: string,
  stripeCustomerId: string | null,
): Promise<string> {
  if (stripeCustomerId) return stripeCustomerId
  // Fallback de migración: organización aún sin Customer creado.
  const customer = await stripe.customers.create({
    metadata: { organizationId },
  })
  await persistStripeCustomerId(organizationId, customer.id) // llamada al backend Amplify
  return customer.id
}
```

Puntos clave:

- **`metadata.organizationId`** en el Customer de Stripe: permite auditar/reconciliar desde el dashboard de Stripe sin depender solo del backend propio, y es la salvaguarda si algún día hay que reconstruir el mapeo.
- Ya no hay `stripe.customers.list({ email, limit: 10 })` ni el bucle "busca en qué Customer está la tarjeta" que hoy existe en `setDefault`/`remove` — con `stripeCustomerId` conocido se va directo (`stripe.paymentMethods.list({ customer: stripeCustomerId })`), más rápido y sin el límite arbitrario de `limit: 10` que hoy podría perder Customers si un email tuviera muchos.
- `email` no desaparece de Stripe: se sigue mandando en el Customer (`stripe.customers.update(customerId, { email })`) para que Stripe pueda enviar recibos y mostrar el email en el dashboard, pero deja de ser la clave de búsqueda. El email a usar es el de facturación de la organización (billing contact), que puede no coincidir con el email del usuario que hace clic — ver §6.

### 4.2. Archivos concretos a tocar

| Archivo | Cambio |
|---|---|
| `StripePaymentMethodRepository.ts` | `listByEmail`→`listByOrganization`, quitar el bucle de `customers.list`, usar `resolveCustomerId`. |
| `StripeSubscriptionRepository.ts` | Igual patrón. |
| `StripeInvoiceRepository.ts` | Igual patrón. |
| `StripeCheckoutGateway.ts` | El checkout crea/recupera el Customer de la organización, no del email; guarda `stripeCustomerId` tras crear el Customer nuevo. |
| `StripeCardSetupGateway.ts` | Igual. |
| `paymentMethodFactory.ts`, `subscriptionFactory.ts`, `checkoutFactory.ts`, `invoicesFactory.ts` | Sin cambios de forma (siguen inyectando `secretKey`), pero los use cases que construyen ahora se llaman con `organizationId`. |

## 5. Cambios en application (use cases)

Mismo rename mecánico: `GetPaymentMethods.execute(email)` → `execute(organizationId)`, y así con `SetDefaultPaymentMethod`, `RemovePaymentMethod`, `GetSubscriptions`, `CancelSubscription`, `ReactivateSubscription`, `ChangeSubscriptionPlan`, `GetInvoices`, `CreateCheckoutSession`, `CreateCardSetupSession`.

Ninguno de estos use cases necesita lógica nueva — delegan igual que hoy en el repositorio. El único que gana lógica de verdad es lo que hoy no existe: **verificar que el usuario tiene acceso a esa organización** antes de dejarle tocar su facturación (ver §7, autorización).

## 6. Cambios en los endpoints `/api/*`

Todos los endpoints de billing (`payment-methods.ts`, `payment-methods/set-default.ts`, `payment-methods/remove.ts`, `payment-methods/setup-session.ts`, `subscriptions.ts`, `subscriptions/cancel.ts`, `subscriptions/reactivate.ts`, `subscriptions/change-plan.ts`, `invoices.ts`, `checkout.ts`) cambian su contrato de entrada en DOS aspectos, no solo uno:

```diff
- const email = url.searchParams.get('email')?.trim() ?? ''
- if (!EMAIL_PATTERN.test(email)) {
-   return json({ error: 'email es obligatorio y debe ser válido.' }, 400)
- }
+ const organizationId = url.searchParams.get('organizationId')?.trim() ?? ''
+ if (!organizationId) {
+   return json({ error: 'organizationId es obligatorio.' }, 400)
+ }
+ // El id en sí no es secreto (va en query/body igual que antes el email);
+ // lo que cambia es que ahora se EXIGE probar acceso a él vía el header
+ // Authorization — ver §7. Sin esto, el rename de arriba por sí solo no
+ // cierra nada, solo cambia qué campo se puede falsear.
+ const access = await assertOrganizationAccess(request, organizationId)
+ if (!access.ok) return json({ error: access.error }, access.status)
```

El `organizationId` puede seguir viajando en query string o body — no es un secreto, igual que hoy el email no lo es. Lo que **no puede** seguir siendo así es que ese id, por sí solo, sea suficiente para actuar: la prueba de que el usuario pertenece a esa organización viaja en el header `Authorization: Bearer <token>` (nunca en query ni en body) y se verifica en cada request (ver §7.1). Cambiar `email` por `organizationId` sin añadir `assertOrganizationAccess` en el mismo paso deja el endpoint estrictamente más expuesto que hoy, no igual — por eso ambos cambios se tratan como una sola unidad de despliegue (ver también §10, paso 4).

`stripe/webhook.ts` no depende de email ni organizationId en la request (los eventos de Stripe traen el `customer` id), pero si hoy usa el email del Customer para algo (reconciliar factura pagada, etc.) pasa a usar `customer.metadata.organizationId` en su lugar — más robusto porque no depende de que el email no haya cambiado.

## 7. Autorización: no es una limitación aceptable con multi-organización

Los comentarios ya presentes en el código lo dicen explícitamente — por ejemplo en `payment-methods.ts`:

> "Nota de seguridad: [...] la sesión vive en localStorage, así que el email llega del cliente [...] en producción, validar aquí el token contra el backend de auth."

Hoy ese hueco es tolerable-ish porque el peor caso es "un usuario ve su propia facturación con datos de su propio email, potencialmente falseando el query param a otro email — pero Stripe seguiría exigiendo que ese email tenga un Customer real, así que el radio de daño es acotado". **Con organizaciones el peor caso deja de ser acotado**: los `organizationId` no son secretos (aparecen en la URL con `#billing`, en el HTML, en el propio JWT del atacante si pertenece a alguna otra organización) y son predecibles o enumerables si se generan de forma secuencial o poco aleatoria. Sin verificación de pertenencia, cualquier usuario autenticado podría:

- Leer facturas, tarjetas (últimos 4 dígitos, marca, titular) y plan de **cualquier organización**, no solo la suya (IDOR — Insecure Direct Object Reference, el vector más directo aquí).
- Cambiar la tarjeta predeterminada, cancelar la suscripción o eliminar la tarjeta de una organización ajena.
- Iniciar un checkout que cree cargos a nombre del Customer de otra organización.

Esto no es un endurecimiento opcional "para producción" — es un requisito **de este mismo cambio**, porque es el cambio el que convierte un query param inocuo en una llave que abre la puerta de otra empresa.

### 7.1. La pieza buena noticia: el patrón ya existe y ya funciona en este repo

`HttpUserManagementRepository.getAllUsers()` (admin) ya llama al backend real con `Authorization: Bearer <token>`, y `AuthSession`/`CachedSessionPrimitive` (`modules/auth/domain/AuthSession.ts`) ya llevan `token` y `organizationId` en la sesión guardada en `localStorage` (`cached_session`). Es decir: **el JWT real y el organizationId real ya viajan juntos en el cliente hoy**. El único paso que falta es que los endpoints de billing empiecen a exigir y verificar ese token, en vez de confiar en lo que venga en el body/query.

Patrón a replicar en los 10 endpoints de billing (idéntico al que ya usa admin):

```ts
// helper compartido: src/pages/api/_shared/assertOrganizationAccess.ts
export async function assertOrganizationAccess(
  request: Request,
  organizationId: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Falta autenticación.' }
  }
  const token = auth.slice('Bearer '.length)

  // Verificación contra el backend de auth (Amplify), NO decodificar y confiar
  // ciegamente en el JWT sin más: hay que comprobar que el token es válido,
  // no ha expirado y no ha sido revocado. Reutiliza lo que ya hace
  // VerifyCurrentSession / el endpoint de management de admin.
  const organizations = await getVerifiedUserOrganizations(token) // lanza si el token no es válido
  if (!organizations.some((o) => o.id === organizationId)) {
    return { ok: false, status: 403, error: 'No autorizado para esta organización.' }
  }
  return { ok: true }
}
```

Y en cada endpoint, ANTES de tocar Stripe:

```ts
const access = await assertOrganizationAccess(request, organizationId)
if (!access.ok) return json({ error: access.error }, access.status)
```

Detalles que importan y que hoy el código NO hace en ningún endpoint de billing (hay que introducirlos aquí):

- **El token viaja en el header `Authorization`, no en el body ni en query string.** Query strings y bodies acaban en logs de acceso, en el historial del navegador (en GET), en herramientas de proxy/debug — cabecera `Authorization` es lo estándar precisamente para evitar eso. Los endpoints `GET` de billing (`payment-methods.ts`, `invoices.ts`, `subscriptions.ts`) hoy leen el email de `url.searchParams` — eso debe migrar del query string al header, no solo el email a organizationId.
- **El token se verifica contra el backend, no se decodifica y ya está.** `User.fromJwt` hoy decodifica el payload del JWT en cliente sin comprobar firma — es apropiado para "leer claims para pintar UI", pero un endpoint que autoriza una acción de dinero necesita la verificación real (firma + expiración + no revocado), que ya hace el backend de Amplify para otros endpoints (`VerifyCurrentSession`, `admin/management/user`).
- **La comprobación de pertenencia se hace en cada request, no se cachea del lado servidor de forma persistente.** Si a un usuario se le quita de una organización, el siguiente request suyo debe fallar — no vale cachear "es miembro" en una sesión de servidor de larga duración.
- **403 vs 404**: cuando el `organizationId` no pertenece al usuario, se devuelve 403 (o incluso 404 "no encontrado", indistinguible a propósito) — nunca un mensaje que confirme "esa organización existe pero no es tuya", que ya de por sí filtra información de qué ids son válidos.

### 7.2. Amenazas específicas de este cambio y cómo quedan cubiertas

| Amenaza | Vector concreto | Mitigación en este diseño |
|---|---|---|
| IDOR sobre `organizationId` | Cambiar el id en la URL/body de cualquier endpoint de billing | `assertOrganizationAccess` en los 10 endpoints, antes de cualquier llamada a Stripe (§7.1) |
| Suplantación de organización en checkout | Body de `checkout.ts` hoy acepta `userId`/`email` sin verificar — con org, igual pasaría con `organizationId` | Mismo `assertOrganizationAccess`; además el Customer se resuelve por `stripeCustomerId` guardado server-side, nunca por un id que mande el cliente en el body de creación |
| Cross-organization data leak vía Stripe metadata | Si `metadata.organizationId` del Customer se usara para autorizar en vez de solo para auditoría | El metadata de Stripe es *solo* trazabilidad/reconciliación (webhook, soporte); la autorización real vive siempre en el backend propio, nunca se confía en datos que Stripe devuelve como fuente de verificación de acceso |
| Webhook falsificado | Alguien envía un POST a `stripe/webhook.ts` fingiendo un evento | Ya cubierto hoy con `stripe.webhooks.constructEventAsync` + firma — no cambia con este rediseño, pero pasa a resolver la organización vía `customer.metadata.organizationId` en vez de email, así que conviene revalidar que ese metadata se sigue fijando siempre al crear el Customer (si falta, el webhook no debe adivinar la organización por email) |
| Enumeración de organizaciones | Probar ids secuenciales/incrementales contra `assertOrganizationAccess` para ver cuáles devuelven 403 vs 404 | Usar el mismo código de error para "no existe" y "no es tuya" (ver §7.1); si el backend usa ids no aleatorios (autoincrementales), valorar rate-limiting en estos endpoints — no es específico de billing, pero billing es donde más duele que funcione |
| Escalado dentro de la propia organización (miembro sin permisos de facturación) | `ManagedUser.organizations` dice que perteneces, pero no dice con qué rol — un editor de `Team` no debería poder cancelar la suscripción de la organización | `assertOrganizationAccess` debe comprobar rol, no solo pertenencia: reusar `roleIds`/rol de `TeamMember` para exigir `owner`/`admin` en las acciones destructivas o de cobro (cancelar, cambiar tarjeta, eliminar tarjeta, cambiar de plan); lectura (ver facturas/plan) puede ser más laxa si el negocio lo permite, pero eso es una decisión explícita, no un descuido |
| Manipulación de importes desde cliente | El checkout ya se protege — `createCheckout.execute` resuelve precios en servidor desde `price_...` de entorno, el total del cliente no se usa | Sin cambios; se mantiene igual con organizationId |
| Robo de tarjeta ajena vía `remove`/`setDefault` con id de PaymentMethod válido pero de otra org | Un atacante conoce o adivina un `paymentMethodId` de Stripe (`pm_...`, difícil de adivinar pero no imposible de filtrar por otro bug) y lo manda junto a SU `organizationId` autorizado | Ya cubierto por el propio diseño de §4.1: `resolveCustomerId` siempre parte del `stripeCustomerId` de la organización verificada, y `stripe.paymentMethods.list({ customer: stripeCustomerId })` solo devuelve tarjetas de ESE Customer — un `paymentMethodId` ajeno simplemente no aparece en esa lista y el repo debe tratarlo como `PaymentMethodNotFoundError`, igual que hace hoy `StripePaymentMethodRepository.setDefault`/`remove` verificando "owns" antes de actuar. Importante: mantener esa comprobación de pertenencia explícita incluso cuando ya no hace falta el bucle de `customers.list` — no pasar el `paymentMethodId` directo a Stripe sin comprobar antes que está en la lista del Customer resuelto |

### 7.3. Qué NO hacer (errores fáciles de cometer al implementar esto)

- **No** derivar el `organizationId` "de confianza" del propio JWT sin cruzarlo contra la lista de organizaciones del usuario — un JWT viejo cacheado, o un claim mal formado, no debe bastar por sí solo.
- **No** dejar el fallback de "buscar por email" (mencionado en §10, paso 6) activo indefinidamente una vez arrancado el backfill — mientras exista, sigue siendo el `stripe.customers.list({ email })` que hoy agrega Customers de varias organizaciones bajo el mismo email; conviene ponerle fecha de caducidad, no dejarlo "por si acaso".
- **No** loguear el JWT completo ni el `stripeCustomerId` en claro en logs de aplicación (sí el `organizationId`, que no es secreto) — mismo criterio que ya sigue el código actual de no filtrar detalles internos de Stripe al cliente (`console.error` con mensaje genérico hacia fuera).
- **No** confiar en que el frontend oculte el selector de organización como control de acceso — ocultar en UI (`AccountShell.tsx`) es UX, no seguridad; el backend debe rechazar igualmente aunque alguien llame al endpoint directamente con `curl`.

## 8. Cambios en UI (`AccountShell.tsx`)

Hoy `BillingSection` recibe `email: string` y todo cuelga de ahí. Pasa a recibir `organizationId: string`, con un selector de organización nuevo (reutilizando el patrón que `TeamSection` ya tiene con `selectedOrg`/`onSelectOrg` y el `<select>` de `org-select__input` — es literalmente el mismo componente que gestiona ya `TeamSection`, solo que hoy no controla qué organización de facturación está activa).

Concretamente:

- `AccountShell` mantiene un `selectedBillingOrg` (puede compartir estado con `selectedOrg` de Team, o ser independiente si se quiere permitir ver el team de una organización y facturar de otra — decisión de producto, no técnica).
- El `useEffect` que carga `subscriptions`, `paymentMethods`, `invoices` pasa de depender de `currentUser.email` a depender de `selectedBillingOrg`. Si el usuario cambia de organización en el selector, se recarga esa tripleta (patrón idéntico al `refreshSubscriptions`/`refreshPaymentMethods` que ya existe, solo que ahora también se dispara al cambiar de organización, no solo tras una acción).
- Si el usuario solo pertenece a una organización, el selector no se muestra (mismo criterio que ya aplica hoy a nav: no añadir fricción cuando no hay elección real).
- Si el usuario no pertenece a ninguna organización (cuenta personal sin organización asociada) — a decidir con producto si esto existe como caso válido o si toda cuenta se crea con una organización personal implícita. Recomendación: crear siempre una organización personal implícita al registrarse, para no tener que ramificar toda la UI de billing en "con org / sin org".

## 9. Migración de datos existentes

Este es el punto que no es solo código. Hoy en Stripe, cada Customer está identificado por email, potencially con varios Customers por email (el propio código de `StripePaymentMethodRepository.listByEmail` contempla `customers.list({ email, limit: 10 })`, es decir, ya asume que puede haber más de uno).

Pasos:

1. **Inventario**: por cada email con Customers en Stripe, listar a qué organización(es) pertenece ese email hoy (según el backend Amplify/`ManagedUser.organizations`).
2. **Caso simple (email → 1 organización, 1 Customer)**: asignar `stripeCustomerId` = ese Customer a esa organización. Sin tocar Stripe.
3. **Caso ambiguo (email → N organizaciones, o N Customers)**: aquí no hay forma automática de saber qué tarjeta/suscripción pertenece a qué organización, porque esa información **nunca se guardó** — es exactamente el problema que se está corrigiendo. Requiere:
   - o revisión manual caso por caso (viable si son pocos usuarios/organizaciones — plausible en una fase temprana del producto),
   - o asumir la organización "principal" de cada usuario y dejar que el resto empiece de cero (sin tarjeta, tendrán que añadirla),
   - o campaña de comunicación pidiendo a los usuarios afectados que verifiquen/reintroduzcan su tarjeta.
   
   Esta decisión es de negocio, no técnica — depende de cuántas cuentas están en este caso ambiguo hoy. Antes de ejecutar el resto del plan conviene correr esa consulta y saber si son 3 cuentas o 300.
4. **Script de backfill** (`scripts/backfill-organization-stripe-customer.ts`, fuera del código de producción): recorre las organizaciones del backend Amplify, resuelve su Customer según el paso 2/3, y hace un `PATCH` al backend para persistir `stripeCustomerId`. Se corre una vez, con dry-run primero (loguear qué haría, sin escribir) — dado que toca datos de facturación reales, no se ejecuta sin revisión manual del dry-run.

## 10. Orden de implementación sugerido

No es necesario (ni conviene) hacer esto en un solo cambio grande. Orden con el que cada paso deja el sistema funcional:

1. **Backend Amplify**: añadir `stripeCustomerId` a `Organization` y el endpoint/claim para "organizaciones del usuario actual". Sin esto no se puede avanzar en este repo.
2. **Dominio**: extender `Organization`, cambiar firmas de las interfaces de billing (`IPaymentMethodRepository`, etc.) de `email` a `organizationId`. Esto rompe compilación en cascada — bien, así no se puede olvidar ningún sitio (TypeScript hace de checklist).
3. **Infraestructura Stripe**: implementar `resolveCustomerId` y adaptarlo en los cuatro repos/gateways de Stripe.
4. **Endpoints `/api/*`**: cambiar `email` por `organizationId` **y** añadir `assertOrganizationAccess` en el mismo commit/PR — no son dos pasos, es una sola unidad de despliegue (§6, §7.1). Desplegar el rename sin el check deja el sistema con un IDOR real, aunque sea por poco tiempo.
5. **UI**: selector de organización en `BillingSection` + repos HTTP de cliente. Los repos `Http*Repository` de cliente (`HttpPaymentMethodRepository`, etc.) añaden el header `Authorization: Bearer <token>` a cada fetch, leyendo el token de `AuthSession`/`cached_session` — mismo patrón que ya usa `HttpUserManagementRepository.getAllUsers`. Sin esto, el backend del paso 4 rechazaría todas las llamadas con 401.
6. **Migración de datos**: correr el backfill (paso 9) ANTES de apagar el fallback "buscar por email" — mientras conviven ambos, un backfill incompleto no rompe nada porque el fallback de creación de Customer sigue funcionando (crea uno nuevo si no encuentra `stripeCustomerId`, ver §4.1). Cuando el backfill esté verificado al 100%, se puede quitar el fallback y dejar solo el path por `stripeCustomerId`.

## 11. Qué NO cambia

- El módulo `team` (`Team`, `TeamMember`) ya modela organizaciones y asientos — no hace falta tocarlo, billing pasa a *usar* `organizationId` del mismo espacio de ids, no a duplicar el concepto.
- La estructura de capas (`domain/application/infrastructure`) del módulo `billing` no cambia; es un cambio de firma y de query, no de arquitectura.
- Los componentes `Button`, `Modal` y el resto de UI compartida no cambian.
- El webhook de Stripe no cambia de forma (sigue siendo un único endpoint), solo cambia qué campo usa para reconciliar (`metadata.organizationId` en vez de email).
