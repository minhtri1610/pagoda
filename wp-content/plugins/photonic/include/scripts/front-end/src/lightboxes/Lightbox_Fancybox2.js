	function Photonic_Lightbox_Fancybox2() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Fancybox2.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Fancybox2.prototype.swipe = function(e) {
		$("#fancybox-wrap, .fancybox-wrap")
			.on('swipeleft', function() { $.fancybox.next(); })
			.on('swiperight', function() { $.fancybox.prev(); });
	};

	Photonic_Lightbox_Fancybox2.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).addClass("launch-gallery-fancybox").addClass(Photonic_JS.slideshow_library);
	};

	Photonic_Lightbox_Fancybox2.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', embed);
	};

	Photonic_Lightbox_Fancybox2.prototype.hostedVideo = function(a) {
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

	Photonic_Lightbox_Fancybox2.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		if (Photonic_JS.slideshow_mode) {
			setInterval($.fancybox.next, parseInt(Photonic_JS.slideshow_interval, 10));
		}

		$('a.launch-gallery-fancybox').fancybox({
			wrapCSS: 'photonic-fancybox',
			autoPlay: Photonic_JS.slideshow_mode,
			playSpeed: parseInt(Photonic_JS.slideshow_interval, 10),
			//type: 'image',
			autoScale: true,
			autoResize: true,
			scrolling: 'no',
			afterShow: function(current, previous) {
				self.swipe();
				var shareable = {
					'url': location.href,
					'title': photonicHtmlDecode($(this.element).data('title')),
					'image': $(this.element).attr('href')
				};
				self.addSocial('.fancybox-title', shareable);

				var videoID = $(this.element).attr('href');
				var videoURL = $(this.element).attr('data-html5-href');
				if (videoURL !== undefined) {
					self.getVideoSize(videoURL, {height: window.innerHeight * 0.85 - 30 - 40, width: window.innerWidth * 0.85 - 30}).then(function(dimensions) {
						$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
						$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
						$('.fancybox-skin .fancybox-inner').css({overflow: 'hidden'});
					});
				}
			},
			beforeLoad: function() {
				if (Photonic_JS.fbox_show_title) {
					this.title = $(this.element).data('title');
				}
				self.setHash(this.element);
			},
			afterClose: function() {
				self.unsetHash();
			},
			helpers: {
				title: {
					type: Photonic_JS.fbox_title_position
				},
				thumbs	: {
					width	: 50,
					height	: 50
				},
				overlay: {
					css: {
						'background': 'rgba(0, 0, 0, 0.8)'
					}
				},
				buttons	: {}
			}
		});
		$('a.fancybox2-video').fancybox({type: 'iframe'});
		$('a.fancybox2-html5-video').each(function() {
			var videoID = $(this).attr('href');
			var videoURL = $(this).attr('data-html5-href');
			$(this).fancybox({
				type: 'inline',
				wrapCSS: 'photonic-fancybox',
				autoScale: true,
				scrolling: 'no',
				beforeLoad: function() {
					self.getVideoSize(videoURL, {height: window.innerHeight - 30 - 40, width: window.innerWidth - 30}).then(function(dimensions) {
						$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
						$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
						$('.fancybox-skin .fancybox-inner').css({overflow: 'hidden'});
					});
				},
				onComplete: function() {
					$.fancybox.update();
				}
			});
		});
	};

	photonicLightbox = new Photonic_Lightbox_Fancybox2();
	photonicLightbox.initialize();
