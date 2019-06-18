<?php
/*
 *  Author: Minh Tri VV-JSC
 *  URL: T-Theme.com | @ttheme
 *  Theme perfect
 */
define('THEME_URL',get_template_directory_uri());
define('URL_CSS', THEME_URL.'/css' );
define('URL_JS', THEME_URL.'/js' );
define('URL_IMG', THEME_URL.'/image' );
define('URL_ROOT', get_home_url());

if ( ! function_exists( 'ttheme_setup' ) ) :
	function ttheme_setup() {
		load_theme_textdomain( 'ttheme', get_template_directory() . '/languages' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 1568, 9999 );
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 190,
				'width'       => 190,
				'flex-width'  => false,
				'flex-height' => false,
			)
        );
        add_theme_support( 'post-formats',
            array(
                    'video',
                    'image',
                    'audio',
                    'gallery'
            )
        );

	}
endif;
add_action( 'after_setup_theme', 'ttheme_setup' );
    
?>