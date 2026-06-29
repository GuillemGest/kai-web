---
name: Nara Campus
description: Plataforma de cursos XR / Unreal Engine — oscura, premium, técnica.
colors:
  render-orange: "#FA7052"
  realtime-green: "#29B97A"
  viewport-black: "#0b0d10"
  viewport-soft: "#111418"
  surface-card: "#13171e"
  surface-panel: "#16191f"
  ink: "#f1f1ec"
  muted-steel: "#7a8190"
  divider: "#FFFFFF8E"
typography:
  display:
    fontFamily: "Cabinet Grotesk, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Cabinet Grotesk, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Cabinet Grotesk, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.01em"
  body:
    fontFamily: "Space Grotesk, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  none: "0"
  sm: "3px"
  md: "6px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "clamp(56px, 8vh, 100px)"
components:
  button-primary:
    backgroundColor: "{colors.render-orange}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "13px 28px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.viewport-black}"
    textColor: "{colors.render-orange}"
    rounded: "{rounded.md}"
    padding: "13px 28px"
  button-ghost:
    backgroundColor: "{colors.viewport-black}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "{colors.viewport-black}"
    textColor: "{colors.render-orange}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  input-field:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "11px 14px"
  card-course:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
---

# Design System: Nara Campus

## 1. Overview

**Creative North Star: "The Render Viewport"**

Nara Campus se construye como el entorno donde su alumnado trabajará de verdad: un viewport de Unreal/realtime 3D a baja luz. El fondo no es negro "por moda", es el lienzo de trabajo (`#0b0d10`); todo lo demás se renderiza encima. La interfaz se aparta para que el contenido — cursos, imágenes, instructores — sea lo que se ilumina. El naranja (`#FA7052`) funciona como un gizmo de herramienta: aparece solo donde hay acción o estado, nunca como relleno decorativo.

El sistema es denso, recto y seguro de sí mismo. Las esquinas son a 90° (radius `0`) porque imitan paneles de software técnico, no tarjetas de marketing. Las superficies son planas en reposo y la jerarquía nace del contraste tonal (`#0b0d10` → `#16191f`) y de líneas de 1px, no de sombras. La tipografía hace el trabajo pesado: un display Cabinet Grotesk pesado y apretado contra labels en mayúsculas con tracking amplio, el contraste de una consola profesional.

Lo que este sistema rechaza explícitamente (de PRODUCT.md): plataformas educativas genéricas claras y corporativas (Coursera/Udemy); el SaaS cream / warm-neutral con tipografía ligera; el glassmorphism decorativo y el neón sin propósito; las tarjetas idénticas en grid sin jerarquía; y los eyebrows numerados (01 / 02 / 03) como andamiaje de sección.

**Key Characteristics:**
- Oscuro intencional: el fondo negro ES el medio (XR a baja luz), no una opción estética.
- Un solo acento con propósito: `#FA7052` marca acción/estado, ≤10% de cualquier pantalla.
- Plano por defecto: profundidad por capas tonales y divisores 1px, no por sombras.
- Bordes rectos (radius 0): registro de panel técnico / software, no de tarjeta marketing.
- La tipografía lidera: display pesado + labels en mayúsculas tracked como contraste central.

## 2. Colors

Una paleta casi monocroma sobre negro, con un único acento cálido que porta toda la energía y un verde reservado a la categoría realtime.

### Primary
- **Render Orange** (`#FA7052`): la firma. Fondo de CTAs primarios, color de foco en inputs, hover de enlaces, gizmo de estado/acción. Su rareza es lo que lo hace leer como acción. Nunca como fondo de sección ni como relleno decorativo.

### Secondary
- **Realtime Green** (`#29B97A`): identificador de la categoría *realtime 3D*. Uso acotado a etiquetas/markers de categoría, nunca como segundo CTA ni acento general.

### Neutral
- **Viewport Black** (`#0b0d10`): el lienzo. Fondo global de la app.
- **Viewport Soft** (`#111418`): primer escalón de elevación tonal (zonas y secciones diferenciadas del fondo).
- **Surface Card** (`#13171e`): fondo de tarjetas de curso y contenedores.
- **Surface Panel** (`#16191f`): superficies de panel/modal y campos elevados.
- **Ink** (`#f1f1ec`): texto principal. Blanco cálido apagado, no `#fff` puro, para reducir el deslumbre sobre negro.
- **Muted Steel** (`#7a8190`): texto secundario, metadatos, placeholders en estado de reposo.
- **Divider** (`rgba(255,255,255,0.555)` / `#FFFFFF8E`): líneas de 1px que separan zonas; el principal mecanismo de estructura junto al contraste tonal.

### Named Rules
**The Gizmo Rule.** Render Orange aparece en ≤10% de cualquier pantalla y siempre sobre algo accionable (botón, foco, hover, estado). Si el naranja decora, está mal usado.

**The Tonal Depth Rule.** La separación entre zonas se consigue subiendo un escalón de luminosidad (`#0b0d10` → `#111418` → `#16191f`) o con un divider de 1px — no con sombras ni bordes de color.

## 3. Typography

**Display Font:** Cabinet Grotesk (con Space Grotesk y system-ui de fallback)
**Body Font:** Space Grotesk (con system-ui, -apple-system de fallback)

**Character:** Dos grotescas de la misma familia tonal pero con roles tajantes: Cabinet Grotesk en pesos extremos (800–900) y tracking negativo para los titulares, Space Grotesk en 400–700 para cuerpo y labels. El contraste no viene de mezclar estilos opuestos sino de empujar peso, tamaño y tracking al límite — la voz de una consola técnica, no de una revista.

### Hierarchy
- **Display** (Cabinet Grotesk, 900, `clamp(2.8rem, 5.5vw, 5.5rem)`, lh 1.05, ls −0.03em): títulos hero. Solo una vez por vista.
- **Headline** (Cabinet Grotesk, 800, `clamp(1.6rem, 3vw, 2.4rem)`, lh 1.15, ls −0.01em): títulos de sección.
- **Title** (Cabinet Grotesk, 800, `clamp(1.4rem, 2.5vw, 2.1rem)`, lh 1.2): títulos de tarjeta de curso / bloques destacados.
- **Body** (Space Grotesk, 400, `clamp(0.9rem, 1.5vw, 1.05rem)`, lh 1.6): párrafos y descripciones. Límite de medida 65–75ch.
- **Label** (Space Grotesk, 500–700, `0.66–0.75rem`, ls 0.1–0.2em, MAYÚSCULAS): eyebrows, botones, metadatos, navegación, tags de categoría.

### Named Rules
**The Tracked-Caps Rule.** Las mayúsculas se reservan a labels y botones cortos, siempre con tracking ≥0.1em. Nunca en cuerpo de texto.

**The Heavy-Display Rule.** Los titulares viven en 800–900; pesos intermedios (500–600) no se usan en display. El contraste de peso es la jerarquía.

## 4. Elevation

Plano por defecto. Las superficies no llevan sombra en reposo: la profundidad se construye apilando escalones tonales (`#0b0d10` → `#111418` → `#13171e` → `#16191f`) y separando con dividers de 1px. La sombra es una **respuesta a estado**, no una propiedad de la superficie — aparece solo en el hover de las tarjetas de curso para señalar que son interactivas.

### Shadow Vocabulary
- **Lift on hover** (`box-shadow: 0 12px 36px rgba(0,0,0,0.5)`): única sombra del sistema. Acompaña al `transform` de la tarjeta de curso en hover para comunicar que se eleva del viewport. No usar en reposo, ni en botones, ni en paneles.

### Named Rules
**The Flat-At-Rest Rule.** Toda superficie es plana en reposo. Si necesitas separar dos zonas, sube un escalón tonal o pon un divider de 1px; no añadas una sombra ambiental.

## 5. Components

### Buttons
- **Shape:** esquinas rectas (radius `0`). Sin excepción para CTAs.
- **Primary** (`.hero-cta`, `.btn-adquirir`): fondo Render Orange, texto blanco, label en MAYÚSCULAS (peso 700, ls 0.1em), padding `13px 28px` (hero) / `10px 12px` (en fila de acciones).
- **Hover / Focus:** el primario invierte a fantasma — fondo transparente + texto y borde Render Orange (`.btn-adquirir`); el hero atenúa a `opacity: 0.88`. `:active` aplica `transform: scale(0.97)`.
- **Ghost** (`.btn-info`): transparente, borde 1px divider, texto Ink. Hover → borde y texto Render Orange.

### Cards / Containers
- **Corner Style:** rectas (radius `0`; algunos contenedores menores `4px`).
- **Background:** Surface Card (`#13171e`) sobre el viewport.
- **Shadow Strategy:** plana en reposo; *Lift on hover* (ver Elevación) con `transform` para tarjetas de curso.
- **Border:** sin borde de color; separación por contraste tonal o divider 1px.
- **Internal Padding:** escala `md` (24px) en contenedores; ajustes locales según densidad.

### Inputs / Fields
- **Style:** sin caja; fondo sutil `rgba(255,255,255,0.04)` y solo `border-bottom: 1px solid divider`. Radius `0`. Registro de campo de software, no de pill.
- **Focus:** `border-bottom-color` → Render Orange. Sin glow, sin halo.
- **Placeholder:** Muted Steel a baja opacidad.

### Navigation
- Header fijo (66px). Enlaces como labels en MAYÚSCULAS, peso 500, tracking 0.1em, color Ink/Muted. Hover y estado activo viran a Render Orange. Línea inferior divider de 1px que separa el header del viewport.

### Category Tag (signature)
- Marcador de categoría que toma su color del set por categoría (realtime → Realtime Green; demo/arquitectura → Render Orange; formación/producción/automoción → blanco/Ink). Label en MAYÚSCULAS, tracking amplio, sin fondo o con fondo mínimo.

## 6. Do's and Don'ts

### Do:
- **Do** mantener `#0b0d10` como lienzo y construir profundidad por capas tonales + dividers de 1px (*The Tonal Depth Rule*).
- **Do** reservar Render Orange para acción/estado en ≤10% de la pantalla (*The Gizmo Rule*).
- **Do** usar esquinas rectas (radius 0) en botones, inputs y tarjetas; el registro es de panel técnico.
- **Do** dar todo el peso de la jerarquía a la tipografía: display 800–900 apretado contra labels en mayúsculas tracked.
- **Do** usar el blanco cálido `#f1f1ec` para el texto, no `#ffffff` puro, y verificar ≥4.5:1 sobre el fondo.

### Don't:
- **Don't** parecerse a una plataforma educativa genérica (Coursera/Udemy): clara, corporativa y sin carácter.
- **Don't** caer en SaaS cream / warm-neutral con tipografía ligera — es el opuesto exacto de la marca.
- **Don't** usar glassmorphism decorativo ni neón/efectos sin propósito.
- **Don't** montar grids de tarjetas idénticas sin jerarquía visual.
- **Don't** usar eyebrows numerados (01 / 02 / 03) como andamiaje de sección.
- **Don't** añadir sombras a superficies en reposo; la única sombra es el *Lift on hover* de la tarjeta de curso.
- **Don't** poner texto en mayúsculas en cuerpo de párrafo ni usar pesos intermedios en titulares.
- **Don't** usar el naranja como fondo de sección o relleno; si decora, está mal.
