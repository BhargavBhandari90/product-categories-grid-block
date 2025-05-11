import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { media, trash } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { catsPerRow, productCategories } = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--categories-per-row': catsPerRow,
		},
	} );

	const categories = useSelect( ( select ) => {
		const { getEntityRecords } = select( 'core' );
		return getEntityRecords( 'taxonomy', 'product_cat', {
			per_page: 99,
			hide_empty: true,
			fields: 'id=>name',
		} );
	}, [] );

	const selectedIds = ( productCategories || [] ).map( ( cat ) => cat.id );

	const categoryOptions = categories
		? categories.map( ( cat ) => ( {
				label: cat.name,
				value: String( cat.id ),
		  } ) )
		: [];

	const handleChange = ( selected ) => {
		const selectedArray = selected.map( ( id ) => {
			const name =
				categoryOptions.find( ( opt ) => {
					return parseInt( opt.value ) === parseInt( id );
				} )?.label || '';

			return { id, name };
		} );

		setAttributes( { productCategories: selectedArray } );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Carousel Settings',
						'product-categories-grid-block'
					) }
				>
					<RangeControl
						__nextHasNoMarginBottom
						label={ __(
							'Categories per row',
							'product-categories-grid-block'
						) }
						value={ catsPerRow }
						onChange={ ( value ) =>
							setAttributes( { catsPerRow: value } )
						}
						min={ 1 }
						max={ 6 }
						__next40pxDefaultSize={ true }
					/>
				</PanelBody>
				<PanelBody
					title={ __(
						'Select Categories',
						'product-categories-grid-block'
					) }
					initialOpen={ false }
				>
					{ productCategories ? (
						<SelectControl
							multiple
							__next40pxDefaultSize={ true }
							label={ __(
								'Choose categories to show',
								'product-categories-grid-block'
							) }
							value={ selectedIds }
							options={ categoryOptions }
							onChange={ ( selected ) => {
								handleChange(
									Array.isArray( selected )
										? selected.map( Number )
										: [ Number( selected ) ]
								);
							} }
						/>
					) : (
						<p>
							{ __(
								'Loading categories &hellip;',
								'product-categories-grid-block'
							) }
						</p>
					) }
				</PanelBody>
			</InspectorControls>
			<div className="wc-categories-wrapper">
				{ productCategories.length ? (
					productCategories.map( ( cat, index ) => (
						<div
							key={ index }
							className="category-slide"
							style={ {
								backgroundImage: cat.imageUrl
									? `url(${ cat.imageUrl })`
									: undefined,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							} }
						>
							<MediaUpload
								onSelect={ ( bgImage ) => {
									if ( bgImage && bgImage.url ) {
										const updatedCategories = [
											...productCategories,
										];
										updatedCategories[ index ] = {
											...updatedCategories[ index ],
											imageUrl: bgImage.url,
										};
										setAttributes( {
											productCategories:
												updatedCategories,
										} );
									}
								} }
								allowedTypes={ [ 'image' ] }
								type="image"
								render={ ( { open } ) => (
									<div className="bwp-action-button-container">
										{ cat.imageUrl ? (
											<>
												<Button
													className="bwp-remove-button"
													onClick={ () => {
														const updatedCategories =
															[
																...productCategories,
															];
														updatedCategories[
															index
														] = {
															...updatedCategories[
																index
															],
															imageUrl: '',
														};
														setAttributes( {
															productCategories:
																updatedCategories,
														} );
													} }
													variant="primary"
													icon={ trash }
												></Button>
												<Button
													className="bwp-upload-button"
													onClick={ open }
													variant="primary"
													icon={ media }
												></Button>
											</>
										) : (
											<Button
												className="bwp-upload-button"
												onClick={ open }
												variant="primary"
												icon={ media }
											></Button>
										) }
									</div>
								) }
							/>
							<h4>{ cat.name }</h4>
						</div>
					) )
				) : (
					<p>
						{ __(
							'Please select category &hellip;',
							'product-categories-grid-block'
						) }
					</p>
				) }
			</div>
		</div>
	);
}
