# Guía de comandos `/impeccable`

Referencia rápida de los comandos de la skill **impeccable** (diseño de interfaces frontend):
qué hace cada uno, cuándo usarlo y para qué. Casi todos aceptan un `[target]` opcional
(archivo, página o componente), p. ej. `/impeccable critique src/ui/pages/ShopPage`.

> Si no sabes por dónde empezar, escribe `/impeccable` sin argumentos: analiza el estado
> del proyecto y te recomienda los próximos comandos de mayor valor.

---

## 🏗️ Build — crear y montar contexto

| Comando | Cuándo usarlo | Para qué |
|---|---|---|
| `craft [feature]` | Quieres una feature **nueva y terminada** | Diseña (shape) y construye end-to-end código de producción. |
| `shape [feature]` | Antes de programar, quieres **planificar** la UX/UI | Define brief, jerarquía y dirección visual. No escribe código. |
| `init` | Proyecto nuevo o sin contexto | Crea `PRODUCT.md`, `DESIGN.md` y la config de live mode. |
| `document` | Ya hay código pero no `DESIGN.md` | Genera el `DESIGN.md` capturando tu sistema visual real. |
| `extract [target]` | Tienes patrones repetidos sueltos | Saca tokens/componentes reutilizables a un design system. |

## 🔍 Evaluate — diagnosticar

| Comando | Cuándo usarlo | Para qué |
|---|---|---|
| `critique [target]` | Quieres una **review de UX con nota** | Scoring heurístico (Nielsen), anti-patrones, personas. |
| `audit [target]` | Te preocupa lo **técnico** | Chequeos de accesibilidad, performance y responsive. |

## ✨ Refine — afinar lo que ya existe

| Comando | Cuándo usarlo | Para qué |
|---|---|---|
| `polish [target]` | **Antes de enviar a producción** | Pase final de detalles: contraste, estados, copy, alineación. |
| `bolder [target]` | El diseño es **soso/tímido** | Lo amplifica, le da carácter y POV. |
| `quieter [target]` | El diseño es **demasiado agresivo/ruidoso** | Lo calma, reduce la sobreestimulación. |
| `distill [target]` | Hay **complejidad innecesaria** | Lo reduce a la esencia. |
| `harden [target]` | Falta robustez | Errores, i18n, casos límite, listo para producción. |
| `onboard [target]` | Primera experiencia floja | Diseña first-run, empty states y activación. |

## 🎨 Enhance — añadir una capa concreta

| Comando | Cuándo usarlo | Para qué |
|---|---|---|
| `animate [target]` | Falta vida/feedback | Movimiento e interacciones con propósito. |
| `colorize [target]` | UI monótona o gris | Color estratégico. |
| `typeset [target]` | Jerarquía tipográfica floja | Mejora escala, fuentes y contraste de texto. |
| `layout [target]` | Espaciado/ritmo "off" | Arregla spacing, jerarquía visual y grid. |
| `delight [target]` | Funciona pero es soso | Personalidad y toques memorables. |
| `overdrive [target]` | Quieres algo **extraordinario** | Empuja más allá de lo convencional. |

## 🔧 Fix — corregir un problema puntual

| Comando | Cuándo usarlo | Para qué |
|---|---|---|
| `clarify [target]` | Copy/labels/errores confusos | Mejora los textos de UX. |
| `adapt [target]` | No funciona bien en algún dispositivo | Adapta a otro tamaño/contexto. |
| `optimize [target]` | UI lenta o con jank | Diagnostica y arregla performance. |

## 🔁 Iterate

| Comando | Cuándo usarlo | Para qué |
|---|---|---|
| `live` | Quieres iterar **en el navegador** | Eliges elementos y generas variantes en vivo (necesita dev server). |

---

## Cómo decidir rápido

- **No sé por dónde empezar** → `/impeccable` sin argumentos (recomienda según el estado del proyecto).
- **Algo nuevo** → `craft` (o `shape` si solo quieres planear).
- **¿Está bien esto?** → `critique` (UX, con nota) o `audit` (técnico/a11y).
- **Está bien pero le falta algo** → el `enhance` concreto (`animate` / `colorize` / `typeset` / `layout` / `delight`).
- **Va a salir a producción** → `polish`.
- **Demasiado / poco** → `bolder` ⇄ `quieter`, o `distill` para simplificar.

---

## Historial en este proyecto

La home (`src/ui/pages/MainPage`) se trabajó con esta secuencia:

| # | Comando | Resultado |
|---|---------|-----------|
| 1 | `init` | Creó `PRODUCT.md` (register: brand) |
| 2 | `critique src/ui/pages/MainPage` | Review inicial (score 26, 3×P1) |
| 3 | `craft` | Hero con vídeo + sección demo "prompt → clips" |
| 4 | `adapt` | Navegación móvil (drawer `<dialog>`) |
| 5 | `layout` | Ritmo vertical, jerarquía de features, encabezado |
| 6 | `typeset` | Rampa display fluida, `rem`, compensación light-on-dark |
| 7 | `animate` | Entrada del hero + skip-link de accesibilidad |
| 8 | `polish` | Cierre: contraste, estados, consistencia de copy |

Los snapshots de cada `critique` se guardan en `.impeccable/critique/`.

> **Siguiente candidata de alto retorno:** `src/ui/pages/ShopPage` (planes) — la otra pieza
> crítica de conversión, aún sin tocar. Un `critique` o `craft` ahí tendría mucho impacto.
