<?php
/**
 * Plugin Name: Product Categories Grid for WooCommerce
 * Description: A Gutenberg block that displays WooCommerce categories in a grid with popup displaying products from the category.
 * Version: 1.0.0
 * Author: BuntyWP
 * Author URI: https://biliplugins.com/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: product-categories-grid-block
 * Requires Plugins: woocommerce
 *
 * @package Woo_Categories_Grid
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main file, contains the plugin metadata and activation processes
 *
 * @package    Woo_Categories_Grid
 * @subpackage Main
 */
if ( ! defined( 'PCGB_VERSION' ) ) {
	/**
	 * The version of the plugin.
	 */
	define( 'PCGB_VERSION', '1.0.0' );
}
if ( ! defined( 'PCGB_PATH' ) ) {
	/**
	 *  The server file system path to the plugin directory.
	 */
	define( 'PCGB_PATH', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'PCGB_URL' ) ) {
	/**
	 * The url to the plugin directory.
	 */
	define( 'PCGB_URL', plugin_dir_url( __FILE__ ) );
}
if ( ! defined( 'PCGB_BASE_NAME' ) ) {
	/**
	 * The url to the plugin directory.
	 */
	define( 'PCGB_BASE_NAME', plugin_basename( __FILE__ ) );
}

/**
 * Register blocks.
 *
 * @return void
 */
function pcgb_block_init() {

	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}

	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'pcgb_block_init' );

/**
 * Register styles for the block.
 *
 * @return void
 */
function pcgb_block_styles() {

	register_block_style(
		'buntywp/categories-grid',
		array(
			'name'         => 'dark-mode',
			'label'        => __( 'Dark Mode', 'product-categories-grid-block' ),
			'style_handle' => 'pcgb-style',
		)
	);

	register_block_style(
		'buntywp/categories-grid',
		array(
			'name'         => 'rosewater', // #E8B4B8.
			'label'        => __( 'Rosewater', 'product-categories-grid-block' ),
			'style_handle' => 'pcgb-style',
		)
	);

	register_block_style(
		'buntywp/categories-grid',
		array(
			'name'         => 'navy-blue', // #000C66.
			'label'        => __( 'Navy Blue', 'product-categories-grid-block' ),
			'style_handle' => 'pcgb-style',
		)
	);

	register_block_style(
		'buntywp/categories-grid',
		array(
			'name'         => 'rose-red', // #AA1945.
			'label'        => __( 'Rose Red', 'product-categories-grid-block' ),
			'style_handle' => 'pcgb-style',
		)
	);

	register_block_style(
		'buntywp/categories-grid',
		array(
			'name'         => 'teal-green', // #167D7F.
			'label'        => __( 'Teal Green', 'product-categories-grid-block' ),
			'style_handle' => 'pcgb-style',
		)
	);
}

add_action( 'wp_loaded', 'pcgb_block_styles' );

/**
 * AJAX handler for fetching products
 */
function pcgb_get_category_products() {

	check_ajax_referer( 'pcgb_ajax_nonce', 'nonce' );

	$category_id = isset( $_POST['category_id'] ) ? intval( $_POST['category_id'] ) : 0;

	if ( ! $category_id ) {
		wp_send_json_error( 'Invalid category ID' );
		return;
	}

	$response = get_transient( 'pcgb_category_products_' . $category_id );
	if ( $response ) {
		wp_send_json_success( $response );
		return;
	}

	$args = array(
		'post_type'              => 'product',
		'posts_per_page'         => 10,
		'no_found_rows'          => true,
		'fields'                 => 'ids',
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
		'tax_query'              => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			array(
				'taxonomy'         => 'product_cat',
				'field'            => 'term_id',
				'terms'            => $category_id,
				'include_children' => false,
			),
		),
	);

	$products = new WP_Query( $args );
	$response = array();

	if ( $products->have_posts() ) {
		while ( $products->have_posts() ) {
			$products->the_post();
			$product = wc_get_product( get_the_ID() );

			$response[] = array(
				'id'    => get_the_ID(),
				'title' => get_the_title(),
				'price' => $product->get_price_html(),
				'image' => get_the_post_thumbnail_url( get_the_ID(), 'medium' ),
				'link'  => get_permalink(),
			);
		}
		wp_reset_postdata();

		$data = array(
			'products'      => $response,
			'category_link' => get_category_link( $category_id ),
		);

		set_transient( 'pcgb_category_products_' . $category_id, $data, 6 * HOUR_IN_SECONDS );

	}

	wp_send_json_success( $data );
}
add_action( 'wp_ajax_pcgb_get_category_products', 'pcgb_get_category_products' );
add_action( 'wp_ajax_nopriv_pcgb_get_category_products', 'pcgb_get_category_products' );
