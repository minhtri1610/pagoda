	function Photonic_Lightbox_ImageLightbox() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_ImageLightbox.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_ImageLightbox.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).filter(function() {
			var res = new RegExp('photonic-launch-gallery').test($(this).attr('class'));
			return !res;
		}).attr("rel", 'photonic-' + Photonic_JS.slideshow_library);
	};

	Photonic_Lightbox_ImageLightbox.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		$(selector).each(function() {
			var current = this;
			var lightbox_selector;
			var rel = $(current).find('a.launch-gallery-imagelightbox');
			if (rel.length > 0) {
				rel = $(rel[0]).attr('rel');
			}

			lightbox_selector = selector.indexOf('rel') > -1 ? selector : 'a[rel="' + rel + '"]';

			var photonicImageLightbox = $(lightbox_selector).imageLightbox({
				onLoadStart: function() {
					imageLightboxCaptionOff();
					imageLightboxLoadingOn();
				},
				onLoadEnd: function() {
					imageLightboxCaptionOn();
					$('#imagelightbox-loading').remove();
					$( '.imagelightbox-arrow' ).css( 'display', 'block' );
					var lightbox = $('#imagelightbox');
					var base = $(current).find('a[href="' + lightbox.attr('src') + '"]');
					self.setHash(base);
					var shareable = {
						'url': location.href,
						'title': photonicHtmlDecode($(base).data('title')),
						'image': lightbox.attr('src')
					};
					self.addSocial('#imagelightbox-overlay', shareable);
				},
				onStart: function() {
					$('<div id="imagelightbox-overlay"></div>').appendTo('body');
					imageLightboxArrowsOn(photonicImageLightbox, lightbox_selector);
					imageLightboxCloseButtonOn(photonicImageLightbox);
				},
				onEnd: function() {
					imageLightboxCaptionOff();
					$('#imagelightbox-overlay').remove();
					$('#imagelightbox-loading').remove();
					imageLightboxArrowsOff();
					imageLightboxCloseButtonOff();
					self.unsetHash();
				}
			});
			photonicLightboxList[lightbox_selector] = photonicImageLightbox;
		});
	};

	Photonic_Lightbox_ImageLightbox.prototype.initializeForNewContainer = function(containerId) {
		this.initialize(containerId);
	};

	photonicLightbox = new Photonic_Lightbox_ImageLightbox();
	photonicLightbox.initialize('.photonic-standard-layout,.photonic-random-layout,.photonic-masonry-layout,.photonic-mosaic-layout');
	photonicLightbox.initialize('a[rel="photonic-imagelightbox"]');
