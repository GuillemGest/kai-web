# Esquema de Base de Datos — KAI

> Diseño relacional para KAI (usuarios, organizaciones, planes, permisos y servidores).
> Motor: SQL estándar (portable a PostgreSQL / MySQL). Las notas indican dónde Postgres ofrece
> alternativas mejores (ENUM nativo, JSONB, arrays).

---

## 1. Decisiones de diseño

| Tema | Decisión |
|------|----------|
| **Multi-tenant** | Un usuario puede pertenecer a **varias organizaciones** (M:N vía `user_organization`). |
| **Dos ejes de permisos** | (1) **Plan** → qué *puede* la organización (límites cuantitativos). (2) **Rol** → qué *puede hacer* cada usuario dentro de la org. El permiso efectivo es la **intersección** de ambos. |
| **Plan por usuario (seats)** | La org paga un plan **por cada usuario**; se guarda `quantity` (nº de asientos) en la suscripción. |
| **Límites de plan flexibles** | Los límites (nº de modelos, qué modelos, tamaño total de vídeo, nº de mensajes) NO son columnas fijas: viven en `plan_limit` (clave-valor) para poder cambiarlos sin `ALTER TABLE`. |
| **Permisos de rol modificables** | `permission` + `role_permission` (tablas), no columnas booleanas. Añadir/quitar un permiso = un `INSERT`/`DELETE`. |
| **Roles fijos del sistema** | `owner`, `admin`, `operator`, `viewer` (globales, definidos por KAI). |
| **Historial de suscripción** | La org tiene su plan actual, pero `subscription` conserva el histórico (fechas + estado Stripe). |
| **Servidor** | Un server aloja **N organizaciones** (1:N). Flag `remote_server` distingue remoto (gestionado) vs local/dedicado. |
| **Modelos** | Catálogo `model` (los modelos de procesado de vídeo). El plan define **cuántos** y **cuáles** puede usar la org (`plan_model`). |

---

## 2. Tablas

### `users`
El usuario global (una sola cuenta, puede estar en varias orgs).

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `user_id` | UUID / BIGINT | **PK** | Identificador global. |
| `email` | VARCHAR(255) | **UNIQUE, NOT NULL** | Login. |
| `name` | VARCHAR(255) | NOT NULL | Nombre visible. |
| `password_hash` | VARCHAR(255) | NULL | Null si usa SSO (ver `docs/sso-kai.md`). |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

### `organization`
La organización (tenant). Tiene un server y un plan actual.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `organization_id` | UUID / BIGINT | **PK** | |
| `name` | VARCHAR(255) | NOT NULL | `org_name` del borrador. |
| `current_plan_id` | BIGINT | **FK → plan.plan_id**, NULL | Plan activo (denormalizado para lectura rápida; la fuente de verdad es `subscription`). |
| `server_id` | BIGINT | **FK → server.server_id**, NULL | Server que la aloja (opcional hasta asignarse). |
| `stripe_account_id` | VARCHAR(255) | NULL | ID de cliente/cuenta en Stripe. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

### `user_organization`
Tabla puente M:N. Aquí vive el **rol** del usuario **dentro de cada org**.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `user_id` | UUID/BIGINT | **PK, FK → users.user_id** | |
| `organization_id` | UUID/BIGINT | **PK, FK → organization.organization_id** | |
| `role_id` | BIGINT | **FK → role.role_id**, NOT NULL | Rango del usuario en ESTA org. |
| `um_chat` | BOOLEAN | DEFAULT false | Flag del borrador (¿acceso a chat UM?). Revisar si sigue haciendo falta con el sistema de permisos. |
| `joined_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

> PK compuesta `(user_id, organization_id)`: un usuario tiene **un** rol por organización, pero distinto en cada una.

---

### `role`
Roles fijos del sistema (globales). Semilla: `owner`, `admin`, `operator`, `viewer`.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `role_id` | BIGINT | **PK** | |
| `code` | VARCHAR(50) | **UNIQUE, NOT NULL** | `owner` / `admin` / `operator` / `viewer`. |
| `name` | VARCHAR(100) | NOT NULL | Nombre visible. |
| `hierarchy_level` | SMALLINT | NOT NULL | Para comparar rangos (owner=100, admin=75, operator=50, viewer=10). |

---

### `permission`
Catálogo de permisos **granulares de rol**. Ampliable con un `INSERT`.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `permission_id` | BIGINT | **PK** | |
| `code` | VARCHAR(50) | **UNIQUE, NOT NULL** | Ver semilla abajo. |
| `description` | VARCHAR(255) | NULL | |

**Semilla inicial (genérica, modificable cuando se definan):**
`upload`, `download`, `chat`, `marker`, `logger`, `training`, `manage_users`, `manage_billing`, `manage_settings`, `view_only`.

---

### `role_permission`
Qué permisos tiene cada rol (M:N). **Este es el punto que editas** para cambiar qué aporta cada rol.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `role_id` | BIGINT | **PK, FK → role.role_id** |
| `permission_id` | BIGINT | **PK, FK → permission.permission_id** |

---

### `plan`
Catálogo de planes. El precio es **por usuario** (seat).

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `plan_id` | BIGINT | **PK** | |
| `code` | VARCHAR(50) | **UNIQUE, NOT NULL** | `free`, `basic`, `pro`... |
| `name` | VARCHAR(100) | NOT NULL | |
| `price_per_seat` | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Precio por usuario/mes. |
| `stripe_price_id` | VARCHAR(255) | NULL | Price de Stripe. |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Para retirar planes sin borrarlos. |

---

### `plan_limit`
**Límites cuantitativos del plan**, en formato clave-valor para máxima flexibilidad.
Así cambias un límite sin tocar el esquema.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `plan_id` | BIGINT | **PK, FK → plan.plan_id** | |
| `limit_key` | VARCHAR(50) | **PK** | Ver claves abajo. |
| `limit_value` | BIGINT | NOT NULL | -1 = ilimitado (convención). |

**Claves iniciales:**
| `limit_key` | Significado | Ejemplo (free) |
|-------------|-------------|----------------|
| `max_models` | Nº máx. de modelos usables | 1 |
| `max_video_total_bytes` | Tamaño total de vídeo procesable | 5 GB |
| `max_messages` | Nº máx. de mensajes/requests | 100 |
| `max_seats` | Nº máx. de usuarios (opcional) | 3 |

> Alternativa en Postgres: una única columna `limits JSONB` en `plan`. Se ha preferido tabla
> clave-valor por ser portable y consultable con SQL puro.

---

### `model`
Catálogo de modelos de procesado de vídeo.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `model_id` | BIGINT | **PK** | |
| `code` | VARCHAR(50) | **UNIQUE, NOT NULL** | |
| `name` | VARCHAR(100) | NOT NULL | |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | |

---

### `plan_model`
Qué modelos concretos habilita cada plan (M:N). Cubre el "cuáles puedes usar".
El "cuántos" lo limita `plan_limit.max_models`.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `plan_id` | BIGINT | **PK, FK → plan.plan_id** |
| `model_id` | BIGINT | **PK, FK → model.model_id** |

---

### `subscription`
Historial de suscripciones de una org (facturación Stripe). La actual es la de estado `active`.

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `subscription_id` | BIGINT | **PK** | |
| `organization_id` | BIGINT | **FK → organization.organization_id**, NOT NULL | |
| `plan_id` | BIGINT | **FK → plan.plan_id**, NOT NULL | |
| `quantity` | INT | NOT NULL, DEFAULT 1 | Nº de seats pagados. |
| `status` | VARCHAR(30) | NOT NULL | `active`, `past_due`, `canceled`, `trialing`... (estados Stripe). |
| `stripe_subscription_id` | VARCHAR(255) | NULL | |
| `current_period_start` | TIMESTAMP | NULL | |
| `current_period_end` | TIMESTAMP | NULL | |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |
| `canceled_at` | TIMESTAMP | NULL | |

---

### `server`
Servidores que alojan organizaciones (1 server → N orgs).

| Columna | Tipo | Restricciones | Notas |
|---------|------|---------------|-------|
| `server_id` | BIGINT | **PK** | |
| `remote_server` | BOOLEAN | NOT NULL, DEFAULT true | true = remoto/gestionado por KAI; false = local/dedicado del cliente. |
| `ip` | VARCHAR(45) | NULL | Soporta IPv6. Postgres: tipo `INET`. |
| `hostname` | VARCHAR(255) | NULL | Opcional. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT now() | |

---

## 3. Relaciones (resumen)

```
users ─┐
       └─< user_organization >─ organization ─> server (N:1)
              │                       │
              └─> role                └─> plan (current)  <── subscription (histórico)
                    │                         │
                    └─< role_permission >─ permission     ├─< plan_limit
                                                          └─< plan_model >─ model
```

- `users` **N:M** `organization` → vía `user_organization` (con `role_id`).
- `role` **N:M** `permission` → vía `role_permission`.
- `plan` **1:N** `plan_limit` (límites clave-valor).
- `plan` **N:M** `model` → vía `plan_model`.
- `organization` **1:N** `subscription`; la org referencia su plan actual (`current_plan_id`).
- `server` **1:N** `organization`.

---

## 4. Cómo se calcula el "permiso efectivo"

Para saber si el usuario **U** puede hacer la acción **A** en la organización **O**:

1. **Eje rol**: ¿el `role` de U en O (vía `user_organization`) tiene el `permission` A (vía `role_permission`)?
2. **Eje plan**: ¿el plan activo de O (vía `subscription.status = 'active'`) permite A según sus `plan_limit` / `plan_model`?
3. **Efectivo** = (1) **AND** (2).

> Ejemplo: un `operator` con permiso `training` no podrá entrenar si el plan de su org no incluye el modelo o ha superado `max_models`.

---

## 5. Datos semilla sugeridos

**roles**
| code | name | hierarchy_level |
|------|------|-----------------|
| owner | Propietario | 100 |
| admin | Administrador | 75 |
| operator | Operador | 50 |
| viewer | Invitado | 10 |

**role_permission (propuesta inicial, ajustable):**
- `owner`: todos los permisos.
- `admin`: todo menos `manage_billing`.
- `operator`: `upload`, `download`, `chat`, `marker`, `logger`, `training`.
- `viewer`: `view_only`, `chat`.

---

## 6. Puntos abiertos / a revisar cuando se definan

- [ ] Confirmar los permisos de rol definitivos (la semilla es genérica).
- [ ] Decidir si `um_chat` en `user_organization` sigue siendo necesario o se absorbe en `permission`.
- [ ] Confirmar unidades de `max_video_total_bytes` (bytes vs GB) y si es por periodo o acumulado.
- [ ] Definir si los `plan_limit` se cuentan por org o por seat.
- [ ] `stripe_account_id` en org: ¿es customer (`cus_...`) o connected account (`acct_...`)? Renombrar según corresponda.
