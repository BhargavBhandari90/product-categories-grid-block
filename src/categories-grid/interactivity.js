import { getContext, store, withScope } from '@wordpress/interactivity';

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

				if ( data.success ) {
					data.data.products.forEach( ( product ) => {
						const card = document.createElement( 'div' );
						card.className = 'product-card';

						const image = document.createElement( 'img' );
						image.src = product.image;
						image.alt = product.title;

						const title = document.createElement( 'h3' );
						title.textContent = product.title;

						const price = document.createElement( 'div' );
						price.className = 'price';
						// The price comes from WooCommerce's get_price_html(),
						// server-generated markup rather than user-controlled text.
						price.innerHTML = product.price; // eslint-disable-line no-unsanitized/property

						const link = document.createElement( 'a' );
						link.href = product.link;
						link.className = 'view-product';
						link.textContent = state.i18n.viewProduct;

						card.append( image, title, price, link );
						productsGrid.append( card );
					} );

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
			// getContext() (used by closeModal()) only resolves inside a
			// directive-bound call, which a raw `window` listener isn't;
			// withScope() re-attaches this element's scope to the callback.
			window.addEventListener(
				'keydown',
				withScope( ( event ) => {
					if ( 'Escape' === event.key ) {
						store( 'buntywp/categories-grid' ).actions.closeModal();
					}
				} )
			);
		},
	},
} );
