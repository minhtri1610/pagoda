<?php
class Photonic_Options_Manager {
	var $options, $tab, $tab_options, $reverse_options, $shown_options, $option_defaults, $allowed_values, $hidden_options, $nested_options, $displayed_sections;
	var $option_structure, $previous_displayed_section, $file, $tab_name, $core;

	function __construct($file, $core) {
		global $photonic_setup_options, $photonic_generic_options, $photonic_flickr_options, $photonic_google_options,
			   $photonic_smugmug_options, $photonic_instagram_options, $photonic_zenfolio_options, $photonic_lightbox_options;
		$options_page_array = array(
			'generic-options.php' => $photonic_generic_options,
			'flickr-options.php' => $photonic_flickr_options,
			'google-options.php' => $photonic_google_options,
			'smugmug-options.php' => $photonic_smugmug_options,
			'zenfolio-options.php' => $photonic_zenfolio_options,
			'instagram-options.php' => $photonic_instagram_options,
			'lightbox-options.php' => $photonic_lightbox_options,
		);

		$tab_name_array = array(
			'generic-options.php' => 'Generic Options',
			'flickr-options.php' => 'Flickr Options',
			'google-options.php' => 'Google Photos Options',
			'smugmug-options.php' => 'SmugMug Options',
			'zenfolio-options.php' => 'Zenfolio Options',
			'instagram-options.php' => 'Instagram Options',
			'lightbox-options.php' => 'Lightbox Options',
		);

		$this->core = $core;
		$this->file = $file;
		$this->tab = 'generic-options.php';
		if (isset($_REQUEST['tab']) && array_key_exists($_REQUEST['tab'], $options_page_array)) {
			$this->tab = $_REQUEST['tab'];
		}

		$this->tab_options = $options_page_array[$this->tab];
		$this->tab_name = $tab_name_array[$this->tab];
		$this->options = $photonic_setup_options;
		$this->reverse_options = array();
		$this->nested_options = array();
		$this->displayed_sections = 0;
		$this->option_structure = $this->get_option_structure();

		$all_options = get_option('photonic_options');
		if (!isset($all_options)) {
			$this->hidden_options = array();
		}
		else {
			$this->hidden_options = $all_options;
		}

		foreach ($this->tab_options as $option) {
			if (isset($option['id'])) {
				$this->shown_options[] = $option['id'];
				if (isset($this->hidden_options[$option['id']])) unset($this->hidden_options[$option['id']]);
			}
		}

		global $photonic_default_options;
		foreach ($photonic_setup_options as $option) {
			if (isset($option['category']) && !isset($this->nested_options[$option['category']])) {
				$this->nested_options[$option['category']] = array();
			}

			if (isset($option['id'])) {
				$this->reverse_options[$option['id']] = $option['type'];

				$this->option_defaults[$option['id']] = $photonic_default_options[$option['id']];
				$option['std'] = $photonic_default_options[$option['id']];

				if (isset($option['options'])) {
					$this->allowed_values[$option['id']] = $option['options'];
				}
				if (isset($option['grouping'])) {
					if (!isset($this->nested_options[$option['grouping']])) {
						$this->nested_options[$option['grouping']] = array();
					}
					$this->nested_options[$option['grouping']][] = $option['id'];
				}
			}
		}
	}

	function render_settings_page() {
		$saved_options = get_option('photonic_options');
		if (isset($saved_options) && !empty($saved_options)) {
			$generated_css = $this->core->generate_css(false);
			update_option('photonic_css', $generated_css);
			if (!empty($saved_options['css_in_file'])) {
				$this->save_css_to_file($generated_css);
			}
		}
		?>
		<div class="photonic-wrap">
			<div class="photonic-tabbed-options">
				<div class="photonic-header-nav">
					<div class="photonic-header-nav-top fix">
						<h1 class='photonic-header-1'>Photonic</h1>
						<div class='donate fix'>
							<form action="https://www.paypal.com/cgi-bin/webscr" method="post" id="paypal-submit" >
								<input type="hidden" name="cmd" value="_s-xclick"/>
								<input type="hidden" name="hosted_button_id" value="9018267"/>
								<ul>
									<li class='announcements'><a href='https://aquoid.com/news/'><span class="icon">&nbsp;</span>Announcements</a></li>
									<li class='support'><a href='https://wordpress.org/support/plugin/photonic/'><span class="icon">&nbsp;</span>Support</a></li>
									<li class='coffee'><span class="icon">&nbsp;</span><input type='submit' name='submit' value='Like Photonic? Buy me a coffee &hellip;' /></li>
									<li class='rate'><a href='https://wordpress.org/support/plugin/photonic/reviews/'><span class="icon">&nbsp;</span>&hellip; Or Rate it Well!</a></li>
								</ul>
								<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1"/>
							</form>
						</div><!-- donate -->
					</div>
					<div class="photonic-options-header-bar fix">
						<h2 class='nav-tab-wrapper'>
							<a class='nav-tab <?php if ($this->tab == 'generic-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-generic' href='?page=photonic-options-manager&amp;tab=generic-options.php'><span class="icon">&nbsp;</span> Generic Options</a>
							<a class='nav-tab <?php if ($this->tab == 'flickr-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-flickr' href='?page=photonic-options-manager&amp;tab=flickr-options.php'><span class="icon">&nbsp;</span> Flickr</a>
							<a class='nav-tab <?php if ($this->tab == 'smugmug-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-smugmug' href='?page=photonic-options-manager&amp;tab=smugmug-options.php'><span class="icon">&nbsp;</span> SmugMug</a>
							<a class='nav-tab <?php if ($this->tab == 'google-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-google' href='?page=photonic-options-manager&amp;tab=google-options.php'><span class="icon">&nbsp;</span> Google Photos</a>
							<a class='nav-tab <?php if ($this->tab == 'zenfolio-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-zenfolio' href='?page=photonic-options-manager&amp;tab=zenfolio-options.php'><span class="icon">&nbsp;</span> Zenfolio</a>
							<a class='nav-tab <?php if ($this->tab == 'instagram-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-instagram' href='?page=photonic-options-manager&amp;tab=instagram-options.php'><span class="icon">&nbsp;</span> Instagram</a>
							<a class='nav-tab <?php if ($this->tab == 'lightbox-options.php') echo 'nav-tab-active'; ?>' id='photonic-options-lightbox' href='?page=photonic-options-manager&amp;tab=lightbox-options.php'><span class="icon">&nbsp;</span> Lightboxes</a>
						</h2>
					</div>
				</div>
				<?php
				$option_structure = $this->get_option_structure();
				$group = substr($this->tab, 0, stripos($this->tab, '.'));

				echo "<div class='photonic-options photonic-options-$group' id='photonic-options'>";
				echo "<ul class='photonic-section-tabs'>";
				foreach ($option_structure as $l1_slug => $l1) {
					echo "<li><a href='#$l1_slug'>" . $l1['name'] . "</a></li>\n";
				}
				echo "</ul>";

				do_settings_sections($this->file);

				$last_option = end($option_structure);
				$last_slug = key($option_structure);
				$this->show_buttons($last_slug, $last_option);

				echo "</form>\n";
				echo "</div><!-- /photonic-options-panel -->\n";

				echo "</div><!-- /#photonic-options -->\n";
				?>
			</div><!-- /#photonic-tabbed-options -->
		</div>
		<?php
	}

	function show_buttons($slug, $option) {
		if (!isset($option['buttons']) || ($option['buttons'] != 'no-buttons' && $option['buttons'] != 'special-buttons')) {
			echo "<div class=\"photonic-button-bar photonic-button-bar-{$slug}\">\n";
			echo "<input name=\"photonic_options[submit-{$slug}]\" type='submit' value=\"Save page &ldquo;".esc_attr($option['name'])."&rdquo;\" class=\"button button-primary\" />\n";
			echo "<input name=\"photonic_options[submit-{$slug}]\" type='submit' value=\"Reset page &ldquo;".esc_attr($option['name'])."&rdquo;\" class=\"button\" />\n";
			echo "<input name=\"photonic_options[submit-{$slug}]\" type='submit' value=\"Delete all options\" class=\"button\" />\n";
			echo "</div><!-- photonic-button-bar -->\n";
		}
	}

	function render_helpers() { ?>
	<div class="photonic-wrap">
		<div class="photonic-tabbed-options" style='position: relative; display: inline-block; '>
			<div class="photonic-waiting"><img src="<?php echo plugins_url('/include/images/downloading-dots.gif', __FILE__); ?>" alt='waiting'/></div>
			<form method="post" id="photonic-helper-form">
				<div class="photonic-header-nav">
					<div class="photonic-header-nav-top fix">
						<h2 class='photonic-header-1'>Photonic</h2>
					</div>
				</div>
				<h3 class="photonic-helper-header">Flickr</h3>
				<div class="photonic-helper-box">
					<?php $this->display_flickr_id_helper(); ?>
				</div>
				<div class="photonic-helper-box">
					<?php $this->display_flickr_group_helper(); ?>
				</div>
				<h3 class="photonic-helper-header">Google Photos</h3>
				<div class="photonic-helper-box">
					<?php $this->display_google_photos_album_helper(); ?>
				</div>
				<h3 class="photonic-helper-header">SmugMug</h3>
				<div class="photonic-helper-box">
					<?php $this->display_smugmug_album_id_helper(); ?>
				</div>
				<h3 class="photonic-helper-header">Zenfolio</h3>
				<div class="photonic-helper-box">
					<?php $this->display_zenfolio_category_helper(); ?>
				</div>
				<h3 class="photonic-helper-header">Instagram</h3>
				<div class="photonic-helper-box">
					<?php $this->display_instagram_id_helper(); ?>
				</div>
			</form>
		</div>
	</div>
	<?php
	}

	function render_authentication() { ?>
		<div class="photonic-waiting"><img src="<?php echo plugins_url('/include/images/downloading-dots.gif', __FILE__); ?>" alt='waiting'/></div>
		<h1>Photonic - Authentication</h1>
		<form method="post" id="photonic-auth-form">
			<h3 id="#photonic-flickr-auth-section">Flickr</h3>
			<?php $this->display_flickr_token_getter(); ?>

			<h3 id="#photonic-smugmug-auth-section">SmugMug</h3>
			<?php $this->display_smugmug_token_getter(); ?>

			<h3 id="#photonic-google-auth-section">Google Photos</h3>
			<?php $this->display_google_token_getter(); ?>

<!--			<h3 id="#photonic-google-auth-section-bundled">Google Photos</h3>
			--><?php /*$this->display_google_bundled_token_getter(); */?>

			<h3 id="#photonic-instagram-auth-section">Instagram</h3>
			<?php $this->display_instagram_access_token_helper(); ?>

			<h3 id="#photonic-zenfolio-auth-section">Zenfolio</h3>
			<?php $this->display_zenfolio_token_getter(); ?>
		</form>
		<?php
	}

	function render_gutenberg() { ?>
		<div class="photonic-wrap">
			<div class="photonic-waiting"><img src="<?php echo plugins_url('/include/images/downloading-dots.gif', __FILE__); ?>" alt='waiting'/></div>
			<form method="post" id="photonic-helper-form" name="photonic-helper-form">
				<div class="photonic-header-nav">
					<h1 class='photonic-header-1'>Prepare Photonic on Your Site for Gutenberg</h1>
				</div>
				<div class="photonic-form-body fix">
					<h2>What is Gutenberg?</h2>
					<p>
						WordPress 5.0 includes a new editor codenamed Gutenberg. Gutenberg features a different style of
						creating content, which introduces a concept called a <code>block</code>. While Gutenberg is slated to
						be bundled in WP 5.0, you can test out your site's readiness beforehand using the Gutenberg plugin.
					</p>

					<h2>How does it impact Photonic on your site?</h2>
					<p>
						If you have configured Photonic not to use the standard <code>gallery</code> shortcode, and instead have
						a custom shortcode via <em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Custom Shortcode</em>,
						you are fine!
					</p>
					<p>
						<strong>But if you are using the <code>gallery</code> shortcode for Photonic and you click on
							"Convert to Blocks" using Gutenberg, your post will be in trouble!</strong> <span class="warning">All your instances of the
								<code>gallery</code> shortcode will be replaced by the native WordPress Gallery Block.</span>
					</p>
					<p>
						To avoid this you can find and replace all instances of the <code>gallery</code> shortcode
						used for Photonic and replace them with a custom shortcode of your choosing.
					</p>
					<div style="text-align: center">
						<img src="<?php echo plugins_url('/include/images/Gutenberg.jpg', __FILE__); ?>" alt="Gutenberg Flow" title="Gutenberg Flow"/>
					</div>

					<h2>Am I using the Gallery Shortcode with Photonic?</h2>
					<div id="photonic-shortcode-results">
						<?php
						require_once(PHOTONIC_PATH."/admin/Photonic_Shortcode_Usage.php");
						$usage = new Photonic_Shortcode_Usage();
						echo sprintf(esc_html__('%2$sThe following instances were found on your site for Photonic with the %4$s%1$s%5$s shortcode. %6$sPlease verify the instances below before replacing the shortcodes. It is strongly recommended to back up the posts listed below before the shortcode replacement.%7$s%3$s', 'photonic'),
							$usage->tag, '<p>', '</p>', '<code>', '</code>', '<strong>', '</strong>');
						$usage->prepare_items();
						$usage->display();
						?>
					</div>
				</div>
			</form>
		</div>
		<?php
	}

	function display_flickr_id_helper() {
		global $photonic_flickr_api_key;
		if (empty($photonic_flickr_api_key)) {
			echo sprintf(esc_html__('Please set up your Flickr API Key under %s', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings</em>');
		}
		else {
			echo '<h4>'.esc_html__('Flickr User ID Finder', 'photonic').'</h4>';
			echo '<label>'.esc_html__('Enter your Flickr photostream URL and click "Find"', 'photonic');
			echo '<input type="text" value="https://www.flickr.com/photos/username/" id="photonic-flickr-user" name="photonic-flickr-user"/>';
			echo '</label>';
			echo '<input type="button" value="'.esc_attr__('Find', 'photonic').'" id="photonic-flickr-user-find" class="button button-primary"/>';
			echo '<div class="result">&nbsp;</div>';
		}
	}

	function display_flickr_group_helper() {
		global $photonic_flickr_api_key;
		if (empty($photonic_flickr_api_key)) {
			echo sprintf(esc_html__('Please set up your Flickr API Key under %s', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings</em>');
		}
		else {
			echo '<h4>'.esc_html__('Flickr Group ID Finder', 'photonic').'</h4>';
			echo '<label>'.esc_html__('Enter your Flickr group URL and click "Find"', 'photonic');
			echo '<input type="text" value="https://www.flickr.com/groups/groupname/" id="photonic-flickr-group" name="photonic-flickr-group"/>';
			echo '</label>';
			echo '<input type="button" value="'.esc_attr__('Find', 'photonic').'" id="photonic-flickr-group-find" class="button button-primary"/>';
			echo '<div class="result">&nbsp;</div>';
		}
	}

	function display_smugmug_album_id_helper() {
		global $photonic_smug_api_key;
		if (empty($photonic_smug_api_key)) {
			echo sprintf(esc_html__('Please set up your SmugMug API Key under %s', 'photonic'), '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings</em>');
		}
		else {
			echo '<h4>'.esc_html__('SmugMug User Albums and Folders', 'photonic').'</h4>';
			echo '<label>'.esc_html__('Enter your SmugMug username and click "Find"', 'photonic');
			echo '<input type="text" value="username" id="photonic-smugmug-user" name="photonic-smugmug-user"/>';
			echo '</label>';
			echo '<input type="button" value="'.esc_attr__('Find', 'photonic').'" id="photonic-smugmug-user-tree" class="button button-primary"/>';
			echo '<div class="result">&nbsp;</div>';
		}
	}

	function display_flickr_token_getter() {
		global $photonic_flickr_gallery;
		if (!isset($photonic_flickr_gallery)) {
			$photonic_flickr_gallery = new Photonic_Flickr_Processor();
		}

		$this->show_token_section($photonic_flickr_gallery, 'flickr', 'Flickr');
	}

	function display_smugmug_token_getter() {
		global $photonic_smugmug_gallery;
		if (!isset($photonic_smugmug_gallery)) {
			$photonic_smugmug_gallery = new Photonic_SmugMug_Processor();
		}

		$this->show_token_section($photonic_smugmug_gallery, 'smug', 'SmugMug');
	}

	function display_google_token_getter() {
		global $photonic_google_client_id, $photonic_google_client_secret, $photonic_google_gallery, $photonic_google_refresh_token;
		echo "<div class=\"photonic-token-header\">\n";
		if (empty($photonic_google_client_id) || empty($photonic_google_client_secret)) {
			echo sprintf(esc_html__('Please set up your Google Client ID and Client Secret under %s', 'photonic'),
				'<em>Photonic &rarr; Settings &rarr; Google Photos &rarr; Google Photos Settings</em>');
		}
		else {
			if (!isset($photonic_google_gallery)) {
				$photonic_google_gallery = new Photonic_Google_Photos_Processor();
			}
			$parameters = Photonic_Processor::parse_parameters($_SERVER['QUERY_STRING']);

			if (!empty($photonic_google_refresh_token)) {
				esc_html_e('You have already set up your authentication.', 'photonic');
				echo '<span class="photonic-all-ok">'.esc_html__('Unless you wish to regenerate the token this step is not required.', 'photonic').'</span><br/>';
			}

			echo "</div>\n";
			echo "<div class=\"photonic-token-header\">\n";
			esc_html_e("You first have to authorize Photonic to connect to your Google account.", 'photonic');
			echo "<br/>\n";
			if (!isset($parameters['code']) || !isset($parameters['source']) || $parameters['source'] != 'google') {
				echo "<a href='".$photonic_google_gallery->get_authorization_url(array('redirect_uri' => admin_url('admin.php?page=photonic-auth&source=google'), 'prompt' => 'consent'))."' class='button button-primary'>".
					esc_html__('Step 1: Authenticate', 'photonic')."</a>";
				echo "</div>\n";
				echo "<div class=\"photonic-token-header\">\n";
				echo esc_html__("Next, you have to obtain the token.", 'photonic').'<br/>';
				echo "<span class='button photonic-helper-button-disabled'>".
					esc_html__('Step 2: Obtain Token', 'photonic')."</span>";
			}
			else {
				echo "<span class='button photonic-helper-button-disabled'>".
					esc_html__('Step 1: Authenticate', 'photonic')."</span>";
				echo "</div>\n";
				echo "<div class=\"photonic-token-header\">\n";
				echo esc_html__("Next, you have to obtain the token.", 'photonic').'<br/>';
				echo "<a href='#' class='button button-primary photonic-google-refresh'>".
					esc_html__('Step 2: Obtain Token', 'photonic')."</a>";
				echo '<input type="hidden" value="'.$parameters['code'].'" id="photonic-google-oauth-code"/>';
				echo '<input type="hidden" value="'.$parameters['state'].'" id="photonic-google-oauth-state"/>';
			}
		}
		echo "</div>\n";
		echo '<div class="result" id="google-result">&nbsp;</div>';
		echo sprintf(esc_html__('If you are facing issues with the authentication please follow the workaround %1$shere%2$s', 'photonic'),
			'<a href="https://aquoid.com/plugins/photonic/google-photos/#auth-workaround" target="_blank">',
			'</a>');
	}

	function display_google_bundled_token_getter() {
		global $photonic_google_gallery, $photonic_google_refresh_token;
		echo "<div class=\"photonic-token-header\">\n";
		if (!isset($photonic_google_gallery)) {
			$photonic_google_gallery = new Photonic_Google_Photos_Processor();
		}
		$parameters = Photonic_Processor::parse_parameters($_SERVER['QUERY_STRING']);

		if (!empty($photonic_google_refresh_token) && $photonic_google_gallery->refresh_token_valid) {
			esc_html_e('You have already set up your authentication.', 'photonic');
			echo '<span class="photonic-all-ok">'.esc_html__('Unless you wish to regenerate the token this step is not required.', 'photonic').'</span><br/>';
		}

		echo "</div>\n";
		echo "<div class=\"photonic-token-header\">\n";
		esc_html_e("You first have to authorize Photonic to connect to your Google account.", 'photonic');
		echo "<br/>\n";
		if (!isset($parameters['code']) || !isset($parameters['source']) || $parameters['source'] != 'google') {
			echo "<a href='".$photonic_google_gallery->get_authorization_url(array(
					'redirect_uri' => 'https://aquoid.com/photonic-router/google.php',
					'state' => admin_url('admin.php?page=photonic-auth&source=google'),
					'prompt' => 'consent',
				))."' class='button button-primary'>".
				esc_html__('Step 1: Authenticate', 'photonic')."</a>";
			echo "</div>\n";
			echo "<div class=\"photonic-token-header\">\n";
			echo esc_html__("Next, you have to obtain the token.", 'photonic').'<br/>';
			echo "<span class='button photonic-helper-button-disabled'>".
				esc_html__('Step 2: Obtain Token', 'photonic')."</span>";
		}
		else {
			echo "<span class='button photonic-helper-button-disabled'>".
				esc_html__('Step 1: Authenticate', 'photonic')."</span>";
			echo "</div>\n";
			echo "<div class=\"photonic-token-header\">\n";
			echo esc_html__("Next, you have to obtain the token.", 'photonic').'<br/>';
			echo "<a href='#' class='button button-primary photonic-google-refresh'>".
				esc_html__('Step 2: Obtain Token', 'photonic')."</a>";
			echo '<input type="hidden" value="'.$parameters['code'].'" id="photonic-google-oauth-code"/>';
		}
		echo "</div>\n";
		echo '<div class="result" id="google-result">&nbsp;</div>';

		echo "<div class=\"photonic-token-header\">\n";
		echo esc_html__("If the above method is not working due to conflicts with your site's security setup try an alternative method where the authentication happens on a different site.", 'photonic').'<br/>';
		echo "<a href='".$photonic_google_gallery->get_authorization_url(array(
				'redirect_uri' => 'https://aquoid.com/photonic-router/google.php',
				'prompt' => 'consent',
				'state' => '',
			))."' class='button button-primary' target='_blank'>".
			esc_html__("Authenticate using Photonic's website", 'photonic')."</a>";
		echo "</div>\n";
	}

	function display_zenfolio_token_getter() {
		global $photonic_zenfolio_gallery, $photonic_zenfolio_default_user;
		if (!isset($photonic_zenfolio_gallery)) {
			$photonic_zenfolio_gallery = new Photonic_Zenfolio_Processor();
		}
		$gallery = $photonic_zenfolio_gallery;

		echo "<div class=\"photonic-token-header\">\n";
		if (empty($photonic_zenfolio_default_user)) {
			echo sprintf(esc_html__('Please set up the default user for Zenfolio under %s', 'photonic'),
					'<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Default User</em>')."\n";
		}
		else if (!empty($gallery->token)) {
			esc_html_e('You have already set up your authentication.', 'photonic');
			echo '<span class="photonic-all-ok">'.esc_html__('Unless you wish to regenerate the token this step is not required.', 'photonic').'</span><br/>';
		}
		echo "</div>\n";

		$response = Photonic_Processor::parse_parameters($_SERVER['QUERY_STRING']);
		if (!empty($photonic_zenfolio_default_user) && (empty($response['provider']) || 'zenfolio' !== $response['provider'])) {
			echo "<label>".esc_html__('Password:', 'photonic')."<input type='password' name='zenfolio-password' id='zenfolio-password'></label>";
			echo "<a href='#' class='button button-primary' data-photonic-provider='zenfolio'>" . esc_html__('Login and Authenticate', 'photonic') . "</a>";
		}
		if (!empty($gallery->token)) {
			echo "<div style='display: block; width: 100%;'>\n";
			echo "<a href='#' class='button button-primary photonic-zenfolio-delete'>".esc_html__('Delete current authentication data', 'photonic')."</a>";
			echo "</div>\n";
		}
		echo '<div class="result" id="zenfolio-result">&nbsp;</div>';
	}

	function display_google_photos_album_helper() {
		echo '<h4>'.esc_html__('Google Photos Album ID Finder', 'photonic').'</h4>';
		global $photonic_google_client_id, $photonic_google_client_secret, $photonic_google_refresh_token, $photonic_google_use_own_keys;
//		if (!empty($photonic_google_use_own_keys) && (empty($photonic_google_client_id) || empty($photonic_google_client_secret))) {
		if (empty($photonic_google_client_id) || empty($photonic_google_client_secret)) {
			echo sprintf(esc_html__('Please set up your Google Client ID and Client Secret under %s', 'photonic'),
				'<em>Photonic &rarr; Settings &rarr; Google Photos &rarr; Google Photos Settings</em>');
		}
		else if (empty($photonic_google_refresh_token)) {
			echo sprintf(esc_html__('Please obtain your Refresh Token and save it under %s', 'photonic'),
				'<em>Photonic &rarr; Settings &rarr; Google Photos &rarr; Google Photos Settings</em>');
		}
		else {
			echo '<input type="button" value="'.esc_attr__('Find my albums', 'photonic').'" id="photonic-google-album-find" class="button button-primary"/>';
			echo '<div class="result">&nbsp;</div>';
		}
	}

	function display_instagram_access_token_helper() {
		global $photonic_instagram_gallery;
		if (!isset($photonic_instagram_gallery)) {
			$photonic_instagram_gallery = new Photonic_Instagram_Processor();
		}
		$this->show_token_section_header($photonic_instagram_gallery, 'Instagram');
		$response = Photonic_Processor::parse_parameters($_SERVER['QUERY_STRING']);
		if (empty($response['access_token'])) {
			echo "<a href='https://instagram.com/oauth/authorize/?client_id=f95ba49c90034990b8f5c7270c264fd3&scope=basic+public_content&redirect_uri=https://aquoid.com/photonic-router/?internal_uri=" .
				admin_url('admin.php?page=photonic-auth') . "&response_type=token' class='button button-primary'>" .
				esc_html__('Login and get Access Token', 'photonic') . "</a>";
		}
		else if (!empty($response['access_token'])) {
			echo "<span class='button photonic-helper-button-disabled'>" . esc_html__('Login and get Access Token', 'photonic') . "</span>";
			echo '<div class="result">'.(!empty($response['access_token']) ? 'Access token: <code id="instagram-token">'.$response['access_token'].'</code>' : '&nbsp;').'</div>';
			echo "<a href='#' class='button button-primary photonic-save-token' data-photonic-provider='instagram'>" . esc_html__('Save Token', 'photonic') . "</a>";
		}
	}

	function display_instagram_id_helper() {
		global $photonic_instagram_access_token;
		if (!isset($photonic_instagram_access_token)) {
			echo sprintf(esc_html__('Please set up your Instagram Access Token under %s', 'photonic'),
					'<em>Photonic &rarr; Settings &rarr; Instagram &rarr; Instagram Settings</em>')."\n";
		}
		else {
			echo '<h4>'.esc_html__('Instagram ID Finder', 'photonic').'</h4>';
			echo sprintf(esc_html__('Instagram has made it almost impossible to determine user ids using the API. %1$sThat being said, if you are authenticated your user id is not required: the authenticated user is used to show photos.%2$s However, if you are feeling adventurous, you can try the following steps:', 'photonic'),
					'<strong>', '</strong>')."<br/>\n";
			echo "<ol>\n";
			echo "<li>".esc_html__("Log into Instagram with your account on a browser like Chrome, Firefox or Edge", 'photonic')."</li>\n";
			echo "<li>".esc_html__("Open the Developer tools and go to the Console tab", 'photonic')."</li>\n";
			echo "<li>".sprintf(esc_html__('Type %s and hit "Enter"', 'photonic'), '<code>window._sharedData.config.viewer.id</code>')."</li>\n";
			echo "<li>".esc_html__("Your id will show up", 'photonic')."</li>\n";
			echo "</ol>\n";
		}
	}

	function display_zenfolio_category_helper() {
		echo '<h4>'.esc_html__('Zenfolio Categories', 'photonic').'</h4>';
		echo '<input type="button" value="'.esc_attr__('List', 'photonic').'" id="photonic-zenfolio-categories-find" class="button button-primary"/>';
		echo '<div class="result">&nbsp;</div>';
	}

	function init() {
		foreach ($this->option_structure as $slug => $option) {
			register_setting('photonic_options-'.$slug, 'photonic_options', array(&$this, 'validate_options'));
			add_settings_section($slug, "", array(&$this, "create_settings_section"), $this->file);
			$this->add_settings_fields($this->file);
		}
	}

	function validate_options($options) {
		foreach ($options as $option => $option_value) {
			if (isset($this->reverse_options[$option])) {
				//Sanitize options
				switch ($this->reverse_options[$option]) {
					// For all text type of options make sure that the eventual text is properly escaped.
					case "text":
					case "textarea":
					case "color-picker":
					case "background":
					case "border":
						$options[$option] = esc_attr($option_value);
						break;

					case "select":
					case "radio":
						if (isset($this->allowed_values[$option])) {
							if (!array_key_exists($option_value, $this->allowed_values[$option])) {
								$options[$option] = $this->option_defaults[$option];
							}
						}
				        break;

					case "multi-select":
						$selections = explode(',', $option_value);
						$final_selections = array();
						foreach ($selections as $selection) {
							if (array_key_exists($selection, $this->allowed_values[$option])) {
								$final_selections[] = $selection;
							}
						}
						$options[$option] = implode(',', $final_selections);
						break;

					case "sortable-list":
						$selections = explode(',', $option_value);
						$final_selections = array();
						$master_list = $this->option_defaults[$option]; // Sortable lists don't have their values in ['options']
						foreach ($selections as $selection) {
							if (array_key_exists($selection, $master_list)) {
								$final_selections[] = $selection;
							}
						}
						$options[$option] = implode(',', $final_selections);
						break;

					case "checkbox":
						if (!in_array($option_value, array('on', 'off', 'true', 'false')) && isset($this->option_defaults[$option])) {
							$options[$option] = $this->option_defaults[$option];
						}
						break;
				}
			}
		}

		/* The Settings API does an update_option($option, $value), overwriting the $photonic_options array with the values on THIS page
		 * This is problematic because all options are stored in a single array, but are displayed on different options pages.
		 * Hence the overwrite kills the options from the other pages.
		 * So this is a workaround to include the options from other pages as hidden fields on this page, so that the array gets properly updated.
		 * The alternative would be to separate options for each page, but that would cause a migration headache for current users.
		 */
		if (isset($this->hidden_options) && is_array($this->hidden_options)) {
			foreach ($this->hidden_options as $hidden_option => $hidden_value) {
				if (strlen($hidden_option) >= 7 && (substr($hidden_option, 0, 7) == 'submit-' || substr($hidden_option, 0, 6) == 'reset-')) {
					continue;
				}
				$options[$hidden_option] = esc_attr($hidden_value);
			}
		}

		foreach ($this->nested_options as $section => $children) {
			if (isset($options['submit-'.$section])) {
				$options['last-set-section'] = $section;
				if (substr($options['submit-'.$section], 0, 9) == 'Save page' || substr($options['submit-'.$section], 0, 10) == 'Reset page') {
					global $photonic_options;
					foreach ($this->nested_options as $inner_section => $inner_children) {
						if ($inner_section != $section) {
							foreach ($inner_children as $inner_child) {
								if (isset($photonic_options[$inner_child])) {
									$options[$inner_child] = $photonic_options[$inner_child];
								}
							}
						}
					}

					if (substr($options['submit-'.$section], 0, 10) == 'Reset page') {
						unset($options['submit-'.$section]);
						// This is a reset for an individual section. So we will unset the child fields.
						foreach ($children as $child) {
							unset($options[$child]);
						}
					}
					unset($options['submit-'.$section]);
				}
				else if (substr($options['submit-'.$section], 0, 12) == 'Save changes') {
					unset($options['submit-'.$section]);
				}
				else if (substr($options['submit-'.$section], 0, 13) == 'Reset changes') {
					unset($options['submit-'.$section]);
					// This is a reset for all options in the sub-menu. So we will unset all child fields.
					foreach ($this->nested_options as $inner_section => $inner_children) {
						foreach ($inner_children as $child) {
							unset($options[$child]);
						}
					}
				}
				else if (substr($options['submit-'.$section], 0, 6) == 'Delete') {
					return;
				}
				break;
			}
		}
		return $options;
	}

	function get_option_structure() {
		if (isset($this->option_structure)) {
			return $this->option_structure;
		}
		$options = $this->tab_options;
		$option_structure = array();
		foreach ($options as $value) {
			switch ($value['type']) {
				case "title":
					$option_structure[$value['category']] = array();
					$option_structure[$value['category']]['slug'] = $value['category'];
					$option_structure[$value['category']]['name'] = $value['name'];
					$option_structure[$value['category']]['children'] = array();
					break;
				case "section":
			//		$option_structure[$value['parent']]['children'][$value['category']] = $value['name'];

					$option_structure[$value['category']] = array();
					$option_structure[$value['category']]['slug'] = $value['category'];
					$option_structure[$value['category']]['name'] = $value['name'];
					$option_structure[$value['category']]['children'] = array();
					if (isset($value['help'])) $option_structure[$value['category']]['help'] = $value['help'];
					if (isset($value['buttons'])) $option_structure[$value['category']]['buttons'] = $value['buttons'];
					break;
				default:
//					$option_structure[$value['grouping']]['children'][$value['name']] = $value['name'];
					if (isset($value['id'])) {
						$option_structure[$value['grouping']]['children'][$value['id']] = $value['name'];
					}
			}
		}
		return $option_structure;
	}

	function add_settings_fields($page) {
		$ctr = 0;
		foreach ($this->tab_options as $value) {
			$ctr++;
			switch ($value['type']) {
				case "blurb";
					add_settings_field($value['grouping'].'-'.$ctr, $value['name'], array(&$this, "create_section_for_blurb"), $page, $value['grouping'], $value);
					break;

				case "text";
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_text"), $page, $value['grouping'], $value);
					break;

				case "textarea";
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_textarea"), $page, $value['grouping'], $value);
					break;

				case "select":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_select"), $page, $value['grouping'], $value);
					break;

				case "multi-select":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_multi_select"), $page, $value['grouping'], $value);
					break;

				case "radio":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_radio"), $page, $value['grouping'], $value);
					break;

				case "checkbox":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_checkbox"), $page, $value['grouping'], $value);
					break;

				case "border":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_border"), $page, $value['grouping'], $value);
					break;

				case "background":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_background"), $page, $value['grouping'], $value);
					break;

				case "padding":
					add_settings_field($value['id'], $value['name'], array(&$this, "create_section_for_padding"), $page, $value['grouping'], $value);
					break;
			}
		}
	}

	function create_title($value) {
		//echo '<h2 class="photonic-header-1">'.$value['name']."</h2>\n";
	}

	function create_section_for_radio($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		foreach ($value['options'] as $option_value => $option_text) {
			$option_value = stripslashes($option_value);
			if (isset($photonic_options[$value['id']])) {
				$checked = checked(stripslashes($photonic_options[$value['id']]), $option_value, false);
			}
			else {
				$checked = checked($photonic_default_options[$value['id']], $option_value, false);
			}
			echo '<div class="photonic-radio"><label><input type="radio" name="photonic_options['.$value['id'].']" value="'.$option_value.'" '.$checked."/>".$option_text."</label></div>\n";
		}
		$this->create_closing_tag($value);
	}

	function create_section_for_text($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		if (!isset($photonic_options[$value['id']])) {
			$text = $photonic_default_options[$value['id']];
		}
		else {
			$text = $photonic_options[$value['id']];
			$text = stripslashes($text);
			$text = esc_attr($text);
		}

		echo '<input type="text" name="photonic_options['.$value['id'].']" value="'.$text.'" />'."\n";
		if (isset($value['hint'])) {
			echo "<em> &laquo; ".$value['hint']."<br /></em>\n";
		}
		$this->create_closing_tag($value);
	}

	function create_section_for_textarea($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		echo '<textarea name="photonic_options['.$value['id'].']" cols="" rows="">'."\n";
		if (isset($photonic_options[$value['id']]) && $photonic_options[$value['id']] != "") {
			$text = stripslashes($photonic_options[$value['id']]);
			$text = esc_attr($text);
			echo $text;
		}
		else {
			echo $photonic_default_options[$value['id']];
		}
		echo '</textarea>';
		if (isset($value['hint'])) {
			echo " &laquo; ".$value['hint']."<br />\n";
		}
		$this->create_closing_tag($value);
	}

	function create_section_for_select($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		echo '<select name="photonic_options['.$value['id'].']">'."\n";
		foreach ($value['options'] as $option_value => $option_text) {
			echo "<option ";
			if (isset($photonic_options[$value['id']])) {
				selected($photonic_options[$value['id']], $option_value);
			}
			else {
				selected($photonic_default_options[$value['id']], $option_value);
			}
			echo " value='$option_value' >".$option_text."</option>\n";
		}
		echo "</select>\n";
		$this->create_closing_tag($value);
	}

	function create_section_for_multi_select($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		echo '<div class="photonic-checklist">'."\n";
		echo '<ul class="photonic-checklist" id="'.$value['id'].'-chk" >'."\n";
		if (isset($photonic_default_options[$value['id']])) {
			$consolidated_value = $photonic_default_options[$value['id']];
		}
		if (isset($photonic_options[$value['id']])) {
			$consolidated_value = $photonic_options[$value['id']];
		}
		if (!isset($consolidated_value)) {
			$consolidated_value = "";
		}
		$consolidated_value = trim($consolidated_value);
		$exploded = array();
		if ($consolidated_value != '') {
			$exploded = explode(',', $consolidated_value);
		}

		foreach ($value['options'] as $option_value => $option_list) {
			$checked = " ";
			if ($consolidated_value) {
				foreach ($exploded as $checked_value) {
					$checked = checked($checked_value, $option_value, false);
					if (trim($checked) != '') {
						break;
					}
				}
			}
			echo "<li>\n";
			$depth = 0;
			if (isset($option_list['depth'])) {
				$depth = $option_list['depth'];
			}
			echo '<label><input type="checkbox" name="'.$value['id']."_".$option_value.'" value="true" '.$checked.' class="depth-'.($depth+1).' photonic-options-checkbox-'.$value['id'].'" data-photonic-selection-for="'.$value['id'].'" data-photonic-value="'.$option_value.'" />'.$option_list['title']."</label>\n";
			echo "</li>\n";
		}
		echo "</ul>\n";

		if (isset($photonic_options[$value['id']])) {
			$set_value = $photonic_options[$value['id']];
		}
		else if (isset($photonic_default_options[$value['id']])) {
			$set_value = $photonic_default_options[$value['id']];
		}
		else {
			$set_value = "";
		}
		echo '<input type="hidden" name="photonic_options['.$value['id'].']" id="'.$value['id'].'" value="'.$set_value.'"/>'."\n";
		echo "</div>\n";
		$this->create_closing_tag($value);
	}

	function create_section_for_color_picker($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		if (!isset($photonic_options[$value['id']])) {
			$color_value = $photonic_default_options[$value['id']];
		}
		else {
			$color_value = $photonic_options[$value['id']];
		}
		if (substr($color_value, 0, 1) != '#') {
			$color_value = "#$color_value";
		}

		echo '<div class="color-picker">'."\n";
		echo '<input type="text" id="'.$value['id'].'" name="photonic_options['.$value['id'].']" value="'.$color_value.'" class="color color-'.$value['id'].'" /> <br/>'."\n";
		echo "<strong>Default: ".$photonic_default_options[$value['id']]."</strong> (You can copy and paste this into the box above)\n";
		echo "</div>\n";
		$this->create_closing_tag($value);
	}

	function create_settings_section($section) {
		$option_structure = $this->option_structure;
		if ($this->displayed_sections != 0) {
			$this->show_buttons($this->previous_displayed_section, $option_structure[$this->previous_displayed_section]);
			echo "</form>\n";
			echo "</div><!-- /photonic-options-panel -->\n";
		}

		echo "<div id='{$section['id']}' class='photonic-options-panel'> \n";
		echo "<form method=\"post\" action=\"options.php\" id=\"photonic-options-form-{$section['id']}\" class='photonic-options-form'>\n";
		echo '<h3>' . $option_structure[$section['id']]['name'] . "</h3>\n";

		/*
		 * We store all options in one array, but display them across multiple pages. Hence we need the following hack.
		 * We are registering the same setting across multiple pages, hence we need to pass the "page" parameter to options.php.
		 * Otherwise options.php returns an error saying "Options page not found"
		 */
		echo "<input type='hidden' name='page' value='" . esc_attr($_REQUEST['page']) . "' />\n";
		if (!isset($_REQUEST['tab'])) {
			$tab = 'theme-options-intro.php';
		}
		else {
			$tab = esc_attr($_REQUEST['tab']);
		}
		echo "<input type='hidden' name='tab' value='" . $tab . "' />\n";

		settings_fields("photonic_options-{$section['id']}");
		$this->displayed_sections++;
		$this->previous_displayed_section = $section['id'];
	}

	function create_section_for_blurb($value) {
		$this->create_opening_tag($value);
		$this->create_closing_tag($value);
	}

	/**
	 * Renders an option whose type is "checkbox". Invoked by add_settings_field.
	 *
	 * @param  $value
	 * @return void
	 */
	function create_section_for_checkbox($value) {
		global $photonic_options;
		$checked = '';
		if (isset($photonic_options[$value['id']])) {
			$checked = checked(stripslashes($photonic_options[$value['id']]), 'on', false);
		}
		$this->create_opening_tag($value);
		echo '<label><input type="checkbox" name="photonic_options['.$value['id'].']" '.$checked."/>{$value['desc']}</label>\n";
		$this->create_closing_tag($value);
	}

	/**
	 * Renders an option whose type is "border". Invoked by add_settings_field.
	 *
	 * @param  $value
	 * @return void
	 */
	function create_section_for_border($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		$original = $photonic_default_options[$value['id']];
		if (!isset($photonic_options[$value['id']])) {
			$default = $photonic_default_options[$value['id']];
			$default_txt = "";
			foreach ($default as $edge => $edge_val) {
				$default_txt .= $edge.'::';
				foreach ($edge_val as $opt => $opt_val) {
					$default_txt .= $opt . "=" . $opt_val . ";";
				}
				$default_txt .= "||";
			}
		}
		else {
			$default_txt = $photonic_options[$value['id']];
			$default = $default_txt;
			$edge_array = explode('||', $default);
			$default = array();
			if (is_array($edge_array)) {
				foreach ($edge_array as $edge_vals) {
					if (trim($edge_vals) != '') {
						$edge_val_array = explode('::', $edge_vals);
						if (is_array($edge_val_array) && count($edge_val_array) > 1) {
							$vals = explode(';', $edge_val_array[1]);
							$default[$edge_val_array[0]] = array();
							foreach ($vals as $val) {
								$pair = explode("=", $val);
								if (isset($pair[0]) && isset($pair[1])) {
									$default[$edge_val_array[0]][$pair[0]] = $pair[1];
								}
								else if (isset($pair[0]) && !isset($pair[1])) {
									$default[$edge_val_array[0]][$pair[0]] = "";
								}
							}
						}
					}
				}
			}
		}
		$edges = array('top' => 'Top', 'right' => 'Right', 'bottom' => 'Bottom', 'left' => 'Left');
		$styles = array("none" => "No border",
			"hidden" => "Hidden",
			"dotted" => "Dotted",
			"dashed" => "Dashed",
			"solid" => "Solid",
			"double" => "Double",
			"grove" => "Groove",
			"ridge" => "Ridge",
			"inset" => "Inset",
			"outset" => "Outset");

		$border_width_units = array("px" => "Pixels (px)", "em" => "Em");

		foreach ($value['options'] as $option_value => $option_text) {
			if (isset($photonic_options[$value['id']])) {
				$checked = checked($photonic_options[$value['id']], $option_value, false);
			}
			else {
				$checked = checked($photonic_default_options[$value['id']], $option_value, false);
			}
			echo '<div class="photonic-radio"><input type="radio" name="'.$value['id'].'" value="'.$option_value.'" '.$checked."/>".$option_text."</div>\n";
		}
	?>
		<div class='photonic-border-options'>
			<p>For any edge set style to "No Border" if you don't want a border.</p>
			<table class='opt-sub-table-5'>
				<col class='opt-sub-table-col-51'/>
				<col class='opt-sub-table-col-5'/>
				<col class='opt-sub-table-col-5'/>
				<col class='opt-sub-table-col-5'/>
				<col class='opt-sub-table-col-5'/>

				<tr>
					<th scope="col">&nbsp;</th>
					<th scope="col">Border Style</th>
					<th scope="col">Color</th>
					<th scope="col">Border Width</th>
					<th scope="col">Border Width Units</th>
				</tr>

		<?php
			foreach ($edges as $edge => $edge_text) {
		?>
			<tr>
				<th scope="row"><?php echo $edge_text; ?></th>
				<td valign='top'>
					<select name="<?php echo $value['id'].'-'.$edge; ?>-style" id="<?php echo $value['id'].'-'.$edge; ?>-style" >
				<?php
					foreach ($styles as $option_value => $option_text) {
						echo "<option ";
						if (isset($default[$edge]) && isset($default[$edge]['style'])) {
							selected($default[$edge]['style'], $option_value);
						}
						echo " value='$option_value' >".$option_text."</option>\n";
					}
				?>
					</select>
				</td>

				<td valign='top'>
					<div class="color-picker-group">
						<input type="radio" name="<?php echo $value['id'].'-'.$edge; ?>-colortype" value="transparent" <?php checked($default[$edge]['colortype'], 'transparent'); ?> /> Transparent / No color<br/>
						<input type="radio" name="<?php echo $value['id'].'-'.$edge; ?>-colortype" value="custom" <?php checked($default[$edge]['colortype'], 'custom'); ?>/> Custom
						<input type="text" id="<?php echo $value['id'].'-'.$edge; ?>-color" name="<?php echo $value['id']; ?>-color" value="<?php echo $default[$edge]['color']; ?>" data-photonic-default-color="<?php echo $original[$edge]['color']; ?>" class="color" /><br />
						Default: <span> <?php echo $original[$edge]['color']; ?> </span>
					</div>
				</td>

				<td valign='top'>
					<input type="text" id="<?php echo $value['id'].'-'.$edge; ?>-border-width" name="<?php echo $value['id'].'-'.$edge; ?>-border-width" value="<?php echo $default[$edge]['border-width']; ?>" /><br />
				</td>

				<td valign='top'>
					<select name="<?php echo $value['id'].'-'.$edge; ?>-border-width-type" id="<?php echo $value['id'].'-'.$edge; ?>-border-width-type" >
				<?php
					foreach ($border_width_units as $option_value => $option_text) {
						echo "<option ";
						selected($default[$edge]['border-width-type'], $option_value);
						echo " value='$option_value' >".$option_text."</option>\n";
					}
				?>
					</select>
				</td>
			</tr>
		<?php
			}
		?>
			</table>
		<input type='hidden' id="<?php echo $value['id']; ?>" name="photonic_options[<?php echo $value['id']; ?>]" value="<?php echo $default_txt; ?>" />
		</div>
	<?php
		$this->create_closing_tag($value);
	}

	/**
	 * Renders an option whose type is "background". Invoked by add_settings_field.
	 *
	 * @param  $value
	 * @return void
	 */
	function create_section_for_background($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		$original = $photonic_default_options[$value['id']];
		if (!isset($photonic_options[$value['id']])) {
			$default = $photonic_default_options[$value['id']];
			$default_txt = "";
			foreach ($photonic_default_options[$value['id']] as $opt => $opt_val) {
				$default_txt .= $opt."=".$opt_val.";";
			}
		}
		else {
			$default_txt = $photonic_options[$value['id']];
			$default = $default_txt;
			$vals = explode(";", $default);
			$default = array();
			foreach ($vals as $val) {
				$pair = explode("=", $val);
				if (isset($pair[0]) && isset($pair[1])) {
					$default[$pair[0]] = $pair[1];
				}
				else if (isset($pair[0]) && !isset($pair[1])) {
					$default[$pair[0]] = "";
				}
			}
		}
		$repeats = array("repeat" => "Repeat horizontally and vertically",
			"repeat-x" => "Repeat horizontally only",
			"repeat-y" => "Repeat vertically only",
			"no-repeat" => "Do not repeat");

		$positions = array("top left" => "Top left",
			"top center" => "Top center",
			"top right" => "Top right",
			"center left" => "Center left",
			"center center" => "Middle of the page",
			"center right" => "Center right",
			"bottom left" => "Bottom left",
			"bottom center" => "Bottom center",
			"bottom right" => "Bottom right");

		foreach ($value['options'] as $option_value => $option_text) {
			if (isset($photonic_options[$value['id']])) {
				$checked = checked($photonic_options[$value['id']], $option_value, false);
			}
			else {
				$checked = checked($photonic_default_options[$value['id']], $option_value, false);
			}
			echo '<div class="photonic-radio"><input type="radio" name="'.$value['id'].'" value="'.$option_value.'" '.$checked."/>".$option_text."</div>\n";
		}
	?>
		<div class='photonic-background-options'>
		<table class='opt-sub-table'>
	        <col class='opt-sub-table-cols'/>
	        <col class='opt-sub-table-cols'/>
			<tr>
				<td valign='top'>
					<div class="color-picker-group">
						<strong>Background Color:</strong><br />
						<input type="radio" name="<?php echo $value['id']; ?>-colortype" value="transparent" <?php checked($default['colortype'], 'transparent'); ?> /> Transparent / No color<br/>
						<input type="radio" name="<?php echo $value['id']; ?>-colortype" value="custom" <?php checked($default['colortype'], 'custom'); ?>/> Custom
						<input type="text" id="<?php echo $value['id']; ?>-bgcolor" name="<?php echo $value['id']; ?>-bgcolor" value="<?php echo $default['color']; ?>" data-photonic-default-color="<?php echo $original['color']; ?>" class="color" /><br />
						Default: <span> <?php echo $original['color']; ?> </span>
					</div>
				</td>
				<td valign='top'>
					<strong>Image URL:</strong><br />
					<?php $this->display_upload_field($default['image'], $value['id']."-bgimg", $value['id']."-bgimg"); ?>
				</td>
			</tr>

			<tr>
				<td valign='top'>
					<strong>Image Position:</strong><br />
					<select name="<?php echo $value['id']; ?>-position" id="<?php echo $value['id']; ?>-position" >
				<?php
					foreach ($positions as $option_value => $option_text) {
						echo "<option ";
						selected($default['position'], $option_value);
						echo " value='$option_value' >".$option_text."</option>\n";
					}
				?>
					</select>
				</td>

				<td valign='top'>
					<strong>Image Repeat:</strong><br />
					<select name="<?php echo $value['id']; ?>-repeat" id="<?php echo $value['id']; ?>-repeat" >
				<?php
					foreach ($repeats as $option_value => $option_text) {
						echo "<option ";
						selected($default['repeat'], $option_value);
						echo " value='$option_value' >".$option_text."</option>\n";
					}
				?>
					</select>
				</td>
			</tr>
			<tr>
				<td valign='top' colspan='2'>
					<div class='slider'>
						<p>
							<strong>Layer Transparency (not for IE):</strong>
							<select id="<?php echo $value['id']; ?>-trans" name="<?php echo $value['id']; ?>-trans">
								<?php
								for ($i = 0; $i <= 100; $i++) {
									echo "<option ";
									selected($default['trans'], $i);
									echo " value='$i' >".$i."</option>\n";
								}
								?>
							</select>
						</p>
					</div>
				</td>
			</tr>
		</table>
		<input type='hidden' id="<?php echo $value['id']; ?>" name="photonic_options[<?php echo $value['id']; ?>]" value="<?php echo $default_txt; ?>" />
		</div>
	<?php
		$this->create_closing_tag($value);
	}

	/**
	 * Renders an option whose type is "background". Invoked by add_settings_field.
	 *
	 * @param  $value
	 * @return void
	 */
	function create_section_for_padding($value) {
		global $photonic_options, $photonic_default_options;
		$this->create_opening_tag($value);
		if (!isset($photonic_options[$value['id']])) {
			$default = $photonic_default_options[$value['id']];
			$default_txt = "";
			foreach ($default as $edge => $edge_val) {
				$default_txt .= $edge.'::';
				foreach ($edge_val as $opt => $opt_val) {
					$default_txt .= $opt . "=" . $opt_val . ";";
				}
				$default_txt .= "||";
			}
		}
		else {
			$default_txt = $photonic_options[$value['id']];
			$default = $default_txt;
			$edge_array = explode('||', $default);
			$default = array();
			if (is_array($edge_array)) {
				foreach ($edge_array as $edge_vals) {
					if (trim($edge_vals) != '') {
						$edge_val_array = explode('::', $edge_vals);
						if (is_array($edge_val_array) && count($edge_val_array) > 1) {
							$vals = explode(';', $edge_val_array[1]);
							$default[$edge_val_array[0]] = array();
							foreach ($vals as $val) {
								$pair = explode("=", $val);
								if (isset($pair[0]) && isset($pair[1])) {
									$default[$edge_val_array[0]][$pair[0]] = $pair[1];
								}
								else if (isset($pair[0]) && !isset($pair[1])) {
									$default[$edge_val_array[0]][$pair[0]] = "";
								}
							}
						}
					}
				}
			}
		}
		$edges = array('top' => 'Top', 'right' => 'Right', 'bottom' => 'Bottom', 'left' => 'Left');
		$padding_units = array("px" => "Pixels (px)", "em" => "Em");

		foreach ($value['options'] as $option_value => $option_text) {
			if (isset($photonic_options[$value['id']])) {
				$checked = checked($photonic_options[$value['id']], $option_value, false);
			}
			else {
				$checked = checked($photonic_default_options[$value['id']], $option_value, false);
			}
			echo '<div class="photonic-radio"><input type="radio" name="'.$value['id'].'" value="'.$option_value.'" '.$checked."/>".$option_text."</div>\n";
		}
	?>
		<div class='photonic-padding-options'>
			<table class='opt-sub-table-5'>
				<col class='opt-sub-table-col-51'/>
				<col class='opt-sub-table-col-5'/>
				<col class='opt-sub-table-col-5'/>

				<tr>
					<th scope="col">&nbsp;</th>
					<th scope="col">Padding</th>
					<th scope="col">Padding Units</th>
				</tr>

		<?php
			foreach ($edges as $edge => $edge_text) {
		?>
			<tr>
				<th scope="row"><?php echo $edge_text; ?></th>
				<td valign='top'>
					<input type="text" id="<?php echo $value['id'].'-'.$edge; ?>-padding" name="<?php echo $value['id'].'-'.$edge; ?>-padding" value="<?php echo $default[$edge]['padding']; ?>" /><br />
				</td>

				<td valign='top'>
					<select name="<?php echo $value['id'].'-'.$edge; ?>-padding-type" id="<?php echo $value['id'].'-'.$edge; ?>-padding-type" >
				<?php
					foreach ($padding_units as $option_value => $option_text) {
						echo "<option ";
						selected($default[$edge]['padding-type'], $option_value);
						echo " value='$option_value' >".$option_text."</option>\n";
					}
				?>
					</select>
				</td>
			</tr>
		<?php
			}
		?>
			</table>
		<input type='hidden' id="<?php echo $value['id']; ?>" name="photonic_options[<?php echo $value['id']; ?>]" value="<?php echo $default_txt; ?>" />
		</div>
	<?php
		$this->create_closing_tag($value);
	}

	/**
	 * Creates the opening markup for each option.
	 *
	 * @param  $value
	 * @return void
	 */
	function create_opening_tag($value) {
		echo "<div class='photonic-section fix'>\n";
/*		if (isset($value['name'])) {
			echo "<h3>" . $value['name'] . "</h3>\n";
		}*/
		if (isset($value['desc']) && $value['type'] != 'checkbox') {
			echo $value['desc']."<br />";
		}
		if (isset($value['note'])) {
			echo "<span class=\"note\">".$value['note']."</span><br />";
		}
	}

	/**
	 * Creates the closing markup for each option.
	 *
	 * @param $value
	 * @return void
	 */
	function create_closing_tag($value) {
		echo "</div><!-- photonic-section -->\n";
	}

	/**
	 * This method displays an upload field and button. This has been separated from the create_section_for_upload method,
	 * because this is used by the create_section_for_background as well.
	 *
	 * @param $upload
	 * @param $id
	 * @param $name
	 * @param null $hint
	 * @return void
	 */
	function display_upload_field($upload, $id, $name, $hint = null) {
		echo '<input type="text" name="'.$name.'" id="'.$id.'" value="'.$upload.'" />'."\n";
		if ($hint != null) {
			echo "<em> &laquo; ".$hint."<br /></em>\n";
		}
	}

	function invoke_helper() {
		if (isset($_POST['helper']) && !empty($_POST['helper'])) {
			$helper = sanitize_text_field($_POST['helper']);
			$photonic_options = get_option('photonic_options');
			switch ($helper) {
				case 'photonic-flickr-user-find':
					$flickr_api_key = $photonic_options['flickr_api_key'];
					$user = isset($_POST['photonic-flickr-user']) ? sanitize_text_field($_POST['photonic-flickr-user']) : '';
					$url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key='.$flickr_api_key.'&method=flickr.urls.lookupUser&url='.$user;
					$this->execute_query('flickr', $url, 'flickr.urls.lookupUser');
					break;

				case 'photonic-flickr-group-find':
					$flickr_api_key = $photonic_options['flickr_api_key'];
					$group = isset($_POST['photonic-flickr-group']) ? sanitize_text_field($_POST['photonic-flickr-group']) : '';
					$url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key='.$flickr_api_key.'&method=flickr.urls.lookupGroup&url='.$group;
					$this->execute_query('flickr', $url, 'flickr.urls.lookupGroup');
					break;

				case 'photonic-smugmug-user-tree':
					$smugmug_api_key = $photonic_options['smug_api_key'];
					$user = isset($_POST['photonic-smugmug-user']) ? sanitize_text_field($_POST['photonic-smugmug-user']) : '';
					if (!empty($user)) {
						global $photonic_smugmug_gallery;
						if (!isset($photonic_smugmug_gallery)) {
							$photonic_smugmug_gallery = new Photonic_SmugMug_Processor();
						}

						$cookie = Photonic::parse_cookie();
						global $photonic_smug_allow_oauth, $photonic_smug_oauth_done;
						if ($photonic_smug_allow_oauth && isset($cookie['smug']) && isset($cookie['smug']['oauth_token']) && isset($cookie['smug']['oauth_token_secret'])) {
							$current_token = array(
								'oauth_token' => $cookie['smug']['oauth_token'],
								'oauth_token_secret' => $cookie['smug']['oauth_token_secret']
							);

							if (!$photonic_smug_oauth_done && ((isset($cookie['smug']['oauth_token_type']) && $cookie['smug']['oauth_token_type'] == 'request') || !isset($cookie['smug']['oauth_token_type']))) {
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

						$count = 500;
						$config = array(
							'expand' => array(
								'Node' => array(),
								'HighlightImage' => array(
									'expand' => array(
										'ImageSizes' => array()
									),
								),
								'NodeCoverImage' => array(
									'expand' => array(
										'ImageSizes' => array()
									),
								),
								'ChildNodes' => array(
									'args' => array(
										'count' => $count
									),
									'expand' => array(
										'HighlightImage' => array(
											'expand' => array(
												'ImageSizes' => array()
											),
										),
										'NodeCoverImage' => array(
											'expand' => array(
												'ImageSizes' => array()
											),
										),
										'ChildNodes' => array(
											'args' => array(
												'count' => $count
											),
											'expand' => array(
												'HighlightImage' => array(
													'expand' => array(
														'ImageSizes' => array()
													),
												),
												'NodeCoverImage' => array(
													'expand' => array(
														'ImageSizes' => array()
													),
												),
												'ChildNodes' => array(
													'args' => array(
														'count' => $count
													),
													'expand' => array(
														'HighlightImage' => array(
															'expand' => array(
																'ImageSizes' => array()
															),
														),
														'NodeCoverImage' => array(
															'expand' => array(
																'ImageSizes' => array()
															),
														),
														'ChildNodes' => array(
															'args' => array(
																'count' => $count
															),
															'expand' => array(
																'HighlightImage' => array(
																	'expand' => array(
																		'ImageSizes' => array()
																	),
																),
																'NodeCoverImage' => array(
																	'expand' => array(
																		'ImageSizes' => array()
																	),
																),
																'ChildNodes' => array(
																	'args' => array(
																		'count' => $count
																	),
																),
															),
														),
													),
												),
											),
										),
									),
								),
							),
						);

						//$api_call = 'https://api.smugmug.com/api/v2/user/' . $user . '?_expand=Node.ChildNodes.ChildNodes.ChildNodes.ChildNodes.ChildNodes';
						$api_call = 'https://api.smugmug.com/api/v2/user/' . $user;
						$args = array(
							'APIKey' => $smugmug_api_key,
							'_accept' => 'application/json',
							'_verbosity' => 1,
							'_expandmethod' => 'inline',
							'count' => 500
						);

						$response = Photonic::http($api_call, 'GET', $args);
						if (!is_wp_error($response)) {
							$body = $response['body'];
							$body = json_decode($body);
							if ($body->Code === 200) {
								$body = $body->Response;
								if (isset($body->User) && isset($body->User->Uris) && isset($body->User->Uris->Node)) {
									$node = $body->User->Uris->Node->Uri;
									$node = explode('/', $node);
									$node = array_pop($node);
									$api_call = 'https://api.smugmug.com/api/v2/node/' . $node . '?_config='.json_encode($config);

									if ($photonic_smug_oauth_done || $photonic_smugmug_gallery->oauth_done) {
										$args = $photonic_smugmug_gallery->sign_call($api_call, 'GET', $args);
									}
									else {
										$request_token = $photonic_smugmug_gallery->get_request_token();
										$authorize_url = $photonic_smugmug_gallery->get_authorize_URL($request_token).'&Access=Full&Permissions=Read';
										echo sprintf(esc_html__("If you have protected albums, you will have to %1sauthenticate%2s to see the protected albums.", 'photonic'), "<a href='$authorize_url' target='_blank'>", "</a>");
									}
									$response = Photonic::http($api_call, 'GET', $args);
									if (!is_wp_error($response)) {
										$this->process_smugmug_response($response);
									}
									else {
										echo $this->get_wp_errors($response);
									}
								}
							}
						}
						else {
							echo $this->get_wp_errors($response);
						}

					}
					break;

				case 'photonic-google-album-find':
				case 'photonic-google-album-more':
					$url = 'https://photoslibrary.googleapis.com/v1/albums';

					global $photonic_google_gallery, $photonic_google_refresh_token;
					if (!isset($photonic_google_gallery)) {
						$photonic_google_gallery = new Photonic_Google_Photos_Processor();
					}
					$photonic_google_gallery->perform_back_end_authentication($photonic_google_refresh_token);
					if (!empty($photonic_google_gallery->access_token)) {
						$query_args = array(
							'access_token' => $photonic_google_gallery->access_token,
							'pageSize' => 50,
						);
						if (!empty($_POST['nextPageToken'])) {
							$query_args['pageToken'] = $_POST['nextPageToken'];
						}

						$url = add_query_arg(
							$query_args,
							$url);
					}

					$response = wp_remote_request($url);
					if (!is_wp_error($response) && $response['response']['code'] == 200) {
						$response = $response['body'];
					}

					$this->process_google_response($response, !empty($_POST['nextPageToken']));
					break;

				case 'photonic-instagram-user-find':
					$user = isset($_POST['photonic-instagram-user']) ? sanitize_text_field($_POST['photonic-instagram-user']) : '';
					if (!empty($user)) {
						global $photonic_instagram_gallery, $photonic_instagram_access_token;
						if (!isset($photonic_instagram_gallery)) {
							$photonic_instagram_gallery = new Photonic_Instagram_Processor();
						}

						if (isset($photonic_instagram_access_token) && !$photonic_instagram_gallery->is_token_expired($photonic_instagram_access_token)) {
							$url = 'https://api.instagram.com/v1/users/search?access_token='.$photonic_instagram_access_token.'&q='.$user;
							$this->execute_query('instagram', $url, 'users/search');
						}
						else {
							esc_html_e("You have to authenticate to see the details.");
						}
					}
					break;

				case 'photonic-instagram-location-find':
					global $photonic_instagram_gallery, $photonic_instagram_access_token;
					if (!isset($photonic_instagram_gallery)) {
						$photonic_instagram_gallery = new Photonic_Instagram_Processor();
					}
					$lat = isset($_POST['photonic-instagram-lat']) ? sanitize_text_field($_POST['photonic-instagram-lat']) : '';
					$lng = isset($_POST['photonic-instagram-lng']) ? sanitize_text_field($_POST['photonic-instagram-lng']) : '';
					$fs_id = isset($_POST['photonic-instagram-fsid']) ? sanitize_text_field($_POST['photonic-instagram-fsid']) : '';
					if (isset($photonic_instagram_access_token) && !$photonic_instagram_gallery->is_token_expired($photonic_instagram_access_token)) {
						$url = 'https://api.instagram.com/v1/locations/search?access_token=' . $photonic_instagram_access_token . '&lat=' . $lat . '&lng=' . $lng . '&foursquare_v2_id=' . $fs_id;
						$this->execute_query('instagram', $url, 'locations/search');
					}
					else {
						esc_html_e("You have to authenticate to see the details.");
					}
					break;

				case 'photonic-zenfolio-categories-find':
					$url = 'https://api.zenfolio.com/api/1.8/zfapi.asmx/GetCategories';
					$this->execute_query('zenfolio', $url, 'GetCategories');
					break;
			}
		}
		die();
	}

	function execute_query($where, $url, $method) {
		$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));
		if (!is_wp_error($response)) {
			if (isset($response['response']) && isset($response['response']['code'])) {
				if ($response['response']['code'] == 200) {
					if (isset($response['body'])) {
						if ($where == 'flickr') {
							$this->execute_flickr_query($response['body'], $method);
						}
						else if ($where == 'zenfolio') {
							$this->execute_zenfolio_query($response['body'], $method);
						}
					}
					else {
						echo '<span class="found-id-text">'.esc_html__('No response from server!', 'photonic').'</span>';
					}
				}
				else {
					echo '<span class="found-id-text">'.$response['response']['message'].'</span>';
				}
			}
			else {
				echo '<span class="found-id-text">'.esc_html__('No response from server!', 'photonic').'</span>';
			}
		}
		else {
			echo $this->get_wp_errors($response);
		}
	}

	function execute_flickr_query($body, $method) {
		$body = json_decode($body);
		if (isset($body->stat) && $body->stat == 'fail') {
			echo '<span class="found-id-text">'.$body->message.'</span>';
		}
		else {
			if ($method == 'flickr.urls.lookupUser') {
				if (isset($body->user)) {
					echo '<span class="found-id-text">'.esc_html__('User ID:', 'photonic').'</span> <span class="found-id"><code>'.$body->user->id.'</code></span>';
				}
			}
			else if ($method == 'flickr.urls.lookupGroup') {
				if (isset($body->group)) {
					echo '<span class="found-id-text">'.esc_html__('Group ID:', 'photonic').'</span> <span class="found-id"><code>'.$body->group->id.'</code></span>';
				}
			}
		}
	}

	function process_smugmug_response($response) {
		$body = $response['body'];
		$body = json_decode($body);

		if ($body->Code === 200) {
			$body = $body->Response;
			if (isset($body->Node)) {
				$node = $body->Node;
				if ($node->Type == 'Folder') {
					$ret = $this->process_smugmug_node($node);
					if (!empty($ret)) {
						$ret = "<table class='photonic-helper-table'>\n".
									"\t<tr>\n".
										"\t<th>Name</th>\n".
										"\t<th>Type</th>\n".
										"\t<th>Thumbnail</th>\n".
										"\t<th>Album Key</th>\n".
										"\t<th>Security Level</th>\n".
									"\t</tr>\n".
									$ret.
								"</table>\n";
						echo $ret;
					}
				}
			}
		}
	}

	function process_smugmug_node($node) {
		$ret = '';
		if ($node->Type == 'Folder') {
			$albums = array();
			$folders = array();
			if (isset($node->Uris->ChildNodes->Node)) {
				$child_nodes = $node->Uris->ChildNodes->Node;
				foreach ($child_nodes as $child) {
					if ($child->Type == 'Album') {
						$albums[] = $child;
					}
					else if ($child->Type == 'Folder') {
						$folders[] = $child;
					}
				}

				foreach ($albums as $album) {
					$ret .= "\t<tr>\n";
					$ret .= "\t\t<td>{$album->Name}</td>\n";
					$ret .= "\t\t<td>Album</td>\n";
					$thumb = isset($album->Uris->NodeCoverImage->Image->ThumbnailUrl) ? $album->Uris->NodeCoverImage->Image->ThumbnailUrl : '';
					$ret .= "\t\t<td>".(empty($thumb) ? '' : "<img src='$thumb'/>")."</td>\n";
					$album_key = isset($album->Uris->Album) ? $album->Uris->Album->Uri : '';
					$album_key = explode('/', $album_key);
					$album_key = $album_key[count($album_key) - 1];
					$ret .= "\t\t<td>$album_key</td>\n";
					$ret .= "\t\t<td>{$album->SecurityType}</td>\n";
					$ret .= "\t</tr>\n";
				}

				foreach ($folders as $folder) {
					$ret .= "\t<tr>\n";
					$ret .= "\t\t<td>{$folder->Name}</td>\n";
					$ret .= "\t\t<td>Folder</td>\n";
					$thumb = isset($folder->Uris->NodeCoverImage->Image->ThumbnailUrl) ? $folder->Uris->NodeCoverImage->Image->ThumbnailUrl : '';
					$ret .= "\t\t<td>".(empty($thumb) ? '' : "<img src='$thumb'/>")."</td>\n";
					$ret .= "\t\t<td>{$folder->NodeID}</td>\n";
					$ret .= "\t\t<td>{$folder->SecurityType}</td>\n";
					$ret .= "\t</tr>\n";

					$ret .= $this->process_smugmug_node($folder);
				}
			}
		}
		return $ret;
	}

	function process_google_response($response, $more = false) {
		$response = json_decode($response);
		if (!empty($response->albums) && is_array($response->albums)) {
			$albums = $response->albums;
			if (!$more) {
				echo "<table class='photonic-helper-table'>\n";
				echo "\t<tr>\n";
				echo "\t\t<th>Album Title</th>\n";
				echo "\t\t<th>Thumbnail</th>\n";
				echo "\t\t<th>Album ID</th>\n";
				echo "\t\t<th>Media Count</th>\n";
				echo "\t</tr>\n";
			}

			foreach ($albums as $album) {
				echo "\t<tr>\n";
				echo "\t\t<td>".(empty($album->title)? '' : esc_attr($album->title))."</td>\n";
				echo "\t\t<td><img src='{$album->coverPhotoBaseUrl}=w75-h75-c' /></td>\n";
				echo "\t\t<td>{$album->id}</td>\n";
				echo "\t\t<td>{$album->mediaItemsCount}</td>\n";
				echo "\t</tr>\n";
			}

			if (!empty($response->nextPageToken)) {
				echo "\t<tr>\n";
				echo "\t\t<td colspan='4'>\n";
				echo '<input type="button" value="'.esc_attr__('Load More', 'photonic').'" id="photonic-google-album-more" class="button button-primary" data-photonic-token="'.$response->nextPageToken.'"/>';
				echo "\t\t</td>\n";
				echo "\t</tr>\n";
			}

			if (!$more) {
				echo "</table>\n";
			}
		}
		else {
			esc_html_e("No albums found", 'photonic');
		}
	}

	function execute_zenfolio_query($body, $method) {
		if ($method == 'GetCategories') {
			$response = simplexml_load_string($body);
			if (!empty($response->Category)) {
				$categories = $response->Category;
				echo "<ul class='photonic-scroll-panel'>\n";
				foreach ($categories as $category) {
					echo "<li>{$category->DisplayName} &ndash; {$category->Code}</li>\n";
				}
				echo "</ul>\n";
			}
		}
	}

	/**
	 * Save generated options to a file. This uses the WP_Filesystem to validate the credentials of the user attempting to save options.
	 *
	 * @param array $custom_css
	 * @return bool
	 */
	function save_css_to_file($custom_css) {
		if(!isset($_GET['settings-updated'])) {
			return false;
		}

		$url = wp_nonce_url('admin.php?page=photonic-options-manager');
		if (false === ($creds = request_filesystem_credentials($url, '', false, false))) {
			return true;
		}

		if (!WP_Filesystem($creds)) {
			request_filesystem_credentials($url, '', true, false);
			return true;
		}

		global $wp_filesystem;
		if (!is_dir(PHOTONIC_UPLOAD_DIR)) {
			if (!$wp_filesystem->mkdir(PHOTONIC_UPLOAD_DIR)) {
				echo "<div class='error'><p>Failed to create directory ".PHOTONIC_UPLOAD_DIR.". Please check your folder permissions.</p></div>";
				return false;
			}
		}

		$filename = trailingslashit(PHOTONIC_UPLOAD_DIR).'custom-styles.css';

		if (empty($custom_css)) {
			return false;
		}

		if (!$wp_filesystem->put_contents($filename, $custom_css, FS_CHMOD_FILE)) {
			echo "<div class='error'><p>Failed to save file $filename. Please check your folder permissions.</p></div>";
			return false;
		}
		return true;
	}

	function render_getting_started() {
		require_once(plugin_dir_path(__FILE__)."/photonic-getting-started.php");
	}

	private function show_token_section($gallery, $provider_slug, $provider_text) {
		$this->show_token_section_header($gallery, $provider_text);
		if (!empty($gallery->api_key)) {
			$this->show_token_section_body($gallery, $provider_slug);
		}
		else {
			echo '<div class="result" id="'.$provider_slug.'-result">&nbsp;</div>';
		}
	}

	/**
	 * @param $gallery Photonic_Processor
	 * @param $provider string
	 */
	private function show_token_section_header($gallery, $provider) {
		echo "<div class=\"photonic-token-header\">\n";

		if (empty($gallery->api_key) || empty($gallery->api_secret)) {
			echo sprintf(esc_html__('Please set up your %1$s API key under %2$s.', 'photonic'), $provider, sprintf('<em>Photonic &rarr; Settings &rarr; %1$s &rarr; %1$s Settings</em>', $provider));
		}
		else if (!empty($gallery->token)) {
			esc_html_e('You have already set up your authentication.', 'photonic');
			echo '<span class="photonic-all-ok">'.esc_html__('Unless you wish to regenerate the token this step is not required.', 'photonic').'</span><br/>';
		}
		echo "</div>\n";
	}

	/**
	 * @param $gallery Photonic_OAuth1_Processor | Photonic_OAuth2_Processor
	 * @param $provider
	 */
	public function show_token_section_body($gallery, $provider) {
		$photonic_authentication = get_option('photonic_authentication');
		$response = Photonic_Processor::parse_parameters($_SERVER['QUERY_STRING']);

		if (empty($response['provider']) || $provider !== $response['provider']) {
			echo "<a href='#' class='button button-primary photonic-token-request' data-photonic-provider='$provider'>" . esc_html__('Login and get Access Token', 'photonic') . "</a>";
		}
		else if (!empty($response['oauth_token']) && !empty($response['oauth_verifier'])) {
			echo "<span class='button photonic-helper-button-disabled'>" . esc_html__('Login and get Access Token', 'photonic') . "</span>";
			$authorization = array('oauth_token' => $response['oauth_token'], 'oauth_verifier' => $response['oauth_verifier']);
			if (isset($photonic_authentication) && isset($photonic_authentication[$provider]) && isset($photonic_authentication[$provider]['oauth_token_secret'])) {
				$authorization['oauth_token_secret'] = $photonic_authentication[$provider]['oauth_token_secret'];
			}
			$access_token = $gallery->get_access_token($authorization, false);
			if (isset($access_token['oauth_token'])) {
				echo '<div class="result">Access Token: <code id="'.$provider.'-token">' . $access_token['oauth_token'] . '</code><br/>Access Token Secret: <code id="'.$provider.'-token-secret">' . $access_token['oauth_token_secret'] . '</code></div>'."\n";
				echo "<a href='#' class='button button-primary photonic-save-token' data-photonic-provider='$provider'>" . esc_html__('Save Token', 'photonic') . "</a>";
			}
		}
	}

	/**
	 * @param $response WP_Error
	 * @return string
	 */
	private function get_wp_errors($response) {
		$err = '';
		if (is_wp_error($response)) {
			$messages = $response->get_error_messages();
			$err = '<br/><strong>'.esc_html(sprintf(_n('%s Message:', '%s Messages:', count($messages), 'photonic'),
					count($messages)))."</strong><br/>\n";
			foreach ($messages as $message) {
				$err .= $message . "<br>\n";
			}
		}
		return $err;
	}
}
