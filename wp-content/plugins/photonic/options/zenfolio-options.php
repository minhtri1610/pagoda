<?php
global $photonic_zenfolio_options;

$photonic_zenfolio_options = array(
	array('name' => "Zenfolio Photo Settings",
		'desc' => "Control settings for Zenfolio",
		'category' => 'zenfolio-settings',
		'type' => 'section',),

	array('name' => 'Default user',
		'desc' => 'If no user is specified in the shortcode this one will be used. This is the username from https://<span style="text-decoration: underline">username</span>.zenfolio.com/',
		'id' => 'zenfolio_default_user',
		'grouping' => 'zenfolio-settings',
		'type' => 'text'
	),

	array('name' => 'Media to show',
		'desc' => 'You can choose to include photos as well as videos in your output. This can be overridden by the <code>media</code> parameter in the shortcode:',
		'id' => "zenfolio_media",
		'grouping' => "zenfolio-settings",
		'type' => 'select',
		'options' => Photonic::media_options()
	),

	array('name' => "Disable lightbox linking",
		'desc' => "Check this to disable linking the photo title in the lightbox to the original photo page.",
		'id' => "zenfolio_disable_title_link",
		'grouping' => 'zenfolio-settings',
		'type' => 'checkbox'
	),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "zenfolio_photos_per_row_constraint",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)
	),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "zenfolio_photos_constrain_by_padding",
		'grouping' => 'zenfolio-settings',
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."
	),

	array('name' => "Constrain by number of thumbnails",
		'desc' => "If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "zenfolio_photos_constrain_by_count",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)
	),

	array('name' => "Thumbnail size",
		'desc' => "What size should a thumbnail be shown in if no size is specified? Zenfolio lets you display a thumbnail in the following sizes:",
		'id' => "zenfolio_thumb_size",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => array(
			"0" => "Small thumbnail, upto 80 x 80px",
			"1" => "Square thumbnail, 60 x 60px, cropped square",
			"10" => "Medium thumbnail, upto 120 x 120px",
			"11" => "Large thumbnail, upto 120 x 120px",
			"2" => "Small image, upto 400 x 400px",
		)
	),

	array('name' => "Main image size",
		'desc' => "Show this size for the image in the lightbox:",
		'id' => "zenfolio_main_size",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => array(
			"2" => "Small image, upto 400 x 400px",
			"3" => "Medium image, upto 580 x 450px",
			"4" => "Large image, upto 800 x 630px",
			"5" => "X-Large image, upto 1100 x 850px",
			"6" => "XX-Large image, upto 1550 x 960px",
		)
	),

	array('name' => "Tile image size",
		'desc' => "<strong>This is applicable only if you are using the random tiled gallery, masonry or mosaic layouts.</strong> This size will be used as the image for the tiles. Picking a size smaller than the Main image size above will save bandwidth if your users <strong>don't click</strong> on individual images. Conversely, leaving this the same as the Main image size will save bandwidth if your users <strong>do click</strong> on individual images:",
		'id' => "zenfolio_tile_size",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => array(
			"same" => "Same as Main image size",
			"2" => "Small image, upto 400 x 400px",
			"3" => "Medium image, upto 580 x 450px",
			"4" => "Large image, upto 800 x 630px",
			"5" => "X-Large image, upto 1100 x 850px",
			"6" => "XX-Large image, upto 1550 x 960px",
		)
	),

	array('name' => 'Video size',
		'desc' => 'Show this size for the video in the lightbox:',
		'id' => "zenfolio_video_size",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => array(
			'220' => "360p resolution (MP4)",
			'215' => "480p resolution (MP4)",
			'210' => "720p resolution (MP4)",
			'200' => "1080p resolution (MP4)",
		)
	),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "zenfolio_photo_title_display",
		'grouping' => 'zenfolio-settings',
		'type' => "radio",
		'options' => photonic_title_styles()
	),

	array('name' => "Photo titles and captions",
		'desc' => "What do you want to show as the photo title in the tooltip and lightbox?",
		'id' => "zenfolio_title_caption",
		'grouping' => 'zenfolio-settings',
		'type' => 'select',
		'options' => Photonic::title_caption_options()
	),

	array('name' => "Zenfolio Groups",
		'desc' => "Control settings for Zenfolio Groups",
		'category' => 'zenfolio-groups',
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you use the shortcode format <code>[gallery type='zenfolio' view='hierarchy' ...]</code> or <code>[gallery type='zenfolio' view='group' ...]</code>. They are used to control the Photoset's thumbnail display",
		'grouping' => 'zenfolio-groups',
		'type' => "blurb",),

	array('name' => "Exclude Empty Groups",
		'desc' => "Do not show groups whose immediate children photosets have no photos.",
		'id' => "zenfolio_hide_empty_groups",
		'grouping' => 'zenfolio-groups',
		'type' => 'checkbox'
	),

	array('name' => "Hide Group Title",
		'desc' => "This will hide the title for your Zenfolio Group.",
		'id' => "zenfolio_hide_group_title",
		'grouping' => 'zenfolio-groups',
		'type' => 'checkbox'
	),

	array('name' => "Link to Zenfolio",
		'desc' => "Link the group title (if shown) to the Zenfolio group page",
		'id' => "zenfolio_link_group_page",
		'grouping' => 'zenfolio-groups',
		'type' => 'checkbox'
	),

	array('name' => "Hide Number of Photos, if available",
		'desc' => "This will hide the number of photos in your Zenfolio Group.",
		'id' => "zenfolio_hide_group_photo_count",
		'grouping' => 'zenfolio-groups',
		'type' => 'checkbox'
	),

	array('name' => "Hide Number of Sub-Groups, if available",
		'desc' => "This will hide the number of sub-groups in your Zenfolio Group.",
		'id' => "zenfolio_hide_group_group_count",
		'grouping' => 'zenfolio-groups',
		'type' => 'checkbox'
	),

	array('name' => "Hide Number of Photosets, if available",
		'desc' => "This will hide the number of photosets in your Zenfolio Group.",
		'id' => "zenfolio_hide_group_set_count",
		'grouping' => 'zenfolio-groups',
		'type' => 'checkbox'
	),

	array('name' => "Zenfolio Photoset Thumbnails (with other Photosets)",
		'desc' => "Control settings for Zenfolio Photoset thumbnails",
		'category' => 'zenfolio-sets',
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you use the shortcode format <code>[gallery type='zenfolio' view='photosets' ...]</code>. They are used to control the Photoset's thumbnail display",
		'grouping' => 'zenfolio-sets',
		'type' => "blurb",),

	array('name' => "Photoset Title Display",
		'desc' => "How do you want the title of the Photoset?",
		'id' => "zenfolio_set_title_display",
		'grouping' => 'zenfolio-sets',
		'type' => "radio",
		'options' => photonic_title_styles()
	),

	array('name' => "Hide Photo Count in Title Display",
		'desc' => "This will hide the number of photos in your Photoset's title.",
		'id' => "zenfolio_hide_set_photos_count_display",
		'grouping' => 'zenfolio-sets',
		'type' => 'checkbox'
	),

	array('name' => "Hide thumbnails for Password-protected sets",
		'desc' => "This will hide the thumbnail of password-protected photosets (Password-protected sets are not currently supported, so it is advisable to hide the thumbnails).",
		'id' => "zenfolio_hide_password_protected_thumbnail",
		'grouping' => 'zenfolio-sets',
		'type' => 'checkbox'
	),

	array('name' => "Constrain Photosets Per Row",
		'desc' => "How do you want the control the number of photoset thumbnails per row? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "zenfolio_sets_per_row_constraint",
		'grouping' => 'zenfolio-sets',
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)
	),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "zenfolio_sets_constrain_by_padding",
		'grouping' => 'zenfolio-sets',
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."
	),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "zenfolio_sets_constrain_by_count",
		'grouping' => 'zenfolio-sets',
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)
	),

	array('name' => "Zenfolio Photoset Header Thumbnails",
		'desc' => "Control settings for Zenfolio Photosets when displayed in your page",
		'category' => 'zenfolio-set',
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you use the shortcode format <code>[gallery type='zenfolio' view='photosets' ...]</code>. In other words, the gallery output for the Photoset is directly on the page, or in a popup and you want to control your Photoset's thumbnail.",
		'grouping' => 'zenfolio-set',
		'type' => "blurb",),

	array('name' => "Hide Photoset Thumbnail",
		'desc' => "This will hide the thumbnail for your Zenfolio Photoset.",
		'id' => "zenfolio_hide_set_thumbnail",
		'grouping' => 'zenfolio-set',
		'type' => 'checkbox'
	),

	array('name' => "Hide Photoset Title",
		'desc' => "This will hide the title for your Zenfolio Photoset.",
		'id' => "zenfolio_hide_set_title",
		'grouping' => 'zenfolio-set',
		'type' => 'checkbox'
	),

	array('name' => "Link to Zenfolio",
		'desc' => "Link the set thumbnail and title (if shown) to the Zenfolio set page",
		'id' => "zenfolio_link_set_page",
		'grouping' => 'zenfolio-set',
		'type' => 'checkbox'
	),

	array('name' => "Hide Number of Photos",
		'desc' => "This will hide the number of photos in your Zenfolio Photoset.",
		'id' => "zenfolio_hide_set_photo_count",
		'grouping' => 'zenfolio-set',
		'type' => 'checkbox'
	),
);
