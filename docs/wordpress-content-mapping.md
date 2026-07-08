# Mapeo de contenido: `content.ts` actuales → WordPress (ACF + CPTs)

Spec de referencia para modelar los campos ACF y los CPTs en WordPress (Fase 2). Cada fila indica de qué fichero fuente sale el texto, la clave dentro de ese objeto, y el campo/CPT propuesto en WP. Los nombres de campo usan `snake_case` (convención ACF).

> Nota: `es` es el idioma por defecto. Los mismos campos se traducen en `en`/`ca` vía Polylang (misma page/post, traducción enlazada), no como claves distintas.

## Páginas-singleton (ACF sobre una página WP por slug)

### `home` — de `src/ui/pages/MainPage/content/mainPage.content.es.ts`

| Clave en content.ts | Campo ACF | Tipo |
|---|---|---|
| `hero.titleLead` | `hero_title_lead` | Text |
| `hero.titleAccent` | `hero_title_accent` | Text |
| `hero.titleTail` | `hero_title_tail` | Text |
| `hero.lead` | `hero_lead` | Textarea |
| `hero.primaryCta` | `hero_primary_cta` | Text |
| `hero.videoAlt` | `hero_video_alt` | Text |
| `hero.videoPause` / `hero.videoPlay` | `hero_video_pause` / `hero_video_play` | Text |
| `compat.osLabel` | `compat_os_label` | Text |
| `compat.integrationLabel` | `compat_integration_label` | Text |
| `compat.integrationApp` | `compat_integration_app` | Text |
| `demo.title` / `demo.lead` | `demo_title` / `demo_lead` | Text / Textarea |
| `demo.tag` / `demo.query` / `demo.result` | `demo_tag` / `demo_query` / `demo_result` | Text |
| `features.heading` | `features_heading` | Text |
| `faq.title` | `faq_title` | Text |
| `cta.title` / `cta.lead` / `cta.primaryCta` | `cta_title` / `cta_lead` / `cta_primary` | Text/Textarea/Text |

`trustedBy` y `demo.clips` quedan fuera de fase 1 (sección oculta / ejemplo estático).

### `header` — de `src/ui/components/Header/content/header.content.es.ts`

Campos fijos (la nav no cambia de estructura, solo labels): `nav_product_label`, `nav_plans_label`, `nav_resources_label`, `nav_company_label`, `action_login_label`, `action_cta_label`. Las URLs (`to`) NO se editan desde WP — siguen en código (son rutas de la app, no contenido).

### `footer` — de `src/ui/components/Footer/content/footer.content.es.ts`

`footer_tagline`, `footer_legal_template`. Las columnas de enlaces (`columns`) igual que en Header: labels editables, `to` fijo en código.

### `planes` — de `src/ui/pages/ShopPage/content/shopPage.content.es.ts`

Campos del "chrome" de la página: `plans_head_title`, `plans_head_lead`, `plans_head_notice`, `plans_error_message`, `plans_error_retry`, `plans_billing_toggle_label`, `plans_billing_monthly`, `plans_billing_yearly`, `plans_comparison_title`, `plans_comparison_lead`. Los datos de cada plan (`plans.content.es.ts` → `planTranslations`) van al CPT `plan` (ver abajo), no aquí.

### `recursos` — de `resourcesPage.content.es.ts`

`resources_head_badge`, `resources_head_title`, `resources_head_lead`, `resources_head_search_placeholder`, `resources_cta_title`, `resources_cta_lead`, `resources_cta_button`, `resources_guides_title`.

### `empresa` — de `companyPage.content.es.ts`

`company_hero_kicker`, `company_hero_title_lead`, `company_hero_title_accent`, `company_hero_lead`, `company_mission_title`, `company_mission_paragraphs` (textarea, un párrafo por línea), `company_partners_title`, `company_partners_intro`, `company_cta_title`, `company_cta_lead`. Los `partners.items` (5 logos fijos con nombre/nota/rol) quedan como CPT `partner` si se necesita editar sin tocar código, o se dejan fijos en código por ahora (fuera de alcance fase 1 salvo que se pida).

### `not-found` — de `notFoundPage.content.es.ts`

`notfound_title`, `notfound_lead`, `notfound_cta_label`.

## CPTs (colecciones repetibles, sustituyen a ACF Repeater)

### `faq` — de `mainPage.content.es.ts` → `faq.items`

- Título del post = pregunta (`q`).
- Campo ACF `answer` (Textarea) = respuesta (`a`).
- `menu_order` = orden de aparición.

### `feature` — de `mainPage.content.es.ts` → `features.items`

- Título del post = `title`.
- Campo ACF `body` (Textarea) = `body`.
- `menu_order` = orden (0 = feature destacada/lead).
- El icono (`Sparkles`/`Wand2`/`Search` de lucide-react) se mantiene asociado por posición en código, no editable desde WP en fase 1.

### `guide` — de `src/ui/pages/ResourcesPage/content/guides.content.es.ts` → `GUIDES`

- Slug del post = `slug` (usado en la URL `/recursos/guias/:slug`).
- Título del post = `title`.
- Campo ACF `intro` (Textarea) = `intro`.
- Campo ACF `steps` (Textarea, **un paso por línea**) = `steps` → se hace `split('\n')` en el mapper de Astro.

### `plan` — de `src/ui/pages/ShopPage/content/plans.content.es.ts` → `planTranslations`

- Título del post = `name`.
- Campo ACF `capacity` (Text) = `capacity`.
- Campo ACF `features` (Textarea, una feature por línea) = `features`.
- Precio mensual/anual y flag `highlighted`/`popular`: campos ACF adicionales `price_monthly`, `price_yearly`, `highlighted` (True/False) — no estaban en `plans.content.es.ts` (los datos de precio real viven en `modules/billing`, InMemoryPlanRepository); revisar si ese repo pasa a ser sustituido por este CPT en una fase posterior o si conviven.

## Plugins y ajustes necesarios (recordatorio, ver plan completo)

- **Advanced Custom Fields** (`advanced-custom-fields`, ACF ≥5.11): cada grupo de campos con "Show in REST API" = Yes.
- **Polylang** (`polylang`): activar traducción en cada página-singleton y en cada CPT (`faq`, `feature`, `guide`, `plan`).
- CPTs registrados por código en `wordpress/wp-content/mu-plugins/kai-content-types.php` (no CPT UI), con `show_in_rest: true`.
- Field groups versionados en `wordpress/acf-json/` (ACF Local JSON).
