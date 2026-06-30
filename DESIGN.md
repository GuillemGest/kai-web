# KAI — Sistema de diseño (web de ventas)

Tokens y reglas extraídos del **UI Style Guide de KAI**. La web de ventas reutiliza el
sistema de diseño del producto (no su layout de app: sidebar + chat + editor).

Los tokens viven como CSS custom properties en [`src/ui/styles/globals.css`](src/ui/styles/globals.css).
Esta web es **solo dark mode**.

## Referencias visuales (norte de la web de ventas)

Dos competidores directos del nicho (edición audiovisual con IA, dark, B2B pro) marcan
el listón. El objetivo: que la web **no se sienta plana** — que tenga movimiento, ritmo y
profundidad sin perder la identidad de KAI (dark con intención, accent cian solo en
interacción, sin clichés de "landing de IA").

| Referencia | Qué robar |
|---|---|
| [quickture.com](https://www.quickture.com/) | El **producto en movimiento como héroe**: el demo manda, no un bloque de texto. Limpieza pro y prueba de credibilidad (logos de clientes) sin recargar. |
| [getjumper.io](https://getjumper.io/) | El **ritmo**: secciones full-bleed que alternan con bloques de contenido, composición asimétrica, profundidad por elevación sutil (no efectos exagerados). |

Lo que estas referencias resuelven y hoy nos falta — **movimiento, ritmo y profundidad**:

### Movimiento (con intención, no decoración)

- **El producto se mueve.** El héroe es el demo de KAI en acción (vídeo/loop o secuencia
  real metraje → clips), no una caja estática. Es la prueba del ahorro, viva.
- **Reveal por sección al hacer scroll.** Cada sección entra con un fade + leve subida al
  aparecer en viewport. Realza un contenido **ya visible por defecto** (nunca gatea la
  visibilidad con una clase; si no, en renders sin JS la sección sale en blanco).
- **El reveal se adapta a lo que revela** (no el mismo gesto idéntico en cada sección).
  Stagger dentro de una lista sí; reflejo uniforme en todo, no.
- **Micro-interacción en lo accionable**: botones, cards de canal, items de lista responden
  al hover (puntero fino) y al `:active` (táctil).
- Easing solo con curvas de salida exponencial (`--ease-out-quart` / `--ease-out-expo`).
  Sin bounce ni elastic. Toda animación con alternativa en `prefers-reduced-motion`.

### Profundidad / capas (no todo al mismo plano)

- **Jerarquía de elevación** con las superficies por opacidad ya definidas
  (`--surface` 5% → `--surface-2` 10% → `--surface-strong` 20%) y `--bg-elevated` para los
  cierres (CTA, footer). El fondo base, las superficies y lo elevado deben distinguirse.
- **Glow de marca puntual**: un `radial-gradient` suave con `--accent` muy diluido detrás
  del media del héroe da profundidad sin caer en glassmorphism decorativo (ya usado en
  `.hero__media`). Reservado a momentos clave, no de fondo en cada sección.
- **Sombras contenidas**: si se usan, blur ≤ 8px. Nunca `border 1px` + sombra ancha (≥16px)
  en el mismo elemento (patrón "ghost-card" prohibido). Elegir borde **o** sombra.

### Ritmo / contraste visual (romper la uniformidad)

- **Alternar anchos**: secciones full-bleed (que rompen `--content-max`, con su propio
  fondo o borde) intercaladas con bloques de contenido centrado. El home ya lo hace
  (`.hero`, `.demo` a sangre completa vs `.features`/`.faq` en contenedor); extenderlo.
- **Composición asimétrica**: rejillas tipo `1.05fr / 1fr`, no 50/50 simétrico por defecto.
- **Variar el espaciado vertical** entre secciones con `clamp()` (agrupaciones tensas vs
  separaciones generosas), para crear cadencia en lugar de un goteo uniforme de bloques.
- **Una idea dominante por fold.** Menos secciones, más firmes (principio "Menos, pero
  firme" del PRODUCT.md).

> Estas reglas son la traducción de las referencias a KAI; **no** copiar su layout ni su
> paleta. La identidad (tokens, accent solo interacción, tipografía) manda siempre.

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
