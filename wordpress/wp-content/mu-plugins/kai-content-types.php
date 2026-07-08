<?php
/**
 * Plugin Name: KAI Content Types
 * Description: Registra los CPTs que alimentan el contenido de kai-web (faq, feature, guide, plan).
 *              Registrados por codigo (no CPT UI) para que el modelado viva versionado en git.
 */

if (!defined('ABSPATH')) exit;

add_action('init', function () {
    register_post_type('faq', [
        'label' => 'FAQ',
        'labels' => [
            'name' => 'FAQ',
            'singular_name' => 'Pregunta frecuente',
            'add_new_item' => 'Añadir pregunta',
            'edit_item' => 'Editar pregunta',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'faq',
        'supports' => ['title', 'page-attributes'],
        'menu_icon' => 'dashicons-editor-help',
        'has_archive' => false,
        'rewrite' => false,
    ]);

    register_post_type('feature', [
        'label' => 'Features',
        'labels' => [
            'name' => 'Features',
            'singular_name' => 'Feature',
            'add_new_item' => 'Añadir feature',
            'edit_item' => 'Editar feature',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'feature',
        'supports' => ['title', 'page-attributes'],
        'menu_icon' => 'dashicons-star-filled',
        'has_archive' => false,
        'rewrite' => false,
    ]);

    register_post_type('guide', [
        'label' => 'Guías',
        'labels' => [
            'name' => 'Guías',
            'singular_name' => 'Guía',
            'add_new_item' => 'Añadir guía',
            'edit_item' => 'Editar guía',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'guide',
        'supports' => ['title', 'page-attributes'],
        'menu_icon' => 'dashicons-book-alt',
        'has_archive' => false,
        // El slug de la guia (/recursos/guias/:slug) = slug del post, sin prefijo de ruta propio.
        'rewrite' => ['slug' => 'guide'],
    ]);

    register_post_type('plan', [
        'label' => 'Planes',
        'labels' => [
            'name' => 'Planes',
            'singular_name' => 'Plan',
            'add_new_item' => 'Añadir plan',
            'edit_item' => 'Editar plan',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'plan',
        'supports' => ['title', 'page-attributes'],
        'menu_icon' => 'dashicons-cart',
        'has_archive' => false,
        'rewrite' => false,
    ]);
});

/**
 * Activa los 4 CPTs en Polylang si el plugin esta activo (Idiomas > Ajustes > Tipos
 * de contenido personalizados los detecta automaticamente cuando show_in_rest=true
 * y son publicos, pero forzamos el filtro por si acaso el ajuste no se marca a mano).
 */
add_filter('pll_get_post_types', function (array $post_types) {
    return array_merge($post_types, [
        'faq' => 'faq',
        'feature' => 'feature',
        'guide' => 'guide',
        'plan' => 'plan',
    ]);
});
