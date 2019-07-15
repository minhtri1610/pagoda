/*! lightgallery - v1.6.11 - 2018-05-22
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2018 Sachin N; Licensed GPLv3 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module unless amdModuleId is set
		define(['jquery'], function (a0) {
			return (factory(a0));
		});
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('jquery'));
	} else {
		factory(root["jQuery"]);
	}
}(this, function ($) {

	(function() {
		'use strict';

		var defaults = {

			mode: 'lg-slide',

			// Ex : 'ease'
			cssEasing: 'ease',

			//'for jquery animation'
			easing: 'linear',
			speed: 600,
			height: '100%',
			width: '100%',
			addClass: '',
			startClass: 'lg-start-zoom',
			backdropDuration: 150,
			hideBarsDelay: 6000,

			useLeft: false,

			closable: true,
			loop: true,
			escKey: true,
			keyPress: true,
			controls: true,
			slideEndAnimatoin: true,
			hideControlOnEnd: false,
			mousewheel: true,

			getCaptionFromTitleOrAlt: true,

			// .lg-item || '.lg-sub-html'
			appendSubHtmlTo: '.lg-sub-html',

			subHtmlSelectorRelative: false,

			/**
			 * @desc number of preload slides
			 * will exicute only after the current slide is fully loaded.
			 *
			 * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
			 * slide will be loaded in the background after the 4th slide is fully loaded..
			 * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
			 *
			 */
			preload: 1,
			showAfterLoad: true,
			selector: '',
			selectWithin: '',
			nextHtml: '',
			prevHtml: '',

			// 0, 1
			index: false,

			iframeMaxWidth: '100%',

			download: true,
			counter: true,
			appendCounterTo: '.lg-toolbar',

			swipeThreshold: 50,
			enableSwipe: true,
			enableDrag: true,

			dynamic: false,
			dynamicEl: [],
			galleryId: 1
		};

		function Plugin(element, options) {

			// Current lightGallery element
			this.el = element;

			// Current jquery element
			this.$el = $(element);

			// lightGallery settings
			this.s = $.extend({}, defaults, options);

			// When using dynamic mode, ensure dynamicEl is an array
			if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
				throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
			}

			// lightGallery modules
			this.modules = {};

			// false when lightgallery complete first slide;
			this.lGalleryOn = false;

			this.lgBusy = false;

			// Timeout function for hiding controls;
			this.hideBartimeout = false;

			// To determine browser supports for touch events;
			this.isTouch = ('ontouchstart' in document.documentElement);

			// Disable hideControlOnEnd if sildeEndAnimation is true
			if (this.s.slideEndAnimatoin) {
				this.s.hideControlOnEnd = false;
			}

			// Gallery items
			if (this.s.dynamic) {
				this.$items = this.s.dynamicEl;
			} else {
				if (this.s.selector === 'this') {
					this.$items = this.$el;
				} else if (this.s.selector !== '') {
					if (this.s.selectWithin) {
						this.$items = $(this.s.selectWithin).find(this.s.selector);
					} else {
						this.$items = this.$el.find($(this.s.selector));
					}
				} else {
					this.$items = this.$el.children();
				}
			}

			// .lg-item
			this.$slide = '';

			// .lg-outer
			this.$outer = '';

			this.init();

			return this;
		}

		Plugin.prototype.init = function() {

			var _this = this;

			// s.preload should not be more than $item.length
			if (_this.s.preload > _this.$items.length) {
				_this.s.preload = _this.$items.length;
			}

			// if dynamic option is enabled execute immediately
			var _hash = window.location.hash;
			if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {

				_this.index = parseInt(_hash.split('&slide=')[1], 10);

				$('body').addClass('lg-from-hash');
				if (!$('body').hasClass('lg-on')) {
					setTimeout(function() {
						_this.build(_this.index);
					});

					$('body').addClass('lg-on');
				}
			}

			if (_this.s.dynamic) {

				_this.$el.trigger('onBeforeOpen.lg');

				_this.index = _this.s.index || 0;

				// prevent accidental double execution
				if (!$('body').hasClass('lg-on')) {
					setTimeout(function() {
						_this.build(_this.index);
						$('body').addClass('lg-on');
					});
				}
			} else {

				// Using different namespace for click because click event should not unbind if selector is same object('this')
				_this.$items.on('click.lgcustom', function(event) {

					// For IE8
					try {
						event.preventDefault();
						event.preventDefault();
					} catch (er) {
						event.returnValue = false;
					}

					_this.$el.trigger('onBeforeOpen.lg');

					_this.index = _this.s.index || _this.$items.index(this);

					// prevent accidental double execution
					if (!$('body').hasClass('lg-on')) {
						_this.build(_this.index);
						$('body').addClass('lg-on');
					}
				});
			}

		};

		Plugin.prototype.build = function(index) {

			var _this = this;

			_this.structure();

			// module constructor
			$.each($.fn.lightGallery.modules, function(key) {
				_this.modules[key] = new $.fn.lightGallery.modules[key](_this.el);
			});

			// initiate slide function
			_this.slide(index, false, false, false);

			if (_this.s.keyPress) {
				_this.keyPress();
			}

			if (_this.$items.length > 1) {

				_this.arrow();

				setTimeout(function() {
					_this.enableDrag();
					_this.enableSwipe();
				}, 50);

				if (_this.s.mousewheel) {
					_this.mousewheel();
				}
			} else {
				_this.$slide.on('click.lg', function() {
					_this.$el.trigger('onSlideClick.lg');
				});
			}

			_this.counter();

			_this.closeGallery();

			_this.$el.trigger('onAfterOpen.lg');

			// Hide controllers if mouse doesn't move for some period
			_this.$outer.on('mousemove.lg click.lg touchstart.lg', function() {

				_this.$outer.removeClass('lg-hide-items');

				clearTimeout(_this.hideBartimeout);

				// Timeout will be cleared on each slide movement also
				_this.hideBartimeout = setTimeout(function() {
					_this.$outer.addClass('lg-hide-items');
				}, _this.s.hideBarsDelay);

			});

			_this.$outer.trigger('mousemove.lg');

		};

		Plugin.prototype.structure = function() {
			var list = '';
			var controls = '';
			var i = 0;
			var subHtmlCont = '';
			var template;
			var _this = this;

			$('body').append('<div class="lg-backdrop"></div>');
			$('.lg-backdrop').css('transition-duration', this.s.backdropDuration + 'ms');

			// Create gallery items
			for (i = 0; i < this.$items.length; i++) {
				list += '<div class="lg-item"></div>';
			}

			// Create controlls
			if (this.s.controls && this.$items.length > 1) {
				controls = '<div class="lg-actions">' +
					'<button class="lg-prev lg-icon">' + this.s.prevHtml + '</button>' +
					'<button class="lg-next lg-icon">' + this.s.nextHtml + '</button>' +
					'</div>';
			}

			if (this.s.appendSubHtmlTo === '.lg-sub-html') {
				subHtmlCont = '<div class="lg-sub-html"></div>';
			}

			template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' +
				'<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' +
				'<div class="lg-inner">' + list + '</div>' +
				'<div class="lg-toolbar lg-group">' +
				'<span class="lg-close lg-icon"></span>' +
				'</div>' +
				controls +
				subHtmlCont +
				'</div>' +
				'</div>';

			$('body').append(template);
			this.$outer = $('.lg-outer');
			this.$slide = this.$outer.find('.lg-item');

			if (this.s.useLeft) {
				this.$outer.addClass('lg-use-left');

				// Set mode lg-slide if use left is true;
				this.s.mode = 'lg-slide';
			} else {
				this.$outer.addClass('lg-use-css3');
			}

			// For fixed height gallery
			_this.setTop();
			$(window).on('resize.lg orientationchange.lg', function() {
				setTimeout(function() {
					_this.setTop();
				}, 100);
			});

			// add class lg-current to remove initial transition
			this.$slide.eq(this.index).addClass('lg-current');

			// add Class for css support and transition mode
			if (this.doCss()) {
				this.$outer.addClass('lg-css3');
			} else {
				this.$outer.addClass('lg-css');

				// Set speed 0 because no animation will happen if browser doesn't support css3
				this.s.speed = 0;
			}

			this.$outer.addClass(this.s.mode);

			if (this.s.enableDrag && this.$items.length > 1) {
				this.$outer.addClass('lg-grab');
			}

			if (this.s.showAfterLoad) {
				this.$outer.addClass('lg-show-after-load');
			}

			if (this.doCss()) {
				var $inner = this.$outer.find('.lg-inner');
				$inner.css('transition-timing-function', this.s.cssEasing);
				$inner.css('transition-duration', this.s.speed + 'ms');
			}

			setTimeout(function() {
				$('.lg-backdrop').addClass('in');
			});

			setTimeout(function() {
				_this.$outer.addClass('lg-visible');
			}, this.s.backdropDuration);

			if (this.s.download) {
				this.$outer.find('.lg-toolbar').append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
			}

			// Store the current scroll top value to scroll back after closing the gallery..
			this.prevScrollTop = $(window).scrollTop();

		};

		// For fixed height gallery
		Plugin.prototype.setTop = function() {
			if (this.s.height !== '100%') {
				var wH = $(window).height();
				var top = (wH - parseInt(this.s.height, 10)) / 2;
				var $lGallery = this.$outer.find('.lg');
				if (wH >= parseInt(this.s.height, 10)) {
					$lGallery.css('top', top + 'px');
				} else {
					$lGallery.css('top', '0px');
				}
			}
		};

		// Find css3 support
		Plugin.prototype.doCss = function() {
			// check for css animation support
			var support = function() {
				var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
				var root = document.documentElement;
				var i = 0;
				for (i = 0; i < transition.length; i++) {
					if (transition[i] in root.style) {
						return true;
					}
				}
			};

			if (support()) {
				return true;
			}

			return false;
		};

		/**
		 *  @desc Check the given src is video
		 *  @param {String} src
		 *  @return {Object} video type
		 *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
		 */
		Plugin.prototype.isVideo = function(src, index) {

			var html;
			if (this.s.dynamic) {
				html = this.s.dynamicEl[index].html;
			} else {
				html = this.$items.eq(index).attr('data-html');
			}

			if (!src) {
				if(html) {
					return {
						html5: true
					};
				} else {
					console.error('lightGallery :- data-src is not pvovided on slide item ' + (index + 1) + '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html');
					return false;
				}
			}

			var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
			var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
			var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
			var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

			if (youtube) {
				return {
					youtube: youtube
				};
			} else if (vimeo) {
				return {
					vimeo: vimeo
				};
			} else if (dailymotion) {
				return {
					dailymotion: dailymotion
				};
			} else if (vk) {
				return {
					vk: vk
				};
			}
		};

		/**
		 *  @desc Create image counter
		 *  Ex: 1/10
		 */
		Plugin.prototype.counter = function() {
			if (this.s.counter) {
				$(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.$items.length + '</span></div>');
			}
		};

		/**
		 *  @desc add sub-html into the slide
		 *  @param {Number} index - index of the slide
		 */
		Plugin.prototype.addHtml = function(index) {
			var subHtml = null;
			var subHtmlUrl;
			var $currentEle;
			if (this.s.dynamic) {
				if (this.s.dynamicEl[index].subHtmlUrl) {
					subHtmlUrl = this.s.dynamicEl[index].subHtmlUrl;
				} else {
					subHtml = this.s.dynamicEl[index].subHtml;
				}
			} else {
				$currentEle = this.$items.eq(index);
				if ($currentEle.attr('data-sub-html-url')) {
					subHtmlUrl = $currentEle.attr('data-sub-html-url');
				} else {
					subHtml = $currentEle.attr('data-sub-html');
					if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
						subHtml = $currentEle.attr('title') || $currentEle.find('img').first().attr('alt');
					}
				}
			}

			if (!subHtmlUrl) {
				if (typeof subHtml !== 'undefined' && subHtml !== null) {

					// get first letter of subhtml
					// if first letter starts with . or # get the html form the jQuery object
					var fL = subHtml.substring(0, 1);
					if (fL === '.' || fL === '#') {
						if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
							subHtml = $currentEle.find(subHtml).html();
						} else {
							subHtml = $(subHtml).html();
						}
					}
				} else {
					subHtml = '';
				}
			}

			if (this.s.appendSubHtmlTo === '.lg-sub-html') {

				if (subHtmlUrl) {
					this.$outer.find(this.s.appendSubHtmlTo).load(subHtmlUrl);
				} else {
					this.$outer.find(this.s.appendSubHtmlTo).html(subHtml);
				}

			} else {

				if (subHtmlUrl) {
					this.$slide.eq(index).load(subHtmlUrl);
				} else {
					this.$slide.eq(index).append(subHtml);
				}
			}

			// Add lg-empty-html class if title doesn't exist
			if (typeof subHtml !== 'undefined' && subHtml !== null) {
				if (subHtml === '') {
					this.$outer.find(this.s.appendSubHtmlTo).addClass('lg-empty-html');
				} else {
					this.$outer.find(this.s.appendSubHtmlTo).removeClass('lg-empty-html');
				}
			}

			this.$el.trigger('onAfterAppendSubHtml.lg', [index]);
		};

		/**
		 *  @desc Preload slides
		 *  @param {Number} index - index of the slide
		 */
		Plugin.prototype.preload = function(index) {
			var i = 1;
			var j = 1;
			for (i = 1; i <= this.s.preload; i++) {
				if (i >= this.$items.length - index) {
					break;
				}

				this.loadContent(index + i, false, 0);
			}

			for (j = 1; j <= this.s.preload; j++) {
				if (index - j < 0) {
					break;
				}

				this.loadContent(index - j, false, 0);
			}
		};

		/**
		 *  @desc Load slide content into slide.
		 *  @param {Number} index - index of the slide.
		 *  @param {Boolean} rec - if true call loadcontent() function again.
		 *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
		 */
		Plugin.prototype.loadContent = function(index, rec, delay) {

			var _this = this;
			var _hasPoster = false;
			var _$img;
			var _src;
			var _poster;
			var _srcset;
			var _sizes;
			var _html;
			var getResponsiveSrc = function(srcItms) {
				var rsWidth = [];
				var rsSrc = [];
				for (var i = 0; i < srcItms.length; i++) {
					var __src = srcItms[i].split(' ');

					// Manage empty space
					if (__src[0] === '') {
						__src.splice(0, 1);
					}

					rsSrc.push(__src[0]);
					rsWidth.push(__src[1]);
				}

				var wWidth = $(window).width();
				for (var j = 0; j < rsWidth.length; j++) {
					if (parseInt(rsWidth[j], 10) > wWidth) {
						_src = rsSrc[j];
						break;
					}
				}
			};

			if (_this.s.dynamic) {

				if (_this.s.dynamicEl[index].poster) {
					_hasPoster = true;
					_poster = _this.s.dynamicEl[index].poster;
				}

				_html = _this.s.dynamicEl[index].html;
				_src = _this.s.dynamicEl[index].src;

				if (_this.s.dynamicEl[index].responsive) {
					var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
					getResponsiveSrc(srcDyItms);
				}

				_srcset = _this.s.dynamicEl[index].srcset;
				_sizes = _this.s.dynamicEl[index].sizes;

			} else {

				if (_this.$items.eq(index).attr('data-poster')) {
					_hasPoster = true;
					_poster = _this.$items.eq(index).attr('data-poster');
				}

				_html = _this.$items.eq(index).attr('data-html');
				_src = _this.$items.eq(index).attr('href') || _this.$items.eq(index).attr('data-src');

				if (_this.$items.eq(index).attr('data-responsive')) {
					var srcItms = _this.$items.eq(index).attr('data-responsive').split(',');
					getResponsiveSrc(srcItms);
				}

				_srcset = _this.$items.eq(index).attr('data-srcset');
				_sizes = _this.$items.eq(index).attr('data-sizes');

			}

			//if (_src || _srcset || _sizes || _poster) {

			var iframe = false;
			if (_this.s.dynamic) {
				if (_this.s.dynamicEl[index].iframe) {
					iframe = true;
				}
			} else {
				if (_this.$items.eq(index).attr('data-iframe') === 'true') {
					iframe = true;
				}
			}

			var _isVideo = _this.isVideo(_src, index);
			if (!_this.$slide.eq(index).hasClass('lg-loaded')) {
				if (iframe) {
					_this.$slide.eq(index).prepend('<div class="lg-video-cont lg-has-iframe" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
				} else if (_hasPoster) {
					var videoClass = '';
					if (_isVideo && _isVideo.youtube) {
						videoClass = 'lg-has-youtube';
					} else if (_isVideo && _isVideo.vimeo) {
						videoClass = 'lg-has-vimeo';
					} else {
						videoClass = 'lg-has-html5';
					}

					_this.$slide.eq(index).prepend('<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');

				} else if (_isVideo) {
					_this.$slide.eq(index).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>');
					_this.$el.trigger('hasVideo.lg', [index, _src, _html]);
				} else {
					_this.$slide.eq(index).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
				}

				_this.$el.trigger('onAferAppendSlide.lg', [index]);

				_$img = _this.$slide.eq(index).find('.lg-object');
				if (_sizes) {
					_$img.attr('sizes', _sizes);
				}

				if (_srcset) {
					_$img.attr('srcset', _srcset);
					try {
						picturefill({
							elements: [_$img[0]]
						});
					} catch (e) {
						console.warn('lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document.');
					}
				}

				if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
					_this.addHtml(index);
				}

				_this.$slide.eq(index).addClass('lg-loaded');
			}

			_this.$slide.eq(index).find('.lg-object').on('load.lg error.lg', function() {

				// For first time add some delay for displaying the start animation.
				var _speed = 0;

				// Do not change the delay value because it is required for zoom plugin.
				// If gallery opened from direct url (hash) speed value should be 0
				if (delay && !$('body').hasClass('lg-from-hash')) {
					_speed = delay;
				}

				setTimeout(function() {
					_this.$slide.eq(index).addClass('lg-complete');
					_this.$el.trigger('onSlideItemLoad.lg', [index, delay || 0]);
				}, _speed);

			});

			// @todo check load state for html5 videos
			if (_isVideo && _isVideo.html5 && !_hasPoster) {
				_this.$slide.eq(index).addClass('lg-complete');
			}

			if (rec === true) {
				if (!_this.$slide.eq(index).hasClass('lg-complete')) {
					_this.$slide.eq(index).find('.lg-object').on('load.lg error.lg', function() {
						_this.preload(index);
					});
				} else {
					_this.preload(index);
				}
			}

			//}
		};

		/**
		 *   @desc slide function for lightgallery
		 ** Slide() gets call on start
		 ** ** Set lg.on true once slide() function gets called.
		 ** Call loadContent() on slide() function inside setTimeout
		 ** ** On first slide we do not want any animation like slide of fade
		 ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
		 ** ** Else loadContent() should wait for the transition to complete.
		 ** ** So set timeout s.speed + 50
		 <=> ** loadContent() will load slide content in to the particular slide
		 ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
		 ** ** preload will execute only when the previous slide is fully loaded (images iframe)
		 ** ** avoid simultaneous image load
		 <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
		 ** loadContent()  <====> Preload();

		 *   @param {Number} index - index of the slide
		 *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
		 *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
		 *   @param {String} direction - Direction of the slide(next/prev)
		 */
		Plugin.prototype.slide = function(index, fromTouch, fromThumb, direction) {

			var _prevIndex = this.$outer.find('.lg-current').index();
			var _this = this;

			// Prevent if multiple call
			// Required for hsh plugin
			if (_this.lGalleryOn && (_prevIndex === index)) {
				return;
			}

			var _length = this.$slide.length;
			var _time = _this.lGalleryOn ? this.s.speed : 0;

			if (!_this.lgBusy) {

				if (this.s.download) {
					var _src;
					if (_this.s.dynamic) {
						_src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
					} else {
						_src = _this.$items.eq(index).attr('data-download-url') !== 'false' && (_this.$items.eq(index).attr('data-download-url') || _this.$items.eq(index).attr('href') || _this.$items.eq(index).attr('data-src'));

					}

					if (_src) {
						$('#lg-download').attr('href', _src);
						_this.$outer.removeClass('lg-hide-download');
					} else {
						_this.$outer.addClass('lg-hide-download');
					}
				}

				this.$el.trigger('onBeforeSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);

				_this.lgBusy = true;

				clearTimeout(_this.hideBartimeout);

				// Add title if this.s.appendSubHtmlTo === lg-sub-html
				if (this.s.appendSubHtmlTo === '.lg-sub-html') {

					// wait for slide animation to complete
					setTimeout(function() {
						_this.addHtml(index);
					}, _time);
				}

				this.arrowDisable(index);

				if (!direction) {
					if (index < _prevIndex) {
						direction = 'prev';
					} else if (index > _prevIndex) {
						direction = 'next';
					}
				}

				if (!fromTouch) {

					// remove all transitions
					_this.$outer.addClass('lg-no-trans');

					this.$slide.removeClass('lg-prev-slide lg-next-slide');

					if (direction === 'prev') {

						//prevslide
						this.$slide.eq(index).addClass('lg-prev-slide');
						this.$slide.eq(_prevIndex).addClass('lg-next-slide');
					} else {

						// next slide
						this.$slide.eq(index).addClass('lg-next-slide');
						this.$slide.eq(_prevIndex).addClass('lg-prev-slide');
					}

					// give 50 ms for browser to add/remove class
					setTimeout(function() {
						_this.$slide.removeClass('lg-current');

						//_this.$slide.eq(_prevIndex).removeClass('lg-current');
						_this.$slide.eq(index).addClass('lg-current');

						// reset all transitions
						_this.$outer.removeClass('lg-no-trans');
					}, 50);
				} else {

					this.$slide.removeClass('lg-prev-slide lg-current lg-next-slide');
					var touchPrev;
					var touchNext;
					if (_length > 2) {
						touchPrev = index - 1;
						touchNext = index + 1;

						if ((index === 0) && (_prevIndex === _length - 1)) {

							// next slide
							touchNext = 0;
							touchPrev = _length - 1;
						} else if ((index === _length - 1) && (_prevIndex === 0)) {

							// prev slide
							touchNext = 0;
							touchPrev = _length - 1;
						}

					} else {
						touchPrev = 0;
						touchNext = 1;
					}

					if (direction === 'prev') {
						_this.$slide.eq(touchNext).addClass('lg-next-slide');
					} else {
						_this.$slide.eq(touchPrev).addClass('lg-prev-slide');
					}

					_this.$slide.eq(index).addClass('lg-current');
				}

				if (_this.lGalleryOn) {
					setTimeout(function() {
						_this.loadContent(index, true, 0);
					}, this.s.speed + 50);

					setTimeout(function() {
						_this.lgBusy = false;
						_this.$el.trigger('onAfterSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
					}, this.s.speed);

				} else {
					_this.loadContent(index, true, _this.s.backdropDuration);

					_this.lgBusy = false;
					_this.$el.trigger('onAfterSlide.lg', [_prevIndex, index, fromTouch, fromThumb]);
				}

				_this.lGalleryOn = true;

				if (this.s.counter) {
					$('#lg-counter-current').text(index + 1);
				}

			}
			_this.index = index;

		};

		/**
		 *  @desc Go to next slide
		 *  @param {Boolean} fromTouch - true if slide function called via touch event
		 */
		Plugin.prototype.goToNextSlide = function(fromTouch) {
			var _this = this;
			var _loop = _this.s.loop;
			if (fromTouch && _this.$slide.length < 3) {
				_loop = false;
			}

			if (!_this.lgBusy) {
				if ((_this.index + 1) < _this.$slide.length) {
					_this.index++;
					_this.$el.trigger('onBeforeNextSlide.lg', [_this.index]);
					_this.slide(_this.index, fromTouch, false, 'next');
				} else {
					if (_loop) {
						_this.index = 0;
						_this.$el.trigger('onBeforeNextSlide.lg', [_this.index]);
						_this.slide(_this.index, fromTouch, false, 'next');
					} else if (_this.s.slideEndAnimatoin && !fromTouch) {
						_this.$outer.addClass('lg-right-end');
						setTimeout(function() {
							_this.$outer.removeClass('lg-right-end');
						}, 400);
					}
				}
			}
		};

		/**
		 *  @desc Go to previous slide
		 *  @param {Boolean} fromTouch - true if slide function called via touch event
		 */
		Plugin.prototype.goToPrevSlide = function(fromTouch) {
			var _this = this;
			var _loop = _this.s.loop;
			if (fromTouch && _this.$slide.length < 3) {
				_loop = false;
			}

			if (!_this.lgBusy) {
				if (_this.index > 0) {
					_this.index--;
					_this.$el.trigger('onBeforePrevSlide.lg', [_this.index, fromTouch]);
					_this.slide(_this.index, fromTouch, false, 'prev');
				} else {
					if (_loop) {
						_this.index = _this.$items.length - 1;
						_this.$el.trigger('onBeforePrevSlide.lg', [_this.index, fromTouch]);
						_this.slide(_this.index, fromTouch, false, 'prev');
					} else if (_this.s.slideEndAnimatoin && !fromTouch) {
						_this.$outer.addClass('lg-left-end');
						setTimeout(function() {
							_this.$outer.removeClass('lg-left-end');
						}, 400);
					}
				}
			}
		};

		Plugin.prototype.keyPress = function() {
			var _this = this;
			if (this.$items.length > 1) {
				$(window).on('keyup.lg', function(e) {
					if (_this.$items.length > 1) {
						if (e.keyCode === 37) {
							e.preventDefault();
							_this.goToPrevSlide();
						}

						if (e.keyCode === 39) {
							e.preventDefault();
							_this.goToNextSlide();
						}
					}
				});
			}

			$(window).on('keydown.lg', function(e) {
				if (_this.s.escKey === true && e.keyCode === 27) {
					e.preventDefault();
					if (!_this.$outer.hasClass('lg-thumb-open')) {
						_this.destroy();
					} else {
						_this.$outer.removeClass('lg-thumb-open');
					}
				}
			});
		};

		Plugin.prototype.arrow = function() {
			var _this = this;
			this.$outer.find('.lg-prev').on('click.lg', function() {
				_this.goToPrevSlide();
			});

			this.$outer.find('.lg-next').on('click.lg', function() {
				_this.goToNextSlide();
			});
		};

		Plugin.prototype.arrowDisable = function(index) {

			// Disable arrows if s.hideControlOnEnd is true
			if (!this.s.loop && this.s.hideControlOnEnd) {
				if ((index + 1) < this.$slide.length) {
					this.$outer.find('.lg-next').removeAttr('disabled').removeClass('disabled');
				} else {
					this.$outer.find('.lg-next').attr('disabled', 'disabled').addClass('disabled');
				}

				if (index > 0) {
					this.$outer.find('.lg-prev').removeAttr('disabled').removeClass('disabled');
				} else {
					this.$outer.find('.lg-prev').attr('disabled', 'disabled').addClass('disabled');
				}
			}
		};

		Plugin.prototype.setTranslate = function($el, xValue, yValue) {
			// jQuery supports Automatic CSS prefixing since jQuery 1.8.0
			if (this.s.useLeft) {
				$el.css('left', xValue);
			} else {
				$el.css({
					transform: 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)'
				});
			}
		};

		Plugin.prototype.touchMove = function(startCoords, endCoords) {

			var distance = endCoords - startCoords;

			if (Math.abs(distance) > 15) {
				// reset opacity and transition duration
				this.$outer.addClass('lg-dragging');

				// move current slide
				this.setTranslate(this.$slide.eq(this.index), distance, 0);

				// move next and prev slide with current slide
				this.setTranslate($('.lg-prev-slide'), -this.$slide.eq(this.index).width() + distance, 0);
				this.setTranslate($('.lg-next-slide'), this.$slide.eq(this.index).width() + distance, 0);
			}
		};

		Plugin.prototype.touchEnd = function(distance) {
			var _this = this;

			// keep slide animation for any mode while dragg/swipe
			if (_this.s.mode !== 'lg-slide') {
				_this.$outer.addClass('lg-slide');
			}

			this.$slide.not('.lg-current, .lg-prev-slide, .lg-next-slide').css('opacity', '0');

			// set transition duration
			setTimeout(function() {
				_this.$outer.removeClass('lg-dragging');
				if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
					_this.goToNextSlide(true);
				} else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
					_this.goToPrevSlide(true);
				} else if (Math.abs(distance) < 5) {

					// Trigger click if distance is less than 5 pix
					_this.$el.trigger('onSlideClick.lg');
				}

				_this.$slide.removeAttr('style');
			});

			// remove slide class once drag/swipe is completed if mode is not slide
			setTimeout(function() {
				if (!_this.$outer.hasClass('lg-dragging') && _this.s.mode !== 'lg-slide') {
					_this.$outer.removeClass('lg-slide');
				}
			}, _this.s.speed + 100);

		};

		Plugin.prototype.enableSwipe = function() {
			var _this = this;
			var startCoords = 0;
			var endCoords = 0;
			var isMoved = false;

			if (_this.s.enableSwipe && _this.doCss()) {

				_this.$slide.on('touchstart.lg', function(e) {
					if (!_this.$outer.hasClass('lg-zoomed') && !_this.lgBusy) {
						e.preventDefault();
						_this.manageSwipeClass();
						startCoords = e.originalEvent.targetTouches[0].pageX;
					}
				});

				_this.$slide.on('touchmove.lg', function(e) {
					if (!_this.$outer.hasClass('lg-zoomed')) {
						e.preventDefault();
						endCoords = e.originalEvent.targetTouches[0].pageX;
						_this.touchMove(startCoords, endCoords);
						isMoved = true;
					}
				});

				_this.$slide.on('touchend.lg', function() {
					if (!_this.$outer.hasClass('lg-zoomed')) {
						if (isMoved) {
							isMoved = false;
							_this.touchEnd(endCoords - startCoords);
						} else {
							_this.$el.trigger('onSlideClick.lg');
						}
					}
				});
			}

		};

		Plugin.prototype.enableDrag = function() {
			var _this = this;
			var startCoords = 0;
			var endCoords = 0;
			var isDraging = false;
			var isMoved = false;
			if (_this.s.enableDrag && _this.doCss()) {
				_this.$slide.on('mousedown.lg', function(e) {
					if (!_this.$outer.hasClass('lg-zoomed') && !_this.lgBusy && !$(e.target).text().trim()) {
						e.preventDefault();
						_this.manageSwipeClass();
						startCoords = e.pageX;
						isDraging = true;

						// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
						_this.$outer.scrollLeft += 1;
						_this.$outer.scrollLeft -= 1;

						// *

						_this.$outer.removeClass('lg-grab').addClass('lg-grabbing');

						_this.$el.trigger('onDragstart.lg');
					}
				});

				$(window).on('mousemove.lg', function(e) {
					if (isDraging) {
						isMoved = true;
						endCoords = e.pageX;
						_this.touchMove(startCoords, endCoords);
						_this.$el.trigger('onDragmove.lg');
					}
				});

				$(window).on('mouseup.lg', function(e) {
					if (isMoved) {
						isMoved = false;
						_this.touchEnd(endCoords - startCoords);
						_this.$el.trigger('onDragend.lg');
					} else if ($(e.target).hasClass('lg-object') || $(e.target).hasClass('lg-video-play')) {
						_this.$el.trigger('onSlideClick.lg');
					}

					// Prevent execution on click
					if (isDraging) {
						isDraging = false;
						_this.$outer.removeClass('lg-grabbing').addClass('lg-grab');
					}
				});

			}
		};

		Plugin.prototype.manageSwipeClass = function() {
			var _touchNext = this.index + 1;
			var _touchPrev = this.index - 1;
			if (this.s.loop && this.$slide.length > 2) {
				if (this.index === 0) {
					_touchPrev = this.$slide.length - 1;
				} else if (this.index === this.$slide.length - 1) {
					_touchNext = 0;
				}
			}

			this.$slide.removeClass('lg-next-slide lg-prev-slide');
			if (_touchPrev > -1) {
				this.$slide.eq(_touchPrev).addClass('lg-prev-slide');
			}

			this.$slide.eq(_touchNext).addClass('lg-next-slide');
		};

		Plugin.prototype.mousewheel = function() {
			var _this = this;
			_this.$outer.on('mousewheel.lg', function(e) {

				if (!e.deltaY) {
					return;
				}

				if (e.deltaY > 0) {
					_this.goToPrevSlide();
				} else {
					_this.goToNextSlide();
				}

				e.preventDefault();
			});

		};

		Plugin.prototype.closeGallery = function() {

			var _this = this;
			var mousedown = false;
			this.$outer.find('.lg-close').on('click.lg', function() {
				_this.destroy();
			});

			if (_this.s.closable) {

				// If you drag the slide and release outside gallery gets close on chrome
				// for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
				_this.$outer.on('mousedown.lg', function(e) {

					if ($(e.target).is('.lg-outer') || $(e.target).is('.lg-item ') || $(e.target).is('.lg-img-wrap')) {
						mousedown = true;
					} else {
						mousedown = false;
					}

				});

				_this.$outer.on('mousemove.lg', function() {
					mousedown = false;
				});

				_this.$outer.on('mouseup.lg', function(e) {

					if ($(e.target).is('.lg-outer') || $(e.target).is('.lg-item ') || $(e.target).is('.lg-img-wrap') && mousedown) {
						if (!_this.$outer.hasClass('lg-dragging')) {
							_this.destroy();
						}
					}

				});

			}

		};

		Plugin.prototype.destroy = function(d) {
			var _this = this;

			if (!d) {
				_this.$el.trigger('onBeforeClose.lg');
				$(window).scrollTop(_this.prevScrollTop);
			}


			/**
			 * if d is false or undefined destroy will only close the gallery
			 * plugins instance remains with the element
			 *
			 * if d is true destroy will completely remove the plugin
			 */

			if (d) {
				if (!_this.s.dynamic) {
					// only when not using dynamic mode is $items a jquery collection
					this.$items.off('click.lg click.lgcustom');
				}

				$.removeData(_this.el, 'lightGallery');
			}

			// Unbind all events added by lightGallery
			this.$el.off('.lg.tm');

			// Distroy all lightGallery modules
			$.each($.fn.lightGallery.modules, function(key) {
				if (_this.modules[key]) {
					_this.modules[key].destroy();
				}
			});

			this.lGalleryOn = false;

			clearTimeout(_this.hideBartimeout);
			this.hideBartimeout = false;
			$(window).off('.lg');
			$('body').removeClass('lg-on lg-from-hash');

			if (_this.$outer) {
				_this.$outer.removeClass('lg-visible');
			}

			$('.lg-backdrop').removeClass('in');

			setTimeout(function() {
				if (_this.$outer) {
					_this.$outer.remove();
				}

				$('.lg-backdrop').remove();

				if (!d) {
					_this.$el.trigger('onCloseAfter.lg');
				}

			}, _this.s.backdropDuration + 50);
		};

		$.fn.lightGallery = function(options) {
			return this.each(function() {
				if (!$.data(this, 'lightGallery')) {
					$.data(this, 'lightGallery', new Plugin(this, options));
				} else {
					try {
						$(this).data('lightGallery').init();
					} catch (err) {
						console.error('lightGallery has not initiated properly');
					}
				}
			});
		};

		$.fn.lightGallery.modules = {};

	})();


}));
//WaitForImages
!function(e){"function"===typeof define&&define.amd?define(["jquery"],e):"object"===typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){var r="waitForImages";e.waitForImages={hasImageProperties:["backgroundImage","listStyleImage","borderImage","borderCornerImage","cursor"],hasImageAttributes:["srcset"]},e.expr[":"]["has-src"]=function(r){return e(r).is('img[src][src!=""]')},e.expr[":"].uncached=function(r){return e(r).is(":has-src")?!r.complete:!1},e.fn.waitForImages=function(){var t,n,s,a=0,i=0,o=e.Deferred();if(e.isPlainObject(arguments[0])?(s=arguments[0].waitForAll,n=arguments[0].each,t=arguments[0].finished):1===arguments.length&&"boolean"===e.type(arguments[0])?s=arguments[0]:(t=arguments[0],n=arguments[1],s=arguments[2]),t=t||e.noop,n=n||e.noop,s=!!s,!e.isFunction(t)||!e.isFunction(n))throw new TypeError("An invalid callback was supplied.");return this.each(function(){var c=e(this),u=[],m=e.waitForImages.hasImageProperties||[],h=e.waitForImages.hasImageAttributes||[],l=/url\(\s*(['"]?)(.*?)\1\s*\)/g;s?c.find("*").addBack().each(function(){var r=e(this);r.is("img:has-src")&&u.push({src:r.attr("src"),element:r[0]}),e.each(m,function(e,t){var n,s=r.css(t);if(!s)return!0;for(;n=l.exec(s);)u.push({src:n[2],element:r[0]})}),e.each(h,function(t,n){var s,a=r.attr(n);return a?(s=a.split(","),void e.each(s,function(t,n){n=e.trim(n).split(" ")[0],u.push({src:n,element:r[0]})})):!0})}):c.find("img:has-src").each(function(){u.push({src:this.src,element:this})}),a=u.length,i=0,0===a&&(t.call(c[0]),o.resolveWith(c[0])),e.each(u,function(s,u){var m=new Image,h="load."+r+" error."+r;e(m).one(h,function l(r){var s=[i,a,"load"===r.type];return i++,n.apply(u.element,s),o.notifyWith(u.element,s),e(this).off(h,l),i===a?(t.call(c[0]),o.resolveWith(c[0]),!1):void 0}),m.src=u.src})}),o.promise()}});

//PhotonicModal
!function(o){o.fn.photonicModal=function(n){function a(n){o(document).height()>o(window).height();o("body, html").css({overflow:"hidden"}),n.hasClass(d.modalTarget+"-off")&&(n.removeClass(d.modalTarget+"-off"),n.addClass(d.modalTarget+"-on")),n.hasClass(d.modalTarget+"-on")&&(d.beforeOpen(),n.css({opacity:d.opacityIn,"z-index":d.zIndexIn}),n.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",t)),l.css("overflow-y",d.overflow).fadeIn(),n.appendTo(s).css("overflow-y",d.overflow).hide().slideDown("slow")}function e(){c.css({"z-index":d.zIndexOut}),d.afterClose()}function t(){d.afterOpen()}var i=o(this),d=o.extend({modalTarget:"photonicModal",closeCSS:"",closeFromRight:0,width:"80%",height:"100%",top:"0px",left:"0px",zIndexIn:"9999",zIndexOut:"-9999",color:"#39BEB9",opacityIn:"1",opacityOut:"0",animatedIn:"zoomIn",animatedOut:"zoomOut",animationDuration:".6s",overflow:"auto",beforeOpen:function(){},afterOpen:function(){},beforeClose:function(){},afterClose:function(){}},n),l=o(document).find(".photonicModalOverlay"),s=o(document).find(".photonicModalOverlayScrollable");0===l.length&&(l=document.createElement("div"),l.className="photonicModalOverlay",s=document.createElement("div"),s.className="photonicModalOverlayScrollable",o(s).appendTo(o(l)),o("body").append(l)),l=o(l),s=o(s);var r=o(i).find(".photonicModalClose");0===r.length&&(r=document.createElement("a"),r.className="photonicModalClose "+d.closeCSS,o(r).css({right:d.closeFromRight}),o(r).html("&times;"),o(r).attr("href","#"),o(r).prependTo(o(i)).show()),r=o(i).find(".photonicModalClose");;var c=o("body").find("#"+d.modalTarget);c.addClass("photonicModal"),c.addClass(d.modalTarget+"-off");var m={width:d.width,height:d.height,top:d.top,left:d.left,"background-color":d.color,"overflow-y":d.overflow,"z-index":d.zIndexOut,opacity:d.opacityOut,"-webkit-animation-duration":d.animationDuration,"-moz-animation-duration":d.animationDuration,"-ms-animation-duration":d.animationDuration,"animation-duration":d.animationDuration};c.css(m),a(c),r.click(function(n){n.preventDefault(),o("body, html").css({overflow:"auto"}),d.beforeClose(),c.hasClass(d.modalTarget+"-on")&&(c.removeClass(d.modalTarget+"-on"),c.addClass(d.modalTarget+"-off")),c.hasClass(d.modalTarget+"-off")&&c.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",e),c.css("overflow-y","hidden").slideUp(),l.css("overflow-y","hidden").fadeOut()})}}(jQuery);

// jQuery Detect Swipe (replacing TouchWipe)
!function(a){"function"===typeof define&&define.amd?define(["jquery"],a):"object"===typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){function e(){this.removeEventListener("touchmove",f),this.removeEventListener("touchend",e),d=!1}function f(f){if(a.detectSwipe.preventDefault&&f.preventDefault(),d){var k,g=f.touches[0].pageX,h=f.touches[0].pageY,i=b-g,j=c-h;Math.abs(i)>=a.detectSwipe.threshold?k=i>0?"left":"right":Math.abs(j)>=a.detectSwipe.threshold&&(k=j>0?"up":"down"),k&&(e.call(this),a(this).trigger("swipe",k).trigger("swipe"+k))}}function g(a){1===a.touches.length&&(b=a.touches[0].pageX,c=a.touches[0].pageY,d=!0,this.addEventListener("touchmove",f,!1),this.addEventListener("touchend",e,!1))}function h(){this.addEventListener&&this.addEventListener("touchstart",g,!1)}a.detectSwipe={version:"2.1.2",enabled:"ontouchstart"in document.documentElement,preventDefault:!0,threshold:20};var b,c,d=!1;a.event.special.swipe={setup:h},a.each(["left","up","down","right"],function(){a.event.special["swipe"+this]={setup:function(){a(this).on("swipe",a.noop)}}})});

// ModaliseJS (replaces jquery-ui-dialog)
!function i(l,s,c){function a(e,n){if(!s[e]){if(!l[e]){var t="function"==typeof require&&require;if(!n&&t)return t(e,!0);if(d)return d(e,!0);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}var r=s[e]={exports:{}};l[e][0].call(r.exports,function(n){return a(l[e][1][n]||n)},r,r.exports,i,l,s,c)}return s[e].exports}for(var d="function"==typeof require&&require,n=0;n<c.length;n++)a(c[n]);return a}({1:[function(o,l,n){!function(n,e){"use strict";var r=n.document,i=o("./utils/extend"),t=function(n,e){var t,o=this;return o.callbacks={},t={start:function(){o.events={onShow:new Event("onShow"),onConfirm:new Event("onConfirm"),onHide:new Event("onHide")},o.modal=r.getElementById(n),o.classClose=".close",o.classCancel=".cancel",o.classConfirm=".confirm",o.btnsOpen=[],o.utils={extend:i},o.utils.extend(o,e)}},this.show=function(){return o.modal.dispatchEvent(o.events.onShow),o.modal.style.display="block",o},this.hide=function(){return o.modal.dispatchEvent(o.events.onHide),o.modal.style.display="none",o},this.removeEvents=function(){var n=o.modal.cloneNode(!0);return o.modal.parentNode.replaceChild(n,o.modal),o.modal=n,o},this.on=function(n,e){return this.modal.addEventListener(n,e),o},this.attach=function(){for(var n=[],e=(n=o.modal.querySelectorAll(o.classClose)).length-1;0<=e;e--)n[e].addEventListener("click",function(){o.hide()});for(e=(n=o.modal.querySelectorAll(o.classCancel)).length-1;0<=e;e--)n[e].addEventListener("click",function(){o.hide()});for(e=(n=o.modal.querySelectorAll(o.classConfirm)).length-1;0<=e;e--)n[e].addEventListener("click",function(){o.modal.dispatchEvent(o.events.onConfirm),o.hide()});for(e=o.btnsOpen.length-1;0<=e;e--)o.btnsOpen[e].addEventListener("click",function(){o.show()});return o},this.addOpenBtn=function(n){o.btnsOpen.push(n)},t.start(),o};"function"==typeof define&&define.amd&&define(function(){return t}),l.exports=t,n.Modalise=t}(window)},{"./utils/extend":2}],2:[function(n,e,t){e.exports=function(n){for(var e,t=Array.prototype.slice.call(arguments,1),o=0;e=t[o];o++)if(e)for(var r in e)n[r]=e[r];return n}},{}]},{},[1]);

// PhotonicTooltip - jQuery-free tooltip; compressed - 2KB
!function(d){"use strict";d.photonicTooltip=function(t,e){var o,i,l,n;function r(t){!function(t,e){var o=e.getAttribute("data-photonic-tooltip");if(""!==o){e.setAttribute("title",""),l=e.getBoundingClientRect();var i=document.createTextNode(o);t.innerHTML="",t.appendChild(i),l.left>window.innerWidth-100?t.className="photonic-tooltip-container tooltip-left":l.left+l.width/2<100?t.className="photonic-tooltip-container tooltip-right":t.className="photonic-tooltip-container tooltip-center"}}(o,t.currentTarget),function(t,e){if(""!==e.getAttribute("data-photonic-tooltip")){void 0===l&&(l=e.getBoundingClientRect());var o=l.top+l.height+window.scrollY,i=window.innerWidth-100;if(l.left+window.scrollX>i&&l.width<50)t.style.left=l.left+window.scrollX-(t.offsetWidth+l.width)+"px",t.style.top=e.offsetTop+"px";else if(l.left+window.scrollX>i&&50<l.width)t.style.left=l.left+window.scrollX-t.offsetWidth-20+"px",t.style.top=e.offsetTop+"px";else if(l.left+window.scrollX+l.width/2<100)t.style.left=l.left+window.scrollX+l.width+20+"px",t.style.top=e.offsetTop+"px";else{var n=l.left+window.scrollX+l.width/2-t.offsetWidth/2;t.style.left=n+"px",t.style.top=o+"px"}}}(o,t.currentTarget)}function c(t){if(o.className=i+" no-display",""!==o.innerText){o.removeChild(o.firstChild),o.removeAttribute("style");var e=t.currentTarget;e.setAttribute("title",e.getAttribute("data-photonic-tooltip"))}}d.photonicTooltip.init=function(){n=document.documentElement.querySelectorAll(t),o=document.documentElement.querySelector(e),i=e.replace(/^\.+/g,""),null!==o&&0!==o.length||((o=document.createElement("div")).className=i+" no-display",document.body.appendChild(o)),Array.prototype.forEach.call(n,function(t){t.removeEventListener("mouseenter",r),t.removeEventListener("mouseleave",c),t.addEventListener("mouseenter",r,!1),t.addEventListener("mouseleave",c,!1)})},photonicTooltip.init()}}(window);


jQuery(document).ready(function($) {

/**
 * photonic.js - Contains all custom JavaScript functions required by Photonic
 */
	var deep = location.hash, lastDeep, supportsSVG = !! document.createElementNS && !! document.createElementNS( 'http://www.w3.org/2000/svg', 'svg').createSVGRect;
	var photonicLightbox;
	var photonicLightboxList = {};
	var photonicPrompterList = {};

	if (!String.prototype.includes) {
		String.prototype.includes = function(search, start) {
			'use strict';
			if (typeof start !== 'number') {
				start = 0;
			}

			if (start + search.length > this.length) {
				return false;
			} else {
				return this.indexOf(search, start) !== -1;
			}
		};
	}

	window.photonicHtmlDecode = function(value){
		return $('<div/>').html(value).text();
	};

	window.photonicShowLoading = function() {
		var loading = $('.photonic-loading');
		if (loading.length > 0) {
			loading = loading[0];
		}
		else {
			loading = document.createElement('div');
		}
		loading.className = 'photonic-loading';
		$(loading).appendTo($('body')).show();
	};

	window.photonicInitializePasswordPrompter = function(selector) {
		var selectorNoHash = selector.replace(/^#+/g, '');
		var prompter = new Modalise(selectorNoHash).attach();
		photonicPrompterList[selector] = prompter;
		prompter.show();
	};

	window.photonicDisplayLevel2 = function(provider, type, args) {
		var identifier = args['panel_id'].substr(('photonic-' + provider + '-' + type + '-thumb-').length);
		var panel = '#photonic-' + provider + '-panel-' + identifier;

		if ($(panel).length === 0) {
			if ($('#' + args['panel_id']).hasClass('photonic-' + provider + '-passworded')) {
				var prompter = '#photonic-' + provider + '-' + type + '-prompter-' + identifier;
				photonicInitializePasswordPrompter(prompter);
			}
			else {
				photonicShowLoading();
				photonicProcessRequest(provider, type, identifier, args);
			}
		}
		else {
			photonicShowLoading();
			photonicRedisplayPopupContents(provider, identifier, panel, args);
		}
	};

	window.photonicProcessRequest = function(provider, type, identifier, args) {
		args['action'] = 'photonic_display_level_2_contents';
		$.post(Photonic_JS.ajaxurl, args, function(data) {
			if (data.substr(0, Photonic_JS.password_failed.length) === Photonic_JS.password_failed) {
				$('.photonic-loading').hide();
				var prompter = '#photonic-' + provider + '-' + type + '-prompter-' + identifier;
				var prompterDialog = photonicPrompterList[prompter];
				if (prompterDialog !== undefined && prompterDialog !== null) {
					prompterDialog.show();
				}
			}
			else {
				if ('show' === args['popup']) {
					photonicDisplayPopup(data, provider, type, identifier);
				}
				else {
					if (data !== '') {
						photonicBypassPopup(data);
					}
					else {
						$('.photonic-loading').hide();
					}
				}
			}
		});
	};

	window.photonicProcessL3Request = function(clicked, container, args) {
		args['action'] = 'photonic_display_level_3_contents';
		photonicShowLoading();
		$.post(Photonic_JS.ajaxurl, args, function(data){
			var insert = $(data);
			insert.insertAfter($(container));
			var layout = insert.find('.photonic-level-2-container');
			if (layout.hasClass('photonic-random-layout')) {
				photonicJustifiedGridLayout(false);
			}
			else if (layout.hasClass('photonic-mosaic-layout')) {
				photonicMosaicLayout(false);
			}
			else if (layout.hasClass('photonic-masonry-layout')) {
				photonicMasonryLayout(false);
			}
			insert.find('.photonic-level-2').css({'display': 'inline-block'});
			if (!$.fn.tooltip) {
				photonicTooltip('[data-photonic-tooltip]', '.photonic-tooltip-container');
			}
			$('.photonic-loading').hide();
			clicked.removeClass('photonic-level-3-expand-plus').addClass('photonic-level-3-expand-up').attr('title', Photonic_JS.minimize_panel === undefined ? 'Hide' : Photonic_JS.minimize_panel);
		});
	};

	window.photonicMoveHTML5External = function() {
		var $videos = $('#photonic-html5-external-videos');
		$videos = $videos.length ? $videos : $('<div style="display:none;" id="photonic-html5-external-videos"></div>').appendTo(document.body);
		$('.photonic-html5-external').each(function() {
			$(this).removeClass('photonic-html5-external').appendTo($videos);
		});
	};
	photonicMoveHTML5External();

	if ($.fn.lightSlider !== undefined) {
		$('ul.photonic-slideshow-content').each(function() {
			var $slideshow = $(this);
			var slideAdjustment = Photonic_JS.slide_adjustment === undefined ? 'adapt-height-width' : Photonic_JS.slide_adjustment;
			var fadeMode = $slideshow.data('photonicFx') === 'fade' && ($slideshow.data('photonicLayout') === 'strip-below') &&
				($slideshow.data('photonicColumns') === 'auto' || $slideshow.data('photonicColumns') === '');

			var itemCount = ($slideshow.data('photonicColumns') === 'auto' || $slideshow.data('photonicColumns') ===  '' || isNaN(parseInt($slideshow.data('photonicColumns')))) ? 1 : parseInt($slideshow.data('photonicColumns'));
			$slideshow.waitForImages(function() {
				$slideshow.lightSlider({
					gallery: $slideshow.data('photonicLayout') !== 'no-strip'  && $slideshow.data('photonicStripStyle') === 'thumbs',
					pager: $slideshow.data('photonicLayout') !== 'no-strip',
					vertical: $slideshow.data('photonicLayout') === 'strip-right' || $slideshow.data('photonicLayout') === 'strip-left',
					item: itemCount,
					auto: Photonic_JS.slideshow_autostart,
					loop: true,
					currentPagerPosition: 'middle',
					mode: fadeMode ? 'fade' : 'slide',
					speed: $slideshow.data('photonicSpeed'),
					pauseOnHover: $slideshow.data('photonicPause'),
					pause: $slideshow.data('photonicTimeout'),
					adaptiveHeight: slideAdjustment === 'adapt-height' || slideAdjustment === 'adapt-height-width',
					autoWidth: slideAdjustment === 'start-next',
					controls: $slideshow.data('photonicControls') === 'show',
					responsive : [
						{
							breakpoint:800,
							settings: {
								item: itemCount !== 1 ? 2 : 1,
								slideMove: 1
							}
						},
						{
							breakpoint:480,
							settings: {
								item: 1,
								slideMove: 1
							}
						}
					],
					onSliderLoad: function(el) {
//					photonicLightbox.initializeForSlideshow('#' + $slideshow.attr('id'), el);
					}
				});

				var layout = $slideshow.attr('data-photonic-layout');
				if (layout === 'strip-above') {
					var gallery = $slideshow.parents('.lSSlideOuter');
					gallery.find('.lSGallery').insertBefore(gallery.find('.lSSlideWrapper'));
				}
			});
		});
	}
	else if (console !== undefined && $('ul.photonic-slideshow-content').length > 0) {
		console.error('LightSlider not found! Please ensure that the LightSlider script is available and loaded before Photonic.');
	}

	$(document).on('click', '.photonic-level-2-thumb', function(e){
		e.preventDefault();
		var $clicked = $(this);
		var provider = $clicked.data('photonicProvider');
		var singular = $clicked.data('photonicSingular');
		var args = {"panel_id": $clicked.attr('id'), "popup": $clicked.data('photonicPopup'), "photo_count": $clicked.data('photonicPhotoCount'), "photo_more": $clicked.data('photonicPhotoMore')};
		if (provider === 'google' || provider === 'zenfolio') args.thumb_size = $clicked.data('photonicThumbSize');
		if (provider === 'flickr' || provider === 'smug' || provider === 'google' || provider === 'zenfolio') {
			args.overlay_size = $clicked.data('photonicOverlaySize');
			args.overlay_video_size = $clicked.data('photonicOverlayVideoSize');
		}
		if (provider === 'google') { args.overlay_crop = $clicked.data('photonicOverlayCrop'); }
		photonicDisplayLevel2(provider, singular, args);
	});

	$(document).on('click', '.photonic-password-submit', function(e) {
		e.preventDefault();
		var album_id = $(this).parents('.photonic-password-prompter').attr('id');
		var components = album_id.split('-');
		var provider = components[1];
		var singular_type = components[2];
		var album_key = components.slice(4).join('-');

		var password = $(this).parent().parent().find('input[name="photonic-' + provider + '-password"]');
		password = password[0].value;

		var thumb_id = 'photonic-' + provider + '-' + singular_type + '-thumb-' + album_key;
		var thumb = $('#' + thumb_id);

		var prompter = photonicPrompterList['#photonic-' + provider + '-' + singular_type + '-prompter-' + album_key];
		if (prompter !== undefined && prompter !== null) {
			prompter.hide();
		}

		photonicShowLoading();
		var args = {'panel_id': thumb_id, "popup": thumb.data('photonicPopup'), "photo_count": thumb.data('photonicPhotoCount'), "photo_more": thumb.data('photonicPhotoMore') };
		if (provider === 'smug') {
			args.password = password;
			args.overlay_size = thumb.data('photonicOverlaySize');
		}
		else if (provider === 'zenfolio') {
			args.password = password;
			args.realm_id = thumb.data('photonicRealm');
			args.thumb_size = thumb.data('photonicThumbSize');
			args.overlay_size = thumb.data('photonicOverlaySize');
		}
		photonicProcessRequest(provider, singular_type, album_key, args);
	});

	$('.photonic-flickr-stream a, a.photonic-flickr-set-thumb, a.photonic-flickr-gallery-thumb, .photonic-google-stream a, .photonic-smug-stream a, .photonic-instagram-stream a, .photonic-zenfolio-stream a, a.photonic-zenfolio-set-thumb').each(function() {
		if (!($(this).parent().hasClass('photonic-header-title'))) {
			var title = $(this).attr('title');
			$(this).attr('title', photonicHtmlDecode(title));
		}
	});

	$('a.photonic-level-3-expand').on('click', function(e) {
		e.preventDefault();
		var current = $(this);
		var header = current.parent().parent().parent();
		if (current.hasClass('photonic-level-3-expand-plus')) {
			photonicProcessL3Request(current, header, {'view': 'collections', 'node': current.data('photonicLevel-3'), 'layout': current.data('photonicLayout')});
		}
		else if (current.hasClass('photonic-level-3-expand-up')) {
			header.next('.photonic-stream').slideUp();
			current.removeClass('photonic-level-3-expand-up').addClass('photonic-level-3-expand-down').attr('title', Photonic_JS.maximize_panel === undefined ? 'Show' : Photonic_JS.maximize_panel);
		}
		else if (current.hasClass('photonic-level-3-expand-down')) {
			header.next('.photonic-stream').slideDown();
			current.removeClass('photonic-level-3-expand-down').addClass('photonic-level-3-expand-up').attr('title', Photonic_JS.minimize_panel === undefined ? 'Hide' : Photonic_JS.minimize_panel);
		}
	});

	$(document).on('click', 'a.photonic-more-button.photonic-more-dynamic', function(e) {
		e.preventDefault();
		var clicked = $(this);
		var container = clicked.parent().find('.photonic-level-1-container, .photonic-level-2-container');
		var query = container.data('photonicStreamQuery');
		var provider = container.data('photonicStreamProvider');
		var level = container.hasClass('photonic-level-1-container') ? 'level-1' : 'level-2';
		var containerId = container.attr('id');

		photonicShowLoading();
		$.post(Photonic_JS.ajaxurl, { 'action': 'photonic_load_more', 'provider': provider, 'query': query }, function(data) {
			var ret = $(data);
			var images = ret.find('.photonic-' + level);
			var more_button = ret.find('.photonic-more-button');
			var one_existing = container.find('a.photonic-launch-gallery')[0];

			images.children().attr('rel', $(one_existing).attr('rel'));
			if (Photonic_JS.slideshow_library === 'lightcase') images.children().attr('data-rel', 'lightcase:' + $(one_existing).attr('rel'));

			images.appendTo(container);
			photonicMoveHTML5External();

			if (images.length === 0) {
				$('.photonic-loading').hide();
				clicked.fadeOut().remove();
			}

			var lightbox;
			if (Photonic_JS.slideshow_library === 'imagelightbox') {
				lightbox = photonicLightboxList['a[rel="' + $(one_existing).attr('rel') + '"]'];
				if (level === 'level-1') {
					lightbox.addToImageLightbox(images.find('a'));
				}
			}
			else if (Photonic_JS.slideshow_library === 'lightcase') {
				photonicLightbox.initialize('a[data-rel="' + $(one_existing).attr('data-rel') + '"]');
			}
			else if (Photonic_JS.slideshow_library === 'lightgallery') {
				photonicLightbox.initialize(container);
			}
			else if (Photonic_JS.slideshow_library === 'featherlight') {
				photonicLightbox.initialize(container);
			}
			else if (Photonic_JS.slideshow_library === 'fancybox3') {
				photonicLightbox.initialize(null, $(one_existing).data('fancybox'));
			}
			else if (Photonic_JS.slideshow_library === 'photoswipe') {
				photonicLightbox.initialize();
			}
			else if (Photonic_JS.slideshow_library === 'strip') {
				images.children().attr('data-strip-group', $(one_existing).attr('rel'));
			}

			images.waitForImages(function() {
				var new_query = ret.find('.photonic-random-layout,.photonic-standard-layout,.photonic-masonry-layout,.photonic-mosaic-layout,.slideshow-grid-panel').data('photonicStreamQuery');
				container.data('photonicStreamQuery', new_query);

				// If this is a masonry layout in <= IE9, we need to trigger the Masonry function for appended images
				if (container.hasClass('photonic-masonry-layout') && Photonic_JS.is_old_IE === "1" && $.isFunction($.fn.masonry)) {
					container.masonry('appended', images);
				}

				if (more_button.length === 0) {
					clicked.fadeOut().remove();
				}

				if (container.hasClass('photonic-mosaic-layout')) {
					photonicMosaicLayout(false, '#' + containerId);
				}
				else if (container.hasClass('photonic-random-layout')) {
					photonicJustifiedGridLayout(false, '#' + containerId);
				}
				else if (container.hasClass('photonic-masonry-layout')) {
					images.find('img').fadeIn().css({ "display": "block" });
					$('.photonic-loading').hide();
				}
				else {
					container.find('.photonic-' + level).css({'display': 'inline-block' });
					$('.photonic-loading').hide();
				}
				if (!$.fn.tooltip) {
					photonicTooltip('[data-photonic-tooltip]', '.photonic-tooltip-container');
				}
			});
		});
	});

	/**
	 * Displays all photos in a popup. Invoked when the popup data is being fetched for the first time for display in a popup.
	 * Must be used by all providers for displaying photos in a popup.
	 *
	 * @param data The contents of the popup
	 * @param provider The data provider: flickr | picasa | smug | zenfolio
	 * @param popup The type of popup object: set | gallery | album
	 * @param panelId The trailing section of the thumbnail's id
	 */
	window.photonicDisplayPopup = function(data, provider, popup, panelId) {
		var unsafePanelId = panelId, // KEEP THIS FOR AJAX RESPONSE SELECTOR
			safePanelId = panelId.replace('.', '\\.'); // FOR EXISTING ELEMENTS WHCICH NEED SANITIZED PANELID
		//panelId = panelId.replace('.', '');  // REMOVE '.' FROM PANELID WHENEVER POSSIBLE
		var div = $(data);
		var grid = div.find('.slideshow-grid-panel');

		$(grid).waitForImages(function() {
			$(div).appendTo($('#photonic-' + provider + '-' + popup + '-' + safePanelId)).show();
			div.photonicModal({
				modalTarget: 'photonic-' + provider + '-panel-' + safePanelId,
				color: '#000',
				width: Photonic_JS.gallery_panel_width + '%',
				closeFromRight: ((100 - Photonic_JS.gallery_panel_width) / 2) + '%'
			});
			photonicMoveHTML5External();
			if (photonicLightbox !== undefined && photonicLightbox !== null) {
				photonicLightbox.initializeForNewContainer('#' + div.attr('id'));
			}

			if (!$.fn.tooltip) {
				photonicTooltip('[data-photonic-tooltip]', '.photonic-tooltip-container');
			}
			$('.photonic-loading').hide();
		});
	};

	window.photonicRedisplayPopupContents = function(provider, panelId, panel, args) {
		if ('show' === args['popup']) {
			$('.photonic-loading').hide();
			$(panel).photonicModal({
				modalTarget: 'photonic-' + provider + '-panel-' + panelId,
				color: '#000',
				width: Photonic_JS.gallery_panel_width + '%',
				closeFromRight: ((100 - Photonic_JS.gallery_panel_width) / 2) + '%'
			});
		}
		else {
			photonicBypassPopup($(panel));
		}
	};

	window.photonicBypassPopup = function(data) {
		$('.photonic-loading').hide();
		var panel = $(data);
		panel.hide().appendTo($('body'));
		photonicMoveHTML5External();
		if (photonicLightbox !== undefined && photonicLightbox !== null) {
			photonicLightbox.initializeForNewContainer('#' + panel.attr('id'));
		}

		var thumbs = $(panel).find('.photonic-launch-gallery');
		if (thumbs.length > 0) {
			deep = '#' + $(thumbs[0]).data('photonicDeep');
			$(thumbs[0]).click();
		}
	};

	$(document).on('click', 'input[type="button"].photonic-helper-more', function() {
		photonicShowLoading();
		var $clicked = $(this);
		var $table = $clicked.parents('table');

		var nextToken = $clicked.data('photonicToken') === undefined ? '' : '&nextPageToken=' + $clicked.data('photonicToken');
		var provider = $clicked.data('photonicProvider');
		if (provider === 'google') {
			$.post(Photonic_JS.ajaxurl, "action=photonic_helper_shortcode_more&provider=" + provider + nextToken, function(data) {
				var ret = $('<div></div>').html(data);
				ret = ret.find('tr');
				if (ret.length > 0) {
					ret = ret.slice(1, ret.length);
					$($table.find('input[type="button"]')[0]).parents('tr').remove();
					$table.append(ret);
				}
				if (!$.fn.tooltip) {
					photonicTooltip('[data-photonic-tooltip]', '.photonic-tooltip-container');
				}
				$('.photonic-loading').hide();
			});
		}
	});


	function Photonic_Lightbox() {
		this.socialIcons = "<div id='photonic-social'>" +
			"<a class='photonic-share-fb' href='https://www.facebook.com/sharer/sharer.php?u={photonic_share_link}&amp;title={photonic_share_title}&amp;picture={photonic_share_image}' target='_blank' title='Share on Facebook'><div class='icon-facebook'></div></a>" +
			"<a class='photonic-share-twitter' href='https://twitter.com/share?url={photonic_share_link}&amp;text={photonic_share_title}' target='_blank' title='Share on Twitter'><div class='icon-twitter'></div></a>" +
			"<a class='photonic-share-pinterest' data-pin-do='buttonPin' href='https://www.pinterest.com/pin/create/button/?url={photonic_share_link}&media={photonic_share_image}&description={photonic_share_title}' data-pin-custom='true' target='_blank' title='Share on Pinterest'><div class='icon-pinterest'></div></a>" +
			"</div>";
		var lastDeep;
		this.videoIndex = 1;
	}

	Photonic_Lightbox.prototype.getVideoSize = function(url, baseline){
		return new Promise(function(resolve){
			// create the video element
			var video = document.createElement('video');

			// place a listener on it
			video.addEventListener( "loadedmetadata", function () {
				// retrieve dimensions
				var height = this.videoHeight;
				var width = this.videoWidth;

				var videoAspectRatio = this.videoWidth / this.videoHeight;
				var baseAspectRatio = baseline.width / baseline.height;

				var newWidth, newHeight;
				if (baseAspectRatio > videoAspectRatio) {
					// Window is wider than it needs to be ... constrain by window height
					newHeight = baseline.height;
					newWidth = width * newHeight / height;
				}
				else {
					// Window is narrower than it needs to be ... constrain by window width
					newWidth = baseline.width;
					newHeight = height * newWidth / width;
				}

				// send back result
				resolve({
					height : height,
					width : width,
					newHeight: newHeight,
					newWidth: newWidth
				});
			}, false );

			// start download meta-datas
			video.src = url;
		});
	};

	Photonic_Lightbox.prototype.getImageSize = function(url, baseline){
		return new Promise(function(resolve){
			var image = document.createElement('img');

			// place a listener on it
			image.addEventListener( "load", function () {
				// retrieve dimensions
				var height = this.height;
				var width = this.width;

				var imageAspectRatio = this.width / this.height;
				var baseAspectRatio = baseline.width / baseline.height;

				var newWidth, newHeight;
				if (baseAspectRatio > imageAspectRatio) {
					// Window is wider than it needs to be ... constrain by window height
					newHeight = baseline.height;
					newWidth = width * newHeight / height;
				}
				else {
					// Window is narrower than it needs to be ... constrain by window width
					newWidth = baseline.width;
					newHeight = height * newWidth / width;
				}

				// send back result
				resolve({
					height : height,
					width : width,
					newHeight: newHeight,
					newWidth: newWidth
				});
			}, false );

			// start download meta-datas
			image.src = url;
		});
	};

	Photonic_Lightbox.prototype.addSocial = function(selector, shareable) {
		if ((Photonic_JS.social_media === undefined || Photonic_JS.social_media === '') && shareable['buy'] === undefined) {
			return;
		}
		var socialEl = document.getElementById('photonic-social');
		if (socialEl !== null) {
			socialEl.parentNode.removeChild(socialEl);
		}

		if (location.hash !== '') {
			var social = this.socialIcons.replace(/{photonic_share_link}/g, encodeURIComponent(shareable['url'])).
			replace(/{photonic_share_title}/g, encodeURIComponent(shareable['title'])).
			replace(/{photonic_share_image}/g, encodeURIComponent(shareable['image']));

			var selectorEl;
			if (typeof selector === 'string') {
				selectorEl = document.documentElement.querySelector(selector);
				if (selectorEl !== null) {
					selectorEl.insertAdjacentHTML('beforeend', social);
				}
			}

			if (Photonic_JS.social_media === undefined || Photonic_JS.social_media === '') {

				var socialMediaIcons = document.documentElement.querySelectorAll('.photonic-share-fb, .photonic-share-twitter, .photonic-share-pinterest');
				Array.prototype.forEach.call(socialMediaIcons, function(socialIcon) {
					socialIcon.parentNode.removeChild(socialIcon);
				});
			}

			if (!supportsSVG) {
				var icon = $('#photonic-social div');
				var bg = icon.css('background-image');
				bg = bg.replace( 'svg', 'png' );
				icon.css({'background-image': bg});
			}
		}
	};

	Photonic_Lightbox.prototype.setHash = function(a) {
		if (Photonic_JS.deep_linking === undefined || Photonic_JS.deep_linking === 'none') {
			return;
		}

		var hash = typeof a === 'string' ? a : $(a).data('photonicDeep');
		if (hash === undefined) {
			return;
		}

		if (typeof(window.history.pushState) === 'function' && Photonic_JS.deep_linking === 'yes-history') {
			window.history.pushState({}, document.title, '#' + hash);
		}
		else if (typeof(window.history.replaceState) === 'function' && Photonic_JS.deep_linking === 'no-history') {
			window.history.replaceState({}, document.title, '#' + hash);
		}
		else {
			document.location.hash = hash;
		}
	};

	Photonic_Lightbox.prototype.unsetHash = function() {
		lastDeep = (lastDeep === undefined || deep !== '') ? location.hash : lastDeep;
		if (window.history && 'replaceState' in window.history) {
			history.replaceState({}, document.title, location.href.substr(0, location.href.length-location.hash.length));
		}
		else {
			window.location.hash = '';
		}
	};

	Photonic_Lightbox.prototype.changeHash = function() {
		var node = deep;

		if (node != null) {
			if (node.length > 1 && photonicLightbox !== null && photonicLightbox !== undefined) {
				if (window.location.hash && node.indexOf('#access_token=') !== -1) {
					photonicLightbox.unsetHash();
				}
				else {
					node = node.substr(1);
					var allMatches = document.querySelectorAll('[data-photonic-deep="' + node + '"]'); //$('[data-photonic-deep="' + node + '"]');
					if (allMatches.length > 0) {
						var thumbToClick = allMatches[0];
						$(thumbToClick).click();
						photonicLightbox.setHash(node);
					}
				}
			}
		}
	};

	Photonic_Lightbox.prototype.catchYouTubeURL = function(url) {
		var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		var match = url.match(regExp);
		if (match && match[2].length === 11) {
			return match[2];
		}
	};

	Photonic_Lightbox.prototype.catchVimeoURL = function(url) {
		var regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/;
		var match = url.match(regExp);
		if (match) {
			return match[1];
		}
	};

	Photonic_Lightbox.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( this.getAttribute('href'));
		}).addClass("launch-gallery-" + Photonic_JS.slideshow_library).addClass(Photonic_JS.slideshow_library);
	};

	Photonic_Lightbox.prototype.changeVideoURL = function(element, regular, embed) {
		// Implemented in individual lightboxes. Empty for unsupported lightboxes
	};

	Photonic_Lightbox.prototype.hostedVideo = function(a) {
		// Implemented in individual lightboxes. Empty for unsupported lightboxes
	};

	Photonic_Lightbox.prototype.soloVideos = function() {
		var self = this;
		if (Photonic_JS.lightbox_for_videos) {
			$('a[href]').each(function() {
				var regular, embed;
				var href = this.getAttribute('href');
				var youTube = self.catchYouTubeURL(href);
				var vimeo = self.catchVimeoURL(href);
				if ((youTube) !== undefined) {
					regular = 'https://youtube.com/watch?v=' + youTube;
					embed = 'https://youtube.com/embed/' + youTube;
				}
				else if (vimeo !== undefined) {
					regular = 'https://vimeo.com/' + vimeo;
					embed = 'https://player.vimeo.com/video/' + vimeo;
				}

				if (regular !== undefined) {
					$(this).addClass(Photonic_JS.slideshow_library + "-video");
					self.changeVideoURL(this, regular, embed);
				}
				self.hostedVideo(this);
			});
		}
	};

	Photonic_Lightbox.prototype.handleSolos = function() {
		if (Photonic_JS.lightbox_for_all) {
			this.soloImages();
		}
		this.soloVideos();

		if (Photonic_JS.deep_linking !== undefined && Photonic_JS.deep_linking !== 'none') {
			$(window).on('load', this.changeHash);
			$(window).on('hashchange', this.changeHash);
		}
	};

	Photonic_Lightbox.prototype.initialize = function() {
		this.handleSolos();
		// Implemented by child classes
	};

	Photonic_Lightbox.prototype.initializeForNewContainer = function(containerId) {
		// Implemented by individual lightboxes. Empty for cases where not required
	};

	Photonic_Lightbox.prototype.initializeForExisting = function() {
		// Implemented by child classes
	};

	Photonic_Lightbox.prototype.initializeForSlideshow = function(selector, slider) {
		// Implemented by child classes
	};

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

	$('.photonic-standard-layout.title-display-below').each(function() {
		var $standard = $(this);
		$standard.waitForImages(function(){
			var $block = $(this);
			$block.find('.photonic-pad-photos').each(function(i, item) {
				var img = $(item).find('img');
				img = img[0];
				var title = $(item).find('.photonic-title-info');
				title.css({"width": img.width });
			});
		});
	});

	if ($('.title-display-tooltip a, .photonic-slideshow.title-display-tooltip img').length > 0) {
		if (!$.fn.tooltip) {
			photonicTooltip('[data-photonic-tooltip]', '.photonic-tooltip-container');
		}
		else {
			$(document).tooltip({
				items: '.title-display-tooltip a, .photonic-slideshow.title-display-tooltip img',
				track: true,
				show: false,
				selector: '.title-display-tooltip a, .photonic-slideshow.title-display-tooltip img',
				hide: false
			});
		}
	}

	$(document).on('mouseenter', '.title-display-hover-slideup-show a, .photonic-slideshow.title-display-hover-slideup-show li', function(e) {
		var title = $(this).find('.photonic-title');
		title.slideDown();
		$(this).data('photonic-title', $(this).attr('title'));
		$(this).attr('title', '');
	});

	$(document).on('mouseleave', '.title-display-hover-slideup-show a, .photonic-slideshow.title-display-hover-slideup-show li', function(e) {
		var title = $(this).find('.photonic-title');
		title.slideUp();
		$(this).data('photonic-title', $(this).attr('title'));
		$(this).attr('title', $(this).data('photonic-title'));
	});

	window.photonicBlankSlideupTitle = function() {
		$('.title-display-slideup-stick, .photonic-slideshow.title-display-slideup-stick').each(function(i, item){
			var a = $(item).find('a');
			$(a).attr('title', '');
		});
	};
	photonicBlankSlideupTitle();

	window.photonicShowSlideupTitle = function() {
		var titles = document.documentElement.querySelectorAll('.title-display-slideup-stick a .photonic-title');
		var len = titles.length;
		for (var i = 0; i < len; i++) {
			titles[i].style.display = 'block';
		}
	};

	$('.auth-button').click(function(){
		var provider = '';
		if ($(this).hasClass('auth-button-flickr')) {
			provider = 'flickr';
		}
		else if ($(this).hasClass('auth-button-smug')) {
			provider = 'smug';
		}
		var callbackId = $(this).attr('rel');

		$.post(Photonic_JS.ajaxurl, "action=photonic_authenticate&provider=" + provider + '&callback_id=' + callbackId, function(data) {
			if (provider === 'flickr') {
				window.location.replace(data);
			}
			else if (provider === 'smug') {
				window.open(data);
			}
		});
		return false;
	});

	$('.photonic-login-box-flickr:not(:first)').remove();
	$('.photonic-login-box-flickr').attr({id: 'photonic-login-box-flickr'});
	$('.photonic-login-box-smug:not(:first)').remove();
	$('.photonic-login-box-smug').attr({id: 'photonic-login-box-smug'});

	window.photonicJustifiedGridLayout = function(resized, selector) {
		if (console !== undefined && Photonic_JS.debug_on !== '0' && Photonic_JS.debug_on !== '') console.time('Justified Grid');
		if (selector == null || selector === undefined || $(selector).length === 0) {
			selector = '.photonic-random-layout';
		}

		if (!resized && $(selector).length > 0) {
			photonicShowLoading();
		}

		function linearMin(arr) {
			var computed, result, x, _i, _len;
			for (_i = 0, _len = arr.length; _i < _len; _i++) {
				x = arr[_i];
				computed = x[0];
				if (!result || computed < result.computed) {
					result = {
						value: x,
						computed: computed
					};
				}
			}
			return result.value;
		}

		function linearPartition(seq, k) {
			var ans, i, j, m, n, solution, table, x, y, _i, _j, _k, _l;
			n = seq.length;
			if (k <= 0) {
				return [];
			}
			if (k > n) {
				return seq.map(function(x) {
					return [x];
				});
			}
			table = (function() {
				var _i, _results;
				_results = [];
				for (y = _i = 0; 0 <= n ? _i < n : _i > n; y = 0 <= n ? ++_i : --_i) {
					_results.push((function() {
						var _j, _results1;
						_results1 = [];
						for (x = _j = 0; 0 <= k ? _j < k : _j > k; x = 0 <= k ? ++_j : --_j) {
							_results1.push(0);
						}
						return _results1;
					})());
				}
				return _results;
			})();
			solution = (function() {
				var _i, _ref, _results;
				_results = [];
				for (y = _i = 0, _ref = n - 1; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
					_results.push((function() {
						var _j, _ref1, _results1;
						_results1 = [];
						for (x = _j = 0, _ref1 = k - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
							_results1.push(0);
						}
						return _results1;
					})());
				}
				return _results;
			})();
			for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
				table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
			}
			for (j = _j = 0; 0 <= k ? _j < k : _j > k; j = 0 <= k ? ++_j : --_j) {
				table[0][j] = seq[0];
			}
			for (i = _k = 1; 1 <= n ? _k < n : _k > n; i = 1 <= n ? ++_k : --_k) {
				for (j = _l = 1; 1 <= k ? _l < k : _l > k; j = 1 <= k ? ++_l : --_l) {
					m = linearMin((function() {
						var _m, _results;
						_results = [];
						for (x = _m = 0; 0 <= i ? _m < i : _m > i; x = 0 <= i ? ++_m : --_m) {
							_results.push([Math.max(table[x][j - 1], table[i][0] - table[x][0]), x]);
						}
						return _results;
					})());
					table[i][j] = m[0];
					solution[i - 1][j - 1] = m[1];
				}
			}
			n = n - 1;
			k = k - 2;
			ans = [];
			while (k >= 0) {
				ans = [
					(function() {
						var _m, _ref, _ref1, _results;
						_results = [];
						for (i = _m = _ref = solution[n - 1][k] + 1, _ref1 = n + 1; _ref <= _ref1 ? _m < _ref1 : _m > _ref1; i = _ref <= _ref1 ? ++_m : --_m) {
							_results.push(seq[i]);
						}
						return _results;
					})()
				].concat(ans);
				n = solution[n - 1][k];
				k = k - 1;
			}
			return [
				(function() {
					var _m, _ref, _results;
					_results = [];
					for (i = _m = 0, _ref = n + 1; 0 <= _ref ? _m < _ref : _m > _ref; i = 0 <= _ref ? ++_m : --_m) {
						_results.push(seq[i]);
					}
					return _results;
				})()
			].concat(ans);
		}

		function part(seq, k) {
			if (k <= 0) {
				return [];
			}
			while (k) {
				try {
					return linearPartition(seq, k--);
				} catch (_error) {}
			}
		}

		$(selector).each(function(idx, obj) {
			var viewportWidth = Math.floor($(this)[0].getBoundingClientRect().width);
			var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			var idealHeight = Math.max(parseInt(windowHeight / 4), Photonic_JS.tile_min_height);

			var gap = Photonic_JS.tile_spacing * 2;

			$(obj).waitForImages(function() {
				var container = this;
				var photos = [];
				var images = $(container).find('img');

				$(images).each(function() {
					if ($(this).parents('.photonic-panel').length > 0) {
						return;
					}

					var image = $(this)[0];
					var div = this.parentNode.parentNode;

					if (!(image.naturalHeight === 0 || image.naturalHeight === undefined || image.naturalWidth === undefined)) {
						photos.push({tile: div, aspect_ratio: (image.naturalWidth) / (image.naturalHeight)});
					}
				});

				var summedWidth = photos.reduce((function(sum, p) {
					return sum += p.aspect_ratio * idealHeight + gap;
				}), 0);

				var rows = Math.max(Math.round(summedWidth / viewportWidth), 1); // At least 1 row should be shown
				var  weights = photos.map(function(p) {
					return Math.round(p.aspect_ratio * 100);
				});

				var partition = part(weights, rows);
				var index = 0;

				var oLen = partition.length;
				for (var o = 0; o < oLen; o++) {
					var onePart = partition[o];
					var summedRatios;
					var rowBuffer = photos.slice(index, index + onePart.length);
					index = index + onePart.length;

					summedRatios = rowBuffer.reduce((function(sum, p) {
						return sum += p.aspect_ratio;
					}), 0);

					var rLen = rowBuffer.length;
					for (var r = 0; r < rLen; r++) {
						var item = rowBuffer[r];
						var existing = item.tile;
						existing.style.width = parseInt(viewportWidth / summedRatios * item.aspect_ratio)+"px";
						existing.style.height = parseInt(viewportWidth / summedRatios)+"px";
					}
				}

				$(container).find('.photonic-thumb, .photonic-thumb img').fadeIn();

				photonicBlankSlideupTitle();
				photonicShowSlideupTitle();

				if (Photonic_JS.slideshow_library === 'lightcase') {
					photonicLightbox.initialize('.photonic-random-layout');
				}
				else if (Photonic_JS.slideshow_library === 'lightgallery') {
					photonicLightbox.initialize(container);
				}
				else if (Photonic_JS.slideshow_library === 'featherlight') {
					photonicLightbox.initialize(container);
				}
				else if (Photonic_JS.slideshow_library === 'fancybox3') {
					photonicLightbox.initialize('.photonic-random-layout');
				}
				else if (Photonic_JS.slideshow_library === 'photoswipe') {
					photonicLightbox.initialize();
				}

				if (!resized) {
					$('.photonic-loading').hide();
				}
			});
		});
		if (console !== undefined && Photonic_JS.debug_on !== '0' && Photonic_JS.debug_on !== '') console.timeEnd('Justified Grid');
	};

	window.photonicMasonryLayout = function(resized, selector) {
		if (Photonic_JS.is_old_IE === "1") return;
		if (console !== undefined && Photonic_JS.debug_on !== '0' && Photonic_JS.debug_on !== '') console.time('Masonry');

		if (selector == null || selector === undefined) {
			selector = '.photonic-masonry-layout';
		}

		if (!resized && $(selector).length > 0) {
			photonicShowLoading();
		}

		var minWidth = (isNaN(Photonic_JS.masonry_min_width) || parseInt(Photonic_JS.masonry_min_width) <= 0) ? 200 : Photonic_JS.masonry_min_width;
		minWidth = parseInt(minWidth);

		$(selector).each(function(idx, grid) {
			var $grid = $(grid);
			$grid.waitForImages(function() {
				var columns = $grid.attr('data-photonic-gallery-columns');
				columns = (isNaN(parseInt(columns)) || parseInt(columns) <= 0) ? 3 : parseInt(columns);
				var viewportWidth = Math.floor($grid[0].getBoundingClientRect().width);
				var idealColumns = (viewportWidth / columns) > minWidth ? columns : Math.floor(viewportWidth / minWidth);
				if (idealColumns !== undefined && idealColumns !== null) {
					$grid.css('column-count', idealColumns.toString());
				}
				$grid.find('img').fadeIn().css({"display": "block" });
				photonicShowSlideupTitle();
				if (!resized) {
					$('.photonic-loading').hide();
				}
			});
		});
		if (console !== undefined && Photonic_JS.debug_on !== '0' && Photonic_JS.debug_on !== '') console.timeEnd('Masonry');
	};

	window.photonicMosaicLayout = function(resized, selector) {
		if (console !== undefined && Photonic_JS.debug_on !== '0' && Photonic_JS.debug_on !== '') console.time('Mosaic');
		if (selector == null || selector === undefined || $(selector).length === 0) {
			selector = '.photonic-mosaic-layout';
		}

		if (!resized && $(selector).length > 0) {
			photonicShowLoading();
		}

		function getDistribution(setSize, max, min) {
			var distribution = [];
			var processed = 0;
			while (processed < setSize) {
				if (setSize - processed <= max && processed > 0) {
//				if (setSize - processed <= 3 && processed > 0) {
					distribution.push(setSize - processed);
					processed += setSize - processed;
				}
				else {
					var current = Math.max(Math.floor(Math.random() * max + 1), min);
					current = Math.min(current, setSize - processed);
					distribution.push(current);
					processed += current;
				}
			}
			return distribution;
		}

		function arrayAlternate(array, remainder) {
			return array.filter(function(value, index) {
				return index % 2 === remainder;
			});
		}

		function setUniformHeightsForRow(array) {
			// First, order the array by increasing height
			array.sort(function(a, b) {
				return a.height - b.height;
			});

			array[0].new_height = array[0].height;
			array[0].new_width = array[0].width;

			for (var i = 1; i < array.length; i++) {
				array[i].new_height = array[0].height;
				array[i].new_width = array[i].new_height * array[i].aspect_ratio;
			}
			var new_width = array.reduce(function(sum, p) {
				return sum += p.new_width ;
			}, 0);
			return { elements: array, height: array[0].new_height, width: new_width, aspect_ratio: new_width / array[0].new_height };
		}

		function finalizeTiledLayout(components, containers) {
			var cLength = components.length;
			for (var c = 0; c < cLength; c++) {
				var component = components[c];
				var rowY = component.y;
				var otherRowHeight = 0;
				var container;
				var ceLen = component.elements.length;
				for (var e = 0; e < ceLen; e++) {
					var element = component.elements[e];
					if (element.photo_position !== undefined) {
						// Component is a single image
						container = containers[element.photo_position];
						container.css('width', (component.new_width));
						container.css('height', (component.new_height));
						container.css('top', (component.y));
						container.css('left', (component.x));
					}
					else {
						// Component is a clique (element is a row). Widths and Heights of cliques have been calculated. But the rows in cliques need to be recalculated
						element.new_width = component.new_width;
						if (otherRowHeight === 0) {
							element.new_height = element.new_width / element.aspect_ratio;
							otherRowHeight = element.new_height;
						}
						else {
							element.new_height = component.new_height - otherRowHeight;
						}
						element.x = component.x;
						element.y = rowY;
						rowY += element.new_height;
						var totalWidth = element.elements.reduce(function(sum, p) {
							return sum += p.new_width ;
						}, 0);

						var rowX = 0;
						var eLength = element.elements.length;
						for (var i = 0; i < eLength; i++) {
							var image = element.elements[i];
							image.new_width = element.new_width * image.new_width / totalWidth;
							image.new_height = element.new_height; //image.new_width / image.aspect_ratio;
							image.x = rowX;

							rowX += image.new_width;

							container = containers[image.photo_position];
							container.css('width', Math.floor(image.new_width));
							container.css('height', Math.floor(image.new_height));
							container.css('top', Math.floor(element.y));
							container.css('left', Math.floor(element.x + image.x));
						}
					}
				}
			}
		}

		$(selector).each(function(idx, grid) {
			var $grid = $(grid);
			$grid.waitForImages(function() {
				var viewportWidth = Math.floor($grid[0].getBoundingClientRect().width);
				var triggerWidth = (isNaN(Photonic_JS.mosaic_trigger_width) || parseInt(Photonic_JS.mosaic_trigger_width) <= 0) ? 200 : parseInt(Photonic_JS.mosaic_trigger_width);
				var maxInRow = Math.floor(viewportWidth / triggerWidth);
				var minInRow = viewportWidth >= (triggerWidth * 2) ? 2 : 1;
				var photos = [];
				var divs = $grid.children();
				var setSize = divs.length;
				if (setSize === 0) {
					return;
				}

				var containers = [];
				var images = $grid.find('img');
				$(images).each(function(imgIdx) {
					if ($(this).parents('.photonic-panel').length > 0) {
						return;
					}

					var image = $(this)[0];
					var a = $(this.parentNode);
					var div = a.parent();
					div.attr('data-photonic-photo-index', imgIdx);
					containers[imgIdx] = div;

					if (!(image.naturalHeight === 0 || image.naturalHeight === undefined || image.naturalWidth === undefined)) {
						var aspectRatio = (image.naturalWidth) / (image.naturalHeight);
						photos.push({src: image.src, width: image.naturalWidth, height: image.naturalHeight, aspect_ratio: aspectRatio, photo_position: imgIdx});
					}
				});

				setSize = photos.length;
				var distribution = getDistribution(setSize, maxInRow, minInRow);

				// We got our random distribution. Let's divide the photos up according to the distribution.
				var groups = [], startIdx = 0;
				$(distribution).each(function(i, size) {
					groups.push(photos.slice(startIdx, startIdx + size));
					startIdx += size;
				});

				var groupY = 0;

				// We now have our groups of photos. We need to find the optimal layout for each group.
				for (var g = 0; g < groups.length; g++) {
					var group = groups[g];
					// First, order the group by aspect ratio
					group.sort(function(a, b) {
						return a.aspect_ratio - b.aspect_ratio;
					});

					// Next, pick a random layout
					var groupLayout;
					if (group.length === 1) {
						groupLayout = [1];
					}
					else if (group.length === 2) {
						groupLayout = [1,1];
					}
					else {
						groupLayout = getDistribution(group.length, group.length - 1, 1);
					}

					// Now, LAYOUT, BABY!!!
					var cliqueF = 0, cliqueL = group.length - 1;
					var cliques = [], indices = [];

					for (var i = 2; i <= maxInRow; i++) {
						var index = $.inArray(i, groupLayout);
						while (-1 < index && cliqueF < cliqueL) {
							// Ideal Layout: one landscape, one portrait. But we will take any 2 with contrasting aspect ratios
							var clique = [];
							var j = 0;
							while (j < i && cliqueF <= cliqueL) {
								clique.push(group[cliqueF++]); // One with a low aspect ratio
								j++;
								if (j < i && cliqueF <= cliqueL) {
									clique.push(group[cliqueL--]); // One with a high aspect ratio
									j++;
								}
							}
							// Clique is formed. Add it to the list of cliques.
							cliques.push(clique);
							indices.push(index); // Keep track of the position of the clique in the row
							index = $.inArray(i, groupLayout, index + 1);
						}
					}

					// The ones that are not in any clique (i.e. the ones in the middle) will be given their own columns in the row.
					var remainder = group.slice(cliqueF, cliqueL + 1);

					// Now let's layout the cliques individually. Each clique is its own column.
					var rowLayout = [];
					for (var c = 0; c < cliques.length; c++) {
						var clique = cliques[c];
						var toss = Math.floor(Math.random() * 2); // 0 --> Groups of smallest and largest, or 1 --> Alternating
						var oneRow, otherRow;
						if (toss === 0) {
							// Group the ones with the lowest aspect ratio together, and the ones with the highest aspect ratio together.
							// Lay one group at the top and the other at the bottom
							var wide = Math.max(Math.floor(Math.random() * (clique.length / 2 - 1)), 1);
							oneRow = clique.slice(0, wide);
							otherRow = clique.slice(wide);
						}
						else {
							// Group alternates together.
							// Lay one group at the top and the other at the bottom
							oneRow = arrayAlternate(clique, 0);
							otherRow = arrayAlternate(clique, 1);
						}

						// Make heights consistent within rows:
						oneRow = setUniformHeightsForRow(oneRow);
						otherRow = setUniformHeightsForRow(otherRow);

						// Now make widths consistent
						oneRow.new_width = Math.min(oneRow.width, otherRow.width);
						oneRow.new_height = oneRow.new_width / oneRow.aspect_ratio;
						otherRow.new_width = oneRow.new_width;
						otherRow.new_height = otherRow.new_width / otherRow.aspect_ratio;

						rowLayout.push({elements: [oneRow, otherRow], height: oneRow.new_height + otherRow.new_height, width: oneRow.new_width, aspect_ratio: oneRow.new_width / (oneRow.new_height + otherRow.new_height), element_position: indices[c]});
					}

					rowLayout.sort(function(a, b) {
						return a.element_position - b.element_position;
					});

					var orderedRowLayout = [];
					for (var position = 0; position < groupLayout.length; position++) {
						var cliqueExists = indices.indexOf(position) > -1; //$.inArray(position, indices) > -1;
						if (cliqueExists) {
							orderedRowLayout.push(rowLayout.shift());
						}
						else {
							var rem = remainder.shift();
							orderedRowLayout.push({ elements: [rem], height: rem.height, width: rem.width, aspect_ratio: rem.aspect_ratio });
						}
					}

					// Main Row layout is fully constructed and ordered. Now we need to balance heights and widths of all cliques with the "remainder"
					var totalAspect = orderedRowLayout.reduce(function(sum, p) {
						return sum += p.aspect_ratio ;
					}, 0);

					var elementX = 0;
					orderedRowLayout.forEach(function(component) {
						component.new_width = component.aspect_ratio / totalAspect * viewportWidth;
						component.new_height = component.new_width / component.aspect_ratio;
						component.y = groupY;
						component.x = elementX;
						elementX += component.new_width;
					});

					groupY += orderedRowLayout[0].new_height;
					finalizeTiledLayout(orderedRowLayout, containers);
				}

				$grid.css('height', groupY);
				$grid.find('img').fadeIn();
				photonicShowSlideupTitle();
				if (!resized) {
					$('.photonic-loading').hide();
				}
			});
		});
		if (console !== undefined && Photonic_JS.debug_on !== '0' && Photonic_JS.debug_on !== '') console.timeEnd('Mosaic');
	};

	photonicJustifiedGridLayout(false);
	photonicMasonryLayout(false);
	photonicMosaicLayout(false);

	var currentStreams = document.documentElement.querySelectorAll('.photonic-stream');
	Array.prototype.forEach.call(currentStreams, function(stream) {
		var container = stream.querySelector('.photonic-level-1-container');
		if (container !== null && container.children !== undefined && container.children.length !== undefined && container.children.length === 0) {
			stream.parentNode.removeChild(stream);
		}
	});

	$('.photonic-standard-layout .photonic-level-1, .photonic-standard-layout .photonic-level-2').css({'display': 'inline-block'});

	if (!supportsSVG) {
		var icon = $('a.photonic-level-3-expand');
		var bg = icon.css('background-image');
		bg = bg.replace( 'svg', 'png' );
		icon.css({'background-image': bg});
	}

	$(window).on('resize', function() {
		photonicJustifiedGridLayout(true);
		photonicMasonryLayout(true);
		photonicMosaicLayout(true);
	});


});
