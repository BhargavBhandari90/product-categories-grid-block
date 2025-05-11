# WooCommerce Categories Carousel Block

A Gutenberg block that displays WooCommerce categories in a carousel with AJAX product loading. Built with the WordPress Interactivity API.

## Features

- Responsive carousel display of WooCommerce product categories
- Customizable number of categories per slide
- Optional autoplay with configurable delay
- AJAX loading of products when clicking on a category
- Modern UI with smooth transitions
- Built using the WordPress Interactivity API for optimal performance

## Requirements

- WordPress 6.4 or higher
- WooCommerce 8.0 or higher
- PHP 7.4 or higher

## Installation

1. Upload the `woo-categories-carousel-block` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Add the "WooCommerce Categories Carousel" block to your posts or pages using the block editor

## Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Block Settings

- **Categories per slide**: Choose how many categories to display per slide (1-6)
- **Enable autoplay**: Toggle automatic sliding of categories
- **Autoplay delay**: Set the delay between slides when autoplay is enabled (1000-10000ms)

## License

GPL v2 or later 