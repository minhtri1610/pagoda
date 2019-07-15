	function Photonic_Lightbox_Featherlight() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Featherlight.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Featherlight.prototype.resizeContainer = function(elem) {
		var target = elem;
		var video = $(target.attr('data-featherlight'));
		var videoURL = $(video.children()[0]).attr('src');
		if (videoURL === undefined) {
			//videoURL = target.attr('data-html5-href');
		}
		this.getVideoSize(videoURL, {width: window.innerWidth * 0.85 - 50, height: window.innerHeight * 0.85 - 50}).then(function(dimensions) {
			$('.featherlight-content').find('video').attr('width', dimensions.newWidth).attr('height', dimensions.newHeight);
			target.attr('data-featherlight', $('<div/>').append(video).html());
		});
	};

	Photonic_Lightbox_Featherlight.prototype.resizeImageContainer = function(elem) {
		var imageURL = $(elem).attr('href');
		this.getImageSize(imageURL, {width: window.innerWidth * 0.85 - 50, height: window.innerHeight * 0.85 - 50}).then(function(dimensions) {
			$('.featherlight-content').find('img').css({ width: dimensions.newWidth + 'px', height: dimensions.newHeight + 'px'});
		});
	};

	Photonic_Lightbox_Featherlight.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).filter(function() {
			var res = new RegExp('photonic-launch-gallery').test($(this).attr('class'));
			return !res;
		}).addClass("photonic-featherlight-solo");
	};

	Photonic_Lightbox_Featherlight.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', embed);
		$(element).attr("data-featherlight", 'iframe').addClass('featherlight-video');
	};

	Photonic_Lightbox_Featherlight.prototype.hostedVideo = function(a) {
		var html5 = $(a).attr('href').match(new RegExp(/(\.mp4|\.webm|\.ogg)/i));
		var css = $(a).attr('class');
		css = css !== undefined && css.includes('photonic-launch-gallery');

		if (html5 !== null && !css) {
			$(a).addClass(Photonic_JS.slideshow_library + "-html5-video");
			$(a).attr('data-featherlight', '<video controls preload="none"><source src="' + $(a).attr('href') + '" type="video/mp4">Your browser does not support HTML5 video.</video>');

			this.videoIndex++;
		}
	};

	Photonic_Lightbox_Featherlight.prototype.initializeGallery = function(selector, self) {
		$(selector).featherlightGallery({
			gallery: {
				fadeIn: 300,
				fadeOut: 300
			},
			openSpeed: 300,
			closeSpeed: 300,
			afterContent: function() {
				this.$legend = this.$legend || $('<div class="legend"/>').insertAfter(this.$content.parent());
				this.$legend.html(this.$currentTarget.data('title'));
				this.$instance.find('.featherlight-previous img').remove();
				this.$instance.find('.featherlight-next img').remove();
				self.setHash(this.$currentTarget);
				var shareable = {
					'url': location.href,
					'title': photonicHtmlDecode(this.$currentTarget.data('title')),
					'image': this.$content.attr('src')
				};
				self.addSocial('.photonic-featherlight', shareable);
				$(window).resize();
			},
			afterClose: function() {
				self.unsetHash();
			},
			onResize: function() {
				//if ($(this.$currentTarget).attr('data-featherlight-type') == 'video' || $(this.$currentTarget).attr('data-html5-href') != undefined) {
				if ($(this.$currentTarget).attr('data-featherlight-type') === 'video') {
					self.resizeContainer($(this.$currentTarget));
				}
				else {
					self.resizeImageContainer($(this.$currentTarget));
				}
			},
			variant: 'photonic-featherlight'
		});
	};

	Photonic_Lightbox_Featherlight.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		$(selector).each(function() {
			var current = $(this);
			var thumbs = current.find('a.launch-gallery-featherlight');
			var rel = '';
			if (thumbs.length > 0) {
				rel = $(thumbs[0]).attr('rel');
			}
			self.initializeGallery('a[rel="' + rel + '"]', self);
		});

		$('a.photonic-featherlight-solo').featherlight({
			afterContent: function() {
				this.$legend = this.$legend || $('<div class="legend"/>').insertAfter(this.$content.parent());
				this.$legend.html(this.$currentTarget.data('title') || this.$currentTarget.attr('title') || this.$currentTarget.find('img').attr('title') || this.$currentTarget.find('img').attr('alt'));
			},
			type: 'image',
			variant: 'photonic-featherlight'
		});

		$('a.featherlight-video').featherlight({
			iframeWidth: 640,
			iframeHeight: 480,
			iframeFrameborder: 0,
			variant: 'photonic-featherlight'
		});

		$('a.featherlight-html5-video').featherlight({
			onResize: function() {
				self.resizeContainer($(this.$currentTarget));
			},
			variant: 'photonic-featherlight'
		});
	};

	Photonic_Lightbox_Featherlight.prototype.initializeForNewContainer = function(containerId) {
		this.initialize(containerId);
	};

	photonicLightbox = new Photonic_Lightbox_Featherlight();
	photonicLightbox.initialize('.photonic-standard-layout,.photonic-random-layout,.photonic-masonry-layout,.photonic-mosaic-layout');
