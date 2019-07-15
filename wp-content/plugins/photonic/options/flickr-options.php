<?php
global $photonic_flickr_options;

$photonic_flickr_options = array(
	array('name' => "How To",
		'desc' => "Control generic settings for the plugin",
		'category' => 'flickr-how-to',
		'buttons' => 'no-buttons',
		'type' => 'section',),

	array('name' => "Creating a gallery",
		'desc' => "<strong>Please complete the setup steps in the \"Flickr Settings\" tab before attempting to create a gallery!</strong> <br/><br/>
			To create a gallery with Flickr content you can use either a <strong><em>Gutenberg Block</em></strong> 
			or the <em>Add / Edit Photonic Gallery</em> button in the <strong><em>Classic Editor</em></strong>:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-1.png' style='max-width: 600px;'/>",
		'grouping' => 'flickr-how-to',
		'type' => 'blurb',),

	array('name' => "Flickr settings",
		'desc' => "Control settings for Flickr",
		'category' => "flickr-settings",
		'type' => 'section',),

	array('name' => "Flickr API Key",
		'desc' => "To make use of the Flickr functionality you have to use your Flickr API Key.
					You can <a href='http://www.flickr.com/services/api/misc.api_keys.html'>obtain a key online</a> if you don't have one.
					Note that you are responsible for following all of the Flickr API's <a href='http://www.flickr.com/services/api/tos/'>Terms of Service</a>",
		'id' => "flickr_api_key",
		'grouping' => "flickr-settings",
		'type' => 'text'),

	array('name' => "Flickr API Secret",
		'desc' => "To make use of authenticated Flickr functionality you have to use your Flickr API secret.
					You can <a href='http://www.flickr.com/services/api/misc.api_keys.html'>obtain a key online</a> if you don't have one.
					Note that you are responsible for following all of the Flickr API's <a href='http://www.flickr.com/services/api/tos/'>Terms of Service</a>",
		'id' => "flickr_api_secret",
		'grouping' => "flickr-settings",
		'type' => 'text'),

	array('name' => "Allow User Login (for Front-end / Client-side Authentication)",
		'desc' => "Let visitors of your site login to Flickr to see private photos for which they have permissions (will show a login button if they are not logged in). This requires your visitors to have Flickr accounts themselves. See <a href='https://aquoid.com/plugins/photonic/authentication/'>here</a> for more.",
		'id' => "flickr_allow_oauth",
		'grouping' => "flickr-settings",
		'type' => 'checkbox'),

	array('name' => "Access Token (for Back-end / Server-side Authentication)",
		'desc' => "To get your token go to <em>Photonic &rarr; Authentication &rarr; Flickr</em>, and authenticate. Save the token you get here. <br/>If you have set
			up a token, your users can see protected Flickr photos without a Flickr account. See <a href='https://aquoid.com/plugins/photonic/authentication/'>here</a> for more.",
		'id' => "flickr_access_token",
		'grouping' => "flickr-settings",
		'type' => 'text'),

	array('name' => "Access Token Secret (for Back-end / Server-side Authentication)",
		'desc' => "To get your token secret go to <em>Photonic &rarr; Authentication &rarr; Flickr</em>, and authenticate. Save the token secret you get here. Your token secret works with the token set in the prvious option. See <a href='https://aquoid.com/plugins/photonic/authentication/'>here</a> for more.",
		'id' => "flickr_token_secret",
		'grouping' => "flickr-settings",
		'type' => 'text'),

	array('name' => "Login Box Text",
		'desc' => "If &ldquo;Allow User Login&rdquo; is enabled above, this is the text users will see before the login button (you can use HTML tags here)",
		'id' => "flickr_login_box",
		'grouping' => "flickr-settings",
		'type' => 'textarea'),

	array('name' => "Login Button Text",
		'desc' => "If &ldquo;Allow User Login&rdquo; is enabled above, this is the text users will see before the login button (you can use HTML tags other than &lt;a&gt; here)",
		'id' => "flickr_login_button",
		'grouping' => "flickr-settings",
		'type' => 'text'),

	array('name' => 'Default user',
		'desc' => 'If no user is specified in the shortcode this one will be used. <strong>Note that this is not the username from https://www.flickr.com/photos/<span style="text-decoration: underline">username</span>/</strong>, but you can get the user id from <em>Photonic &rarr; Helpers</em>.',
		'id' => 'flickr_default_user',
		'grouping' => 'flickr-settings',
		'type' => 'text'),

	array('name' => 'Media to show',
		'desc' => 'You can choose to include photos as well as videos in your output. This can be overridden by the <code>media</code> parameter in the shortcode:',
		'id' => "flickr_media",
		'grouping' => "flickr-settings",
		'type' => 'select',
		'options' => Photonic::media_options()),

	array('name' => "Thumbnail size",
		'desc' => "Flickr lets you display a thumbnail in the following sizes:",
		'id' => "flickr_thumb_size",
		'grouping' => "flickr-settings",
		'type' => 'select',
		'options' => array(
			"s" => "Small square, 75x75px",
			"q" => "Large square, 150x150px",
			"t" => "Thumbnail, 100px on longest side",
			"m" => "Small, 240px on longest side",
			"n" => "Small, 320px on longest side",
		)),

	array('name' => "Main image size",
		'desc' => "When you click on a thumbnail this size will be displayed if you are using a slideshow. If you are not using a slideshow you will be taken to the Flickr page:",
		'id' => "flickr_main_size",
		'grouping' => "flickr-settings",
		'type' => 'select',
		'options' => array(
			"none" => "Medium, 500px on the longest side",
			"z" => "Medium, 640px on longest side",
			"c" => "Medium, 800px on longest side",
			"b" => "Large, 1024px on longest side",
			"h" => "Large, 1600px on longest side",
			"k" => "Large, 2048px on longest side",
			"o" => "Original",
		)),

	array('name' => "Tile image size",
		'desc' => "<strong>This is applicable only if you are using the random tiled gallery, masonry or mosaic layouts.</strong> This size will be used as the image for the tiles. Picking a size smaller than the Main image size above will save bandwidth if your users <strong>don't click</strong> on individual images. Conversely, leaving this the same as the Main image size will save bandwidth if your users <strong>do click</strong> on individual images:",
		'id' => "flickr_tile_size",
		'grouping' => "flickr-settings",
		'type' => 'select',
		'options' => array(
			"same" => "Same as Main image size",
			"n" => "Small, 320px on longest side",
			"none" => "Medium, 500px on the longest side",
			"z" => "Medium, 640px on longest side",
			"c" => "Medium, 800px on longest side",
			"b" => "Large, 1024px on longest side",
			"h" => "Large, 1600px on longest side",
			"k" => "Large, 2048px on longest side",
			"o" => "Original",
		)),

	array('name' => "Video size",
		'desc' => "This is the video size that will be used for the lightbox:",
		'id' => "flickr_video_size",
		'grouping' => "flickr-settings",
		'type' => 'select',
		'options' => array(
			'Site MP4' => 'Site MP4',
			'Mobile MP4' => 'Mobile MP4',
			'HD MP4' => 'HD MP4',
			'Video Original' => 'Video Original',
		)),

	array('name' => "Disable lightbox linking",
		'desc' => "Check this to disable linking the photo title in the lightbox to the original photo page.",
		'id' => "flickr_disable_title_link",
		'grouping' => "flickr-settings",
		'type' => 'checkbox'),

	array('name' => "Photo titles and captions",
		'desc' => "What do you want to show as the photo title in the tooltip and lightbox?",
		'id' => "flickr_title_caption",
		'grouping' => "flickr-settings",
		'type' => 'select',
		'options' => Photonic::title_caption_options()),

	array('name' => "Collections",
		'desc' => "Control settings for Flickr collection thumbnails",
		'category' => "flickr-collections",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-5.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='flickr' user_id='abc' view='collections']</code> 
			or <code>[gallery type='flickr' user_id='abc' collection_id='xyz']</code>. They are used to control the collection's thumbnail display.",
		'grouping' => "flickr-collections",
		'type' => 'blurb',),

	array('name' => "Hide Empty Collection Details",
		'desc' => "This will hide the collection header if your collection has no sets. Nested collections will be displayed, however.",
		'id' => "flickr_hide_empty_collection_details",
		'grouping' => "flickr-collections",
		'type' => 'checkbox'),

	array('name' => "Hide Collection Thumbnail",
		'desc' => "This will hide the thumbnail that is auto-generated by Flickr for your collection.",
		'id' => "flickr_hide_collection_thumbnail",
		'grouping' => "flickr-collections",
		'type' => 'checkbox'),

	array('name' => "Hide Collection Title",
		'desc' => "This will hide the title for your Flickr collection.",
		'id' => "flickr_hide_collection_title",
		'grouping' => "flickr-collections",
		'type' => 'checkbox'),

	array('name' => "Hide Number of Sets",
		'desc' => "This will hide the number of Photosets / Albums in your Flickr collection.",
		'id' => "flickr_hide_collection_set_count",
		'grouping' => "flickr-collections",
		'type' => 'checkbox'),

	array('name' => "Photoset / Album Thumbnails (with other Photosets / Albums)",
		'desc' => "Control settings for Flickr Photoset thumbnails",
		'category' => "flickr-sets",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-3.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='flickr' user_id='abc' view='photosets']</code> or <code>[gallery type='flickr' user_id='abc' collection_id='xyz']</code> 
			or <code>[gallery type='flickr' user_id='abc' view='collections']</code>. They are used to control the Photoset's thumbnail display",
		'grouping' => "flickr-sets",
		'type' => 'blurb',),

	array('name' => "Photoset Title Display",
		'desc' => "How do you want the title of the Photoset?",
		'id' => "flickr_collection_set_title_display",
		'grouping' => "flickr-sets",
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Hide Photo Count in Title Display",
		'desc' => "This will hide the number of photos in your Photoset's title.",
		'id' => "flickr_hide_collection_set_photos_count_display",
		'grouping' => "flickr-sets",
		'type' => 'checkbox'),

	array('name' => "Constrain Photosets Per Row",
		'desc' => "How do you want the control the number of photoset thumbnails per row? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "flickr_collection_set_per_row_constraint",
		'grouping' => "flickr-sets",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "flickr_collection_set_constrain_by_padding",
		'grouping' => "flickr-sets",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "flickr_collection_set_constrain_by_count",
		'grouping' => "flickr-sets",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),

	array('name' => "Photoset / Album Headers (Standalone Photosets / Albums)",
		'desc' => "Control settings for Flickr Photosets when displayed in your page",
		'category' => "flickr-set",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-4.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='flickr' user_id='abc' photoset_id='xyz']</code> to show its contents on the page,
			 or if you use <code>[gallery type='flickr' user_id='abc' view='photosets']</code> and click on a thumbnail to open the included images in a popup.",
		'grouping' => "flickr-set",
		'type' => 'blurb',),

	array('name' => "Hide Header Thumbnail",
		'desc' => "This will hide the thumbnail in the header for your Flickr Photoset.",
		'id' => "flickr_hide_set_thumbnail",
		'grouping' => "flickr-set",
		'type' => 'checkbox'),

	array('name' => "Hide Header Title",
		'desc' => "This will hide the title in the header for your Flickr Photoset.",
		'id' => "flickr_hide_set_title",
		'grouping' => "flickr-set",
		'type' => 'checkbox'),

	array('name' => "Hide Number of Photos",
		'desc' => "This will hide the number of photos in the header in your Flickr Photoset.",
		'id' => "flickr_hide_set_photo_count",
		'grouping' => "flickr-set",
		'type' => 'checkbox'),

	array('name' => "Gallery Thumbnails (with other Galleries)",
		'desc' => "Control settings for Flickr Gallery thumbnails",
		'category' => "flickr-galleries",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-6.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='flickr' user_id='abc' view='galleries']</code>. They are used to control the Gallery's thumbnail display",
		'grouping' => "flickr-galleries",
		'type' => 'blurb',),

	array('name' => "Gallery Title Display",
		'desc' => "How do you want the title of the Gallery?",
		'id' => "flickr_gallery_title_display",
		'grouping' => "flickr-galleries",
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Hide Photo Count in Title Display",
		'desc' => "This will hide the number of photos in your Gallery's title.",
		'id' => "flickr_hide_gallery_photos_count_display",
		'grouping' => "flickr-galleries",
		'type' => 'checkbox'),

	array('name' => "Constrain Galleries Per Row",
		'desc' => "How do you want the control the number of gallery thumbnails per row? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "flickr_galleries_per_row_constraint",
		'grouping' => "flickr-galleries",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "flickr_galleries_constrain_by_padding",
		'grouping' => "flickr-galleries",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "flickr_galleries_constrain_by_count",
		'grouping' => "flickr-galleries",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),

	array('name' => "Gallery Headers (Standalone Galleries)",
		'desc' => "Control settings for Flickr Galleries when displayed in your page",
		'category' => "flickr-gallery",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-7.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='flickr' user_id='abc' gallery_id='xyz']</code> to show its contents on the page, or if you use <code>[gallery type='flickr' user_id='abc' view='galleries']</code> and click on a thumbnail to open the included images in a popup.",
		'grouping' => "flickr-gallery",
		'type' => 'blurb',),

	array('name' => "Hide Header Thumbnail",
		'desc' => "This will hide the thumbnail in the header for your Flickr Gallery.",
		'id' => "flickr_hide_gallery_thumbnail",
		'grouping' => "flickr-gallery",
		'type' => 'checkbox'),

	array('name' => "Hide Header Title",
		'desc' => "This will hide the title in the header for your Flickr Gallery.",
		'id' => "flickr_hide_gallery_title",
		'grouping' => "flickr-gallery",
		'type' => 'checkbox'),

	array('name' => "Hide Number of Photos",
		'desc' => "This will hide the number of photos in the header in your Flickr Gallery.",
		'id' => "flickr_hide_gallery_photo_count",
		'grouping' => "flickr-gallery",
		'type' => 'checkbox'),

	array('name' => "Photos (Main Page)",
		'desc' => "Control settings for Flickr Photos when displayed in your page",
		'category' => "flickr-photos",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/Flickr-2.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='flickr' user_id='abc' photoset_id='xyz']</code> 
			or <code>[gallery type='flickr' user_id='abc' view='photos']</code>. In other words, the photos are printed directly on the page.",
		'grouping' => "flickr-photos",
		'type' => 'blurb',),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "flickr_photo_title_display",
		'grouping' => "flickr-photos",
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "flickr_photos_per_row_constraint",
		'grouping' => "flickr-photos",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "flickr_photos_constrain_by_padding",
		'grouping' => "flickr-photos",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "flickr_photos_constrain_by_count",
		'grouping' => "flickr-photos",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),

	array('name' => "Photos (Overlaid Popup Panel)",
		'desc' => "Control settings for Flickr Photos when displayed in a popup",
		'category' => "flickr-photos-pop",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you click on a Photoset thumbnail to launch an overlaid gallery. In other words, the photos are printed directly on a popup.",
		'grouping' => "flickr-photos-pop",
		'type' => 'blurb',),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "flickr_photo_pop_title_display",
		'grouping' => "flickr-photos-pop",
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "flickr_photos_pop_per_row_constraint",
		'grouping' => "flickr-photos-pop",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "flickr_photos_pop_constrain_by_padding",
		'grouping' => "flickr-photos-pop",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "flickr_photos_pop_constrain_by_count",
		'grouping' => "flickr-photos-pop",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),
);
