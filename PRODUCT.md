# Product

## Register

brand

## Users

Profesionales de **productoras, televisión y medios** (B2B) que trabajan con grandes
volúmenes de material audiovisual. Su contexto es de producción: tienen horas de metraje
y necesitan localizar los momentos clave sin revisarlo todo manualmente. Llegan a la web
para evaluar si KAI les ahorra tiempo, entender el precio y descargar el plugin. El
decisor puede ser un editor/realizador o un responsable de equipo que valida la compra.

El trabajo a resolver: **encontrar y exportar los fragmentos relevantes de su material en
una fracción del tiempo**, dentro del software de edición que ya usan (KAI es un plugin).

## Product Purpose

KAI es un **plugin con IA** que busca, organiza y exporta los mejores fragmentos de vídeo
a partir de lenguaje natural. La web es la **superficie de venta**: presenta el producto,
comunica el ahorro de tiempo, muestra los planes de suscripción y permite descargar el
build. Reutiliza el sistema de diseño del producto (dark, técnico) pero **no su layout de
app** (sidebar + chat + editor).

Éxito = un visitante de una productora entiende en segundos qué hace KAI, confía en que es
una herramienta seria y profesional, y avanza a planes o descarga.

## Brand Personality

Tres palabras: **confiable, potente, puntera**.

- **Confianza técnica / pro**: herramienta seria para gente que sabe lo que hace. Nada
  infantil ni sobreexplicado.
- **Rápida / potente**: el mensaje central es velocidad — "lo que tardabas horas, en
  segundos". La interfaz debe *sentirse* eficiente, no recargada.
- **Moderna / IA puntera**: producto de IA actual y a la vanguardia, sin caer en el cliché
  visual de "landing de IA".

Voz: directa, concreta, sin humo. Habla de resultados (tiempo ahorrado, clips
encontrados), no de adjetivos vacíos.

## Anti-references

- **SaaS-cream genérico**: nada de fondo crema/beige, eyebrows en mayúsculas tracked sobre
  cada sección, ni grids de cards idénticas con icono + título + texto repetidas. Es la
  landing de IA por defecto; evitarla.
- **Demasiado juguete**: nada infantil, gamer ni sobrecoloreado. El público es profesional
  B2B; la estética debe respaldar la confianza, no socavarla.
- Sin gradient text, glassmorphism decorativo, ni stripes/sketchy SVG (bans del sistema).

## Design Principles

1. **Mostrar el ahorro, no prometerlo**: demostrar la velocidad y el resultado (metraje →
   clips) con producto real, capturas o demo, en vez de adjetivos.
2. **Confianza por precisión**: la credibilidad B2B se gana con detalle impecable —
   alineación, contraste, tipografía firme — no con decoración.
3. **Dark con intención**: el dark mode es la identidad (heredada del plugin), no un truco
   de "las herramientas molan oscuras"; el accent cian es solo para interacción.
4. **Menos, pero firme**: jerarquía clara y ritmo de espaciado variado antes que más
   secciones. La sensación de eficiencia es parte del mensaje.
5. **Coherencia con el producto**: la web debe sentirse de la misma familia que el plugin
   (tokens del UI Style Guide de KAI) sin imitar su layout de app.

## Accessibility & Inclusion

- Objetivo **WCAG AA**: cuerpo de texto ≥4.5:1, texto grande ≥3:1, foco visible (focus
  ring con `--accent`).
- Respetar **`prefers-reduced-motion`**: toda animación necesita alternativa (crossfade o
  transición instantánea).
- Cuidado con el cuerpo de texto sobre superficies oscuras: usar `--fg` o opacidades altas,
  no grises lavados que bajen del 4.5:1.
