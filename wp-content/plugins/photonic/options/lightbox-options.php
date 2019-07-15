<?php

global $photonic_lightbox_options;

$photonic_lightbox_options = array(
	array('name' => 'Common',
		'desc' => 'Control settings for all Lightboxes',
		'category' => 'lb-settings',
		'type' => 'section',),

	array('name' => 'Autoplay mode',
		'desc' => "Selecting this will make your lightbox launch in an autoplay mode automatically upon clicking (See <a href='https://aquoid.com/plugins/photonic/third-party-lightboxes/' target='_blank'>list of supported lightboxes</a>).",
		'id' => 'slideshow_mode',
		'grouping' => 'lb-settings',
		'type' => 'checkbox',
	),

	array('name' => 'Autoplay mode interval',
		'desc' => 'If autoplay is on, this will control the interval between slides.',
		'id' => 'slideshow_interval',
		'grouping' => 'lb-settings',
		'type' => 'text',
		'hint' => 'Please enter a time in milliseconds',
	),

	array('name' => 'No Looping',
		'desc' => 'Selecting this will prevent the lightbox from looping back to the start when it reaches the end. Looping can be controlled only in lightboxes that have a setting for it.',
		'id' => 'lightbox_no_loop',
		'grouping' => 'lb-settings',
		'type' => 'checkbox',
	),

	array('name' => "Deep Linking",
		'desc' => "If enabled, Photonic will generate a unique URL when an photo's thumbnail is clicked.",
		'id' => "deep_linking",
		'grouping' => 'lb-settings',
		'type' => 'select',
		'options' => array(
			"none" => "No deeplinking",
			"no-history" => "Enable deeplinking, but don't add links for clicked images to browser history",
			"yes-history" => "Enable deeplinking, and add links for clicked images to browser history",
		),
	),

	array('name' => "Social media integration",
		'desc' => "If deep linking is enabled, Photonic shows social media buttons on the lightbox to facilitate sharing. Select this option to disable social sharing.",
		'id' => "social_media",
		'grouping' => 'lb-settings',
		'type' => 'checkbox',
	),

	array('name' => 'Colorbox',
		'desc' => 'Colorbox Settings',
		'category' => 'lb-cb-settings',
		'type' => 'section',),

	array('name' => 'Colorbox Theme',
		'desc' => "Colorbox lets you pick one of the following themes. See examples <a href='http://www.jacklmoore.com/colorbox/' target='_blank'>here</a>:",
		'id' => 'cbox_theme',
		'grouping' => 'lb-cb-settings',
		'type' => 'select',
		'options' => array(
			'1' => 'Default',
			'2' => 'Style 2',
			'3' => 'Style 3',
			'4' => 'Style 4',
			'5' => 'Style 5',
			'theme' => 'Use a skin defined in your theme (requires the files to be present in the scripts/colorbox folder within your theme directory).',
		)
	),

	array('name' => 'Transition effect',
		'desc' => 'Specify the transition effect to be used when Colorbox is displaying a picture',
		'id' => 'cb_transition_effect',
		'grouping' => 'lb-cb-settings',
		'type' => 'select',
		'options' => array(
			'elastic' => 'Elastic',
			'fade' => 'Fade',
			'none' => 'None',
		)
	),

	array('name' => 'Transition speed',
		'desc' => 'Specify the speed for the above transition effect, in milliseconds',
		'id' => 'cb_transition_speed',
		'grouping' => 'lb-cb-settings',
		'type' => 'text'
	),

	array('name' => 'Fancybox 1 / 2 / 3',
		'desc' => 'Fancybox Settings',
		'category' => 'lb-fb-settings',
		'type' => 'section',),

	array('name' => "Position of title in FancyBox slideshow",
		'desc' => "Fancybox lets you show the title of the image in different positions. Where do you want it?",
		'id' => "fbox_title_position",
		'grouping' => "lb-fb-settings",
		'type' => 'select',
		'options' => array(
			"outside" => "Outside the slide box",
			"inside" => "Inside the slide box",
			"over" => "Over the image in the slide box",
		)
	),

	array('name' => 'Fancybox3 Transition effect',
		'desc' => 'Specify the transition effect to be used when Fancybox3 is displaying a picture.',
		'id' => 'fb3_transition_effect',
		'grouping' => 'lb-fb-settings',
		'type' => 'select',
		'options' => array(
			'fade' => 'Fade',
			'slide' => 'Slide',
			'circular' => 'Circular',
			'tube' => 'Tube',
			'zoom-in-out' => 'Zoom in and out',
			'rotate' => 'Rotate',
		)
	),

	array('name' => 'Fancybox3 Transition duration',
		'desc' => 'How fast or slow do you want the transition?',
		'id' => "fb3_transition_speed",
		'grouping' => 'lb-fb-settings',
		'type' => 'text',
		'hint' => 'Integer, in milliseconds'),

	array('name' => "Fancybox3 - Hide Zoom Button",
		'desc' => "The Zoom button is enabled by default. Select to hide it.",
		'id' => "fb3_disable_zoom",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - Hide Slideshow Button",
		'desc' => "The Slideshow button is enabled by default. Select to hide it.",
		'id' => "fb3_disable_slideshow",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - Show FullScreen Button",
		'desc' => "The full-screen button is disabled by default. Select to show it.",
		'id' => "fb3_show_fullscreen",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - auto-start FullScreen",
		'desc' => "Automatically launch Fancybox3 in FullScreen mode.",
		'id' => "enable_fb3_fullscreen",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - Show Download Button",
		'desc' => "The Download button is disabled by default. Select to show it.",
		'id' => "fb3_enable_download",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - Hide Thumbnails Button",
		'desc' => "The Thumbnails button is enabled by default. Select to hide it.",
		'id' => "fb3_hide_thumbs",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - auto-open Thumbnails",
		'desc' => "Automatically open Fancybox3 Thumbnails.",
		'id' => "enable_fb3_thumbnail",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => "Fancybox3 - Disable Right Click",
		'desc' => "While this does not protect from truly determined users, it adds a deterrent for downloading.",
		'id' => "fb3_disable_right_click",
		'grouping' => "lb-fb-settings",
		'type' => 'checkbox'
	),

	array('name' => 'Lightcase',
		'desc' => 'Lightcase Settings',
		'category' => 'lb-lc-settings',
		'type' => 'section',),

	array('name' => 'Transition effect',
		'desc' => 'Specify the transition effect to be used when Lightcase is displaying a picture. See demos <a href="http://cornel.bopp-art.com/lightcase/" target="_blank">here</a>.',
		'id' => 'lc_transition_effect',
		'grouping' => 'lb-lc-settings',
		'type' => 'select',
		'options' => array(
			'elastic' => 'Elastic',
			'fade' => 'Fade',
			'fadeInline' => 'Fade inline',
			'scrollTop' => 'Scroll Top',
			'scrollBottom' => 'Scroll Bottom',
			'scrollLeft' => 'Scroll Left',
			'scrollRight' => 'Scroll Right',
			'scrollHorizontal' => 'Scroll Horizontal',
			'scrollVertical' => 'Scroll Vertical',
			'none' => 'None',
		)
	),

	array('name' => 'Transition speed-in',
		'desc' => 'How fast or slow do you want the transition, going in?',
		'id' => "lc_transition_speed_in",
		'grouping' => 'lb-lc-settings',
		'type' => 'text',
		'hint' => 'Integer, in milliseconds'),

	array('name' => 'Transition speed-out',
		'desc' => 'How fast or slow do you want the transition, going out?',
		'id' => "lc_transition_speed_out",
		'grouping' => 'lb-lc-settings',
		'type' => 'text',
		'hint' => 'Integer, in milliseconds'),

	array('name' => 'Flexible Sizes',
		'desc' => 'By default Lightcase does not show your images at more than 800px&times;500px. Selecting this option will let it automatically adjust your image according to your screen size.',
		'id' => "lc_enable_shrink",
		'grouping' => "lb-lc-settings",
		'type' => 'checkbox'
	),

	array('name' => 'LightGallery',
		'desc' => 'LightGallery Settings',
		'category' => 'lb-lg-settings',
		'type' => 'section',),

	array('name' => 'Add Additional Transitions',
		'desc' => 'LightGallery supports the "fade" and "slide" transition effects by default. Additional transitions from the dropdown below can be enabled by addition of a script (+39KB). See demos <a href="http://sachinchoolur.github.io/lightGallery/demos/transitions.html" target="_blank">here</a>.',
		'id' => "enable_lg_transitions",
		'grouping' => "lb-lg-settings",
		'type' => 'checkbox'
	),

	array('name' => 'Transition effect',
		'desc' => 'If the above is checked, specify the transition effect to be used when LightGallery is displaying a picture. See demos <a href="http://sachinchoolur.github.io/lightGallery/demos/transitions.html" target="_blank">here</a>.',
		'id' => 'lg_transition_effect',
		'grouping' => 'lb-lg-settings',
		'type' => 'select',
		'options' => array(
			'lg-slide' => 'lg-slide',
			'lg-fade' => 'lg-fade',
			'lg-zoom-in' => 'lg-zoom-in',
			'lg-zoom-in-big' => 'lg-zoom-in-big',
			'lg-zoom-out' => 'lg-zoom-out',
			'lg-zoom-out-big' => 'lg-zoom-out-big',
			'lg-zoom-in-out' => 'lg-zoom-in-out',
			'lg-soft-zoom' => 'lg-soft-zoom',
			'lg-scale-up' => 'lg-scale-up',
			'lg-slide-circular' => 'lg-slide-circular',
			'lg-slide-circular-vertical' => 'lg-slide-circular-vertical',
			'lg-slide-vertical' => 'lg-slide-vertical',
			'lg-slide-vertical-growth' => 'lg-slide-vertical-growth',
			'lg-slide-skew-only' => 'lg-slide-skew-only',
			'lg-slide-skew-only-rev' => 'lg-slide-skew-only-rev',
			'lg-slide-skew-only-y' => 'lg-slide-skew-only-y',
			'lg-slide-skew-only-y-rev' => 'lg-slide-skew-only-y-rev',
			'lg-slide-skew' => 'lg-slide-skew',
			'lg-slide-skew-rev' => 'lg-slide-skew-rev',
			'lg-slide-skew-cross' => 'lg-slide-skew-cross',
			'lg-slide-skew-cross-rev' => 'lg-slide-skew-cross-rev',
			'lg-slide-skew-ver' => 'lg-slide-skew-ver',
			'lg-slide-skew-ver-rev' => 'lg-slide-skew-ver-rev',
			'lg-slide-skew-ver-cross' => 'lg-slide-skew-ver-cross',
			'lg-slide-skew-ver-cross-rev' => 'lg-slide-skew-ver-cross-rev',
			'lg-lollipop' => 'lg-lollipop',
			'lg-lollipop-rev' => 'lg-lollipop-rev',
			'lg-rotate' => 'lg-rotate',
			'lg-rotate-rev' => 'lg-rotate-rev',
			'lg-tube' => 'lg-tube',
		)
	),

	array('name' => 'Transition speed',
		'desc' => 'How fast or slow do you want the transition to go?',
		'id' => "lg_transition_speed",
		'grouping' => 'lb-lg-settings',
		'type' => 'text',
		'hint' => 'Integer, in milliseconds'),

	array('name' => "Add Autoplay",
		'desc' => "Enable Lightgallery Autoplay capability (+3KB).",
		'id' => "enable_lg_autoplay",
		'grouping' => "lb-lg-settings",
		'type' => 'checkbox'
	),

	array('name' => "Add Fullscreen",
		'desc' => "Enable Lightgallery Fullscreen capability (+2KB).",
		'id' => "enable_lg_fullscreen",
		'grouping' => "lb-lg-settings",
		'type' => 'checkbox'
	),

	array('name' => "Add Thumbnail",
		'desc' => "Enable Lightgallery Thumbnails capability (+8KB).",
		'id' => "enable_lg_thumbnail",
		'grouping' => "lb-lg-settings",
		'type' => 'checkbox'
	),

	array('name' => "Add Zoom",
		'desc' => "Enable Lightgallery Zoom capability (+8KB).",
		'id' => "enable_lg_zoom",
		'grouping' => "lb-lg-settings",
		'type' => 'checkbox'
	),

	array('name' => 'Disable download',
		'desc' => 'Disable the download button that shows up by default for LightGallery',
		'id' => "disable_lg_download",
		'grouping' => "lb-lg-settings",
		'type' => 'checkbox'
	),

	array('name' => 'Delay before hiding lightbox bars',
		'desc' => 'Time to delay before hiding title and navigation bars',
		'id' => "lg_hide_bars_delay",
		'grouping' => 'lb-lg-settings',
		'type' => 'text',
		'hint' => 'Integer, in milliseconds'),

	array('name' => 'PrettyPhoto',
		'desc' => 'PrettyPhoto Settings',
		'category' => 'lb-pp-settings',
		'type' => 'section',),

	array('name' => "PrettyPhoto Theme",
		'desc' => "PrettyPhoto lets you pick one of the following themes:",
		'id' => "pphoto_theme",
		'grouping' => "lb-pp-settings",
		'type' => 'select',
		'options' => array(
			"pp_default" => "Default",
			"light_rounded" => "Light Rounded",
			"dark_rounded" => "Dark Rounded",
			"light_square" => "Light Square",
			"dark_square" => "Dark Square",
			"facebook" => "Facebook",
		)
	),

	array('name' => 'Transition speed',
		'desc' => 'Specify the transition speed to be used when PrettyPhoto is displaying a picture',
		'id' => 'pp_animation_speed',
		'grouping' => 'lb-pp-settings',
		'type' => 'select',
		'options' => array(
			'fast' => 'Fast',
			'slow' => 'Slow',
			'normal' => 'Normal',
		)
	),

	array('name' => 'Swipebox',
		'desc' => 'Swipebox Settings',
		'category' => 'lb-sb-settings',
		'type' => 'section',),

	array('name' => 'Bars on Mobile',
		'desc' => "Show title and navigation bars on mobile devices if Swipebox is the lightbox.",
		'id' => "enable_swipebox_mobile_bars",
		'grouping' => 'lb-sb-settings',
		'type' => 'checkbox'
	),

	array('name' => 'Close button on Mobile',
		'desc' => 'Hide close button on mobile devices.',
		'id' => 'sb_hide_mobile_close',
		'grouping' => 'lb-sb-settings',
		'type' => 'checkbox'
	),

	array('name' => 'Delay before hiding bars on Desktop',
		'desc' => 'Time to delay before hiding title and navigation bars on desktop. Set to 0 to always show the bars',
		'id' => "sb_hide_bars_delay",
		'grouping' => 'lb-sb-settings',
		'type' => 'text',
		'hint' => 'Integer, in milliseconds'),

);
