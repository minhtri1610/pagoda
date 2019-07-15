	function Photonic_Lightbox_Swipebox() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Swipebox.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Swipebox.prototype.changeSlide = function(thumb, idx) {
		if (thumb != null) {
			var rel = $(thumb).attr('rel');
			var all_thumbs = $('[rel="' + rel + '"]');
			var slide = all_thumbs[idx];
			this.setHash(slide);

			var videoID = $(slide).attr('href');
			var videoURL = $(slide).attr('data-html5-href');
			if (videoURL !== undefined) {
				this.getVideoSize(videoURL, {width: window.innerWidth, height: window.innerHeight - 50}).then(function(dimensions) {
					$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
					$('.swipebox-inline-container ' + videoID).find('video').attr({ width: dimensions.newWidth, height: dimensions.newHeight });
				});
			}

			var shareable = {
				'url': location.href,
				'title': photonicHtmlDecode($(slide).data('title')),
				'image': $(slide).attr('href')
			};
			this.addSocial('#swipebox-arrows', shareable);
		}
	};

	Photonic_Lightbox_Swipebox.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', regular);
	};

	Photonic_Lightbox_Swipebox.prototype.hostedVideo = function(a) {
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

	Photonic_Lightbox_Swipebox.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		$('a.launch-gallery-swipebox').swipebox({
			hideBarsDelay: Photonic_JS.sb_hide_bars_delay,
			removeBarsOnMobile: Photonic_JS.enable_swipebox_mobile_bars,
			hideCloseButtonOnMobile: Photonic_JS.sb_hide_mobile_close,
			loopAtEnd: Photonic_JS.lightbox_loop,
			currentThumb: null,
			videoURL: null,
			videoID: null,
			beforeOpen: function(e) {
				var evt = e || window.event;
				if (evt !== undefined) {
					var clicked = $(evt.target).parents('.launch-gallery-swipebox');
					if (clicked.length > 0) {
						this.currentThumb = clicked[0];
					}
					else {
						var all_matches = $('[data-photonic-deep="' + deep.substr(1) + '"]');
						if (all_matches.length > 0) {
							this.currentThumb = all_matches[0];
						}
					}
				}
				this.videoURL = $(this.currentThumb).attr('data-html5-href');
				this.videoID = $(this.currentThumb).attr('href');
			},
			afterOpen: function(idx) {
				self.changeSlide(this.currentThumb, idx);
			},
			prevSlide: function(idx) {
				self.changeSlide(this.currentThumb, idx);
			},
			nextSlide: function(idx) {
				self.changeSlide(this.currentThumb, idx);
			},
			afterClose: function() {
				self.unsetHash();
			}
		});

		$('a.swipebox-video').swipebox({
			hideBarsDelay: 0,
			removeBarsOnMobile: Photonic_JS.enable_swipebox_mobile_bars
		});

		$('a.swipebox-html5-video').swipebox({
			hideBarsDelay: 0,
			removeBarsOnMobile: Photonic_JS.enable_swipebox_mobile_bars,
			videoURL: null,
			videoID: null,
			beforeOpen: function(e) {
				this.videoURL = $(e.target).attr('data-html5-href');
				this.videoID = $(e.target).attr('href');

			},
			afterOpen: function() {
				var videoID = this.videoID;
				self.getVideoSize(this.videoURL, {width: window.innerWidth, height: window.innerHeight - 50}).then(function(dimensions) {
					$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
					$('.swipebox-inline-container ' + videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
				});
			}
		});
	};

	photonicLightbox = new Photonic_Lightbox_Swipebox();
	photonicLightbox.initialize();
