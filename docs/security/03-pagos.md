# 03 · Seguridad del flujo de pago (Stripe Checkout)

Estado de referencia para el checkout (`/checkout` → `/api/checkout` →
Stripe Checkout → webhook → `/checkout/gracias`) y los endpoints de
facturación. Parte de una buena base (ver README) pero tiene gaps que hay que
cerrar antes del modo live.

## 1. Principios ya aplicados (mantener siempre)

- **Precios en servidor.** `CreateCheckoutSession` resuelve las líneas de
  cobro desde los `price_...` de entorno; el cliente solo envía `planId`,
  `period` y `seats`, y sus máximos se validan contra el dominio. Ninguna
  cantidad/importe del cliente se usa jamás. Cualquier cambio futuro debe
  conservar esta propiedad (p. ej. cupones: validarlos y aplicarlos en
  servidor).
- **Stripe Checkout alojado.** Los datos de tarjeta nunca tocan nuestro
  servidor ni nuestro JS ⇒ alcance PCI DSS mínimo (SAQ A). No cambiar a
  campos de tarjeta propios sin re-evaluar todo el cumplimiento PCI.
- **Webhook con firma verificada** sobre el body en crudo, y errores internos
  sin filtrar al cliente.

## 2. Autenticación del checkout (gap G4)

`/api/checkout` acepta hoy `userId` del body — cualquiera puede iniciar un
checkout "a nombre de" otro usuario. Con el modelo del doc 02:

- El endpoint exige sesión (cookie httpOnly) y deriva `userId` y email de
  ella. El body queda reducido a `planId`, `period`, `seats`,
  `billingDetails`, `locale`.
- Verificar el estado del usuario antes de cobrar: cuenta confirmada, sin
  suscripción activa duplicada del mismo producto (o definir explícitamente el
  upgrade/downgrade como caso aparte).
- `client_reference_id` y `metadata.userId` de la sesión de Stripe se rellenan
  con el userId **derivado de la sesión**, porque el webhook los usará como
  vínculo autoritativo usuario↔pago.

## 3. Webhook (gaps G6)

El webhook es **la única fuente de verdad** del estado de pago. Reglas:

### 3.1 Verificación y procesado

- Firma verificada (ya ✅) con tolerancia de timestamp por defecto (protege de
  replay de payloads antiguos).
- **Idempotencia**: Stripe reintenta y puede duplicar. Registrar `event.id`
  procesados (tabla `processed_events` con unique) y descartar repetidos antes
  de ejecutar efectos.
- **Responder 2xx rápido** y hacer el trabajo pesado en cola si crece; si se
  responde 5xx Stripe reintenta (bien para fallos transitorios, mal si el
  handler no es idempotente).
- No confiar en el orden de llegada de eventos: decidir contra el estado
  actual del objeto (releer la subscription de la API de Stripe si hay duda),
  no contra el orden temporal de los webhooks.

### 3.2 Eventos mínimos a manejar

| Evento | Acción |
| --- | --- |
| `checkout.session.completed` | Si `payment_status == 'paid'`: activar la suscripción del `client_reference_id`. Si es `unpaid` (métodos asíncronos), esperar al siguiente evento. |
| `checkout.session.async_payment_succeeded` / `_failed` | Activar / marcar fallo para pagos diferidos. |
| `invoice.paid` / `invoice.payment_failed` | Renovaciones: extender o marcar impago (dunning). |
| `customer.subscription.updated` / `deleted` | Reflejar cambios de plan, cancelaciones, fin de periodo. |

- Validar la **coherencia del evento** antes de activar: el `price`/producto
  del line item corresponde al plan que se activa; moneda esperada. No activar
  "lo que diga el evento" sin contrastarlo con el catálogo propio.
- Registrar auditoría de cada transición de estado de suscripción.

## 4. Página de éxito (gap G8)

`/checkout/gracias?session_id=...` es UX, no verdad:

- En servidor (SSR), recuperar la Checkout Session con la clave secreta
  (`stripe.checkout.sessions.retrieve(session_id)`) y comprobar
  `payment_status` antes de mostrar "pago completado"; si no, mostrar "pago en
  proceso".
- Aunque se falsee la URL, el acceso al producto NUNCA se concede aquí: solo
  el webhook activa. La página, como mucho, refleja estado.
- No imprimir en la página datos sensibles de la sesión (email de terceros,
  importes de otra sesión): validar que la sesión pertenece al usuario logado
  cuando haya sesión en servidor.

## 5. Endpoints de facturación — IDOR (gap G5)

`/api/invoices?email=` y `/api/subscriptions` devuelven hoy datos de
**cualquier** email: enumeración de clientes + fuga de facturas (nombre
fiscal, dirección, importes). Corrección (depende del doc 02):

- Exigir sesión; derivar el email/customer de ella; eliminar el parámetro.
- Mapear usuario→`customer` de Stripe en nuestro lado (guardado al completarse
  el checkout vía webhook) en lugar de buscar por email libre: el email en
  Stripe no es identidad.
- Mientras no exista sesión en servidor, estos endpoints no deben desplegarse
  fuera de entorno de demo.

## 6. Anti-abuso del checkout

- **Rate limiting** en `/api/checkout` (por usuario y por IP): un atacante
  puede usar formularios de pago para **card testing** (probar tarjetas
  robadas), lo que genera disputas y daña la cuenta de Stripe.
- Activar y ajustar **Stripe Radar**; revisar reglas para bloquear patrones de
  card testing (muchos intentos, BINs variados).
- CAPTCHA si se detecta abuso sostenido.
- **Claves API**: usar clave secreta con el mínimo alcance posible (restricted
  keys para servicios auxiliares), separación test/live estricta, rotación
  ante sospecha (doc 02 §7).

## 7. Datos personales y cumplimiento

- **PCI**: con Checkout alojado, no almacenar/loguear jamás PAN, CVC ni datos
  de tarjeta (tampoco llegan — mantenerlo así).
- **RGPD**: los `billingDetails` (nombre fiscal, NIF, dirección) son datos
  personales: minimizar su copia (viven en Stripe como fuente), definir
  retención, incluirlos en el registro de tratamientos, y no volcarlos a logs.
  El log actual del webhook imprime `userId` — aceptable; no ampliar a datos
  fiscales.
- Facturación: el NIF/CIF se valida en el dominio (`BillingDetails`);
  considerar validación VIES para intracomunitarios si aplica IVA inverso.
- Emails de recibo: delegar en Stripe (receipt_email / invoices) para no
  gestionar PII adicional.

## 8. Integridad del flujo en el cliente

- El wizard persiste `billingDetails` en `sessionStorage` — es un dato del
  propio usuario en su navegador: riesgo bajo, aceptable. No persistir ahí
  nunca identificadores de sesión ni datos de pago.
- `success_url`/`cancel_url` se construyen en servidor a partir del origin del
  request: en producción deben salir de la **URL base configurada** (mismo
  razonamiento anti host-header-injection que doc 01 §3.4).
- Redirección a Stripe: usar siempre la URL devuelta por la API
  (`session.url`), nunca construirla en cliente.

## 9. Checklist de salida a producción (pagos)

- [ ] `/api/checkout` autenticado por sesión servidor; `userId` nunca del body.
- [ ] Webhook: dedupe por `event.id`, manejo de eventos async, coherencia precio/plan validada, activación SOLO aquí.
- [ ] Mapeo persistente usuario↔customer/subscription de Stripe alimentado por el webhook.
- [ ] `/checkout/gracias` verifica la sesión con clave secreta y no concede nada.
- [ ] `/api/invoices` y `/api/subscriptions` autenticados y sin parámetros de identidad.
- [ ] Rate limiting + Radar activos; plan de respuesta a card testing.
- [ ] Claves live separadas, con mínimo alcance, fuera del cliente y del repo.
- [ ] Sin PII/fiscales en logs; retención de datos definida.
- [ ] URLs de retorno desde configuración, no derivadas del request.
- [ ] Pruebas del flujo completo con tarjetas de test, incluidos fallo, cancelación, pago asíncrono y webhook duplicado.
