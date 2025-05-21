import { getContext, store } from '@wordpress/interactivity';

store( 'buntywp/categories-grid', {
	state: () => ( {
		selectedCategory: null,
		selectedCategoryName: null,
		loading: false,
		showProducts: false,
	} ),
	actions: {
		async loadProducts( event ) {
			const context = getContext();
			const block = event.target.closest( '[data-wp-interactive]' );
			const state = store( 'buntywp/categories-grid' ).state;

			const categoryEl = event.target.closest( '.category-slide' );
			const categoryId = categoryEl?.dataset.categoryId;
			const categoryName = categoryEl?.dataset.categoryName;
			const productsGrid = block.querySelector( '.products-grid' );
			const gridCategory = productsGrid?.dataset.cat;

			context.showProducts = true;
			context.selectedCategory = categoryId;
			context.selectedCategoryName = categoryName;

			if ( gridCategory === categoryId ) return;

			context.loading = true;
			productsGrid.innerHTML = '';

			try {
				const response = await fetch( state.ajaxUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams( {
						action: 'pcgb_get_category_products',
						nonce: state.nonce,
						category_id: categoryId,
					} ),
				} );

				const data = await response.json();

				console.log( 'data', data );

				if ( data.success ) {
					productsGrid.innerHTML = data.data.products
						.map(
							( product ) => `
							<div class="product-card">
								<img src="${ product.image }" alt="${ product.title }" />
								<h3>${ product.title }</h3>
								<div class="price">${ product.price }</div>
								<a href="${ product.link }" class="view-product">View Product</a>
							</div>
						`
						)
						.join( '' );

					block
						.querySelectorAll( '.bwp-category-link a' )
						.forEach( ( el ) =>
							el.setAttribute( 'href', data.data.category_link )
						);
				}
			} catch ( error ) {
				console.error( 'Fetch error:', error );
			} finally {
				context.loading = false;
			}
		},
		closeModal() {
			const context = getContext();
			context.showProducts = false;
		},
	},

	callbacks: {
		watchCategories() {
			window.addEventListener( 'keydown', ( event ) => {
				if ( 'Escape' === event.key ) {
					store( 'buntywp/categories-grid' ).actions.closeModal();
				}
			} );
		},
	},
} );
