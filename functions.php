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
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 300,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'siege-theme' ),
		'footer'  => __( 'Footer Navigation', 'siege-theme' ),
	) );
}
add_action( 'after_setup_theme', 'siege_theme_setup' );

/**
 * Enqueue Google Fonts and theme styles.
 */
function siege_theme_enqueue_styles() {
	// Google Fonts: Inter (body) + JetBrains Mono (data/code)
	wp_enqueue_style(
		'siege-google-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'siege-theme-style',
		get_stylesheet_uri(),
		array( 'siege-google-fonts' ),
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
 * Enqueue Google Fonts in the block editor too.
 */
function siege_theme_editor_styles() {
	add_editor_style(
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'
	);
}
add_action( 'after_setup_theme', 'siege_theme_editor_styles' );

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
