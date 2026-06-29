---
target: src/ui/pages/ShopPage
total_score: 36
p0_count: 0
p1_count: 1
timestamp: 2026-06-29T15-37-34Z
slug: src-ui-pages-shoppage
---
⚠️ DEGRADED: single-context (no sub-agents: session policy forbids spawning agents without explicit request)

# Critique — ShopPage (planes)

**Method:** single-context. Assessment A (design review) + Assessment B (detector CLI + contraste calculado + revisión de código). Sin browser automation. Primera ejecución.

## Design Health Score

| # | Heurística | Score | Issue clave |
|---|-----------|-------|------|
| 1 | Visibilidad del estado | 4 | Loading (skeleton), error y ready diferenciados |
| 2 | Match con el mundo real | 4 | Lenguaje de compra claro; "/mes", "Más popular" |
| 3 | Control y libertad | 3 | CTA a login; FAQ expandible |
| 4 | Consistencia y estándares | 4 | Tokens, rampa, PlanCard reutilizado, FAQ compartido |
| 5 | Prevención de errores | 3 | Retry en error; CTA pasa ?plan= pero login no lo lee |
| 6 | Reconocimiento vs. recuerdo | 4 | Features por plan; reaseguro; FAQ |
| 7 | Flexibilidad y eficiencia | 3 | Sin toggle anual/comparativa (scope no lo pide) |
| 8 | Estética y minimalismo | 3 | Buena jerarquía; FAQ larga densa |
| 9 | Recuperación de errores | 4 | Error claro + reintentar funcional |
| 10 | Ayuda y documentación | 4 | FAQ de compra + reaseguro in situ |
| **Total** | | **36/40 — Bueno/Excelente** | |

## Anti-Patterns Verdict

¿Parece IA? No.
- **LLM:** Evita tells de pricing-SaaS: sin hero-metric, sin gradient accent, sin 3 cards idénticas planas (Pro destacado rompe simetría con escala+ring+superficie). Skeleton, error+retry, FAQ <details> nativo = producto real. Sin gradient text/eyebrows/side-stripes/over-rounding. El box-shadow 0 0 0 1px accent NO es ghost-card (ring de 1px intencional).
- **Detector:** detect.mjs → [] (0, exit 0) en ShopPage y PlanCard. Sin falsos positivos.
- **Contraste:** badge 6.36:1, texto destacado 10.37:1, muted/surface-2 4.95:1 (más ajustado, pasa AA), retry 7.46:1. Todo WCAG AA.

## Overall Impression

Página de planes sólida y de marca, coherente con la home. Jerarquía clara (Pro destacado), estados reales, reaseguro y FAQ. Score alto (36). Mayor oportunidad: veracidad — los precios (9/29/79€) son placeholders que vende como reales.

## What's Working

1. Jerarquía del destacado: scale(1.03)+ring+surface-2+badge, solo en desktop (≥881px). Guía sin oscurecer las otras.
2. Cobertura de estados: loading skeleton, error+retry, máquina loading|ready|error con cleanup (active flag) que evita setState tras unmount.
3. Reutilización limpia: PlanCard reusado, .faq extraído a globals y compartido con la home. Sin deuda.

## Priority Issues

### [P1] Los precios son placeholders presentados como reales
9/29/79€ con /mes y "Elegir plan" como definitivos; el usuario ancla en números que cambiarán. Fix: marcar provisional / banner "precios en actualización" / "Próximamente". Riesgo de negocio. Command: $impeccable clarify.

### [P2] El CTA pasa ?plan= pero el destino no lo aprovecha
handleSelect navega a /login?plan=, pero LoginPage no lee el query param; intención perdida. Fix: que LoginPage lea ?plan= y lo conserve/muestre. Wiring de LoginPage (futuro craft/harden).

### [P3] No hay confirmación visual de qué plan eliges al pulsar
Casey pulsa "Elegir Pro" y salta a login sin micro-acuse. Fix: pressed/loading en botón o nombre del plan en destino. Command: $impeccable animate.

## Persona Red Flags

- **Jordan:** buen recorrido (3 planes, Pro recomendado, FAQ, reaseguro). Tropiezo: precios que cambiarán.
- **Riley:** estados cubiertos. Falta EMPTY STATE si getPlans devuelve [] (hoy grid vacío sin mensaje).
- **Casey (móvil):** apila a 1 col ≤880px (max-width 420px centrado), destacado no escala en móvil (correcto). Salto a login algo brusco (P3).

## Minor Observations

- Skeleton height 460px fijo → posible CLS leve si los planes reales tienen más features.
- interpolate-size/::details-content sin soporte Firefox → FAQ abre de golpe pero funcional (degradación correcta).
- Badge "Más popular" en top negativo: verificar visualmente con la card escalada.
- Reaseguro y FAQ a ancho completo, coherente con la petición previa.

## Questions to Consider

- ¿Cuándo los precios reales? ¿Marcamos los actuales como provisionales?
- ¿Compra self-service (Stripe) o por contacto? Decide "Elegir" vs "Hablar con ventas".
- ¿Empty state por si getPlans devuelve vacío?
