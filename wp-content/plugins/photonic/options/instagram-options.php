<?php
global $photonic_instagram_options;

$photonic_instagram_options = array(
	array('name' => "Instagram settings",
		'desc' => "Control settings for Instagram",
		'category' => "instagram-settings",
		'type' => 'section',),

	array('name' => "Instagram Access Token",
		'desc' => "Enter your Instagram Access Token. You can get this from <em>Photonic &rarr; Authentication</em> by clicking on <em>Login and get Access Token</em>",
		'id' => "instagram_access_token",
		'grouping' => "instagram-settings",
		'type' => 'text'),

	array('name' => 'Media to show',
		'desc' => 'You can choose to include photos as well as videos in your output. This can be overridden by the <code>media</code> parameter in the shortcode:',
		'id' => "instagram_media",
		'grouping' => "instagram-settings",
		'type' => 'select',
		'options' => Photonic::media_options()),

	array('name' => "Disable lightbox linking",
		'desc' => "Check this to disable linking the photo title in the lightbox to the original photo page.",
		'id' => "instagram_disable_title_link",
		'grouping' => "instagram-settings",
		'type' => 'checkbox'),

	array('name' => "Expanded size",
		'desc' => "Image size to show when you click on a thumbnail:",
		'id' => "instagram_main_size",
		'grouping' => "instagram-settings",
		'type' => 'select',
		'options' => array("low_resolution" => "Low Resolution - 306x306px, or 320x320px", "standard_resolution" => "Standard Resolution - 612x612px or 640x640px", 'largest' => 'Largest available resolution (640x640px for old images, upto 1080x1080px for new images)', )),

	array('name' => "Expanded video size",
		'desc' => "Video size to show when you click on a thumbnail:",
		'id' => "instagram_video_size",
		'grouping' => "instagram-settings",
		'type' => 'select',
		'options' => array("low_resolution" => "Low Resolution", "standard_resolution" => "Standard Resolution", 'low_bandwidth' => 'Low Bandwidth')),

	array('name' => "Tile image size",
		'desc' => "<strong>This is applicable only if you are using the random tiled gallery, masonry or mosaic layouts.</strong> This size will be used as the image for the tiles. Picking a size smaller than the Main image size above will save bandwidth if your users <strong>don't click</strong> on individual images. Conversely, leaving this the same as the Main image size will save bandwidth if your users <strong>do click</strong> on individual images:",
		'id' => "instagram_tile_size",
		'grouping' => "instagram-settings",
		'type' => 'select',
		'options' => array("same" => "Same as Main image size", "low_resolution" => "Low Resolution - 306x306px, or 320x320px", "standard_resolution" => "Standard Resolution - 612x612px or 640x640px", 'largest' => 'Largest available resolution (640x640px for old images, upto 1080x1080px for new images)', )),

	array('name' => "Title Display",
		'desc' => "How do you want the title of the photo thumbnail?",
		'id' => "instagram_photo_title_display",
		'grouping' => "instagram-settings",
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "instagram_photos_per_row_constraint",
		'grouping' => "instagram-settings",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "instagram_photos_constrain_by_padding",
		'grouping' => "instagram-settings",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "instagram_photos_constrain_by_count",
		'grouping' => "instagram-settings",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),
);