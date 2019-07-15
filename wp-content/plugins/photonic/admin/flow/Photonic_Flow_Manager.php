<?php
/**
 * Class Photonic_Flow_Manager
 * This is the core module for displaying the gallery builder. This is used with two other files:
 *  - Flow.php: contains the top-level markup for the gallery builder
 *  - Photonic_Flow_Fields.php: contains all the fields by screen
 *
 * @package Photonic
 * @subpackage Flow
 * @since 2.00
 */
class Photonic_Flow_Manager {
	var $flow_fields, $field_list, $display_types, $shortcode_attributes, $aka_attributes, $date_parts, $date_part_hints,
		$error_mandatory, $error_no_response, $error_unknown, $error_not_found, $error_no_data_returned, $error_not_permitted, $error_authentication, $error_missing_api,
		$force_next_screen, $force_previous_screen, $is_gutenberg;

	function __construct() {
		require_once("Photonic_Flow_Fields.php");
		$this->flow_fields = new Photonic_Flow_Fields();

		$this->field_list = $this->flow_fields->get_flow_options();
		$this->force_next_screen = -1;
		$this->force_previous_screen = -1;

		$this->error_mandatory = esc_html__('Please fill the mandatory fields. Mandatory fields are marked with a red "*".', 'photonic');
		$this->error_no_response = esc_html__('No response from server.', 'photonic');
		$this->error_not_found = esc_html__('Not found.', 'photonic');
		$this->error_no_data_returned = esc_html__('No data was returned for the user you provided. Please verify that the user has the content you are looking for.', 'photonic');
		$this->error_not_permitted = esc_html__('Incorrect value passed for "%1$s": %2$s', 'photonic');
		$this->error_missing_api = esc_html__('Please set up your %1$s and secret under %2$s', 'photonic');
		$this->error_authentication = esc_html__('Please set up your %1$s Authentication from %2$s', 'photonic');

		$this->date_parts = array(0 => esc_html__('Year', 'photonic'), 1 => esc_html__('Month', 'photonic'), 2 => esc_html__('Date', 'photonic'));
		$this->date_part_hints = array(0 => esc_html__('Year (0 - 9999)', 'photonic'), 1 => esc_html__('Month (0 - 12)', 'photonic'), 2 => esc_html__('Date (0 - 31)', 'photonic'));

		$this->display_types = array(
			'single-photo' => 0,
			'multi-photo' => 1,
			'album-photo' => 1,
			'folder-photo' => 1,
			'user-photo' => 1,
			'gallery-photo' => 1,
			'collection-photo' => 1,
			'current-post' => 1,
			'another-post' => 1,
			'multi-album' => 2,
			'multi-gallery' => 2,
			'multi-collection' => 2,
			'multi-gallery-collection' => 2,
			'collection' => 3,
			'collections' => 3,
			'folder' => 3,
			'tree' => 3,
			'group' => 3,
			'group-hierarchy' => 3,
		);

		$this->shortcode_attributes = array(
			'common' => array(
				'columns', 'count', 'more', 'photo_count', 'photo_more', 'title_position', 'caption', 'media', 'main_size', 'thumb_size', 'tile_size', 'video_size', 'popup', 'thumbnail_effect', // All lightbox
				'speed', 'timeout', 'fx', 'pause', 'strip-style', 'controls', // Slideshow
			),
			'flickr' => array('user_id', 'group_id', 'collections_display', 'tags', 'tag_mode', 'text', 'sort', 'privacy_filter',),
			'smugmug' => array('nick_name', 'password', 'text', 'keywords', 'sort_order', 'sort_method', 'album_sort_order', ),
			'google' => array('user_id', 'access', 'protection', 'crop_thumb', 'content_filters',),
			'zenfolio' => array('login_name', 'text', 'category_code', 'sort_order', 'structure', ),
			'instagram' => array(),
			'wp' => array(),
		);
		$this->aka_attributes = array(
			'flickr' => array('per_page' => 'count'),
			'zenfolio' => array('limit' => 'count'),
			'wp' => array('slide_size' => 'main_size'),
		);
	}

	/**
	 * Gets the content to be displayed on a flow screen. This is invoked by an AJAX call. The current screen number is passed to this function.
	 * The function performs validations behind the scenes and if everything looks OK it returns the content for the next screen, otherwise
	 * an error is returned.
	 *
	 * @return string
	 */
	function get_screen() {
		$screen = isset($_POST['screen']) ? sanitize_text_field($_POST['screen']) : 0;
		$provider = isset($_POST['provider']) ? sanitize_text_field($_POST['provider']) : '';
		$display_type = isset($_POST['display_type']) ? sanitize_text_field($_POST['display_type']) : '';

		$raw_shortcode = !empty($_POST['photonic-editor-shortcode-raw']) ? sanitize_text_field($_POST['photonic-editor-shortcode-raw']) : '';
		if (!empty($raw_shortcode)) {
			$input = base64_decode($raw_shortcode);
			$input = json_decode($input);
			if (!empty($input->shortcode) && !empty($input->shortcode->attrs) && !empty($input->shortcode->attrs->named)) {
				$input = $input->shortcode->attrs->named;
			}
		}
		else {
			$raw_shortcode = !empty($_POST['photonic-editor-json']) ? stripslashes_deep($_POST['photonic-editor-json']) : '';
			$input = json_decode($raw_shortcode);
			if (!empty($_POST['photonic-gutenberg-active'])) {
				$this->is_gutenberg = true;
			}
		}

		$deconstructed = $this->deconstruct_shortcode($input);

		$output = $this->validate($screen, $provider, $deconstructed);
		if (!empty($output['error'])) {
			return '<div class="photonic-flow-error">' . $output['error'] . "</div>\n";
		}

		$screen = ((int)$screen) + 1;
		if ($this->force_next_screen > -1) {
			$screen = $this->force_next_screen;
		}

		$screen_fields = array();
		if (!empty($this->field_list['screen-' . $screen])) {
			$screen_fields = $this->field_list['screen-' . $screen];
		}
		$ret = '';

		if ($screen == 2 || $screen == '2') {
			/*
			 * The display_type screen. This gathers inputs about what the user wants to show: photos from an album, a collection of
			 * albums, user trees, single photos etc., along with who the photos are from - the default user, a different user, any user etc.
			 */
			$fields = $screen_fields[$provider]['display'];
			$ret .= $this->render_all_fields($fields, $deconstructed);
			$ret = (empty($screen_fields[$provider]['header']) ? '' : "<h1>" . $screen_fields[$provider]['header'] . "</h1>\n") .
				(empty($screen_fields[$provider]['desc']) ? '' : "<p>" . $screen_fields[$provider]['desc'] . "</p>\n") .
				$ret;
		}
		else if ($screen == 3) {
			/*
			 * The Gallery Builder screen, where all the photos / albums / folders are displayed
			 */
			$fields = $screen_fields[$provider][$display_type]['display'];
			$ret .= $this->render_all_fields($fields, $deconstructed);

			$ret = (empty($screen_fields[$provider][$display_type]['header']) ? '' : "<h1>" . $screen_fields[$provider][$display_type]['header'] . "</h1>\n") .
				(empty($screen_fields[$provider][$display_type]['desc']) ? '' : "<p>" . $screen_fields[$provider][$display_type]['desc'] . "</p>\n") .
				str_replace('{{placeholder_value}}', $output['success'], $ret);
		}
		else if ($screen == 4) {
			/*
			 * The layout selection screen
			 */
			$ret .= $output['success'];
		}
		else {
			$ret .= $output['success'];
		}

		return $ret;
	}

	/**
	 * Checks all inputs amongst themselves. If the inputs are valid, then the content for the next screen is generated by this call.
	 * All heavy logic, including API calls and processing of the responses happens here.
	 *
	 * @param $screen
	 * @param $provider
	 * @param array $existing
	 * @return array|string
	 */
	function validate($screen, $provider, $existing = array()) {
		if (empty($screen) || !is_numeric($screen) || (is_numeric($screen) && (intval($screen) <= 0 || intval($screen) > 5))) {
			return array('error' => sprintf(esc_html__('Invalid screen value: %s', 'photonic'), $screen));
		}
		if (!in_array($provider, array('wp', 'flickr', 'picasa', 'google', 'smugmug', 'zenfolio', 'instagram'))) {
			return array('error' => sprintf(esc_html__('Invalid photo provider: %s', 'photonic'), $provider));
		}

		$screen = intval($screen);
		$display_type = isset($_POST['display_type']) ? sanitize_text_field($_POST['display_type']) : '';

		if ($screen == 1) {
			switch ($provider) {
				case 'flickr':
					global $photonic_flickr_api_key, $photonic_flickr_api_secret;
					if (empty($photonic_flickr_api_key) || empty($photonic_flickr_api_secret)) {
						return array('error' => sprintf($this->error_missing_api, 'Flickr API key', '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings</em>'));
					}
					break;

				case 'picasa':
					return array('error' => esc_html__('Google has deprecated the Picasa API with effect from January 2019. Please consider using the Google Photos module.', 'photonic'));

				case 'google':
					global $photonic_google_client_id, $photonic_google_client_secret, $photonic_google_refresh_token;
//					if (!empty($photonic_google_use_own_keys) && (empty($photonic_google_client_id) || empty($photonic_google_client_secret))) {
					if (empty($photonic_google_client_id) || empty($photonic_google_client_secret)) {
						return array('error' => sprintf($this->error_missing_api, 'Google Client ID', '<em>Photonic &rarr; Settings &rarr; Google Photos &rarr; Google Photos Settings</em>'));
					}
					else if (empty($photonic_google_refresh_token)) {
						return array('error' => sprintf($this->error_authentication, 'Google Photos', '<em>Photonic &rarr; Authentication</em>'));
					}
					break;

				case 'smugmug':
					return '';

				case 'instagram':
					global $photonic_instagram_access_token;
					if (empty($photonic_instagram_access_token)) {
						return array('error' => sprintf($this->error_authentication, 'Instagram', '<em>Photonic &rarr; Authentication</em>'));
					}
					break;

				case 'zenfolio':
					return '';

				default:    // wp
					return '';
			}
		}
		else if ($screen == 2) {
			$screen_fields = $this->field_list['screen-' . $screen];
			$fields = $screen_fields[$provider]['display'];
			$flattened_fields = array();
			foreach ($fields as $id => $field) {
				if (!empty($field['type']) && $field['type'] != 'field_list') {
					$flattened_fields[$id] = $field;
				}
				else if (!empty($field['type']) && $field['type'] == 'field_list') {
					$flattened_fields = array_merge($field['list'], $flattened_fields);
				}
			}

			if (empty($display_type) || (empty($_POST['for']) && in_array($provider, array('flickr', 'smugmug', 'zenfolio')) && empty($existing))) {
				return array('error' => $this->error_mandatory);
			}

			if (empty($_POST['for']) && in_array($provider, array('flickr', 'smugmug', 'zenfolio')) && !empty($existing)) {
				return array('error' => esc_html__('While the "For whom?" setting may not be required for the shortcode to function in the front-end, it is required to edit this shortcode in this editor. Please specify a value.', 'photonic'));
			}

			if (!in_array($display_type, array_keys($flattened_fields['display_type']['options']))) {
				return array('error' => sprintf(esc_html__('Invalid display type: %s', 'photonic'), $display_type));
			}

			$for = !empty($_POST['for']) ? sanitize_text_field($_POST['for']) : null;

			switch ($provider) {
				case 'flickr':
					if ($display_type != 'multi-photo' && in_array($for, array('group', 'any'))) {
						$err = esc_html__('Incompatible selections:', 'photonic') . "<br/>\n";
						$err .= $flattened_fields['display_type']['desc'] . ": " . $flattened_fields['display_type']['options'][$display_type] . "<br/>\n";
						$err .= $flattened_fields['for']['desc'] . ": " . $flattened_fields['for']['options'][$for] . "<br/>\n";
						return array('error' => $err);
					}

					$group = sanitize_text_field($_POST['group']);
					$login = sanitize_text_field($_POST['login']);
					global $photonic_flickr_default_user, $photonic_flickr_api_key;
					if ($for == 'current' && empty($photonic_flickr_default_user)) {
						return array('error' => sprintf(esc_html__('Default user not defined under %1$s. %2$sSelect "Another user" and put in your user id.', 'photonic'),
							'<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Default User</em>', '<br/>'));
					}

					if (($for == 'group' && empty($group)) || ($for == 'other' && empty($login))) {
						return array('error' => $this->error_mandatory);
					}

					$parameters = array();
					$user = $for == 'current' ? $photonic_flickr_default_user : ($for == 'other' ? $login : '');
					if (($for == 'other' || $for == 'current') && !empty($user)) {
						$url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=' . $photonic_flickr_api_key . '&method=flickr.urls.lookupUser&url=' . urlencode('https://www.flickr.com/photos/') . $user;
						$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));
						$response = $this->process_response($response, 'flickr', 'user');
						if (!empty($response['error'])) {
							// Maybe the user provided the full URL instead of just the user name?
							$url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=' . $photonic_flickr_api_key . '&method=flickr.urls.lookupUser&url=' . urlencode($user);
							$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));
							$response = $this->process_response($response, 'flickr', 'user');
							if (!empty($response['error'])) {
								return $response;
							}
							$parameters = array_merge($response['success'], $parameters);
						}
						else {
							$parameters = array_merge($response['success'], $parameters);
						}
					}

					if ($for == 'group' && !empty($group)) {
						$url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=' . $photonic_flickr_api_key . '&method=flickr.urls.lookupGroup&url=' . urlencode('https://www.flickr.com/groups/') . $group;
						$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));
						$response = $this->process_response($response, 'flickr', 'group');
						if (!empty($response['error'])) {
							// Maybe the user provided the full URL instead of just the group name?
							$url = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=' . $photonic_flickr_api_key . '&method=flickr.urls.lookupGroup&url=' . urlencode($user);
							$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));
							$response = $this->process_response($response, 'flickr', 'group');
							if (!empty($response['error'])) {
								return $response;
							}
							$parameters = array_merge($response['success'], $parameters);
						}
						else {
							$parameters = array_merge($response['success'], $parameters);
						}
					}

					// All OK so far. Let's try to get the data for the next screen
					$parameters['api_key'] = $photonic_flickr_api_key;
					$parameters['format'] = 'json';
					$parameters['nojsoncallback'] = 1;

					if ($display_type == 'single-photo') {
						$parameters['view'] = 'photo';
						$parameters['method'] = 'flickr.photos.search';
						$parameters['per_page'] = 500;
					}
					else if ($display_type == 'multi-photo') {
						$parameters['view'] = 'photos';
						$parameters['method'] = 'flickr.photos.search';
					}
					else if ($display_type == 'multi-album' || $display_type == 'album-photo') {
						$parameters['view'] = 'photosets';
						$parameters['method'] = 'flickr.photosets.getList';
					}
					else if ($display_type == 'multi-gallery' || $display_type == 'gallery-photo') {
						$parameters['view'] = 'galleries';
						$parameters['method'] = 'flickr.galleries.getList';
						$parameters['per_page'] = 500;
					}
					else if ($display_type == 'collection' || $display_type == 'collections') {
						$parameters['view'] = 'collections';
						$parameters['method'] = 'flickr.collections.getTree';
					}

					global $photonic_flickr_gallery, $photonic_flickr_access_token;
					if (!isset($photonic_flickr_gallery)) {
						$photonic_flickr_gallery = new Photonic_Flickr_Processor();
					}
					if (!empty($photonic_flickr_access_token)) {
						$parameters = $photonic_flickr_gallery->sign_call('https://api.flickr.com/services/rest/', 'GET', $parameters);
					}

					$url = add_query_arg($parameters, 'https://api.flickr.com/services/rest/');
					$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY));
					$hidden = array();
					if (isset($parameters['user_id'])) $hidden['user_id'] = $parameters['user_id'];
					if (isset($parameters['group_id'])) $hidden['group_id'] = $parameters['group_id'];
					return $this->process_response($response, 'flickr', $display_type, $hidden, $existing, $url);

				case 'smugmug':
					global $photonic_smugmug_gallery, $photonic_smug_access_token, $photonic_smug_default_user;
					if (!isset($photonic_smugmug_gallery)) {
						$photonic_smugmug_gallery = new Photonic_SmugMug_Processor();
					}

					if ($for == 'current' && empty($photonic_smug_default_user)) {
						return array('error' => sprintf(esc_html__('Default user not defined under %1$s. %2$sSelect "Another user" and put in your user id.', 'photonic'), '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Default User</em>', '<br/>'));
					}

					if ($for == 'other' && empty($_POST['user'])) {
						return array('error' => $this->error_mandatory);
					}

					$nick_name = sanitize_text_field($_POST['user']);
					$user = $for == 'current' ? $photonic_smug_default_user : ($for == 'other' ? $nick_name : '');
					$args = array(
						'APIKey' => $photonic_smugmug_gallery->api_key,
						'_accept' => 'application/json',
						'_expandmethod' => 'inline',
						'_verbosity' => '1',
					);

					if ($display_type == 'album-photo' || $display_type == 'multi-album') {
						$call = "https://api.smugmug.com/api/v2/user/$user!albums";
						$args['_expand'] = 'HighlightImage.ImageSizes';
						$args['count'] = 500;
					}
					else {
						$call = "https://api.smugmug.com/api/v2/user/$user";
					}

					if (!empty($photonic_smug_access_token)) {
						$args = $photonic_smugmug_gallery->sign_call($call, 'GET', $args);
					}

					if ($display_type == 'folder' || $display_type == 'tree' || $display_type == 'folder-photo' || $display_type == 'user-photo') {
						// Not able to use wp_remote_request - getting a signature_invalid response
						$temp = Photonic::http($call, 'GET', $args, null, 300);
						$temp = $this->process_response($temp, 'smugmug', 'user');

						if (!empty($temp['success'])) {
							$node = $temp['success'];
							$call = 'https://api.smugmug.com' . $node . '!children';
							if ($display_type == 'tree' || $display_type == 'user-photo') {
								$args['_expand'] = 'NodeCoverImage.ImageSizes';
							}
							else {
								$config = $photonic_smugmug_gallery->get_config_object(500);
								$config_str = json_encode($config);
								$args['_config'] = $config_str;
							}

							// Sign call again because we made an interim call
							if (!empty($photonic_smug_access_token)) {
								unset($args['oauth_consumer_key']);
								unset($args['oauth_nonce']);
								unset($args['oauth_signature']);
								unset($args['oauth_signature_method']);
								unset($args['oauth_timestamp']);
								unset($args['oauth_version']);
								unset($args['oauth_token']);
								unset($args['oauth_verifier']);
								$args = $photonic_smugmug_gallery->sign_call($call, 'GET', $args);
							}
						}
						else {
							return $temp;
						}
					}

					$response = Photonic::http($call, 'GET', $args, null, 300);
					return $this->process_response($response, 'smugmug', $display_type, array('nick_name' => $user), $existing, $call);

				case 'google':
					global $photonic_google_refresh_token, $photonic_google_gallery;
					if (!isset($photonic_google_gallery)) {
						$photonic_google_gallery = new Photonic_Google_Photos_Processor();
					}

					$photonic_google_gallery->perform_back_end_authentication($photonic_google_refresh_token);

					$parameters = array();

					// All OK so far. Let's try to get the data for the next screen
					$parameters['access_token'] = $photonic_google_gallery->access_token;

					$query_url = '';
					if ($display_type == 'multi-photo') {
						$query_url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
					}
					else if ($display_type == 'multi-album' || $display_type == 'album-photo') {
						$query_url = 'https://photoslibrary.googleapis.com/v1/albums?pageSize=50';
					}

					$query_url = add_query_arg($parameters, $query_url);
					$response = wp_remote_request($query_url, array('method' => ($display_type == 'multi-photo' ? 'POST' : 'GET'), 'sslverify' => PHOTONIC_SSL_VERIFY));
					return $this->process_response($response, 'google', $display_type, array(), $existing, $query_url);

				case 'zenfolio':
					if ((!in_array($display_type, array('multi-photo', /*'multi-gallery', 'multi-collection'*/)) && $for == 'any') ||
						(!in_array($display_type, array('single-photo', 'gallery-photo', 'collection-photo', 'multi-gallery', 'multi-collection', 'multi-gallery-collection', 'group', 'group-hierarchy')) && in_array($for, array('current', 'other')))) {
						$err = esc_html__('Incompatible selections:', 'photonic') . "<br/>\n";
						$err .= $flattened_fields['display_type']['desc'] . ": " . $flattened_fields['display_type']['options'][$display_type] . "<br/>\n";
						$err .= $flattened_fields['for']['desc'] . ": " . $flattened_fields['for']['options'][$for] . "<br/>\n";
						return array('error' => $err);
					}

					if ($for == 'other' && empty($_POST['login_name'])) {
						return array('error' => $this->error_mandatory);
					}

					$login_name = sanitize_text_field($_POST['login_name']);
					global $photonic_zenfolio_default_user;
					if ($for == 'current' && empty($photonic_zenfolio_default_user)) {
						return array('error' => sprintf(esc_html__('Default user not defined under %1$s. %2$sSelect "Another user" and put in your user id.', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Default User</em>', '<br/>'));
					}

					$parameters = array();
					$user = $for == 'current' ? $photonic_zenfolio_default_user : ($for == 'other' ? $login_name : '');

					if ($display_type == 'multi-photo') {
						$url = 'https://api.zenfolio.com/api/1.8/zfapi.asmx/SearchPhotoByCategory';
						$parameters['searchId'] = '5';
						$parameters['sortOrder'] = 'Popularity';
						$parameters['categoryCode'] = '1018000';
						$parameters['offset'] = 0;
						$parameters['limit'] = 500;
					}
					else if (in_array($display_type, array('multi-gallery', 'multi-collection')) && $for == 'any') {
						$url = 'https://api.zenfolio.com/api/1.8/zfapi.asmx/SearchSetByCategory';
						$parameters['searchId'] = '5';
						$parameters['sortOrder'] = 'Popularity';
						$parameters['categoryCode'] = '1018000';
						$parameters['offset'] = 0;
						$parameters['limit'] = 500;
					}
					else {
						$url = 'https://api.zenfolio.com/api/1.8/zfapi.asmx/LoadGroupHierarchy';
						$parameters['loginName'] = $user;
					}

					$response = wp_remote_request($url, array('sslverify' => PHOTONIC_SSL_VERIFY, 'body' => $parameters));
					return $this->process_response($response, 'zenfolio', $display_type, array('login_name' => $user), $existing, $url);

				case 'instagram':
					global $photonic_instagram_access_token;
					$base_url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token='.$photonic_instagram_access_token;
					$response = wp_remote_request($base_url);
					return $this->process_response($response, 'instagram', $display_type, array(), $existing, $base_url);

				default:    // wp
					$this->force_next_screen = 4;
					$this->force_previous_screen = 2;
					return array('success' => $this->get_layout_selector($display_type, $existing));
			}
		}
		else if ($screen == 3) {
			//Check for display_type
			$screen_fields = $this->field_list['screen-' . $screen];
			$provider_fields = $screen_fields[$provider];
			$fields = $provider_fields[$display_type]['display'];
			foreach ($fields as $id => $field) {
				$checks = $this->do_basic_option_check($id, $field, true);
				if (!empty($checks)) {
					return $checks;
				}

				if ($id == 'selection' && sanitize_text_field($_POST['selection']) == 'selected' && empty($_POST['selected_data'])) {
					return array('error' => esc_html__('Please select what you want to show.', 'photonic'));
				}

				if (in_array($display_type, array('single-photo', 'album-photo', 'gallery-photo', 'folder-photo', 'collection-photo')) && empty($_POST['selected_data'])) {
					return array('error' => esc_html__('Please select what you want to show.', 'photonic'));
				}
			}

			// All OK? Get next screen
			if ($display_type != 'single-photo') {
				$output = $this->get_layout_selector($display_type, $existing);
			}
			else {
				$this->force_next_screen = 6;
				$this->force_previous_screen = 3;
				$output = $this->construct_shortcode();
			}
			return array('success' => $output);
		}
		else if ($screen == 4) {
			$layout = isset($_POST['layout']) ? sanitize_text_field($_POST['layout']) : '';
			if (empty($layout)) {
				return array('error' => $this->error_mandatory);
			}
			$layout_options = $this->flow_fields->get_layout_options();
			if (!array_key_exists($layout, $layout_options)) {
				return array('error' => sprintf(esc_html__('Invalid layout: %s', 'photonic'), $layout));
			}

			// All good. Next screen:
			return array('success' => $this->get_layout_options($provider, $display_type, $layout, $existing));
		}
		else {
			$passworded = isset($_POST['selection_passworded']) ? sanitize_text_field($_POST['selection_passworded']) : '';
			$password = isset($_POST['password']) ? sanitize_text_field($_POST['password']) : '';
			if (!empty($passworded) && empty($password)) {
				return array('error' => $this->error_mandatory);
			}
			return array('success' => $this->construct_shortcode());
		}
		return '';
	}

	/**
	 * Utility method that takes an array of fields, determines if each member is a "field list" or a "field". If it is a field
	 * list it processes it as a field list, otherwise it processes it as a field.
	 *
	 * @param array $fields
	 * @param array $existing
	 * @return String
	 */
	private function render_all_fields($fields, $existing = array()) {
		$output = '';
		foreach ($fields as $id => $field) {
			if (!empty($field['type']) && $field['type'] == 'field_list') {
				$output .= $this->process_field_list($id, $field, $existing);
			}
			else if (!empty($field['type'])) {
				$output .= $this->process_field($id, $field, 0, null, $existing);
			}
		}
		return $output;
	}

	/**
	 * Takes a "field list" and processes each field in it individually. A "field list" can contain an interdependent sequence
	 * of fields, in which case each member gets a sequential number assigned to it. The actual logic of sequencing is handled on the
	 * front-end.
	 * E.g. If, for Flickr, you select "Multiple Photos", then "Another User", the front-end will show a "User" text field.
	 * But if "Group" is selected, it shows a "Group" text field
	 *
	 * @param $field_list_name
	 * @param array $field_list
	 * @param array $existing
	 * @return string
	 */
	function process_field_list($field_list_name, $field_list, $existing = array()) {
		if (!is_array($field_list) || empty($field_list['type']) || $field_list['type'] != 'field_list' || empty($field_list['list'])) {
			return '';
		}
		else {
			$ret = '';
			$counter = 0;
			$sequence_group = null;
			foreach ($field_list['list'] as $id => $field) {
				if ($field_list['list_type'] == 'sequence') {
					$counter++;
					$sequence_group = $field_list_name;
				}
				$ret .= $this->process_field($id, $field, $counter, $sequence_group, $existing);
			}
			return $ret;
		}
	}

	/**
	 * Main code to render an input element on the flow-screen. Almost all types of inputs have switches for display here.
	 *
	 * @param string $id
	 * @param array $field
	 * @param $sequence
	 * @param null $sequence_group
	 * @param array $existing
	 * @return string
	 */
	function process_field($id, $field, $sequence, $sequence_group = null, $existing = array()) {
		if (!is_array($field) || empty($field['type'])) {
			return '';
		}

		if (!empty($field['post_condition']) && is_array($field['post_condition'])) {
			foreach ($field['post_condition'] as $var => $permitted_values) {
				$pass = false;
				foreach ($permitted_values as $permitted) {
					if (isset($_POST[$var]) && $_POST[$var] === $permitted) {
						$pass = true;
						break;
					}
				}
				if (!$pass) {
					// Variable has not been set in a different screen. Hide this field.
					return '';
				}
			}
		}

		$req = empty($field['req']) ? '' : '<span class="photonic-required"><abbr title="'.esc_html__('Required', 'photonic').'">*</abbr></span>';
		$default = !empty($existing[$id]) ? $existing[$id] : (isset($field['std']) ? $field['std'] : '');
		$hint = '';
		$hint_in = '';
		if (!empty($field['hint'])) {
			$hint = "<div class='photonic-flow-hint' role='tooltip' id='{$id}-hint'>{$field['hint']}</div>\n";
			$hint_in = "aria-describedby='{$id}-hint'";
		}

		switch ($field['type']) {
			case 'text':
				$ret = "<label class='photonic-flow-option-name'>{$field['desc']}$req<input type='text' name='{$id}' value='" . $default . "' $hint_in/>$hint</label>";
				break;

			case 'radio':
				$ret = !empty($field['desc']) ? '<div class="photonic-flow-option-name">' . $field['desc'] . $req . '</div>' : '';
				foreach ($field['options'] as $option_value => $option_description) {
					$option_condition = (empty($field['option-conditions']) || empty($field['option-conditions'][$option_value])) ? '' :
						"data-photonic-option-condition='" . json_encode($field['option-conditions'][$option_value]) . "'";
					$checked = checked($default, $option_value, false);
					$ret .= "\t<div class='photonic-flow-field-radio'><label><input type='radio' name='{$id}' value='$option_value' $checked $option_condition/>" . $option_description . "</label></div>\n";
				}
				break;

			case 'select':
				$ret = "<label class='photonic-flow-option-name'>{$field['desc']}$req\n\t<select name='{$id}' $hint_in>\n";
				foreach ($field['options'] as $option_value => $option_description) {
					$option_condition = (empty($field['option-conditions']) || empty($field['option-conditions'][$option_value])) ? '' :
						"data-photonic-option-condition='" . json_encode($field['option-conditions'][$option_value]) . "'";
					$selected = selected($default, $option_value, false);
					$ret .= "\t\t<option value='$option_value' $selected $option_condition>" . esc_attr($option_description) . "</option>\n";
				}
				$ret .= "\t</select>\n$hint</label>\n";
				break;

			case 'image-select':
				$ret = '';
				$ret .= '<div class="photonic-flow-option-name">' . $field['desc'] . '</div>';
				if (!empty($default)) {
					$selection = !in_array($default, $field['options']) ? array_keys($field['options'])[0] : $default;
				}
				else {
					$selection = array_keys($field['options'])[0];
				}
				foreach ($field['options'] as $option_name => $desc) {
					$esc_desc = esc_attr($desc);
					$selected = ($option_name == $selection) ? 'selected' : '';
					$ret .= "<div class=\"photonic-flow-selector photonic-flow-$id-$option_name $selected\" title=\"$esc_desc\">\n\t<span class=\"photonic-flow-selector-inner photonic-$id\" data-photonic-selection-id=\"$option_name\">&nbsp;</span>\n\t<div class='photonic-flow-selector-info'>$desc</div>\n</div>\n";
				}
				if (!empty($ret)) {
					$ret = "<div class='photonic-flow-selector-container photonic-flow-$id' data-photonic-flow-selector-mode='single-no-plus' data-photonic-flow-selector-for=\"$id\">\n<input type=\"hidden\" id=\"$id\" name=\"$id\" value='$selection'/>\n$ret</div>\n";
				}
				break;

			case 'multi-select':
				$ret = '';
				$ret .= '<div class="photonic-flow-option-name">' . $field['desc'] . '</div>';
				$selection = explode(',', $default);
				foreach ($field['options'] as $option_value => $desc) {
					$checked = in_array($option_value, $selection) ? 'checked' : '';
					$ret .= "\t<label class='photonic-multi-select-item'><input type='checkbox' name='{$id}[]' value=\"$option_value\" $checked />$desc</label>\n";
				}
				if (!empty($ret)) {
					$ret = "<div class='photonic-flow-multi-select-container'>\n$ret</div>\n";
				}
				break;

			case 'date-filter':
				$ret = '';
				$ret .= '<div class="photonic-flow-option-name">' . $field['desc'] . '</div>';
				$dates = !empty($default) ? explode(',', $default) : array();
				$count = isset($field['count']) && is_numeric($field['count']) ? intval($field['count']) : 1;
				$ret .= "<ol data-photonic-date-filter='$id' data-photonic-filter-count='$count'>\n";
				$ctr = 0;
				foreach ($dates as $didx => $date) {
					$y_m_d = explode('/', $date);
					$ret .= "\t<li>\n";
					$ret .= "\t\t<div class='photonic-single-date'>\n";
					for ($pidx = 0; $pidx < 3; $pidx++) {
						$lower = strtolower($this->date_parts[$pidx]);
						$ret .= "\t\t\t<label class='photonic-date-filter'>\n" .
							"\t\t\t\t".substr($this->date_parts[$pidx], 0, 1)."<input type='text' class='photonic-date-$lower' name='{$id}_{$lower}[]' value=\"" . (isset($y_m_d[$pidx]) ? $y_m_d[$pidx] : '') . "\" aria-describedby='{$id}-{$didx}_{$lower}-hint'/>\n" .
							"\t\t\t\t<div class='photonic-flow-hint' role='tooltip' id='{$id}-{$didx}_{$lower}-hint'>" . $this->date_part_hints[$pidx] . "</div>\n" .
							"\t\t\t</label> \n";
					}
					$ret .= "\t\t</div>\n";
					$ret .= "\t\t<a href='#' class='photonic-remove-date-filter' title='Remove filter'><span class=\"dashicons dashicons-no\"> </span></a>\n";
					$ret .= "\t</li>\n";
					$ctr++;
					if ($ctr >= $count) {
						break;
					}
				}
				$ret .= "</ol>\n";
				$ret .= "<input type='hidden' name='$id' value='$default'/>\n";
				if ($ctr < $count) {
					$ret .= "<a href='#' class='photonic-add-date-filter' data-photonic-add-date='$id'><span class=\"dashicons dashicons-plus-alt\"> </span> Add filter</a>\n";
				}

				break;

			case 'date-range-filter':
				$ret = '';
				$ret .= '<div class="photonic-flow-option-name">' . $field['desc'] . '</div>';
				$date_ranges = !empty($default) ? explode(',', $default) : array();
				$count = isset($field['count']) && is_numeric($field['count']) ? intval($field['count']) : 1;
				$ret .= "<ol data-photonic-date-range-filter='$id' data-photonic-filter-count='$count'>\n";
				$ctr = 0;
				foreach ($date_ranges as $date_range) {
					$from_to = explode('-', $date_range);
					if (count($from_to) != 2) {
						continue;
					}
					$ret .= "\t<li>\n";
					foreach ($from_to as $didx => $date) {
						$ret .= "\t\t<div class='photonic-single-date'>\n";
						$y_m_d = explode('/', $date);
						$from_or_to = $didx === 0 ? 'start' : 'end';
						for ($pidx = 0; $pidx < 3; $pidx++) {
							$lower = strtolower($this->date_parts[$pidx]);
							$ret .= "\t\t\t<label class='photonic-date-filter'>\n" .
								"\t\t\t\t".substr($this->date_parts[$pidx], 0, 1)."<input type='text' class='photonic-date-$lower' name='{$id}_{$from_or_to}_{$lower}[]' value=\"" . (isset($y_m_d[$pidx]) ? $y_m_d[$pidx] : '') . "\" aria-describedby='{$id}-{$didx}_{$from_or_to}_{$lower}-hint'/>\n" .
								"\t\t\t\t<div class='photonic-flow-hint' role='tooltip' id='{$id}-{$didx}_{$from_or_to}_{$lower}-hint'>" . $this->date_part_hints[$pidx] . "</div>\n" .
								"\t\t\t</label> \n";
						}
						$ret .= "\t\t</div>\n";
					}
					$ret .= "\t\t<a href='#' class='photonic-remove-date-range-filter' title='Remove filter'><span class=\"dashicons dashicons-no\"> </span></a>\n";
					$ret .= "\t</li>\n";
					$ctr++;
					if ($ctr >= $count) {
						break;
					}
				}
				$ret .= "</ol>\n";
				$ret .= "<input type='hidden' name='$id' value='$default'/>\n";
				if ($ctr < $count) {
					$ret .= "<a href='#' class='photonic-add-date-range-filter' data-photonic-add-date-range='$id'><span class=\"dashicons dashicons-plus-alt\"> </span> Add filter</a>\n";
				}

				break;

			case 'thumbnail-selector':
				$ret = "<div class=\"photonic-flow-selector-container\" data-photonic-flow-selector-mode=\"{$field['mode']}\" data-photonic-flow-selector-for=\"{$field['for']}\">\n{{placeholder_value}}</div>\n";

				$controls = "<div class='thumb-controls'>\n";
				if ($field['mode'] != 'none') {
					$controls .= "<input type='text' class='search-thumbs' name='thumb-search' id='thumb-search'/>\n";
				}

				if ($field['mode'] == 'multi') {
					$controls .= esc_html__('Mark:', 'photonic').
						sprintf(esc_html__('%1$sAll%2$s', 'photonic'), "<a href='#' class='photonic-mark photonic-mark-all' data-photonic-mark-for='{$field['for']}'>", '</a>').'|'.
						sprintf(esc_html__('%1$sNone%2$s', 'photonic'), "<a href='#' class='photonic-mark photonic-mark-none' data-photonic-mark-for='{$field['for']}'>", '</a>');
				}
				$controls .= "</div>\n";
				$ret = $controls.$ret;
				break;

			default:
				return '';
		}

		if (!empty($ret)) {
			if (!empty($field['hint'])) {
//				$ret .= "<div class='photonic-flow-hint' role='tooltip' id='{$id}-hint'><div>{$field['hint']}</div></div>\n";
			}

			$sequence_str = '';
			if ($sequence !== 0) {
				$sequence_str = 'data-photonic-flow-sequence="' . $sequence . '"';
			}

			$sequence_group_str = '';
			if (!is_null($sequence_group)) {
				$sequence_group_str = 'data-photonic-flow-sequence-group="' . $sequence_group . '"';
			}

			$condition = '';
			if (!empty($field['conditions'])) {
				$condition = "data-photonic-condition='" . json_encode($field['conditions']) . "'";
			}

			$ret = "<div class='photonic-flow-field' $sequence_str $condition $sequence_group_str>\n" . $ret . "</div>\n";
		}
		return $ret;
	}

	/**
	 * Performs basic checks against whitelists. More advanced checks are handled in the <code>validate</code> function
	 *
	 * @param $id
	 * @param $field
	 * @param bool $check_required
	 * @return array|bool
	 */
	private function do_basic_option_check($id, $field, $check_required = false) {
		if (empty($field['type']) || ($field['type'] != 'select' && $field['type'] != 'radio')) {
			return false;
		}

		if ($check_required && !empty($field['req']) && (!isset($_POST[$id]) || trim($_POST[$id]) === '')) {
			return array('error' => $this->error_mandatory);
		}

		if (isset($_POST[$id]) && !in_array(sanitize_text_field($_POST[$id]), array_keys($field['options']))) {
			return array('error' => sprintf($this->error_not_permitted, $field['name'], $_POST[$id]));
		}
		return false;
	}

	/**
	 * A special type of selector not handled by the <code>process_field</code> call. Layouts are used only on one screen,
	 * and are used by almost all types of providers. This displays the available layouts as icons to pick from.
	 *
	 * @param $display_type
	 * @param array $existing
	 * @return string
	 */
	private function get_layout_selector($display_type, $existing = array()) {
		global $photonic_thumbnail_style;
		$output = '';
		$level = empty($this->display_types[$display_type]) ? -1 : $this->display_types[$display_type];
		$layout_from_option = empty($existing['layout']) ? (in_array($photonic_thumbnail_style, array('strip-below', 'strip-above', 'strip-right', 'no-strip')) ? 'slideshow' : $photonic_thumbnail_style) : $existing['layout'];

		if ($level > 0) {
			$layout_options = $this->flow_fields->get_layout_options();
			foreach ($layout_options as $layout => $desc) {
				$selected = $layout == $layout_from_option ? 'selected' : '';
				if (($layout == 'slideshow' && $level == 1) || $layout != 'slideshow') {
					$esc_desc = esc_attr($desc);
					$output .= "<div class=\"photonic-flow-selector photonic-flow-layout-$layout $selected\" title=\"$esc_desc\">\n\t<span class=\"photonic-flow-selector-inner photonic-layout\" data-photonic-selection-id=\"$layout\">&nbsp;</span>\n\t<div class='photonic-flow-selector-info'>$desc</div>\n</div>\n";
				}
			}
			if (!empty($output)) {
				$output = "<div class='photonic-flow-selector-container photonic-flow-layout' data-photonic-flow-selector-mode='single-no-plus' data-photonic-flow-selector-for=\"layout\">\n<input type=\"hidden\" id=\"layout\" name=\"layout\" value='$layout_from_option'/>\n$output</div>\n";
			}
		}
		$output = '<h1>' . esc_html__('Pick Your Layout', 'photonic') . '</h1>' .
			"<p>" . sprintf(esc_html__('You can configure the default settings from %s.', 'photonic'), '<strong>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Layouts</strong>') . "</p>\n".
			$output;

		if ($this->force_next_screen > -1) {
			$output .= "\n<input type='hidden' name='force_next_screen' value='{$this->force_next_screen}'/>\n";
		}
		if ($this->force_previous_screen > -1) {
			$output .= "\n<input type='hidden' name='force_previous_screen' value='{$this->force_previous_screen}'/>\n";
		}

		return $output;
	}

	/**
	 * Layouts use similar constructs such as <code>count</code> and <code>more</code> but also have differences.
	 * E.g. <code>columns</code> are not applicable to the justified grid or mosaic layouts etc. Similarly size options
	 * vary from provider to provider. So in the Photonic_Flow_Fields we have a hierarchy for this screen, by level, provider and layout
	 *
	 * @param $provider
	 * @param $display_type
	 * @param $layout
	 * @param array $existing
	 * @return string
	 */
	private function get_layout_options($provider, $display_type, $layout, $existing = array()) {
		// All levels, all layouts - media
		// L1, L2 All layouts - title position
		// L1 All layouts - count, more
		// L1, L2, L3 basic lightbox layouts - # of columns, constrain by etc., thumbnail size, full size
		// L3 Flickr - auto-expand
		$level = $this->display_types[$display_type];
		$output = '<h1>' . esc_html__('Configure Your Layout', 'photonic') . '</h1>';

		$extract = array();
		if (!empty($this->field_list['screen-5'][$provider]['L' . $level])) {
			$extract = array_merge($this->field_list['screen-5'][$provider]['L' . $level], $extract);
		}

		if (!empty($this->field_list['screen-5'][$layout][$provider])) {
			$extract = array_merge($this->field_list['screen-5'][$layout][$provider], $extract);
		}

		if (!empty($this->field_list['screen-5'][$provider])) {
			$extract = array_merge($this->field_list['screen-5'][$provider], $extract);
		}

		if (!empty($this->field_list['screen-5']['L' . $level])) {
			$extract = array_merge($this->field_list['screen-5']['L' . $level], $extract);
		}

		if (!empty($this->field_list['screen-5'][$layout])) {
			$extract = array_merge($this->field_list['screen-5'][$layout], $extract);
		}

		$output .= $this->render_all_fields($extract, $existing);
		return $output;
	}

	/**
	 * Builds out the shortcode based on inputs from all previous screens. Some attributes are passed as they are, e.g. <code>count</code>.
	 * Others are used to determine other attributes, e.g. <code>display_type</code>
	 *
	 * @return string
	 */
	private function construct_shortcode() {
		global $photonic_alternative_shortcode;

		$provider = sanitize_text_field($_POST['provider']);
		$display_type = sanitize_text_field($_POST['display_type']);

		$short_code = array();
		if ($provider !== 'wp') {
			$short_code['type'] = $provider;
		}

		switch ($provider) {
			case 'flickr':
				if ($display_type == 'single-photo') {
					$short_code['view'] = 'photo';
					$short_code['photo_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'multi-photo') {
					$short_code['view'] = 'photos';
				}
				else if ($display_type == 'album-photo') {
					$short_code['view'] = 'photosets';
					$short_code['photoset_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'gallery-photo') {
					$short_code['view'] = 'galleries';
					$short_code['gallery_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'multi-album') {
					$short_code['view'] = 'photosets';
				}
				else if ($display_type == 'multi-gallery') {
					$short_code['view'] = 'galleries';
				}
				else if ($display_type == 'collection') {
					$short_code['view'] = 'collections';
					$short_code['collection_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'collections') {
					$short_code['view'] = 'collections';
				}
				break;

			case 'smugmug':
				if ($display_type == 'album-photo') {
					$short_code['view'] = 'album';
					$short_code['album'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'folder-photo') {
					$short_code['view'] = 'images';
					$short_code['folder'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'user-photo') {
					$short_code['view'] = 'images';
				}
				else if ($display_type == 'multi-album') {
					$short_code['view'] = 'albums';
				}
				else if ($display_type == 'tree') {
					$short_code['view'] = 'tree';
				}
				else if ($display_type == 'folder') {
					$short_code['view'] = 'folder';
					$short_code['folder'] = sanitize_text_field($_POST['selected_data']);
				}
				break;

			case 'google':
				if ($display_type == 'album-photo') {
					$short_code['view'] = 'photos';
					$short_code['album_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'multi-photo') {
					$short_code['view'] = 'photos';
					$date_filters = !empty($_POST['date_filters']) ? sanitize_text_field($_POST['date_filters']) : '';
					$date_range_filters = !empty($_POST['date_range_filters']) ? sanitize_text_field($_POST['date_range_filters']) : '';
					$short_code['date_filters'] = trim($date_filters.','.$date_range_filters, ',');
				}
				else if ($display_type == 'multi-album') {
					$short_code['view'] = 'albums';
				}
				break;

			case 'zenfolio':
				if ($display_type == 'multi-photo') {
					$short_code['view'] = 'photos';
				}
				else if ($display_type == 'single-photo') {
					$short_code['view'] = 'photos';
					$short_code['object_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'gallery-photo'/* || $display_type == 'collection-photo'*/) {
					$short_code['view'] = 'photosets';
					$short_code['object_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'multi-gallery' || $display_type == 'multi-collection' || $display_type == 'multi-gallery-collection') {
					$short_code['view'] = 'photosets';
					if ($display_type == 'multi-gallery') {
						$short_code['photoset_type'] = 'Gallery';
					}
					else if ($display_type == 'multi-collection') {
						$short_code['photoset_type'] = 'Collection';
					}
				}
				else if ($display_type == 'group') {
					$short_code['view'] = 'group';
					$short_code['object_id'] = sanitize_text_field($_POST['selected_data']);
				}
				else if ($display_type == 'group-hierarchy') {
					$short_code['view'] = 'hierarchy';
				}
				break;

			case 'instagram':
				if ($display_type == 'single-photo') {
					$short_code['media_id'] = sanitize_text_field($_POST['selected_data']);
				}
				break;

			default:
				if ($display_type == 'current-post' && !empty($_POST['post_id'])) {
					$short_code['id'] = sanitize_text_field($_POST['post_id']);
				}
				else if (!empty($_POST['selected_data'])) {
					$short_code['ids'] = sanitize_text_field($_POST['selected_data']);
				}
				break;
		}

		if (!empty($_POST['selection'])) {
			if ($_POST['selection'] != 'all') {
				$short_code['filter'] = sanitize_text_field($_POST['selected_data']);
			}
			if ($_POST['selection'] == 'not-selected') {
				$short_code['filter_type'] = 'exclude';
			}
		}

		if (isset($_POST['headers']) && trim($_POST['headers'] !== '')) {
			if (trim($_POST['headers']) == 'none') {
				$short_code['headers'] = '';
			}
			else {
				$short_code['headers'] = sanitize_text_field($_POST['headers']);
			}
		}

		$additional_attrs = array_merge(
			$this->shortcode_attributes[$provider],
			$this->shortcode_attributes['common']
		);
		foreach ($additional_attrs as $attr) {
			if (!empty($_POST[$attr]) && is_array($_POST[$attr])) {
				$short_code[$attr] = implode(',', $_POST[$attr]);
			}
			else if (!empty($_POST[$attr])) {
				$short_code[$attr] = $_POST[$attr];
			}
		}

		if (!empty($_POST['layout'])) {
			$key = $provider == 'wp' ? 'style' : 'layout';
			if ($_POST['layout'] != 'slideshow') {
				$short_code[$key] = sanitize_text_field($_POST['layout']);
			}
			else {
				$short_code[$key] = sanitize_text_field($_POST['slideshow-style']);
			}
		}
		// layout

		$raw_shortcode = !empty($_POST['photonic-editor-shortcode-raw']) ? sanitize_text_field($_POST['photonic-editor-shortcode-raw']) : '';
		if (!empty($raw_shortcode)) {
			$input = base64_decode($raw_shortcode);
			$input = json_decode($input);
			if (!empty($input->shortcode) && !empty($input->shortcode->attrs) && !empty($input->shortcode->attrs->named)) {
				$input = $input->shortcode->attrs->named;
			}
		}
		else {
			$raw_shortcode = !empty($_POST['photonic-editor-json']) ? stripslashes_deep($_POST['photonic-editor-json']) : '';
			$input = json_decode($raw_shortcode);
		}

		if (!empty($input)) {
			$attr_array = (array)$input;

			// If the type changes, regardless of everything else blank out the attributes
			if (!(empty($short_code['type']) && (empty($attr_array['type']) || in_array($attr_array['type'], array('wp', 'default')))) &&
				($attr_array['type'] != $short_code['type'])) {
				$attr_array = array();
			}
			else {
				foreach ($short_code as $key => $value) {
					unset($attr_array[$key]);
				}
			}

			if (!empty($this->aka_attributes[$provider])) {
				$aka = $this->aka_attributes[$provider];
				foreach ($aka as $key => $value) {
					if (isset($short_code[$key]) || isset($short_code[$value])) unset($attr_array[$key]);
				}
			}

			// Others ...
			if (!empty($short_code['type']) && $short_code['type'] == 'instagram') {
				if (!empty($short_code['media_id'])) {
					unset($attr_array['view']);
					unset($attr_array['media']);
				}
				else if (!empty($short_code['media'])) {
					unset($attr_array['media_id']);
				}
			}
			$short_code = array_merge($short_code, $attr_array);
		}

		if (!$this->is_gutenberg) {
			$output = '<h1>' . esc_html__('Your shortcode', 'photonic') . '</h1>';
			$output .= "<code id='photonic_shortcode'>[" . (empty($photonic_alternative_shortcode) ? 'gallery' : $photonic_alternative_shortcode).' ';
			$shortcode_attrs = array();
			foreach ($short_code as $attr => $value) {
				$shortcode_attrs[] = $attr . "='" . esc_attr($value) . "'";
			}

			$output .= implode(' ', $shortcode_attrs);
			$output .= ']</code>';
			$output .= '<p>'.esc_html__('The above shortcode was generated based on your selections. You can either copy the above and paste it manually into your post, or click on the buttons below to insert it into or update your post', 'photonic').'</p>';
		}
		else {
			$output = '<h1>' . esc_html__('Your Gallery', 'photonic') . '</h1>';
			$output .= '<p>'.esc_html__('Based on your selections a gallery with the following attributes will be generated. Please click on the buttons below to insert it into or update your post:', 'photonic').'</p>';
			$shortcode_attrs = array();
			foreach ($short_code as $attr => $value) {
				$shortcode_attrs[] = '<code>'.$attr . ": " . esc_attr($value).'</code>';
			}
			$output .= implode("<br/>\n", $shortcode_attrs);

			$output .= '<p>'.esc_html__('The following is the corresponding shortcode for this block. If for some reason you are unable to create a Photonic block you can paste this into a Shortcode block:', 'photonic').'</p>';
			$output .= "<code>[" . (empty($photonic_alternative_shortcode) ? 'gallery' : $photonic_alternative_shortcode).' ';
			$shortcode_attrs = array();
			foreach ($short_code as $attr => $value) {
				$shortcode_attrs[] = $attr . "='" . esc_attr($value) . "'";
			}

			$output .= implode(' ', $shortcode_attrs);
			$output .= ']</code>';

			$output .= "<input id='photonic_shortcode' name='photonic_shortcode' type='hidden' value='".esc_attr(json_encode($short_code))."' />\n";
		}

		if ($this->force_next_screen > -1) {
			$output .= "\n<input type='hidden' name='force_next_screen' value='{$this->force_next_screen}'/>\n";
		}
		if ($this->force_previous_screen > -1) {
			$output .= "\n<input type='hidden' name='force_previous_screen' value='{$this->force_previous_screen}'/>\n";
		}
		return $output;
	}

	/**
	 * This is the inverse of the <code>construct_shortcode</code> method. If the Editor has a shortcode selected, this method
	 * splits it out into the relevant screens.
	 *
	 * @param $input
	 * @return array
	 */
	private function deconstruct_shortcode($input) {
		$deconstructed = array();
		if (!empty($input)) {
			if ((!empty($input->type) && in_array($input->type, array('wp', 'default', 'flickr', 'smugmug', 'picasa', 'google', 'zenfolio', 'instagram'))) ||
				(empty($input->type) && !empty($input->style)) && in_array($input->style, array('square', 'circle', 'random', 'masonry', 'mosaic', 'strip-above', 'strip-below', 'strip-right', 'no-strip'))
			) {
				$deconstructed['provider'] = !empty($input->type) ? $input->type : 'wp';

				switch ($deconstructed['provider']) {
					case 'flickr':
						// Potential for an existing (old) shortcode to not have a user_id. E.g. Just defining photoset_id.
						// Rather than defaulting to the default user, we will make the user put it in this time.
						if (!empty($input->user_id)) {
							$deconstructed['for'] = 'other';
							$deconstructed['login'] = $input->user_id;
						}
						else if (!empty($input->group_id)) {
							$deconstructed['for'] = 'group';
							$deconstructed['group'] = $input->group_id;
						}

						if (!empty($input->view)) {
							if ($input->view == 'collections' && empty($input->collection_id)) {
								$deconstructed['display_type'] = 'collections';
							}
							else if ($input->view == 'galleries' && empty($input->gallery_id)) {
								$deconstructed['display_type'] = 'multi-gallery';
							}
							else if ($input->view == 'photosets' && empty($input->photoset_id)) {
								$deconstructed['display_type'] = 'multi-album';
							}
							else if ($input->view == 'photos') {
								$deconstructed['display_type'] = 'multi-photo';
							}
						}

						if (!empty($input->collection_id)) {
							$deconstructed['display_type'] = 'collection';
							$deconstructed['selected_data'] = $input->collection_id;
						}
						else if (!empty($input->gallery_id)) {
							$deconstructed['display_type'] = 'gallery-photo';
							$deconstructed['selected_data'] = $input->gallery_id;
						}
						else if (!empty($input->photoset_id)) {
							$deconstructed['display_type'] = 'album-photo';
							$deconstructed['selected_data'] = $input->photoset_id;
						}
						else if (!empty($input->photo_id)) {
							$deconstructed['display_type'] = 'single-photo';
							$deconstructed['selected_data'] = $input->photo_id;
						}

						break;

					case 'smugmug':
						if (!empty($input->view)) {
							if ($input->view == 'tree') {
								$deconstructed['display_type'] = 'tree';
							}
							else if ($input->view == 'folder') {
								$deconstructed['display_type'] = 'folder';
							}
							else if ($input->view == 'albums') {
								$deconstructed['display_type'] = 'multi-album';
							}
							else if ($input->view == 'images' || $input->view == 'album') {
								if (!empty($input->album) || !empty($input->album_key) || !empty($input->album_id)) {
									$deconstructed['display_type'] = 'album-photo';
								}
								else if (!empty($input->folder)) {
									$deconstructed['display_type'] = 'folder-photo';
								}
								else if (!empty($input->nick_name)) {
									$deconstructed['display_type'] = 'user-photo';
								}
							}

							if (!empty($input->folder)) {
								$deconstructed['selected_data'] = trim($input->folder);
							}
							else if (!empty($input->album_key)) { // old syntax
								$deconstructed['selected_data'] = $input->album_key;
							}
							else if (!empty($input->album)) {
								$album = explode('_', $input->album);
								if (count($album) == 2) {
									$deconstructed['selected_data'] = $album[1];
								}
								else if (count($album) == 1) {
									$deconstructed['selected_data'] = $album[0];
								}
							}

							if (!empty($input->nick_name)) {
								$deconstructed['for'] = 'other';
								$deconstructed['user'] = $input->nick_name;
							}
						}
						break;

					case 'google':
						if (!empty($input->view)) {
							if ($input->view == 'photos') {
								if (!empty($input->album_id)) {
									$deconstructed['display_type'] = 'album-photo';
									$deconstructed['selected_data'] = sanitize_text_field($input->album_id);
								}
								else {
									$deconstructed['display_type'] = 'multi-photo';
									if (!empty($input->date_filters)) {
										$filters = sanitize_text_field($input->date_filters);
										$filters = explode(',', $filters);
										$date_filters = array();
										$date_range_filters = array();
										foreach ($filters as $filter) {
											$maybe_range = explode('-', $filter);
											if (count($maybe_range) == 2) {
												$date_range_filters[] = $filter;
											}
											else if (count($maybe_range) == 1) {
												$date_filters[] = $filter;
											}
										}
										if (count($date_range_filters) > 5) {
											$date_range_filters = array_slice($date_range_filters, 0, 5);
										}
										if (count($date_filters) > 5) {
											$date_filters = array_slice($date_filters, 0, 5);
										}
										$date_range_filters = implode(',', $date_range_filters);
										$date_filters = implode(',', $date_filters);
										if (!empty($date_filters)) {
											$deconstructed['date_filters'] = $date_filters;
										}
										if (!empty($date_range_filters)) {
											$deconstructed['date_range_filters'] = $date_range_filters;
										}
									}
								}
							}
							else if ($input->view == 'albums') {
								$deconstructed['display_type'] = 'multi-album';
							}
						}
						break;

					case 'zenfolio':
						if (!empty($input->view)) {
							if ($input->view == 'photos' && empty($input->object_id)) {
								$deconstructed['display_type'] = 'multi-photo';
							}
							else if ($input->view == 'photos' && !empty($input->object_id)) {
								$deconstructed['display_type'] = 'single-photo';
								$deconstructed['selected_data'] = $input->object_id;
							}
							else if ($input->view == 'photosets') {
								if (!empty($input->object_id)) {
									$deconstructed['display_type'] = 'gallery-photo';
									$deconstructed['selected_data'] = $input->object_id;
								}
								else if (empty($input->photoset_type)) {
									$deconstructed['display_type'] = 'multi-gallery-collection';
								}
								else if (strtolower($input->photoset_type) == 'collection') {
									$deconstructed['display_type'] = 'multi-collection';
								}
								else if (strtolower($input->photoset_type) == 'gallery') {
									$deconstructed['display_type'] = 'multi-gallery';
								}
							}
							else if ($input->view == 'hierarchy') {
								$deconstructed['display_type'] = 'group-hierarchy';
							}
							else if ($input->view == 'group') {
								$deconstructed['display_type'] = 'group';
								if (!empty($input->object_id)) {
									$deconstructed['selected_data'] = $input->object_id;
								}
							}

							if ($input->view == 'photosets' || $input->view == 'hierarchy' || $input->view == 'group' ||
								$deconstructed['display_type'] == 'single-photo') {
								global $photonic_zenfolio_default_user;
								if (!isset($input->login_name) && !empty($photonic_zenfolio_default_user)) {
									$deconstructed['for'] = 'current';
								}
								else if (!empty($input->login_name)) {
									$deconstructed['login_name'] = $input->login_name;
									$deconstructed['for'] = 'other';
								}
							}
						}
						break;

					case 'instagram':
						if (!empty($input->media_id)) {
							$deconstructed['display_type'] = 'single-photo';
							$deconstructed['selected_data'] = $input->media_id;
						}
						else {
							$deconstructed['display_type'] = 'multi-photo';
						}
						break;

					default:
					case 'wp':
					case 'default':
						if (empty($input->id) && empty($input->ids) && empty($input->include)) {
							$deconstructed['display_type'] = 'current-post';
						}
						else if (!empty($input->ids) || !empty($input->include)) {
							$deconstructed['display_type'] = 'multi-photo';
							$deconstructed['selected_data'] = !empty($input->ids) ? $input->ids : $input->include;
						}
						break;
				}

				if (!empty($input->filter)) {
					$deconstructed['selected_data'] = $input->filter;
					if (empty($input->filter_type) && in_array($input->filter_type, array('include', 'exclude'))) {
						$deconstructed['selection'] = $input->filter_type;
					}
					else {
						$deconstructed['selection'] = 'selected';
					}
				}
				else {
					$deconstructed['selection'] = 'all';
				}

				if (isset($this->aka_attributes[$deconstructed['provider']])) {
					$aka_attributes = $this->aka_attributes[$deconstructed['provider']];
					foreach ($aka_attributes as $attr => $aka) {
						if (isset($input->{$attr}) && !isset($deconstructed[$aka])) {
							$deconstructed[$aka] = sanitize_text_field($input->{$attr});
						}
					}
				}

				$layout = empty($input->layout) ? (empty($input->style) ? '' : $input->style) : $input->layout;
				if (!empty($layout)) {
					if (in_array($layout, array('square', 'circle', 'random', 'masonry', 'mosaic',))) {
						$deconstructed['layout'] = $layout;
					}
					else if (in_array($layout, array('strip-above', 'strip-below', 'strip-right', 'no-strip'))) {
						$deconstructed['layout'] = 'slideshow';
						$deconstructed['slideshow-style'] = $layout;
					}
				}

				$same_name_attrs = array_merge($this->shortcode_attributes['common'], $this->shortcode_attributes[$deconstructed['provider']]);
				foreach ($same_name_attrs as $attr) {
					if (isset($input->{$attr}) && !isset($deconstructed[$attr])) {
						$deconstructed[$attr] = $input->{$attr};
					}
				}
			}
		}
		return $deconstructed;
	}

	/**
	 * Displays an array of L1, L2 or L3 objects as a series of selectable thumbnails. Titles are deliberately not displayed because they mess
	 * with the layout if they are too long.
	 *
	 * @param array $objects
	 * @param bool $provider
	 * @param array $existing
	 * @param array $present
	 * @param bool $more
	 * @return string
	 */
	function get_thumbnail_display($objects, $provider = false, $existing = array(), &$present = array(), $more = false) {
		$output = '';
		$selected_data = empty($existing['selected_data']) ? array() : explode(',', $existing['selected_data']);
		foreach ($objects as $object) {
			if (!is_array($object)) {
				$output .= '<h4>'.$object."</h4>\n";
				continue;
			}
			if (!isset($object['id'])) {
				continue;
			}
			$selected = '';
			if (in_array($object['id'], $selected_data) || (!empty($object['alt_id']) && in_array($object['alt_id'], $selected_data))
				|| (!empty($object['alt_id2']) && in_array($object['alt_id2'], $selected_data))) {
				$selected = 'selected';
				$present[] = $object['id'];
			}
			$passworded = !empty($object['passworded']) ? 'passworded' : '';

			$title = !empty($object['title']) ? esc_attr($object['title']) : '';
			$counts = !empty($object['counters']) ? ' (' . esc_attr(implode(', ', $object['counters'])) . ')' : '';
			$alt = !empty($object['alt_id']) ? "data-photonic-selection-alt-id='{$object['alt_id']}'" : '';
			$alt_2 = !empty($object['alt_id2']) ? "data-photonic-selection-alt-id-2='{$object['alt_id2']}'" : '';

			$output .= "<div class='photonic-flow-selector $provider $selected $passworded'>\n";
			$output .= "\t<div class='photonic-flow-selector-inner' data-photonic-selection-id='{$object['id']}' $alt $alt_2>\n";
			$output .= "\t\t<img src='{$object['thumbnail']}' alt='$title$counts' title='$title$counts' />\n";
			$output .= "\t</div>\n";
			$output .= "</div>\n";
		}
		if ($more) {
			return $output;
		}

		$output .= "<input type='hidden' name='existing_selection' id='existing_selection' value='" . (!empty($present) ? implode(',', $present) : '') . "'/>\n";
		return $output;
	}

	/**
	 * A recursive call to traverse a SmugMug node and generate a list of objects, with each object corresponding to a folder.
	 * Actually a node is used instead of the folder because the folder object is deprecated by SmugMug, but nodes are only being
	 * used for folders in Photonic.
	 *
	 * @param array $objects
	 * @param $node
	 */
	private function get_smugmug_folders(&$objects, $node) {
		$object = array();
		if ($node->Type == 'Folder') {
			$object['id'] = $node->NodeID;
			$object['title'] = !empty($node->Name) ? esc_attr($node->Name) : '';

			if (isset($node->Uris->NodeCoverImage->Image->Uris->ImageSizes->ImageSizes->ThumbImageUrl)) {
				$object['thumbnail'] = $node->Uris->NodeCoverImage->Image->Uris->ImageSizes->ImageSizes->ThumbImageUrl;
			}
			else {
				$object['thumbnail'] = trailingslashit(PHOTONIC_URL) . 'include/images/placeholder-Th.png';
			}

			if (isset($node->Uris->ChildNodes->Node)) {
				$child_nodes = $node->Uris->ChildNodes->Node;
				if (is_array($child_nodes)) {
					foreach ($child_nodes as $child_node) {
						$this->get_smugmug_folders($objects, $child_node);
					}
				}
			}
			$objects[] = $object;
		}
	}

	/**
	 * A recursive call to traverse a Zenfolio group and generate a list of objects, with each object corresponding to a photoset.
	 *
	 * @param $objects
	 * @param $elements
	 * @param $display_type
	 */
	private function get_zenfolio_groups(&$objects, $elements, $display_type) {
		if (!empty($elements->PhotoSet) && $display_type != 'group') {
			foreach ($elements->PhotoSet as $photoset) {
				if ((($display_type == 'gallery-photo' || $display_type == 'multi-gallery') && $photoset->Type == 'Gallery') ||
					(($display_type == 'collection-photo' || $display_type == 'multi-collection') && $photoset->Type == 'Collection') ||
					$display_type == 'multi-gallery-collection' || $display_type == 'group-hierarchy' || $display_type == 'single-photo'
				) {
					$object = array();
					$page_url = parse_url($photoset->PageUrl);
					$page_url = $page_url['path'];
					$page_url = explode('/', $page_url);
					if (count($page_url) > 1) {
						$page_url = $page_url[1];
					}

					if (!is_array($page_url) && preg_match('/^p\d{9}/', $page_url) === 0) {
						$page_url = array();
					}

					$object['id'] = !is_array($page_url) ? $page_url : $photoset->Id;
					$object['alt_id'] = $photoset->Id;
					$object['title'] = esc_attr($photoset->Title);
					$object['counters'] = array(esc_html(sprintf(_n('%s media item', '%s media items', $photoset->PhotoCount, 'photonic'), $photoset->PhotoCount)));

					$photo = $photoset->TitlePhoto;
					$object['thumbnail'] = 'https://' . $photo->UrlHost . $photo->UrlCore . '-1.jpg';

					if (!empty($photoset->AccessDescriptor) && !empty($photoset->AccessDescriptor->AccessType) && $photoset->AccessDescriptor->AccessType == 'Password') {
						$object['passworded'] = 1;
					}

					$objects[] = $object;
				}
			}
		}

		if (!empty($elements->Group)) {
			foreach ($elements->Group as $group) {
				if ($display_type == 'group' || $display_type == 'group-hierarchy') {
					$object = array();
					$object['id'] = $group->Id;
					$object['title'] = $group->Title;
					$object['thumbnail'] = trailingslashit(PHOTONIC_URL) . 'include/images/placeholder-Ti.png';
					$objects[] = $object;
				}

				if ($display_type != 'group-hierarchy' && !empty($group->Elements)) {
					$this->get_zenfolio_groups($objects, $group->Elements, $display_type);
				}
			}
		}
	}

	/**
	 * A wrapper function that invokes the individual <code>process_response</code> calls by provider.
	 *  -   If the call is successful the results are passed as a thumbnail grid in an array with a "success" key
	 *  -   If the call is unsuccessful an error message is passed in an array with an "error" key
	 *
	 * @param $response
	 * @param $provider
	 * @param null $display_type
	 * @param array $form_parameters
	 * @param array $existing
	 * @param null $url
	 * @param bool $more
	 * @return array
	 */
	function process_response($response, $provider, $display_type = null, $form_parameters = array(), $existing = array(), $url = null, $more = false) {
		if (!is_wp_error($response)) {
			if (isset($response['response']) && isset($response['response']['code'])) {
				if ($response['response']['code'] == 200) {
					$pagination = array();
					if ($provider == 'flickr') {
						$objects = $this->process_flickr_response($response, $display_type, $url, $pagination);
					}
					else if ($provider == 'smugmug') {
						$objects = $this->process_smugmug_response($response, $display_type, $url, $pagination);
					}
					else if ($provider == 'google') {
						$objects = $this->process_google_response($response, $url, $pagination);
					}
					else if ($provider == 'zenfolio') {
						$objects = $this->process_zenfolio_response($response, $display_type);
					}
					else if ($provider == 'instagram') {
						$objects = $this->process_instagram_response($response, $display_type, $url, $pagination);
					}

					if (empty($objects)) {
						return array('error' => $this->error_no_data_returned);
					}
					else if (!empty($objects['error']) || !empty($objects['success'])) {
						// Happens for "Find user" kind of calls
						return $objects;
					}

					$present = array();
					$output = $this->get_thumbnail_display($objects, $provider, $existing, $present, $more);

					$selected_data = empty($existing['selected_data']) ? array() : explode(',', $existing['selected_data']);
					$missing = array_diff($selected_data, $present);
					if (!empty($missing)) {
						//
					}

					if (!empty($pagination['url'])) {
						$data_display_type = empty($display_type) ? '' : $display_type;
						$output .= "<div class='photonic-more-wrapper'>\n".
										"\t<a href='#' class='photonic-flow-more' data-photonic-more-link='{$pagination['url']}' data-photonic-display-type='$data_display_type' data-photonic-provider='$provider'>".esc_html__('Load More', 'photonic')."</a>\n".
									"</div>";
					}

					if (!$more) {
						foreach ($form_parameters as $id => $value) {
							$output .= "<input type='hidden' name='$id' value='" . esc_attr($value) . "' />\n";
						}
					}
					return array('success' => $output);
				}
				else {
					Photonic::log($response['response']);
					return array('error' => sprintf(esc_html__('No data returned. Error code %s', 'photonic'), $response['response']['code']));
				}
			}
			else {
				Photonic::log($response);
				return array('error' => esc_html__('No data returned. Empty response, or empty error code.', 'photonic'));
			}
		}
		else {
			return array('error' => $response->get_error_message());
		}
	}

	/**
	 * Processes a response from Flickr to build it out into a gallery of thumbnails. Flickr has L1, L2 and L3 displays in the flow.
	 *
	 * @param $response
	 * @param $display_type
	 * @param null $url
	 * @param array $pagination
	 * @return array
	 */
	private function process_flickr_response($response, $display_type, $url = null, &$pagination = array()) {
		$objects = array();
		$body = json_decode(wp_remote_retrieve_body($response));

		if (isset($body->stat) && $body->stat == 'fail') {
			Photonic::log($response);
			return array('error' => $body->message);
		}

		if (isset($body->photosets) && isset($body->photosets->photoset)) {
//			$page = (int)($body->photosets->page); // Not needed because apparently the photosets.getList call returns all photosets for now
//			$pages = (int)($body->photosets->pages); // Not needed because apparently the photosets.getList call returns all photosets for now
			$photosets = $body->photosets->photoset;
			foreach ($photosets as $flickr_object) {
				$object = array();
				$object['id'] = $flickr_object->id;
				$object['title'] = esc_attr($flickr_object->title->_content);
				$object['counters'] = array();
				if (!empty($flickr_object->photos)) $object['counters'][] = esc_html(sprintf(_n('%s photo', '%s photos', $flickr_object->photos, 'photonic'), $flickr_object->photos));
				if (!empty($flickr_object->videos)) $object['counters'][] = esc_html(sprintf(_n('%s video', '%s videos', $flickr_object->videos, 'photonic'), $flickr_object->videos));
				$object['thumbnail'] = "https://farm" . $flickr_object->farm . ".staticflickr.com/" . $flickr_object->server . "/" . $flickr_object->primary . "_" . $flickr_object->secret . "_q.jpg";
				$objects[] = $object;
			}
		}
		else if (isset($body->galleries) && isset($body->galleries->gallery)) {
			$page = (int)($body->galleries->page);
			$pages = (int)($body->galleries->pages);
			$galleries = $body->galleries->gallery;
			foreach ($galleries as $flickr_object) {
				$object = array();
				$object['id'] = $flickr_object->id;
				$object['title'] = esc_attr($flickr_object->title->_content);
				$object['counters'] = array();
				if (!empty($flickr_object->count_photos)) $object['counters'][] = esc_html(sprintf(_n('%s photo', '%s photos', $flickr_object->count_photos, 'photonic'), $flickr_object->count_photos));
				if (!empty($flickr_object->count_videos)) $object['counters'][] = esc_html(sprintf(_n('%s video', '%s videos', $flickr_object->count_videos, 'photonic'), $flickr_object->count_videos));
				$object['thumbnail'] = "https://farm" . $flickr_object->primary_photo_farm . ".staticflickr.com/" . $flickr_object->primary_photo_server . "/" . $flickr_object->primary_photo_id . "_" . $flickr_object->primary_photo_secret . "_q.jpg";
				$objects[] = $object;
			}
		}
		else if (isset($body->photos) && isset($body->photos->photo)) {
			if ($display_type == 'single-photo') {
				$page = (int)($body->photos->page);
				$pages = (int)($body->photos->pages);
				if ($page < $pages && !empty($url)) {
					$url = remove_query_arg('page', $url);
					$pagination['url'] = add_query_arg(array('page' => $page + 1), $url);
				}
			}
			$photos = $body->photos->photo;
			foreach ($photos as $flickr_object) {
				$object = array();
				$object['id'] = $flickr_object->id;
				$object['title'] = esc_attr($flickr_object->title);
				$object['thumbnail'] = 'https://farm' . $flickr_object->farm . '.staticflickr.com/' . $flickr_object->server . '/' . $flickr_object->id . '_' . $flickr_object->secret . '_q.jpg';
				$objects[] = $object;
			}
		}
		else if (isset($body->collections) && isset($body->collections->collection)) {
			$collections = $body->collections->collection;
			foreach ($collections as $flickr_object) {
				$object = array();
				$object['id'] = $flickr_object->id;
				$object['title'] = esc_attr($flickr_object->title);
				$object['counters'] = array();
				if (!empty($flickr_object->set)) $object['counters'][] = esc_html(sprintf(_n('%s album', '%s albums', count($flickr_object->set), 'photonic'), count($flickr_object->set)));
				$object['thumbnail'] = $flickr_object->iconlarge;
				$objects[] = $object;
			}
		}
		else if (isset($body->user)) {
			return array('success' => array('user_id' => $body->user->id));
		}
		else if (isset($body->group)) {
			return array('success' => array('group_id' => $body->group->id));
		}

		if (!empty($page) && !empty($pages) && $page < $pages && !empty($url)) {
			$url = remove_query_arg('page', $url);
			$pagination['url'] = add_query_arg(array('page' => $page + 1), $url);
		}
		return $objects;
	}

	/**
	 * Processes a response from SmugMug to build it out into a gallery of thumbnails. SmugMug has L1, L2 and L3 displays in the flow.
	 *
	 * @param $response
	 * @param $display_type
	 * @param null $url
	 * @param array $pagination
	 * @return array
	 */
	private function process_smugmug_response($response, $display_type, $url = null, &$pagination = array()) {
		$objects = array();
		$body = json_decode(wp_remote_retrieve_body($response));
		if (isset($body->Response) && isset($body->Response->Album)) {
			$albums = $body->Response->Album;
			foreach ($albums as $album) {
				$object = array();
				if (isset($album->AlbumKey)) {
					$object['id'] = $album->AlbumKey;
				}
				else {
					$uri = $album->Uris->Album->Uri;
					$uri = explode('/', $uri);
					$object['id'] = $uri[count($uri) - 1];
				}
				$object['title'] = !empty($album->Name) ? esc_attr($album->Name) : '';
				if (isset($album->ImageCount)) {
					$object['counters'] = array(esc_html(sprintf(_n('%s media item', '%s media items', $album->ImageCount, 'photonic'), $album->ImageCount)));
				}

				$highlight = $album->Uris->HighlightImage;
				if (isset($highlight->Image)) {
					$thumbURL = $highlight->Image->Uris->ImageSizes->ImageSizes->ThumbImageUrl;
				}
				else {
					$thumbURL = trailingslashit(PHOTONIC_URL) . 'include/images/placeholder-Th.png';
				}

				$object['thumbnail'] = $thumbURL;
				if (isset($album->SecurityType) && $album->SecurityType == 'Password') {
					$object['passworded'] = 1;
				}

				$objects[] = $object;
			}

			if (isset($body->Response->Pages)) {
				$pages = $body->Response->Pages;
				if ($pages->Start + $pages->Count - 1 < $pages->Total) {
					$pagination['url'] = add_query_arg(array('start' => $pages->Start + $pages->Count), remove_query_arg(array('start'), $url));
				}
			}
		}
		else if (isset($body->Response) && isset($body->Response->Node)) {
			$nodes = $body->Response->Node;
			foreach ($nodes as $node) {
				if ($display_type == 'folder' && $node->Type == 'Album') {
					continue;
				}
				else if ($display_type == 'folder') {
					$this->get_smugmug_folders($objects, $node);
				}
				else {
					$object = array();
					if ($node->Type == 'Album') {
						$uri = $node->Uris->Album->Uri;
						$uri = explode('/', $uri);
						$uri = $uri[count($uri) - 1];
						$object['id'] = $uri;
					}
					else if ($node->Type == 'Folder') {
						$object['id'] = $node->NodeID;
					}
					$object['title'] = !empty($node->Name) ? esc_attr($node->Name) : '';
					if ($display_type == 'tree') {
						$object['title'] .= " ({$node->Type})";
					}
					if (isset($node->Uris->NodeCoverImage->Image->Uris->ImageSizes->ImageSizes->ThumbImageUrl)) {
						$object['thumbnail'] = $node->Uris->NodeCoverImage->Image->Uris->ImageSizes->ImageSizes->ThumbImageUrl;
					}
					else {
						$object['thumbnail'] = trailingslashit(PHOTONIC_URL) . 'include/images/placeholder-Th.png';
					}
					$objects[] = $object;
				}
			}
		}
		else if (isset($body->Response) && isset($body->Response->User)) {
			$user = $body->Response->User;
			return array('success' => $user->Uris->Node->Uri);
		}
		else {
			Photonic::log($body);
			return array('error' => $this->error_not_found);
		}

		return $objects;
	}

	/**
	 * Processes a response from Google to build it out into a gallery of thumbnails. Google has both, L1 and L2 displays in the flow.
	 *
	 * @param $response
	 * @param $url
	 * @param array $pagination
	 * @return array
	 */
	function process_google_response($response, $url, &$pagination = array()) {
		$objects = array();
		$body = json_decode(wp_remote_retrieve_body($response));
		if (isset($body->albums)) {
			$albums = $body->albums;
			foreach ($albums as $album) {
				$object = array();
				$object['id'] = $album->id;
				$object['title'] = !empty($album->title) ? esc_attr($album->title) : '';
				$object['counters'] = array(esc_html(sprintf(_n('%s media item', '%s media items', $album->mediaItemsCount, 'photonic'), $album->mediaItemsCount)));
				$object['thumbnail'] = $album->coverPhotoBaseUrl . "=w150-h150-c";
				$objects[] = $object;
			}
			if (!empty($body->nextPageToken)) {
				$pagination['url'] = add_query_arg(array('pageToken' => $body->nextPageToken), remove_query_arg(array('pageToken'), $url));
			}
		}
		else if (isset($body->mediaItems)) {
			$photos = $body->mediaItems;
			foreach ($photos as $photo) {
				$object = array();
				$object['id'] = $photo->id;
				$object['title'] = !empty($photo->description) ? esc_attr($photo->description) : '';
				$object['thumbnail'] = $photo->baseUrl . "=w150-h150-c";
				$objects[] = $object;
			}
		}
		else if (isset($body->error)) {
			$objects['error'] = $body->error->message;
		}
		return $objects;
	}

	/**
	 * Processes a response from Zenfolio to build it out into a gallery of thumbnails. Zenfolio has both, L1 and L2 displays in the flow.
	 *
	 * @param $response
	 * @param $display_type
	 * @return array
	 */
	function process_zenfolio_response($response, $display_type) {
		$body = wp_remote_retrieve_body($response);
		$body = preg_replace('/"Id":(\d+)/', '"Id":"$1"', $body);
		$body = simplexml_load_string($body);
		$objects = array();
		if ($display_type != 'multi-photo') {
			if (!empty($body->Elements)) {
				$elements = $body->Elements;
				$this->get_zenfolio_groups($objects, $elements, $display_type);
			}
			else if (!empty($body->PhotoSets)) {
				$photosets = $body->PhotoSets;
				$this->get_zenfolio_groups($objects, $photosets, $display_type);
			}

			if ($display_type == 'single-photo') {
				$photo_array = array();
				global $photonic_zenfolio_gallery;
				if (!isset($photonic_zenfolio_gallery)) {
					$photonic_zenfolio_gallery = new Photonic_Zenfolio_Processor();
				}
				$requests = array();
				foreach ($objects as $object) {
					$parameters = array();
					$parameters['photoSetId'] = substr($object['id'], 1);
					$parameters['level'] = 'Level1';
					$parameters['includePhotos'] = 'true';

					$request = $photonic_zenfolio_gallery->prepare_request('LoadPhotoSet', $parameters);
					$requests[] = array(
						'url' => 'https://api.zenfolio.com/api/1.8/zfapi.asmx',
						'type' => 'POST',
						'headers' => $request['headers'],
						'data' => $request['body'],
					);
				}
				$responses = Requests::request_multiple($requests);
				if (!empty($responses)) {
					foreach ($responses as $ps_response) {
						if (is_a($ps_response, 'Requests_Response')) {
							$ps_response = json_decode($ps_response->body);
							if (!empty($ps_response->result)) {
								$ps_response = $ps_response->result;
								if (!empty($ps_response->Photos)) {
									$photo_array['psid'.$ps_response->Id] = $ps_response->Title;
									foreach ($ps_response->Photos as $ps_photo) {
										if (array_key_exists($ps_photo->Id, $photo_array)) {
											continue;
										}
										$photo = array();
										$photo['id'] = $ps_photo->Id;
										$url_parts = explode('/', $ps_photo->UrlCore);
										$photo['alt_id'] = 'h'.dechex((int)substr($url_parts[count($url_parts) - 1], 1));
										$photo['alt_id2'] = $url_parts[count($url_parts) - 1];
										$photo['title'] = esc_attr($ps_photo->Title);
										$photo['thumbnail'] = 'https://' . $ps_photo->UrlHost . $ps_photo->UrlCore . '-1.jpg';
										$photo_array[$ps_photo->Id] = $photo;
									}
								}
							}
						}
					}
				}
				$objects = array_values($photo_array);
			}
			return $objects;
		}
		else {
			$photos = $body->Photos;
			foreach ($photos->Photo as $photo) {
				$object = array();
				$object['id'] = $photo->Id;
				$object['title'] = esc_attr($photo->Title);
				$object['thumbnail'] = 'https://' . $photo->UrlHost . $photo->UrlCore . '-1.jpg';
				$objects[] = $object;
			}
			return $objects;
		}
	}

	/**
	 * Processes a response from Instagram to build it out into a gallery of thumbnails. Instagram only has L1 displays.
	 *
	 * @param $response
	 * @param $display_type
	 * @param $url
	 * @param array $pagination
	 * @return array
	 */
	function process_instagram_response($response, $display_type, $url, &$pagination = array()) {
		$objects = array();
		$body = json_decode($response['body']);
		if (isset($body->data)) {
			$data = $body->data;
			foreach ($data as $photo) {
				if (isset($photo->type) && ($photo->type == 'image' || $photo->type == 'carousel' || $photo->type == 'video') && isset($photo->images)) {
					$object = array();
					$link = $photo->link;
					$link = explode('/', $link);
					if (empty($link[count($link) - 1])) {
						$link = $link[count($link) - 2];
					}
					else {
						$link = $link[count($link) - 1];
					}
					$object['id'] = $link;
					if (isset($photo->caption) && isset($photo->caption->text)) {
						$object['title'] = esc_attr($photo->caption->text);
					}
					else {
						$object['title'] = '';
					}
					$object['thumbnail'] = $photo->images->thumbnail->url;
					$objects[] = $object;
				}
			}
			if (isset($body->pagination) && isset($body->pagination->next_max_id) && $display_type == 'single-photo') {
				$pagination['url'] = add_query_arg(array('max_id' => $body->pagination->next_max_id), remove_query_arg(array('max_id'), $url));
			}
		}
		return $objects;
	}
}
