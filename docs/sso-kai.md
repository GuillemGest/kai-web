# Login y SSO para Kai — Propuesta

> Documento de presentación. Va de lo general (qué es SSO) al modelo final de
> Kai: venta a **usuarios sueltos** y a **empresas**, con Kai actuando en un
> **doble rol** de identidad. Incluye implementación, ventajas y limitaciones.

---

## 1. ¿Qué es el SSO (Single Sign-On)?

Esquema de autenticación donde el usuario se loguea **una vez** contra un
proveedor de identidad central y esa sesión le sirve para entrar a **varias
aplicaciones** sin volver a introducir credenciales en cada una.

**Actores:**
- **IdP (Identity Provider)** — quién autentica (verifica quién eres).
- **SP / Relying Party** — cada app que confía en el IdP.
- **Protocolo** — el idioma en que se hablan (OIDC/OAuth o SAML).

**En una frase:** una identidad → varios sitios, logueándote una sola vez.

---

## 2. Dos conceptos que NO hay que confundir

| | Autenticación | Autorización |
|---|---|---|
| Pregunta | ¿Quién eres? | ¿Qué tienes permitido? |
| Quién lo hace | El IdP (Google, Kai o el IdP del cliente) | **Siempre Kai** |

Esta separación es la base de todo: **se delega el "quién eres", pero Kai se
reserva el "qué puedes hacer".**

---

## 3. El doble rol de Kai (la idea central de este documento)

Kai no juega un solo papel de identidad, sino **dos a la vez**, según a quién le
venda:

| Modelo de venta | Quién es el cliente | Kai actúa como | Cómo entra el usuario |
|---|---|---|---|
| **B2C** (usuario suelto) | La persona | **IdP** | Manual o "Continuar con Google" |
| **B2B** (organización) | La empresa | **SP** | SSO corporativo del cliente (SAML/OIDC) |

- Como **IdP**: Kai autentica directamente (login manual + Google). Es el dueño
  de la identidad.
- Como **SP**: Kai **confía** en el IdP de la empresa cliente (su Entra ID, su
  Okta, su Google Workspace). La empresa autentica a sus empleados; Kai solo los
  deja entrar según la suscripción.

**Ambos modelos se venden a la vez.** No hay que elegir.

---

## 4. Contexto de Kai (lo que condiciona la decisión)

| Factor | Valor |
|---|---|
| Usuarios | Individuales (B2C) **y** empleados de empresas cliente (B2B) |
| Producto | Plataforma para clientes con **suscripciones** |
| Venta | **A usuarios sueltos Y a organizaciones** |
| Prioridad nº1 | **Control y seguridad** |

---

## 5. El modelo de datos: todo cuelga de un "tenant"

La forma limpia de soportar B2C y B2B sin duplicar lógica es que **el tenant
(organización) sea siempre la unidad de suscripción**. El usuario suelto es
simplemente **un tenant de una sola persona**.

```
                    ┌──────────────────────────┐
                    │   TENANT / ORGANIZACIÓN   │  ← unidad de suscripción
                    └────────────┬─────────────┘
              ┌──────────────────┼──────────────────┐
              ▼                                      ▼
   ┌────────────────────┐              ┌──────────────────────────┐
   │  Tenant "personal" │              │  Tenant "Empresa X"      │
   │  1 usuario          │              │  N usuarios (empleados)  │
   │  paga él mismo      │              │  paga la empresa         │
   │  entra manual/Google│              │  entran por SSO corp.    │
   └────────────────────┘              └──────────────────────────┘
```

**Por qué así:** el resto de Kai (permisos, facturación, límites del plan) nunca
tiene que preguntarse "¿esto es B2C o B2B?" — siempre trabaja contra un tenant.
Solo cambia *cómo se creó* ese tenant y *cómo entran* sus usuarios.

> ⚠️ Si en vez de esto se tratan los usuarios B2C como "sin organización" y los
> B2B como "con organización" por caminos separados, se acaba duplicando la
> lógica de facturación y permisos en dos sitios → peor para escalar.

---

## 6. Cómo funciona el login (los dos flujos)

```
   ENTRADA                          NÚCLEO DE KAI              RESULTADO
   ───────                          ─────────────              ─────────

── B2C (usuario suelto) ──────────────────────────────────────────────────
   Email + contraseña ──┐
   (manual)             │
                        ├──►  ┌───────────────────────┐
   Continuar con Google │     │  AUTH CENTRAL DE KAI  │
   (OIDC) ──────────────┘────►│  Kai ES el IdP:       │──┐
                              │  autentica y crea      │  │
                              │  la sesión Kai         │  │
                              └───────────────────────┘  │
                                                          │
── B2B (empleado de empresa) ─────────────────────────────┤
   "Entrar con SSO       ┌───────────────────────┐        │
    de mi empresa" ─────►│  IdP del CLIENTE       │        │
                         │  (Entra ID/Okta/       │        │
                         │   Workspace) autentica │        │
                         └───────────┬───────────┘        │
                              token firmado               │
                                     ▼                     │
                         ┌───────────────────────┐        │
                         │  Kai ES el SP:         │────────┤
                         │  valida y confía       │        │
                         └───────────────────────┘        │
                                                          ▼
                                        ┌───────────────────────────┐
                                        │  Sesión única Kai +        │
                                        │  AUTORIZACIÓN (rol/plan)   │
                                        │  → entra a todas las apps  │
                                        └───────────────────────────┘
```

Kai enruta según el **dominio del email** o la puerta que use el usuario: si el
dominio pertenece a una empresa con SSO configurado → al IdP del cliente; el
resto → manual/Google.

**Kai nunca ve la contraseña del empleado B2B.** La gestiona la empresa; Kai solo
recibe una confirmación firmada de "este usuario es legítimo y es de Empresa X".

---

## 7. Cómo se implementa (lo que hay que construir)

### 7.1. Multi-tenancy
Concepto de **organización/tenant** con: su suscripción, su configuración SSO y
sus usuarios. La facturación cuelga siempre del tenant.

### 7.2. Kai como IdP (lado B2C) — ya definido antes
- Login **manual** (email + contraseña propia de Kai).
- Login **social** con **Google** (OIDC). Microsoft/Apple = ampliación futura.
- Un **auth central único**: sea cual sea la vía, emite la misma sesión Kai
  válida para todas las apps del ecosistema.

### 7.3. Kai como SP (lado B2B) — lo nuevo
- Soportar **SAML 2.0** (lo pedirán las empresas grandes: Okta, Entra ID, ADFS…)
  y/o **OIDC** (el moderno; ya se usa para Google).
- **JIT provisioning** (Just-In-Time): cuando un empleado entra por primera vez
  vía su SSO, Kai le crea la cuenta automáticamente. La empresa no da de alta a
  nadie a mano.
- **SCIM**: protocolo para que el IdP del cliente **sincronice** altas/bajas con
  Kai. Si RRHH despide a alguien en su directorio, SCIM le quita el acceso a Kai
  automáticamente. Esto es lo que hace que "la empresa se lo organice sola".

### 7.4. Recomendación práctica
Montar SAML + SCIM + multi-tenant de SSO **a mano** es costoso y lleno de casos
borde de seguridad. Conviene valorar un servicio de **Enterprise-SSO-as-a-service**
(WorkOS, Auth0/Okta, Stytch, Clerk…): dan SAML/OIDC/SCIM/multi-tenant listos vía
API. Para vender a empresas suele salir más rentable que construirlo desde cero,
sobre todo con la prioridad de seguridad.

---

## 8. Clasificación técnica (a qué tipo de SSO pertenece)

Kai combina varias categorías porque juega dos roles:

| Nivel | Lado B2C (Kai = IdP) | Lado B2B (Kai = SP) |
|---|---|---|
| **Tipo / arquitectura** | Web-SSO | Enterprise SSO (Kai como SP) |
| **Protocolo** | OpenID Connect + OAuth 2.0 | SAML 2.0 y/o OIDC |
| **Provisioning** | Registro directo | JIT + SCIM |

- ❌ **Kerberos / tarjetas inteligentes** — no aplican (redes internas / hardware).
- **FIM** (identidad federada) — el lado B2B es *parecido* conceptualmente
  (Kai confía en el IdP de otra organización), pero no es una federación mutua
  entre iguales: Kai es SP y el cliente es IdP.

---

## 9. Ventajas (cosas buenas)

- ✅ **Un solo producto, dos mercados** — vendes a individuos y a empresas sin
  mantener dos sistemas separados.
- ✅ **Modelo de datos limpio** — todo cuelga del tenant; facturación y permisos
  no duplican lógica B2C/B2B.
- ✅ **"Que se lo organicen ellos"** — con JIT + SCIM, cada empresa gestiona sus
  propios usuarios desde su directorio; Kai no hace altas/bajas a mano.
- ✅ **Venta B2B más fácil** — soportar el SSO corporativo del cliente es un
  requisito habitual para cerrar contratos con empresas medianas/grandes.
- ✅ **Seguridad delegada** — en B2B, contraseñas y MFA los gestiona el IdP del
  cliente; Kai nunca toca esas credenciales.
- ✅ **A prueba de futuro** — añadir más proveedores (Microsoft, Apple, o el IdP
  corporativo de Gestmusic) es sumar, no rehacer.

---

## 10. Limitaciones (cosas malas / a tener en cuenta)

- ⚠️ **Complejidad enterprise** — SAML, SCIM, JIT y multi-tenant tienen muchos
  casos borde de seguridad. Es la parte más cara de hacer bien (de ahí la
  recomendación de un proveedor especializado).
- ⚠️ **Dos reglas de acceso distintas** — el **B2C es de registro abierto**
  (cualquiera se hace su cuenta), pero el **B2B es cerrado**: solo entran los
  empleados que estén en el directorio de cada empresa cliente. Hay que aplicar
  la regla correcta a cada puerta y no mezclarlas.
- ⚠️ **Cada cliente enterprise es una integración** — cada empresa configura su
  IdP a su manera (certificados, metadata SAML, mapeo de atributos). Da soporte y
  onboarding por cliente.
- ⚠️ **Dependencia del IdP del cliente** — si su Entra ID/Okta cae, sus empleados
  no entran en Kai (aunque Kai esté perfecto). El punto único de fallo se
  traslada al cliente.
- ⚠️ **Peaje de la vía manual (B2C)** — al ofrecer email+contraseña, el auth
  central de Kai asume hasheo fuerte (bcrypt/argon2), recuperación de contraseña,
  verificación de email e idealmente MFA propio. Se paga una vez para todo el
  ecosistema, pero se paga.
- ⚠️ **Facturación por asientos (B2B)** — vender a organizaciones obliga a
  gestionar planes de N asientos, altas/bajas que afectan al cobro, etc. Más
  complejo que cobrar a un usuario suelto.

---

## 11. Decisiones tomadas

1. **Venta dual** ✅ — a usuarios sueltos (B2C) **y** a organizaciones (B2B).
2. **Modelo de datos** ✅ — el **tenant es siempre la unidad de suscripción**; el
   usuario suelto es un tenant de una persona.
3. **B2C: registro abierto** ✅ — cualquiera puede crear cuenta (manual o Google).
4. **B2C: solo Google** ✅ como proveedor social de inicio; manual + Google.
   Account linking (mismo email por manual y por Google) se revisará más adelante.
5. **B2B: Kai como SP** ✅ — confía en el SSO corporativo del cliente, con la
   empresa gestionando sus usuarios (JIT/SCIM).

## 12. Sigue pendiente

- **Protocolo B2B de inicio** — decidir si se arranca con SAML, OIDC o ambos
  (depende de los primeros clientes empresa).
- **¿Construir o comprar el SSO enterprise?** — evaluar proveedor
  (WorkOS/Auth0/Stytch/Clerk) vs. implementación propia.
- **Confirmar IdP corporativo de Gestmusic** — Microsoft 365 o Google Workspace,
  por si en el futuro los empleados entran vía SSO propio.

---

### Resumen de una línea

> **Kai vende a individuos y a empresas con un único modelo: el tenant es la
> unidad de suscripción. Para B2C, Kai es IdP (manual + Google); para B2B, Kai es
> SP que confía en el SSO corporativo del cliente (SAML/OIDC + JIT/SCIM) para que
> cada empresa gestione sus propios usuarios.**
