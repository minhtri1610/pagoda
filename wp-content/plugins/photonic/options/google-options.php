<?php

global $photonic_google_options;

$photonic_google_options = array(
	array('name' => 'Google Photos settings',
		'desc' => 'Control settings for Google Photos',
		'category' => 'google-settings',
		'type' => 'section',),

/*	array('name' => 'Use own Google Client ID?',
		'desc' => "Photonic can perform authentication with its own Client ID. Select this option if you want to use your own Client ID instead. 
			Creating a Google Client ID can take at least 15-30 minutes, but can save you from potential API quota issues if too many people start using Photonic's ID.
			<strong>Note that if you have already defined a Client ID and Secret below they will be used regardless of this option.</strong> 
			",
		'id' => "google_google_use_own_keys",
		'grouping' => 'google-settings',
		'type' => 'checkbox'),*/

	array('name' => 'Google Client ID',
		'desc' => "Enter your Google Client ID. You can get / create one from Google's <a href='https://console.developers.google.com/apis/'>API Manager</a>.
			The <a href='https://aquoid.com/plugins/photonic/google-photos/#api-key'>documentation page</a> can help you with further instructions.
			If you have previously obtained a Client ID for Picasa you can use that here, provided you follow the additional instructions in the documentation.
			<ol>
				<li>Use the option for 'OAuth Client ID', and subsequently pick 'Web applications'.</li>
				<li>Make sure that you add these as your Redirect URIs:
					<ol>
						<li>".site_url()."</li>
						<li>".admin_url('admin.php?page=photonic-auth&source=google')."</li>
					</ol>
				<strong>Without the above your authentication will not work.</strong>
				</li>
			</ol>",
		'id' => 'google_client_id',
		'grouping' => 'google-settings',
		'type' => 'text'),

	array('name' => 'Google Client Secret',
		'desc' => "Enter your Google Client Secret.",
		'id' => 'google_client_secret',
		'grouping' => 'google-settings',
		'type' => 'text'),

	array('name' => 'Refresh Token (for Back-end / Server-side Authentication)',
		'desc' => "To access any content in Google Photos you need to get a token. To get your token go to
			<em>Photonic &rarr; Authentication &rarr; Google Photos &rarr; Google Photos Refresh Token Getter</em>, and authenticate.",
		'id' => 'google_refresh_token',
		'grouping' => 'google-settings',
		'type' => 'text'),

	array('name' => 'Media to show',
		'desc' => 'You can choose to include photos as well as videos in your output. This can be overridden by the <code>media</code> parameter in the shortcode:',
		'id' => 'google_media',
		'grouping' => 'google-settings',
		'type' => 'select',
		'options' => Photonic::media_options()),

	array('name' => "Hide Photo Count in Album Title Display",
		'desc' => "This will hide the number of photos in your Album's title.",
		'id' => "google_hide_album_photo_count_display",
		'grouping' => 'google-settings',
		'type' => 'checkbox'),

	array('name' => "Photo titles and captions",
		'desc' => "What do you want to show as the photo title in the tooltip and lightbox?",
		'id' => "google_title_caption",
		'grouping' => "google-settings",
		'type' => 'select',
		'options' => array(
			'none' => esc_html__('No title / caption / description', 'photonic'),
			'title' => esc_html__('Always use the photo title, even if blank', 'photonic'),
		)),

	array('name' => "Chain queries",
		'desc' => "When you use Photonic to display a selected list of albums, Photonic will only display the matches from the first page of results. Select this option to let it display albums from later pages.",
		'id' => "google_chain_queries",
		'grouping' => 'google-settings',
		'type' => 'checkbox'),

	array('name' => "Photos (Main Page)",
		'desc' => "Control settings for photos from Google Photos when displayed in your page",
		'category' => 'google-photos',
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you use the shortcode format <code>[gallery type='google' view='photos']</code>. In other words, the photos are printed directly on the page.",
		'grouping' => 'google-photos',
		'type' => "blurb",),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "google_photo_title_display",
		'grouping' => 'google-photos',
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "google_photos_per_row_constraint",
		'grouping' => 'google-photos',
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "google_photos_constrain_by_padding",
		'grouping' => 'google-photos',
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "google_photos_constrain_by_count",
		'grouping' => 'google-photos',
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),

	array('name' => "Photos (Overlaid Popup Panel)",
		'desc' => "Control settings for photos from Google Photos when displayed in a popup",
		'category' => 'google-photos-pop',
		'type' => 'section',),

	array('name' => "What is this section?",
		'desc' => "Options in this section are in effect when you use the shortcode format <code>[gallery type='google' view='albums']</code>, then click on an album to show an overlaid panel. In other words, the photos are printed directly in the overlaid panel.",
		'grouping' => 'google-photos-pop',
		'type' => "blurb",),

	array('name' => "Photo Title Display",
		'desc' => "How do you want the title of the photos?",
		'id' => "google_photo_pop_title_display",
		'grouping' => 'google-photos-pop',
		'type' => 'radio',
		'options' => photonic_title_styles()),

	array('name' => "Constrain Photos Per Row",
		'desc' => "How do you want the control the number of photo thumbnails per row by default? This can be overridden by adding the '<code>columns</code>' parameter to the '<code>gallery</code>' shortcode.",
		'id' => "google_photos_pop_per_row_constraint",
		'grouping' => 'google-photos-pop',
		'type' => 'select',
		'options' => array("padding" => "Fix the padding around the thumbnails",
			"count" => "Fix the number of thumbnails per row",
		)),

	array('name' => "Constrain by padding",
		'desc' => " If you have constrained by padding above, enter the number of pixels here to pad the thumbs by",
		'id' => "google_photos_pop_constrain_by_padding",
		'grouping' => 'google-photos-pop',
		'type' => 'text',
		'hint' => "Enter the number of pixels here (don't enter 'px'). Non-integers will be ignored."),

	array('name' => "Constrain by number of thumbnails",
		'desc' => " If you have constrained by number of thumbnails per row above, enter the number of thumbnails",
		'id' => "google_photos_pop_constrain_by_count",
		'grouping' => 'google-photos-pop',
		'type' => 'select',
		'options' => photonic_selection_range(1, 25)),
);
