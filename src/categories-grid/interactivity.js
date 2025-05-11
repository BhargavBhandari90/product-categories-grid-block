import { store } from '@wordpress/interactivity';

store( 'buntywp/categories-grid', {
	state: {
		selectedCategory: null,
		selectedCategoryName: null,
		loading: false,
		showProducts: false,
	},
	actions: {
		async loadProducts( event ) {
			const state = store( 'buntywp/categories-grid' ).state;
			const categoryId =
				event.target.closest( '.category-slide' ).dataset.categoryId;
			const categoryName =
				event.target.closest( '.category-slide' ).dataset.categoryName;
			const productsGrid = document.querySelector( '.products-grid' );
			const gridCategory = productsGrid.dataset.cat;

			state.showProducts = true;
			state.selectedCategory = categoryId;
			state.selectedCategoryName = categoryName;

			if ( gridCategory === categoryId ) {
				return;
			}

			state.loading = true;
			productsGrid.innerHTML = '';

			try {
				const response = await fetch( state.ajaxUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams( {
						action: 'wcc_get_category_products',
						nonce: state.nonce,
						category_id: categoryId,
					} ),
				} );

				const data = await response.json();

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
					document
						.querySelectorAll( '.bwp-category-link a' )
						.forEach( ( el ) => {
							el.setAttribute( 'href', data.data.category_link );
						} );
				}
			} catch ( error ) {
				return false;
			} finally {
				state.loading = false;
			}
		},
		closeModal() {
			const state = store( 'buntywp/categories-grid' ).state;
			state.showProducts = false;
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
