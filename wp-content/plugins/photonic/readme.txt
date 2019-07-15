=== Photonic Gallery & Lightbox for Flickr, SmugMug, Google Photos, Zenfolio and Instagram ===
Contributors: sayontan
Donate link: https://aquoid.com/plugins/photonic/
Tags: flickr, google photos, smugmug, zenfolio, instagram, gallery, lightbox, responsive, gestures, colorbox, fancybox, lightcase, lightgallery, magnific, photoswipe, prettyphoto, swipebox, strip, slideshow, deeplinking, social
Text Domain: photonic
Requires at least: 4.9
Tested up to: 5.2.1
Requires PHP: 5.6
Stable tag: trunk
License: GPLv3 or later

Galleries on steroids! A stylish lightbox & gallery plugin for WP, Flickr, SmugMug, Google Photos, Zenfolio & Instagram photos and videos.

== Description ==

Photonic takes the WordPress gallery and super-charges it with a lot of added functionality. It adds support for several new sources and parameters to enhance the content and look-and-feel of your galleries. It supports <a href='https://flickr.com'>Flickr</a> photos, Albums (Photosets), Galleries and Collections, along with <a href='https://photos.google.com/'>Google Photos</a> photos and albums, <a href='https://smugmug.com'>SmugMug</a> folders, albums and images, <a href='https://zenfolio.com'>Zenfolio</a> photos, Photosets and Groups, and <a href='https://instagram.com'>Instagram</a> photos. You can also set up authentication so that visitors can see private and protected photos from each provider.

When used without the Gutenberg editor Photonic by default overrides the <code>gallery</code> shortcode. In case you happen to be using a theme or plugin that already overrides the <code>gallery</code> shortcode, Photonic provides you with the option to use your own shortcode for Photonic galleries. This lets your plugins coexist. Bear in mind that if you deactivate Photonic you will have to remove all instances of this custom shortcode, something that is not required if you stick to the <code>gallery</code> shortcode.

When used with Gutenberg Photonic creates no shortcodes, rather it creates blocks. If some of your posts were written with Gutenberg and some without, Photonic supports both scenarios.

= Lightboxes =

Photonic has built-in support for commonly used lightbox scripts such as:

*	<a href='http://www.jacklmoore.com/colorbox/'>Colorbox</a>
*	<a href='http://fancybox.net/'>Fancybox</a>
*	<a href='http://fancyapps.com/fancybox/'>Fancybox2</a> - not GPL, so the script is not included with the plugin. See the <a href='https://aquoid.com/plugins/photonic/third-party-lightboxes/'>Lightboxes</a> page for details
*	<a href='https://fancyapps.com/fancybox/3/'>Fancybox3</a>
*	<a href='https://noelboss.github.io/featherlight/'>Featherlight</a>
*	<a href='https://osvaldas.info/image-lightbox-responsive-touch-friendly'>Image Lightbox</a>
*	<a href='http://cornel.bopp-art.com/lightcase/'>Lightcase</a>
*	<a href='https://sachinchoolur.github.io/lightGallery/'>Lightgallery</a>
*	<a href='http://dimsemenov.com/plugins/magnific-popup/'>Magnific Popup</a>
*	<a href='http://photoswipe.com/'>PhotoSwipe</a>
*	<a href='http://www.no-margin-for-errors.com/projects/prettyphoto-jquery-lightbox-clone/'>PrettyPhoto</a>
*	<a href='http://brutaldesign.github.io/swipebox/'>Swipebox</a>
*	<a href='http://www.stripjs.com'>Strip</a> - not GPL, so the script is not included with the plugin. See the <a href='https://aquoid.com/plugins/photonic/third-party-lightboxes/'>Lightboxes</a> page for details
*	Thickbox

Non-GPL alternatives like <a href='http://fancyapps.com/fancybox/'>Fancybox2</a> and <a href='http://www.stripjs.com'>Strip</a> are supported, provided you install the scripts yourself. With the exception of Thickbox the lightboxes have been adapted to become touch and gesture-friendly. See the <a href='https://aquoid.com/plugins/photonic/third-party-lightboxes/'>Lightboxes</a> page for details.

= Flickr Support =

The following Flickr concepts are supported in Photonic:

*	<a href='https://aquoid.com/plugins/photonic/flickr/flickr-photos/'>Photos</a>
*	<a href='https://aquoid.com/plugins/photonic/flickr/flickr-photosets/'>PhotoSets (Albums)</a>
*	<a href='https://aquoid.com/plugins/photonic/flickr/flickr-galleries/'>Galleries</a>
*	<a href='https://aquoid.com/plugins/photonic/flickr/flickr-collections/'>Collections</a>
*	<a href='https://aquoid.com/plugins/photonic/flickr/flickr-photo/'>Single Photo</a>
*	<a href='https://aquoid.com/plugins/photonic/flickr/flickr-authentication/'>Authentication</a>

For demos of Flickr support visit the <a href='https://aquoid.com/plugins/photonic/flickr/'>Flickr page</a>.

= Google Photos Support =

The following Google Photos concepts are supported in Photonic:

*	<a href='https://aquoid.com/plugins/photonic/google-photos/photos/'>Photos</a>
*	<a href='https://aquoid.com/plugins/photonic/google-photos/albums/'>Albums</a>

For demos of Google Photos support visit the <a href='https://aquoid.com/plugins/photonic/google-photos/'>Google Photos page</a>. Note that the Google has released the API in a <a href='https://developers.google.com/photos/library/guides/api-limits-quotas'>"Developer preview" mode</a>, so there are some restrictions around usage.

= SmugMug Support =

The following SmugMug concepts are supported in Photonic:

*	<a href='https://aquoid.com/plugins/photonic/smugmug/smugmug-tree/'>User Tree</a>
*	<a href='https://aquoid.com/plugins/photonic/smugmug/smugmug-photos/'>Photos</a>
*	<a href='https://aquoid.com/plugins/photonic/smugmug/smugmug-albums/'>Albums</a>
*	<a href='https://aquoid.com/plugins/photonic/smugmug/folders/'>Folders</a>

For demos of SmugMug support visit the <a href='https://aquoid.com/plugins/photonic/smugmug/'>SmugMug page</a>.

= Zenfolio Support =

The following Zenfolio concepts are supported in Photonic:

*	<a href='https://aquoid.com/plugins/photonic/zenfolio/photos/'>Photos</a>
*	<a href='https://aquoid.com/plugins/photonic/zenfolio/photosets/'>PhotoSets (Galleries and Collections)</a>
*	<a href='https://aquoid.com/plugins/photonic/zenfolio/groups/'>Groups</a>
*	<a href='https://aquoid.com/plugins/photonic/zenfolio/group-hierarchy/'>Group Hierarchies</a>

For demos of Zenfolio support visit the <a href='https://aquoid.com/plugins/photonic/zenfolio/'>Zenfolio page</a>. Note that authenticated content in Zenfolio is not currently supported.

= Instagram Support =

Instagram photos <a href='https://aquoid.com/plugins/photonic/instagram/'>are supported in Photonic</a>. You can display your own feed, and photos based on tags, and location-based searches. Note that while code has been written to support tags and locations, Instagram hasn't approved Photonic's access to others' photos. This means that currently only displaying one's own feed will work.

= Enhanced Native Galleries =

Your existing gallery insertions are left intact. However you can add a <code>style</code> parameter to a native gallery to open it up to Photonic. The <code>style</code> parameter can take any of the values documented on the <a href='https://aquoid.com/plugins/photonic/layouts/'>Layouts</a> page.

= 500px Support - Historical =

Photos and Galleries (a.k.a. Collections, a.k.a. Sets) on <a href='https://aquoid.com/plugins/photonic/500px/'>500px.com are supported in Photonic</a>, but 500px.com has <a href='https://support.500px.com/hc/en-us/articles/360002435653-API-'>shut down its API access with effect from 15th June 2018</a>. The code has been left in the plugin in case 500px.com revives the API, but for now, 500px.com is not supported.

= Video Support =

Photonic provides gallery and lightbox support for <a href='https://aquoid.com/plugins/photonic/videos/'>videos as well</a>. Videos of the following sorts are supported:

*	External videos from YouTube or Vimeo can be opened in any of the lightboxes apart from Image Lightbox or Thickbox
*	Self-hosted or external videos in MP4 formats can be opened in any of the lightboxes apart from Image Lightbox, PrettyPhoto, Strip or Thickbox
*	Videos hosted by external service providers (Flickr, Google etc.) can be opened as a part of a gallery in any of the lightboxes apart from Image Lightbox, PrettyPhoto, Strip or Thickbox. Some lightboxes have issues with specific features. Please refer to the <a href=''>Lightboxes</a> documentation for more.

= Deep-Linking and Social Sharing =

Photonic provides deep-linking support for non-WP images, and by extension, supports social sharing to Facebook, Twitter, Google+ and Pinterest.

= Beautiful Layouts =

Photonic displays your galleries either as a grid of square thumbnails (the default), or circular thumbnails (like Jetpack), or random tiles in a justified grid, or a masonry layout, or a random mosaic (a much improved variant of the Jetpack Tiled Gallery layout), or a slideshow. See the <a href='https://aquoid.com/plugins/photonic/layouts/'>Layouts</a> page for details.

= Interactive Editing =

The WordPress editor shows up with a button that says "Add / Edit Photonic Gallery". Clicking on it will show you the different types of galleries you can work with.

= Gutenberg Support =

With effect from version 2.10 Photonic is Gutenberg-capable. There are some steps you might need to take to migrate your existing galleries. Please refer to the <a href='https://aquoid.com/plugins/photonic/gutenberg-support/'>documentation</a>.

== Installation ==

You can install the plugin through the WordPress installer under <strong>Plugins &rarr; Add New</strong> by searching for "Photonic", or by uploading the file downloaded from here.

Alternatively you can download the file from here, unzip it and move the unzipped contents to the <code>wp-content/plugins</code> folder of your WordPress installation. You will then be able to activate the plugin.

Once you have activated the plugin, refer to <em>Photonic &rarr; Getting Started</em> for a list of capabilities and documentation.

== Screenshots ==

For the plugin in action see the <a href='https://aquoid.com/plugins/photonic/'>plugin page</a>.

1.	If you are using Gutenberg look for the "Photonic" block
2.	If you are not using Gutenberg insert the shortcode for Photonic through the Media Uploader by clicking "Add Media", or click on "Add / Edit Photonic Gallery".
3.	Clicking on the Gutenberg block, or on "Add / Edit Photonic Gallery" shows up an interactive flow for you to build out your gallery.
4.	The interactive flow shows you the options available and helps construct the gallery easily.
5.	If you click on "Add Media" you will see a new tab for "Photonic". This is not available for Gutenberg.
6.	Clicking on the "Photonic" tab will show you new tabs, one for each type of gallery. Fill out what you need and click "Insert into post".
7.	The gallery placeholder shows up in the "Visual Editor" or in the Gutenberg editor. Each provider's placeholder is designated by its logo.
8.	Clicking on the placeholder lets you edit the attributes of the shortcode if Gutenberg is not being used and the interactive workflow is disabled.
9.	An example of the "Random Justified Gallery" layout.

== Frequently Asked Questions ==

= If I disable the plugin what happens to the galleries? =

Obviously, your galleries will not show. If you are using Gutenberg you don't have to worry about anything. If you are not using Gutenberg and you are using the native <code>gallery</code> shortcode, you will not see any empty shortcode tags on your site. But if you are not using Gutenberg and you are using a custom shortcode that shortcode tag will now show up.

= When I click on a gallery in the Visual Editor nothing happens. Is the plugin working? =

Yes, the plugin is working. Unfortunately the integration of Photonic with the visual editor is complex, and there is a likelihood of conflicts with other TinyMCE-specific plugins. If you come across such a conflict, please report it on the support forum. In the meanwhile you can disable the visual editing capability of Photonic (<em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Disable shortcode editing in Visual Editor</em>) and you should still be able to edit the gallery shortcode directly through the text editor.

= My gallery layout seems to get messed up with random text showing up at various places. Are you sure the plugin is working? =

Yes, the plugin is working. The issue you are facing is that you have another plugin (typically some sort of a lightbox plugin) that is modifying the markup generated by Photonic.

Of course, it would be easiest if you were to disable that plugin. If a lightbox is all you need, Photonic's lightbox can be used to display regular photos as well, from your admin dashboard under <em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Photonic Lightbox for non-Photonic Images</em>. This will ensure consistency across Photonic and non-Photonic images.

However, if you really wanted to keep that plugin, Photonic offers a way out there too! For each provider (e.g. Flickr, Google Photos etc.) go to the Settings page, e.g. <em>Photonic &rarr; Settings &rarr; SmugMug &rarr; SmugMug Settings &rarr; Disable lightbox linking</em> and set that option.

= I upgraded, and now my SmugMug galleries won't show. Are you really sure the plugin is working? =

Yes, the plugin is working. Here is what happened: version 1.57 of Photonic moved from API v1.3 of SmugMug to API v2. Your API keys probably were created for v1.3 and need to be authorized for v2. See <a href='https://aquoid.com/2016/12/smugmug-access-in-photonic-1-57/'>here</a> for instructions.

= Does the plugin support Picasa? =

Not with effect from January 2019, when Google terminated the Picasa API. It does support Google Photos though. See the <a href='https://aquoid.com/plugins/photonic/google-photos/'>documentation pages</a> for instructions.

= Does the plugin support 500px.com? =

The plugin has code to support 500px.com, however 500px.com has shut down its API access with effect from mid June 2018, so you will not be able to obtain an API key for it, and if you have an API key already, it will have stopped working.

= What about other photo-sharing platforms? =

Suggestions are welcome for other photo-sharing platforms.

= What about other JS libraries? =

Currently Colorbox, Fancybox, Fancybox3, Featherlight, Image Lightbox, Lightcase, Lightgallery, PrettyPhoto and Swipebox are supported. Inbuilt support is also present for the non-GPL Fancybox2 and Strip. Both lighter and heavier alternatives are being considered. If you have specific suggestions please feel free to contact the plugin author.

Note that there have been slight modifications to some of the above scripts to make them interact seamlessly with JQuery tooltips.

= Are there any known issues? =

As explained in the "Description", the Instagram API has been coded to support hashtags and locations, but Instagram itself has not provided Photonic access to those features.

Also, the TinyMCE integration for the plugin is complex, predominantly since Photonic doesn't rely on a separate shortcode. This can cause potential conflicts with other plugins. If such a situation arises, please report it in the <a href='https://wordpress.org/support/plugin/photonic/'>Support Forum</a>, and disable the visual editor capability for the shortcode by specific post-types (<em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Disable Visual Editing for specific post types</em>). If that doesn't work, you can go thermonuclear on Photonic's visual editing (<em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Disable shortcode editing in Visual Editor</em>) - you will still be able to edit the shortcode using the Text Editor in WordPress.

The "Mosaic" layout may sometimes show 1px wide gaps betweeen images if you set the padding between images to 0. This happens due to rounding errors in the height and width calculations. To avoid this, it is recommended that you use a padding &gt; 0 between images for this layout.

Apart from these, while the plugin can handle pretty much whatever you throw at it, Lubarsky's Law of Cybernetic Entomology states:
<blockquote>There is always one more bug.</blockquote>

Bug reports are welcome, and handled enthusiastically.

= Are translations supported? =

Yes, but only for the plugin front-end and the interactive workflow. The admin panel is not translated at this point. Also note that any strings included in the third-party JS scripts are not translated.

== Changelog ==

= 2.27 =

*	Updated Colorbox to latest version; removes dependency on jQuery Migrate
*	Updated Fancybox 1 to work with newer versions of jQuery without jQuery Migrate
*	Updated Image Lightbox to work with newer versions of jQuery without jQuery Migrate
*	Updated PrettyPhoto to work with newer versions of jQuery without jQuery Migrate
*	Removed options for borders and padding around individual photos for all sources, reducing custom CSS size
*	Moved options defaults to different file, reducing load time
*	Combined JS files where possible to reduce HTTP requests
*	Combined CSS files where possible to reduce HTTP requests
*	Added screenshots to settings pages for "Add / Edit Photonic Gallery"

= 2.26 =

*	Changed code to adapt to latest Flickr URL changes. Flickr no longer generates URLs with "static.flickr.com" in the URL and replaces that with "staticflickr.com"
*	Single photos displayed for Flickr were relying explicitly on the "main_size" parameter. This has been changed to pick the "largest image" smaller than or equal to the main size image.
*	Flickr's changes broke the thumbnail URL generation for new videos - this has been fixed
*	LightGallery full-screen plugin has been updated to the latest version to address a JS error resultant from closing the gallery

= 2.25 =

*	Changed the filtering logic for Google Photos to show results from subsequent pages only if the "Chain queries" option for Google Photos is turned on. This is to avoid API quota limit violations
*	Made a modification to ensure that Photonic is not loading any scripts on admin pages such as the post listing page

= 2.24 =

*	Fixed a bug where the shortcode builder was requiring the API key for SmugMug
*	Added option to control title content for Google Photos
*	Added condition to exclude loading the vanilla shortcode builder form if the Rich Content Editor is disabled
*	Fixed album filtering logic for Google Photos to show results from subsequent pages if matches are not found on the first page

= 2.23 =

*	Added a switch to allow scripts to load in the header, to account for themes including RetinaJS, <a href='https://github.com/strues/retinajs/issues/260'>which has a bug</a>.

= 2.22 =

*	Conditional script placement was not working for blocks
*	Added option to force load scripts

= 2.21 =

*	Added logic to conditionally load JavaScript only on pages where Photonic is being invoked
*	Replaced the jQuery UI Dialog script (used for password prompting) with a much smaller library (ModaliseJS) with no jQuery dependency
*	Replaced the jQuery UI Tooltip script with a 2KB custom, no jQuery tooltip script
*	Added support for Enhanced Media Library
*	Fixed a mosaic layout bug that was causing the last row on smaller viewports to not render properly
*	Fixed an issue with the Interactive Shortcode Builder not being able to process authenticated SmugMug calls
*	Fixed a bug where Colorbox was not showing the lightbox for non-Photonic images
*	Fixed a bug where on slow connections with the title being displayed below the photos, users were seeing a narrow, tall column of text

= 2.20 =

*	Fixed an issue that was causing a fatal error on versions of PHP older than 5.5
*	Fixed an issue where the <code>video_size</code> attribute, if passed to a collection of albums, was not being propagated to the photos within each album.

= 2.19 =

*	Picasa is now deprecated, so support for it in the plugin has been removed
*	Added support for the Gutenberg block "wide-alignment" and "full-width" options
*	Added a <code>photonic_helper</code> utility shortcode
*	The block-builder also shows the equivalent shortcode at the bottom for users who are facing Gutenberg conflicts or want to use a shortcode
*	The <code>main_size</code> option was being ignored for the native galleries in favour of <code>slide_size</code>
*	Escaped all translated strings appropriately
*	The more button was not showing up on some OS configurations due to EOL character mismatches
*	Performance tracing was causing native WP galleries to not show up
*	Removed option to link photos for Google as all access is for private photos - "View" link is always erroneous
*	Added an "end" element to the galleries, to enable linking to the end of the gallery
*	Added PHP and extension info to the "Getting Started" page
*	Added a <code>tile_size</code> option to Instagram
*	Added PHP 7.3 compatibility
*	Added a hover overlay icon for videos for Instagram, Flickr and SmugMug
*	Fixed an issue where the slideshow layout was not respecting the <code>strip-above</code> option
*	Removed the requirement for an API key for SmugMug - SmugMug users will require an API key only if they want to display private photos
*	Fixed an "empty space" issue occurring for Safari with the masonry layout
*	Fixed a bug with PhotoSwipe and the justified grid layout, which was causing the lightbox to show a different image than the one clicked
*	Fixed a bug with PhotoSwipe and StripJS where the looping setting was not being respected
*	Added options to disable loading of Photonic's scripts in case a theme / plugin supplies them
*	Switched to minified versions of all JavaScript files; can be controlled by options
*	Renamed translation file to photonic.pot from photonic.po

= 2.17 =

*	Private albums for Flickr and SmugMug were not showing up in the interactive shortcode builder
*	Resolved Divi conflict with Visual Editor, and in Text editor the WP media library gets pushed behind

= 2.16 =

*	Zenfolio photosets with "smart" names were not being pulled up correctly
*	Using <code>title_position='none'</code> was not disabling the title
*	Masonry layout was not respecting the column count for level 2 displays
*	Minor changes to ensure that the hints in the flow editor are showing up only when required
*	Pinterest share now opens in a new window

= 2.15 =

*	Added a filtering capability on the shortcode insertion screens
*	Fixed a JS error that was showing up on clicking on "Add / Edit Photonic Gallery" button
*	Added the ability to provide the thumbnail size for Instagram in the shortcode builder

= 2.14 =

*	Fixed "disableShrink" behaviour for Lightcase.
*	Fixed Fancybox3 social media linking issues
*	Fixed a flickering issue for PhotoSwipe on mobiles
*	Fixed a bug where Flickr collections were not showing nested collections in some scenarios

= 2.13 =

*	Fixed a bug where the interactive flow was replacing the "Tile size" for WordPress galleries with a "Thumb Size"
*	Fixed a bug where gallery transitions within Fancybox3, PrettyPhoto and StripJS galleries were not working
*	Added a capability to check if the current user can edit posts before showing the interactive flow
*	Added several new options to the lightbox configurations

= 2.12 =

*	Added support for Magnific Popup
*	Fixed an issue with LightSlider slideshows not going the full-width in specific cases
*	Fixed a bug with the interactive flow that was causing a JS error for WP galleries if starting a new gallery
*	Split out the lightbox options to their own tab
*	Added multiple customization options to the lightboxes
*	Added a capability to launch a lightbox from a slideshow for LightGallery and Magnific
*	Added an option to remove the photo count from Google Album displays

= 2.11 =

*	Optimized and modularized JavaScript by separating out each lightbox script
*	Flickr photsets in a collection were losing their order due to parallel calls - now fixed
*	Instagram Masonry layout was hardcoding image sizes and not working properly
*	Fixed an issue in the interactive workflow that was causing a fatal error for PHP versions < 5.5
*	Modified the Flickr photo display link to be more "specific". E.g. if a photo is in an album its link in Flickr will be specific to that album instead of the user's photostream

= 2.10 =

*	Added Gutenberg compatibility
*	Added a "Shortcode replacement" capability to prepare for Gutenberg. See <em>Photonic &rarr; Prepare for Gutenberg</em>
*	Fixed a bug that was causing the default album search by user to fail for SmugMug
*	The <code>layout='strip-above'</code> setting was not working for the slideshow layouts. This has been corrected
*	Added new "Advanced" settings under "Generic Options". Moved SSL and performance logging options there.
*	Added new options to increase the cURL timeout and to enable debug logging for troubleshooting, under the "Advanced" section
*	Replaced Flickr collection-fetching with parallel calls

= 2.02 =

*	Minor patch for Interactive Workflow z-index issue

= 2.01 =

*	Added support for PhotoSwipe
*	Addressed an Instagram change that was preventing higher resolution images from being displayed.
*	Removed the explicitly defined Instagram sizes for 1080px and replaced them with a "Largest" option to automatically pull the largest available image
*	Fixed a bug that was not respecting the sort order for SmugMug

= 2.00 =

*	Added a new workflow-type button, "Add / Edit Photonic Gallery" to create Photonic galleries
*	Introduced a "Default user" feature for Flickr, SmugMug, Picasa and Zenfolio. This is used if a user is not specified. For Instagram the authenticated user is used by default and Google supports only the authenticated user
*	Added "search" capability for images in SmugMug albums, folders and for users by text and keywords
*   User id is no longer required for Instagram photos. The authenticated user is used
*   Added support for Zenfolio authentication
*	Added support for user-specific text / category searches for Zenfolio photosets
*	Added support for <code>photoset_type</code> (Gallery / Collection) for user-specific photosets in Zenfolio
*	Added support for <code>kind</code> (Recent / Popular) for user-specific photosets in Zenfolio
*	Added filter capability for Zenfolio photosets
*   Switched Zenfolio call from HTTP to HTTPS
*	Added <code>tile_size</code> support to native WP galleries
*	Changed Flickr "download" URL to reflect the full-size original image
*   Added capability to disable visual editing by post type
*	Fixed a bug that was causing a "short term cache" for an authenticated Google account, resulting in erroneous photos if the account was switched
*   If a video is added to a native WP gallery via third party plugins such as Media Library Assistant, Photonic can now display it as a part of the gallery and play the video in a lightbox
*   Switched Masonry to use the script bundled natively with WP
*   Added capability to track performance for each gallery (disabled by default)
*   Added option to disable SSL verification on local sites
*   There was an issue where, in the "Random Justified Gallery" layout, there was a visible "pop and realign" happening whenever the "Load More" button was being clicked. This has now been addressed

= 1.68 =

*	Added support for the new Google Photos API. The Google Photos module of Photonic coexists with the older Picasa module. Please refer to the <a href='https://aquoid.com/plugins/photonic/google-photos/'>documentation</a> for further details
*	Added capability to "show more" albums. Passing the <code>count</code> and <code>more</code> attributes allows pagination of albums
*	Added capability to paginate and "show more" in the overlaid popup window. Passing the <code>photo_count</code> and <code>photo_more</code> attributes allow this when the overlaid popup is enabled
*	Fixed an issue that was causing the photos of albums to not display if the global layout option was set to one of the slideshow options
*	Updated Featherlight to latest version

= 1.67 =

*	Fixed an issue with Instagram where not all recent media was displaying
*	Fixed an issue where a lightbox / interim popup launched from a Flickr album thumbnail capped off at 100 photos

= 1.66 =

*	Added video support for Flickr, Picasa / Google, SmugMug, Zenfolio and Instagram, plus videos from YouTube or Vimeo, plus standalone, locally hosted MP4 files
*	Added support for the <a href='https://fancyapps.com/fancybox/3/'>Fancybox3</a> lightbox
*	Added thumbnails to the Picasa and SmugMug helpers for easier identification
*	Added a <code>structure</code> option to the Zenfolio shortcode so that photosets can be shown without being grouped
*	Fixed a bug where the shortcode insertion script was not printing the alternative shortcode
*	Fixed a bug where, for the alternative shortcode being used with a native WP gallery, the <code>ids</code> parameter was not being respected
*	Fixed a bug where the archive-view thumbnail limit was not working for the home page
*	Updated LightGallery scripts to latest version
*	Corrected instructions for Picasa redirect URLs
*	Scrapped support for 500px.com because its <a href='https://support.500px.com/hc/en-us/articles/360002435653-API-'>API has been shut down with effect from 15th June 2018</a>
*	Random Justified Grid was setting the <code>alt</code> attribute of images to "undefined". This has been fixed

= 1.65 =

*	Added back-end authentication support for Flickr, SmugMug and 500px (feature existed for Google/Picasa and Instagram)
*	Fixed an incompatibility between themes and plugins using Bootstrap, and Photonic's use of jQuery Tooltip
*	Added support for the <a href='http://noelboss.github.io/featherlight/'>Featherlight</a> lightbox
*	Split out Authentication functionality to its own admin page, away from Helpers.
*	Improved error messages
*	Fixed a problem with the "Buy" link for SmugMug not appearing when opted for
*	Fixed an issue where user names in 500px that had numbers at the start were not displaying photos from the correct user
*	Streamlined the Picasa code to use native WP methods for HTTP requests
*	Changed permissions for "Helpers" and "Getting Started" pages. These will now display for non-admins. The Authentication and Settings pages will be shown only to admin users
*	Added support for Pinterest sharing
*	The SmugMug folder view was dropping albums that didn't have a "Highlight image". This has been addressed to use a placeholder
*	SmugMug folders were unable to display more than 10 albums within. This has been addressed to display up to 200 albums
*	Fixed a bug with 500px.com categories, where categories with spaces were not being processed correctly
*	Added a parameter called <code>filter_type</code> that takes the values <code>exclude</code> and <code>include</code> to indicate if a list of albums in the <code>filter</code> parameter should be excluded or included.
*	Added support for images in Flickr that do not follow Flickr's documented URL structure
*	Added a new title style to stick the title over the lower portion of a photo

= 1.64 =

*	New Masonry layout, triggered by <code>layout='masonry'</code> for external galleries, and <code>style='masonry'</code> for WP galleries
*	New Mosaic layout, triggered by <code>layout='mosaic'</code> for external galleries, and <code>style='mosaic'</code> for WP galleries
*	Added "More" button capability to native WP galleries
*	Added deep-linking and sharing capabilities to native WP galleries
*	Added an option to disable lightbox linking for Native WP galleries
*	Added support to display a folder in SmugMug, using <code>view='folder'</code>
*	Added size options for Instagram's larger sizes, e.g. 1080x1080px
*	Added options for "Thumbnail effects" - opacity, zoom and none
*	Added a <code>popup</code> attribute to the shortcode, which overrides the "Bypass Popup" capability. It takes the values <code>hide</code> and <code>show</code>
*	Added an option to auto-start slideshows in the slideshow layout
*	Added slideshow options to the shortcode insertion script for all galleries
*	Fixed a corner-case issue with the "random" layout: if the post-content width was being rounded up, e.g. 549.8px became 550px, some widths were not being computed correctly, causing the layout to break.
*	Fixed a mismatched HTML tag for single-photo displays.
*	Corrected a styling issue for the preview button in the WP editor that occurred when the back-end shortcode editor was active
*	The SmugMug helper now also provides information about folders
*	Fixed a bug with Image Lightbox's deep-linking, where if the same image was repeated in different galleries, the deep-link would show up from the first instance.

= 1.63 =

*	Shortcode integration with TinyMCE. Placeholders show up for all galleries, and clicking them lets users update gallery properties.
*	Added support for non-bundled lightbox, <a href='http://stripjs.com'>Strip</a>. There is deep-linking support, but social sharing doesn't work.
*	"Download" capability for LightGallery was not working in Firefox for Picasa, SmugMug, Flickr, Zenfolio, 500px and Instagram. Fixed for Picasa, SmugMug and Flickr.
*	Lightgallery showed a title in the lightbox even if "Show description only, even if blank" was selected. Fixed.

= 1.62 =

*	Added new "Slideshow" layout for all galleries, triggered by layout values <code>strip-below</code>, <code>strip-above</code>, <code>strip-right</code>, and <code>no-strip</code>.
*	Replaced jQuery Cycle with <a href='http://sachinchoolur.github.io/lightslider/index.html'>Lightslider</a> - responsive, touch-enabled and smaller. Lost most transition effects as a result.
*	Modified the back-end to remove dependency on JQuery UI; different look, reduced size and load time. Streamlined Flickr options.
*	Added new "Getting Started" page in the back-end with links to documentation.
*	Added support for the <a href='https://sachinchoolur.github.io/lightGallery/'>Lightgallery</a> lightbox script.
*	Added <code>controls</code> as an option for native WP galleries displayed as slideshows - shows "Previous" and "Next" buttons on the slideshow.
*	Added <code>caption_control</code> as an option for native WP galleries displayed as slideshows - shows the image caption at the bottom of the slideshow.
*	Added <code>caption</code> as an option for all galleries - helps pick the photo title or description / caption to display.
*	Added <code>thumb_size</code> and <code>main_size</code> options to all shortcodes. This overrides the settings in the back-end for individual providers.
*	Added Circular thumbnails option for WP gallery layouts

= 1.61 =

*	Fixed an issue that was causing the Flickr API to fail for old versions of PHP.

= 1.60 =

*	Added a "Load More" feature to shortcodes that display images.
*	Added capability to display a selected number of photos from SmugMug albums.
*	Added support for the <a href='http://cornel.bopp-art.com/lightcase/'>Lightcase</a> lightbox. Optimized CSS and fonts to reduce file sizes.
*	Fixed a bug with "Image Lightbox" wherein if interim popups were enabled, clicking on an image in the interim popup wouldn't show the lightbox.

= 1.59 =

*	Fixed a "Headers already sent" error for password-protected Zenfolio albums displayed "in page".
*	Fixed an "Event not defined" error with Swipebox on FF.
*	Added support for <a href='https://osvaldas.info/image-lightbox-responsive-touch-friendly'>Image Lightbox</a>.
*	Rewrote the Instagram extension, which was broken due to API changes. Multiple changes, now authentication happens in the back-end, but users require an "access token", which can be obtained from <em>Photonic &rarr; Helpers</em>
*	Due to Instagram API changes, some features such as popular photos, follows and followed-by capabilities have been removed.
*	Added options for lazy-loading of Flickr Collections.
*	Added a new "headers" parameter for Flickr, SmugMug and Zenfolio, where the album / set / gallery / collection header display may be controlled via the shortcode.
*	Added a new "Back-End Authentication" mode for Picasa / Google Photos to support the Google Photos API.

= 1.58 =

*	Added deeplinking support if Swipebox, Colorbox, PrettyPhoto, or Fancybox2 (not Fancybox) are the lightbox libraries. Nested deep-links currently show the correct album, but cannot open the correct image within.
*	Added social sharing support for Facebook, Twitter and Google+ for the above-mentioned lightboxes.
*	Fixed a SmugMug bug that was causing the album headers to show up twice.
*	Added a hook, <code>photonic_modify_title</code> to apply a different title for photos.
*	Fixed Fancybox styling issues for certain themes
*	Enhanced Fancybox2 support: added support for "Bypass popup", thumbnail and button helpers, and touch gestures
*	Added "Bypass popup" support for all included lightboxes, on by default
*	Added new SmugMug sizes to the backend options
*	In case an image has no title, and lightbox linking is disabled, the plugin will now not show the "View" text in the lightbox

= 1.57 =

*	Changed the SmugMug code to point to version 2 of the API, resulting in better performance, and improved support of titles, captions and highlight images.
*	Changed the format of the <code>album</code> parameter of the shortcode. It now requires only the album key. The older format still works, though.
*	Added new capability to support clicking of password-protected and authenticated albums in SmugMug
*	Added new capability to support clicking and display of password-protected albums in Zenfolio
*	Added new helper for Picasa to fetch Google Photos / Picasa album ids.
*	Added a "filter" option for the shortcode to allow for displaying selected albums / photosets / galleries / collections for Flickr, SmugMug, 500px and Picasa
*	Added a "loading" wheel to show that images are loading on the front-end.

= 1.56 =

*	Removed syntax that was causing errors in PHP versions <= 5.3.
*	Made a correction to the Picasa processor to support https in all cases. Previously https was being used only for authenticated users.
*	Added a new title style - slides up from the bottom upon hovering on a thumbnail.

= 1.55 =

*	Fixed a password-protection issue for SmugMug albums. Earlier password-protected albums would display only for authenticated users. Now, just passing the <code>password</code> attribute works.
*	Added support for <code>site_password</code> for SmugMug.
*	Changed <code>load_textdomain</code> to <code>load_plugin_textdomain</code>.
*	Replaced older fixed width popup panel with a responsive popup panel.
*	Removed options for displaying a fixed number of images per screen in the popup panel.

= 1.54 =

*	Changed the "gestures" script from TouchSwipe to TouchWipe, saving over 10KB of JS. The option to enable touch is now removed, as it is included by default for all libraries.
*	Added the "authkey" option to the shortcode generation script.
*	Added the "Text Domain" to the readme header to support translations on <a href='https://translate.wordpress.org/projects/wp-plugins/photonic'>wordpress.org</a>.

= 1.53 =

*	Added option for Photonic lightbox be used for non-Photonic images
*	Added support for "anyone with link" albums in Picasa, via the <code>authkey</code> parameter
*	Fixed an issue where a "." in the album id was causing JQuery errors

= 1.52 =

*	Added option to save CSS file, can be loaded for caching.
*	Added support for an additional "layout" attribute for the shortcode. Will take a value <code>square</code>, <code>circle</code> or <code>random</code>, can override the global layout.
*	Added support for "Random Justified Gallery" layout for displaying a group of albums, photosets etc.
*	Added support to display all of one's 500px collections
*	Added gesture support for Colorbox, PrettyPhoto and FancyBox
*	Updated "wait for images" code to latest version, to facilitate getting the rest of the images when one image is blocked or broken.
*	Added capability to bypass the popup for PrettyPhoto; on by default.
*	Fixed an issue that was causing Fancybox, Colorbox and PrettyPhoto to fail to open images in a lightbox in the random justified gallery layout.
*	Fixed an issue where the popup panel's lightbox was pulling photos from other popup panels
*	Fixed an issue with 500px to support new Galleries API, which replaces the Collections / Sets API
*	Swipebox would remove the title on mobiles by default. Added an option to address this.

= 1.51 =

*	Fixed an issue with applying borders and padding to "in-page" Flickr photos
*	Fixed an issue with Swipebox "bypassed popup panel" displays, which weren't supporting multi-line descriptions
*	Added new layout options, "Random Justified Gallery" and "Circular Thumbnails", under <em>Settings &rarr; Generic Options &rarr; Layouts</em>
*	Fixed an issue that wasn't showing the last used screen on the options pages upon saving

= 1.50 =

*	Added Swipebox support for gestures on mobile devices
*	Added capability to bypass the popup panel for libraries like Swipebox
*	Corrected issues with Zenfolio displays. WP was corrupting the photoset ids for Zenfolio
*	Added helper for SmugMug to find album id and album key
*	Switched JQuery Tooltip to the default JQuery Tooltip script supplied by WP

= 1.49 =

*	Security patch - updated PrettyPhoto to latest version

= 1.48 =

*	Fixed Zenfolio API issues.

= 1.47 =

*	Fixed a problem with the Flickr helpers.
*	Fixed miscellaneous issues with SmugMug.

= 1.46 =

*	500px API updated to accommodate the new URL formats.

= 1.45 =

*	Flickr API updated to use https instead of http, as per Flickr's transition plans.

= 1.44 =

*	Options panel was not working for WP 3.6. This has been fixed.

= 1.43 =

*	Added Thickbox support
*	Fixed an incompatibility between Photonic and themes from Themify.
*	Added capability to exclude passworded galleries from displaying for SmugMug.
*	Added support for alternative shortcode - specifying this will mean Photonic will not use the gallery shortcode

= 1.42 =

*	Massively refactored code. Several lines of JS code taken off, lots of PHP code modularized.
*	Added option to use a Colorbox skin defined in the theme folder
*	Updated SimpleModal, Colorbox and PrettyPhoto to latest versions.
*	Swapped the use of "live" for "on". This means Photonic needs WP 3.3 at least (since "on" was introduced in JQuery 1.7)
*	Removed the "View in Flickr" text from the plugin.
*	Ensured consistent behaviour with the lightbox title linking behaviour across all providers.
*	Introduced non-bundled lightbox support, with support for FancyBox2
*	Removed the modified scripts for FancyBox and ColorBox - now the original scripts are used.

= 1.41 =

*	Resolved a conflict between JetPack "Publicize" and protected access. The login box was not showing up.
*	Added the "ids" parameter to the shortcode insertion UI.
*	Added options to control thumbnail, title and photo count display in SmugMug album headers

= 1.40 =

*	Added Zenfolio support for public photos.
*	Fixed an issue with the shortcode generation for Instagram tags.
*	Added the 'photonic_register_extensions' action hook for registering more extensions.
*	Fixed some PHP notices that were showing up in debug mode when no options were set.
*	Fixed an option to prevent SmugMug album thumbnails and titles from linking to the SmugMug page.

= 1.36 =

*	Rewrote the Picasa processor to be DOM-based instead of event-based.
*	Added option to let users display the Picasa image title instead of the description.
*	Fixed a problem with Flickr Collections that was causing nested collections to display repeatedly.
*	Fixed a problem with Flickr Collections that was making the collections link to an invalid page.
*	Picasa thumbnails in the popup now have the same dimensions as those in the main page.

= 1.35 =

*	Added Instagram support
*	Gave Photonic its own menu item
*	Added some helpers to let people find their Flickr and Instagram IDs
*	Fixed a bug that was preventing Flickr Galleries from showing their overlaid popups
*	Added capability to display external links in a new tab

= 1.30 =

*	Removed singular check for 500px.com

= 1.29 =

*	Added support for 500px.com collections.
*	Fixed authentication problems in 500px.com.
*	Added capability to show a different number of photos on an archive page than on the page for a single post/page
*	Changed the Flickr API calls to be PHP-based instead of JS-based.

= 1.28 =

*	Removed some debugging statements.

= 1.27 =

*	Fixed a minor issue with the displaying of the login box for Picasa.

= 1.26 =

*	Added support for displaying single photos in 500px.com.
*	Added authentication support for Picasa.
*	Added more skins for Colorbox.

= 1.25 =

*	Changed some code so that not being connected to the web doesn't throw an error for 500px.
*	Fixed an issue that was preventing 500px photos from being shown on certain servers.

= 1.24 =

*	Added date filtering support for 500px.com. Thanks to Bart Kuipers (http://www.bartkuipers.com/) for the code.
*   Removed the included script for JQuery Dimensions, which was causing conflicts with other JQuery plugins. Dimensions has been merged into JQuery Core a while back.

= 1.23 =

*   Added search support for 500px.com, via tags and terms
*   Added new categories, sort criteria and capability to exclude a category for 500px.com

= 1.22 =

*   Made minor corrections to authentication behaviour. If not connected to the internet, Photonic was returning a fatal error.
*   Changed the wording for PrettyPhoto licensing. PrettyPhoto is licensed under GPL, and that is now explicitly stated in the options page.
*   Added the capability to include shortcodes inside the parameters of the gallery shortcode (nested shortcodes)

= 1.21 =

*	Added support for SmugMug password-protected albums where the user has access to the albums. Other albums show up, but clicking on them takes the users nowhere.
*	Fixed a bug that was killing the last thumbnail in a popup for SmugMug.

= 1.20 =

*	Added authentication support for Flickr, 500px.com and SmugMug.
*   Disabled the showing of password-protected SmugMug galleries.

= 1.12 =

*	Fixed a problem with handling double quotes in the title of Flickr photos.

= 1.11 =

*	Combined SimpleModal script with Photonic to save an HTTP request.
*   Deleted some redundant JS files.
*   Added support for a different default type.
*   Added support for single photos in Flickr.

= 1.10 =

*	Fixed a bug with the SmugMug processor, which was preventing the display of an album popup.

= 1.09 =

*	Fixed a bug with the Flickr processor, which was preventing the execution of the shortcode with a group_id parameter
*	Fixed a minor problem with the popup panels, where hovering over the panel titles was resulting in a Tooltip error.
*	The Picasa inserter was not showing the "album" field. This has been rectified.

= 1.08 =

*	Made a change to the Picasa processor to handle the recent change by Google. Google's change was forcing images to 512px.
*	Updated the plugin to support WP 3.3.
*   Fixed an issue with FancyBox that was showing server log errors for IE.

= 1.07 =

*	Added support for SmugMug
*	Modified the Picasa plugin to not display the file name if no title is found.

= 1.06 =

*	Fixed an issue with the 500px.com extension, which had to be changed to invoke HTTPS instead of HTTP.
*	Added support for the "sort" parameter for 500px.
*	Fixed an issue with the PrettyPhoto library where you couldn't see the "View in Flickr" link.

= 1.05 =

*	Added support for the PrettyPhoto JS library.
*	Added check for _wp_additional_image_sizes. This was causing errors for some people.
*	Fixed a bug with the thumbnail_width and thumbnail_height attribute of the plugin. The attributes should have been called thumb_width and thumb_height.
*	Added option to launch images in a slideshow mode.
*	Fixed a bug that was not accepting border settings for the thumbnails.

= 1.04 =

*	Added support for photos on 500px.
*	Modified the Colorbox invocation to fit in the browser window.

= 1.03 =

*	Added support for Gallery objects in Flickr.
*	Fixed an issue with the Picasa galleries where under certain circumstances users were getting a "Division by zero" error.
*	Fixed an issue where Chrome and Safari were showing an overlap of the slides over the rest of the content in native galleries.
*	Updated translation file.

= 1.02 =

*	Added a UI panel for insertion of Photonic galleries through the Add Media screen.
*	Restructured code for better extensibility.
*	Updated translation file.

= 1.01 =

*	Included a PO file for translation support.
*	Fixed a bug to prevent appearance of Photonic stylesheets on other admin pages.

= 1.00 =

*	New version created.

== Upgrade Notice ==

= 2.10 =

Version 2.10 introduces Gutenberg support. Please read <a href='https://aquoid.com/plugins/photonic/gutenberg-support/'>the documentation</a> before you embark on using it. If you encounter any issues with Gutenberg support, please log a ticket on the <a href='https://wordpress.org/support/plugin/photonic/'>support forum</a>.

= 2.00 =

Version 2.00 is a major release, providing users with the ability to use an interactive workflow to insert / edit galleries, moving away from the traditional shortcode editor. If you encounter any issues with the interactive workflow, please log a ticket on the <a href='https://wordpress.org/support/plugin/photonic/'>support forum</a>.

= 1.57 =

Version 1.57 was a major release for the SmugMug API. If you were on older versions of the plugin and using SmugMug, please read <a href='https://aquoid.com/2016/12/smugmug-access-in-photonic-1-57/'>this article</a>.