/**
 * block.js - Contains all Gutenberg functionality required by Photonic
 */
var photonicBlockProperties;
jQuery(document).ready(function($) {
	(function(wp) {
		var el = wp.element.createElement;
		var __ = wp.i18n.__;
		var components = wp.components;
		var iconEl;
		iconEl = el('svg', {width: 23, height: 24, viewBox: "0 0 24 24"},
			el('g', {transform: "scale(0.046785)"},
				el('circle', {cx: "256", cy: "192", r: "128", fill: "#0085ba"}),
				el('rect', {width: "64", height: "256", x: "128", y: "192", fill: "#0085ba"}),
				el('circle', {cx: "256", cy: "192", r: "64", fill: "white"}),
				el('rect', {width: "16", height: "128", x: "192", y: "192", fill: "white"})
			)
		);

		var tag = Photonic_Gutenberg_JS.shortcode.toLowerCase() === 'gallery' ? 'gallery__photonic_random_314159' : Photonic_Gutenberg_JS.shortcode;
		wp.blocks.registerBlockType( 'photonic/gallery', {
			title: __('Photonic Gallery', 'photonic'),
			category: 'widgets',
			keywords: ['flickr', 'smugmug', 'google'],
			icon: iconEl,
			supports: {
				html: false,
				align: ['wide', 'full']
			},

			transforms: {
				from: [
					{
						type: 'shortcode',
						tag: tag,
						attributes: {
							shortcode: {
								type: 'string',
								shortcode: function(named) {
									return JSON.stringify(named.named);
								}
							}
						}
					},
					{
						type: 'block',
						blocks: ['core/gallery'],
						transform: function(attributes) {
							var images = attributes.images;
							var ids = '';
							$(images).each(function(idx, val) {
								ids += val.id + ',';
							});
							if (ids.length > 0) {
								ids = ids.slice(0, -1);
							}
							var sc = {
								type: 'wp',
								ids: ids
							};
							return wp.blocks.createBlock('photonic/gallery', {
								shortcode: JSON.stringify(sc)
							});
						}
					}
				]/*,
				to: [
					{
						type: 'block',
						blocks: ['core/gallery'],
						isMatch: function(attributes) {
							if (attributes.shortcode === undefined || attributes.shortcode === null) {
								return true;
							}
							var scAttr = JSON.parse(attributes.shortcode);
							return scAttr.type === undefined || scAttr.type === null || scAttr.type === 'wp';
						},
						transform: function(attributes) {
							var scAttr = JSON.parse(attributes.shortcode);
							var gAttr = _.pick(scAttr, 'caption', 'order', 'orderby', 'id', 'itemtag', 'icontag', 'captiontag', 'size', 'include', 'ids', 'exclude', 'thumb_width', 'thumb_height', 'columns');
							if (gAttr.ids !== undefined && gAttr.ids !== null && (gAttr.include === undefined || gAttr.include === null)) {
								gAttr.include = gAttr.ids;
							}
							console.log(gAttr);

							return wp.blocks.createBlock('core/gallery', gAttr);
						}
					}
				]
*/			},

			attributes: {
				shortcode: {
					type: 'string'
				}
			},

			/**
			 * Called when Gutenberg initially loads the block.
			 */
			edit: function( props ) {
				var markup = [], iconClass = '';
				var shortcode = props.attributes.shortcode || '{}';
				shortcode = JSON.parse(shortcode);

				var providers = {
					'wp': 'WordPress',
					'flickr': 'Flickr',
					'smugmug': 'SmugMug',
					'google': 'Google Photos',
					'picasa': 'Picasa',
					'zenfolio': 'Zenfolio',
					'instagram': 'Instagram'
				};
				var source;

				if (!$.isEmptyObject(shortcode) && (shortcode.type === undefined || shortcode.type === 'default')) {
					iconClass = 'photonic-wp';
					source = 'wp';
				}
				else if (shortcode.type !== undefined && ['wp', 'flickr', 'smugmug', 'google', 'picasa', 'zenfolio', 'instagram'].indexOf(shortcode.type) > -1) {
					iconClass = 'photonic-' + shortcode.type;
					source = shortcode.type;
				}

				var title = iconClass === '' ? __('Add Photonic Gallery', 'photonic') : __('Edit Photonic Gallery', 'photonic') + ' (' + __('Source: ', 'photonic') + providers[source] + ')';

				var openFlow = function() {
					photonicBlockProperties = props;
					tb_show(title, Photonic_Gutenberg_JS.flow_url);
				};

				markup.push(
					el('div', {key: 'photonic-placeholder', className: 'photonic-gallery'},
						el('a', {className: 'photonic-placeholder-icon photonic ' + iconClass, onClick: openFlow}),
						title)
				);

				return(markup);
			},

			/**
			 * Called when Gutenberg "saves" the block to post_content
			 */
			save: function( props ) {
				return null;
			}
		} );
	})(window.wp);
});
