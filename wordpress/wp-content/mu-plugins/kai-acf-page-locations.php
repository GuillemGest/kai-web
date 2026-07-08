<?php
/**
 * Plugin Name: KAI ACF Page Locations
 * Description: Resuelve las location rules de ACF "page == {slug}" usando el slug de
 *              la pagina en vez del post ID (que no se conoce hasta crear la pagina en wp-cli).
 *              Los field groups en acf-json/*.json usan "value": "kai_page_{slug}" como
 *              marcador; aqui se traduce a la comparacion real contra el post actual.
 */

if (!defined('ABSPATH')) exit;

add_filter('acf/location/rule_match/page', function ($match, $rule, $options) {
    if (!isset($options['post_id']) || strpos($rule['value'], 'kai_page_') !== 0) {
        return $match;
    }

    $expected_slug = str_replace('kai_page_', '', $rule['value']);
    $post = get_post($options['post_id']);
    if (!$post) return false;

    $is_match = $post->post_name === $expected_slug;
    return $rule['operator'] === '!=' ? !$is_match : $is_match;
}, 10, 3);
