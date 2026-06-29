# KAI — Sistema de diseño (web de ventas)

Tokens y reglas extraídos del **UI Style Guide de KAI**. La web de ventas reutiliza el
sistema de diseño del producto (no su layout de app: sidebar + chat + editor).

Los tokens viven como CSS custom properties en [`src/ui/styles/globals.css`](src/ui/styles/globals.css).
Esta web es **solo dark mode**.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#2B2B2B` | Fondo base de la app |
| `--bg-elevated` | `#1E1E1E` | Elementos elevados, tooltips |
| `--fg` | `#FFFFFF` | Texto / foreground |
| `--accent` | `#4CBDCA` | **Solo interacción** (botón primario, links, item activo, focus ring) |
| `--success` | `#3DD68C` | Confirmaciones |
| `--warning` | `#F4A261` | Advertencias |
| `--error` | `#e94545` | Errores / destructivo |
| `--info` | `#5BC0F8` | Información |

**Superficies por opacidad sobre `--fg`**, nunca colores directos:
`--surface` (5%), `--surface-2`/`--surface-sidebar` (10%), `--surface-strong` (20%), `--overlay` (80%).

> En light mode (no usado aquí) el accent sería `#30A4AC`.

## Espaciado — retícula de 8px

`4 · 8 · 16 · 24 · 32 · 40 · 48 · 64 · 80` → `--space-1 … --space-9`.
**Todo espaciado es múltiplo de 8px. Sin excepciones** (4px solo para ajustes finos).

## Border-radius

`--r-sm 4px` (compactos) · `--r-md 8px` (estándar) · `--r-lg 16px` (contenedores/modales) · `--r-full 999px`.

## Tipografía

Única familia: **Plus Jakarta Sans**. Solo pesos **400** y **700**.

| Rol | Font | Uso |
|---|---|---|
| TITLE | 700 24/32 | Títulos de pantalla |
| BODY | 400 16/24 | Texto principal |
| UI | 700 14/20 | Navegación, listas |
| SECONDARY | 700 12/16 | Metadatos (≤60% opacidad) |
| ACTION | 700 16/24 | Botones |
| CODE | 700 12/16 mono | Datos técnicos (única excepción a la fuente) |

## Botones

Variantes: **Primary · Secondary · Ghost · Destructive**. Tamaños: 24 / 32 (default) / 40 / icon-32.
- **Solo un Primary por vista.**
- Orden de acciones: **Ghost → Secondary → Primary** (primary a la derecha).
- Acciones destructivas **siempre** requieren confirmación.

## Iconos

Librería **Lucide** (`lucide-react`). Stroke 1px general / 2px destacado. Tamaños 12/16/24px.
No mezclar grosores dentro del mismo grupo.

## Modales

Overlay (`--overlay`) bloquea el scroll del body · ESC cierra · foco atrapado · footer alineado a la derecha · radius 16px.

---

## Modelo de datos (futura BD en Supabase)

Pensado para trasladarse a Supabase como migraciones SQL (cada cambio = migración versionada).
Hoy implementado con repositorios **InMemory** (datos mock) en `src/modules/*/infrastructure/`.

| Tabla | Campos | Notas |
|---|---|---|
| `users` | id, email, name, created_at | Credenciales las gestiona Supabase Auth |
| `products` | id, slug, name, description | El plugin KAI |
| `plans` | id, name, price_month, currency, features[], stripe_price_id | Suscripción mensual |
| `subscriptions` | id, user_id, plan_id, status, current_period_end, stripe_subscription_id | |
| `download_builds` | id, product_id, os, version, file_url, released_at | Builds por SO |
| `support_articles` | id, slug, title, body, category | |

Las entities del dominio reflejan estas formas con interfaces `XPrimitive` para
`fromPrimitive`/`toPrimitive`. Cuando se enchufe Supabase, se añade `SupabaseXRepository`
en `infrastructure/` sin tocar UI ni use cases.
