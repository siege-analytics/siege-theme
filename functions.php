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
 * Footer coordinate randomizer.
 *
 * Picks one coordinate system at random on each page load.
 * Each links to the map service that uses that system.
 */
function siege_theme_coordinate_script() {
	?>
	<script>
	document.addEventListener('DOMContentLoaded', function() {
		var el = document.getElementById('siege-coords');
		if (!el) return;
		var coords = [
			{ text: '30.2672\u00b0N, 97.7431\u00b0W', href: 'https://www.google.com/maps/@30.2672,-97.7431,13z', title: 'WGS84 \u2192 Google Maps' },
			{ text: 'UTM 14R 621235 3349937', href: 'https://www.openstreetmap.org/#map=13/30.2672/-97.7431', title: 'UTM \u2192 OpenStreetMap' },
			{ text: 'MGRS 14RNU2123549937', href: 'https://www.bing.com/maps?cp=30.2672~-97.7431&lvl=13', title: 'MGRS \u2192 Bing Maps' },
			{ text: 'SPCS TX-C 3083 (EPSG:2277)', href: 'https://epsg.io/2277-1702/map#13/30.2672/-97.7431', title: 'State Plane \u2192 epsg.io' }
		];
		var pick = coords[Math.floor(Math.random() * coords.length)];
		var a = document.createElement('a');
		a.href = pick.href;
		a.textContent = pick.text;
		a.title = pick.title;
		a.target = '_blank';
		a.rel = 'noopener';
		a.style.color = 'inherit';
		el.appendChild(a);
	});
	</script>
	<?php
}
add_action( 'wp_footer', 'siege_theme_coordinate_script' );

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

/**
 * Allow SVG uploads.
 *
 * SVGs are used for logo, illustrations, and data visualizations.
 * WordPress blocks SVG by default; this adds it to allowed MIME types.
 */
function siege_theme_allow_svg( $mimes ) {
	$mimes['svg']  = 'image/svg+xml';
	$mimes['svgz'] = 'image/svg+xml';
	return $mimes;
}
add_filter( 'upload_mimes', 'siege_theme_allow_svg' );

/**
 * Fix SVG display in media library.
 */
function siege_theme_fix_svg_display( $response, $attachment, $meta ) {
	if ( $response['mime'] === 'image/svg+xml' ) {
		$response['sizes'] = array(
			'full' => array(
				'url' => $response['url'],
			),
		);
	}
	return $response;
}
add_filter( 'wp_prepare_attachment_for_js', 'siege_theme_fix_svg_display', 10, 3 );
