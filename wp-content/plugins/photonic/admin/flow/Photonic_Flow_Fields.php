<?php
/**
 * Contains the fields used by the gallery builder. Cannot be overridden by a theme file
 * Screen 1: Provider selection: Pick from Flickr, Google Photos etc.
 * Screen 2: Display Type selection; Input: Provider. Pick from: Single Photo
 * Screen 3: Gallery object selection; input: Display Type
 * Screen 4: Layout selection; input: Gallery & Display Type
 * Screen 5: Layout configuration; Set <code>count</code>, <code>more</code> etc.
 * Screen 6: Final shortcode display
 *
 * @package Photonic
 * @subpackage Flow
 * @since 2.00
 */
class Photonic_Flow_Fields {
	var $flow_options, $layout_options, $column_options, $allowed_image_sizes, $default_under, $default_from_settings;
	function __construct() {
		$this->layout_options = array(
			'square' => esc_html__('Square Grid', 'photonic'),
			'circle' => esc_html__('Circular Icon Grid', 'photonic'),
			'random' => esc_html__('Justified Grid', 'photonic'),
			'masonry' => esc_html__('Masonry', 'photonic'),
			'mosaic' => esc_html__('Mosaic', 'photonic'),
			'slideshow' => esc_html__('Slideshow', 'photonic'),
		);

		$this->column_options = array(
			'desc' => esc_html__('Number of columns in output', 'photonic'),
			'type' => 'select',
			'options' => array(
				'' => '',
				'auto' => esc_html__('Automatic (Photonic calculates the columns)', 'photonic'),
				'1' => 1,
				'2' => 2,
				'3' => 3,
				'4' => 4,
				'5' => 5,
				'6' => 6,
				'7' => 7,
				'8' => 8,
				'9' => 9,
				'10' => 10,
				'11' => 11,
				'12' => 12,
				'13' => 13,
				'14' => 14,
				'15' => 15,
				'16' => 16,
				'17' => 17,
				'18' => 18,
				'19' => 19,
				'20' => 20,
			)
		);

		$this->default_under = esc_html__('Default settings can be configured under: %s', 'photonic');
		$this->default_from_settings = esc_html__('Default from settings', 'photonic');

		$this->set_allowed_image_sizes();
		$this->set_options();
	}

	private function set_options() {
		global $photonic_thumbnail_style, $photonic_enable_popup,
			   $photonic_flickr_media, $photonic_smug_media, $photonic_google_media, $photonic_zenfolio_media, $photonic_instagram_media,
		       $photonic_smug_title_caption, $photonic_zenfolio_title_caption, $photonic_flickr_title_caption;
		$this->flow_options = array(
			'screen-1' => array('wp', 'flickr', 'picasa', 'google', 'smugmug', 'zenfolio', 'instagram'),
			'screen-2' => array(
				'wp' => array(
					'header' => esc_html__('Choose Type of Gallery', 'photonic'),
					'display' => array(
						'display_type' => array(
							'desc' => esc_html__('What do you want to show?', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'current-post' => esc_html__('Gallery attached to the current post', 'photonic'),
								'multi-photo' => esc_html__('Photos from Media Library', 'photonic'),
							),
							'req' => 1,
						),
					),
				),
				'flickr' => array(
					'header' => esc_html__('Choose Type of Gallery', 'photonic'),
					'display' => array(
						'kind' => array(
							'type' => 'field_list',
							'list_type' => 'sequence',
							'list' => array(
								'display_type' => array(
									'desc' => esc_html__('What do you want to show?', 'photonic'),
									'type' => 'select',
									'options' => array(
										'' => '',
										'single-photo' => esc_html__('A Single Photo', 'photonic'),
										'multi-photo' => esc_html__('Multiple Photos', 'photonic'),
										'album-photo' => esc_html__('Photos from an Album / Photoset', 'photonic'),
										'gallery-photo' => esc_html__('Photos from a Gallery', 'photonic'),
										'multi-album' => esc_html__('Multiple Albums', 'photonic'),
										'multi-gallery' => esc_html__('Multiple Galleries', 'photonic'),
										'collection' => esc_html__('Albums from a single collection', 'photonic'),
										'collections' => esc_html__('Multiple collections', 'photonic'),
									),
									'req' => 1,
								),
								'for' => array(
									'desc' => esc_html__('For whom?', 'photonic'),
									'type' => 'radio',
									'options' => array(
										'current' => sprintf(esc_html__('Current user (Defined under %s)', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Default user</em>'),
										'other' => esc_html__('Another user', 'photonic'),
										'group' => esc_html__('Group', 'photonic'),
										'any' => esc_html__('All users', 'photonic'),
									),
									'option-conditions' => array(
										'group' => array('display_type' => array('multi-photo')),
										'any' => array('display_type' => array('multi-photo')),
									),
									'req' => 1,
								),
								'login' => array(
									'desc' => sprintf(esc_html__('User name, e.g. %s', 'photonic'), 'https://www.flickr.com/photos/<span style="text-decoration: underline">username</span>/'),
									'type' => 'text',
									'std' => '',
									'conditions' => array('for' => array('other')),
									'req' => 1,
								),
								'group' => array(
									'desc' => sprintf(esc_html__('Group name, e.g. %s', 'photonic'), 'https://www.flickr.com/groups/<span style="text-decoration: underline">groupname</span>/'),
									'type' => 'text',
									'std' => '',
									'conditions' => array('for' => array('group')),
									'req' => 1,
								),
							),
						),
					),
				),
				'smugmug' => array(
					'header' => esc_html__('Choose Type of Gallery', 'photonic'),
					'display' => array(
						'kind' => array(
							'type' => 'field_list',
							'list_type' => 'sequence',
							'list' => array(
								'display_type' => array(
									'desc' => esc_html__('What do you want to show?', 'photonic'),
									'type' => 'select',
									'options' => array(
										'' => '',
										'album-photo' => esc_html__('Photos from an Album', 'photonic'),
										'folder-photo' => esc_html__('Photos from a Folder', 'photonic'),
										'user-photo' => esc_html__('Photos from a User', 'photonic'),
										'multi-album' => esc_html__('Multiple Albums', 'photonic'),
										'folder' => esc_html__('Albums in a Folder', 'photonic'),
										'tree' => esc_html__('User Tree', 'photonic'),
									),
									'req' => 1,
								),
								'for' => array(
									'desc' => esc_html__('For whom?', 'photonic'),
									'type' => 'radio',
									'options' => array(
										'current' => sprintf(esc_html__('Current user (Defined under %s)', 'photonic'), '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Default user</em>'),
										'other' => esc_html__('Another user', 'photonic'),
									),
									'req' => 1,
								),
								'user' => array(
									'desc' => sprintf(esc_html__('User name, e.g. %s', 'photonic'), 'https://<span style="text-decoration: underline">username</span>.smugmug.com/'),
									'type' => 'text',
									'std' => '',
									'conditions' => array('for' => array('other')),
									'req' => 1,
								),
							),
						),
					),
				),
				'google' => array(
					'header' => esc_html__('Choose Type of Gallery', 'photonic'),
					'display' => array(
						'display_type' => array(
							'desc' => esc_html__('What do you want to show?', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'multi-photo' => esc_html__('Multiple Photos', 'photonic'),
								'album-photo' => esc_html__('Photos from an Album', 'photonic'),
								'multi-album' => esc_html__('Multiple Albums', 'photonic'),
							),
							'req' => 1,
						),
					),
				),
				'zenfolio' => array(
					'header' => esc_html__('Choose Type of Gallery', 'photonic'),
					'display' => array(
						'kind' => array(
							'type' => 'field_list',
							'list_type' => 'sequence',
							'list' => array(
								'display_type' => array(
									'desc' => esc_html__('What do you want to show?', 'photonic'),
									'type' => 'select',
									'options' => array(
										'' => '',
										'single-photo' => esc_html__('Single Photo', 'photonic'),
										'multi-photo' => esc_html__('Multiple Photos', 'photonic'),
										'gallery-photo' => esc_html__('Photos from a Gallery or Collection', 'photonic'),
//										'collection-photo' => esc_html__('Photos from a Collection', 'photonic'),
										'multi-gallery' => esc_html__('Multiple Galleries', 'photonic'),
										'multi-collection' => esc_html__('Multiple Collections', 'photonic'),
										'multi-gallery-collection' => esc_html__('Multiple Galleries and Collections', 'photonic'),
										'group' => esc_html__('Single Group', 'photonic'),
										'group-hierarchy' => esc_html__('Group Hierarchy', 'photonic'),
									),
									'req' => 1,
								),
								'for' => array(
									'desc' => esc_html__('For whom?', 'photonic'),
									'type' => 'radio',
									'options' => array(
										'current' => sprintf(esc_html__('Current user (Defined under %s)', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Default user</em>'),
										'other' => esc_html__('Another user', 'photonic'),
										'any' => esc_html__('All users', 'photonic'),
									),
									'option-conditions' => array(
										'current' => array('display_type' => array('single-photo', 'gallery-photo', 'collection-photo', 'multi-gallery', 'multi-collection', 'multi-gallery-collection', 'group', 'group-hierarchy')),
										'other' => array('display_type' => array('single-photo', 'gallery-photo', 'collection-photo', 'multi-gallery', 'multi-collection', 'multi-gallery-collection', 'group', 'group-hierarchy')),
										'any' => array('display_type' => array('multi-photo', /*'multi-gallery', 'multi-collection', */)),
									),
									'req' => 1,
								),
								'login_name' => array(
									'desc' => sprintf(esc_html__('User name, e.g. %s', 'photonic'), 'https://<span style="text-decoration: underline">username</span>.zenfolio.com/'),
									'type' => 'text',
									'std' => '',
									'conditions' => array('for' => array('other')),
									'req' => 1,
								),
							),
						),
					),
				),
				'instagram' => array(
					'header' => esc_html__('Choose Type of Gallery', 'photonic'),
					'display' => array(
						'display_type' => array(
							'desc' => esc_html__('What do you want to show?', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'single-photo' => esc_html__('A Single Photo', 'photonic'),
								'multi-photo' => esc_html__('Multiple Photos', 'photonic'),
							),
							'req' => 1,
						),
					),
				),
			),
			'screen-3' => array(
				'wp' => array(),
				'flickr' => array(
					'header' => esc_html__('Build your gallery', 'photonic'),
					'single-photo' => array(
						'header' => esc_html__('Pick a photo', 'photonic'),
						'desc' => esc_html__('From the list below pick the single photo you wish to display.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'multi-photo' => array(
						'header' => esc_html__('All your photos', 'photonic'),
						'desc' => esc_html__('You can show all your photos, or apply tags to show some of them.', 'photonic'),
						'display' => array(
							'tags' => array(
								'desc' => esc_html__('Tags', 'photonic'),
								'type' => 'text',
								'hint' => esc_html__('Comma-separated list of tags', 'photonic')
							),

							'tag_mode' => array(
								'desc' => esc_html__('Tag mode', 'photonic'),
								'type' => 'select',
								'options' => array(
									'any' => esc_html__('Any tag', 'photonic'),
									'all' => esc_html__('All tags', 'photonic'),
								),
							),

							'text' => array(
								'desc' => esc_html__('With text', 'photonic'),
								'type' => 'text',
							),

							'privacy_filter' => array(
								'desc' => esc_html__('Privacy filter', 'photonic'),
								'type' => 'select',
								'options' => array(
									'' => esc_html__('None', 'photonic'),
									'1' => esc_html__('Public photos', 'photonic'),
									'2' => esc_html__('Private photos visible to friends', 'photonic'),
									'3' => esc_html__('Private photos visible to family', 'photonic'),
									'4' => esc_html__('Private photos visible to friends & family', 'photonic'),
									'5' => esc_html__('Completely private photos', 'photonic'),
								),
								'hint' => sprintf(esc_html__('Applicable only if Flickr private photos are turned on (%1$s) and Back-end authentication is off (%2$s)', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Allow User Login</em>', '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Access Token</em>'),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
					'album-photo' => array(
						'header' => esc_html__('Pick your album', 'photonic'),
						'desc' => esc_html__('From the list below pick the album whose photos you wish to display. Photos from that album will show up as thumbnails.', 'photonic'),
						'display' => array(
							'privacy_filter' => array(
								'desc' => esc_html__('Privacy filter', 'photonic'),
								'type' => 'select',
								'options' => array(
									'' => esc_html__('None', 'photonic'),
									'1' => esc_html__('Public photos', 'photonic'),
									'2' => esc_html__('Private photos visible to friends', 'photonic'),
									'3' => esc_html__('Private photos visible to family', 'photonic'),
									'4' => esc_html__('Private photos visible to friends & family', 'photonic'),
									'5' => esc_html__('Completely private photos', 'photonic'),
								),
								'hint' => sprintf(esc_html__('Applicable only if Flickr private photos are turned on (%1$s) and Back-end authentication is off (%2$s)', 'photonic'), '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Allow User Login</em>', '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Access Token</em>'),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'gallery-photo' => array(
						'header' => esc_html__('Pick your gallery', 'photonic'),
						'desc' => esc_html__('From the list below pick the gallery whose photos you wish to display. Photos from that gallery will show up as thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'multi-album' => array(
						'header' => esc_html__('Pick your albums / photosets', 'photonic'),
						'desc' => esc_html__('From the list below pick the albums / photosets you wish to display. Each album will show up as a single thumbnail.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new albums)', 'photonic'),
									'selected' => esc_html__('Selected albums / photosets', 'photonic'),
									'not-selected' => esc_html__('All except selected albums / photosets', 'photonic'),
								),
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
								'req' => 1,
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
					'multi-gallery' => array(
						'header' => esc_html__('Pick your galleries', 'photonic'),
						'desc' => esc_html__('From the list below pick the galleries you wish to display. Each album will show up as a single thumbnail.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new galleries)', 'photonic'),
									'selected' => esc_html__('Selected galleries', 'photonic'),
									'not-selected' => esc_html__('All except selected galleries', 'photonic'),
								),
								'req' => 1,
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
					'collection' => array(
						'header' => esc_html__('Pick your collection', 'photonic'),
						'desc' => esc_html__('From the list below pick the collection you wish to display. The albums within the collections will show up as single thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'collections' => array(
						'header' => esc_html__('Pick your collections', 'photonic'),
						'desc' => esc_html__('From the list below pick the collections you wish to display. The albums within the collections will show up as single thumbnails.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new collections)', 'photonic'),
									'selected' => esc_html__('Selected collections', 'photonic'),
									'not-selected' => esc_html__('All except selected collections', 'photonic'),
								),
								'req' => 1,
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
				),
				'google' => array(
					'header' => esc_html__('Build your gallery', 'photonic'),
					'multi-photo' => array(
						'header' => esc_html__('All your photos', 'photonic'),
						'desc' => esc_html__('You can show all your photos, or apply filters to show some of them.', 'photonic'),
						'display' => array(
							'date_filters' => array(
								'desc' => esc_html__('Date Filters', 'photonic'),
								'type' => 'date-filter',
								'count' => 5
							),

							'date_range_filters' => array(
								'desc' => esc_html__('Date Range Filters', 'photonic'),
								'type' => 'date-range-filter',
								'count' => 5
							),

							'content_filters' => array(
								'desc' => esc_html__('Content Filters', 'photonic'),
								'type' => 'text',
								'hint' => sprintf(esc_html__('Comma-separated. Pick from: %s. Filters will be applied on the front-end, not on the display below. ', 'photonic'),
									'NONE, LANDSCAPES, RECEIPTS, CITYSCAPES, LANDMARKS, SELFIES, PEOPLE, PETS, WEDDINGS, BIRTHDAYS, DOCUMENTS, TRAVEL, ANIMALS, FOOD, SPORT, NIGHT, PERFORMANCES, WHITEBOARDS, SCREENSHOTS, UTILITY').
									Photonic::doc_link("https://aquoid.com/plugins/photonic/google-photos/photos/#filtering-photos"),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
					'album-photo' => array(
						'header' => esc_html__('Pick your album', 'photonic'),
						'desc' => esc_html__('From the list below pick the album whose photos you wish to display. Photos from that album will show up as thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'multi-album' => array(
						'header' => esc_html__('Pick your albums', 'photonic'),
						'desc' => esc_html__('From the list below pick the albums you wish to display. Each album will show up as a single thumbnail.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new albums)', 'photonic'),
									'selected' => esc_html__('Selected albums', 'photonic'),
									'not-selected' => esc_html__('All except selected albums', 'photonic'),
								),
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
								'req' => 1,
							),
							'access' => array(
								'desc' => esc_html__('What type of album?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'' => '',
									'all' => esc_html__('Show both shared and not shared albums', 'photonic'),
									'shared' => esc_html__('Only show shared albums', 'photonic'),
									'not-shared' => esc_html__('Only show albums not shared', 'photonic'),
								),
								'std' => '',
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
				),
				'smugmug' => array(
					'header' => esc_html__('Build your gallery', 'photonic'),
					'album-photo' => array(
						'header' => esc_html__('Pick your album', 'photonic'),
						'desc' => esc_html__('From the list below pick the album whose photos you wish to display. Photos from that album will show up as thumbnails.', 'photonic'),
						'display' => array(
							'text' => array(
								'desc' => esc_html__('Only show photos with this text', 'photonic'),
								'type' => 'text',
								'std' => '',
								'hint' => esc_html__('Comma-separated list of values. Filters will be applied on the front-end, not on the display below', 'photonic'),
							),
							'keywords' => array(
								'desc' => esc_html__('Only show photos with these keywords', 'photonic'),
								'type' => 'text',
								'std' => '',
								'hint' => esc_html__('Comma-separated list of values. Filters will be applied on the front-end, not on the display below', 'photonic'),
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'folder-photo' => array(
						'header' => esc_html__('Pick your folder', 'photonic'),
						'desc' => esc_html__('From the list below pick the folder whose photos you wish to display. Photos from that folder will show up as thumbnails.', 'photonic'),
						'display' => array(
							'text' => array(
								'desc' => esc_html__('Only show photos with this text', 'photonic'),
								'type' => 'text',
								'std' => '',
								'hint' => esc_html__('Comma-separated list of values. Filters will be applied on the front-end, not on the display below', 'photonic'),
							),
							'keywords' => array(
								'desc' => esc_html__('Only show photos with these keywords', 'photonic'),
								'type' => 'text',
								'std' => '',
								'hint' => esc_html__('Comma-separated list of values. Filters will be applied on the front-end, not on the display below.', 'photonic'),
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'user-photo' => array(
						'header' => esc_html__('Photos for a User', 'photonic'),
						'desc' => esc_html__('The following lists the top-level folders and albums for the selected user. All photos from these folders will show up as thumbnails.', 'photonic'),
						'display' => array(
							'text' => array(
								'desc' => esc_html__('Only show photos with this text', 'photonic'),
								'type' => 'text',
								'std' => '',
								'hint' => esc_html__('Comma-separated list of values', 'photonic'),
							),
							'keywords' => array(
								'desc' => esc_html__('Only show photos with these keywords', 'photonic'),
								'type' => 'text',
								'std' => '',
								'hint' => esc_html__('Comma-separated list of values', 'photonic'),
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
					'multi-album' => array(
						'header' => esc_html__('Pick your albums', 'photonic'),
						'desc' => esc_html__('From the list below pick the albums you wish to display. Each album will show up as a single thumbnail.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new albums)', 'photonic'),
									'selected' => esc_html__('Selected albums', 'photonic'),
									'not-selected' => esc_html__('All except selected albums', 'photonic'),
								),
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
								'req' => 1,
							),
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
					'folder' => array(
						'header' => esc_html__('Pick your folder', 'photonic'),
						'desc' => esc_html__('From the list below pick the folder you wish to display. The albums within the folder will show up as single thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'tree' => array(
						'header' => esc_html__('User Tree', 'photonic'),
						'desc' => esc_html__('The following user tree will be displayed on your site. Only top level folders and albums are shown here. The albums within the folders will show up as single thumbnails and can be clicked to show the images within.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
				),
				'zenfolio' => array(
					'header' => esc_html__('Build your gallery', 'photonic'),
					'single-photo' => array(
						'header' => esc_html__('Pick a photo', 'photonic'),
						'desc' => esc_html__('From the list below pick the single photo you wish to display.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'multi-photo' => array(
						'header' => esc_html__('Photos from all users', 'photonic'),
						'desc' => esc_html__('You can show photos from all users, and apply text or category filters to show some of them.', 'photonic'),
						'display' => array(
							'text' => array(
								'desc' => esc_html__('With text', 'photonic'),
								'type' => 'text',
							),

							'category_code' => array(
								'desc' => esc_html__('Category', 'photonic'),
								'type' => 'select',
								'options' => $this->get_zenfolio_categories(),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
					'gallery-photo' => array(
						'header' => esc_html__('Pick your gallery', 'photonic'),
						'desc' => esc_html__('From the list below pick the gallery whose photos you wish to display. Photos from that gallery will show up as thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'collection-photo' => array(
						'header' => esc_html__('Pick your collection', 'photonic'),
						'desc' => esc_html__('From the list below pick the collection whose photos you wish to display. Photos from that collection will show up as thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'multi-gallery' => array(
						'header' => esc_html__('Pick your galleries', 'photonic'),
						'desc' => esc_html__('From the list below pick the galleries you wish to display. Each album will show up as a single thumbnail. Note that text and category filters are not applied here but will be applied on the front-end.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new galleries)', 'photonic'),
									'selected' => esc_html__('Selected galleries', 'photonic'),
									'not-selected' => esc_html__('All except selected galleries', 'photonic'),
								),
								'req' => 1,
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
							),

							'text' => array(
								'desc' => esc_html__('With text', 'photonic'),
								'type' => 'text',
							),

							'category_code' => array(
								'desc' => esc_html__('Category', 'photonic'),
								'type' => 'select',
								'options' => $this->get_zenfolio_categories(),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
					'multi-collection' => array(
						'header' => esc_html__('Pick your collections', 'photonic'),
						'desc' => esc_html__('From the list below pick the collections you wish to display. Each collection will show up as a single thumbnail. Note that text and category filters are not applied here but will be applied on the front-end.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new collections)', 'photonic'),
									'selected' => esc_html__('Selected collections', 'photonic'),
									'not-selected' => esc_html__('All except selected collections', 'photonic'),
								),
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
								'req' => 1,
							),

							'text' => array(
								'desc' => esc_html__('With text', 'photonic'),
								'type' => 'text',
							),

							'category_code' => array(
								'desc' => esc_html__('Category', 'photonic'),
								'type' => 'select',
								'options' => $this->get_zenfolio_categories(),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
					'multi-gallery-collection' => array(
						'header' => esc_html__('Pick your galleries and collections', 'photonic'),
						'desc' => esc_html__('From the list below pick the galleries and collections you wish to display. Each gallery and collection will show up as a single thumbnail. Note that text and category filters are not applied here but will be applied on the front-end.', 'photonic'),
						'display' => array(
							'selection' => array(
								'desc' => esc_html__('What do you want to show?', 'photonic'),
								'type' => 'select',
								'options' => array(
									'all' => esc_html__('Automatic all (will automatically add new galleries and collections)', 'photonic'),
									'selected' => esc_html__('Selected galleries and collections', 'photonic'),
									'not-selected' => esc_html__('All except selected galleries and collections', 'photonic'),
								),
								'hint' => esc_html__('If you pick "Automatic all" your selections below will be ignored.', 'photonic'),
								'req' => 1,
							),

							'text' => array(
								'desc' => esc_html__('With text', 'photonic'),
								'type' => 'text',
							),

							'category_code' => array(
								'desc' => esc_html__('Category', 'photonic'),
								'type' => 'select',
								'options' => $this->get_zenfolio_categories(),
							),

							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'multi',
								'for' => 'selected_data',
							),
						),
					),
					'group' => array(
						'header' => esc_html__('Pick your group', 'photonic'),
						'desc' => esc_html__('From the list below pick the group you wish to display. The galleries / collections within the group will show up as single thumbnails.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'group-hierarchy' => array(
						'header' => esc_html__('Your group hierarchy', 'photonic'),
						'desc' => esc_html__('The following group hierarchy will be displayed on your site. Only top level groups and galleries / collections are shown here. The galleries / collections within the groups will show up as single thumbnails and can be clicked to show the images within.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
				),
				'instagram' => array(
					'header' => esc_html__('Build your gallery', 'photonic'),
					'single-photo' => array(
						'header' => esc_html__('Pick a photo', 'photonic'),
						'desc' => esc_html__('From the list below pick the single photo you wish to display.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'single',
								'for' => 'selected_data',
							),
						),
					),
					'multi-photo' => array(
						'header' => esc_html__('All your photos', 'photonic'),
						'desc' => esc_html__('Though Photonic has the capability to handle tags, Instagram has not granted it permission to display photos by tag. You can only show all your photos without filtering. In the following only the latest 20 photos are displayed. You can change this in subsequent screens.', 'photonic'),
						'display' => array(
							'container' => array(
								'type' => 'thumbnail-selector',
								'mode' => 'none',
								'for' => 'selected_data',
							),
						),
					),
				),
			),
			'screen-4' => array(
				'wp' => array(),
				'flickr' => array(),
				'google' => array(),
				'smugmug' => array(),
				'zenfolio' => array(),
				'instagram' => array(),
			),
			'screen-5' => array(
				'wp' => array(
					'count' => array(
						'desc' => esc_html__('Number of photos to show', 'photonic'),
						'type' => 'text',
						'hint' => esc_html__('Numeric values only. Shows all photos by default.', 'photonic'),
					),
					'main_size' => array(
						'desc' => esc_html__('Main image size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['wp']['main_size'],
						'std' => 'full',
					),
				),
				'flickr' => array(
					'L1' => array(
						'sort' => array(
							'desc' => esc_html__('Sort by', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'date-posted-desc' => esc_html__('Date posted, descending', 'photonic'),
								'date-posted-asc' => esc_html__('Date posted, ascending', 'photonic'),
								'date-taken-asc' => esc_html__('Date taken, ascending', 'photonic'),
								'date-taken-desc' => esc_html__('Date taken, descending', 'photonic'),
								'interestingness-desc' => esc_html__('Interestingness, descending', 'photonic'),
								'interestingness-asc' => esc_html__('Interestingness, ascending', 'photonic'),
								'relevance' => esc_html__('Relevance', 'photonic'),
							),
						),
						'media' => array(
							'desc' => esc_html__('Media to Show', 'photonic'),
							'type' => 'select',
							'options' => Photonic::media_options(true, $photonic_flickr_media),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Media to show</em>'),
						),
						'caption' => array(
							'desc' => esc_html__('Photo titles and captions', 'photonic'),
							'type' => 'select',
							'options' => Photonic::title_caption_options(true, $photonic_flickr_title_caption),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Photo titles and captions</em>'),
						),
						'headers' => array(
							'desc' => esc_html__('Show Header', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => $this->default_from_settings,
								'none' => esc_html__('No header', 'photonic'),
								'title' => esc_html__('Title only', 'photonic'),
								'thumbnail' => esc_html__('Thumbnail only', 'photonic'),
								'counter' => esc_html__('Counts only', 'photonic'),
								'title,counter' => esc_html__('Title and counts', 'photonic'),
								'thumbnail,counter' => esc_html__('Thumbnail and counts', 'photonic'),
								'thumbnail,title' => esc_html__('Thumbnail and title', 'photonic'),
								'thumbnail,title,counter' => esc_html__('Thumbnail, title and counts', 'photonic'),
							),
							'conditions' => array('display_type' => array('album-photo', 'gallery-photo')),
						),
					),
					'L2' => array(),
					'L3' => array(
						'collections_display' => array(
							'desc' => esc_html__('Expand Collections', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'lazy' => esc_html__('Lazy loading', 'photonic'),
								'expanded' => esc_html__('Expanded upfront', 'photonic'),
							),
							'hint' => sprintf(esc_html__('The Collections API is slow, so, if you are displaying collections, pick %1$slazy loading%2$s if your collections have many albums / photosets.', 'photonic'),
								'<a href="https://aquoid.com/plugins/photonic/flickr/flickr-collections/" target="_blank">', '</a>'),
						),
						'headers' => array(
							'desc' => esc_html__('Show Header', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => $this->default_from_settings,
								'none' => esc_html__('No header', 'photonic'),
								'title' => esc_html__('Title only', 'photonic'),
								'thumbnail' => esc_html__('Thumbnail only', 'photonic'),
								'counter' => esc_html__('Counts only', 'photonic'),
								'title,counter' => esc_html__('Title and counts', 'photonic'),
								'thumbnail,counter' => esc_html__('Thumbnail and counts', 'photonic'),
								'thumbnail,title' => esc_html__('Thumbnail and title', 'photonic'),
								'thumbnail,title,counter' => esc_html__('Thumbnail, title and counts', 'photonic'),
							),
						),
					),
					'main_size' => array(
						'desc' => esc_html__('Main image size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['flickr']['main_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Main image size</em>'),
					),
					'video_size' => array(
						'desc' => esc_html__('Main video size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['flickr']['video_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Video size</em>'),
					),
				),
				'google' => array(
					'L1' => array(
						'media' => array(
							'desc' => esc_html__('Media to Show', 'photonic'),
							'type' => 'select',
							'options' => Photonic::media_options(true, $photonic_google_media),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Google Photos &rarr; Google Photos settings &rarr; Media to show</em>'),
						),

						'caption' => array(
							'desc' => esc_html__('Photo titles and captions', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => esc_html__('Default from settings', 'photonic'),
								'none' => esc_html__('No title / caption / description', 'photonic'),
								'title' => esc_html__('Always use the photo title, even if blank', 'photonic'),
							),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Google Photos &rarr; Google Photos Settings &rarr; Photo titles and captions</em>'),
						),
					),
					'main_size' => array(
						'desc' => esc_html__('Main image size', 'photonic'),
						'type' => 'text',
						'std' => 1600,
						'hint' => esc_html__('Numeric values between 1 and 16383, both inclusive.', 'photonic'),
					),
				),
				'smugmug' => array(
					'L1' => array(
						'media' => array(
							'desc' => esc_html__('Media to Show', 'photonic'),
							'type' => 'select',
							'options' => Photonic::media_options(true, $photonic_smug_media),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Media to show</em>'),
						),
						'caption' => array(
							'desc' => esc_html__('Photo titles and captions', 'photonic'),
							'type' => 'select',
							'options' => Photonic::title_caption_options(true, $photonic_smug_title_caption),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Photo titles and captions</em>'),
						),
						'password' => array(
							'desc' => esc_html__('Password for password-protected album', 'photonic'),
							'type' => 'text',
							'req' => 1,
							'hint' => esc_html__('You are trying to display photos from a password-protected album. The password is mandatory for such an album.', 'photonic'),
							'conditions' => array('selection_passworded' => array('1')),
						),
						'sort_method' => array(
							'desc' => esc_html__('Sort photos by', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'DateTaken' => esc_html__('Date Taken', 'photonic'),
								'DateUploaded' => esc_html__('Date Uploaded', 'photonic'),
								'Popular' => esc_html__('Popular', 'photonic'),
							),
						),
						'sort_order' => array(
							'desc' => esc_html__('Sort order', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'Ascending' => esc_html__('Ascending', 'photonic'),
								'Descending' => esc_html__('Descending', 'photonic'),
							),
						),
						'headers' => array(
							'desc' => esc_html__('Show Header', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => $this->default_from_settings,
								'none' => esc_html__('No header', 'photonic'),
								'title' => esc_html__('Title only', 'photonic'),
								'thumbnail' => esc_html__('Thumbnail only', 'photonic'),
								'counter' => esc_html__('Counts only', 'photonic'),
								'title,counter' => esc_html__('Title and counts', 'photonic'),
								'thumbnail,counter' => esc_html__('Thumbnail and counts', 'photonic'),
								'thumbnail,title' => esc_html__('Thumbnail and title', 'photonic'),
								'thumbnail,title,counter' => esc_html__('Thumbnail, title and counts', 'photonic'),
							),
						),
					),
					'L2' => array(
						'site_password' => array(
							'desc' => esc_html__('Site Password for password-protected sites', 'photonic'),
							'type' => 'text',
							'hint' => esc_html__('If you SmugMug site is password-protected you will need to provide the password to be able to show your photos.', 'photonic'),
						),
						'album_sort_order' => array(
							'desc' => esc_html__('Album sort order', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => $this->default_from_settings,
								'Last Updated (Descending)' => esc_html__('Last Updated (Descending)', 'photonic'),
								'Last Updated (Ascending)' => esc_html__('Last Updated (Ascending)', 'photonic'),
								'Date Added (Descending)' => esc_html__('Date Added (Descending)', 'photonic'),
								'Date Added (Ascending)' => esc_html__('Date Added (Ascending)', 'photonic'),
							),
						),
					),
					'L3' => array(
						'site_password' => array(
							'desc' => esc_html__('Site Password for password-protected sites', 'photonic'),
							'type' => 'text',
							'hint' => esc_html__('If you SmugMug site is password-protected you will need to provide the password to be able to show your photos.', 'photonic'),
						),
					),
					'main_size' => array(
						'desc' => esc_html__('Main image size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['smugmug']['main_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Main image size</em>'),
					),
					'video_size' => array(
						'desc' => esc_html__('Main video size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['smugmug']['video_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Video size</em>'),
					),
				),
				'zenfolio' => array(
					'L1' => array(
						'media' => array(
							'desc' => esc_html__('Media to Show', 'photonic'),
							'type' => 'select',
							'options' => Photonic::media_options(true, $photonic_zenfolio_media),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Media to show</em>'),
						),
						'caption' => array(
							'desc' => esc_html__('Photo titles and captions', 'photonic'),
							'type' => 'select',
							'options' => Photonic::title_caption_options(true, $photonic_zenfolio_title_caption),
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Photo titles and captions</em>'),
						),
						'sort_order' => array(
							'desc' => esc_html__('Search results sort order', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'Date' => esc_html__('Date', 'photonic'),
								'Popularity' => esc_html__('Popularity', 'photonic'),
								'Rank' => esc_html__('Rank (for searching by text only)', 'photonic'),
							),
						),
						'password' => array(
							'desc' => esc_html__('Password for password-protected album', 'photonic'),
							'type' => 'text',
							'req' => 1,
							'hint' => esc_html__('You are trying to display photos from a password-protected album. The password is mandatory for such an album.', 'photonic'),
							'conditions' => array('selection_passworded' => array('1')),
						),
					),
					'L2' => array(
						'sort_order' => array(
							'desc' => esc_html__('Search results sort order', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'Date' => esc_html__('Date', 'photonic'),
								'Popularity' => esc_html__('Popularity', 'photonic'),
								'Rank' => esc_html__('Rank (for searching by text only)', 'photonic'),
							),
						),
					),
					'L3' => array(
						'structure' => array(
							'desc' => esc_html__('Group / Hierarchy structure', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => '',
								'flat' => esc_html__('All photosets shown in single level', 'photonic'),
								'nested' => esc_html__('Photosets shown nested within groups', 'photonic'),
							),
							'hint' => sprintf(esc_html__('See examples %1$shere%2$s.', 'photonic'), '<a href="https://aquoid.com/plugins/photonic/zenfolio/group-hierarchy/" target="_blank">', '</a>'),
						),
						'headers' => array(
							'desc' => esc_html__('Show Group Header', 'photonic'),
							'type' => 'select',
							'options' => array(
								'' => $this->default_from_settings,
								'none' => esc_html__('No header', 'photonic'),
								'title' => esc_html__('Title only', 'photonic'),
								'counter' => esc_html__('Counts only', 'photonic'),
								'title,counter' => esc_html__('Title and counts', 'photonic'),
							),
						),
					),
					'main_size' => array(
						'desc' => esc_html__('Main image size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['zenfolio']['main_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Main image size</em>'),
					),
					'video_size' => array(
						'desc' => esc_html__('Main video size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['zenfolio']['video_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Video size</em>'),
					),
				),
				'instagram' => array(
					'media' => array(
						'desc' => esc_html__('Media to Show', 'photonic'),
						'type' => 'select',
						'options' => Photonic::media_options(true, $photonic_instagram_media),
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Instagram &rarr; Instagram Settings &rarr; Media to show</em>'),
					),
					'main_size' => array(
						'desc' => esc_html__('Main image size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['instagram']['main_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Instagram &rarr; Instagram Settings &rarr; Expanded size</em>'),
					),
					'video_size' => array(
						'desc' => esc_html__('Main video size', 'photonic'),
						'type' => 'select',
						'options' => $this->allowed_image_sizes['instagram']['video_size'],
						'std' => '',
						'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Instagram &rarr; Instagram Settings &rarr; Expanded video size</em>'),
					),
				),
				'slideshow' => array(
					'slideshow-style' => array(
						'desc' => esc_html__('Slideshow display style', 'photonic'),
						'type' => 'image-select',
						'options' => array(
							'strip-below' => esc_html__('Thumbnail strip or buttons below slideshow', 'photonic'),
							'strip-above' => esc_html__('Thumbnail strip above slideshow', 'photonic'),
							'strip-right' => esc_html__('Thumbnail strip to the right of slideshow', 'photonic'),
							'no-strip' => esc_html__('No thumbnails or buttons for the slideshow', 'photonic'),
						),
						'std' => $photonic_thumbnail_style,
					),
					'strip-style' => array(
						'desc' => esc_html__('Thumbnails or buttons for the strip?', 'photonic'),
						'type' => 'image-select',
						'options' => array(
							'thumbs' => esc_html__('Thumbnails', 'photonic'),
							'button' => esc_html__('Buttons', 'photonic'),
						),
						'hint' => esc_html__('If you choose "Buttons" those are only shown below the slideshow.', 'photonic'),
						'std' => 'thumbs',
					),
					'controls' => array(
						'desc' => esc_html__('Slideshow Controls', 'photonic'),
						'type' => 'select',
						'options' => array(
							'hide' => esc_html__('Hide', 'photonic'),
							'show' => esc_html__('Show', 'photonic'),
						),
						'hint' => esc_html__('Shows Previous and Next buttons on the slideshow.', 'photonic'),
					),
					'fx' => array(
						'desc' => esc_html__('Slideshow Effects', 'photonic'),
						'type' => 'select',
						'options' => array(
							'fade' => esc_html__('Fade', 'photonic'),
							'slide' => esc_html__('Slide', 'photonic'),
						),
						'hint' => esc_html__('Determines if a photo in a slideshow should fade in or slide in.', 'photonic')
					),
					'timeout' => array(
						'desc' => esc_html__('Time between slides in ms', 'photonic'),
						'type' => 'text',
						'std' => '',
						'hint' => esc_html__('Please enter numbers only', 'photonic')
					),
					'speed' => array(
						'desc' => esc_html__('Time for each transition in ms', 'photonic'),
						'type' => 'text',
						'std' => '',
						'hint' => esc_html__('How fast do you want the fade or slide effect to happen?', 'photonic')
					),
					'pause' => array(
						'desc' => esc_html__('Pause upon hover?', 'photonic'),
						'type' => 'select',
						'options' => array(
							'0' => esc_html__('No', 'photonic'),
							'1' => esc_html__('Yes', 'photonic'),
						),
						'hint' => esc_html__('Should the slideshow pause when you hover over it?', 'photonic')
					),
					'columns' => array(
						'desc' => esc_html__('Number of columns in slideshow', 'photonic'),
						'type' => 'select',
						'options' => array(
							'' => '',
							'1' => 1,
							'2' => 2,
							'3' => 3,
							'4' => 4,
							'5' => 5,
							'6' => 6,
							'7' => 7,
							'8' => 8,
							'9' => 9,
							'10' => 10,
						),
						'hint' => esc_html__('Pick > 1 for a carousel', 'photonic'),
					),
				),
				'square' => array(
					'columns' => $this->column_options,
					'flickr' => array(
						'thumb_size' => array(
							'desc' => esc_html__('Thumbnail size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['flickr']['thumb_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Thumbnail size</em>'),
						),
					),
					'google' => array(
						'thumb_size' => array(
							'desc' => esc_html__('Thumbnail size', 'photonic'),
							'type' => 'text',
							'hint' => esc_html__('Numeric values between 1 and 256, both inclusive.', 'photonic'),
							'std' => 150,
						),
						'crop_thumb' => array(
							'desc' => esc_html__('Crop Thumbnail', 'photonic'),
							'type' => 'select',
							'options' => array(
								'crop' => esc_html__('Crop the thumbnail', 'photonic'),
								'no-crop' => esc_html__('Do not crop the thumbnail', 'photonic'),
							),
							'std' => 'crop',
							'hint' => esc_html__('Cropping the thumbnail presents you with a square thumbnail.', 'photonic')
						),
					),
					'smugmug' => array(
						'thumb_size' => array(
							'desc' => esc_html__('Thumbnail size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['smugmug']['thumb_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Thumbnail size</em>'),
						),
					),
					'zenfolio' => array(
						'thumb_size' => array(
							'desc' => esc_html__('Thumbnail size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['zenfolio']['thumb_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Thumbnail size</em>'),
						),
					),
					'instagram' => array(
						'thumb_size' => array(
							'desc' => esc_html__('Thumbnail size', 'photonic'),
							'type' => 'text',
							'hint' => esc_html__('Numeric values only. Leave blank for default.', 'photonic'),
							'std' => 150,
						),
					),
					'wp' => array(
						'thumb_size' => array(
							'desc' => esc_html__('Thumbnail size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['wp']['thumb_size'],
							'std' => 'thumbnail',
						),
					),
					'title_position' => $this->get_title_position_options(),
				),
				'random' => array(
					'flickr' => array(
						'tile_size' => array(
							'desc' => esc_html__('Tile size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['flickr']['tile_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Flickr &rarr; Flickr Settings &rarr; Tile image size</em>'),
						),
					),
					'google' => array(
						'tile_size' => array(
							'desc' => esc_html__('Tile size', 'photonic'),
							'type' => 'text',
							'hint' => esc_html__('Numeric values between 1 and 16383, both inclusive. Leave blank to use the "Main image size".', 'photonic'),
						),
					),
					'smugmug' => array(
						'tile_size' => array(
							'desc' => esc_html__('Tile size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['smugmug']['tile_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Tile image size</em>'),
						),
					),
					'zenfolio' => array(
						'tile_size' => array(
							'desc' => esc_html__('Tile size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['zenfolio']['tile_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Zenfolio &rarr; Zenfolio Photo Settings &rarr; Tile image size</em>'),
						),
					),
					'instagram' => array(
						'tile_size' => array(
							'desc' => esc_html__('Tile size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['instagram']['tile_size'],
							'std' => '',
							'hint' => sprintf($this->default_under, '<em>Photonic &rarr; Settings &rarr; Instagram &rarr; Instagram Settings &rarr; Tile image size</em>'),
						),
					),
					'wp' => array(
						'tile_size' => array(
							'desc' => esc_html__('Tile size', 'photonic'),
							'type' => 'select',
							'options' => $this->allowed_image_sizes['wp']['tile_size'],
							'std' => 'full',
						),
					),
					'title_position' => $this->get_title_position_options(),
				),
				'L1' => array(
					'count' => array(
						'desc' => esc_html__('Number of photos to show', 'photonic'),
						'type' => 'text',
						'hint' => esc_html__('Numeric values only. Leave blank for default.', 'photonic'),
					),
					'more' => array(
						'desc' => esc_html__('"More" button text', 'photonic'),
						'type' => 'text',
						'hint' => esc_html__('Will show a "More" button with the specified text if the number of photos is higher than the above entry. Leave blank to show no button', 'photonic'),
					),
				),
				'L2' => array(
					'count' => array(
						'desc' => esc_html__('Number of albums to show', 'photonic'),
						'type' => 'text',
						'hint' => esc_html__('Numeric values only. Leave blank for default.', 'photonic'),
					),
					'more' => array(
						'desc' => esc_html__('"More" button text', 'photonic'),
						'type' => 'text',
						'hint' => esc_html__('Will show a "More" button with the specified text if the number of albums is higher than the above entry. Leave blank to show no button', 'photonic'),
					),
					'popup_type' => array(
						'type' => 'field_list',
						'list_type' => 'sequence',
						'list' => array(
							'popup' => array(
								'desc' => esc_html__('Show an overlaid popup panel', 'photonic'),
								'type' => 'select',
								'options' => array(
									'' => '',
									'hide' => esc_html__('No', 'photonic'),
									'show' => esc_html__('Yes', 'photonic'),
								),
								'std' => empty($photonic_enable_popup) ? 'hide' : 'show',
								'hint' => sprintf(esc_html__('Setting this to "No" would directly start up a lightbox with photos. Setting this to "Yes" would show an overlaid panel that has the photos. See %1$sdocumentation%2$s.', 'photonic'), '<a href="https://aquoid.com/plugins/photonic/layouts/#nested" target="_blank">', '</a>'),
							),
							'photo_count' => array(
								'desc' => esc_html__('Number of photos to show in overlaid popup', 'photonic'),
								'type' => 'text',
								'hint' => esc_html__('Numeric values only. Leave blank for default.', 'photonic'),
								'conditions' => array('popup' => array('show')),
							),
							'photo_more' => array(
								'desc' => esc_html__('"More" button text in overlaid popup', 'photonic'),
								'type' => 'text',
								'hint' => esc_html__('Will show a "More" button with the specified text if the number of photos in the overlaid popup is higher than the above entry. Leave blank to show no button', 'photonic'),
								'conditions' => array('popup' => array('show')),
							)
						)
					),
				),
				'L3' => array(),
			),
		);

		$this->flow_options['screen-5']['circle'] = $this->flow_options['screen-5']['square'];
		$this->flow_options['screen-5']['masonry'] = $this->flow_options['screen-5']['random'];
		$this->flow_options['screen-5']['masonry']['columns'] = $this->column_options;
		$this->flow_options['screen-5']['mosaic'] = $this->flow_options['screen-5']['random'];
		unset($this->flow_options['screen-5']['random']['title_position']['options']['below']);
		unset($this->flow_options['screen-5']['mosaic']['title_position']['options']['below']);
		$this->flow_options['screen-5']['L3']['popup_type'] = $this->flow_options['screen-5']['L2']['popup_type'];
	}

	private function get_zenfolio_categories() {
		$response = wp_remote_request('https://api.zenfolio.com/api/1.8/zfapi.asmx/GetCategories', array('sslverify' => PHOTONIC_SSL_VERIFY));
		$category_list = array('' => '');

		if (!is_wp_error($response)) {
			if (isset($response['response']) && isset($response['response']['code'])) {
				if ($response['response']['code'] == 200) {
					if (isset($response['body'])) {
						$response = simplexml_load_string($response['body']);
						if (!empty($response->Category)) {
							$categories = $response->Category;
							foreach ($categories as $category) {
								$category_list[esc_attr($category->Code)] = $category->DisplayName;
							}
						}
					}
				}
			}
		}
		asort($category_list);
		return $category_list;
	}

	private function set_allowed_image_sizes() {
		$this->allowed_image_sizes = array(
			'flickr' => array(
				'thumb_size' => array(
					'' => $this->default_from_settings,
					's' => esc_html__('Small square, 75x75px', 'photonic'),
					'q' => esc_html__('Large square, 150x150px', 'photonic'),
					't' => esc_html__('Thumbnail, 100px on longest side', 'photonic'),
					'm' => esc_html__('Small, 240px on longest side', 'photonic'),
					'n' => esc_html__('Small, 320px on longest side', 'photonic'),
				),
				'tile_size' => array(
					'' => $this->default_from_settings,
					'same' => esc_html__('Same as Main image size', 'photonic'),
					'n' => esc_html__('Small, 320px on longest side', 'photonic'),
					'none' => esc_html__('Medium, 500px on the longest side', 'photonic'),
					'z' => esc_html__('Medium, 640px on longest side', 'photonic'),
					'c' => esc_html__('Medium, 800px on longest side', 'photonic'),
					'b' => esc_html__('Large, 1024px on longest side', 'photonic'),
					'h' => esc_html__('Large, 1600px on longest side', 'photonic'),
					'k' => esc_html__('Large, 2048px on longest side', 'photonic'),
					'o' => esc_html__('Original', 'photonic'),
				),
				'main_size' => array(
					'' => $this->default_from_settings,
					'none' => esc_html__('Medium, 500px on the longest side', 'photonic'),
					'z' => esc_html__('Medium, 640px on longest side', 'photonic'),
					'c' => esc_html__('Medium, 800px on longest side', 'photonic'),
					'b' => esc_html__('Large, 1024px on longest side', 'photonic'),
					'h' => esc_html__('Large, 1600px on longest side', 'photonic'),
					'k' => esc_html__('Large, 2048px on longest side', 'photonic'),
					'o' => esc_html__('Original', 'photonic'),
				),
				'video_size' => array(
					'' => $this->default_from_settings,
					'Site MP4' => esc_html__('Site MP4', 'photonic'),
					'Mobile MP4' => esc_html__('Mobile MP4', 'photonic'),
					'HD MP4' => esc_html__('HD MP4', 'photonic'),
					'Video Original' => esc_html__('Video Original', 'photonic'),
				),
			),
			'smugmug' => array(
				'thumb_size' => array(
					'' => $this->default_from_settings,
					'Tiny' => esc_html__('Tiny', 'photonic'),
					'Thumb' => esc_html__('Thumb', 'photonic'),
					'Small' => esc_html__('Small', 'photonic'),
				),
				'tile_size' => array(
					'' => $this->default_from_settings,
					'same' => esc_html__('Same as Main image size', 'photonic'),
					'4K' => esc_html__('4K (not always available)', 'photonic'),
					'5K' => esc_html__('5K (not always available)', 'photonic'),
					'Medium' => esc_html__('Medium', 'photonic'),
					'Original' => esc_html__('Original (not always available)', 'photonic'),
					'Large' => esc_html__('Large', 'photonic'),
					'Largest' => esc_html__('Largest available', 'photonic'),
					'XLarge' => esc_html__('XLarge (not always available)', 'photonic'),
					'X2Large' => esc_html__('X2Large (not always available)', 'photonic'),
					'X3Large' => esc_html__('X3Large (not always available)', 'photonic'),
				),
				'main_size' => array(
					'' => $this->default_from_settings,
					'4K' => esc_html__('4K (not always available)', 'photonic'),
					'5K' => esc_html__('5K (not always available)', 'photonic'),
					'Medium' => esc_html__('Medium', 'photonic'),
					'Original' => esc_html__('Original (not always available)', 'photonic'),
					'Large' => esc_html__('Large', 'photonic'),
					'Largest' => esc_html__('Largest available', 'photonic'),
					'XLarge' => esc_html__('XLarge (not always available)', 'photonic'),
					'X2Large' => esc_html__('X2Large (not always available)', 'photonic'),
					'X3Large' => esc_html__('X3Large (not always available)', 'photonic'),
				),
				'video_size' => array(
					'' => $this->default_from_settings,
					'110' => esc_html__('110px along longest side', 'photonic'),
					'200' => esc_html__('200px along longest side', 'photonic'),
					'320' => esc_html__('320px along longest side', 'photonic'),
					'640' => esc_html__('640px along longest side', 'photonic'),
					'1280' => esc_html__('1280px along longest side', 'photonic'),
					'1920' => esc_html__('1920px along longest side', 'photonic'),
					'Largest' => esc_html__('Largest available', 'photonic'),
				),
			),
			'google' => array(
				'thumb_size' => array(
					'32' => '32',
					'48' => 48,
					'64' => 64,
					'72' => 72,
					'104' => 104,
					'144' => 144,
					'150' => 150,
					'160' => 160,
				),
				'tile_size' => array(
					'same' => esc_html__('Same as Main image size', 'photonic'),
					'94' => 94,
					'110' => 110,
					'128' => 128,
					'200' => 200,
					'220' => 220,
					'288' => 288,
					'320' => 320,
					'400' => 400,
					'512' => 512,
					'576' => 576,
					'640' => 640,
					'720' => 720,
					'800' => 800,
					'912' => 912,
					'1024' => 1024,
					'1152' => 1152,
					'1280' => 1280,
					'1440' => 1440,
					'1600' => 1600,
				),
				'main_size' => array(
					'94' => 94,
					'110' => 110,
					'128' => 128,
					'200' => 200,
					'220' => 220,
					'288' => 288,
					'320' => 320,
					'400' => 400,
					'512' => 512,
					'576' => 576,
					'640' => 640,
					'720' => 720,
					'800' => 800,
					'912' => 912,
					'1024' => 1024,
					'1152' => 1152,
					'1280' => 1280,
					'1440' => 1440,
					'1600' => 1600,
				),
			),
			'zenfolio' => array(
				'thumb_size' => array(
					'' => $this->default_from_settings,
					"1" => esc_html__("Square thumbnail, 60 &times; 60px, cropped square", 'photonic'),
					"0" => esc_html__("Small thumbnail, upto 80 &times; 80px", 'photonic'),
					"10" => esc_html__("Medium thumbnail, upto 120 &times; 120px", 'photonic'),
					"11" => esc_html__("Large thumbnail, upto 120 &times; 120px", 'photonic'),
					"2" => esc_html__("Small image, upto 400 &times; 400px", 'photonic'),
				),
				'tile_size' => array(
					'' => $this->default_from_settings,
					'same' => esc_html__('Same as Main image size', 'photonic'),
					'2' => esc_html__('Small image, upto 400 &times; 400px', 'photonic'),
					'3' => esc_html__('Medium image, upto 580 &times; 450px', 'photonic'),
					'4' => esc_html__('Large image, upto 800 &times; 630px', 'photonic'),
					'5' => esc_html__('X-Large image, upto 1100 &times; 850px', 'photonic'),
					'6' => esc_html__('XX-Large image, upto 1550 &times; 960px', 'photonic'),
				),
				'main_size' => array(
					'' => $this->default_from_settings,
					'2' => esc_html__('Small image, upto 400 &times; 400px', 'photonic'),
					'3' => esc_html__('Medium image, upto 580 &times; 450px', 'photonic'),
					'4' => esc_html__('Large image, upto 800 &times; 630px', 'photonic'),
					'5' => esc_html__('X-Large image, upto 1100 &times; 850px', 'photonic'),
					'6' => esc_html__('XX-Large image, upto 1550 &times; 960px', 'photonic'),
				),
				'video_size' => array(
					'' => $this->default_from_settings,
					'220' => esc_html__('360p resolution (MP4)', 'photonic'),
					'215' => esc_html__('480p resolution (MP4)', 'photonic'),
					'210' => esc_html__('720p resolution (MP4)', 'photonic'),
					'200' => esc_html__('1080p resolution (MP4)', 'photonic'),
				),
			),
			'instagram' => array(
				'main_size' => array(
					'' => $this->default_from_settings,
					'low_resolution' => esc_html__('Low Resolution - 306x306px, or 320x320px', 'photonic'),
					'standard_resolution' => esc_html__('Standard Resolution - 612x612px or 640x640px', 'photonic'),
					'largest' => esc_html__('Largest available resolution (640x640px for old images, upto 1080x1080px for new images)', 'photonic'),
				),
				'tile_size' => array(
					'' => $this->default_from_settings,
					'same' => esc_html__('Same as Main image size', 'photonic'),
					'low_resolution' => esc_html__('Low Resolution - 306x306px, or 320x320px', 'photonic'),
					'standard_resolution' => esc_html__('Standard Resolution - 612x612px or 640x640px', 'photonic'),
					'largest' => esc_html__('Largest available resolution (640x640px for old images, upto 1080x1080px for new images)', 'photonic'),
				),
				'video_size' => array(
					'' => $this->default_from_settings,
					'low_resolution' => esc_html__('Low Resolution', 'photonic'),
					'standard_resolution' => esc_html__('Standard Resolution', 'photonic'),
					'low_bandwidth' => esc_html__('Low Bandwidth', 'photonic'),
				),
			),
			'wp' => array(
				'thumb_size' => Photonic::get_wp_image_sizes(false, true),
				'tile_size' => Photonic::get_wp_image_sizes(true, true),
				'main_size' => Photonic::get_wp_image_sizes(true, true),
			),
		);

		global $photonic_flickr_thumb_size, $photonic_flickr_tile_size, $photonic_flickr_main_size, $photonic_flickr_video_size,
		       $photonic_smug_thumb_size, $photonic_smug_tile_size, $photonic_smug_main_size, $photonic_smug_video_size,
		       $photonic_zenfolio_thumb_size, $photonic_zenfolio_tile_size, $photonic_zenfolio_main_size, $photonic_zenfolio_video_size,
		       $photonic_instagram_main_size, $photonic_instagram_tile_size, $photonic_instagram_video_size;

		$this->allowed_image_sizes['flickr']['thumb_size'][''] .= ' - '.$this->allowed_image_sizes['flickr']['thumb_size'][$photonic_flickr_thumb_size];
		$this->allowed_image_sizes['flickr']['tile_size'][''] .= ' - '.$this->allowed_image_sizes['flickr']['tile_size'][$photonic_flickr_tile_size];
		$this->allowed_image_sizes['flickr']['main_size'][''] .= ' - '.$this->allowed_image_sizes['flickr']['main_size'][$photonic_flickr_main_size];
		$this->allowed_image_sizes['flickr']['video_size'][''] .= ' - '.$this->allowed_image_sizes['flickr']['video_size'][$photonic_flickr_video_size];

		$this->allowed_image_sizes['smugmug']['thumb_size'][''] .= ' - '.$this->allowed_image_sizes['smugmug']['thumb_size'][$photonic_smug_thumb_size];
		$this->allowed_image_sizes['smugmug']['tile_size'][''] .= ' - '.$this->allowed_image_sizes['smugmug']['tile_size'][$photonic_smug_tile_size];
		$this->allowed_image_sizes['smugmug']['main_size'][''] .= ' - '.$this->allowed_image_sizes['smugmug']['main_size'][$photonic_smug_main_size];
		$this->allowed_image_sizes['smugmug']['video_size'][''] .= ' - '.$this->allowed_image_sizes['smugmug']['video_size'][$photonic_smug_video_size];

		$this->allowed_image_sizes['zenfolio']['thumb_size'][''] .= ' - '.$this->allowed_image_sizes['zenfolio']['thumb_size'][$photonic_zenfolio_thumb_size];
		$this->allowed_image_sizes['zenfolio']['tile_size'][''] .= ' - '.$this->allowed_image_sizes['zenfolio']['tile_size'][$photonic_zenfolio_tile_size];
		$this->allowed_image_sizes['zenfolio']['main_size'][''] .= ' - '.$this->allowed_image_sizes['zenfolio']['main_size'][$photonic_zenfolio_main_size];
		$this->allowed_image_sizes['zenfolio']['video_size'][''] .= ' - '.$this->allowed_image_sizes['zenfolio']['video_size'][$photonic_zenfolio_video_size];

		$this->allowed_image_sizes['instagram']['main_size'][''] .= ' - '.$this->allowed_image_sizes['instagram']['main_size'][$photonic_instagram_main_size];
		$this->allowed_image_sizes['instagram']['tile_size'][''] .= ' - '.$this->allowed_image_sizes['instagram']['main_size'][$photonic_instagram_tile_size];
		$this->allowed_image_sizes['instagram']['video_size'][''] .= ' - '.$this->allowed_image_sizes['instagram']['video_size'][$photonic_instagram_video_size];
	}

	/**
	 * @return mixed
	 */
	public function get_flow_options() {
		return $this->flow_options;
	}

	/**
	 * @return array
	 */
	public function get_layout_options() {
		return $this->layout_options;
	}

	private function get_title_position_options() {
		$ret = array(
			'' => $this->default_from_settings,
			'regular' => esc_html__('Normal title display using the HTML "title" attribute', 'photonic'),
			'below' => esc_html__('Below the thumbnail', 'photonic'),
			'tooltip' => esc_html__('Using a JavaScript tooltip', 'photonic'),
			'hover-slideup-show' => esc_html__('Slide up from bottom upon hover', 'photonic'),
			'slideup-stick' => esc_html__('Cover the lower portion always', 'photonic'),
			'none' => esc_html__('No title', 'photonic'),
		);

		return array(
			'desc' => esc_html__('How do you want the title?', 'photonic'),
			'type' => 'select',
			'options' => $ret,
			'std' => '',
		);
	}
}
