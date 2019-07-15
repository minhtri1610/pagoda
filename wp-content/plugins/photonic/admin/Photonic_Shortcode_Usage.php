<?php
/**
 * Generates a table showing the usage of the <code>gallery</code> shortcode for Photonic.
 * This is used as an interim conversion step for switching shortcodes to a different, non-<code>gallery</code> shortcode.
 * This is crucial for Gutenberg support, as the "Convert to Blocks" capability of Gutenberg is broken (https://github.com/WordPress/gutenberg/issues/10674).
 *
 * @package Photonic
 * @subpackage Gutenberg
 * @since 2.10
 */

if(!class_exists('WP_List_Table')){
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Photonic_Shortcode_Usage extends WP_List_Table {
	public $items = array();
	public $tag;
	var $per_page = 100;

	public function __construct($args = array()) {
		parent::__construct(array(
			'singular' => 'post',
			'plural' => 'posts',
			'ajax' => false,
		));
		$this->tag = 'gallery';
		add_filter('removable_query_args', array(&$this, 'remove_args'));
	}

	/**
	 * List of columns displayed in the table
	 *
	 * @return array
	 */
	public function get_columns() {
		return array(
			'cb' => '<input type="checkbox" />',
			'title' => esc_html__('Post Title', 'photonic'),
			'type' => esc_html__('Post Type', 'photonic'),
			'status' => esc_html__('Post Status', 'photonic'),
			'shortcodes' => esc_html__('Gallery Shortcodes used by Photonic', 'photonic'),
		);
	}

	/**
	 * List of columns sortable by the user
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array(
			'type' => array('type', true),
			'title' => array('title', true),
			'status' => array('status', false),
		);
	}

	/**
	 * Main method to build out the list items
	 */
	public function prepare_items() {
		$this->_column_headers = array(
			$this->get_columns(),
			array(),
			$this->get_sortable_columns(),
			'title'
		);

		$this->process_bulk_action();

		global $wpdb;
		$results = $wpdb->get_results(
			"SELECT ID, post_type, post_status, post_title, post_content FROM {$wpdb->posts} where post_type not in ('revision', 'attachment', 'nav_menu_item', 'oembed_cache') and post_status not in ('trash', 'inherit')",
			ARRAY_A
		);

		$pattern = get_shortcode_regex(array($this->tag));
		$types = array('default', 'wp', 'flickr', 'smugmug', 'picasa', 'google', 'zenfolio', 'instagram');
		$layouts = array('square', 'circle', 'random', 'masonry', 'mosaic', 'strip-above', 'strip-below', 'strip-right', 'no-strip');
		$data = array();

		foreach ($results as $post) {
			preg_match_all('/' . $pattern . '/s', $post['post_content'], $matches, PREG_OFFSET_CAPTURE);
			if (!empty($matches) && !empty($matches[0]) && !empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
				$to_change = array();
				foreach ($matches[1] as $instance => $start) {
					if ($start[0] === '') {
						if (!empty($matches[3][$instance])) {
							$attributes = shortcode_parse_atts($matches[3][$instance][0]);
							if ((!empty($attributes['type']) && in_array($attributes['type'], $types)) ||
								(empty($attributes['type']) && !empty($attributes['style']) && in_array($attributes['style'], $layouts))) {
								$to_change[] = "<code>" . esc_html($matches[0][$instance][0]) . "</code>";
							}
						}
					}
				}
				if (!empty($to_change)) {
					$data[] = array(
						'id' => $post['ID'],
						'type' => $post['post_type'],
						'status' => $post['post_status'],
						'title' => $post['post_title'],
						'shortcodes' => $to_change,
					);
				}
			}
		}
		$current_page = $this->get_pagenum();
		$total_items = count($data);
		$data = array_slice($data, (($current_page-1) * $this->per_page), $this->per_page);
		$this->items = $data;
		$this->set_pagination_args(array(
			'total_items' => $total_items,
			'per_page' => $this->per_page,
			'total_pages' => ceil($total_items/$this->per_page),
		));
	}

	/**
	 * Default output for a column, if a column-specific output is not defined
	 *
	 * @param object $item
	 * @param string $column_name
	 * @return null|string
	 */
	protected function column_default($item, $column_name) {
		return isset($item[$column_name]) ? esc_html($item[$column_name]) : null;
	}

	/**
	 * Adds the "Checkbox" column for bulk actions
	 *
	 * @param object $item
	 * @return string
	 */
	protected function column_cb($item) {
		return sprintf('<input type="checkbox" name="photonic_post[]" value="%s" />', $item['id']);
	}

	protected function column_title($item) {
		$actions = array(
			'edit' => '<a href="' . get_edit_post_link($item['id']) . '">' . esc_html__('Edit', 'photonic') . '</a>',
			'view' => '<a href="' . get_permalink($item['id']) . '">' . esc_html__('View', 'photonic') . '</a>',
			'replace_shortcode_individual' => '<a href="'.admin_url('admin.php?page=photonic-gutenberg&action=replace_shortcode_individual&photonic_post_id='.$item['id']).'" class="photonic-shortcode-replace">' . esc_html__('Replace Shortcodes', 'photonic') . '</a>',
		);
		return $item['title'] . $this->row_actions($actions);
	}

	protected function column_shortcodes($item) {
		return implode("<br/>\n", $item['shortcodes']);
	}

	public function no_items() {
		echo sprintf(esc_html__('No instances of Photonic found with the %s shortcode', 'photonic'), "<code>{$this->tag}</code>");
	}

	function get_bulk_actions() {
		$actions = array(
			'replace_shortcode' => esc_html__('Replace Shortcode', 'photonic')
		);
		return $actions;
	}

	function process_bulk_action() {
		if ('replace_shortcode' === $this->current_action()) {
			if (!empty($_POST['photonic_post'])) {
				$post_ids = $_POST['photonic_post'];
				$post_ids = array_map(function ($v) {
					return "'" . esc_sql($v) . "'";
				}, $post_ids);
				$post_ids = implode(',', $post_ids);
			}
		}
		else if ('replace_shortcode_individual' === $this->current_action()) {
			if (!empty($_REQUEST['photonic_post_id'])) {
				$post_ids = esc_sql($_REQUEST['photonic_post_id']);
			}
		}

		if (!empty($post_ids)) {
			global $wpdb, $photonic_alternative_shortcode;
			if (empty($photonic_alternative_shortcode) || strtolower($photonic_alternative_shortcode) === 'gallery') {
				echo "<div class='notice notice-error is-dismissible'>\n<p>\n";
				echo sprintf(esc_html__('Cannot update the posts because a custom shortcode has not been set up under %s.', 'photonic'),
					'<strong><em>Photonic &rarr; Settings &rarr; Generic Options &rarr; Generic Settings &rarr; Custom Shortcode</em></strong>');
				echo "\n</p>\n</div>\n";
				return;
			}

			$r_tag = $photonic_alternative_shortcode;
			$o_len = strlen($this->tag);
			$r_len = strlen($r_tag);

			$results = $wpdb->get_results(
				"SELECT ID, post_type, post_status, post_title, post_content FROM {$wpdb->posts} where post_type not in ('revision', 'attachment', 'nav_menu_item', 'oembed_cache') and post_status not in ('trash', 'inherit') and ID in (" . $post_ids . ")",
				ARRAY_A
			);
			$pattern = get_shortcode_regex(array($this->tag));
			$types = array('default', 'wp', 'flickr', 'smugmug', 'picasa', 'google', 'zenfolio', 'instagram');
			$layouts = array('square', 'circle', 'random', 'masonry', 'mosaic', 'strip-above', 'strip-below', 'strip-right', 'no-strip');

			$count = 0;
			$got_error = false;
			foreach ($results as $id => $post) {
				preg_match_all('/' . $pattern . '/s', $post['post_content'], $matches, PREG_OFFSET_CAPTURE);
				$changed = false;
				if (!empty($matches) && !empty($matches[0]) && !empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
					$instances = array();
					$init = $post['post_content'];
					foreach ($matches[1] as $instance => $start) {
						if ($start[0] === '') {
							if (!empty($matches[3][$instance])) {
								$attributes = shortcode_parse_atts($matches[3][$instance][0]);
								if ((!empty($attributes['type']) && in_array($attributes['type'], $types)) ||
									(empty($attributes['type']) && !empty($attributes['style']) && in_array($attributes['style'], $layouts))) {
									$offset = count($instances) * ($r_len - $o_len);
									$upto = substr($init, 0, $matches[0][$instance][1] + $offset);
									$instances[] = $instance;
									$replacement = str_replace('[' . $this->tag, '[' . $r_tag, $matches[0][$instance][0]);
									$after = substr($init, $matches[0][$instance][1] + $offset + strlen($matches[0][$instance][0]));
									$init = $upto . $replacement . $after;
									$changed = true;
								}
							}
						}
					}
					if ($changed) {
						$update = $wpdb->update($wpdb->posts, array('post_content' => $init), array('ID' => $post['ID']));
						if ($update === false) {
							$got_error = true;
						}
						else if ($update === 0) {
						}
						else {
							$count++;
						}
					}
				}
			}
			if ($got_error) {
				$type = 'error';
				$message = esc_html__('Failed to replace shortcodes due to an error. Please open a support ticket.', 'photonic');
			}
			else if ($count === 0) {
				$type = 'warning';
				$message = esc_html__('0 replacements made. If this is not what you were expecting please open a support ticket.', 'photonic');
			}
			else {
				$type = 'success';
				$message = esc_html(sprintf(_n(
					'%d post updated with the shortcode replacement.',
					'%d posts updated with the shortcode replacement.',
					$count, 'photonic'),
					$count)
				);
			}

			echo "<div class='notice notice-$type is-dismissible'>\n<p>\n";
			echo $message;
			echo "\n</p>\n</div>\n";
		}
	}

	function remove_args($args) {
		$args[] = 'action';
		$args[] = 'photonic_post_id';
		return $args;
	}
}