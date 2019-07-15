	function Photonic_Lightbox_Fancybox3() {
		Photonic_Lightbox.call(this);

		this.buttons = [];
		if (Photonic_JS.fb3_zoom) {
			this.buttons.push('zoom');
		}
		if (Photonic_JS.fb3_slideshow) {
			this.buttons.push('slideShow');
		}
		if (Photonic_JS.fb3_fullscreen_button) {
			this.buttons.push('fullScreen');
		}
		if (Photonic_JS.fb3_download) {
			this.buttons.push('download');
		}
		if (Photonic_JS.fb3_thumbs_button) {
			this.buttons.push('thumbs');
		}
		this.buttons.push('close');
	}
	Photonic_Lightbox_Fancybox3.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Fancybox3.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).addClass("launch-gallery-fancybox").addClass(Photonic_JS.slideshow_library);
	};

	Photonic_Lightbox_Fancybox3.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		var lightbox_selector;
		if (group !== null && group !== undefined) {
			lightbox_selector = 'a[data-fancybox="' + group + '"]';
		}
		else if (selector !== null && selector !== undefined) {
			lightbox_selector = selector + ' a.launch-gallery-fancybox';
		}
		else {
			lightbox_selector = 'a.launch-gallery-fancybox';
		}

		$(lightbox_selector).fancybox({
			defaultType: 'image',
			hash: false,
			caption: function(instance, item) {
				return $(this).data('title');
			},
			buttons: self.buttons,
			slideShow: {
				autoStart: Photonic_JS.slideshow_mode,
				speed: parseInt(Photonic_JS.slideshow_interval, 10)
			},
			thumbs: {
				autoStart: Photonic_JS.fb3_thumbs === '1',
				hideOnClose: true
			},
			fullScreen: {
				autoStart: Photonic_JS.fb3_fullscreen === '1'
			},
			protect: Photonic_JS.fb3_disable_right_click === '1',
			transitionEffect: Photonic_JS.fb3_transition_effect,
			transitionDuration: Photonic_JS.fb3_transition_speed,
			afterShow: function(instance, slide) {
				var shareable = {
					'url': location.href,
					'title': $(this).length > 0 &&  $(this)[0].opts !== undefined &&  $(this)[0].opts.$orig !== undefined ? photonicHtmlDecode($(this)[0].opts.$orig.attr('title')) : '',
					'image': $(this).length > 0 &&  $(this)[0].opts !== undefined &&  $(this)[0].opts.$orig !== undefined ? $(this)[0].opts.$orig.attr('href') : ''
				};
				self.addSocial('.fancybox-caption', shareable);
			},
			beforeShow: function() {
				var videoID = this.src;
				var videoURL = this.opts.html5Href;
				if (videoURL !== undefined) {
					self.getVideoSize(videoURL, {height: window.innerHeight * 0.85, width: window.innerWidth * 0.85}).then(function(dimensions) {
						$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
						$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
					});
				}
				self.setHash(this.opts.photonicDeep);
			},
			afterClose: function() {
				self.unsetHash();
			}
		});

		$('a.fancybox3-video,a.fancybox3-html5-video').fancybox({
			youtube: { }
		});
	};

	Photonic_Lightbox_Fancybox3.prototype.initializeForNewContainer = function(containerId) {
		this.initialize(containerId);
	};

	photonicLightbox = new Photonic_Lightbox_Fancybox3();
	photonicLightbox.initialize();
