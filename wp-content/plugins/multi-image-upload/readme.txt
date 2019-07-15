=== Multi Image Upload ===
Contributors: tahiryasin
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=63N6XHBLFRC3U
Tags: multi, image, upload, metabox
Requires at least: 2.8
Tested up to: 5.1.1
Stable tag: 2.0
License: GPLv2 or later

This plugin adds a meta box to upload multiple images for posts and pages.

== Description ==

This plugin adds a meta box to upload multiple images for posts and pages. You can enable it for custom post types also, please see installation instructions.

== Installation ==

1. Upload plugin to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. To retrieve linked images [Use miu_get_images()](http://wordpress.org/extend/plugins/multi-image-upload/other_notes/#miu_get_images()) into the loop to get an array of image URLs
4. Optional

If you need to enable this meta box for your custom post type for example 'book'. Just edit the multi-image-upload.php as shown below

Replace: 
`$this->post_types = array('post', 'page');`
With:
`$this->post_types = array('post', 'page', 'book');`


== Frequently Asked Questions ==

= Why should I use this plugin? =

Use this plugin if you want to quickly add a feature to upload multiple images for a page, post or custom post type.

== Screenshots ==

1. screenshot-1.png

== Changelog ==
= 2.0 =
* Old tb_show method replace with latest Media plugin
* Image thumbnail updates as soon as you chose image
* Links added on image thumbails that open the image in new tab
* JQuery `.live()` replace with `.on()`

= 1.2 =
* Compatibility issues with latest WP version fixed.
* Image thumbnails displayed in admin meta box.

= 1.1 =
* Bug fixes

= 1.0 =
* First stable release.



== miu_get_images() ==

This function can be called from any template file to get attached images for the page/post being viewed.
It returns an array of the attached image URL.

It take only one argument: 

1. **post_id** (integer) to get images linked to a specific post

`<?php 
$images = miu_get_images($post_id = null); 

//Sample output
Array
(
    [0] => http://www.example.com/image-1.png
    [1] => http://www.example.com/image-2.png
)

?>`

== Upgrade Notice ==

NA