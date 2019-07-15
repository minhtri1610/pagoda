jQuery(document).ready(function($) {
	function Photonic_Lightbox_Lightcase() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Lightcase.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Lightcase.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).filter(function() {
			var res = new RegExp('photonic-launch-gallery').test($(this).attr('class'));
			return !res;
		}).attr("data-rel", 'photonic-lightcase');
	};

	Photonic_Lightbox_Lightcase.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', embed);
		$(element).attr("data-rel", 'photonic-lightcase-video');
	};

	Photonic_Lightbox_Lightcase.prototype.hostedVideo = function(a) {
		var html5 = $(a).attr('href').match(new RegExp(/(\.mp4|\.webm|\.ogg)/i));
		var css = $(a).attr('class');
		css = css !== undefined && css.includes('photonic-launch-gallery');

		if (html5 !== null && !css) {
			$(a).addClass(Photonic_JS.slideshow_library + "-html5-video");
			$(a).attr("data-rel", 'photonic-html5-video');

			this.videoIndex++;
		}
	};

	Photonic_Lightbox_Lightcase.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		$(selector).each(function() {
			var current = this;
			var provider = $(current).data('photonicStreamProvider');
			var lightbox_selector;
			var rel = $(current).find('a.launch-gallery-lightcase');
			if (rel.length > 0) {
				rel = $(rel[0]).data('rel');
			}

			lightbox_selector = selector.indexOf('data-rel') > -1 ? selector : 'a[data-rel="' + rel + '"]';
			$(lightbox_selector).lightcase({
				showSequenceInfo: false,
				transition: Photonic_JS.lc_transition_effect,
				slideshow: Photonic_JS.slideshow_mode,
				timeout: Photonic_JS.slideshow_interval,
				navigateEndless: Photonic_JS.lightbox_loop,
				disableShrink: Photonic_JS.lc_disable_shrink === '1',
				attrPrefix: '',
				caption: ' ',
				swipe: true,
				onStart: {
					getVideoSize: function() {
						var elem = this;
						var videoURL = $(elem).attr('data-html5-href');// || $(elem).attr('href');
						if (lightbox_selector.indexOf('photonic-html5-video') > -1 || videoURL !== undefined) {
							self.getVideoSize(videoURL === undefined ? $(elem).attr('href') : videoURL, {height: window.innerHeight * 0.8, width: 800 }).then(function(dimensions) {
								$(elem).attr('data-lc-options', '{"width": ' + Math.round(dimensions.newWidth) + ', "height": ' + Math.round(dimensions.newHeight) + '}');
								$('#lightcase-content').find('video').attr({ width: Math.round(dimensions.newWidth), height: Math.round(dimensions.newHeight)}).css({ width: Math.round(dimensions.newWidth), height: Math.round(dimensions.newHeight)});
								lightcase.resize({ width: Math.round(dimensions.newWidth), height: Math.round(dimensions.newHeight) });
							});
						}
					}
				},
				onFinish: {
					setHash: function() {
						self.setHash(this);
						var shareable = {
							'url': location.href,
							'title': photonicHtmlDecode($(this).data('title')),
							'image': $(this).attr('href')
						};
						self.addSocial('#lightcase-info', shareable);
					}
				},
				onClose: { unsetHash: self.unsetHash() }
			});
		});
	};

	Photonic_Lightbox_Lightcase.prototype.initializeForNewContainer = function(containerId) {
		this.initialize(containerId);
	};

	photonicLightbox = new Photonic_Lightbox_Lightcase();
	photonicLightbox.initialize('.photonic-standard-layout,.photonic-masonry-layout,.photonic-mosaic-layout');
	photonicLightbox.initialize('a[data-rel="photonic-lightcase"]');
	photonicLightbox.initialize('a[data-rel="photonic-lightcase-video"]');
	photonicLightbox.initialize('a[data-rel="photonic-html5-video"]');
});
