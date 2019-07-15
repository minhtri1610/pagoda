	function Photonic_Lightbox_PhotoSwipe() {
		Photonic_Lightbox.call(this);

		this.pswpSelector = '.pswp';
		this.videoSelector = 'a.photoswipe-video, a.photoswipe-html5-video';
		this.pswp = $(this.pswpSelector);
		if (this.pswp.length === 0) {
			this.pswp = '<!-- Root element of PhotoSwipe. Must have class pswp. -->\n' +
				'<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\n' +
				'\n' +
				'    <!-- Background of PhotoSwipe. \n' +
				'         It\'s a separate element as animating opacity is faster than rgba(). -->\n' +
				'    <div class="pswp__bg"></div>\n' +
				'\n' +
				'    <!-- Slides wrapper with overflow:hidden. -->\n' +
				'    <div class="pswp__scroll-wrap">\n' +
				'\n' +
				'        <!-- Container that holds slides. \n' +
				'            PhotoSwipe keeps only 3 of them in the DOM to save memory.\n' +
				'            Don\'t modify these 3 pswp__item elements, data is added later on. -->\n' +
				'        <div class="pswp__container">\n' +
				'            <div class="pswp__item"></div>\n' +
				'            <div class="pswp__item"></div>\n' +
				'            <div class="pswp__item"></div>\n' +
				'        </div>\n' +
				'\n' +
				'        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->\n' +
				'        <div class="pswp__ui pswp__ui--hidden">\n' +
				'\n' +
				'            <div class="pswp__top-bar">\n' +
				'                <!--  Controls are self-explanatory. Order can be changed. -->\n' +
				'                <div class="pswp__counter"></div>\n' +
				'                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\n' +
				'                <button class="pswp__button pswp__button--share" title="Share"></button>\n' +
				'                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>\n' +
				'                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\n' +
				'\n' +
				'                <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->\n' +
				'                <!-- element will get class pswp__preloader--active when preloader is running -->\n' +
				'                <div class="pswp__preloader">\n' +
				'                    <div class="pswp__preloader__icn">\n' +
				'                      <div class="pswp__preloader__cut">\n' +
				'                        <div class="pswp__preloader__donut"></div>\n' +
				'                      </div>\n' +
				'                    </div>\n' +
				'                </div>\n' +
				'            </div>\n' +
				'\n' +
				'            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\n' +
				'                <div class="pswp__share-tooltip"></div> \n' +
				'            </div>\n' +
				'\n' +
				'            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">\n' +
				'            </button>\n' +
				'\n' +
				'            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">\n' +
				'            </button>\n' +
				'\n' +
				'            <div class="pswp__caption">\n' +
				'                <div class="pswp__caption__center"></div>\n' +
				'            </div>\n' +
				'\n' +
				'        </div>\n' +
				'\n' +
				'    </div>\n' +
				'\n' +
				'</div>';
			$('body').append(this.pswp);
			this.pswp = $(this.pswpSelector);
		}

		$.expr[':'].parents = function(a,i,m){
			return jQuery(a).parents(m[3]).length < 1;
		};
	}
	Photonic_Lightbox_PhotoSwipe.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_PhotoSwipe.prototype.hostedVideo = function(a) {
		var html5 = a.getAttribute('href').match(new RegExp(/(\.mp4|\.webm|\.ogg)/i));
		var css = a.getAttribute('class');
		css = css !== undefined && css !== null && css.includes('photonic-launch-gallery');

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

	Photonic_Lightbox_PhotoSwipe.prototype.initialize = function(selector, selfSelect) {
		this.handleSolos();
		var self = this;

		self.items = {};
		self.solos = [];
		self.videos = [];
		$('.photonic-level-1-container').each(function(idx, container) {
			var galleryId = $(container).parents('.photonic-stream').attr('id');
			if (galleryId === undefined) {
				galleryId = $(container).parents('.photonic-panel').attr('id');
			}

			var links = $(container).find('.photonic-launch-gallery');
			var gallery = [];
			$(links).each(function(lidx, link) {
				var deep = $(link).data('photonicDeep');
				var pid = deep.split('/');
				var item;
				if ($(link).attr('data-html5-href') !== undefined) {
					item = {
						html: '<div class="photonic-video" id="ps-' + link.getAttribute('href').substring(1) + '">\n<video class="photonic" controls preload="none"><source src="' + $(link).attr('data-html5-href') + '" type="video/mp4">Your browser does not support HTML5 videos</video>',
						title: link.getAttribute('data-title')
					};
				}
				else {
					item = {
						src: link.getAttribute('href'),
						w: 0,
						h: 0,
						title: link.getAttribute('data-title'),
						pid: pid[1]
					};
				}
				gallery.push(item);
			});
			self.items[galleryId] = gallery;
		});

		$('a.launch-gallery-photoswipe').filter(':parents(.photonic-level-1)').each(function(i, link) { // Solo images
			var item = {
				src: link.getAttribute('href'),
				w: 0,
				h: 0,
				title: photonicHtmlDecode(link.getAttribute('data-title'))
			};
			self.solos.push([item]);
		});

		$(this.videoSelector).each(function(i, link) {
			var item;
			if ($(link).hasClass('photoswipe-video')) { // YouTube / Vimeo
				item = {
					html: '<div class="photonic-video"><iframe class="pswp__video" width="640" height="480" src="' + link.getAttribute('href') + '" frameborder="0" allowfullscreen></iframe></div>'
				};
			}
			else {
				item = {
					html: '<div class="photonic-video" id="ps-' + $($(link).attr('href')).attr('id') + '">\n<video class="photonic" controls preload="none"><source src="' + $(link).attr('data-html5-href') + '" type="video/mp4">Your browser does not support HTML5 videos</video>',
					title: $(link).data('title') === undefined ? ($(link).attr('title') === undefined ? '' : $(link).attr('title')) : $(link).data('title')
				}
			}
			self.videos.push([item]);
		});
	};

	Photonic_Lightbox_PhotoSwipe.prototype.initializeForNewContainer = function(containerId) {
		this.initialize(containerId);
	};

	Photonic_Lightbox_PhotoSwipe.prototype.parsePhotoSwipeHash = function() {
		var hash = window.location.hash.substring(1);
		var params = {};

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');
			if(pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid && params.gid.indexOf('photonic') !== 0) { // Not a Photonic hash
			return {};
		}

		return params;
	};

	Photonic_Lightbox_PhotoSwipe.prototype.openPhotoSwipe = function(index, galleryId, fromURL, isVideo) {
		var idx;
		var self = this;
		if (fromURL) {
			var a = $('#' + galleryId).find('a[data-photonic-deep="gallery[' + galleryId +']/' + index + '/"]');
			idx = $(a).parent().index();
		}

		var deepLinking = !(Photonic_JS.deep_linking === undefined || Photonic_JS.deep_linking === 'none' || galleryId === undefined || galleryId.indexOf('-stream') < 0);
		var shareButtons = [];
		if (!(Photonic_JS.social_media === undefined || Photonic_JS.social_media === '')) {
			shareButtons = [
				{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}&title={{text}}'},
				{id:'twitter', label:'Share on Twitter', url:'https://twitter.com/share?url={{url}}&text={{text}}'},
				{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'}
			];
		}
		shareButtons.push({id:'download', label:'Download image', url:'{{raw_image_url}}', download:true});

		var options = {
			index: (fromURL && deepLinking) ? idx : index,
			history: deepLinking,
			shareButtons: shareButtons,
			loop: Photonic_JS.lightbox_loop,
			galleryUID: galleryId,
			galleryPIDs: deepLinking
		};

		var galleryItems = isVideo ? self.videos[index] : (galleryId !== undefined ? self.items[galleryId] : self.solos[index]);
		var gallery = new PhotoSwipe(this.pswp[0], PhotoSwipeUI_Default, galleryItems, options);
		gallery.listen('gettingData', function(i, item) {
			if (item.src !== undefined && (item.w < 1 || item.h < 1)) { // unknown size
				var img = new Image();
				img.onload = function() { // will get size after load
					item.w = this.width; // set image width
					item.h = this.height; // set image height
					item.needsUpdate = true;
					gallery.updateSize(true); // reinit Items
				};
				img.src = item.src; // let's download image
			}
			else if (item.html !== undefined && (item.w < 1 || item.h < 1) && $(item.html).find('video').length > 0) {
				var videoSrc = $(item.html).find('source').attr('src');
				self.getVideoSize(videoSrc, {width: window.innerWidth, height: window.innerHeight}).then(function(dimensions) {
					item.h = dimensions.newHeight;
					item.w = dimensions.newWidth;

					var videoContainer = $(item.html).attr('id');
					$('#' + videoContainer).find('video').prop({width: dimensions.newWidth, height: dimensions.newHeight});
				});
			}
		});
		gallery.init();
	};

	Photonic_Lightbox_PhotoSwipe.prototype.initializeForExisting = function() {
		var self = this;

		$(document).on('click', 'a.launch-gallery-photoswipe', function(e) {
			e.preventDefault();
			var $clicked = $(this);
			var $node = $clicked.parents('.photonic-level-1');
			var galleryId = $clicked.parents('.photonic-stream').attr('id'); // On page
			if (galleryId === undefined) {
				galleryId = $clicked.parents('.photonic-panel').attr('id'); // In popup
			}

			var index = $node.index();
			if (index < 0) {
				index = $('a.launch-gallery-photoswipe').filter(':parents(.photonic-level-1)').index($clicked);
			}

			self.openPhotoSwipe(index, galleryId);
		});

		$(document).on('click', this.videoSelector, function(e) {
			e.preventDefault();
			var $clicked = $(this);
			var index = $(self.videoSelector).index($clicked);
			self.openPhotoSwipe(index, undefined, false, true);
		});
	};

	photonicLightbox = new Photonic_Lightbox_PhotoSwipe();
	photonicLightbox.initialize();
	photonicLightbox.initializeForExisting();

	if (!(Photonic_JS.deep_linking === undefined || Photonic_JS.deep_linking === 'none')) {
		var hash = photonicLightbox.parsePhotoSwipeHash();
		if (hash.pid && hash.gid) {
			photonicLightbox.openPhotoSwipe(hash.pid, hash.gid, true);
		}
	}
