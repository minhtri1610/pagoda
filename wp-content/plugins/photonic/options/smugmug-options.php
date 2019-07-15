<?php
global $photonic_smugmug_options;

$photonic_smugmug_options = array(
	array('name' => "How To",
		'desc' => "Control generic settings for the plugin",
		'category' => 'smug-how-to',
		'buttons' => 'no-buttons',
		'type' => 'section',),

	array('name' => "Creating a gallery",
		'desc' => "To create a gallery with SmugMug content you can use either a <strong><em>Gutenberg Block</em></strong> 
			or the <em>Add / Edit Photonic Gallery</em> button in the <strong><em>Classic Editor</em></strong>:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/SmugMug-1.png' style='max-width: 600px;'/>",
		'grouping' => 'smug-how-to',
		'type' => 'blurb',),

	array('name' => "SmugMug settings",
		'desc' => "Control settings for SmugMug",
		'category' => 'smug-settings',
		'type' => 'section',),

	array('name' => "SmugMug API Key",
		'desc' => "<strong>With effect from Photonic version 2.19 a SmugMug API key is not required unless you want to show private albums using authentication.</strong><br/>
			To make use of the SmugMug functionality you have to use your <a href='https://api.smugmug.com/api/developer/apply'>SmugMug API Key</a>.<br/>
			When you are setting up your API Key, only if you are selecting the option to <strong>\"Allow User Login\"</strong> below, make sure that you add <code>".site_url()."</code> as your Callback URL.
			<strong>Without that the your visitors cannot authenticate.</strong> <br/>
			If you are not allowing user login, <strong>please set the Callback URL to blank</strong>.<br/>
			See <a href='https://aquoid.com/plugins/photonic/smugmug/#api-key'>here</a> for help.",
		'id' => "smug_api_key",
		'grouping' => 'smug-settings',
		'type' => 'text'
	),

	array('name' => "SmugMug API Secret",
		'desc' => "You have to enter the Secret provided by SmugMug after you have registered your application.",
		'id' => "smug_api_secret",
		'grouping' => 'smug-settings',
		'type' => 'text'
	),

	array('name' => "Allow User Login (for Front-end / Client-side Authentication)",
		'desc' => "Let visitors of your site login to SmugMug to see private photos for which they have permissions (will show a login button if they are not logged in). This requires your visitors to have SmugMug accounts themselves. See <a href='https://aquoid.com/plugins/photonic/authentication/'>here</a> for more.",
		'id' => "smug_allow_oauth",
		'grouping' => 'smug-settings',
		'type' => 'checkbox'
	),

	array('name' => "Access Token (for Back-end / Server-side Authentication)",
		'desc' => "To get your token go to <em>Photonic &rarr; Authentication &rarr; SmugMug</em>, and authenticate. Save the token you get here. <br/>If you have set
			up a token, your users can see protected SmugMug photos without a SmugMug account. See <a href='https://aquoid.com/plugins/photonic/authentication/'>here</a> for more.",
		'id' => "smug_access_token",
		'grouping' => 'smug-settings',
		'type' => 'text'
	),

	array('name' => "Access Token Secret (for Back-end / Server-side Authentication)",
		'desc' => "To get your token secret go to <em>Photonic &rarr; Authentication &rarr; SmugMug</em>, and authenticate. Save the token secret you get here. Your token secret works with the token set in the prvious option. See <a href='https://aquoid.com/plugins/photonic/authentication/'>here</a> for more.",
		'id' => "smug_token_secret",
		'grouping' => 'smug-settings',
		'type' => 'text'
	),

	array('name' => "Login Box Text",
		'desc' => "If &ldquo;Allow User Login&rdquo; is enabled, this is the text users will see before the login button (you can use HTML tags here)",
		'id' => "smug_login_box",
		'grouping' => 'smug-settings',
		'type' => 'textarea'
	),

	array('name' => "Login Button Text",
		'desc' => "If &ldquo;Allow User Login&rdquo; is enabled, this is the text users will see before the login button (you can use HTML tags other than &lt;a&gt; here)",
		'id' => "smug_login_button",
		'grouping' => 'smug-settings',
		'type' => 'text'
	),

	array('name' => 'Default user',
		'desc' => 'If no user is specified in the shortcode this one will be used. This is the username from https://<span style="text-decoration: underline">username</span>.smugmug.com/',
		'id' => 'smug_default_user',
		'grouping' => 'smug-settings',
		'type' => 'text'
	),

	array('name' => 'Media to show',
		'desc' => 'You can choose to include photos as well as videos in your output. This can be overridden by the <code>media</code> parameter in the shortcode:',
		'id' => "smug_media",
		'grouping' => 'smug-settings',
		'type' => 'select',
		'options' => Photonic::media_options()
	),

	array('name' => "Thumbnail size",
		'desc' => "Pick a standard size provided by SmugMug for your thumbnails:",
		'id' => "smug_thumb_size",
		'grouping' => 'smug-settings',
		'type' => 'select',
		'options' => array("Tiny" => "Tiny", "Thumb" => "Thumb", "Small" => "Small")
	),

	array('name' => "Main image size",
		'desc' => "When you click on a thumbnail this size will be displayed if you are using a slideshow. If you are not using a slideshow you will be taken to the SmugMug page:",
		'id' => "smug_main_size",
		'grouping' => 'smug-settings',
		'type' => 'select',
		'options' => array(
			'4K' => '4K (not always available)',
			'5K' => '5K (not always available)',
			"Medium" => "Medium",
			"Original" => "Original (not always available)",
			"Large" => "Large",
			'Largest' => 'Largest',
			"XLarge" => "XLarge (not always available)",
			"X2Large" => "X2Large (not always available)",
			"X3Large" => "X3Large (not always available)",
		)
	),

	array('name' => "Tile image size",
		'desc' => "<strong>This is applicable only if you are using the random tiled gallery, masonry or mosaic layouts.</strong> This size will be used as the image for the tiles. Picking a size smaller than the Main image size above will save bandwidth if your users <strong>don't click</strong> on individual images. Conversely, leaving this the same as the Main image size will save bandwidth if your users <strong>do click</strong> on individual images:",
		'id' => "smug_tile_size",
		'grouping' => 'smug-settings',
		'type' => 'select',
		'options' => array(
			"same" => "Same as Main image size",
			"Small" => "Small",
			'4K' => '4K (not always available)',
			'5K' => '5K (not always available)',
			"Medium" => "Medium",
			"Original" => "Original (not always available)",
			"Large" => "Large",
			'Largest' => 'Largest',
			"XLarge" => "XLarge (not always available)",
			"X2Large" => "X2Large (not always available)",
			"X3Large" => "X3Large (not always available)",
		)
	),

	array('name' => "Video size",
		'desc' => "When you click on a thumbnail this size will be displayed if you are using a slideshow. If you are not using a slideshow you will be taken to the SmugMug page:",
		'id' => "smug_video_size",
		'grouping' => 'smug-settings',
		'type' => 'select',
		'options' => array(
			'110' => '110px along longest side',
			'200' => '200px along longest side',
			'320' => '320px along longest side',
			'640' => '640px along longest side',
			'1280' => '1280px along longest side',
			'1920' => '1920px along longest side',
			'Largest' => 'Largest',
		)
	),

	array('name' => "Disable lightbox linking",
		'desc' => "Check this to disable linking the album title and/or thumbnail, or the title in the lightbox to the SmugMug page for the album / photo.",
		'id' => "smug_disable_title_link",
		'grouping' => 'smug-settings',
		'type' => 'checkbox'
	),

	array('name' => "Show \"Buy\" link",
		'desc' => "Click to show a link to purchase the photo. This shows up in a lightbox, enabled.",
		'id' => "smug_show_buy_link",
		'grouping' => 'smug-settings',
		'type' => 'checkbox'
	),

	array('name' => "Photo titles and captions",
		'desc' => "What do you want to show as the photo title in the tooltip and lightbox?",
		'id' => "smug_title_caption",
		'grouping' => 'smug-settings',
		'type' => 'select',
		'options' => Photonic::title_caption_options()
	),

	array('name' => "Album Thumbnails (with other Albums)",
		'desc' => "Control settings for SmugMug Album thumbnails",
		'category' => "smug-albums",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/SmugMug-2.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='smugmug' nick_name='abc']</code> or 
			<code>[gallery type='smugmug' nick_name='abc' view='albums']</code> or <code>[gallery type='smugmug' nick_name='abc' view='tree']</code>. 
			They are used to control the Album's thumbnail display",
		'grouping' => "smug-albums",
		'type' => 'blurb',),

	array('name' => "Album Title Display",
		'desc' => "How do you want the title of the Album?",
		'id' => "smug_albums_album_title_display",
		'grouping' => "smug-albums",
		'type' => 'radio',
		'options' => photonic_title_styles()
	),

	array('name' => "Hide Photo Count in Title Display",
		'desc' => "This will hide the number of photos in your Album's title.",
		'id' => "smug_hide_albums_album_photos_count_display",
		'grouping' => "smug-albums",
		'type' => 'checkbox'
	),

	array('name' => "Hide thumbnails for Password-protected albums",
		'desc' => "This will hide the thumbnail of password-protected albums.",
		'id' => "smug_hide_password_protected_thumbnail",
		'grouping' => "smug-albums",
		'type' => 'checkbox'
	),

	array('name' => 'Album sort order',
		'desc' => 'What should the results be sorted by?',
		'id' => 'smug_album_sort_order',
		'grouping' => 'smug-albums',
		'type' => 'select',
		'options' => array(
			'Last Updated (Descending)' => 'Last Updated (Descending)',
			'Last Updated (Ascending)' => 'Last Updated (Ascending)',
			'Date Added (Descending)' => 'Date Added (Descending)',
			'Date Added (Ascending)' => 'Date Added (Ascending)',
		)
	),

	array('name' => "Constrain Albums Per Row",
		'desc' => "How do you want the control the number of album thumbnails per row? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "smug_albums_album_per_row_constraint",
		'grouping' => "smug-albums",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)
	),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "smug_albums_album_constrain_by_padding",
		'grouping' => "smug-albums",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."
	),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "smug_albums_album_constrain_by_count",
		'grouping' => "smug-albums",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)
	),

	array('name' => "Photos (Main Page)",
		'desc' => "Control settings for SmugMug Photos when displayed in your page",
		'category' => "smug-photos",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you pick the following gallery creation options:<br/><br/>
			<img src='".PHOTONIC_URL."/options/screenshots/SmugMug-3.png' style='max-width: 600px;'/><br/><br/>
			If you are using the shortcode, the settings kick in for <code>[gallery type='smugmug' nick_name='abc' view='album' album='pqr']</code>
			or <code>[gallery type='smugmug' nick_name='abc' view='images' album='pqr']</code>. In other words, the photos are printed directly on the page.",
		'grouping' => "smug-photos",
		'type' => 'blurb',),

	array('name' => "Hide Album Thumbnail",
		'desc' => "This will hide the thumbnail for your SmugMug Album.",
		'id' => "smug_hide_album_thumbnail",
		'grouping' => "smug-photos",
		'type' => 'checkbox'
	),

	array('name' => "Hide Album Title",
		'desc' => "This will hide the title for your SmugMug Album.",
		'id' => "smug_hide_album_title",
		'grouping' => "smug-photos",
		'type' => 'checkbox'
	),

	array('name' => "Hide Number of Photos",
		'desc' => "This will hide the number of photos in your SmugMug Album.",
		'id' => "smug_hide_album_photo_count",
		'grouping' => "smug-photos",
		'type' => 'checkbox'
	),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "smug_photo_title_display",
		'grouping' => "smug-photos",
		'type' => 'radio',
		'options' => photonic_title_styles()
	),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "smug_photos_per_row_constraint",
		'grouping' => "smug-photos",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)
	),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "smug_photos_constrain_by_padding",
		'grouping' => "smug-photos",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."
	),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "smug_photos_constrain_by_count",
		'grouping' => "smug-photos",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)
	),

	array('name' => "Photos (Popup Panel)",
		'desc' => "Control settings for SmugMug Photos when displayed in a popup",
		'category' => "smug-photos-pop",
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you use the shortcode format <code>[gallery type='smugmug' nick_name='abc' view='albums']</code>, and you click on an album thumbnail to open its photos in an overlaid panel.",
		'grouping' => "smug-photos-pop",
		'type' => 'blurb',),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "smug_photo_pop_title_display",
		'grouping' => "smug-photos-pop",
		'type' => 'radio',
		'options' => photonic_title_styles()
	),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "smug_photos_pop_per_row_constraint",
		'grouping' => "smug-photos-pop",
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)
	),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "smug_photos_pop_constrain_by_padding",
		'grouping' => "smug-photos-pop",
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."
	),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "smug_photos_pop_constrain_by_count",
		'grouping' => "smug-photos-pop",
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)
	),
);
