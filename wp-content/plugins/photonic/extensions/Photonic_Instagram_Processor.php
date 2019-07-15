<?php
/**
 * Processor for Instagram. This extends the Photonic_OAuth2_Processor class and defines methods local to Instagram.
 *
 * @package Photonic
 * @subpackage Extensions
 */

class Photonic_Instagram_Processor extends Photonic_Processor {
	var $response_type, $scope;
	function __construct() {
		parent::__construct();
		global $photonic_instagram_disable_title_link, $photonic_instagram_access_token;
		$this->provider = 'instagram';
		$this->oauth_version = '2.0';
		$this->response_type = 'token';
		$this->scope = 'basic public_content';
		$this->api_key = 'f95ba49c90034990b8f5c7270c264fd3';
		$this->api_secret = 'not-required-but-not-empty';
		$this->token = $photonic_instagram_access_token;
		$this->link_lightbox_title = empty($photonic_instagram_disable_title_link);
		$this->esc_html__ = array(
			'general' => 'https://aquoid.com/plugins/photonic/instagram/',
		);
	}

	/**
	 * Main function that fetches the images associated with the shortcode.
	 *
	 * @param array $attr
	 * @return string
	 */
	public function get_gallery_images($attr = array()) {
		global $photonic_instagram_main_size, $photonic_instagram_tile_size, $photonic_instagram_media;
		$this->gallery_index++;
		$this->push_to_stack('Get Gallery Images');
		$attr = array_merge(
			$this->common_parameters,
			array(
				// Common overrides ...
				'caption' => 'title',
				'thumb_size' => 75,
				'main_size' => $photonic_instagram_main_size,
				'tile_size' => $photonic_instagram_tile_size,

				// Instagram-specific ...
				'count' => 1000,
				'distance' => 1000,
				'media' => $photonic_instagram_media,
			), $attr);

		if ($attr['tile_size'] == 'same') {
			$attr['tile_size'] = $attr['main_size'];
		}
		$attr = array_map('trim', $attr);

		extract($attr);

		if (!isset($this->token) || empty($this->token) || $this->is_token_expired($this->token)) {
			return $this->error(esc_html__("Instagram Access Token not valid. Please reauthenticate.", 'photonic'));
		}

		$base_url = 'https://api.instagram.com/v1/';
		$display_what = 'media';
		if (!empty($media_id)) {// Trumps all else. A single photo will be shown.
			$query_url = 'http://api.instagram.com/oembed?url='.urlencode('http://instagr.am/p/'.$media_id.'/');
			$display_what = 'single-media';
		}
		else if (!empty($user_id)) {
			$query_url = $base_url.'users/'.$user_id.'/media/recent'; // Doesn't matter what the other values are. User's recent photos will be shown.
		}
		else {
			if (!empty($tag_name) && (empty($view) || $view == 'tag')) {
				$query_url = $base_url.'tags/'.$tag_name.'/media/recent';
				if (isset($min_id) || isset($max_id)) {
					$query_url .= '?';
					if (isset($min_id)) {
						$query_url .= 'min_tag_id='.$min_id.'&';
					}
					if (isset($max_id)) {
						$query_url .= 'max_tag_id='.$max_id.'&';
					}
				}
			}
			else if (!empty($location_id) && (empty($view) || $view == 'location')) {
				$query_url = $base_url.'locations/'.$location_id.'/media/recent';
				if (isset($min_id) || isset($max_id)) {
					$query_url .= '?';
					if (isset($min_id)) {
						$query_url .= 'min_id='.$min_id.'&';
					}
					if (isset($max_id)) {
						$query_url .= 'max_id='.$max_id.'&';
					}
				}
			}
			else if (!empty($lat) && !empty($lng) && (empty($view) || $view == 'search')) {
				$query_url = $base_url.'media/search?';
				$query_url .= 'lat='.$lat.'&';
				$query_url .= 'lng='.$lng.'&';
				$query_url .= 'distance='.$attr['distance'].'&';
			}
			else if (empty($user_id)) {
				$query_url = $base_url.'users/self/media/recent'; // No user shown. Pick the authenticated user
			}
			else if (empty($view)) {
				return $this->error(sprintf(esc_html__('The %s parameter has to be defined.', 'photonic'), '<code>view</code>'));
			}
			else {
				return $this->error(sprintf(esc_html__('Malformed shortcode. Either %1$s or %2$s or %3$s or %4$s or %5$s have to be defined. If you have specified one of them, the %6$s parameter is inconsistent.', 'photonic'),
					'<code>media_id</code>', '<code>user_id</code>', '<code>tag_name</code>', '<code>location_id</code>', '<code>lat+lng</code>', '<code>view</code>'));
			}
		}

		if (isset($count)) {
			$query_url = add_query_arg(array('count' => $count), $query_url);
		}

		if (isset($max_id)) {
			$query_url = add_query_arg(array('max_id' => $max_id), $query_url);
		}

		$ret = $this->make_call($query_url, $display_what, $attr);
		$this->pop_from_stack();
		return $this->finalize_markup($ret, $attr).$this->get_stack_markup();
	}

	protected function make_call($query_url, $display_what, &$shortcode_attr) {
		$this->push_to_stack("Make call $query_url");
		$ret = '';
		$query = $query_url;
		if (substr($query, -1, 1) != '&' && !stripos($query, '?')) {
			$query .= '?';
		}
		else if (substr($query, -1, 1) != '&' && stripos($query, '?')) {
			$query .= '&';
		}

		if (isset($this->token) && !$this->is_token_expired($this->token)) {
			$query .= 'access_token='.$this->token;
		}
		else {
			$this->pop_from_stack();
			return $this->error(esc_html__("Instagram Access Token not valid. Please reauthenticate.", 'photonic'));
		}

		$this->push_to_stack('Send request');
		$response = wp_remote_request($query, array(
			'sslverify' => PHOTONIC_SSL_VERIFY,
		));
		$this->pop_from_stack();

		$this->push_to_stack('Process response');
		if (!is_wp_error($response)) {
			if (isset($response['response']) && isset($response['response']['code'])) {
				if ($response['response']['code'] == 200) {
					$body = json_decode($response['body']);
					if (isset($body->pagination) && isset($body->pagination->next_max_id)) {
						$shortcode_attr['max_id'] = $body->pagination->next_max_id;
						if (empty($shortcode_attr['more'])) {
							$shortcode_attr['more'] = esc_html__('More', 'photonic');
						}
					}
					else {
						if (isset($shortcode_attr['max_id'])) {
							unset($shortcode_attr['max_id']);
						}
					}

					if (isset($body->data) && $display_what != 'single-media') {
						$data = $body->data;
						$ret .= $this->process_media($data, $shortcode_attr);
					}
					else if ($display_what == 'single-media') {
						if (!empty($body->html)) {
							$ret .= $body->html;
						}
					}
					else {
						$this->pop_from_stack(); // 'Process response'
						$this->pop_from_stack(); // 'Make call'
						return $this->error(esc_html__('No data returned. Unknown error', 'photonic'));
					}
				}
				else if (isset($response['body'])) {
					$body = json_decode($response['body']);
					if (isset($body->meta) && isset($body->meta->error_message)) {
						$this->pop_from_stack(); // 'Process response'
						$this->pop_from_stack(); // 'Make call'
						return $body->meta->error_message;
					}
					else {
						$this->pop_from_stack(); // 'Process response'
						$this->pop_from_stack(); // 'Make call'
						return $this->error(esc_html__('Unknown error', 'photonic'));
					}
				}
				else if (isset($response['response']['message'])) {
					$this->pop_from_stack(); // 'Process response'
					$this->pop_from_stack(); // 'Make call'
					return $this->error($response['response']['message']);
				}
				else {
					$this->pop_from_stack(); // 'Process response'
					$this->pop_from_stack(); // 'Make call'
					return $this->error(esc_html__('Unknown error', 'photonic'));
				}
			}
		}
		else {
			$this->pop_from_stack(); // 'Process response'
			$this->pop_from_stack(); // 'Make call'
			return $this->wp_error_message($response);
		}

		$this->pop_from_stack();
		return $ret;
	}

	function process_media($data, $short_code) {
		global $photonic_instagram_photos_per_row_constraint, $photonic_instagram_photos_constrain_by_padding, $photonic_instagram_photos_constrain_by_count, $photonic_instagram_photo_title_display;

		$photo_objects = $this->build_level_1_objects($data, $short_code);
		$row_constraints = array('constraint-type' => $photonic_instagram_photos_per_row_constraint, 'padding' => $photonic_instagram_photos_constrain_by_padding, 'count' => $photonic_instagram_photos_constrain_by_count);

		$ret = $this->display_level_1_gallery($photo_objects,
			array(
				'title_position' => $photonic_instagram_photo_title_display,
				'row_constraints' => $row_constraints,
				'parent' => 'stream',
				'level_2_meta' => array('end' => 0, 'total' => empty($short_code['max_id']) ? 0 : $short_code['count']),
			),
			$short_code
		);
		return $ret;
	}

	function build_level_1_objects($data, $short_code) {
		global $photonic_instagram_video_size;
		$thumb_size = $short_code['thumb_size'];
		$level_1_objects = array();
		if ($thumb_size <= 150) {
			$url_function = 'thumbnail';
		}
		else if ($thumb_size > 150 && $thumb_size <= 320) {
			$url_function = 'low_resolution';
		}
		else {
			$url_function = 'standard_resolution';
		}

		$media = explode(',', $short_code['media']);
		$videos_ok = in_array('videos', $media) || in_array('all', $media);
		$photos_ok = in_array('photos', $media) || in_array('all', $media);

		$non_standard_search = array();
		foreach ($data as $photo) {
			if (isset($photo->type) && ((($photo->type == 'image' || $photo->type == 'carousel') && $photos_ok) || ($photo->type == 'video' && $videos_ok)) && isset($photo->images)) {
				$photo_object = array();
				$photo_object['thumbnail'] = $photo->images->{$url_function}->url;

				if (!isset($photo->images->{$short_code['main_size']})) { // Sizes such as 1080x1080 are not returned by Instagram
					// This doesn't work any more ...
//					$main_image = $photo->images->thumbnail->url;
//					$main_image = str_replace('/s150x150/', '/'.$photonic_instagram_main_size.'/', $main_image);

					// Workaround because the above doesn't work
					$main_image = $photo->images->standard_resolution->url;
					$non_standard_search[] = array(
						'url' => trailingslashit($photo->link).'?__a=1',
						'type' => 'GET'
					);
				}
				else {
					$main_image = $photo->images->{$short_code['main_size']}->url;
				}
				$photo_object['main_image'] = $main_image;

				if ($short_code['tile_size'] == $short_code['main_size']) {
					$photo_object['tile_image'] = $main_image;
				}
				else {
					// Same code as main_size, but with tile_size
					if (!isset($photo->images->{$short_code['tile_size']})) { // Sizes such as 1080x1080 are not returned by Instagram
						// Workaround because the above doesn't work
						$tile_image = $photo->images->standard_resolution->url;
						$non_standard_search[] = array(
							'url' => trailingslashit($photo->link).'?__a=1',
							'type' => 'GET'
						);
					}
					else {
						$tile_image = $photo->images->{$short_code['tile_size']}->url;
					}
					$photo_object['tile_image'] = $tile_image;
				}

				if (isset($photo->caption) && isset($photo->caption->text)) {
					$photo_object['title'] = esc_attr($photo->caption->text);
				}
				else {
					$photo_object['title'] = '';
				}
				$photo_object['alt_title'] = $photo_object['title'];
				$photo_object['description'] = $photo_object['title'];
				$photo_object['main_page'] = $photo->link;
				$photo_object['id'] = $photo->id;

				if ($photo->type == 'video') {
					$photo_object['video'] = $photo->videos->{$photonic_instagram_video_size}->url;
					$parse = wp_parse_url($photo_object['video']);
					$parse = explode('.', $parse['path']);
					$photo_object['mime'] = 'video/'.$parse[count($parse) - 1];
				}
				$photo_object['provider'] = $this->provider;
				$photo_object['gallery_index'] = $this->gallery_index;

				$level_1_objects[] = $photo_object;
			}
		}

		// Workaround to get the best resolution URL - the old search-and-replace technique does not work
		if (!empty($non_standard_search)) {
			$responses = Requests::request_multiple($non_standard_search);
			foreach ($responses as $idx => $photo_response) {
				if (is_a($photo_response, 'Requests_Response')) {
					$photo_response = json_decode($photo_response->body);
					if (!empty($photo_response->graphql) && !empty($photo_response->graphql->shortcode_media) && !empty($photo_response->graphql->shortcode_media->display_url)) {
						$level_1_objects[$idx]['main_image'] = $photo_response->graphql->shortcode_media->display_url;
					}
				}
			}
		}
		return $level_1_objects;
	}

	function is_token_expired($token) {
		if (empty($token)) {
			return true;
		}

		$url = 'https://api.instagram.com/v1/users/self/?access_token='.$token;
		$response = wp_remote_request($url, array(
			'sslverify' => PHOTONIC_SSL_VERIFY,
		));

		if (!is_wp_error($response)) {
			if (isset($response['body'])) {
				$body = json_decode($response['body']);
				if (isset($body->meta) && isset($body->meta->code) && $body->meta->code == 200) {
					return false;
				}
			}
		}
		return true;
	}
}