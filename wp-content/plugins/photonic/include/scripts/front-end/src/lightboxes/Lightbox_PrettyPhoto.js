	function Photonic_Lightbox_PrettyPhoto() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_PrettyPhoto.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_PrettyPhoto.prototype.swipe = function() {
		$('.pp_hoverContainer').remove();
		$("#pp_full_res")
			.on('swipeleft', function() { $.prettyPhoto.changePage('next'); })
			.on('swiperight', function() { $.prettyPhoto.changePage('previous'); });
	};

	Photonic_Lightbox_PrettyPhoto.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).filter(function() {
			var res = new RegExp('photonic-prettyPhoto').test($(this).attr('rel'));
			return !res;
		}).attr("rel", 'photonic-prettyPhoto');
	};

	Photonic_Lightbox_PrettyPhoto.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', regular);
	};

	Photonic_Lightbox_PrettyPhoto.prototype.initialize = function(e) {
		// this.handleSolos(); // Can't do this here since initialize is not called directly
		var self = this;

		$("a[rel^='photonic-prettyPhoto']").prettyPhoto({
			theme: Photonic_JS.pphoto_theme,
			autoplay_slideshow: Photonic_JS.slideshow_mode,
			slideshow: Photonic_JS.slideshow_interval,
			show_title: false,
			social_tools: '',
			deeplinking: false,
			changepicturecallback: function() {
				var img = $('#fullResImage');
				if (e !== undefined && e['deep'] === undefined) {
					var clicked_thumb = $(e.target).parent();
					var clicked_div = $(clicked_thumb).parent();
					var current_stream = $(clicked_div).parent();

					var active_node = $(current_stream).find('a[href="' + $(img).attr('src') + '"]');

					if (active_node.length === 0) {
						$.each($('div.title-display-regular, div.title-display-below, div.title-display-tooltip, div.title-display-hover-slideup-show, div.title-display-slideup-stick, '+
							'ul.title-display-regular, ul.title-display-below, ul.title-display-tooltip, ul.title-display-hover-slideup-show, ul.title-display-slideup-stick'), function(key, value) {
							active_node = $(this).find('a[href="' + $(img).attr('src') + '"]');
							if (active_node.length !== 0) {
								return false;
							}
						});
					}

					self.setHash(active_node);
				}
				else if (e['deep'] !== undefined) {
					var idx = e['images'].indexOf($(img).attr('src'));
					if (idx > -1) {
						self.setHash(e['deep'][idx]);
					}
				}

				var shareable = {
					'url': location.href,
					'title': $('.pp_description').text(),
					'image': img.attr('src')
				};
				self.addSocial('#pp_full_res', shareable);

				self.swipe();
			},
			callback: function() {
				self.unsetHash();
			}
		});
	};

	Photonic_Lightbox_PrettyPhoto.prototype.initializeForExisting = function() {
		var self = this;

		$(document).on('click', "a[rel^='photonic-prettyPhoto']", function(e) {
			e.preventDefault();
			self.initialize(e);
			this.click();
		});

		$("a[rel^='photonic-prettyPhoto-video'],a[rel^='photonic-prettyPhoto-html5-video']").prettyPhoto({
			theme: Photonic_JS.pphoto_theme,
			autoplay_slideshow: Photonic_JS.slideshow_mode,
			slideshow: Photonic_JS.slideshow_interval,
			show_title: false,
			social_tools: '',
			deeplinking: false
		});
	};

	photonicLightbox = new Photonic_Lightbox_PrettyPhoto();
	photonicLightbox.handleSolos();
	photonicLightbox.initializeForExisting();
