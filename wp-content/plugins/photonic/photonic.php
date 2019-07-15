<?php
/**
 * Plugin Name: Photonic Gallery & Lightbox for Flickr, SmugMug, Google Photos, Zenfolio and Instagram
 * Plugin URI: https://aquoid.com/plugins/photonic/
 * Description: Extends the native gallery to support Flickr, SmugMug, Google Photos, Zenfolio and Instagram. JS libraries like Swipebox, Fancybox, PhotoSwipe, Magnific, Colorbox, PrettyPhoto, Image Lightbox, Featherlight, Lightcase and Lightgallery are supported. Photos are displayed in grids of square or circular thumbnails, or slideshows, or justified or masonry or random mosaic layouts. The plugin also extends all layout options to a regular WP gallery.
 * Version: 2.27
 * Author: Sayontan Sinha
 * Author URI: https://mynethome.net/
 * License: GNU General Public License (GPL), v3 (or newer)
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: photonic
 *
 * Copyright (c) 2011 - 2019 Sayontan Sinha. All rights reserved.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

class Photonic {
	var $version, $registered_extensions, $defaults, $plugin_name, $options_page_name, $settings_page, $helper_page, $getting_started_page, $authentication_page, $gutenberg_page, $localized, $script_type;
	function __construct() {
//		$start = microtime(true);
		global $photonic_options, $photonic_setup_options, $photonic_is_IE, $photonic_default_options;
		if (!defined('PHOTONIC_VERSION')) {
			define('PHOTONIC_VERSION', '2.27');
		}

		if (!defined('PHOTONIC_PATH')) {
			define('PHOTONIC_PATH', plugin_dir_path(__FILE__));
		}

		if (!defined('PHOTONIC_URL')) {
			define('PHOTONIC_URL', plugin_dir_url(__FILE__));
		}

		$upload_dir = wp_upload_dir();
		if (!defined('PHOTONIC_UPLOAD_DIR')) {
			define('PHOTONIC_UPLOAD_DIR', trailingslashit($upload_dir['basedir']).'photonic');
		}

		if (!defined('PHOTONIC_UPLOAD_URL')) {
			define('PHOTONIC_UPLOAD_URL', trailingslashit($upload_dir['baseurl']).'photonic');
		}

		//WP provides a global $is_IE, but we specifically need to find IE6x (or, heaven forbid, IE5x). Note that older versions of Opera used to identify themselves as IE6, so we exclude Opera.
		$photonic_is_IE = preg_match('/MSIE [56789]/i', $_SERVER['HTTP_USER_AGENT']);

		require_once(plugin_dir_path(__FILE__)."/options/photonic-options.php");
		require_once(plugin_dir_path(__FILE__)."/options/defaults.php");

		$this->plugin_name = plugin_basename(__FILE__);
		$this->localized = false;

		add_action('admin_menu', array(&$this, 'add_admin_menu'));
		add_action('admin_enqueue_scripts', array(&$this, 'add_admin_scripts'));
		add_action('admin_init', array(&$this, 'admin_init'));
		add_action('admin_notices', array(&$this, 'admin_notices'));

		$photonic_options = get_option('photonic_options');
		$set_options = isset($photonic_options) && is_array($photonic_options) ? $photonic_options : array();

		$all_options = array_merge($photonic_default_options, $set_options);

		foreach ($all_options as $key => $value) {
			$mod_key = 'photonic_'.$key;
			global ${$mod_key};
			${$mod_key} = $value;
		}

		if (is_admin()) {
			foreach ($photonic_setup_options as $default_option) {
				if (isset($default_option['id'])) {
					$default_option['std'] = $photonic_default_options[$default_option['id']];
				}
			}
		}

		if (!empty($photonic_ssl_verify_off)) {
			define('PHOTONIC_SSL_VERIFY', false);
		}
		else {
			define('PHOTONIC_SSL_VERIFY', true);
		}

		if (!empty($photonic_script_dev_mode)) {
			define('PHOTONIC_DEV_MODE', '');
		}
		else {
			define('PHOTONIC_DEV_MODE', '.min');
		}

		if (!empty($photonic_curl_timeout) && is_numeric($photonic_curl_timeout)) {
			define('PHOTONIC_CURL_TIMEOUT', $photonic_curl_timeout);
		}
		else {
			define('PHOTONIC_CURL_TIMEOUT', 10);
		}

		if (!empty($photonic_debug_on)) {
			define('PHOTONIC_DEBUG', true);
		}
		else {
			define('PHOTONIC_DEBUG', false);
		}

		add_action('admin_head', array($this, 'admin_head'));

		// Gallery
		if (!empty($photonic_alternative_shortcode)) {
			add_shortcode($photonic_alternative_shortcode, array(&$this, 'modify_gallery'));
		}
		else {
			add_filter('post_gallery', array(&$this, 'modify_gallery'), 20, 2);
		}
		add_filter('shortcode_atts_gallery', array(&$this, 'native_gallery_attributes'), 10, 3);

		add_shortcode('photonic_helper', array(&$this, 'helper_shortcode'));

		$this->script_type = array();
		add_action('wp_enqueue_scripts', array(&$this, 'always_add_styles'), 20);
		if (!empty($photonic_always_load_scripts)) {
			add_action('wp_enqueue_scripts', array(&$this, 'conditionally_add_scripts'), 20);
		}
		add_action('wp_head', array(&$this, 'print_scripts'), 20);

		global $photonic_flickr_allow_oauth, $photonic_smug_allow_oauth;
		if ($photonic_flickr_allow_oauth || $photonic_smug_allow_oauth) {
			add_action('wp_loaded', array(&$this, 'check_authentication'), 20);
		}

		add_action('wp_ajax_photonic_display_level_2_contents', array(&$this, 'display_level_2_contents'));
		add_action('wp_ajax_nopriv_photonic_display_level_2_contents', array(&$this, 'display_level_2_contents'));

		add_action('wp_ajax_photonic_display_level_3_contents', array(&$this, 'display_level_3_contents'));
		add_action('wp_ajax_nopriv_photonic_display_level_3_contents', array(&$this, 'display_level_3_contents'));

		add_action('wp_ajax_photonic_load_more', array(&$this, 'load_more'));
		add_action('wp_ajax_nopriv_photonic_load_more', array(&$this, 'load_more'));

		add_action('wp_ajax_photonic_helper_shortcode_more', array(&$this, 'helper_shortcode_more'));
		add_action('wp_ajax_nopriv_photonic_helper_shortcode_more', array(&$this, 'helper_shortcode_more'));

		add_filter('media_upload_tabs', array(&$this, 'media_upload_tabs'));
		add_action('media_upload_photonic', array(&$this, 'media_upload_photonic'));

		add_action('print_media_templates', array(&$this, 'edit_gallery'));

		add_action('wp_ajax_photonic_invoke_helper', array(&$this, 'invoke_helper'));
		add_action('wp_ajax_photonic_obtain_token', array(&$this, 'obtain_token'));
		add_action('wp_ajax_photonic_save_token', array(&$this, 'save_token_in_options'));
		add_action('wp_ajax_photonic_delete_token', array(&$this, 'delete_token_from_options'));

		$this->registered_extensions = array();
		$this->add_extensions();

		add_action('wp_ajax_photonic_authenticate', array(&$this, 'authenticate'));
		add_action('wp_ajax_nopriv_photonic_authenticate', array(&$this, 'authenticate'));

		add_action('wp_ajax_photonic_dismiss_warning', array(&$this, 'dismiss_warning'));
		add_action('wp_ajax_nopriv_photonic_dismiss_warning', array(&$this, 'dismiss_warning'));

		add_action('http_api_curl', array(&$this, 'curl_timeout'), 100, 1);

		if (empty($photonic_disable_flow_editor_global)) {
			add_action('media_buttons', array(&$this, 'add_photonic_button'));
			add_action('admin_action_photonic_flow', array(&$this, 'gallery_builder'));
			add_action('wp_ajax_photonic_flow_next_screen', array(&$this, 'flow_next_screen'));
			add_action('wp_ajax_nopriv_photonic_flow_next_screen', array(&$this, 'flow_next_screen'));
			add_action('wp_ajax_photonic_flow_more', array(&$this, 'flow_more'));
			add_action('wp_ajax_nopriv_photonic_flow_more', array(&$this, 'flow_more'));
		}

		$this->add_gutenberg_support();
		add_action('enqueue_block_editor_assets', array(&$this, 'enqueue_gutenberg_assets'));

		add_action('plugins_loaded', array(&$this, 'enable_translations'));

		add_filter('body_class', array(&$this, 'body_class'), 10, 2);
//		$end = microtime(true);
//		print_r("<!-- Photonic initialization: ".($end - $start)." -->\n");
	}

	/**
	 * @param $show_full
	 * @param bool $return_formatted
	 * @return array
	 */
	public static function get_wp_image_sizes($show_full, $return_formatted = false) {
		global $_wp_additional_image_sizes;
		$image_sizes = array();
		$standard_sizes = array('thumbnail', 'medium', 'large');
		if ($show_full) {
			$standard_sizes[] = 'full';
		}
		foreach ($standard_sizes as $standard_size) {
			if ($standard_size != 'full') {
				$image_sizes[$standard_size] = array('width' => get_option($standard_size . '_size_w'), 'height' => get_option($standard_size . '_size_h'));
			}
			else {
				$image_sizes[$standard_size] = array('width' => esc_html__('Original width', 'photonic'), 'height' => esc_html__('Original height', 'photonic'));
			}
		}
		if (is_array($_wp_additional_image_sizes)) {
			$image_sizes = array_merge($image_sizes, $_wp_additional_image_sizes);
		}

		if ($return_formatted) {
			$formatted = array();
			foreach ($image_sizes as $size_name => $size_attrs) {
				$formatted[$size_name] = "$size_name ({$size_attrs['width']} &times; {$size_attrs['height']})";
			}
			return $formatted;
		}
		return $image_sizes;
	}

	/**
	 * Adds a menu item to the "Settings" section of the admin page.
	 *
	 * @return void
	 */
	function add_admin_menu() {
		global $photonic_options_manager;
		$this->options_page_name = add_menu_page('Photonic', 'Photonic', 'edit_posts', 'photonic-options-manager', array(&$photonic_options_manager, 'render_settings_page'), plugins_url('include/images/Photonic-20-gr.png', __FILE__));
		$this->settings_page = add_submenu_page('photonic-options-manager', esc_html__('Settings', 'photonic'), esc_html__('Settings', 'photonic'), 'edit_theme_options', 'photonic-options-manager', array(&$photonic_options_manager, 'render_settings_page'));
		$this->getting_started_page = add_submenu_page('photonic-options-manager', 'Getting Started', 'Getting Started', 'edit_posts', 'photonic-getting-started', array(&$photonic_options_manager, 'render_getting_started'));
		$this->authentication_page = add_submenu_page('photonic-options-manager', 'Authentication', 'Authentication', 'edit_theme_options', 'photonic-auth', array(&$photonic_options_manager, 'render_authentication'));
		$this->gutenberg_page = add_submenu_page('photonic-options-manager', esc_html__('Prepare for Gutenberg', 'photonic'), '<div style="color: #c66">'.esc_html__('Prepare for Gutenberg', 'photonic').'</div>', 'edit_posts', 'photonic-gutenberg', array(&$photonic_options_manager, 'render_gutenberg'));
		$this->helper_page = add_submenu_page('photonic-options-manager', 'Helpers', 'Helpers', 'edit_posts', 'photonic-helpers', array(&$photonic_options_manager, 'render_helpers'));
	}

	/**
	 * Adds all scripts and their dependencies to the <head> of the Photonic administration page. This takes care to not add scripts on other admin pages.
	 *
	 * @param $hook
	 * @return void
	 */
	function add_admin_scripts($hook) {
		if ($this->options_page_name == $hook) {
			wp_enqueue_style('photonic-admin-css', plugins_url('include/css/admin.css', __FILE__), array('wp-color-picker'), $this->get_version(plugin_dir_path(__FILE__).'include/css/admin.css'));
			global $photonic_options;
			$js_array = array(
				'category' => isset($photonic_options) && isset($photonic_options['last-set-section']) ? $photonic_options['last-set-section'] : 'generic-settings',
			);
			wp_enqueue_script('photonic-options-js', plugins_url('include/scripts/admin/options-manager.js', __FILE__), array('jquery', 'wp-color-picker'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/admin/options-manager.js'));
			wp_localize_script('photonic-options-js', 'Photonic_Options_JS', $js_array);
		}
		else if ($this->helper_page == $hook || $this->authentication_page == $hook || $this->gutenberg_page == $hook) {
			wp_enqueue_script('photonic-admin-js', plugins_url('include/scripts/admin/helpers.js', __FILE__), array('jquery'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/admin/helpers.js'));
			wp_enqueue_style('photonic-admin-css', plugins_url('include/css/admin.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/admin.css'));

			$js_array = array(
				'obtain_token' => esc_attr__('Step 2: Obtain Token', 'photonic')
			);
			wp_localize_script('photonic-admin-js', 'Photonic_Admin_JS', $js_array);
		}
		else if ($this->getting_started_page == $hook) {
			wp_enqueue_style('photonic-admin-css', plugins_url('include/css/admin.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/admin.css'));
		}
		else if ('media-upload-popup' == $hook) {
			wp_enqueue_script('jquery');
			wp_enqueue_style('photonic-upload', plugins_url('include/css/admin-form.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/admin-form.css'));
		}
		else if ('post-new.php' == $hook || 'post.php' == $hook) {
			global $photonic_disable_editor, $photonic_disable_editor_post_type;
			$disabled_types = explode(',', $photonic_disable_editor_post_type);
			$post_type = empty($_REQUEST['post_type']) ? 'post' : $_REQUEST['post_type'];
			wp_enqueue_style('photonic-upload', plugins_url('include/css/admin-form.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/admin-form.css'));
			if (empty($photonic_disable_editor) && !in_array($post_type, $disabled_types)) {
				$this->prepare_mce_data();

				add_editor_style(plugins_url('include/css/admin-editor.css?'.$this->get_version(plugin_dir_path(__FILE__).'include/css/admin-editor.css'), __FILE__));
			}
		}
	}

	/**
	 * Adds all scripts and their dependencies to the end of the <body> element only on pages using Photonic.
	 *
	 * @param array $attr
	 * @return void
	 */
	function conditionally_add_scripts($attr = array()) {
		global $photonic_slideshow_library, $photonic_custom_lightbox_js, $photonic_is_IE, $photonic_custom_lightbox, $photonic_always_load_scripts,
			   $photonic_disable_photonic_lightbox_scripts, $photonic_disable_photonic_slider_scripts, $photonic_js_in_header, $photonic_thumbnail_style;

		if (isset($attr['style'])) {
			$layout = $attr['style'];
		}
		else if (isset($attr['layout'])) {
			$layout = $attr['layout'];
		}
		else if (isset($photonic_thumbnail_style)) {
			$layout = $photonic_thumbnail_style;
		}
		else {
			$layout = 'square';
		}

		$photonic_dependencies = array('jquery');

		if (empty($photonic_disable_photonic_slider_scripts) && in_array($layout, array('strip-above', 'strip-below', 'strip-right', 'no-strip'))) {
//			wp_enqueue_script('photonic-slideshow', plugins_url('include/scripts/third-party/lightslider/lightslider'.PHOTONIC_DEV_MODE.'.js', __FILE__), array('jquery'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/lightslider/lightslider'.PHOTONIC_DEV_MODE.'.js'), !($photonic_always_load_scripts && $photonic_js_in_header));
		}

		if ($photonic_is_IE && $layout == 'masonry') {
			wp_enqueue_script('photonic-ie', plugins_url('include/scripts/front-end/src/photonic-ie.js', __FILE__), array('jquery-masonry', 'photonic'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/front-end/src/photonic-ie.js'), !($photonic_always_load_scripts && $photonic_js_in_header));
		}

		if ($photonic_slideshow_library == 'thickbox') {
			wp_enqueue_script('thickbox');
			$photonic_dependencies[] = 'thickbox';
		}
		else if ($photonic_slideshow_library == 'custom') {
			$counter = 1;
			$dependencies = array('jquery');
			foreach(preg_split("/((\r?\n)|(\r\n?))/", $photonic_custom_lightbox_js) as $line){
				wp_enqueue_script('photonic-lightbox-'.$counter, trim($line), $dependencies, PHOTONIC_VERSION, !($photonic_always_load_scripts && $photonic_js_in_header));
				$photonic_dependencies[] = 'photonic-lightbox-'.$counter;
				$counter++;
			}
		}
		else if ($photonic_slideshow_library != 'none') {
			if (empty($photonic_slideshow_library)) {
				$photonic_slideshow_library = 'swipebox';
			}

			if (empty($photonic_disable_photonic_lightbox_scripts)) {
				$lb_deps = array('jquery');
				if ($photonic_slideshow_library == 'fluidbox') {
					$lb_deps[] = 'imagesloaded';
				}
				if ($photonic_slideshow_library == 'lightgallery') {
					global $photonic_enable_lg_zoom, $photonic_enable_lg_thumbnail, $photonic_enable_lg_fullscreen, $photonic_enable_lg_autoplay;
					$lightgallery_plugins = array();
					if (!empty($photonic_enable_lg_autoplay)) { $lightgallery_plugins[] = 'autoplay'; }
					if (!empty($photonic_enable_lg_fullscreen)) { $lightgallery_plugins[] = 'fullscreen'; }
					if (!empty($photonic_enable_lg_thumbnail)) { $lightgallery_plugins[] = 'thumbnail'; }
					if (!empty($photonic_enable_lg_zoom)) { $lightgallery_plugins[] = 'zoom'; }
					if (!empty($lightgallery_plugins)) {
						wp_enqueue_script('photonic-lightbox', plugins_url('include/scripts/third-party/'.$photonic_slideshow_library.'/'.$photonic_slideshow_library.PHOTONIC_DEV_MODE.'.js', __FILE__), $lb_deps, $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/'.$photonic_slideshow_library.'/'.$photonic_slideshow_library.PHOTONIC_DEV_MODE.'.js'), !($photonic_always_load_scripts && $photonic_js_in_header));
						$photonic_dependencies[] = 'photonic-lightbox';
					}
					if (PHOTONIC_DEV_MODE) {
						foreach ($lightgallery_plugins as $plugin) {
							wp_enqueue_script('photonic-lightbox-'.$plugin, plugins_url('include/scripts/third-party/'.$photonic_slideshow_library.'/lg-plugin-'.$plugin.'.min.js', __FILE__), array('photonic-lightbox'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/'.$photonic_slideshow_library.'/lg-plugin-'.$plugin.'.min.js'), !($photonic_always_load_scripts && $photonic_js_in_header));
						}
					}
					else {
						wp_enqueue_script('photonic-lightbox-plugins', plugins_url('include/scripts/third-party/'.$photonic_slideshow_library.'/lightgallery-plugins.js', __FILE__), array('photonic-lightbox'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/'.$photonic_slideshow_library.'/lightgallery-plugins.js'), !($photonic_always_load_scripts && $photonic_js_in_header));
					}
				}
				else if ($photonic_slideshow_library == 'galleria') {
					wp_enqueue_script('photonic-lightbox-theme', plugins_url('include/scripts/third-party/galleria/themes/classic/galleria.classic.min.js', __FILE__), array('photonic-lightbox'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/galleria/themes/classic/galleria.classic.min.js'), !($photonic_always_load_scripts && $photonic_js_in_header));
				}
			}
		}

		$slideshow_library = $photonic_slideshow_library == 'custom' ? $photonic_custom_lightbox : $photonic_slideshow_library;
		$slideshow_library = empty($slideshow_library) ? 'swipebox' : $slideshow_library;

		if (empty($photonic_disable_photonic_lightbox_scripts) && !($slideshow_library == 'lightgallery' && !empty($lightgallery_plugins))) {
			$script_type = 'combo';
		}
		else {
			$script_type = 'solo';
		}

		if (empty($photonic_disable_photonic_slider_scripts) && in_array($layout, array('strip-above', 'strip-below', 'strip-right', 'no-strip'))) {
			if (empty($this->script_type)) {
				$this->script_type[] = 'slider';
				wp_deregister_script('photonic');
				$this->localized = false;
			}
			$script_type .= '-slider';
		}

		wp_enqueue_script('photonic', plugins_url("include/scripts/front-end/jq/$script_type/photonic-".$slideshow_library.PHOTONIC_DEV_MODE.'.js', __FILE__), $photonic_dependencies, $this->get_version(plugin_dir_path(__FILE__)."include/scripts/front-end/jq/$script_type/photonic-".$slideshow_library.PHOTONIC_DEV_MODE.'.js'), !($photonic_always_load_scripts && $photonic_js_in_header));

		$this->localize_variables_once();
	}

	function localize_variables_once() {
		if ($this->localized) {
			return;
		}
		// Technicall JS, but needs to happen here, otherwise the script is repeated multiple times, once for each time
		// <code>conditionally_add_scripts</code> is called.
		$js_array = $this->get_localized_js_variables();
		wp_localize_script('photonic', 'Photonic_JS', $js_array);
		$this->localized = true;
	}

	/**
	 * Adds all styles to all pages because styles, if not added in the header can cause issues.
	 *
	 * @return void
	 */
	function always_add_styles() {
		global $photonic_slideshow_library, $photonic_custom_lightbox_css, $photonic_disable_photonic_lightbox_scripts, $photonic_disable_photonic_slider_scripts;

/*		if (empty($photonic_disable_photonic_slider_scripts)) {
			wp_enqueue_style("photonic-slideshow", plugins_url('include/scripts/third-party/lightslider/lightslider.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/lightslider/lightslider.css'));
		}

		if ($photonic_slideshow_library == 'thickbox') {
		}
		else if ($photonic_slideshow_library == 'custom') {
			$counter = 1;
			foreach(preg_split("/((\r?\n)|(\r\n?))/", $photonic_custom_lightbox_css) as $line){
				wp_enqueue_style('photonic-lightbox-'.$counter, trim($line), array(), PHOTONIC_VERSION);
				$counter++;
			}
		}
		else if ($photonic_slideshow_library != 'none') {
			if (empty($photonic_slideshow_library)) {
				$photonic_slideshow_library = 'swipebox';
			}

			if (empty($photonic_disable_photonic_lightbox_scripts)) {
				$this->enqueue_lightbox_styles(empty($photonic_disable_photonic_slider_scripts));
			}
		}

		wp_enqueue_style('photonic', plugins_url('include/css/front-end/core/photonic.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/front-end/core/photonic.css'));*/

		if ($photonic_slideshow_library == 'custom') {
			$counter = 1;
			foreach(preg_split("/((\r?\n)|(\r\n?))/", $photonic_custom_lightbox_css) as $line){
				wp_enqueue_style('photonic-lightbox-'.$counter, trim($line), array(), PHOTONIC_VERSION);
				$counter++;
			}
		}

		if ($photonic_slideshow_library != 'none') {
			if (empty($photonic_slideshow_library)) {
				$photonic_slideshow_library = 'swipebox';
			}
		}

		global $photonic_custom_lightbox;
		$slideshow_library = !empty($photonic_disable_photonic_lightbox_scripts) ? 'none' :
			($photonic_slideshow_library == 'custom' ? $photonic_custom_lightbox : $photonic_slideshow_library);

		$this->enqueue_lightbox_styles($slideshow_library, empty($photonic_disable_photonic_slider_scripts));

//		wp_enqueue_style('photonic', plugins_url('include/css/front-end/core/photonic.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/front-end/core/photonic.css'));

		global $photonic_css_in_file;
		$file = trailingslashit(PHOTONIC_UPLOAD_DIR).'custom-styles.css';
		if (@file_exists($file) && !empty($photonic_css_in_file)) {
			wp_enqueue_style('photonic-custom', trailingslashit(PHOTONIC_UPLOAD_URL).'custom-styles.css', array('photonic'), $this->get_version($file));
		}
	}

	function enqueue_lightbox_styles($slideshow_library = 'swipebox', $combine_slider = true) {
		$template_directory = get_template_directory();
		$stylesheet_directory = get_stylesheet_directory();

		$folder = $combine_slider ? 'combo-slider' : 'combo';

		if ($slideshow_library == 'colorbox') {
			global $photonic_cbox_theme;
			if ($photonic_cbox_theme == 'theme' && @file_exists($stylesheet_directory.'/scripts/colorbox/colorbox.css')) {
				wp_enqueue_style('photonic-lightbox', get_stylesheet_directory_uri().'/scripts/colorbox/colorbox.css', array(), PHOTONIC_VERSION);
			}
			else if ($photonic_cbox_theme == 'theme' && @file_exists($template_directory.'/scripts/colorbox/colorbox.css')) {
				wp_enqueue_style('photonic-lightbox', get_template_directory_uri().'/scripts/colorbox/colorbox.css', array(), PHOTONIC_VERSION);
			}
			else if ($photonic_cbox_theme == 'theme') {
				wp_enqueue_style('photonic-lightbox', plugins_url('include/scripts/third-party/colorbox/style-1/colorbox.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/colorbox/style-1/colorbox.css'));
			}
			else {
				wp_enqueue_style('photonic-lightbox', plugins_url('include/scripts/third-party/colorbox/style-'.$photonic_cbox_theme.'/colorbox.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/colorbox/style-'.$photonic_cbox_theme.'/colorbox.css'));
			}
		}
		else if ($slideshow_library == 'lightgallery') {
			global $photonic_enable_lg_transitions;
			if (!empty($photonic_enable_lg_transitions)) {
				wp_enqueue_style('photonic-lightbox-lg-transitions', plugins_url('include/scripts/third-party/lightgallery/lightgallery-transitions.min.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/third-party/lightgallery/lightgallery-transitions.min.css'));
			}
		}
		else if ($slideshow_library == 'thickbox') {
			wp_enqueue_style('thickbox');
		}

		wp_enqueue_style('photonic', plugins_url("include/css/front-end/$folder/photonic-$slideshow_library.min.css", __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__)."include/css/front-end/$folder/photonic-$slideshow_library.min.css"));
	}

	/**
	 * Prints the custom CSS directly in the header if the option is not set to include it as a file
	 */
	function print_scripts() {
		global $photonic_css_in_file;
		$file = trailingslashit(PHOTONIC_UPLOAD_DIR).'custom-styles.css';
		if (!@file_exists($file) || empty($photonic_css_in_file)) {
			$this->generate_css();
		}
	}

	/**
	 * Prints the dynamically generated CSS based on option selections.
	 *
	 * @param bool $header
	 * @return string
	 */
	function generate_css($header = true) {
		global $photonic_flickr_collection_set_constrain_by_padding, $photonic_flickr_photos_constrain_by_padding, $photonic_flickr_photos_pop_constrain_by_padding, $photonic_flickr_galleries_constrain_by_padding;
		global $photonic_smug_photos_constrain_by_padding, $photonic_smug_photos_pop_constrain_by_padding, $photonic_smug_albums_album_constrain_by_padding, $photonic_instagram_photos_constrain_by_padding;
		global $photonic_zenfolio_photos_constrain_by_padding, $photonic_zenfolio_sets_constrain_by_padding, $photonic_tile_spacing, $photonic_masonry_tile_spacing, $photonic_mosaic_tile_spacing, $photonic_masonry_min_width;
		global $photonic_google_photos_constrain_by_padding;

		$css = '';
		if ($header) {
			$css .= '<style type="text/css">'."\n";
		}

		$saved_css = get_option('photonic_css');

		if ($header && !empty($saved_css)) {
			$css .= "/* Retrieved from saved CSS */\n";
			$css .= $saved_css;
		}
		else {
			if ($header) {
				$css .= "/* Dynamically generated CSS */\n";
			}
			$css .= ".photonic-panel { ".
				$this->get_bg_css('photonic_flickr_gallery_panel_background').
				$this->get_border_css('photonic_flickr_set_popup_thumb_border').
				" }\n";

			$css .= ".photonic-flickr-stream .photonic-pad-photosets { margin: {$photonic_flickr_collection_set_constrain_by_padding}px; }\n";
			$css .= ".photonic-flickr-stream .photonic-pad-galleries { margin: {$photonic_flickr_galleries_constrain_by_padding}px; }\n";
			$css .= ".photonic-flickr-stream .photonic-pad-photos { padding: 5px {$photonic_flickr_photos_constrain_by_padding}px; }\n";

			$css .= ".photonic-google-stream .photonic-pad-photos { padding: 5px {$photonic_google_photos_constrain_by_padding}px; }\n";

			$css .= ".photonic-zenfolio-stream .photonic-pad-photos { padding: 5px {$photonic_zenfolio_photos_constrain_by_padding}px; }\n";
			$css .= ".photonic-zenfolio-stream .photonic-pad-photosets { margin: 5px {$photonic_zenfolio_sets_constrain_by_padding}px; }\n";

			$css .= ".photonic-instagram-stream .photonic-pad-photos { padding: 5px {$photonic_instagram_photos_constrain_by_padding}px; }\n";

			$css .= ".photonic-smug-stream .photonic-pad-albums { margin: {$photonic_smug_albums_album_constrain_by_padding}px; }\n";
			$css .= ".photonic-smug-stream .photonic-pad-photos { padding: 5px {$photonic_smug_photos_constrain_by_padding}px; }\n";

			$css .= ".photonic-flickr-panel .photonic-pad-photos { padding: 10px {$photonic_flickr_photos_pop_constrain_by_padding}px; box-sizing: border-box; }\n";
			$css .= ".photonic-smug-panel .photonic-pad-photos { padding: 10px {$photonic_smug_photos_pop_constrain_by_padding}px; box-sizing: border-box; }\n";

			$css .= ".photonic-random-layout .photonic-thumb { padding: {$photonic_tile_spacing}px}\n";
			$css .= ".photonic-masonry-layout .photonic-thumb { padding: {$photonic_masonry_tile_spacing}px}\n";
			$css .= ".photonic-mosaic-layout .photonic-thumb { padding: {$photonic_mosaic_tile_spacing}px}\n";

			$css .= ".photonic-ie .photonic-masonry-layout .photonic-level-1, .photonic-ie .photonic-masonry-layout .photonic-level-2 { width: ".(absint($photonic_masonry_min_width) ? absint($photonic_masonry_min_width) : 200)."px; }\n";
		}

		if ($header) {
			$css .= "\n</style>\n";
			echo $css;
		}
		return $css;
	}

	function get_version($file) {
		return date("Ymd-Gis", @filemtime($file));
	}

	function admin_init() {
		if (!empty($_REQUEST['page']) &&
			in_array($_REQUEST['page'], array('photonic-options-manager', 'photonic-options', 'photonic-helpers', 'photonic-getting-started', 'photonic-auth', 'photonic-gutenberg'))) {
			global $photonic_options_manager;
			require_once(plugin_dir_path(__FILE__)."/photonic-options-manager.php");
			$photonic_options_manager = new Photonic_Options_Manager(__FILE__, $this);
			$photonic_options_manager->init();
		}
	}

	function add_extensions() {
		require_once(plugin_dir_path(__FILE__)."/extensions/Photonic_Processor.php");
		require_once(plugin_dir_path(__FILE__)."/extensions/Photonic_OAuth1_Processor.php");
		require_once(plugin_dir_path(__FILE__)."/extensions/Photonic_OAuth2_Processor.php");
		$this->register_extension('Photonic_Flickr_Processor', plugin_dir_path(__FILE__)."/extensions/Photonic_Flickr_Processor.php");
		$this->register_extension('Photonic_Google_Photos_Processor', plugin_dir_path(__FILE__)."/extensions/Photonic_Google_Photos_Processor.php");
		$this->register_extension('Photonic_Native_Processor', plugin_dir_path(__FILE__)."/extensions/Photonic_Native_Processor.php");
		$this->register_extension('Photonic_SmugMug_Processor', plugin_dir_path(__FILE__)."/extensions/Photonic_SmugMug_Processor.php");
		$this->register_extension('Photonic_Instagram_Processor', plugin_dir_path(__FILE__)."/extensions/Photonic_Instagram_Processor.php");
		$this->register_extension('Photonic_Zenfolio_Processor', plugin_dir_path(__FILE__)."/extensions/Photonic_Zenfolio_Processor.php");

		require_once(plugin_dir_path(__FILE__).'/layouts/Layout_Default.php');
		require_once(plugin_dir_path(__FILE__).'/layouts/Layout_Slideshow.php');

		do_action('photonic_register_extensions');
	}

	public function register_extension($extension, $path) {
		if (@!file_exists($path)) {
			return;
		}
		require_once($path);
		if (!class_exists($extension) || is_subclass_of($extension, 'Photonic_Processor')) {
			return;
		}
		$this->registered_extensions[] = $extension;
	}

	/**
	 * Overrides the native gallery short code, and does a lot more.
	 *
	 * @param $content
	 * @param array $attr
	 * @return string
	 */
	function modify_gallery($content, $attr = array()) {
		global $photonic_alternative_shortcode;

		// If an alternative shortcode is used, then $content has the shortcode attributes
		if (!empty($photonic_alternative_shortcode)) {
			$attr = $content;
		}
		if ($attr == null) {
			$attr = array();
		}

		$this->conditionally_add_scripts($attr);
		$images = $this->get_gallery_images($attr);

		if (isset($images) && !is_array($images)) {
			return $images;
		}

		return $content;
	}

	/**
	 * Adds Photonic attributes to the native WP galleries. This cannot be called in <code>Photonic_Native_Processor because
	 * that class is not initialised until a gallery of the native type is encountered
	 *
	 * @param $out
	 * @param $pairs
	 * @param $attributes
	 * @return mixed
	 */
	function native_gallery_attributes($out, $pairs, $attributes) {
		global $photonic_wp_title_caption, $photonic_enable_popup, $photonic_thumbnail_style, $photonic_alternative_shortcode;
		$bypass = !isset($photonic_enable_popup) || $photonic_enable_popup === false || $photonic_enable_popup == '' || $photonic_enable_popup == 'off';
		$defaults = array(
			'layout' => !empty($photonic_thumbnail_style) ? $photonic_thumbnail_style : 'square',
			'more' => '',
			'display' => 'in-page',
			'panel' => '',
			'filter' => '',
			'filter_type' => 'include',
			'fx' => 'slide', 	// LightSlider effects: fade and slide
			'timeout' => 4000, 	// Time between slides in ms
			'speed' => 1000,	// Time for each transition
			'pause' => true,	// Pause on hover
			'strip-style' => 'thumbs',
			'controls' => 'show',
			'popup' => $bypass ? 'hide' : 'show',

			'custom_classes' => '',
			'alignment' => '',

			'caption' => $photonic_wp_title_caption,
			'page' => 1,
			'count' => -1,
			'thumb_width' => 75,
			'thumb_height' => 75,
			'thumb_size' => 'thumbnail',
			'slide_size' => 'large',
			'slideshow_height' => 500,
		);

		$attributes = array_merge($defaults, $attributes);
		if (empty($attributes['style']) || ($attributes['style'] == 'default' && !empty($photonic_alternative_shortcode) && $photonic_alternative_shortcode != 'gallery')) {
			$attributes['style'] = $attributes['layout'];
		}

		foreach ($attributes as $key => $value) {
			$out[$key] = $value;
		}
		return $out;
	}

	/**
	 * @param array $attr
	 * @return string
	 */
	function helper_shortcode($attr = array()) {
		if ($attr == null) {
			$attr = array();
		}

		if (empty($attr['type']) || !in_array(strtolower($attr['type']), array('google', 'flickr', 'smugmug', 'zenfolio'))) {
			return sprintf(esc_html__('Please specify a value for %1%s. Accepted values are %2$s, %3$s, %4$s, %5$s', 'photonic'), '<code>type</code>', '<code>google</code>', '<code>flickr</code>', '<code>smugmug</code>', '<code>zenfolio</code>');
		}
		$gallery = $this->initialize_extension($attr['type']);
		return $gallery->execute_helper($attr);
	}

	/**
	 * @param $attr
	 * @return array|bool|string
	 */
	private function get_gallery_images($attr) {
		global $post, $photonic_thumbnail_style, $photonic_nested_shortcodes;
		$attr = array_merge(array(
			// Especially for Photonic
			'type' => 'default',  //default, flickr, smugmug, google, zenfolio, instagram
			'style' => 'default',   //default, strip-below, strip-above, strip-right, strip-left, no-strip, launch
//			'id' => $post->ID,
//			'layout' => isset($photonic_thumbnail_style) ? $photonic_thumbnail_style : 'square',
		), $attr);

		if ($photonic_nested_shortcodes) {
			$attr = array_map('do_shortcode', $attr);
		}

		extract($attr);

		$type = strtolower($attr['type']);

		if ($type == 'picasa') {
			$message = esc_html__('Google has deprecated the Picasa API. Please consider switching over to Google Photos', 'photonic');
			return "<div class='photonic-error'>\n\t<span class='photonic-error-icon photonic-icon'>&nbsp;</span>\n\t<div class='photonic-message'>\n\t\t$message\n\t</div>\n</div>\n";
		}

		if ($type == '500px') {
			$message = esc_html__('The API for 500px.com is no longer available for public use.', 'photonic');
			return "<div class='photonic-error'>\n\t<span class='photonic-error-icon photonic-icon'>&nbsp;</span>\n\t<div class='photonic-message'>\n\t\t$message\n\t</div>\n</div>\n";
		}

		if (!in_array($type, array('flickr', 'smugmug', 'google', 'zenfolio', 'instagram'))) {
			$gallery = $this->initialize_extension('native');
		}
		else {
			$gallery = $this->initialize_extension($type);
		}

		if (!is_null($gallery)) {
			$images = $gallery->get_gallery_images($attr);
		}
		return $images;
	}

	/**
	 * @param $provider
	 * @return Photonic_Processor|Photonic_Flickr_Processor|Photonic_Instagram_Processor|Photonic_Native_Processor|Photonic_Google_Photos_Processor|Photonic_SmugMug_Processor|Photonic_Zenfolio_Processor
	 */
	function initialize_extension($provider) {
		global $photonic_flickr_gallery, $photonic_google_gallery, $photonic_smugmug_gallery, $photonic_instagram_gallery, $photonic_zenfolio_gallery, $photonic_native_gallery;
		if ($provider == 'flickr') {
			if (!isset($photonic_flickr_gallery)) $photonic_flickr_gallery = new Photonic_Flickr_Processor();
			return $photonic_flickr_gallery;
		}
		else if ($provider == 'google') {
			if (!isset($photonic_google_gallery)) $photonic_google_gallery = new Photonic_Google_Photos_Processor();
			return $photonic_google_gallery;
		}
		else if ($provider == 'smugmug' || $provider == 'smug') {
			if (!isset($photonic_smugmug_gallery)) $photonic_smugmug_gallery = new Photonic_SmugMug_Processor();
			return $photonic_smugmug_gallery;
		}
		else if ($provider == 'zenfolio') {
			if (!isset($photonic_zenfolio_gallery)) $photonic_zenfolio_gallery = new Photonic_Zenfolio_Processor();
			return $photonic_zenfolio_gallery;
		}
		else if ($provider == 'instagram') {
			if (!isset($photonic_instagram_gallery)) $photonic_instagram_gallery = new Photonic_Instagram_Processor();
			return $photonic_instagram_gallery;
		}
		else {
			if (!isset($photonic_native_gallery)) $photonic_native_gallery = new Photonic_Native_Processor();
			return $photonic_native_gallery;
		}
	}

	/**
	 * Clicking on a level 2 object (i.e. an Album / Set / Gallery) triggers this. This will fetch the contents of the level 2 object and generate the markup for it.
	 *
	 * @return void
	 */
	function display_level_2_contents() {
		$panel = esc_attr($_POST['panel_id']);
		$components = explode('-', $panel);

		if (count($components) <= 5) {
			die();
		}
		$panel = implode('-', array_slice($components, 4, 10, true));
		$args = array(
			'display' => 'popup',
			'layout' => 'square',
			'panel' => $panel,
			'password' => !empty($_POST['password']) ? sanitize_text_field($_POST['password']) : '',
			'count' => sanitize_text_field($_POST['photo_count']),
			'photo_more' => sanitize_text_field($_POST['photo_more']),
		);

		$provider = $components[1];
		$type = $components[2];
		if ($provider == 'smug') {
			$this->check_authentication_smug();
			$args['view'] = 'album';
			$args['album_key'] = $components[4];
			$gallery = $this->initialize_extension('smugmug');
		}
		else if ($provider == 'zenfolio') {
			$args['view'] = 'photosets';
			$args['object_id'] = $components[4];
			$args['thumb_size'] = sanitize_text_field($_POST['overlay_size']);
			$args['video_size'] = sanitize_text_field($_POST['overlay_video_size']);
			$args['realm_id'] = sanitize_text_field($_POST['realm_id']);
			$gallery = $this->initialize_extension('zenfolio');
		}
		else if ($provider == 'google') {
			$args['view'] = 'photos';
			$args['album_id'] = implode('-', array_slice($components, 4, (count($components) - 1) - 4));
			$args['thumb_size'] = sanitize_text_field($_POST['overlay_size']);
			$args['video_size'] = sanitize_text_field($_POST['overlay_video_size']);
			$args['crop_thumb'] = sanitize_text_field($_POST['overlay_crop']);
			$gallery = $this->initialize_extension('google');
		}
		else if ($provider == 'flickr') {
			if ($type == 'gallery') {
				$args['gallery_id'] = $components[4].'-'.$components[5];
				$args['gallery_id_computed'] = true;
			}
			else if ($type = 'set') {
				$args['photoset_id'] = $components[4];
			}
			$args['thumb_size'] = sanitize_text_field($_POST['overlay_size']);
			$args['video_size'] = sanitize_text_field($_POST['overlay_video_size']);
			$gallery = $this->initialize_extension('flickr');
		}

		echo $gallery->get_gallery_images($args);
		die();
	}

	function display_level_3_contents() {
		$node = esc_attr($_POST['node']);
		$components = explode('-', $node);

		if (count($components) <= 3) {
			die();
		}

		$args = array('display' => 'in-page', 'headers' => '', 'layout' => esc_attr($_POST['layout']));

		$provider = $components[0];
		if ($provider == 'flickr') {
			$args['collection_id'] = implode('-', array_slice($components, 2, 2, true));
			$args['user_id'] = $components[4];
			$gallery = $this->initialize_extension('flickr');
		}

		echo $gallery->get_gallery_images($args);
		die();
	}

	/**
	 * Checks if a text being passed to it is an integer or not.
	 *
	 * @param $val
	 * @return bool
	 */
	static function check_integer($val) {
		if (substr($val, 0, 1) == '-') {
			$val = substr($val, 1);
		}
		return (preg_match('/^\d*$/', $val) == 1);
	}

	/**
	 * Converts a string to a boolean variable, if possible.
	 *
	 * @param $value
	 * @return bool
	 */
	static function string_to_bool($value) {
		if ($value == true || $value == 'true' || $value == 'TRUE' || $value == '1') {
			return true;
		}
		else if ($value == false || $value == 'false' || $value == 'FALSE' || $value == '0') {
			return false;
		}
		else {
			return $value;
		}
	}

	/**
	 * Constructs the CSS for a "background" option
	 *
	 * @param $option
	 * @return string
	 */
	function get_bg_css($option) {
		global ${$option};
		$option_val = ${$option};
		if (!is_array($option_val)) {
			$val_array = array();
			$vals = explode(';', $option_val);
			foreach ($vals as $val) {
				if (trim($val) == '') { continue; }
				$pair = explode('=', $val);
				$val_array[$pair[0]] = $pair[1];
			}
			$option_val = $val_array;
		}
		$bg_string = "";
		$bg_rgba_string = "";
		if (!isset($option_val['colortype']) || $option_val['colortype'] == 'transparent') {
			$bg_string .= " transparent ";
		}
		else {
			if (isset($option_val['color'])) {
				if (substr($option_val['color'], 0, 1) == '#') {
					$color_string = substr($option_val['color'],1);
				}
				else {
					$color_string = $option_val['color'];
				}
				$rgb_str_array = array();
				if (strlen($color_string)==3) {
					$rgb_str_array[] = substr($color_string, 0, 1).substr($color_string, 0, 1);
					$rgb_str_array[] = substr($color_string, 1, 1).substr($color_string, 1, 1);
					$rgb_str_array[] = substr($color_string, 2, 1).substr($color_string, 2, 1);
				}
				else {
					$rgb_str_array[] = substr($color_string, 0, 2);
					$rgb_str_array[] = substr($color_string, 2, 2);
					$rgb_str_array[] = substr($color_string, 4, 2);
				}
				$rgb_array = array();
				$rgb_array[] = hexdec($rgb_str_array[0]);
				$rgb_array[] = hexdec($rgb_str_array[1]);
				$rgb_array[] = hexdec($rgb_str_array[2]);
				$rgb_string = implode(',',$rgb_array);
				$rgb_string = ' rgb('.$rgb_string.') ';

				if (isset($option_val['trans'])) {
					$bg_rgba_string = $bg_string;
					$transparency = (int)$option_val['trans'];
					if ($transparency != 0) {
						$trans_dec = $transparency/100;
						$rgba_string = implode(',', $rgb_array);
						$rgba_string = ' rgba('.$rgba_string.','.$trans_dec.') ';
						$bg_rgba_string .= $rgba_string;
					}
				}

				$bg_string .= $rgb_string;
			}
		}
		if (isset($option_val['image']) && trim($option_val['image']) != '') {
			$bg_string .= " url(".$option_val['image'].") ";
			$bg_string .= $option_val['position']." ".$option_val['repeat'];

			if (trim($bg_rgba_string) != '') {
				$bg_rgba_string .= " url(".$option_val['image'].") ";
				$bg_rgba_string .= $option_val['position']." ".$option_val['repeat'];
			}
		}

		if (trim($bg_string) != '') {
			$bg_string = "background: ".$bg_string." !important;\n";
			if (trim($bg_rgba_string) != '') {
				$bg_string .= "\tbackground: ".$bg_rgba_string." !important;\n";
			}
		}
		return $bg_string;
	}

	/**
	 * Generates the CSS for borders. Each border, top, right, bottom and left is generated as a separate line.
	 *
	 * @param $option
	 * @return string
	 */
	function get_border_css($option) {
		global ${$option};
		$option_val = ${$option};
		if (!is_array($option_val)) {
			$option_val = stripslashes($option_val);
			$edge_array = $this->build_edge_array($option_val);
			$option_val = $edge_array;
		}
		$border_string = '';
		foreach ($option_val as $edge => $selections) {
			$border_string .= "\tborder-$edge: ";
			if (!isset($selections['style'])) {
				$selections['style'] = 'none';
			}
			if ($selections['style'] == 'none') {
				$border_string .= "none";
			}
			else {
				if (isset($selections['border-width'])) {
					$border_string .= $selections['border-width'];
				}
				if (isset($selections['border-width-type'])) {
					$border_string .= $selections['border-width-type'];
				}
				else {
					$border_string .= "px";
				}
				$border_string .= " ".$selections['style']." ";
				if ($selections['colortype'] == 'transparent') {
					$border_string .= "transparent";
				}
				else {
					if (substr($selections['color'], 0, 1) == '#') {
						$border_string .= $selections['color'];
					}
					else {
						$border_string .= '#'.$selections['color'];
					}
				}
			}
			$border_string .= ";\n";
		}
		return "\n".$border_string;
	}

	/**
	 * Generates the CSS for use in padding. This generates individual padding strings for each side, top, right, bottom and left.
	 *
	 * @param $option
	 * @return string
	 */
	function get_padding_css($option) {
		global ${$option};
		$option_val = ${$option};
		if (!is_array($option_val)) {
			$option_val = stripslashes($option_val);
			$edge_array = $this->build_edge_array($option_val);
			$option_val = $edge_array;
		}

		$edges = array();
		foreach ($option_val as $edge => $selections) {
			$padding = '';
			if (isset($selections['padding'])) {
				$padding .= $selections['padding'];
			}
			else {
				$padding .= 0;
			}

			if ($padding != '0' && isset($selections['padding-type'])) {
				$padding .= $selections['padding-type'];
			}
			else if ($padding != '0') {
				$padding .= "px";
			}
			$edges[$edge] = $padding;
		}

		$edge_master = array('top', 'right', 'bottom', 'left');
		$consolidated = '';
		foreach ($edge_master as $edge) {
			$consolidated .= empty($edges[$edge]) ? '0 ' : $edges[$edge].' ';
		}
		$padding_string = "\tpadding: $consolidated;\n";

		return $padding_string;
	}

	public function build_edge_array($option_val) {
		$edge_array = array();
		$edges = explode('||', $option_val);
		foreach ($edges as $edge_val) {
			if (trim($edge_val) != '') {
				$edge_options = explode('::', trim($edge_val));
				if (is_array($edge_options) && count($edge_options) > 1) {
					$val_array = array();
					$vals = explode(';', $edge_options[1]);
					foreach ($vals as $val) {
						$pair = explode('=', $val);
						if (is_array($pair) && count($pair) > 1) {
							$val_array[$pair[0]] = $pair[1];
						}
					}
					$edge_array[$edge_options[0]] = $val_array;
				}
			}
		}
		return $edge_array;
	}

	/**
	 * Adds a "Photonic" tab to the "Add Media" panel.
	 *
	 * @param $tabs
	 * @return array
	 */
	function media_upload_tabs($tabs) {
		if (!function_exists('is_gutenberg_page') || (function_exists('is_gutenberg_page') && !is_gutenberg_page())) {
			$tabs['photonic'] = 'Photonic';
		}
		return $tabs;
	}

	/**
	 * Invokes the form to display the photonic insertion screen in the "Add Media" panel. The call to wp_iframe ensures that the right CSS and JS are called.
	 *
	 * @return void
	 */
	function media_upload_photonic() {
		wp_iframe(array(&$this, 'media_upload_photonic_form'));
	}

	/**
	 * First prints the standard buttons for media upload, then shows the UI for Photonic.
	 *
	 * @return void
	 */
	function media_upload_photonic_form() {
		media_upload_header();
		require_once(plugin_dir_path(__FILE__)."/admin/add-gallery.php");
	}

	function edit_gallery() {
		global $photonic_disable_editor, $photonic_disable_editor_post_type;
		$disabled_types = explode(',', $photonic_disable_editor_post_type);
		$post_type = empty($_REQUEST['post_type']) ? 'post' : $_REQUEST['post_type'];
		// check if WYSIWYG is enabled
		if ('true' == get_user_option('rich_editing') && empty($photonic_disable_editor) && !in_array($post_type, $disabled_types)) {
			require_once(plugin_dir_path(__FILE__)."/admin/edit-gallery-templates.php");
		}
	}

	static function get_image_sizes_selection($element_name, $show_full = false) {
		$image_sizes = self::get_wp_image_sizes($show_full);
		$ret = "<select name='$element_name'>";
		foreach ($image_sizes as $size_name => $size_attrs) {
			$ret .= "<option value='$size_name'>$size_name ({$size_attrs['width']} &times; {$size_attrs['height']})</option>";
		}
		$ret .= '</select>';
		return $ret;
	}

	/**
	 * Make an HTTP request
	 *
	 * @static
	 * @param $url
	 * @param string $method GET | POST | DELETE
	 * @param null $post_fields
	 * @param string $user_agent
	 * @param int $timeout
	 * @param bool $ssl_verify_peer
	 * @return array|WP_Error
	 */
	static function http($url, $method = 'POST', $post_fields = NULL, $user_agent = null, $timeout = 90, $ssl_verify_peer = false, $headers = array(), $cookies = array()) {
		$curl_args = array(
			'user-agent' => $user_agent,
			'timeout' => $timeout,
			'sslverify' => $ssl_verify_peer,
			'headers' => array_merge(array('Expect:'), $headers),
			'method' => $method,
			'body' => $post_fields,
			'cookies' => $cookies,
		);

		switch ($method) {
			case 'DELETE':
				if (!empty($post_fields)) {
					$url = "{$url}?{$post_fields}";
				}
				break;
		}

		$response = wp_remote_request($url, $curl_args);
		return $response;
	}

	/**
	 * Returns the page where the OAuth API is being invoked. The invocation happens through admin-ajax.php, but we don't want
	 * the validated user to land up there. Instead we want the users to reach the page where they clicked the "Login" button.
	 *
	 * @static
	 * @return string
	 */
	static function get_callback_url() {
		global $photonic_callback_url;
		if (isset($photonic_callback_url)) {
			return $photonic_callback_url;
		}

		$page_URL = 'http';
		if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
			$page_URL .= "s";
		}
		$page_URL .= "://";
		if (isset($_SERVER["SERVER_PORT"])) {
			$page_URL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
		}
		else if (!isset($_SERVER["SERVER_PORT"]) && $page_URL == 'http://') {
			$page_URL .= $_SERVER["SERVER_NAME"].":80".$_SERVER["REQUEST_URI"];
		}
		else if (!isset($_SERVER["SERVER_PORT"]) && $page_URL == 'https://') {
			$page_URL .= $_SERVER["SERVER_NAME"].":443".$_SERVER["REQUEST_URI"];
		}
		else {
			$page_URL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
		}
		return $page_URL;
	}

	/**
	 * Checks if a user has authenticated a particular provider's services. When this is invoked we don't know if the page has
	 * a Flickr / SmugMug gallery, so we just invoke it and set some global variables.
	 *
	 * @return void
	 */
	function check_authentication() {
		if (is_admin()) {
			return;
		}
		global $photonic_flickr_allow_oauth, $photonic_smug_allow_oauth;
		if (!$photonic_flickr_allow_oauth && !$photonic_smug_allow_oauth) {
			return;
		}

		global $photonic_flickr_oauth_done, $photonic_smug_oauth_done;
		$photonic_flickr_oauth_done = $photonic_smug_oauth_done = false;

		$cookie = Photonic::parse_cookie();
		global $photonic_flickr_gallery;

		$this->check_provider_authentication($photonic_flickr_allow_oauth, 'flickr', $photonic_flickr_gallery, $photonic_flickr_oauth_done);

		$this->check_authentication_smug($cookie);
	}

	/**
	 * Searches for specific cookies in the user's browser. It then builds an array with the available cookies. The keys of the array
	 * are the individual providers ('flickr', 'smug' etc) and the values are arrays of key-value mappings.
	 *
	 * @static
	 * @return array
	 */
	public static function parse_cookie() {
		$cookie = array(
			'flickr' => array(),
			'smug' => array(),
		);
		$auth_types = array(
			'flickr' => 'oauth1',
			'smug' => 'oauth1',
		);
		$cookie_keys = array('oauth_token', 'oauth_token_secret', 'oauth_token_type', 'access_token', 'access_token_type', 'oauth_token_created', 'oauth_token_expires', 'oauth_refresh_token');
		foreach ($cookie as $provider => $cookies) {
			$orig_secret = $auth_types[$provider] == 'oauth1' ? 'photonic_'.$provider.'_api_secret' : 'photonic_'.$provider.'_client_secret';
			global ${$orig_secret};
			if (isset(${$orig_secret})) {
				$secret = md5(${$orig_secret}, false);
				foreach ($cookie_keys as $cookie_key) {
					$key = '-'.str_replace('_', '-', $cookie_key);
					if (isset($_COOKIE['photonic-'.$secret.$key])) {
						$cookie[$provider][$cookie_key] = $_COOKIE['photonic-'.$secret.$key];
					}
				}
			}
		}
		return $cookie;
	}

	/**
	 * The initiation process for the authentication. When a user clicks on this button, a request token is obtained and the authorization
	 * is performed. Then the user is redirected to an authorization site, where the user can authorize this site.
	 */
	function authenticate() {
		if (isset($_POST['provider'])) {
			$provider = sanitize_text_field($_POST['provider']);
			$callback_id = sanitize_text_field($_POST['callback_id']);
			$post_id = substr($callback_id, 19);
			global $photonic_callback_url;
			$photonic_callback_url = get_permalink($post_id);

			$gallery = $this->initialize_extension($provider);
			switch ($provider) {
				case 'flickr':
					$request_token = $gallery->get_request_token();
					$authorize_url = $gallery->get_authorize_URL($request_token);
					echo $authorize_url.'&perms=read';
					die;

				case 'smug':
					$request_token = $gallery->get_request_token();
					$authorize_url = $gallery->get_authorize_URL($request_token);
					echo $authorize_url.'&Access=Full&Permissions=Read';
					die;
			}
		}
	}

	function obtain_token() {
		global $photonic_google_gallery, $photonic_flickr_gallery, $photonic_smugmug_gallery, $photonic_zenfolio_gallery;
		$provider = sanitize_text_field($_POST['provider']);
		if ($provider == 'google') {
			$code = esc_attr($_POST['code']);
			$photonic_google_gallery = $this->initialize_extension('google');
			global $photonic_google_use_own_keys, $photonic_google_client_id, $photonic_google_client_secret;
//			if (!empty($photonic_google_use_own_keys) || (!empty($photonic_google_client_id) && !empty($photonic_google_client_secret))) {
				$response = Photonic::http($photonic_google_gallery->access_token_URL(), 'POST', array(
					'code' => $code,
					'grant_type' => 'authorization_code',
					'client_id' => $photonic_google_gallery->client_id,
					'client_secret' => $photonic_google_gallery->client_secret,
					'redirect_uri' => admin_url('admin.php?page=photonic-auth&source=google'),
				));
/*			}
			else {
				$response = Photonic::http($photonic_google_gallery->access_token_URL(), 'POST', array(
					'code' => $code,
					'grant_type' => 'authorization_code',
					'client_id' => $photonic_google_gallery->client_id,
					'client_secret' => $photonic_google_gallery->client_secret,
					'redirect_uri' => 'https://aquoid.com/photonic-router/google.php',
					'state' => admin_url('admin.php?page=photonic-auth&source=google'),
				));
			}*/

			if (!is_wp_error($response) && is_array($response)) {
				echo($response['body']);
			}
			else {
			}
		}
		else if ($provider == 'flickr') {
			$photonic_flickr_gallery = $this->initialize_extension('flickr');
			if (empty($_POST['oauth_token']) && empty($_POST['oauth_verifier'])) {
				$request_token = $photonic_flickr_gallery->get_request_token(admin_url('admin.php?page=photonic-auth&provider=flickr'), false);
				$authorize_url = $photonic_flickr_gallery->get_authorize_URL($request_token);
				$authorize_url .= '&perms=read';
				$photonic_flickr_gallery->save_token($request_token);
				echo $authorize_url;
			}
		}
		else if ($provider == 'smug') {
			$photonic_smugmug_gallery = $this->initialize_extension('smugmug');
			if (empty($_POST['oauth_token']) && empty($_POST['oauth_verifier'])) {
				$request_token = $photonic_smugmug_gallery->get_request_token(admin_url('admin.php?page=photonic-auth&provider=smug'), false);
				$authorize_url = $photonic_smugmug_gallery->get_authorize_URL($request_token);
				$authorize_url .= '&Access=Full&Permissions=Read';
				$photonic_smugmug_gallery->save_token($request_token);
				echo $authorize_url;
			}
		}
		else if ($provider == 'zenfolio') {
			$photonic_zenfolio_gallery = $this->initialize_extension('zenfolio');
			if (!empty($_POST['password'])) {
				$response = $photonic_zenfolio_gallery->authenticate($_POST['password']);
				if (!empty($response['error'])) {
					echo $response['error'];
				}
				else if (!empty($response['success'])) {
					esc_html_e('Authentication successful! All your galleries will be displayed with Authentication in place.', 'photonic');
				}
			}
		}
		die();
	}

	function save_token_in_options() {
		$provider = strtolower(sanitize_text_field($_POST['provider']));
		$token = esc_attr($_POST['token']);
		$secret = esc_attr($_POST['secret']);

		$options = get_option('photonic_options');
		if (empty($options)) {
			$options = array();
		}
		$option_set = false;
		if (in_array($provider, array('flickr', 'smug', 'instagram', 'zenfolio'))) {
			$options[$provider.'_access_token'] = $token;
			if ($provider != 'instagram') {
				$options[$provider.'_token_secret'] = $secret;
			}
			$option_set = true;
		}
		else if (in_array($provider, array('google'))) {
			$options[$provider.'_refresh_token'] = $token;
			$option_set = true;
		}
		if ($option_set) {
			update_option('photonic_options', $options);
			echo admin_url('admin.php?page=photonic-options-manager&tab='.($provider == 'smug' ? 'smugmug' : $provider).'-options.php');
		}
		die();
	}

	function delete_token_from_options() {
		$provider = strtolower(sanitize_text_field($_POST['provider']));
		$photonic_authentication = get_option('photonic_authentication');
		if ($provider == 'zenfolio') {
			if (isset($photonic_authentication[$provider])) {
				unset($photonic_authentication[$provider]);
			}
		}
		update_option('photonic_authentication', $photonic_authentication);
		die();
	}

	function invoke_helper() {
		global $photonic_options_manager;
		require_once(plugin_dir_path(__FILE__)."/photonic-options-manager.php");
		$photonic_options_manager = new Photonic_Options_Manager(__FILE__, $this);
		$photonic_options_manager->init();
		$photonic_options_manager->invoke_helper();
	}

	/**
	 * @return array
	 */
	public function get_localized_js_variables() {
		global $photonic_lightbox_no_loop, $photonic_slideshow_mode, $photonic_slideshow_interval, $photonic_slideshow_library, $photonic_custom_lightbox,
		       $photonic_cb_transition_effect, $photonic_cb_transition_speed,
		       $photonic_fbox_title_position, $photonic_fb3_transition_effect, $photonic_fb3_transition_speed, $photonic_fb3_show_fullscreen, $photonic_enable_fb3_fullscreen,
		       $photonic_fb3_hide_thumbs, $photonic_enable_fb3_thumbnail, $photonic_fb3_disable_zoom, $photonic_fb3_disable_slideshow, $photonic_fb3_enable_download, $photonic_fb3_disable_right_click,
		       $photonic_lc_transition_effect, $photonic_lc_transition_speed_in, $photonic_lc_transition_speed_out, $photonic_lc_enable_shrink,
		       $photonic_lg_transition_effect, $photonic_lg_transition_speed, $photonic_disable_lg_download, $photonic_lg_hide_bars_delay,
			   $photonic_tile_spacing, $photonic_tile_min_height, $photonic_pphoto_theme, $photonic_pp_animation_speed,
			   $photonic_enable_swipebox_mobile_bars, $photonic_sb_hide_mobile_close, $photonic_sb_hide_bars_delay,
		       $photonic_lightbox_for_all, $photonic_lightbox_for_videos, $photonic_popup_panel_width, $photonic_deep_linking, $photonic_social_media,
			   $photonic_slideshow_prevent_autostart, $photonic_wp_slide_adjustment, $photonic_masonry_min_width, $photonic_mosaic_trigger_width,
			   $photonic_is_IE, $photonic_debug_on;

		global $photonic_js_variables;

		$slideshow_library = $photonic_slideshow_library == 'custom' ? $photonic_custom_lightbox : $photonic_slideshow_library;
		$js_array = array(
			'ajaxurl' => admin_url('admin-ajax.php'),
			'plugin_url' => PHOTONIC_URL,
			'is_old_IE' => $photonic_is_IE,
			'debug_on' => !empty($photonic_debug_on),

			'fbox_show_title' => $photonic_fbox_title_position == 'none' ? false : true,
			'fbox_title_position' => $photonic_fbox_title_position == 'none' ? 'outside' : $photonic_fbox_title_position,

			'slide_adjustment' => empty($photonic_wp_slide_adjustment) ? 'adapt-height-width' : $photonic_wp_slide_adjustment,

			'deep_linking' => isset($photonic_deep_linking) ? $photonic_deep_linking : 'none',
			'social_media' => isset($photonic_deep_linking) ? $photonic_deep_linking != 'none' && empty($photonic_social_media) : '',

			'slideshow_library' => $slideshow_library,
			'tile_spacing' => (empty($photonic_tile_spacing) || !absint($photonic_tile_spacing)) ? 0 : absint($photonic_tile_spacing),
			'tile_min_height' => (empty($photonic_tile_min_height) || !absint($photonic_tile_min_height)) ? 200 : absint($photonic_tile_min_height),
			'masonry_min_width' => (empty($photonic_masonry_min_width) || !absint($photonic_masonry_min_width)) ? 200 : absint($photonic_masonry_min_width),
			'mosaic_trigger_width' => (empty($photonic_mosaic_trigger_width) || !absint($photonic_mosaic_trigger_width)) ? 200 : absint($photonic_mosaic_trigger_width),

			'slideshow_mode' => (isset($photonic_slideshow_mode) && $photonic_slideshow_mode == 'on') ? true : false,
			'slideshow_interval' => (isset($photonic_slideshow_interval) && absint($photonic_slideshow_interval)) ? absint($photonic_slideshow_interval) : 5000,
			'lightbox_loop' => empty($photonic_lightbox_no_loop),

			'gallery_panel_width' => (empty($photonic_popup_panel_width) || !absint($photonic_popup_panel_width) || absint($photonic_popup_panel_width) > 100) ? 80 : absint($photonic_popup_panel_width),

			'cb_transition_effect' => empty($photonic_cb_transition_effect) ? 'elastic' : $photonic_cb_transition_effect,
			'cb_transition_speed' => (isset($photonic_cb_transition_speed) && absint($photonic_cb_transition_speed)) ? absint($photonic_cb_transition_speed) : 350,

			'fb3_transition_effect' => empty($photonic_fb3_transition_effect) ? 'zoom' : $photonic_fb3_transition_effect,
			'fb3_transition_speed' => (isset($photonic_fb3_transition_speed) && absint($photonic_fb3_transition_speed)) ? absint($photonic_fb3_transition_speed) : 366,
			'fb3_fullscreen_button' => !empty($photonic_fb3_show_fullscreen),
			'fb3_fullscreen' => isset($photonic_enable_fb3_fullscreen) && $photonic_enable_fb3_fullscreen == 'on' ? true : false,
			'fb3_thumbs_button' => empty($photonic_fb3_hide_thumbs),
			'fb3_thumbs' => isset($photonic_enable_fb3_thumbnail) && $photonic_enable_fb3_thumbnail == 'on' ? true : false,
			'fb3_zoom' => empty($photonic_fb3_disable_zoom),
			'fb3_slideshow' => empty($photonic_fb3_disable_slideshow),
			'fb3_download' => !empty($photonic_fb3_enable_download),
			'fb3_disable_right_click' => !empty($photonic_fb3_disable_right_click),

			'lc_transition_effect' => empty($photonic_lc_transition_effect) ? 'scrollHorizontal' : $photonic_lc_transition_effect,
			'lc_transition_speed_in' => (isset($photonic_lc_transition_speed_in) && absint($photonic_lc_transition_speed_in)) ? absint($photonic_lc_transition_speed_in) : 350,
			'lc_transition_speed_out' => (isset($photonic_lc_transition_speed_out) && absint($photonic_lc_transition_speed_out)) ? absint($photonic_lc_transition_speed_out) : 250,
			'lc_disable_shrink' => empty($photonic_lc_enable_shrink),

			'lg_transition_effect' => empty($photonic_lg_transition_effect) ? 'lg-slide' : $photonic_lg_transition_effect,
			'lg_enable_download' => empty($photonic_disable_lg_download),
			'lg_hide_bars_delay' => (isset($photonic_lg_hide_bars_delay) && absint($photonic_lg_hide_bars_delay)) ? absint($photonic_lg_hide_bars_delay) : 6000,
			'lg_transition_speed' => (isset($photonic_lg_transition_speed) && absint($photonic_lg_transition_speed)) ? absint($photonic_lg_transition_speed) : 600,

			'pphoto_theme' => isset($photonic_pphoto_theme) ? $photonic_pphoto_theme : 'pp_default',
			'pphoto_animation_speed' => empty($photonic_pp_animation_speed) ? 'fast' : $photonic_pp_animation_speed,

			'enable_swipebox_mobile_bars' => !empty($photonic_enable_swipebox_mobile_bars),
			'sb_hide_mobile_close' => !empty($photonic_sb_hide_mobile_close),
			'sb_hide_bars_delay' => (isset($photonic_sb_hide_bars_delay) && absint($photonic_sb_hide_bars_delay)) ? absint($photonic_sb_hide_bars_delay) : 0,

			'lightbox_for_all' => !empty($photonic_lightbox_for_all),
			'lightbox_for_videos' => !empty($photonic_lightbox_for_videos),

			'slideshow_autostart' => !(isset($photonic_slideshow_prevent_autostart) && $photonic_slideshow_prevent_autostart == 'on'),

			'password_failed' => esc_attr__('This album is password-protected. Please provide a valid password.', 'photonic'),
			'incorrect_password' => esc_attr__('Incorrect password.', 'photonic'),
			'maximize_panel' => esc_attr__('Show', 'photonic'),
			'minimize_panel' => esc_attr__('Hide', 'photonic'),
		);
		$photonic_js_variables = $js_array;
		return $js_array;
	}

	function enable_translations() {
		load_plugin_textdomain('photonic', FALSE, FALSE);
	}

	/**
	 * Checks authentication status for a provider, by verifying both, server-side and client-side authentication.
	 *
	 * @param $allow_auth
	 * @param $provider
	 * @param $gallery Photonic_OAuth1_Processor|Photonic_OAuth2_Processor
	 * @param $oauth_done
	 */
	function check_provider_authentication($allow_auth, $provider, &$gallery, &$oauth_done) {
		$this->initialize_extension($provider);
		$cookie = Photonic::parse_cookie();
		if ($allow_auth && isset($cookie[$provider]) && isset($cookie[$provider]['oauth_token']) && isset($cookie[$provider]['oauth_token_secret'])) {
			$current_token = array(
				'oauth_token' => $cookie[$provider]['oauth_token'],
				'oauth_token_secret' => $cookie[$provider]['oauth_token_secret'],
			);
			if (isset($_REQUEST['oauth_verifier']) && isset($_REQUEST['oauth_token'])) {
				$current_token['oauth_token'] = $_REQUEST['oauth_token'];
				$current_token['oauth_verifier'] = $_REQUEST['oauth_verifier'];
				$new_token = $gallery->get_access_token($current_token);
				if (isset($new_token['oauth_token']) && isset($new_token['oauth_token_secret'])) {
					// Strip out the token and the verifier from the callback URL and send the user to the callback URL.
					$oauth_done = true;
					$redirect = remove_query_arg(array('oauth_token', 'oauth_verifier'));
					wp_redirect($redirect);
					exit;
				}
			}
			else if (isset($cookie[$provider]['oauth_token_type']) && $cookie[$provider]['oauth_token_type'] == 'access') {
				$access_token_response = $gallery->check_access_token($current_token);
				if (is_wp_error($access_token_response)) {
					$gallery->is_server_down = true;
				}
				$oauth_done = $gallery->is_access_token_valid($access_token_response);
			}
		}
		else if (!empty($gallery->token) && !empty($gallery->token_secret)) {
			$token = array('oauth_token' => $gallery->token, 'oauth_token_secret' => $gallery->token_secret);
			$access_token_response = $gallery->check_access_token($token);
			if (is_wp_error($access_token_response)) {
				$gallery->is_server_down = true;
			}
			$oauth_done = $gallery->is_access_token_valid($access_token_response);
		}
	}

	/**
	 * @param $cookie
	 * @return void
	 */
	public function check_authentication_smug($cookie = null) {
		if ($cookie == null) {
			$cookie = Photonic::parse_cookie();
		}

		global $photonic_smugmug_gallery, $photonic_smug_allow_oauth, $photonic_smug_oauth_done;
		$photonic_smugmug_gallery = $this->initialize_extension('smugmug');
		if ($photonic_smug_allow_oauth && isset($cookie['smug']) && isset($cookie['smug']['oauth_token']) && isset($cookie['smug']['oauth_token_secret'])) {
			$current_token = array(
				'oauth_token' => $cookie['smug']['oauth_token'],
				'oauth_token_secret' => $cookie['smug']['oauth_token_secret']
			);

			if (!$photonic_smug_oauth_done &&
				((isset($cookie['smug']['oauth_token_type']) && $cookie['smug']['oauth_token_type'] == 'request') || !isset($cookie['smug']['oauth_token_type']))) {
				$current_token['oauth_verifier'] = $_REQUEST['oauth_verifier'];
				$new_token = $photonic_smugmug_gallery->get_access_token($current_token);
				if (isset($new_token['oauth_token']) && isset($new_token['oauth_token_secret'])) {
					$access_token_response = $photonic_smugmug_gallery->check_access_token($new_token);
					if (is_wp_error($access_token_response)) {
						$photonic_smugmug_gallery->is_server_down = true;
					}
					$photonic_smug_oauth_done = $photonic_smugmug_gallery->is_access_token_valid($access_token_response);
				}
			}
			else if (isset($cookie['smug']['oauth_token_type']) && $cookie['smug']['oauth_token_type'] == 'access') {
				$access_token_response = $photonic_smugmug_gallery->check_access_token($current_token);
				if (is_wp_error($access_token_response)) {
					$photonic_smugmug_gallery->is_server_down = true;
				}
				$photonic_smug_oauth_done = $photonic_smugmug_gallery->is_access_token_valid($access_token_response);
			}
		}
		else if (!empty($photonic_smugmug_gallery->token) && !empty($photonic_smugmug_gallery->token_secret)) {
			$token = array('oauth_token' => $photonic_smugmug_gallery->token, 'oauth_token_secret' => $photonic_smugmug_gallery->token_secret);
			$access_token_response = $photonic_smugmug_gallery->check_access_token($token);
			if (is_wp_error($access_token_response)) {
				$photonic_smugmug_gallery->is_server_down = true;
			}
			$photonic_smug_oauth_done = $photonic_smugmug_gallery->is_access_token_valid($access_token_response);
		}
	}

	function load_more() {
		$provider = esc_attr($_POST['provider']);
		$query = sanitize_text_field($_POST['query']);
		$attr = wp_parse_args($query);

		$gallery = $this->initialize_extension($provider);
		if ($provider == 'flickr') {
			$attr['page'] = isset($attr['page']) ? $attr['page'] + 1 : 0;
		}
		else if ($provider == 'google') {
		}
		else if ($provider == 'smug') {
			$attr['start'] = $attr['start'] + $attr['count'];
		}
		else if ($provider == 'zenfolio') {
			$attr['offset'] = $attr['offset'] + $attr['limit'];
		}
		else if ($provider == 'instagram') {
		}
		else if ($provider == 'wp') {
			$attr['page'] = $attr['page'] + 1;
		}

		if (!is_null($gallery)) {
			echo $gallery->get_gallery_images($attr);
		}
		die();
	}

	function helper_shortcode_more() {
		if (!empty($_POST['provider'])) {
			$provider = sanitize_text_field($_POST['provider']);
			if (in_array($provider, array('google'))) {
				$gallery = $this->initialize_extension($provider);
				if ($provider == 'google') {
					echo $gallery->execute_helper(array('nextPageToken' => sanitize_text_field($_POST['nextPageToken'])));
				}
			}
		}
		die();
	}

	static function title_caption_options($blank = false, $selection = false) {
		$ret = array(
			'' => esc_html__('Default from settings', 'photonic'),
			'none' => esc_html__('No title / caption / description', 'photonic'),
			'title' => esc_html__('Always use the photo title, even if blank', 'photonic'),
			'desc' => esc_html__('Always use the photo description / caption, even if blank', 'photonic'),
			'desc-title' => esc_html__('Use the photo description / caption. If blank use the title', 'photonic'),
			'title-desc' => esc_html__('Use the photo title. If blank use the description / caption', 'photonic'),
		);

		if (!$blank) {
			unset($ret['']);
		}
		else if (!empty($ret[$selection])) {
			$ret[''] .= ' - '.$ret[$selection];
		}

		return $ret;
	}

	static function layout_options($show_blank = false) {
		$ret = array();
		if ($show_blank) {
			$ret[''] = '';
		}
		return array_merge($ret, array(
			'strip-below' => esc_html__('Thumbnail strip below slideshow', 'photonic'),
			'strip-above' => esc_html__('Thumbnail strip above slideshow', 'photonic'),
			'strip-right' => esc_html__('Thumbnail strip to the right of the slideshow', 'photonic'),
			'no-strip' => esc_html__('Slideshow without thumbnails', 'photonic'),
			'square' => esc_html__('Square thumbnail grid, lightbox', 'photonic'),
			'circle' => esc_html__('Circular thumbnail grid, lightbox', 'photonic'),
			'random' => esc_html__('Random justified gallery, lightbox', 'photonic'),
			'masonry' => esc_html__('Masonry layout, lightbox', 'photonic'),
			'mosaic' => esc_html__('Mosaic layout, lightbox', 'photonic'),
		));
	}

	static function media_options($blank = false, $selection = false) {
		$options = array(
			'' => esc_html__('Default from settings', 'photonic'),
			'photos' => esc_html__('Photos only', 'photonic'),
			'videos' => esc_html__('Videos only', 'photonic'),
			'all' => esc_html__('Both photos and videos', 'photonic'),
		);

		if (!$blank) {
			unset($options['']);
		}
		else if (!empty($options[$selection])) {
			$options[''] .= ' - '.$options[$selection];
		}

		return $options;
	}

	function admin_head() {
		// check user permissions
		if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
			return;
		}

		global $photonic_disable_editor, $photonic_disable_editor_post_type;
		$disabled_types = explode(',', $photonic_disable_editor_post_type);
		$screen = get_current_screen();
		$post_type = empty($_REQUEST['post_type']) ? 'post' : $_REQUEST['post_type'];
		// check if WYSIWYG is enabled
		if ('true' == get_user_option('rich_editing') && empty($photonic_disable_editor) && !in_array($post_type, $disabled_types) && $screen->base == 'post') {
			$this->prepare_mce_data();
			add_filter('mce_external_plugins', array($this ,'mce_photonic'), 5);
			add_filter('mce_buttons', array($this ,'mce_flow_button'), 5);
		}
	}

	function prepare_mce_data() {
		global $photonic_alternative_shortcode, $photonic_disable_flow_editor;
		$url = add_query_arg( array(
			'action'    => 'photonic_flow',
			'class'		=> 'photonic-flow',
			'post_id'   => empty($_REQUEST['post']) ? '' : $_REQUEST['post'],
			'width'     => '1000',
			'height'    => '600',
			'TB_iframe' => 'true',
		), admin_url( 'admin.php' ) );
		$js_array = array(
			'flow_url' => $url,
			'ajaxurl' => admin_url('admin-ajax.php'),
			'shortcode' => empty($photonic_alternative_shortcode) ? 'gallery' : $photonic_alternative_shortcode,
			'disable_flow' => !empty($photonic_disable_flow_editor),
			'default_gallery_type' => 'default',
			'plugin_dir' => plugin_dir_url(__FILE__),
		);
		wp_enqueue_script('photonic-admin-js', plugins_url('include/scripts/admin/gallery-settings.js', __FILE__), array('jquery', 'media-views', 'media-upload'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/admin/gallery-settings.js'));
		wp_localize_script('photonic-admin-js', 'Photonic_Admin_JS', $js_array);
	}

	function mce_photonic($plugin_array) {
		$plugin_array['photonic'] = plugins_url('include/scripts/admin/mce.js?'.$this->get_version(plugin_dir_path(__FILE__).'include/scripts/admin/mce.js') , __FILE__);
		return $plugin_array;
	}

	function mce_flow_button($buttons) {
		array_push($buttons, 'photonic_flow');
		return $buttons;
	}

	/**
	 * @param string|array $classes
	 * @param string $class
	 * @return array
	 */
	function body_class($classes = array(), $class = '') {
		if (!is_array($classes)) {
			$classes = explode(' ', $classes);
		}
		global $photonic_is_IE;
		if ($photonic_is_IE) {
			$classes[] = 'photonic-ie';
		}

		return $classes;
	}

	function add_photonic_button() {
		add_thickbox();
		$url = add_query_arg( array(
			'action'    => 'photonic_flow',
			'class'		=> 'photonic-flow',
			'post_id'   => empty($_REQUEST['post']) ? '' : $_REQUEST['post'],
			'width'     => '1000',
			'height'    => '600',
			'TB_iframe' => 'true',
		), admin_url( 'admin.php' ) );

		printf('<a href="%s" class="button photonic-button thickbox" id="photonic-add-gallery" title="Photonic Gallery"><img class="wp-media-buttons-icon" src="'.plugins_url('include/images/Photonic-20.png', __FILE__).'"/> %s</a>',
			$url, esc_html__( 'Add / Edit Photonic Gallery', 'photonic'));
	}

	function gallery_builder() {
		define( 'IFRAME_REQUEST', true );
		$this->enqueue_flow_scripts();
		iframe_header(esc_html__('Add / Edit Photonic Gallery', 'photonic'));
		require_once(plugin_dir_path(__FILE__).'/admin/flow/Flow.php');
		iframe_footer();
		exit;
	}

	function enqueue_flow_scripts() {
		global $photonic_alternative_shortcode;
		$flow_js = array(
			'ajaxurl' => admin_url('admin-ajax.php'),
			'shortcode' => empty($photonic_alternative_shortcode) ? 'gallery' : $photonic_alternative_shortcode,
			'insert_gallery' => esc_html__('Insert Gallery', 'photonic'),
			'update_gallery' => esc_html__('Update Gallery', 'photonic'),
			'error_mandatory' => esc_html__('Please fill the mandatory fields. Mandatory fields are marked with a red "*".', 'photonic'),
			'media_library_title' => esc_html__('Select from WordPress Media Library', 'photonic'),
			'media_library_button' => esc_html__('Select', 'photonic'),
			'info_editor_not_shortcode' => esc_html__('The text selected in the editor is not a Photonic shortcode. Creating a new shortcode.', 'photonic'),
			'info_editor_block_select' => sprintf(esc_html__('%1$sHint:%2$s To edit an existing Photonic block simply click on the block.', 'photonic'), '<strong>', '</strong>'),
		);
		if (!empty($_REQUEST['shortcode'])) {
			$flow_js['shortcode'] = $_REQUEST['shortcode'];
		}
		wp_enqueue_style('photonic-flow', plugins_url('include/css/admin-flow.css', __FILE__), array(), $this->get_version(plugin_dir_path(__FILE__).'include/css/admin-flow.css'));
		wp_enqueue_script('photonic-flow-js', plugins_url('include/scripts/admin/flow.js', __FILE__), array('jquery'), $this->get_version(plugin_dir_path(__FILE__).'include/scripts/admin/flow.js'));
		wp_localize_script('photonic-flow-js', 'Photonic_Flow_JS', $flow_js);
	}

	function flow_next_screen() {
		require_once(plugin_dir_path(__FILE__)."/admin/flow/Photonic_Flow_Manager.php");
		if (isset($_POST['provider'])) {
			$flow_manager = new Photonic_Flow_Manager();
			echo $flow_manager->get_screen();
		}
		die();
	}

	function flow_more() {
		require_once(plugin_dir_path(__FILE__)."/admin/flow/Photonic_Flow_Manager.php");
		if (isset($_POST['url']) && isset($_POST['provider']) && isset($_POST['display_type'])) {
			$url = base64_decode(sanitize_text_field($_POST['url']));

			$provider = sanitize_text_field($_POST['provider']);
			$display_type = sanitize_text_field($_POST['display_type']);

			$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));

			$flow_manager = new Photonic_Flow_Manager();
			$objects = $flow_manager->process_response($response, $provider, $display_type, array(), array(), $url, true);

			if (!empty($objects['success'])) {
				echo $objects['success'];
			}
			else if (!empty($objects['error'])) {
				echo $objects['error'];
			}
		}
		die();
	}

	public static function get_formatted_post_type_array() {
		global $photonic_post_type_array;
		$ret = array();

		$post_types = get_post_types(array('show_ui' => 1), 'objects');
		if (!empty($post_types)) {
			foreach ($post_types as $name => $post_type) {
				$ret[$name] = array ("title" => $post_type->label." (Post type: $name)", "depth" => 0);
			}
		}

		$photonic_post_type_array = $ret;
		return $ret;
	}

	/**
	 * Used for handling the front-end for Gutenberg blocks
	 *
	 * @param $attributes
	 * @return array|bool|string
	 */
	function render_block($attributes) {
		if (!empty($attributes['shortcode'])) {
			$shortcode = (array)(json_decode($attributes['shortcode']));

			if (!empty($attributes['align'])) {
				$shortcode['alignment'] = $attributes['align'];
			}
			if (!empty($attributes['className'])) {
				$shortcode['custom_classes'] = $attributes['className'];
			}

			$this->conditionally_add_scripts($shortcode);
			return $this->get_gallery_images($shortcode);
		}
		return '';
	}

	function enqueue_gutenberg_assets() {
		if (function_exists('register_block_type')) {
			wp_enqueue_script('photonic-gutenberg',
				plugins_url('include/scripts/admin/block.js', __FILE__),
				array('jquery', 'wp-blocks', 'wp-i18n', 'wp-element', 'shortcode', 'thickbox'),
				$this->get_version(plugin_dir_path(__FILE__).'include/scripts/admin/block.js')
			);

			if (function_exists( 'gutenberg_get_jed_locale_data')) {
				$locale  = gutenberg_get_jed_locale_data('photonic');
				$content = 'wp.i18n.setLocaleData('.json_encode($locale).', "photonic");';
				wp_script_add_data( 'photonic-gutenberg', 'data', $content );
			}

			global $photonic_alternative_shortcode;
			$url = add_query_arg( array(
				'action'    => 'photonic_flow',
				'class'		=> 'photonic-flow',
				'post_id'   => empty($_REQUEST['post']) ? '' : $_REQUEST['post'],
				'width'     => '1000',
				'height'    => '600',
				'TB_iframe' => 'true',
			), admin_url( 'admin.php' ) );

			$js_array = array(
				'flow_url' => $url,
				'ajaxurl' => admin_url('admin-ajax.php'),
				'shortcode' => empty($photonic_alternative_shortcode) ? 'gallery' : $photonic_alternative_shortcode,
				'default_gallery_type' => 'default',
				'plugin_dir' => plugin_dir_url(__FILE__),
			);
			wp_localize_script('photonic-gutenberg', 'Photonic_Gutenberg_JS', $js_array);

			wp_enqueue_style('photonic-gutenberg',
				plugins_url('include/css/admin-block.css', __FILE__),
				array('thickbox'),
				$this->get_version(plugin_dir_path(__FILE__).'include/css/admin-block.css')
			);
		}
	}

	private function add_gutenberg_support() {
		if (function_exists('register_block_type')) {
			register_block_type('photonic/gallery',
				array(
					'attributes' => array(
						'shortcode' => array(
							'type' => 'string',
						),
					),
					'render_callback' => array(&$this, 'render_block'),
				)
			);
		}
	}

	function admin_notices() {
		if (!empty($_REQUEST['page']) && in_array($_REQUEST['page'], array('photonic-options-manager', 'photonic-getting-started', 'photonic-auth', 'photonic-helpers'))){
			if (function_exists('register_block_type')) {
				$dismissed = get_user_meta(get_current_user_id(), 'photonic_gutenberg');
				if (!$dismissed) {
					echo "<div class='notice notice-warning'>\n<p>\n";
					echo sprintf(esc_html__('It looks like you are using the Gutenberg editor. Please ensure that you have followed the instructions under %s.', 'photonic'), '<em><a href="'.admin_url('admin.php?page=photonic-gutenberg').'">Photonic &rarr; Prepare for Gutenberg</a></em>');
					echo "</p>\n";
					echo "<button type='button' data-photonic-dismissible='gutenberg' class='photonic-notice-dismiss'><span class='screen-reader-text'>Dismiss this notice.</span></button>";
					echo "</div>\n";
				}
			}
		}
	}

	function dismiss_warning() {
		$user_id = get_current_user_id();
		$response = array();
		if (!empty($_POST['dismissible'])) {
			add_user_meta( $user_id, "photonic_".esc_sql($_POST['dismissible']), 'true', true );
			$response[$_POST['dismissible']] = 'true';
		}
		echo json_encode($response);
		die();
	}

	function curl_timeout($handle) {
		curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, PHOTONIC_CURL_TIMEOUT);
		curl_setopt($handle, CURLOPT_TIMEOUT, PHOTONIC_CURL_TIMEOUT);
	}

	static function log($element) {
		if (PHOTONIC_DEBUG) {
			print_r($element);
		}
	}

	static function doc_link($link) {
		return ' '.sprintf(esc_html__('See %1$shere%2$s for documentation.', 'photonic'), "<a href='$link'>", '</a>');
	}
}

add_action('init', 'photonic_init', 100); // Delaying the start from 10 to 100 so that CPTs can be picked up

function photonic_init() {
	global $photonic;
	$photonic = new Photonic();
}
