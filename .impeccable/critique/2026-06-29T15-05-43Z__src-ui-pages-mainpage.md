---
target: src/ui/pages/MainPage
total_score: 33
p0_count: 0
p1_count: 1
timestamp: 2026-06-29T15-05-43Z
slug: src-ui-pages-mainpage
---
⚠️ DEGRADED: single-context (no sub-agents: session policy forbids spawning agents without explicit request)

# Critique #2 — MainPage (home de venta KAI)

**Method:** single-context. Assessment A (design review) + Assessment B (detector CLI + contraste calculado + revisión de código). Sin browser automation. Re-critique tras 6 pasos de mejora.

## Design Health Score

| # | Heurística | Score | Issue clave |
|---|-----------|-------|------|
| 1 | Visibilidad del estado | 3 | NavLink activo, hover, drawer; sin async (no aplica) |
| 2 | Match con el mundo real | 4 | "Producto" unificado nav↔footer |
| 3 | Control y libertad | 4 | Drawer ESC/backdrop/ruta; skip-link |
| 4 | Consistencia y estándares | 4 | Design system + rampa display; tokens en todo |
| 5 | Prevención de errores | n/a | Sin inputs |
| 6 | Reconocimiento vs. recuerdo | 4 | Demo enseña el gesto del producto |
| 7 | Flexibilidad y eficiencia | 4 | Nav móvil + skip-link + reduced-motion real |
| 8 | Estética y minimalismo | 3 | Jerarquía fuerte; hero depende de assets vacíos |
| 9 | Recuperación de errores | n/a | Sin errores |
| 10 | Ayuda y documentación | 3 | /soporte accesible |
| **Total** | | **33/36 aplicables — Bueno/Excelente** (26 → 33) | |

## Anti-Patterns Verdict

¿Parece IA? Ya no. El slop por timidez del critique #1 resuelto.
- **LLM:** Hero asimétrico con media dominante, demo "prompt → clips" (mecánica real), features con jerarquía. Sin gradient text/glass/side-stripes/over-rounding/eyebrows-por-sección/cards-idénticas/stripes. Entrada de hero orquestada, no fade-on-scroll uniforme.
- **Detector:** detect.mjs → [] (0, exit 0) en MainPage/Header/Footer/layouts. Sin falsos positivos.
- **Contraste:** fg-muted/bg 6.09:1, footer 6.77:1, prompt-text 10.37:1, accent/bg 6.36:1, texto/primary 6.36:1. WCAG AA, varios AAA.

## Overall Impression

De "funciona pero invisible" a "vende y se siente de marca". La home muestra el producto (hero vídeo + demo de la mecánica) en vez de describirlo — principio #1 de PRODUCT.md ahora cumplido. Jerarquía firme, navegación en todos los anchos. Lo único que impide "excelente" pleno: dependencia de assets que hoy son placeholders vacíos (hero/poster se ven rotos hasta poner los reales). Es estado de assets, no de código.

## What's Working

1. La sección demo es el acierto: "pídelo con tus palabras → clips con timestamp", UI honesta sin foto inventada. Diferenciador real.
2. Sistema tipográfico + espacial coherente: rampa --fs-* fluida y --space-* en todo; squint test distingue h1→h2→feature dominante→apoyo.
3. Accesibilidad sólida: skip-link, focus ring, drawer con foco atrapado, reduced-motion que pausa el vídeo y anula delays del hero, touch 44×44.

## Priority Issues

### [P1] El hero depende de assets vacíos (poster + vídeo placeholder)
poster="/images.jpg" y src="/demo.mp4" son 0 bytes; en producción el hero se vería roto. Fix: assets reales; mientras, poster con superficie de marca como fallback. Command: entrega de assets (opcional $impeccable harden para el fallback).

### [P2] El vídeo del hero no tiene fallback visible si falla la carga
Si demo.mp4 no carga, queda el color de fondo. Fix: background de marca en .hero__video o <img> de respaldo. Command: $impeccable harden.

### [P3] La demo no comunica que es una recreación, no la UI literal
Riley podría leer el mock como captura real. Fix: etiqueta sutil ("Ejemplo") o capturas reales del plugin. Command: $impeccable clarify.

## Persona Red Flags

- **Jordan:** ahora SÍ ve el producto (hero + demo). Riesgo: assets vacíos en deploy.
- **Casey (móvil):** red flag del #1 RESUELTO (drawer, CTAs full, 44×44, safe-area).
- **Sam (a11y):** red flag del #1 RESUELTO (skip-link, focus, foco atrapado, AA/AAA, reduced-motion).

## Minor Observations

- --fs-h1 llega a 4.5rem (≤6rem ✓), tracking -0.02em (≥ -0.04em ✓).
- hero__title balance + max-width 16ch evita overflow; verificar con copy real más largo.
- demo__hint "4 momentos en 3,2 s": número de ejemplo plausible y honesto.
- IMPECCABLE.md + snapshots documentan el proceso.

## Questions to Consider

- ¿Capturas reales del plugin para la demo, o el mock es la versión final?
- ¿Hero con vídeo definitivo, o poster de marca robusto por peso en móvil?
- Con la home sólida, ¿planes (ShopPage) merece el mismo tratamiento?
