<?php
/**
 * Server-side rendering of the WooCommerce Categories Carousel block.
 *
 * @package WooCommerce Categories Carousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$product_categories = $attributes['productCategories'];

if ( empty( $product_categories ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'               => 'wc-categories-carousel',
		'data-wp-interactive' => 'buntywp/categories-grid',
		'data-wp-watch'       => 'callbacks.watchCategories',
		'style'               => '--categories-per-row:' . intval( $attributes['catsPerRow'] ) . '; ',
		'data-wp-context'     => wp_json_encode(
			array(
				'catsPerRow'       => $attributes['catsPerRow'],
				'productCats'      => $product_categories,
				'currentSlide'     => 0,
				'selectedCategory' => 0,
			)
		),
	)
);

	wp_interactivity_state(
		'buntywp/categories-grid',
		array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'bwp_wcc_ajax_nonce' ),
		)
	);

	?>
	<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
		<div class="wc-categories-wrapper">
				<?php
				foreach ( $product_categories as $category ) {
					$background_image = ! empty( $category['imageUrl'] ) ? $category['imageUrl'] : '';
					?>
				<div
					class="category-slide"
					data-category-id="<?php echo esc_attr( $category['id'] ); ?>"
					data-category-name="<?php echo esc_attr( $category['name'] ); ?>"
					data-wp-on--click="actions.loadProducts"
					style="background-image: url( '<?php echo esc_url( $background_image ); ?>' ); background-size: cover; background-position: center;"
				>
					<h4><?php echo esc_attr( $category['name'] ); ?></h4>
				</div>
				<?php } ?>
		</div>
		<div
			class="wc-products-modal"
			data-wp-class--open="state.showProducts"
		>
			<div class="wc-products-backdrop" data-wp-on--click="actions.closeModal"></div>

			<div class="wc-products-popup">
				<button class="wc-products-close" data-wp-on--click="actions.closeModal">×</button>
				<div class="bwp-cat-title">
					<h2 data-wp-text="state.selectedCategoryName"></h2>
				</div>
				<div class="products-loading" data-wp-bind--hidden="!state.loading">
					<?php esc_html_e( 'Loading products...', 'woo-categories-grid' ); ?>
				</div>
				<div class="products-grid" data-wp-bind--data-cat="state.selectedCategory" data-wp-bind--hidden="state.loading"></div>
				<div class="bwp-category-link" data-wp-bind--hidden="state.loading">
					<a class="view-product" href="#"><?php esc_html_e( 'Go to Category', 'woo-categories-grid' ); ?></a>
				</div>
			</div>
		</div>
	</div>
	<?php
