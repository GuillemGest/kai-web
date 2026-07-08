# WordPress para kai-web

Este directorio contiene solo la infraestructura como código de WordPress: el modelado de contenido (CPTs, campos ACF) que se sube al hosting. La base de datos y los uploads NO se versionan.

## Hosting (fase de pruebas)

WordPress.org autoalojado en **InfinityFree** (gratis, permite plugins — WordPress.com gratis NO lo permite). Cuando el proyecto lo requiera, se migra a un hosting WordPress de pago (Hostinger, SiteGround...) sin cambiar nada de lo de aquí: el modelado (CPTs + ACF) es el mismo en cualquier hosting.

## Qué hay en este directorio

- `wp-content/mu-plugins/kai-content-types.php`: registra los CPTs `faq`, `feature`, `guide`, `plan` (con `show_in_rest` activo) y los habilita en Polylang.
- `wp-content/mu-plugins/kai-acf-page-locations.php`: hace que los field groups de ACF con location "page == kai_page_{slug}" se apliquen por **slug** de página en vez de por ID numérico (necesario porque el ID no existe hasta crear la página a mano en el admin).
- `acf-json/*.json`: los field groups de ACF (Local JSON) — página `home`, `header`, `footer`, `planes`, `recursos`, `empresa`, `not-found`, y los CPTs `faq`, `feature`, `guide`, `plan`. Ver el mapeo completo en [`../docs/wordpress-content-mapping.md`](../docs/wordpress-content-mapping.md).

## Pasos para montarlo en InfinityFree

1. **Crear cuenta y hosting** en [infinityfree.com](https://infinityfree.com) → "Create Account" → dentro del panel, crear un hosting nuevo (te da un subdominio gratis tipo `algo.infinityfreeapp.com`, o puedes apuntar tu propio dominio si tenéis uno).
2. **Instalar WordPress** desde el Auto Installer / Softaculous del panel de InfinityFree, apuntando al dominio creado. Guarda usuario y contraseña de `wp-admin`.
3. **Subir los mu-plugins y acf-json** por FTP (InfinityFree da acceso FTP en el panel — usa FileZilla o similar):
   - Sube el contenido de `wp-content/mu-plugins/` a `/htdocs/wp-content/mu-plugins/` del hosting (crea la carpeta `mu-plugins` si no existe).
   - Sube el contenido de `acf-json/` a `/htdocs/wp-content/themes/{tema-activo}/acf-json/` (crea la carpeta si no existe). Sustituye `{tema-activo}` por el tema que tenga instalado WordPress (por defecto suele ser `twentytwentyfour` o similar — compruébalo en Apariencia > Temas).
4. **Instalar plugins** desde `wp-admin` → Plugins → Añadir nuevo: buscar e instalar **Advanced Custom Fields** y **Polylang**, activar ambos.
5. **Configurar Polylang** (Idiomas → Ajustes): añadir es (por defecto, sin prefijo en URL), en, ca.
6. **Crear las 7 páginas-singleton** manualmente desde Páginas → Añadir nueva, con estos slugs exactos (el slug se define en el campo "Enlace permanente" al editar la página): `home`, `header`, `footer`, `planes`, `recursos`, `empresa`, `not-found`. Publícalas vacías — los campos ACF aparecerán automáticamente al editarlas (gracias a `acf-json/`).
7. **Rellenar los campos ACF** de cada página con los textos actuales — la referencia completa está en [`../docs/wordpress-content-mapping.md`](../docs/wordpress-content-mapping.md) (qué campo corresponde a qué texto).
8. **Crear los posts de `faq`, `feature`, `guide`** desde sus menús correspondientes en el admin (aparecen en el menú lateral una vez el mu-plugin `kai-content-types.php` está activo), con los mismos textos.

## Verificar

```bash
curl "https://TU-DOMINIO/wp-json/wp/v2/pages?slug=home&acf_format=standard&_fields=slug,acf"
curl "https://TU-DOMINIO/wp-json/wp/v2/faq?orderby=menu_order&order=asc&_fields=id,title,menu_order,acf"
curl "https://TU-DOMINIO/wp-json/wp/v2/guide?_fields=slug,title,acf"
```

Deberías ver JSON con los campos `acf.*` rellenos con los textos.

## Notas

- Si `wp-json` no responde: en InfinityFree a veces hay que revisar Ajustes → Enlaces permanentes y volver a guardar (regenera las reglas de reescritura de Apache).
- `acf-json/` son los field groups versionados en git — si los editas desde el admin de WordPress, ACF los vuelve a exportar ahí automáticamente (necesitarías FTP de vuelta para traerlos al repo, o editarlos aquí y volver a subir).
- Producción futura: mismo modelado (`mu-plugins/` + `acf-json/`), solo cambia el hosting.
