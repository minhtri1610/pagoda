	function Photonic_Lightbox_Colorbox() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Colorbox.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Colorbox.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).addClass("launch-gallery-" + Photonic_JS.slideshow_library).addClass(Photonic_JS.slideshow_library).attr('data-photonic-media-type', 'image');
	};

	Photonic_Lightbox_Colorbox.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', embed);
	};

	Photonic_Lightbox_Colorbox.prototype.hostedVideo = function(a) {
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

	Photonic_Lightbox_Colorbox.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;
		if ($.colorbox) {
			$(document).on('click', 'a.launch-gallery-colorbox', function(e) {
				e.preventDefault();
				$('a.launch-gallery-colorbox[data-photonic-media-type="image"]').each(function() {
					$(this).colorbox({
						opacity: 0.8,
						maxWidth: '95%',
						maxHeight: '95%',
						photo: true,
						title: $(this).data('title'),
						transition: Photonic_JS.cb_transition_effect,
						speed: Photonic_JS.cb_transition_speed,
						slideshow: Photonic_JS.slideshow_mode === '1',
						slideshowSpeed: Photonic_JS.slideshow_interval,
						loop: Photonic_JS.lightbox_loop === '1',
						onLoad: function() {
							self.setHash(this);
							var shareable = {
								'url': location.href,
								'title': photonicHtmlDecode($(this).data('title')),
								'image': $(this).attr('href')
							};
							self.addSocial('#cboxContent', shareable);
						},
						onClosed: function() {
							self.unsetHash();
						}
					});
				});

				$('a.launch-gallery-colorbox[data-photonic-media-type="video"]').each(function() {
					$(this).colorbox({
						opacity: 0.8,
						maxWidth: '90%',
						maxHeight: '90%',
						inline: true,
						title: $(this).data('title'),
						transition: Photonic_JS.cb_transition_effect,
						speed: Photonic_JS.cb_transition_speed,
						slideshow: Photonic_JS.slideshow_mode,
						slideshowSpeed: Photonic_JS.slideshow_interval,
						loop: Photonic_JS.lightbox_loop,
						scrolling: false,
						onLoad: function() {
							self.setHash(this);
							var shareable = {
								'url': location.href,
								'title': photonicHtmlDecode($(this).data('title')),
								'image': $(this).attr('href')
							};
							self.addSocial('#cboxContent', shareable);
							var videoID = $(this).attr('href');
							self.getVideoSize($(this).attr('data-html5-href'), {height: window.innerHeight * 0.90 - 50, width: window.innerWidth * 0.90}).then(function(dimensions) {
								$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
								$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
							});
						},
						onComplete: function() {
							$(this).colorbox.resize({innerWidth: $($(this).attr('href')).width(), innerHeight: $($(this).attr('href')).height()});
						},
						onClosed: function() {
							self.unsetHash();
						}
					});
				});
				this.click();
			});

			$('.colorbox-video').colorbox({
				opacity: 0.8,
				maxWidth: '95%',
				maxHeight: '95%',
				title: $(this).data('title'),
				iframe: true, innerWidth:640, innerHeight:390, scrolling: false
			});

			$('a.colorbox-html5-video').colorbox({
				opacity: 0.8,
				maxWidth: '95%',
				maxHeight: '95%',
				title: $(this).data('title'),
				inline: true, href: $(this).attr('href'),
				scrolling: false,
				onLoad: function() {
					var videoID = $(this).attr('href');
					self.getVideoSize($(this).attr('data-html5-href'), {height: window.innerHeight * 0.95 - 50, width: window.innerWidth * 0.95}).then(function(dimensions) {
						$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
						$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
					});
				},
				onComplete: function() {
					$(this).colorbox.resize({innerWidth: $($(this).attr('href')).width(), innerHeight: $($(this).attr('href')).height()});
				}
			});

			$(document).bind('cbox_open', function(){
				$("#colorbox")
					.on('swipeleft', function() { $.colorbox.next(); })
					.on('swiperight', function() {$.colorbox.prev(); } );
			});
		}
	};

	photonicLightbox = new Photonic_Lightbox_Colorbox();
	photonicLightbox.initialize();
