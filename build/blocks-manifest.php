<?php
// This file is generated. Do not modify it manually.
return array(
	'categories-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'buntywp/categories-grid',
		'version' => '1.0.0',
		'title' => 'Categories Grid for WooCommerce',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => 'Display WooCommerce categories in a grid with popup with product loading.',
		'supports' => array(
			'html' => false,
			'interactivity' => array(
				'clientNavigation' => true
			),
			'color' => array(
				'background' => true,
				'text' => true
			),
			'shadow' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'__experimentalBorder' => array(
				'radius' => true,
				'color' => true,
				'width' => true,
				'style' => true,
				'__experimentalDefaultControls' => array(
					'color' => true,
					'radius' => true
				)
			)
		),
		'attributes' => array(
			'catsPerRow' => array(
				'type' => 'number',
				'default' => 3
			),
			'productCategories' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'catsPerRow' => '2',
				'productCategories' => array(
					array(
						'id' => '1',
						'name' => 'Cat 1'
					),
					array(
						'id' => '2',
						'name' => 'Cat 2'
					),
					array(
						'id' => '3',
						'name' => 'Cat 3'
					),
					array(
						'id' => '4',
						'name' => 'Cat 4'
					)
				)
			)
		),
		'textdomain' => 'product-categories-grid-block',
		'editorScript' => 'file:./index.js',
		'viewScriptModule' => array(
			'file:./view.js',
			'file:./interactivity.js'
		),
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	)
);
