<?php
if (!defined('ABSPATH')) {
	echo '<h1>WordPress not loaded!</h1>';
	exit;
}
?>
<div class="photonic-getting-started">
	<h1>Photonic - Getting Started</h1>
	<h3>Capabilities and Documentation</h3>
	<p>
		Photonic can show you photos and galleries not just from standard WordPress, but also from several third-party photo-hosting providers
		such as Flickr, SmugMug, Google Photos etc. The following table tells you what you need for each provider, and provides you with
		documentation links for how to show something using Photonic.
	</p>

	<table class="form-table photonic-form-table">
		<tr>
			<th rowspan="2" class="theader">Provider</th>
			<th rowspan="2" class="theader">What Do You Require?</th>
			<th colspan="4" class="theader">What Can You Show?</th>
			<th rowspan="2" class="theader">Authentication</th>
			<th rowspan="2" class="theader">Lightbox Support</th>
		</tr>

		<tr>
			<th class="theader">Single Photo<br/>(Level 0)</th>
			<th class="theader">Photos / Videos<br/>(Level 1)</th>
			<th class="theader">Albums / Sets / Galleries<br/>(Level 2)</th>
			<th class="theader">Collections / Groups<br/>(Level 3)</th>
		</tr>

		<tr>
			<th>Native WP</th>
			<td>Nothing extra needed; works out of the box</td>
			<td>Not supported</td>
			<td><a href="https://aquoid.com/plugins/photonic/wp-galleries/">Standard gallery photos</a>, no videos in WP galleries</td>
			<td><a href="https://aquoid.com/plugins/photonic/wp-galleries/">Standard galleries</a></td>
			<td>No such feature in WP</td>
			<td>No such feature in WP</td>
			<td>All</td>
		</tr>

		<tr>
			<th>Flickr</th>
			<td>
				<ul>
					<li><a href="http://www.flickr.com/services/api/misc.api_keys.html">API Key Required</a></li>
					<li>See <a href="https://aquoid.com/plugins/photonic/flickr/#api-key">Instructions</a></li>
				</ul>
			</td>
			<td><a href="https://aquoid.com/plugins/photonic/flickr/flickr-photo/">Supported</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/flickr/flickr-photos/">User Photos, Videos and Group Pools</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/flickr/flickr-photosets/">Albums / Photosets</a> and <a href="https://aquoid.com/plugins/photonic/flickr/flickr-galleries/">Galleries</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/flickr/flickr-collections/">Collections, with lazy loading</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/flickr/flickr-authentication/">Front-end / client-side / your visitors for private photos, back-end / server-side / yourself to display your private photos</a></td>
			<td>All; Image Lightbox, PrettyPhoto and StripJS cannot handle videos; Lightcase shows Flash videos for Flickr</td>
		</tr>

		<tr>
			<th>SmugMug</th>
			<td>
				<ul>
					<li>Nothing extra is needed for non-private photos; <a href="https://api.smugmug.com/api/developer/apply">API Key Required only for private photos</a></li>
					<li>See <a href="https://aquoid.com/plugins/photonic/smugmug/#api-key">Instructions</a></li>
					<li>Also see <a href="https://aquoid.com/2016/12/smugmug-access-in-photonic-1-57/">this</a></li>
				</ul>
			<td>Not supported</td>
			<td><a href="https://aquoid.com/plugins/photonic/smugmug/smugmug-photos/">User photos and videos</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/smugmug/smugmug-albums/">Albums</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/smugmug/smugmug-tree/">User tree</a> and <a href="https://aquoid.com/plugins/photonic/smugmug/folders/">Folders</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/smugmug/smugmug-albums/#protected">Password-protection</a>,  Front-end / client-side authentication for private photos, <a href="https://aquoid.com/plugins/photonic/authentication/#back-end">Back-end / server-side authentication to share your private photos</a> </td>
			<td>All; Image Lightbox, PrettyPhoto and StripJS cannot handle videos</td>
		</tr>

		<tr>
			<th>Google Photos</th>
			<td>
				<ul>
					<li><a href="https://console.developers.google.com/apis/">Client ID Required</a></li>
					<li>See <a href="https://aquoid.com/plugins/photonic/google-photos/#api-key">Instructions</a></li>
					<li>Also <a href="https://aquoid.com/plugins/photonic/google-photos/#auth">perform back-end authentication</a></li>
				</ul>
			</td>
			<td>Not supported</td>
			<td><a href="https://aquoid.com/plugins/photonic/google-photos/photos/">Photos and Videos</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/google-photos/albums/">Albums</a></td>
			<td>No such feature in Google Photos</td>
			<td><a href="https://aquoid.com/plugins/photonic/google-photos/#auth">Back-end authentication</a></td>
			<td>All; Fancybox, Featherlight, Image Lightbox, PrettyPhoto and StripJS cannot handle videos</td>
		</tr>

		<tr>
			<th>Zenfolio</th>
			<td>Nothing extra needed; works out of the box</td>
			<td><a href="https://aquoid.com/plugins/photonic/zenfolio/photos/#individual">Supported</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/zenfolio/photosets/">User</a> and <a href="https://aquoid.com/plugins/photonic/zenfolio/photos/">Generic</a> photos and videos</td>
			<td><a href="https://aquoid.com/plugins/photonic/zenfolio/photosets/">Photosets (Galleries and Collections)</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/zenfolio/groups/">Groups</a> and <a href="https://aquoid.com/plugins/photonic/zenfolio/group-hierarchy/">Group hierarchies</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/zenfolio/groups/">Password-protection supported</a>, authentication not supported</td>
			<td>All; Image Lightbox, PrettyPhoto and StripJS cannot handle videos</td>
		</tr>

		<tr>
			<th>Instagram</th>
			<td>No API key needed, but see <a href="https://aquoid.com/plugins/photonic/instagram/#auth-setup">instructions for authentication</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/instagram/#photo-of-the-day">Supported</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/instagram/#own-photos">User photos and videos</a></td>
			<td>No such feature in Instagram</td>
			<td>No such feature in Instagram</td>
			<td><a href="https://aquoid.com/plugins/photonic/instagram/#auth-setup">Back-end / server-side</a></td>
			<td>All; Image Lightbox, PrettyPhoto and StripJS cannot handle videos</td>
		</tr>

		<tr style="text-decoration: line-through;">
			<th>Picasa *</th>
			<td>
				<ul>
					<li><a href="https://console.developers.google.com/apis/">Client ID Required</a></li>
					<li>See <a href="https://aquoid.com/plugins/photonic/picasa/#api-key">Instructions</a></li>
					<li>Also <a href="https://aquoid.com/plugins/photonic/picasa/#back-end">perform back-end authentication</a></li>
				</ul>
			</td>
			<td>Not supported</td>
			<td><a href="https://aquoid.com/plugins/photonic/picasa/picasa-photos/">Photos and Videos</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/picasa/picasa-albums/">Albums</a></td>
			<td>No such feature in Google Photos</td>
			<td><a href="https://aquoid.com/plugins/photonic/picasa/picasa-albums/#private-protected">Authkey</a> and <a href="https://aquoid.com/plugins/photonic/picasa/#back-end">Back-end authentication</a></td>
			<td>All; Image Lightbox, PrettyPhoto and StripJS cannot handle videos</td>
		</tr>

		<tr style="text-decoration: line-through;">
			<th>500px **</th>
			<td>
				<ul>
					<li><a href="https://500px.com/settings/applications">Consumer Key Required</a></li>
					<li>See <a href="https://aquoid.com/plugins/photonic/500px/#setup">Instructions</a></li>
				</ul>
			</td>
			<td><a href="https://aquoid.com/plugins/photonic/500px/#single">Supported</a></td>
			<td><a href="https://aquoid.com/plugins/photonic/500px/#user-photos">User</a> and <a href="https://aquoid.com/plugins/photonic/500px/#generic">Generic</a> photos</td>
			<td><a href="https://aquoid.com/plugins/photonic/500px/#collections">Galleries</a></td>
			<td>No such feature in 500px</td>
			<td>Front-end for private photos</td>
			<td>All except Thickbox</td>
		</tr>

	</table>

	<em>* Google shut down access to the Picasa API in January 2019.</em><br/>
	<em>** 500px.com shut down its public API access from mid June 2018.</em>

	<h3>Showing a Gallery</h3>
	<p>
		While using the Classic Editor a gallery is displayed using the <code>[gallery]</code> shortcode. If the Gutenberg Block Editor is
		used a gallery is displayed using a Gutenberg Block instead. Given the plethora of options and configurations offered in Photonic,
		things have been made easier by virtue of a shortcode insertion UI. To use it:
	</p>

	<ol>
		<li>
			<h4>Getting Started</h4>
			If you are using the "Classic Editor" click on the "Add Media" button or the "Add / Edit Photonic Gallery" button:<br/>
			<img src="<?php echo plugins_url('screenshot-2.jpg', __FILE__); ?>" /><br/><br/>

			Correspondingly if you are using "Gutenberg" use the Photonic Gallery block:<br/>
			<img src="<?php echo plugins_url('screenshot-1.png', __FILE__); ?>" />
		</li>

		<li>
			<h4>Building a Gallery</h4>
			<ol>
				<li>
					<strong>Via "Add Media"</strong>
					<ol>
						<li>
							Click on the "Photonic" tab:<br/>
							<img src="<?php echo plugins_url('screenshot-5.jpg', __FILE__); ?>" /><br/>
						</li>
						<li>
							Pick your source:<br/>
							<img src="<?php echo plugins_url('screenshot-6.jpg', __FILE__); ?>" /><br/>
						</li>
						<li>
							Fill out the attributes for the gallery:<br/>
							<img src="<?php echo plugins_url('screenshot-8.png', __FILE__); ?>" /><br/>
						</li>
					</ol>
				</li>
				<li>
					<strong>Via "Add / Edit Photonic Gallery", or the "Photonic Gallery" block</strong>
					<ol>
						<li>
							You are presented with a screen to pick the source for your gallery:<br/>
							<img src="<?php echo plugins_url('screenshot-3.png', __FILE__); ?>" /><br/>
						</li>
						<li>
							You will be shown a contextual set of options based on your choices:<br/>
							<img src="<?php echo plugins_url('screenshot-4.png', __FILE__); ?>" /><br/>
						</li>
					</ol>
				</li>
			</ol>
		</li>
		<li>
			Depending on which gallery you inserted you will be shown a placeholder of this sort:<br/>
			<img src="<?php echo plugins_url('screenshot-7.png', __FILE__); ?>" />
		</li>
		<li>
			Clicking on the placeholder will let you edit the gallery you inserted.<br/>
			Note that if you are using the Visual Editor, you <em>may</em> encounter TinyMCE conflicts with other plugins. In case of such a conflict
			please <a href="https://wordpress.org/support/plugin/photonic/">report a bug</a>, and disable the Visual Editor integration from
			<em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Disable shortcode editing in Visual Editor</em>. The plugin will
			continue working normally &ndash; the only difference is that you will have to do shortcode edits by hand via the Text Editor rather than via a UI
			in the Visual Editor.
		</li>
	</ol>

	<h3>Gallery Layouts</h3>
	<p>
		Photonic supports the following types of layouts:
	</p>
	<ol>
		<li><a href="https://aquoid.com/plugins/photonic/layouts/#square">Square thumbnails</a></li>
		<li><a href="https://aquoid.com/plugins/photonic/layouts/#circle">Circular thumbnails</a></li>
		<li><a href="https://aquoid.com/plugins/photonic/layouts/#slideshow">Slideshow</a></li>
		<li><a href="https://aquoid.com/plugins/photonic/layouts/#justified">Random Justified Grid</a></li>
		<li><a href="https://aquoid.com/plugins/photonic/layouts/#masonry">Masonry</a></li>
		<li><a href="https://aquoid.com/plugins/photonic/layouts/#mosaic">Mosaic</a></li>
	</ol>
	<h3>Which Lightbox?</h3>
	<p>
		Photonic includes several lightboxes and supports some others that it cannot include due to licensing reasons. Each lightbox has
		its own strengths &mdash; some are lightweight, some are full-featured and some are very elegant looking. You can pick one based on the
		features that you feel are most important to you. Note that out-of-the-box, several of these don't support features such as touch gestures, or deep-linking,
		but for Photonic those capabilities have been integrated into the scripts via other approaches.
	</p>
	<table class="form-table photonic-form-table">
		<tr>
			<th class="theader">Lightbox</th>
			<th class="theader">Included in Photonic?</th>
			<th class="theader">Size</th>
			<th class="theader"><abbr title="When you open a gallery in a lightbox, this lets the lightbox run in a slideshow mode automatically without the user driving the navigation.">Auto-slideshow</abbr></th>
			<th class="theader"><abbr title="Deep-linking assigns a URL to every image in a gallery. If you enter that URL directly in a browser's address bar, it automatically opens the image in a lightbox.">Deep-linking</abbr></th>
			<th class="theader"><abbr title="If deep-linking is enabled, you have the option to display social sharing links. Photonic can help you share links on Facebook, Twitter and Google+.">Social Sharing</abbr></th>
			<th class="theader">Touch</th>
			<th class="theader">YouTube, Vimeo etc.</th>
			<th class="theader">HTML5 Videos from Flickr etc.</th>
			<th class="theader">External / Self-hosted MP4 videos</th>
			<th class="theader"><abbr title="This capability helps display thumbnails for all your images within the lightbox.">Thumbnails</abbr></th>
		</tr>

		<tr>
			<th><a href="http://colorpowered.com/colorbox/">Colorbox</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 10KB</li>
					<li>CSS: 5KB</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="http://fancybox.net/">Fancybox</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 16KB</li>
					<li>CSS: 9KB</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="http://fancyapps.com/fancybox/">Fancybox2</a></th>
			<td class="check"><span class="no">&times;</span></td>
			<td>
				<ul>
					<li>JS: 23KB</li>
					<li>CSS: 5KB</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
		</tr>

		<tr>
			<th><a href="http://fancyapps.com/fancybox/3/">Fancybox3</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 61KB</li>
					<li>CSS: 14KB</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
		</tr>

		<tr>
			<th><a href="http://noelboss.github.io/featherlight/">Featherlight</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 13KB</li>
					<li>CSS: 5KB</li>
				</ul>
			</td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="https://osvaldas.info/image-lightbox-responsive-touch-friendly">Image Lightbox</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 6KB</li>
					<li>CSS: 5KB</li>
				</ul>
			</td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="http://cornel.bopp-art.com/lightcase/">LightCase</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 25KB</li>
					<li>CSS: 16KB</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="https://sachinchoolur.github.io/lightGallery/">Lightgallery</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 18KB</li>
					<li>CSS: 20KB</li>
					<li>Fonts: 20KB</li>
					<li>+ Additional Plugins</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
		</tr>

		<tr>
			<th><a href="http://dimsemenov.com/plugins/magnific-popup/">Magnific Popup</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 20KB</li>
					<li>CSS: 7KB</li>
				</ul>
			</td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="http://photoswipe.com/">PhotoSwipe</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 41KB</li>
					<li>CSS: 16KB</li>
				</ul>
			</td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="http://www.no-margin-for-errors.com/projects/prettyphoto-jquery-lightbox-clone/">PrettyPhoto</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 23KB</li>
					<li>CSS: 27KB</li>
				</ul>
			</td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
		</tr>

		<tr>
			<th><a href='http://stripjs.com'>Strip</a></th>
			<td class="check"><span class="no">&times;</span></td>
			<td>
				<ul>
					<li>JS: 39KB</li>
					<li>CSS: 13KB</li>
				</ul>
			</td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

		<tr>
			<th><a href="http://brutaldesign.github.io/swipebox/">Swipebox</a></th>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td>
				<ul>
					<li>JS: 12KB</li>
					<li>CSS: 5KB</li>
				</ul>
			</td>
			<td class="check"><span class="no">&times;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="yes">&#x2713;</span></td>
			<td class="check"><span class="no">&times;</span></td>
		</tr>

	</table>

	<h2>The Secret Menu</h2>
	<p>
		While the shortcode generator for Photonic is fairly comprehensive, there are some additional hidden shortcode parameters that you can use. These are baked into the
		interactive shortcode builder / Photonic block for Gutenberg, but will not show up in the traditional shortcode interface:
	</p>
	<ol>
		<li><code>title_position</code> &ndash; Takes values <code>none</code>, <code>regular</code>, <code>tooltip</code>, <code>below</code>, <code>hover-slideup-show</code> and <code>slideup-stick</code>. It overrides the title positioning that you have set for that particular provider through your options.</li>
		<li><code>headers</code> &ndash; Takes a comma-separated list containing none or more of <code>thumbnail</code>, <code>title</code>, and <code>counter</code>.
			If a value is specified, that particular component will be shown in the level 2 entity's (i.e. album / gallery / set) header, regardless of the back-end options.
			So, setting <code>headers='title,counter'</code> for a particular call to display a Zenfolio set, will show the title and photo-count for that set in the header, and not its thumbnail.</li>
		<li><code>fx</code> &ndash; Applicable to slideshow layouts. Takes values <code>fade</code> and <code>slide</code> to provide the transitioning effect between slides.</li>
		<li><code>speed</code> &ndash; Applicable to slideshow layouts. Takes numeric values in milliseconds, determines the speed of transitioning of slides.</li>
		<li><code>timeout</code> &ndash; Applicable to slideshow layouts. Takes numeric values in milliseconds, determines the pause between two slides.</li>
		<li><code>pause</code> &ndash; Applicable to slideshow layouts. Takes values <code>0</code> (no pause) and <code>1</code> (pause), determines if the slideshow should pause upon hovering on it.</li>
		<li><code>controls</code> &ndash; Applicable to slideshow layouts. Takes values <code>show</code> and <code>hide</code>, and shows "Previous" and "Next" buttons on the slideshow.</li>
		<li><code>strip-style</code> &ndash; Applicable to slideshow layouts. Takes values <code>thumbs</code> and <code>button</code>. If set, and if the <code>layout</code> / <code>style</code> parameter is set to <code>strip-below</code>, <code>strip-above</code>, <code>strip-right</code>, it shows buttons <strong>below</strong> the slideshow.</li>
		<li><code>popup</code> &ndash; Takes values <code>show</code> and <code>hide</code>. If set, and if a level 2 thumbnail (i.e. an Album, Photoset or Gallery thumbnail) is being displayed, this setting overrides <em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Overlaid Popup Panel &rarr; Enable Interim Popup for Album Thumbnails</em>.</li>
	</ol>

	<h2>The Helper Shortcode</h2>
	<p>
		There is a second utility shortcode present in the plugin, which displays the output of the helpers but <em>in the front-end</em>.
	</p>
	<ol>
		<li><strong>Short-code: </strong><code>photonic_helper</code></li>
		<li>
			<strong>Attributes: </strong> This primary attribute is <code>type</code>. Depending on the value of <code>type</code> other attributes can be passed:
			<ol>
				<li>
					<code>type='flickr'</code> - Additional attributes:
					<ol>
						<li><code>user='xxx'</code> - Passing the user name (i.e. from https://flickr.com/photos/xxx) will get the user_id for use in the Flickr shortcode</li>
						<li><code>group='yyy'</code> - Passing the group name will get the group_id for use in the Flickr shortcode</li>
					</ol>
				</li>
				<li>
					<code>type='google'</code> - This takes no additional parameters, and prints out the user's Google Photos albums in tabular form
				</li>
			</ol>
		</li>
	</ol>

	<h2>The Really Technical Stuff</h2>
	<p>
		You are running PHP with the following details:
	</p>
	<table class="form-table photonic-form-table">
		<tr>
			<th>PHP Version</th>
			<td><?php echo phpversion(); ?></td>
		</tr>
		<tr>
			<th>Loaded Extensions</th>
			<td><?php echo implode(', ', get_loaded_extensions()); ?></td>
		</tr>
	</table>
</div><!-- .photonic-getting-started -->