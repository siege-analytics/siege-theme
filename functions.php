<?php
/**
 * Siege Analytics Theme Functions
 *
 * @package siege-theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme setup.
 */
function siege_theme_setup() {
	// Add support for block styles.
	add_theme_support( 'wp-block-styles' );

	// Add support for post thumbnails (featured images).
	add_theme_support( 'post-thumbnails' );

	// Add support for responsive embeds.
	add_theme_support( 'responsive-embeds' );

	// Add support for editor styles.
	add_theme_support( 'editor-styles' );

	// Add support for HTML5 markup.
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );

	// Add support for automatic feed links (blog RSS).
	add_theme_support( 'automatic-feed-links' );

	// Add support for custom logo.
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 300,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	// Register navigation menus.
	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'siege-theme' ),
		'footer'  => __( 'Footer Navigation', 'siege-theme' ),
	) );
}
add_action( 'after_setup_theme', 'siege_theme_setup' );

/**
 * Enqueue additional styles beyond theme.json.
 */
function siege_theme_enqueue_styles() {
	wp_enqueue_style(
		'siege-theme-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);

	wp_enqueue_style(
		'siege-theme-custom',
		get_theme_file_uri( 'assets/css/custom.css' ),
		array( 'siege-theme-style' ),
		wp_get_theme()->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'siege_theme_enqueue_styles' );

/**
 * Register block pattern categories.
 */
function siege_theme_register_pattern_categories() {
	register_block_pattern_category( 'siege-hero', array(
		'label' => __( 'Siege Hero Sections', 'siege-theme' ),
	) );
	register_block_pattern_category( 'siege-services', array(
		'label' => __( 'Siege Services', 'siege-theme' ),
	) );
	register_block_pattern_category( 'siege-content', array(
		'label' => __( 'Siege Content', 'siege-theme' ),
	) );
}
add_action( 'init', 'siege_theme_register_pattern_categories' );
