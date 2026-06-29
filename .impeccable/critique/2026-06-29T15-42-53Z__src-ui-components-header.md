---
target: src/ui/components/Header
total_score: 26
p0_count: 0
p1_count: 0
timestamp: 2026-06-29T15-42-53Z
slug: src-ui-components-header
---
⚠️ DEGRADED: single-context (no sub-agents: session policy forbids spawning agents without explicit request)

# Critique — Header (navegación)

**Method:** single-context. Assessment A (design review) + Assessment B (detector CLI + contraste + revisión de código). Sin browser automation. Primera ejecución.

## Design Health Score

| # | Heurística | Score | Issue clave |
|---|-----------|-------|------|
| 1 | Visibilidad del estado | 4 | NavLink activo en accent, hover, aria-expanded |
| 2 | Match con el mundo real | 4 | Labels claros; iconos hamburguesa/X estándar |
| 3 | Control y libertad | 4 | Drawer cierra ESC/backdrop/X/ruta; logo a inicio |
| 4 | Consistencia y estándares | 4 | Tokens, linkClass compartido, Button reutilizado |
| 5 | Prevención de errores | n/a | Sin inputs/acciones destructivas |
| 6 | Reconocimiento vs. recuerdo | 4 | Nav con labels, mismo set en drawer |
| 7 | Flexibilidad y eficiencia | 3 | Sin estado de scroll; logo no marca activo en / |
| 8 | Estética y minimalismo | 3 | Limpio; wordmark texto plano (logo.svg sin usar) |
| 9 | Recuperación de errores | n/a | Sin errores |
| 10 | Ayuda y documentación | n/a | No aplica |
| **Total** | | **26/28 aplicables → ~Excelente** | |

## Anti-Patterns Verdict

¿Parece IA? No. Header técnicamente impecable.
- **LLM:** <dialog> nativo para drawer (foco atrapado+ESC+backdrop, no position:absolute recortable), linkClass extraído (DRY nav/drawer), cierre al cambiar ruta, aria-expanded/haspopup, touch 44×44, safe-area, @starting-style + allow-discrete. Sin gradient/glass/over-rounding. z-index 10 semántico.
- **Detector:** detect.mjs → [] (0, exit 0). Sin falsos positivos.
- **Contraste:** links fg-muted/bg 6.09:1, activo accent/bg 6.36:1. WCAG AA.

## Overall Impression

De los componentes mejor resueltos del proyecto. A11y y mecánica del drawer por encima de la media. Lo que queda es pulido fino. Mayor oportunidad: wordmark "KAI" es texto plano mientras logo.svg (placeholder) sigue sin usar.

## What's Working

1. Drawer con <dialog> modal: foco atrapado, ESC, backdrop, inertización gratis. showModal/close vía useEffect, cierra al navegar.
2. DRY real: linkClass y NAV compartidos nav desktop/drawer; Button reutilizado.
3. A11y de serie: aria-expanded, aria-haspopup, aria-label en logo/botones/navs, touch 44×44, safe-area.

## Priority Issues

### [P2] Sin estado de scroll en el header sticky
Header sticky con mismo --bg que la página; en scroll largo "flota" sin separación más allá del borde 1px. Fix: sombra/opacidad/backdrop-filter leve cuando scrollY>0 (IntersectionObserver). Command: $impeccable animate.

### [P3] Wordmark texto plano teniendo logo.svg
"KAI" como texto (--type-title); logo.svg (placeholder) sin usar. No urgente: el svg es placeholder, el texto es fallback robusto. Sin command hasta tener logo real.

### [P3] (resuelto/observación) Iniciar sesión ghost + Empezar primary
Patrón correcto (un solo primary; jerarquía ghost/primary se mantiene en drawer a ancho completo). Sin problema real.

## Persona Red Flags

- **Casey (móvil):** drawer completo, CTAs full, touch 44×44, safe-area, cierre múltiple. Sin red flags.
- **Sam (a11y):** <dialog> atrapa y devuelve foco; aria-expanded refleja estado. Matiz: foco va a la X por defecto; podrías enfocar el primer enlace. Sin bloqueantes.
- **Alex:** esperaría que el logo en / marcara estado activo; hoy siempre navega a / sin estado. Menor.

## Minor Observations

- NAV reordenado a Producto→Planes→Descargar→Soporte→Empresa: Planes (conversión) más arriba, buena prioridad.
- header__logo letter-spacing 1px en caps: correcto.
- Drawer con height 100dvh: correcto para móvil con barra URL variable.
- z-index 10; el <dialog> modal vive en top layer, por encima sin competir. Coherente.
- BUG LATENTE: la X del drawer usa .header__menu-btn, cuyo estado base es display:none y solo pasa a inline-flex en @media ≤720px. Hoy no se manifiesta (el drawer solo se abre ≤720px), pero si se abriera en ≥720px la X quedaría oculta. Frágil: la X debería tener display garantizado dentro del dialog, no depender del breakpoint.

## Questions to Consider

- ¿Header reactivo al scroll (sombra/opacidad) para anclarse en scroll largo?
- ¿Logo.svg real para sustituir el wordmark de texto?
- ¿El logo en / debería marcarse activo, o ser siempre "volver a inicio"?
