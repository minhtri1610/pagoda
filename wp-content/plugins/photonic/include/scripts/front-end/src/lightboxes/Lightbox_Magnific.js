	function Photonic_Lightbox_Magnific() {
		Photonic_Lightbox.call(this);

		$.expr[':'].parents = function(a,i,m){
			return jQuery(a).parents(m[3]).length < 1;
		};
	}
	Photonic_Lightbox_Magnific.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Magnific.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		$(selector).each(function(idx, obj) {
			$(obj).magnificPopup({
				delegate: 'a.launch-gallery-magnific',
				type: 'image',
				gallery: {
					enabled: true
				},
				image: {
					titleSrc: 'data-title'
				},
				callbacks: {
					change: function () {
						var $content = $(this.content);
						var videoId = $content.attr('id');
						if (videoId !== undefined && videoId.indexOf('photonic-video') > -1) {
							var videoURL = $content.find('video').find('source').attr('src');
							if (videoURL !== undefined) {
								self.getVideoSize(videoURL, {height: window.innerHeight * 0.8, width: window.innerWidth * 0.8 }).then(function(dimensions) {
									$content.find('video').attr({
										height: dimensions.newHeight,
										width: dimensions.newWidth
									});
								});
							}
						}
						self.setHash(this.currItem.el);
						if (this.currItem.type === 'inline') {
							$(this.content).append($('<div></div>').html($(this.currItem.el).data('title')));
						}
					},
					imageLoadComplete: function() {
						var shareable = {
							'url': location.href,
							'title': photonicHtmlDecode($(this.currItem.el).data('title')),
							'image': $(this.currItem.el).attr('href')
						};
						self.addSocial('.mfp-figure', shareable);
					},
					close: function() {
						self.unsetHash();
					}
				}
			});
		});
	};

	Photonic_Lightbox_Magnific.prototype.initializeForNewContainer = function(selector) {
		this.initialize(selector);
	};

	Photonic_Lightbox_Magnific.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', regular);
	};

	Photonic_Lightbox_Magnific.prototype.hostedVideo = function(a) {
		var html5 = $(a).attr('href').match(new RegExp(/(\.mp4|\.webm|\.ogg)/i));
		var css = $(a).attr('class');
		css = css !== undefined && css.includes('photonic-launch-gallery');

		if (html5 !== null && !css) {
			$(a).addClass(Photonic_JS.slideshow_library + "-html5-video");
			var $videos = $('#photonic-html5-videos');
			$videos = $videos.length ? $videos : $('<div style="display:none;" id="photonic-html5-videos"></div>').appendTo(document.body);
			$videos.append('<div id="photonic-html5-video-' + this.videoIndex + '"><video controls preload="none"><source src="' + $(a).attr('href') + '" type="video/mp4">Your browser does not support HTML5 video.</video></div>');
			$(a).attr('data-html5-href', $(a).attr('href'));
			$(a).attr('href', '#photonic-html5-video-' + this.videoIndex);
			this.videoIndex++;
		}
	};

	Photonic_Lightbox_Magnific.prototype.initializeSolos = function() {
		var self = this;

		if (Photonic_JS.lightbox_for_all) {
			$('a.launch-gallery-magnific').filter(':parents(.photonic-level-1)').each(function(idx, obj) { // Solo images
				$(obj).magnificPopup({
					type: 'image'
				});
			});
		}

		if (Photonic_JS.lightbox_for_videos) {
			$('.magnific-video').each(function(idx, obj) {
				$(obj).magnificPopup({
					type: 'iframe'
				});
			});

			$('.magnific-html5-video').each(function(idx, obj) {
				$(obj).magnificPopup({
					type: 'inline',
					callbacks: {
						change: function () {
							var $content = $(this.content);
							var videoId = $content.attr('id');
							if (videoId !== undefined && videoId.indexOf('photonic-html5-video') > -1) {
								var videoURL = $content.find('video').find('source').attr('src');
								if (videoURL !== undefined) {
									self.getVideoSize(videoURL, {height: window.innerHeight * 0.8, width: window.innerWidth * 0.8 }).then(function(dimensions) {
										$content.find('video').attr({
											height: dimensions.newHeight,
											width: dimensions.newWidth
										});
									});
								}
							}
						}
					}
				});
			});
		}
	};

	Photonic_Lightbox_Magnific.prototype.initializeForSlideshow = function(selector, slider) {
		var items = [];
		$(selector).children('li').each(function(idx, obj){
			$(obj).find('img, video').each(function(i, o){
				if ($(o).is('img')) {
					items.push({
						src: $(o).attr('src'),
						title: $(o).attr('title'),
						type: 'image'
					});
				}
			});
		});

		$(selector).magnificPopup({
			items: items,
			gallery: {
				enabled: true
			}
		});
	};

	photonicLightbox = new Photonic_Lightbox_Magnific();
	photonicLightbox.initialize('.photonic-standard-layout, .photonic-random-layout, .photonic-mosaic-layout, .photonic-masonry-layout');
	photonicLightbox.initializeSolos();
