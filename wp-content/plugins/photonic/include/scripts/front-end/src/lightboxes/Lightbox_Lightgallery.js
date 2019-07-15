	function Photonic_Lightbox_Lightgallery() {
		Photonic_Lightbox.call(this);
	}

	Photonic_Lightbox_Lightgallery.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Lightgallery.prototype.soloImages = function () {
		$('a[href]').filter(function () {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test($(this).attr('href'));
		}).filter(function () {
			var res = new RegExp('photonic-launch-gallery').test($(this).attr('class'));
			return !res;
		}).attr("rel", 'photonic-' + Photonic_JS.slideshow_library);
	};

	Photonic_Lightbox_Lightgallery.prototype.changeVideoURL = function (element, regular, embed) {
		$(element).attr('href', regular);
		$(element).attr("rel", 'photonic-prettyPhoto-video');
	};

	Photonic_Lightbox_Lightgallery.prototype.hostedVideo = function (a) {
		var html5 = $(a).attr('href').match(new RegExp(/(\.mp4|\.webm|\.ogg)/i));
		var css = $(a).attr('class');
		css = css !== undefined && css.indexOf('photonic-launch-gallery') !== -1;

		if (html5 !== null && !css) {
			$(a).addClass(Photonic_JS.slideshow_library + "-html5-video");
			var $videos = $('#photonic-html5-videos');
			$videos = $videos.length ? $videos : $('<div style="display:none;" id="photonic-html5-videos"></div>').appendTo(document.body);
			$videos.append('<div id="photonic-html5-video-' + this.videoIndex + '"><video class="lg-video-object lg-html5" controls preload="none"><source src="' + $(a).attr('href') + '" type="video/mp4">Your browser does not support HTML5 video.</video></div>');
			$(a).attr('data-html5-href', $(a).attr('href'));
			$(a).attr({
				href: '',
				'data-html': '#photonic-html5-video-' + this.videoIndex,
				'data-sub-html': $(a).attr('title')
			});

			this.videoIndex++;
		}
	};

	Photonic_Lightbox_Lightgallery.prototype.initialize = function (selector, selfSelect) {
		this.handleSolos();
		var self = this;

		$(selector).each(function () {
			var current = $(this);
			var thumbs = current.find('a.launch-gallery-lightgallery');
			var rel = '';
			if (thumbs.length > 0) {
				rel = $(thumbs[0]).attr('rel');
			}
			if (rel !== '' && photonicLightboxList[rel] !== undefined) {
				photonicLightboxList[rel].data('lightGallery').destroy(true);
			}
			var $lightbox = current.lightGallery({
				selector: (selfSelect === undefined || !selfSelect) ? 'a[rel="' + rel + '"]' : 'this',
				counter: selfSelect === undefined || !selfSelect,
				pause: Photonic_JS.slideshow_interval,
				mode: Photonic_JS.lg_transition_effect,
				download: Photonic_JS.lg_enable_download,
				loop: Photonic_JS.lightbox_loop,
				hideBarsDelay: Photonic_JS.lg_hide_bars_delay,
				speed: Photonic_JS.lg_transition_speed,
				getCaptionFromTitleOrAlt: false
			});
			$lightbox.on('onAfterSlide.lg', function (event, prevIndex, index) {
				var thumbs = $(this).find('a.launch-gallery-lightgallery');
				self.setHash(thumbs[index]);
				var shareable = {
					'url': location.href,
					'title': photonicHtmlDecode($(thumbs[index]).data('title')),
					'image': $(thumbs[index]).attr('href')
				};
				self.addSocial('.lg-toolbar', shareable);
			});
			$lightbox.on('onCloseAfter.lg', function () {
				self.unsetHash();
			});
			if (rel !== '') {
				photonicLightboxList[rel] = $lightbox;
			}
		});
	};

	Photonic_Lightbox_Lightgallery.prototype.initializeForNewContainer = function (containerId) {
		this.initialize(containerId);
	};

	Photonic_Lightbox_Lightgallery.prototype.initializeForSlideshow = function(selector, slider) {
		$(selector).children('li').each(function(idx, obj){
			$(obj).find('img, video').each(function(i, o){
				if ($(o).is('img')) {
					$(obj).attr('data-src', $(o).attr('src'));
				}
			});
		});

		$(selector).lightGallery({
			selector: 'li',
			pause: Photonic_JS.slideshow_interval,
			mode: Photonic_JS.lg_transition_effect,
			download: Photonic_JS.lg_enable_download,
			loop: Photonic_JS.lightbox_loop,
			hideBarsDelay: Photonic_JS.lg_hide_bars_delay,
			speed: Photonic_JS.lg_transition_speed,
			getCaptionFromTitleOrAlt: false
		});
	};

	photonicLightbox = new Photonic_Lightbox_Lightgallery();
	photonicLightbox.initialize('.photonic-standard-layout,.photonic-masonry-layout,.photonic-mosaic-layout');
	photonicLightbox.initialize('a[rel="photonic-lightgallery"]', true);
	photonicLightbox.initialize('a.lightgallery-video', true);
	photonicLightbox.initialize('a.lightgallery-html5-video', true);
