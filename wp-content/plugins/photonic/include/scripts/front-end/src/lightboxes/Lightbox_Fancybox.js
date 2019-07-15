	function Photonic_Lightbox_Fancybox() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Fancybox.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Fancybox.prototype.swipe = function(e) {
		$("#fancybox-wrap, .fancybox-wrap")
			.on('swipeleft', function() { $.fancybox.next(); })
			.on('swiperight', function() { $.fancybox.prev(); });
	};

	Photonic_Lightbox_Fancybox.prototype.formatTitle = function(title, currentArray, currentIndex, currentOpts) {
		if ($(currentArray[currentIndex]).data('title') !== undefined && $(currentArray[currentIndex]).data('title') !== '') {
			return $(currentArray[currentIndex]).data('title');
		}
		return title;
	};

	Photonic_Lightbox_Fancybox.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).addClass("launch-gallery-fancybox").addClass(Photonic_JS.slideshow_library);
	};

	Photonic_Lightbox_Fancybox.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', embed);
	};

	Photonic_Lightbox_Fancybox.prototype.hostedVideo = function(a) {
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

	Photonic_Lightbox_Fancybox.prototype.initialize = function(selector, group) {
		var self = this;
		this.handleSolos();

		if (Photonic_JS.slideshow_mode) {
			setInterval($.fancybox.next, parseInt(Photonic_JS.slideshow_interval, 10));
		}

		$(document).on('click', 'a.launch-gallery-fancybox', function(e) {
			e.preventDefault();
			var videoID = $(this).attr('href');
			var videoURL = $(this).attr('data-html5-href');
			var $vclone;

			$('a.launch-gallery-fancybox').fancybox({
				overlayShow		:	true,
				overlayColor	:	'#000',
				overlayOpacity	: 0.8,
				cyclic			: true,
				titleShow		: Photonic_JS.fbox_show_title === '1',
				titleFormat		: self.formatTitle,
				titlePosition	: Photonic_JS.fbox_title_position,
				type : $(this).parent().hasClass('photonic-google-image') ? 'image' : false,
				autoScale: true,
				scrolling: 'no',
				onStart: function(selectedArray, selectedIndex, selectedOpts) {
					var currentItem = selectedArray[selectedIndex];
					videoID = $(currentItem).attr('href');
					videoURL = $(currentItem).attr('data-html5-href');
				},
				onClosed	: function() {
					$('#photonic-html5-external-videos').append($vclone);
					$('.fancybox-inline-tmp').remove();
				},
				onComplete		: function() {
					if (videoURL !== undefined) {
						$vclone = $(videoID).clone(true);
						self.getVideoSize(videoURL, {height: window.innerHeight * 0.85, width: window.innerWidth * 0.85}).then(function(dimensions) {
							$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
							$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
							$('#fancybox-content').css({width: dimensions.newWidth, height: dimensions.newHeight});
							$('#fancybox-wrap').css({width: 'auto', height: 'auto' });
							$.fancybox.resize();
						});
					}
					self.swipe(e);
				}
			});
			this.click();
		});

		$('a.fancybox-video').fancybox({ type: 'iframe' });
		$('a.fancybox-html5-video').each(function() {
			var videoID = $(this).attr('href');
			var videoURL = $(this).attr('data-html5-href');
			var $vclone;
			$(this).fancybox({
				overlayShow		:	true,
				overlayColor	:	'#000',
				overlayOpacity	: 0.8,
				type: 'inline',
				titleShow		: Photonic_JS.fbox_show_title === '1',
				titleFormat		: self.formatTitle,
				titlePosition	: Photonic_JS.fbox_title_position,
				autoScale: true,
				scrolling: 'no',
				onStart: function() {
					$vclone = $(videoID).clone(true);
					this.getVideoSize(videoURL, {height: window.innerHeight * 0.85, width: window.innerWidth * 0.85}).then(function(dimensions) {
						$(videoID).find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
						$(videoID).css({width: dimensions.newWidth, height: dimensions.newHeight});
						$('#fancybox-content').css({width: dimensions.newWidth + 'px', height: dimensions.newHeight + 'px'});
						$('#fancybox-wrap').css({width: (dimensions.newWidth + 20) + 'px', height: (dimensions.newHeight + 20) + 'px'});
					});
				},
				onClosed	: function() {
					$('#photonic-html5-videos').append($vclone);
					$('.fancybox-inline-tmp').remove();
				},
				onComplete: function() {
					$.fancybox.resize();
				}
			});
		});
	};

	photonicLightbox = new Photonic_Lightbox_Fancybox();
	photonicLightbox.initialize();
