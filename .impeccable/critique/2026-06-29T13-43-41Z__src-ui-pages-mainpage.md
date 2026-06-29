---
target: src/ui/pages/MainPage
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-06-29T13-43-41Z
slug: src-ui-pages-mainpage
---
⚠️ DEGRADED: single-context (no sub-agents: session policy forbids spawning agents without explicit request)

# Critique — MainPage (home de venta KAI)

**Method:** single-context. Assessment A (design review) y Assessment B (detector CLI + revisión de código) en el mismo contexto. Sin browser automation. Detector escanea markup, no CSS.

## Design Health Score

| # | Heurística | Score | Issue clave |
|---|-----------|-------|------|
| 1 | Visibilidad del estado | 3 | NavLink activo + hover OK; sin estado async (no aplica aún) |
| 2 | Match con el mundo real | 3 | Copy claro; "Producto" como label de `/` choca con logo→inicio |
| 3 | Control y libertad | 3 | Header sticky, logo a inicio, rutas claras |
| 4 | Consistencia y estándares | 4 | Design system muy coherente |
| 5 | Prevención de errores | n/a | Sin inputs en la home |
| 6 | Reconocimiento vs. recuerdo | 3 | Nav con labels de texto |
| 7 | Flexibilidad y eficiencia | 2 | Sin nav móvil (display:none a 720px sin reemplazo), sin skip-link |
| 8 | Estética y minimalismo | 2 | Correcta pero genérica; hero plano, 3 cards idénticas, cero imagen |
| 9 | Recuperación de errores | n/a | Sin errores en esta superficie |
| 10 | Ayuda y documentación | 3 | /soporte accesible |
| **Total** | | **26/28 aplicables — Aceptable–Bueno funcional, débil en marca** | |

## Anti-Patterns Verdict

¿Parece IA? Parcialmente sí, no por tells groseros sino por ausencia de POV (slop por timidez).
- **LLM:** Sistema limpio, sin gradient text/eyebrows/glass/stripes/over-rounding/side-stripes. Pero 3 cards idénticas icono+título+texto (= ban "identical card grids") y cero imagen en una web de herramienta visual de vídeo. "Safe = invisible".
- **Detector:** detect.mjs → [] (0 hallazgos, exit 0) en MainPage/Header/Footer. Sin falsos positivos. Los defectos viven en composición y en lo que falta, no en CSS prohibido.
- **Overlays:** no disponibles (sin inyección en navegador). Respaldo: revisión estática + cálculo de contraste manual.

## Overall Impression

Funcionalmente sólido, visualmente invisible. La home describe el producto en vez de demostrarlo: cero vídeo/screenshot/antes-después de una IA que convierte horas de metraje en clips. Mayor oportunidad: mostrar el ahorro (principio #1 de PRODUCT.md, hoy incumplido).

## What's Working

1. Coherencia de sistema (heurística 4=4/5): tokens 8px, roles tipográficos, variantes de botón, focus ring accent.
2. Contraste correcto: fg-muted 6.09:1, accent 6.36:1, texto sobre primary 6.36:1. WCAG AA cumplido.
3. Copy directo y honesto, alineado con la voz de marca.

## Priority Issues

### [P1] Cero imagen/demo en una web que vende una herramienta visual
Por qué: register brand → "zero images is a bug". Existen assets sin usar (hero-video.mp4, hero.png, certified-*.png en dist/). Fix: hero con hero-video.mp4 (poster hero.png, fallback reduced-motion) o screenshot real; sección demo antes/después. Command: $impeccable craft / $impeccable bolder.

### [P1] Tres cards idénticas (patrón prohibido por el propio sistema)
Por qué: "identical card grids" está en absolute bans; tell de IA más reconocible. grid repeat(3,1fr) salta 3→1 a 720px. Fix: narrativa con jerarquía, una feature dominante (búsqueda en lenguaje natural) con captura, otras dos de apoyo; si rejilla, auto-fit minmax(280px,1fr). Command: $impeccable layout / $impeccable bolder.

### [P1] Sin navegación en móvil
Por qué: ≤720px .header__nav{display:none} sin reemplazo; desaparecen 5 enlaces, sin hamburguesa. Casey pierde la nav de marketing. Fix: menú móvil con <dialog>/popover nativo, reusar array NAV. Command: $impeccable adapt.

### [P2] Hero tipográficamente tímido y con problema de escala
Por qué: font-size 48px fijo (no clamp), sin letter-spacing ni text-wrap:balance, baja a 32px de golpe a 720px. Plus Jakarta Sans está en reflex-reject pero aquí identity-preservation gana (heredado del plugin); por eso hay que exprimir contraste de peso/tamaño. Fix: clamp(2.5rem,6vw,4.5rem), letter-spacing -0.02em, text-wrap:balance, line-height ~1.05. Command: $impeccable typeset.

### [P2] Sin motion y sin skip-link
Por qué: brand invita a page-load orquestado; ausencia total de motion = plano, no restraint. A11y: falta skip-to-content antes del header sticky. Fix: entrada sobria del hero (fade+rise, reduced-motion → crossfade/instantáneo, contenido visible por defecto), skip-link. Command: $impeccable animate.

## Persona Red Flags

- **Jordan (primera vez):** no ve el producto, duda de si es real, abandona.
- **Casey (móvil):** a 720px desaparece toda la navegación de marketing; solo login/Empezar.
- **Sam (a11y/teclado):** contraste AA ✅ y focus ring ✅, pero header sticky sin skip-link; tabula 5 enlaces antes del contenido. Iconos aria-hidden ✅.

## Minor Observations

- "Producto" (nav) vs "Visión general" (footer) para el mismo destino `/`.
- .feature usa border+background sin shadow → bien, no es ghost-card.
- El wordmark "KAI" como texto plano podría usar logo.png real.
- Hero con --space-9 vertical pero sin imagen → fold vacío en pantallas grandes.

## Questions to Consider

- ¿Cómo se vería una home que enseña el plugin encontrando clips, en vez de contarlo en cards?
- ¿Y si el hero fuera hero-video.mp4 casi a pantalla completa con el titular superpuesto?
- ¿Cuál de las tres features es LA razón de compra? Esa merece protagonismo.
