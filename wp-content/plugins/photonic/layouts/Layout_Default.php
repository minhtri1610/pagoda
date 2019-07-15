<?php

/**
 * Layout Manager to generate the grid layouts and the "Justified Grid" layout, all of which use the same markup. The Justified Grid layout is
 * modified by JS on the front-end, however the base markup for it is similar to the square and circular thumbnails layout.
 *
 * All other layout managers extend this, and might implement their own versions of generate_level_1_gallery and generate_level_2_gallery
 *
 * @package Photonic
 * @subpackage Layouts
 */
class Photonic_Layout {
	private $library;

	function __construct() {
		global $photonic_slideshow_library, $photonic_custom_lightbox;
		if ($photonic_slideshow_library != 'custom') {
			$this->library = $photonic_slideshow_library;
		}
		else {
			$this->library = $photonic_custom_lightbox;
		}
	}

	/**
	 * Generates the markup for a single photo.
	 *
	 * @param $data array Pertinent pieces of information about the photo - the source (src), the photo page (href), title and caption
	 * @param $processor Photonic_Processor The object calling this. A CSS class is created in the header, photonic-single-<code>$processor->provider</code>-photo-header
	 * @return string
	 */
	function generate_single_photo_markup($data, $processor) {
		$processor->push_to_stack('Generate single photo markup');
		$ret = '';
		$photo = array_merge(
			array('src' => '', 'href' => '', 'title' => '', 'caption' => ''),
			$data
		);

		if (empty($photo['src'])) {
			$processor->pop_from_stack();
			return $ret;
		}

		global $photonic_external_links_in_new_tab;
		if (!empty($photo['title'])) {
			$ret .= "\t".'<h3 class="photonic-single-photo-header photonic-single-'.$processor->provider.'-photo-header">'.$photo['title']."</h3>\n";
		}

		$img = '<img src="'.$photo['src'].'" alt="'.esc_attr(empty($photo['caption']) ? $photo['title'] : $photo['caption']).'" />';
		if (!empty($photo['href'])) {
			$img = '<a href="'.$photo['href'].'" title="'.esc_attr(empty($photo['caption']) ? $photo['title'] : $photo['caption']).'" '.
				(!empty($photonic_external_links_in_new_tab) ? ' target="_blank" ' : '').'>'.$img.'</a>';
		}

		if (!empty($photo['caption'])) {
			$ret .= "\t".'<div class="wp-caption">'."\n\t\t".$img."\n\t\t".'<div class="wp-caption-text">'.$photo['caption']."</div>\n\t</div><!-- .wp-caption -->\n";
		}
		else {
			$ret .= $img;
		}

		$processor->pop_from_stack();
		return $ret;
	}

	/**
	 * Generates the HTML for the lowest level gallery, i.e. the photos. This is used for both, in-page and popup displays.
	 * The code for the random layouts is handled in JS, but just the HTML markers for it are provided here.
	 *
	 * @param $photos
	 * @param array $options
	 * @param $short_code
	 * @param $processor Photonic_Processor
	 * @return string
	 */
	function generate_level_1_gallery($photos, $options, $short_code, $processor) {
		$processor->push_to_stack('Generate level 1 gallery');
		$layout = !empty($short_code['layout']) ? $short_code['layout'] : 'square';
		$columns = !empty($short_code['columns']) && ($layout !== 'random' && $layout !== 'mosaic') ? $short_code['columns'] : 'auto';
		$display = !empty($short_code['display']) ? $short_code['display'] : 'in-page';
		$more = !empty($short_code['more']) ? esc_attr($short_code['more']) : '';
		$more = (empty($more) && !empty($short_code['photo_more'])) ? esc_attr($short_code['photo_more']) : $more;
		$panel = !empty($short_code['panel']) ? $short_code['panel'] : '';

		$title_position = empty($short_code['title_position']) ? $options['title_position'] : $short_code['title_position'];
		$row_constraints = isset($options['row_constraints']) && is_array($options['row_constraints']) ? $options['row_constraints'] : array();
		$sizes = isset($options['sizes']) && is_array($options['sizes']) ? $options['sizes'] : array();
		$show_lightbox = !isset($options['show_lightbox']) ? true: $options['show_lightbox'];
		$type = !empty($options['type']) ? $options['type'] : 'photo';
		$parent = !empty($options['parent']) ? $options['parent'] : 'stream';
		$pagination = isset($options['level_2_meta']) && is_array($options['level_2_meta']) ? $options['level_2_meta'] : array();
		$indent = !isset($options['indent']) ? "\t" : $options['indent'];

		if ($short_code['display'] != 'popup') {
			$container_id = "id='photonic-{$processor->provider}-stream-{$processor->gallery_index}-container'";
			$container_end = "photonic-{$processor->provider}-stream-{$processor->gallery_index}-container-end";
		}
		else {
			$container_id = "id='photonic-{$processor->provider}-panel-" . $short_code['panel'] . "-container'";
			$container_end = "photonic-{$processor->provider}-panel-{$short_code['panel']}-container-end";
		}

		$non_standard = $layout == 'random' || $layout == 'masonry' || $layout == 'mosaic';

		$col_class = '';
		if (absint($columns)) {
			$col_class = 'photonic-gallery-'.$columns.'c';
		}

		if ($col_class == '' && $row_constraints['constraint-type'] == 'padding') {
			$col_class = 'photonic-pad-photos';
		}
		else if ($col_class == '') {
			$col_class = 'photonic-gallery-'.$row_constraints['count'].'c';
		}
		$col_class .= ' photonic-level-1 photonic-thumb photonic-thumb-'.$layout;

		$link_attributes = $this->get_lightbox_attributes($show_lightbox, $panel, $processor);
		$link_attributes_text = $this->get_text_from_link_attributes($link_attributes);

		$effect = $this->get_thumbnail_effect($short_code, $layout, $title_position);
		$ul_class = "class='title-display-$title_position photonic-level-1-container ".($non_standard ? 'photonic-'.$layout.'-layout' : 'photonic-standard-layout')." photonic-thumbnail-effect-$effect'";
		if ($display == 'popup') {
			$ul_class = "class='slideshow-grid-panel lib-{$this->library} photonic-level-1-container title-display-$title_position'";
		}

		$ret = '';
		if (!$non_standard && $display != 'popup') {
			$container_tag = 'ul';
			$element_tag = 'li';
		}
		else {
			$container_tag = 'div';
			$element_tag = 'div';
		}

		$pagination_data = '';
		if (!empty($pagination)) {
			$pagination_data = array();
			// Should have total, start, end, per-page
			foreach ($pagination as $meta => $value) {
				$pagination_data[] = 'data-photonic-stream-'.$meta.'="'.$value.'"';
			}

			$pagination_data = implode(' ', $pagination_data);
			$pagination_data .= ' data-photonic-stream-provider="'.$processor->provider.'"';
		}

		$to_be_glued = '';
		if (!empty($short_code)) {
			$to_be_glued = array();
			foreach ($short_code as $name => $value) {
				if (is_scalar($value)) {
					$to_be_glued[] = $name.'='.$value;
				}
			}
			if (!empty($pagination['next-token'])) {
				$to_be_glued[] = 'next_token='.$pagination['next-token'];
			}
			$to_be_glued = implode('&',$to_be_glued);
			$to_be_glued = esc_attr($to_be_glued);
		}

		$pagination_data .= ' data-photonic-stream-query="'.$to_be_glued.'"';
		$columns_data = ' data-photonic-gallery-columns="'.$columns.'"';

		$start_with = "$indent<$container_tag $container_id $ul_class $pagination_data $columns_data>\n";
		$ret .= $start_with;

		global $photonic_external_links_in_new_tab;
		if (!empty($photonic_external_links_in_new_tab)) {
			$target = " target='_blank' ";
		}
		else {
			$target = '';
		}

		$counter = 0;
		$thumbnail_class = " class='$layout' ";

		$element_start = "$indent\t<".$element_tag.' class="photonic-'.$processor->provider.'-image photonic-'.$processor->provider.'-'.$type.' '.$col_class.'">'."\n";
		foreach ($photos as $photo) {
			$counter++;

			$thumb = ($non_standard && $display == 'in-page') ? (isset($photo['tile_image']) ? $photo['tile_image'] : $photo['main_image']) : $photo['thumbnail'];
			$orig = empty($photo['video']) ? $photo['main_image'] : $photo['video'];
//			$orig = $photo['main_image'];
			$url = isset($photo['main_page']) ? $photo['main_page'] : '';
			$title = esc_attr($photo['title']);
			$description = esc_attr($photo['description']);
			$alt = esc_attr($photo['alt_title']);
			$orig = ($this->library == 'none' || !$show_lightbox) ? $url : $orig;

			$title = empty($title) ? ((empty($alt) && $processor->link_lightbox_title && $this->library != 'thickbox') ? apply_filters('photonic_default_lightbox_text', esc_attr__('View', 'photonic')) : $alt) : $title;
			$ret .= $element_start;

			$deep_value = 'gallery[photonic-'.$processor->provider.'-'.$parent.'-'.(empty($panel) ? $processor->gallery_index : $panel).']/'.(empty($photo['id']) ? $counter : $photo['id']).'/';
			$deep_link = ' data-photonic-deep="'.$deep_value.'" ';

			$buy = '';
			if (!empty($photo['buy_link']) && $processor->show_buy_link) {
				$buy = ' data-photonic-buy="'.$photo['buy_link'].'" ';
			}

			$style = array();
			if (!empty($sizes['thumb-width'])) $style[] = 'width:'.$sizes['thumb-width'].'px';
			if (!empty($sizes['thumb-height'])) $style[] = 'height:'.$sizes['thumb-height'].'px';
			if (!empty($style)) $style = 'style="'.implode(';', $style).'"'; else $style = '';
			if ($processor->link_lightbox_title && $this->library != 'thickbox' && !empty($url)) {
				$title_link_start = esc_attr("<a href='$url' $target>");
				$title_link_end = esc_attr("</a>");
			}
			else {
				$title_link_start = '';
				$title_link_end = '';
			}

			if (!empty($short_code['caption']) && ($short_code['caption'] == 'desc' || ($short_code['caption'] == 'title-desc' && empty($title)) || ($short_code['caption'] == 'desc-title' && !empty($description)))) {
				$title = $description;
			}
			else if (empty($short_code['caption']) || (($short_code['caption'] == 'desc-title' && empty($title)) || $short_code['caption'] == 'none')) {
				$title = '';
			}

			if (!empty($title)) {
				$title_markup = $title_link_start.esc_attr($title).$title_link_end;
				$title_markup = apply_filters('photonic_lightbox_title_markup', $title_markup);
			}
			else {
				$title_markup = '';
			}

			if ($processor->link_lightbox_title && $this->library != 'thickbox' && !empty($photo['buy_link']) && $processor->show_buy_link) {
				$buy_link = esc_attr('<a class="photonic-buy-link" href="'.$photo['buy_link'].'" target="_blank" title="'.__('Buy', 'photonic').'"><div class="icon-buy"></div></a>');
				$title_markup .= $buy_link;
			}

			$shown_title = '';
			if (in_array($title_position, array('below', 'hover-slideup-show', 'hover-slidedown-show', 'slideup-stick')) && !empty($title)) {
				$shown_title = '<div class="photonic-title-info"><div class="photonic-photo-title photonic-title">'.wp_specialchars_decode($title, ENT_QUOTES).'</div></div>';
			}

			$photo_data = array('title' => $title_markup, 'deep' => $deep_value, 'raw_title' => $title, 'href' => $orig);
			if (!empty($photo['download'])) {
				$photo_data['download'] = $photo['download'];
			}
			if (!empty($photo['video'])) {
				$photo_data['video'] = $photo['video'];
			}
			else {
				$photo_data['image'] = $photo['main_image'];
			}
			$photo_data['provider'] = $processor->provider;
			$photo_data['gallery_index'] = $processor->gallery_index;
			$photo_data['id'] = $photo['id'];

			$lb_specific_data = $this->get_lightbox_specific_photo_data($photo_data, $processor);
			if (!empty($photo['video'])) {
				$lb_specific_data .= ' data-photonic-media-type="video" ';
			}
			else {
				$lb_specific_data .= ' data-photonic-media-type="image" ';
			}
			if (!empty($photo['video']) && $this->library == 'lightgallery') {
				$video_id = $processor->provider.'-'.$processor->gallery_index.'-'.$photo['id'];
				$ret .= $indent."\t\t".'<div style="display:none;" id="photonic-video-'.$video_id.'">'."\n";
				$ret .= $indent."\t\t\t".'<video class="lg-video-object lg-html5 photonic" controls preload="none">'."\n";
				$ret .= $indent."\t\t\t\t".'<source src="'.$photo['video'].'" type="'.(!empty($photo['mime']) ? $photo['mime']: 'video/mp4').'">'."\n";
				$ret .=	$indent."\t\t\t\t".esc_html__('Your browser does not support HTML5 videos.', 'photonic')."\n";
				$ret .= $indent."\t\t\t".'</video>'."\n";
				$ret .= $indent."\t\t".'</div>'."\n";

				$orig = ''; // href should be blank
			}
			else if (!empty($photo['video']) && (in_array($this->library, array('colorbox', 'fancybox', 'fancybox2', 'magnific', 'photoswipe', 'swipebox', ))
					|| (in_array($this->library, array('fancybox3')) && in_array($processor->provider, array('flickr', 'google')))
				)) {
				$video_id = $processor->provider.'-'.$processor->gallery_index.'-'.$photo['id'];
				$ret .= $indent."\t\t".'<div class="photonic-html5-external" id="photonic-video-'.$video_id.'">'."\n";
				$ret .= $indent."\t\t\t".'<video class="photonic" controls preload="none">'."\n";
				$ret .= $indent."\t\t\t\t".'<source src="'.$photo['video'].'" type="'.(!empty($photo['mime']) ? $photo['mime']: 'video/mp4').'">'."\n";
				$ret .=	$indent."\t\t\t\t".esc_html__('Your browser does not support HTML5 videos.', 'photonic')."\n";
				$ret .= $indent."\t\t\t".'</video>'."\n";
				$ret .= $indent."\t\t".'</div>'."\n";

				$orig = '#photonic-video-'.$video_id;
			}

			if ($this->library == 'magnific') {
				$magnific = !empty($photo['video']) ? 'mfp-inline' : 'mfp-image';
				$link_attributes['class']['magnific'] = $magnific;
				$link_attributes_text = $this->get_text_from_link_attributes($link_attributes);
			}

			if ($title_position == 'tooltip') {
				$tooltip = 'data-photonic-tooltip="'.esc_attr($title).'" ';
			}
			else {
				$tooltip = '';
			}
			$ret .= $indent."\t\t".'<a '.$link_attributes_text.' href="'.$orig.'" title="'.($title_position != 'none' ? esc_attr($title) : '').'" data-title="'.$title_markup.'" '.$tooltip.' '.$lb_specific_data.' '.$target.$deep_link.$buy.">\n";
			$ret .= $indent."\t\t\t".'<img alt="'.$alt.'" src="'.$thumb.'" '.$style.$thumbnail_class."/>\n";
			$ret .= $indent."\t\t\t".$shown_title."\n";
			$ret .= $indent."\t\t"."</a>\n";
			$ret .= $indent."\t"."</$element_tag>\n";
		}

		$ret = trim($ret);
		if ($ret != $start_with) {
			$trailing = strlen($element_tag) + 3;
			if (substr($ret, -$trailing) != "</$element_tag>" && $short_code['popup'] == 'show' && !$non_standard) {
				$ret .= "\n$indent</$element_tag><!-- last $element_tag.photonic-pad-photos -->";
			}

			$ret .= "\n$indent</$container_tag> <!-- ./photonic-level-1-container -->\n";
			$ret .= "<span id='$container_end'></span>";

			if (!empty($pagination) && isset($pagination['end']) && isset($pagination['total']) && $pagination['total'] > $pagination['end']) {
				$ret .= !empty($more) ? "<a href='#' class='photonic-more-button photonic-more-dynamic'>$more</a>\n" : '';
			}
		}
		else {
			$ret = '';
		}

		if (is_archive() || is_home()) {
			global $photonic_archive_thumbs;
			if (!empty($photonic_archive_thumbs) && $counter < $photonic_archive_thumbs) {
				$processor->is_more_required = false;
			}
		}

		$processor->pop_from_stack();
		return $ret;
	}

	/**
	 * Generates the HTML for a group of level-2 items, i.e. Photosets (Albums) and Galleries for Flickr, Albums for Google Photos,
	 * Albums for SmugMug, and Photosets (Galleries and Collections) for Zenfolio. No concept of albums
	 * exists in native WP and Instagram.
	 *
	 * @param $objects
	 * @param $options
	 * @param $short_code
	 * @param $processor Photonic_Processor
	 * @return string
	 */
	function generate_level_2_gallery($objects, $options, $short_code, $processor) {
		$processor->push_to_stack('Generate Level 2 Gallery');
		$row_constraints = isset($options['row_constraints']) && is_array($options['row_constraints']) ? $options['row_constraints'] : array();
		$type = $options['type'];
		$singular_type = $options['singular_type'];
		$title_position = empty($short_code['title_position']) ? $options['title_position'] : $short_code['title_position'];
		$level_1_count_display = $options['level_1_count_display'];
		$indent = !isset($options['indent']) ? '' : $options['indent'];
		$provider = $processor->provider;

		$columns = $short_code['columns'];
		$layout = !isset($short_code['layout']) ? 'square' : $short_code['layout'];
		$popup = ' data-photonic-popup="'.$short_code['popup'].'"';

		$non_standard = $layout == 'random' || $layout == 'masonry' || $layout == 'mosaic';
		$effect = $this->get_thumbnail_effect($short_code, $layout, $title_position);
		$ul_class = "class='title-display-$title_position photonic-level-2-container ".($non_standard ? 'photonic-'.$layout.'-layout' : 'photonic-standard-layout')." photonic-thumbnail-effect-$effect'";

		if ($short_code['display'] != 'popup') {
			$container_id = "id='photonic-{$processor->provider}-stream-{$processor->gallery_index}-container'";
			$container_end = "photonic-{$processor->provider}-stream-{$processor->gallery_index}-container-end";
		}
		else {
			$container_id = "id='photonic-{$processor->provider}-panel-" . $short_code['panel'] . "-container'";
			$container_end = "photonic-{$processor->provider}-panel-{$short_code['panel']}-container-end";
		}

		$pagination = isset($options['pagination']) && is_array($options['pagination']) ? $options['pagination'] : array();
		$more = !empty($short_code['more']) ? esc_attr($short_code['more']) : '';

		$pagination_data = '';
		if (!empty($pagination)) {
			$pagination_data = array();
			// Should have total, start, end, per-page
			foreach ($pagination as $meta => $value) {
				$pagination_data[] = 'data-photonic-stream-'.$meta.'="'.$value.'"';
			}

			$pagination_data = implode(' ', $pagination_data);
			$pagination_data .= ' data-photonic-stream-provider="'.$processor->provider.'"';
		}

		$to_be_glued = '';
		if (!empty($short_code)) {
			$to_be_glued = array();
			foreach ($short_code as $name => $value) {
				if (is_scalar($value)) {
					$to_be_glued[] = $name.'='.$value;
				}
			}
			if (!empty($pagination['next-token'])) {
				$to_be_glued[] = 'next_token='.$pagination['next-token'];
			}
			$to_be_glued = implode('&',$to_be_glued);
			$to_be_glued = esc_attr($to_be_glued);
		}

		$pagination_data .= ' data-photonic-stream-query="'.$to_be_glued.'"';
		$columns_data = ' data-photonic-gallery-columns="'.$columns.'"';

		$ret = "\n$indent<ul $container_id $ul_class $pagination_data $columns_data>";
		if ($non_standard) {
			$ret = "\n$indent<div $container_id $ul_class $pagination_data $columns_data>";
		}

		if ($columns != 'auto') {
			$col_class = 'photonic-gallery-'.$columns.'c';
		}
		else if ($row_constraints['constraint-type'] == 'padding') {
			$col_class = 'photonic-pad-'.$type;
		}
		else {
			$col_class = 'photonic-gallery-'.$row_constraints['count'].'c';
		}

		$col_class .= ' photonic-level-2 photonic-thumb';

		$counter = 0;
		foreach ($objects as $object) {
			$data_attributes = isset($object['data_attributes']) && is_array($object['data_attributes']) ? $object['data_attributes'] : array();
			$data_attributes['provider'] = $provider;
			$data_attributes['singular'] = $singular_type;
			$data_array = array();
			foreach ($data_attributes as $attr => $value) {
				$data_array[] = 'data-photonic-'.$attr.'="'.$value.'"';
			}

			$data_array = implode(' ', $data_array);


			$id = empty($object['id_1']) ? '' : $object['id_1'].'-';
			$id = $id.$processor->gallery_index;
			$id = empty($object['id_2']) ? $id : ($id.'-'.$object['id_2']);
			$title = esc_attr($object['title']);
			$image = "<img src='".(($non_standard && isset($object['tile_image'])) ? $object['tile_image'] : $object['thumbnail'])."' alt='".$title."' class='$layout'/>";
			$additional_classes = !empty($object['classes']) ? implode(' ', $object['classes']) : '';
			$realm_class = '';
			if (!empty($object['classes'])) {
				foreach ($object['classes'] as $class) {
					if (stripos($class, 'photonic-'.$provider.'-realm') !== FALSE) {
						$realm_class = $class;
					}
				}
			}
			if ($title_position == 'tooltip') {
				$tooltip = "data-photonic-tooltip='".esc_attr($title)."' ";
			}
			else {
				$tooltip = '';
			}
			$anchor = "\n{$indent}\t\t<a href='{$object['main_page']}' class='photonic-{$provider}-{$singular_type}-thumb photonic-level-2-thumb $additional_classes' id='photonic-{$provider}-$singular_type-thumb-$id' title='".($title_position != 'none' ? esc_attr($title) : '')."' data-title='".$title."' $tooltip $data_array$popup>\n$indent\t\t\t".$image;
			$text = '';
			if (in_array($title_position, array('below', 'hover-slideup-show', 'hover-slidedown-show', 'slideup-stick'))) {
				$text = "\n{$indent}\t\t\t<div class='photonic-title-info'>\n{$indent}\t\t\t\t<div class='photonic-$singular_type-title photonic-title'>".$title."";
				if (!$level_1_count_display && !empty($object['counter'])) {
					$text .= '<span class="photonic-title-photo-count photonic-'.$singular_type.'-photo-count">'.sprintf(esc_html__('%s photos', 'photonic'), $object['counter']).'</span>';
				}
			}
			if ($text != '') {
				$text .= "</div>\n{$indent}\t\t\t</div>";
			}

			$anchor .= $text."\n{$indent}\t\t</a>";
			$password_prompt = '';
			if (!empty($object['passworded'])) {
				$prompt_title = esc_attr__('Protected Content', 'photonic');
				$prompt_submit = esc_attr__('Access', 'photonic');
				$password_type = " type='password' ";
				$prompt_type = 'password';
				$prompt_text = esc_attr__('This album is password-protected. Please provide a valid password.', 'photonic');
				if (in_array("photonic-$provider-passworded-authkey", $object['classes'])) {
					$prompt_text = esc_attr__('This album is protected. Please provide a valid authorization key.', 'photonic');
				}
				else if (in_array("photonic-$provider-passworded-link", $object['classes'])) {
					$prompt_text = esc_attr__('This album is protected. Please provide the short-link for it.', 'photonic');
					$password_type = '';
					$prompt_type = 'link';
				}

				$password_prompt = "
							<div class='photonic-password-prompter $realm_class' id='photonic-{$provider}-$singular_type-prompter-$id' title='$prompt_title' data-photonic-prompt='$prompt_type'>
								<div class='photonic-password-prompter-content'>
									<div class='photonic-prompt-head'>
										<h3>
											<span class='title'>$prompt_title</span>
											<button class='close'>&times;</button>
										</h3>
									</div>
									<div class='photonic-prompt-body'>
										<p>$prompt_text</p>
										<input $password_type name='photonic-{$provider}-password' />
										<button class='photonic-{$provider}-submit photonic-password-submit confirm'>$prompt_submit</button>
									</div>
								</div>
							</div>";
			}

			if ($non_standard) {
				$ret .= "\n$indent\t<div class='photonic-{$provider}-image photonic-{$provider}-$singular_type-thumb $col_class' id='photonic-{$provider}-$singular_type-$id'>{$anchor}{$password_prompt}\n$indent\t</div>";
			}
			else {
				$ret .= "\n$indent\t<li class='photonic-{$provider}-image photonic-{$provider}-$singular_type-thumb $col_class' id='photonic-{$provider}-$singular_type-$id'>{$anchor}{$password_prompt}\n$indent\t</li>";
			}
			$counter++;
		}

		if ($ret != "\n$indent<ul $container_id $ul_class $pagination_data $columns_data>" && !$non_standard) {
			$ret .= "\n$indent</ul>\n";
		}
		else if ($non_standard) {
			$ret .= "\n$indent</div>\n";
		}
		else {
			$ret = '';
		}

		if (!empty($ret)) {
			$ret .= "<span id='$container_end'></span>";
			if (!empty($pagination) && isset($pagination['end']) && isset($pagination['total']) && $pagination['total'] > $pagination['end']) {
				$ret .= !empty($more) ? "<a href='#' class='photonic-more-button photonic-more-dynamic'>$more</a>\n" : '';
			}
		}

		if (is_archive() || is_home()) {
			global $photonic_archive_thumbs;
			if (!empty($photonic_archive_thumbs) && $counter < $photonic_archive_thumbs) {
				$processor->is_more_required = false;
			}
		}

		$processor->pop_from_stack();
		return $ret;
	}

	/**
	 * Depending on the lightbox library, this function provides the CSS class and the rel tag for the thumbnail. This method borrows heavily from
	 * Justin Tadlock's Cleaner Gallery Plugin.
	 *
	 * @param $show_lightbox
	 * @param $rel_id
	 * @param $processor
	 * @return array
	 */
	function get_lightbox_attributes($show_lightbox, $rel_id, $processor) {
		global $photonic_slideshow_mode;
		$rel = '';
		$ret = array(
			'class' => array(),
			'rel' => array(),
			'specific' => array(),
		);

		if ($this->library != 'none' && $show_lightbox) {
			$ret['class'] = array('photonic-launch-gallery', 'launch-gallery-'.$this->library, $this->library);
			$rel = 'lightbox-photonic-'.$processor->provider.'-stream-'.(empty($rel_id) ? $processor->gallery_index : $rel_id);
			$ret['rel'] = array($rel);

			switch ($this->library) {
				case 'lightbox':
				case 'jquery_lightbox_plugin':
				case 'jquery_lightbox_balupton':
					$ret['class'] = array('launch-gallery-lightbox', 'lightbox');
					$ret['rel'] = array("lightbox[{$rel}]");
					break;

				case 'fancybox2':
					$ret['class'] = array('photonic-launch-gallery', 'launch-gallery-fancybox', 'fancybox');
					break;

				case 'fancybox3':
					$ret['class'] = array('photonic-launch-gallery', 'launch-gallery-fancybox', 'fancybox');
					$ret['specific'] = array(
						'data-fancybox' => array($rel),
					);
					break;

				case 'prettyphoto':
					$ret['rel'] = array("photonic-prettyPhoto[{$rel}]");
					break;

				case 'featherlight':
					$ret['class'] = array('photonic-launch-gallery', 'launch-gallery-featherlight');
					break;

				case 'lightcase':
					$ret['specific'] = array(
						'data-rel' => array('lightcase:lightbox-photonic-'.$processor->provider.'-stream-'.(empty($rel_id) ? $processor->gallery_index : $rel_id).((isset($photonic_slideshow_mode) && $photonic_slideshow_mode == 'on') ? ':slideshow' : '')),
					);
					break;

				case 'strip':
					global $photonic_lightbox_no_loop;
					$ret['specific'] = array(
						'data-strip-group' => array($rel),
					);
					if (!empty($photonic_lightbox_no_loop)) {
						$ret['specific']['data-strip-group-options'] = array("loop: false");
					}
					break;

				default:
					$ret['class'] = array('photonic-launch-gallery', 'launch-gallery-'.$this->library, $this->library);
					$ret['rel'] = array('lightbox-photonic-'.$processor->provider.'-stream-'.(empty($rel_id) ? $processor->gallery_index : $rel_id));
					break;
			}
		}

		return $ret;
	}

	/**
	 * @param array $link_attributes
	 * @return string
	 */
	function get_text_from_link_attributes($link_attributes) {
		$class = '';
		$rel = '';
		$specific = '';
		if (!empty($link_attributes['class'])) {
			$class = " class='".implode(' ', array_values($link_attributes['class']))."' ";
		}

		if (!empty($link_attributes['rel'])) {
			$rel = " rel='".implode(' ', $link_attributes['rel'])."' ";
		}

		if (!empty($link_attributes['specific'])) {
			foreach ($link_attributes['specific'] as $key => $val) {
				$specific .= $key.'="'.implode(' ', $val).'" ';
			}
		}
		return $class.$rel.$specific;
	}

	/**
	 * Some lightboxes require some additional attributes for individual photos. E.g. Lightgallery requires something to show the title etc.
	 * This method returns such additional information. Not to be confused with <code>get_lightbox_attributes</code>, which
	 * returns information for the gallery as a whole.
	 *
	 * @param $photo_data
	 * @return string
	 */
	function get_lightbox_specific_photo_data($photo_data, $processor) {
		if ($this->library == 'lightgallery') {
			$download = !empty($photo_data['download']) ? 'data-download-url="'.$photo_data['download'].'" ' : '';
			$video = !empty($photo_data['video']) ? ' data-html="#photonic-video-'.$processor->provider.'-'.$processor->gallery_index.'-'.$photo_data['id'].'" ' : '';
			return ' data-sub-html="'.$photo_data['title'].'" '.$video.$download;
		}
		else if ($this->library == 'strip') {
			return ' data-strip-caption="'.$photo_data['title'].'" data-strip-options="onShow: function(a) { photonicStripSetHash('."'{$photo_data['deep']}'".'); }, afterHide: function() { photonicStripUnsetHash(); } " ';
		}
		else if ($this->library == 'lightcase' && $processor->provider == 'google') {
			if (empty($photo_data['video'])) {
				return " data-lc-options='{\"type\": \"image\"}' ";
			}
			else {
				return " data-lc-options='{\"type\": \"video\"}' ";
			}
		}
		else if ($this->library == 'fancybox' && $processor->provider == 'google') {
			if (empty($photo_data['video'])) {
				return " data-fancybox='{type: \"image\"}' ";
			}
		}
		else if ($this->library == 'fancybox2' && $processor->provider == 'google') {
			if (empty($photo_data['video'])) {
				return " data-fancybox-type='image' ";
			}
		}
		else if (in_array($this->library, array('colorbox', 'fancybox', 'fancybox2', 'photoswipe', 'swipebox', )) ||
				(in_array($this->library, array('fancybox3', 'lightcase')) && in_array($processor->provider, array('flickr'))) ||
				(in_array($this->library, array('fancybox3', )) && in_array($processor->provider, array('google')))) {
			return !empty($photo_data['video']) ? ' data-html5-href="'.$photo_data['video'].'" ': '';
		}
		else if ($this->library == 'featherlight') {
			$mime = (!empty($photo['mime']) ? $photo['mime']: 'video/mp4');
			if ($processor->provider == 'google' && empty($photo_data['video'])) {
				return " data-featherlight-type='image' ";
			}
			else if ($processor->provider == 'google' && !empty($photo_data['video'])) {
				return " data-featherlight='<video class=\"photonic\" controls preload=\"none\"><source src=\"".$photo_data['video']."\" type=\"".$mime."\">".esc_html__('Your browser does not support HTML5 videos.', 'photonic')."</video>' data-featherlight-type='html'";
			}

			return !empty($photo_data['video']) ? " data-featherlight='<video class=\"photonic\" controls preload=\"none\"><source src=\"".$photo_data['video']."\" type=\"".$mime."\">".esc_html__('Your browser does not support HTML5 videos.', 'photonic')."</video>' data-featherlight-type='video'" : '';
		}
		return '';
	}

	/**
	 * Returns the thumbnail effect that should be used for a gallery. Not all effects can be used by all types of layouts.
	 *
	 * @param $short_code
	 * @param $layout
	 * @param $title_position
	 * @return string
	 */
	function get_thumbnail_effect($short_code, $layout, $title_position) {
		if (!empty($short_code['thumbnail_effect'])) {
			$effect = $short_code['thumbnail_effect'];
		}
		else {
			global $photonic_standard_thumbnail_effect, $photonic_justified_thumbnail_effect, $photonic_mosaic_thumbnail_effect, $photonic_masonry_thumbnail_effect;
			$effect = $layout == 'mosaic' ? $photonic_mosaic_thumbnail_effect :
				($layout == 'masonry' ? $photonic_masonry_thumbnail_effect :
					($layout == 'random' ? $photonic_justified_thumbnail_effect :
						$photonic_standard_thumbnail_effect));
		}

		if ($layout == 'circle' && $effect != 'opacity') { // "Zoom" doesn't work for circle
			$thumbnail_effect = 'none';
		}
		else if (($layout == 'square' || $layout == 'launch' || $layout == 'masonry') && $title_position == 'below') { // For these combinations, Zoom doesn't work
			$thumbnail_effect = 'none';
		}
		else {
			$thumbnail_effect = $effect;
		}
		return apply_filters('photonic_thumbnail_effect', $thumbnail_effect, $short_code, $layout, $title_position);
	}
}
