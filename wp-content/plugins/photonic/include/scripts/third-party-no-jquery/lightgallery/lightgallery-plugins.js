/**
 * Autoplay
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgAutoplay = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
		(function (global, factory) {
			if (typeof define === "function" && define.amd) {
				define([], factory);
			} else if (typeof exports !== "undefined") {
				factory();
			} else {
				var mod = {
					exports: {}
				};
				factory();
				global.lgAutoplay = mod.exports;
			}
		})(this, function () {
			'use strict';

			var _extends = Object.assign || function (target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];

					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}

				return target;
			};

			var autoplayDefaults = {
				autoplay: false,
				pause: 5000,
				progressBar: true,
				fourceAutoplay: false,
				autoplayControls: true,
				appendAutoplayControlsTo: '.lg-toolbar'
			};

			/**
			 * Creates the autoplay plugin.
			 * @param {object} element - lightGallery element
			 */
			var Autoplay = function Autoplay(element) {

				this.el = element;

				this.core = window.lgData[this.el.getAttribute('lg-uid')];

				// Execute only if items are above 1
				if (this.core.items.length < 2) {
					return false;
				}

				this.core.s = _extends({}, autoplayDefaults, this.core.s);
				this.interval = false;

				// Identify if slide happened from autoplay
				this.fromAuto = true;

				// Identify if autoplay canceled from touch/drag
				this.canceledOnTouch = false;

				// save fourceautoplay value
				this.fourceAutoplayTemp = this.core.s.fourceAutoplay;

				// do not allow progress bar if browser does not support css3 transitions
				if (!this.core.doCss()) {
					this.core.s.progressBar = false;
				}

				this.init();

				return this;
			};

			Autoplay.prototype.init = function () {
				var _this = this;

				// append autoplay controls
				if (_this.core.s.autoplayControls) {
					_this.controls();
				}

				// Create progress bar
				if (_this.core.s.progressBar) {
					_this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', '<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
				}

				// set progress
				_this.progress();

				// Start autoplay
				if (_this.core.s.autoplay) {
					_this.startlAuto();
				}

				// cancel interval on touchstart and dragstart
				utils.on(_this.el, 'onDragstart.lgtm touchstart.lgtm', function () {
					if (_this.interval) {
						_this.cancelAuto();
						_this.canceledOnTouch = true;
					}
				});

				// restore autoplay if autoplay canceled from touchstart / dragstart
				utils.on(_this.el, 'onDragend.lgtm touchend.lgtm onSlideClick.lgtm', function () {
					if (!_this.interval && _this.canceledOnTouch) {
						_this.startlAuto();
						_this.canceledOnTouch = false;
					}
				});
			};

			Autoplay.prototype.progress = function () {

				var _this = this;
				var _progressBar;
				var _progress;

				utils.on(_this.el, 'onBeforeSlide.lgtm', function () {

					// start progress bar animation
					if (_this.core.s.progressBar && _this.fromAuto) {
						_progressBar = _this.core.outer.querySelector('.lg-progress-bar');
						_progress = _this.core.outer.querySelector('.lg-progress');
						if (_this.interval) {
							_progress.removeAttribute('style');
							utils.removeClass(_progressBar, 'lg-start');
							setTimeout(function () {
								utils.setVendor(_progress, 'Transition', 'width ' + (_this.core.s.speed + _this.core.s.pause) + 'ms ease 0s');
								utils.addClass(_progressBar, 'lg-start');
							}, 20);
						}
					}

					// Remove setinterval if slide is triggered manually and fourceautoplay is false
					if (!_this.fromAuto && !_this.core.s.fourceAutoplay) {
						_this.cancelAuto();
					}

					_this.fromAuto = false;
				});
			};

			// Manage autoplay via play/stop buttons
			Autoplay.prototype.controls = function () {
				var _this = this;
				var _html = '<span class="lg-autoplay-button lg-icon"></span>';

				// Append autoplay controls
				_this.core.outer.querySelector(this.core.s.appendAutoplayControlsTo).insertAdjacentHTML('beforeend', _html);

				utils.on(_this.core.outer.querySelector('.lg-autoplay-button'), 'click.lg', function () {
					if (utils.hasClass(_this.core.outer, 'lg-show-autoplay')) {
						_this.cancelAuto();
						_this.core.s.fourceAutoplay = false;
					} else {
						if (!_this.interval) {
							_this.startlAuto();
							_this.core.s.fourceAutoplay = _this.fourceAutoplayTemp;
						}
					}
				});
			};

			// Autostart gallery
			Autoplay.prototype.startlAuto = function () {
				var _this = this;

				utils.setVendor(_this.core.outer.querySelector('.lg-progress'), 'Transition', 'width ' + (_this.core.s.speed + _this.core.s.pause) + 'ms ease 0s');
				utils.addClass(_this.core.outer, 'lg-show-autoplay');
				utils.addClass(_this.core.outer.querySelector('.lg-progress-bar'), 'lg-start');

				_this.interval = setInterval(function () {
					if (_this.core.index + 1 < _this.core.items.length) {
						_this.core.index++;
					} else {
						_this.core.index = 0;
					}

					_this.fromAuto = true;
					_this.core.slide(_this.core.index, false, false);
				}, _this.core.s.speed + _this.core.s.pause);
			};

			// cancel Autostart
			Autoplay.prototype.cancelAuto = function () {
				clearInterval(this.interval);
				this.interval = false;
				if (this.core.outer.querySelector('.lg-progress')) {
					this.core.outer.querySelector('.lg-progress').removeAttribute('style');
				}

				utils.removeClass(this.core.outer, 'lg-show-autoplay');
				utils.removeClass(this.core.outer.querySelector('.lg-progress-bar'), 'lg-start');
			};

			Autoplay.prototype.destroy = function () {

				this.cancelAuto();
				if (this.core.outer.querySelector('.lg-progress-bar')) {
					this.core.outer.querySelector('.lg-progress-bar').parentNode.removeChild(this.core.outer.querySelector('.lg-progress-bar'));
				}
			};

			window.lgModules.autoplay = Autoplay;
		});

	},{}]},{},[1])(1)
});

/**!
 * lg-fullscreen.js | 0.0.1 | July 25th 2016
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgFullsceen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
		(function (global, factory) {
			if (typeof define === "function" && define.amd) {
				define([], factory);
			} else if (typeof exports !== "undefined") {
				factory();
			} else {
				var mod = {
					exports: {}
				};
				factory();
				global.lgFullscreen = mod.exports;
			}
		})(this, function () {
			'use strict';

			var _extends = Object.assign || function (target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];

					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}

				return target;
			};

			var fullscreenDefaults = {
				fullScreen: true
			};

			var Fullscreen = function Fullscreen(element) {

				this.el = element;

				this.core = window.lgData[this.el.getAttribute('lg-uid')];
				this.core.s = _extends({}, fullscreenDefaults, this.core.s);

				this.init();

				return this;
			};

			Fullscreen.prototype.init = function () {
				var fullScreen = '';
				if (this.core.s.fullScreen) {

					// check for fullscreen browser support
					if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
						return;
					} else {
						fullScreen = '<span class="lg-fullscreen lg-icon"></span>';
						this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
						this.fullScreen();
					}
				}
			};

			Fullscreen.prototype.requestFullscreen = function () {
				var el = document.documentElement;
				if (el.requestFullscreen) {
					el.requestFullscreen();
				} else if (el.msRequestFullscreen) {
					el.msRequestFullscreen();
				} else if (el.mozRequestFullScreen) {
					el.mozRequestFullScreen();
				} else if (el.webkitRequestFullscreen) {
					el.webkitRequestFullscreen();
				}
			};

			Fullscreen.prototype.exitFullscreen = function () {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			};

			// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
			Fullscreen.prototype.fullScreen = function () {
				var _this = this;

				utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function () {
					if (utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
						utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
					} else {
						utils.addClass(_this.core.outer, 'lg-fullscreen-on');
					}
				});

				utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function () {
					if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
						_this.requestFullscreen();
					} else {
						_this.exitFullscreen();
					}
				});
			};

			Fullscreen.prototype.destroy = function () {

				// exit from fullscreen if activated
				this.exitFullscreen();

				utils.off(document, '.lgfullscreen');
			};

			window.lgModules.fullscreen = Fullscreen;
		});

	},{}]},{},[1])(1)
});

/**!
 * lg-thumbnail.js | 0.0.4 | August 9th 2016
 * http://sachinchoolur.github.io/lg-thumbnail.js
 * Copyright (c) 2016 Sachin N;
 * @license Apache 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgThumbnail = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
		(function (global, factory) {
			if (typeof define === "function" && define.amd) {
				define([], factory);
			} else if (typeof exports !== "undefined") {
				factory();
			} else {
				var mod = {
					exports: {}
				};
				factory();
				global.lgThumbnail = mod.exports;
			}
		})(this, function () {
			'use strict';

			var _extends = Object.assign || function (target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];

					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}

				return target;
			};

			var thumbnailDefaults = {
				thumbnail: true,

				animateThumb: true,
				currentPagerPosition: 'middle',

				thumbWidth: 100,
				thumbContHeight: 100,
				thumbMargin: 5,

				exThumbImage: false,
				showThumbByDefault: true,
				toggleThumb: true,
				pullCaptionUp: true,

				enableThumbDrag: true,
				enableThumbSwipe: true,
				swipeThreshold: 50,

				loadYoutubeThumbnail: true,
				youtubeThumbSize: 1,

				loadVimeoThumbnail: true,
				vimeoThumbSize: 'thumbnail_small',

				loadDailymotionThumbnail: true
			};

			var Thumbnail = function Thumbnail(element) {

				this.el = element;

				this.core = window.lgData[this.el.getAttribute('lg-uid')];
				this.core.s = _extends({}, thumbnailDefaults, this.core.s);

				this.thumbOuter = null;
				this.thumbOuterWidth = 0;
				this.thumbTotalWidth = this.core.items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin);
				this.thumbIndex = this.core.index;

				// Thumbnail animation value
				this.left = 0;

				this.init();

				return this;
			};

			Thumbnail.prototype.init = function () {
				var _this = this;
				if (this.core.s.thumbnail && this.core.items.length > 1) {
					if (this.core.s.showThumbByDefault) {
						setTimeout(function () {
							utils.addClass(_this.core.outer, 'lg-thumb-open');
						}, 700);
					}

					if (this.core.s.pullCaptionUp) {
						utils.addClass(this.core.outer, 'lg-pull-caption-up');
					}

					this.build();
					if (this.core.s.animateThumb) {
						if (this.core.s.enableThumbDrag && !this.core.isTouch && this.core.doCss()) {
							this.enableThumbDrag();
						}

						if (this.core.s.enableThumbSwipe && this.core.isTouch && this.core.doCss()) {
							this.enableThumbSwipe();
						}

						this.thumbClickable = false;
					} else {
						this.thumbClickable = true;
					}

					this.toggle();
					this.thumbkeyPress();
				}
			};

			Thumbnail.prototype.build = function () {
				var _this = this;
				var thumbList = '';
				var vimeoErrorThumbSize = '';
				var $thumb;
				var html = '<div class="lg-thumb-outer">' + '<div class="lg-thumb group">' + '</div>' + '</div>';

				switch (this.core.s.vimeoThumbSize) {
					case 'thumbnail_large':
						vimeoErrorThumbSize = '640';
						break;
					case 'thumbnail_medium':
						vimeoErrorThumbSize = '200x150';
						break;
					case 'thumbnail_small':
						vimeoErrorThumbSize = '100x75';
				}

				utils.addClass(_this.core.outer, 'lg-has-thumb');

				_this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', html);

				_this.thumbOuter = _this.core.outer.querySelector('.lg-thumb-outer');
				_this.thumbOuterWidth = _this.thumbOuter.offsetWidth;

				if (_this.core.s.animateThumb) {
					_this.core.outer.querySelector('.lg-thumb').style.width = _this.thumbTotalWidth + 'px';
					_this.core.outer.querySelector('.lg-thumb').style.position = 'relative';
				}

				if (this.core.s.animateThumb) {
					_this.thumbOuter.style.height = _this.core.s.thumbContHeight + 'px';
				}

				function getThumb(src, thumb, index) {
					var isVideo = _this.core.isVideo(src, index) || {};
					var thumbImg;
					var vimeoId = '';

					if (isVideo.youtube || isVideo.vimeo || isVideo.dailymotion) {
						if (isVideo.youtube) {
							if (_this.core.s.loadYoutubeThumbnail) {
								thumbImg = '//img.youtube.com/vi/' + isVideo.youtube[1] + '/' + _this.core.s.youtubeThumbSize + '.jpg';
							} else {
								thumbImg = thumb;
							}
						} else if (isVideo.vimeo) {
							if (_this.core.s.loadVimeoThumbnail) {
								thumbImg = '//i.vimeocdn.com/video/error_' + vimeoErrorThumbSize + '.jpg';
								vimeoId = isVideo.vimeo[1];
							} else {
								thumbImg = thumb;
							}
						} else if (isVideo.dailymotion) {
							if (_this.core.s.loadDailymotionThumbnail) {
								thumbImg = '//www.dailymotion.com/thumbnail/video/' + isVideo.dailymotion[1];
							} else {
								thumbImg = thumb;
							}
						}
					} else {
						thumbImg = thumb;
					}

					thumbList += '<div data-vimeo-id="' + vimeoId + '" class="lg-thumb-item" style="width:' + _this.core.s.thumbWidth + 'px; margin-right: ' + _this.core.s.thumbMargin + 'px"><img src="' + thumbImg + '" /></div>';
					vimeoId = '';
				}

				if (_this.core.s.dynamic) {
					for (var j = 0; j < _this.core.s.dynamicEl.length; j++) {
						getThumb(_this.core.s.dynamicEl[j].src, _this.core.s.dynamicEl[j].thumb, j);
					}
				} else {
					for (var i = 0; i < _this.core.items.length; i++) {
						if (!_this.core.s.exThumbImage) {
							getThumb(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].querySelector('img').getAttribute('src'), i);
						} else {
							getThumb(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].getAttribute(_this.core.s.exThumbImage), i);
						}
					}
				}

				_this.core.outer.querySelector('.lg-thumb').innerHTML = thumbList;

				$thumb = _this.core.outer.querySelectorAll('.lg-thumb-item');

				for (var n = 0; n < $thumb.length; n++) {

					/*jshint loopfunc: true */
					(function (index) {
						var $this = $thumb[index];
						var vimeoVideoId = $this.getAttribute('data-vimeo-id');
						if (vimeoVideoId) {

							window['lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n] = function (content) {
								$this.querySelector('img').setAttribute('src', content[0][_this.core.s.vimeoThumbSize]);
							};

							var script = document.createElement('script');
							script.className = 'lg-script';
							script.src = '//www.vimeo.com/api/v2/video/' + vimeoVideoId + '.json?callback=lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n;
							document.body.appendChild(script);
						}
					})(n);
				}

				// manage active class for thumbnail
				utils.addClass($thumb[_this.core.index], 'active');
				utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {

					for (var j = 0; j < $thumb.length; j++) {
						utils.removeClass($thumb[j], 'active');
					}

					utils.addClass($thumb[_this.core.index], 'active');
				});

				for (var k = 0; k < $thumb.length; k++) {

					/*jshint loopfunc: true */
					(function (index) {

						utils.on($thumb[index], 'click.lg touchend.lg', function () {

							setTimeout(function () {

								// In IE9 and bellow touch does not support
								// Go to slide if browser does not support css transitions
								if (_this.thumbClickable && !_this.core.lgBusy || !_this.core.doCss()) {
									_this.core.index = index;
									_this.core.slide(_this.core.index, false, true);
								}
							}, 50);
						});
					})(k);
				}

				utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
					_this.animateThumb(_this.core.index);
				});

				utils.on(window, 'resize.lgthumb orientationchange.lgthumb', function () {
					setTimeout(function () {
						_this.animateThumb(_this.core.index);
						_this.thumbOuterWidth = _this.thumbOuter.offsetWidth;
					}, 200);
				});
			};

			Thumbnail.prototype.setTranslate = function (value) {
				utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'Transform', 'translate3d(-' + value + 'px, 0px, 0px)');
			};

			Thumbnail.prototype.animateThumb = function (index) {
				var $thumb = this.core.outer.querySelector('.lg-thumb');
				if (this.core.s.animateThumb) {
					var position;
					switch (this.core.s.currentPagerPosition) {
						case 'left':
							position = 0;
							break;
						case 'middle':
							position = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
							break;
						case 'right':
							position = this.thumbOuterWidth - this.core.s.thumbWidth;
					}
					this.left = (this.core.s.thumbWidth + this.core.s.thumbMargin) * index - 1 - position;
					if (this.left > this.thumbTotalWidth - this.thumbOuterWidth) {
						this.left = this.thumbTotalWidth - this.thumbOuterWidth;
					}

					if (this.left < 0) {
						this.left = 0;
					}

					if (this.core.lGalleryOn) {
						if (!utils.hasClass($thumb, 'on')) {
							utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'TransitionDuration', this.core.s.speed + 'ms');
						}

						if (!this.core.doCss()) {
							$thumb.style.left = -this.left + 'px';
						}
					} else {
						if (!this.core.doCss()) {
							$thumb.style.left = -this.left + 'px';
						}
					}

					this.setTranslate(this.left);
				}
			};

			// Enable thumbnail dragging and swiping
			Thumbnail.prototype.enableThumbDrag = function () {

				var _this = this;
				var startCoords = 0;
				var endCoords = 0;
				var isDraging = false;
				var isMoved = false;
				var tempLeft = 0;

				utils.addClass(_this.thumbOuter, 'lg-grab');

				utils.on(_this.core.outer.querySelector('.lg-thumb'), 'mousedown.lgthumb', function (e) {
					if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
						// execute only on .lg-object
						e.preventDefault();
						startCoords = e.pageX;
						isDraging = true;

						// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
						_this.core.outer.scrollLeft += 1;
						_this.core.outer.scrollLeft -= 1;

						// *
						_this.thumbClickable = false;
						utils.removeClass(_this.thumbOuter, 'lg-grab');
						utils.addClass(_this.thumbOuter, 'lg-grabbing');
					}
				});

				utils.on(window, 'mousemove.lgthumb', function (e) {
					if (isDraging) {
						tempLeft = _this.left;
						isMoved = true;
						endCoords = e.pageX;

						utils.addClass(_this.thumbOuter, 'lg-dragging');

						tempLeft = tempLeft - (endCoords - startCoords);

						if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
							tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
						}

						if (tempLeft < 0) {
							tempLeft = 0;
						}

						// move current slide
						_this.setTranslate(tempLeft);
					}
				});

				utils.on(window, 'mouseup.lgthumb', function () {
					if (isMoved) {
						isMoved = false;
						utils.removeClass(_this.thumbOuter, 'lg-dragging');

						_this.left = tempLeft;

						if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
							_this.thumbClickable = true;
						}
					} else {
						_this.thumbClickable = true;
					}

					if (isDraging) {
						isDraging = false;
						utils.removeClass(_this.thumbOuter, 'lg-grabbing');
						utils.addClass(_this.thumbOuter, 'lg-grab');
					}
				});
			};

			Thumbnail.prototype.enableThumbSwipe = function () {
				var _this = this;
				var startCoords = 0;
				var endCoords = 0;
				var isMoved = false;
				var tempLeft = 0;

				utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchstart.lg', function (e) {
					if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
						e.preventDefault();
						startCoords = e.targetTouches[0].pageX;
						_this.thumbClickable = false;
					}
				});

				utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchmove.lg', function (e) {
					if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
						e.preventDefault();
						endCoords = e.targetTouches[0].pageX;
						isMoved = true;

						utils.addClass(_this.thumbOuter, 'lg-dragging');

						tempLeft = _this.left;

						tempLeft = tempLeft - (endCoords - startCoords);

						if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
							tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
						}

						if (tempLeft < 0) {
							tempLeft = 0;
						}

						// move current slide
						_this.setTranslate(tempLeft);
					}
				});

				utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchend.lg', function () {
					if (_this.thumbTotalWidth > _this.thumbOuterWidth) {

						if (isMoved) {
							isMoved = false;
							utils.removeClass(_this.thumbOuter, 'lg-dragging');
							if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
								_this.thumbClickable = true;
							}

							_this.left = tempLeft;
						} else {
							_this.thumbClickable = true;
						}
					} else {
						_this.thumbClickable = true;
					}
				});
			};

			Thumbnail.prototype.toggle = function () {
				var _this = this;
				if (_this.core.s.toggleThumb) {
					utils.addClass(_this.core.outer, 'lg-can-toggle');
					_this.thumbOuter.insertAdjacentHTML('beforeend', '<span class="lg-toggle-thumb lg-icon"></span>');
					utils.on(_this.core.outer.querySelector('.lg-toggle-thumb'), 'click.lg', function () {
						if (utils.hasClass(_this.core.outer, 'lg-thumb-open')) {
							utils.removeClass(_this.core.outer, 'lg-thumb-open');
						} else {
							utils.addClass(_this.core.outer, 'lg-thumb-open');
						}
					});
				}
			};

			Thumbnail.prototype.thumbkeyPress = function () {
				var _this = this;
				utils.on(window, 'keydown.lgthumb', function (e) {
					if (e.keyCode === 38) {
						e.preventDefault();
						utils.addClass(_this.core.outer, 'lg-thumb-open');
					} else if (e.keyCode === 40) {
						e.preventDefault();
						utils.removeClass(_this.core.outer, 'lg-thumb-open');
					}
				});
			};

			Thumbnail.prototype.destroy = function () {
				if (this.core.s.thumbnail && this.core.items.length > 1) {
					utils.off(window, '.lgthumb');
					this.thumbOuter.parentNode.removeChild(this.thumbOuter);
					utils.removeClass(this.core.outer, 'lg-has-thumb');

					var lgScript = document.getElementsByClassName('lg-script');
					while (lgScript[0]) {
						lgScript[0].parentNode.removeChild(lgScript[0]);
					}
				}
			};

			window.lgModules.thumbnail = Thumbnail;
		});

	},{}]},{},[1])(1)
});

/**!
 * lg-zoom.js | 1.0.1 | December 22nd 2016
 * http://sachinchoolur.github.io/lg-zoom.js
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgZoom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
		(function (global, factory) {
			if (typeof define === "function" && define.amd) {
				define([], factory);
			} else if (typeof exports !== "undefined") {
				factory();
			} else {
				var mod = {
					exports: {}
				};
				factory();
				global.lgZoom = mod.exports;
			}
		})(this, function () {
			'use strict';

			var _extends = Object.assign || function (target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];

					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}

				return target;
			};

			var getUseLeft = function getUseLeft() {
				var useLeft = false;
				var isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
				if (isChrome && parseInt(isChrome[2], 10) < 54) {
					useLeft = true;
				}

				return useLeft;
			};

			var zoomDefaults = {
				scale: 1,
				zoom: true,
				actualSize: true,
				enableZoomAfter: 300,
				useLeftForZoom: getUseLeft()
			};

			var Zoom = function Zoom(element) {

				this.el = element;

				this.core = window.lgData[this.el.getAttribute('lg-uid')];
				this.core.s = _extends({}, zoomDefaults, this.core.s);

				if (this.core.s.zoom && this.core.doCss()) {
					this.init();

					// Store the zoomable timeout value just to clear it while closing
					this.zoomabletimeout = false;

					// Set the initial value center
					this.pageX = window.innerWidth / 2;
					this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
				}

				return this;
			};

			Zoom.prototype.init = function () {

				var _this = this;
				var zoomIcons = '<span id="lg-zoom-in" class="lg-icon"></span><span id="lg-zoom-out" class="lg-icon"></span>';

				if (_this.core.s.actualSize) {
					zoomIcons += '<span id="lg-actual-size" class="lg-icon"></span>';
				}

				if (_this.core.s.useLeftForZoom) {
					utils.addClass(_this.core.outer, 'lg-use-left-for-zoom');
				} else {
					utils.addClass(_this.core.outer, 'lg-use-transition-for-zoom');
				}

				this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', zoomIcons);

				// Add zoomable class
				utils.on(_this.core.el, 'onSlideItemLoad.lgtmzoom', function (event) {

					// delay will be 0 except first time
					var _speed = _this.core.s.enableZoomAfter + event.detail.delay;

					// set _speed value 0 if gallery opened from direct url and if it is first slide
					if (utils.hasClass(document.body, 'lg-from-hash') && event.detail.delay) {

						// will execute only once
						_speed = 0;
					} else {

						// Remove lg-from-hash to enable starting animation.
						utils.removeClass(document.body, 'lg-from-hash');
					}

					_this.zoomabletimeout = setTimeout(function () {
						utils.addClass(_this.core.___slide[event.detail.index], 'lg-zoomable');
					}, _speed + 30);
				});

				var scale = 1;
				/**
				 * @desc Image zoom
				 * Translate the wrap and scale the image to get better user experience
				 *
				 * @param {String} scaleVal - Zoom decrement/increment value
				 */
				var zoom = function zoom(scaleVal) {

					var image = _this.core.outer.querySelector('.lg-current .lg-image');
					var _x;
					var _y;

					// Find offset manually to avoid issue after zoom
					var offsetX = (window.innerWidth - image.clientWidth) / 2;
					var offsetY = (window.innerHeight - image.clientHeight) / 2 + (document.documentElement.scrollTop || document.body.scrollTop);

					_x = _this.pageX - offsetX;
					_y = _this.pageY - offsetY;

					var x = (scaleVal - 1) * _x;
					var y = (scaleVal - 1) * _y;

					utils.setVendor(image, 'Transform', 'scale3d(' + scaleVal + ', ' + scaleVal + ', 1)');
					image.setAttribute('data-scale', scaleVal);

					if (_this.core.s.useLeftForZoom) {
						image.parentElement.style.left = -x + 'px';
						image.parentElement.style.top = -y + 'px';
					} else {
						utils.setVendor(image.parentElement, 'Transform', 'translate3d(-' + x + 'px, -' + y + 'px, 0)');
					}

					image.parentElement.setAttribute('data-x', x);
					image.parentElement.setAttribute('data-y', y);
				};

				var callScale = function callScale() {
					if (scale > 1) {
						utils.addClass(_this.core.outer, 'lg-zoomed');
					} else {
						_this.resetZoom();
					}

					if (scale < 1) {
						scale = 1;
					}

					zoom(scale);
				};

				var actualSize = function actualSize(event, image, index, fromIcon) {
					var w = image.clientWidth;
					var nw;
					if (_this.core.s.dynamic) {
						nw = _this.core.s.dynamicEl[index].width || image.naturalWidth || w;
					} else {
						nw = _this.core.items[index].getAttribute('data-width') || image.naturalWidth || w;
					}

					var _scale;

					if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
						scale = 1;
					} else {
						if (nw > w) {
							_scale = nw / w;
							scale = _scale || 2;
						}
					}

					if (fromIcon) {
						_this.pageX = window.innerWidth / 2;
						_this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
					} else {
						_this.pageX = event.pageX || event.targetTouches[0].pageX;
						_this.pageY = event.pageY || event.targetTouches[0].pageY;
					}

					callScale();
					setTimeout(function () {
						utils.removeClass(_this.core.outer, 'lg-grabbing');
						utils.addClass(_this.core.outer, 'lg-grab');
					}, 10);
				};

				var tapped = false;

				// event triggered after appending slide content
				utils.on(_this.core.el, 'onAferAppendSlide.lgtmzoom', function (event) {

					var index = event.detail.index;

					// Get the current element
					var image = _this.core.___slide[index].querySelector('.lg-image');

					if (!_this.core.isTouch) {
						utils.on(image, 'dblclick', function (event) {
							actualSize(event, image, index);
						});
					}

					if (_this.core.isTouch) {
						utils.on(image, 'touchstart', function (event) {
							if (!tapped) {
								tapped = setTimeout(function () {
									tapped = null;
								}, 300);
							} else {
								clearTimeout(tapped);
								tapped = null;
								actualSize(event, image, index);
							}

							event.preventDefault();
						});
					}
				});

				// Update zoom on resize and orientationchange
				utils.on(window, 'resize.lgzoom scroll.lgzoom orientationchange.lgzoom', function () {
					_this.pageX = window.innerWidth / 2;
					_this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
					zoom(scale);
				});

				utils.on(document.getElementById('lg-zoom-out'), 'click.lg', function () {
					if (_this.core.outer.querySelector('.lg-current .lg-image')) {
						scale -= _this.core.s.scale;
						callScale();
					}
				});

				utils.on(document.getElementById('lg-zoom-in'), 'click.lg', function () {
					if (_this.core.outer.querySelector('.lg-current .lg-image')) {
						scale += _this.core.s.scale;
						callScale();
					}
				});

				utils.on(document.getElementById('lg-actual-size'), 'click.lg', function (event) {
					actualSize(event, _this.core.___slide[_this.core.index].querySelector('.lg-image'), _this.core.index, true);
				});

				// Reset zoom on slide change
				utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
					scale = 1;
					_this.resetZoom();
				});

				// Drag option after zoom
				if (!_this.core.isTouch) {
					_this.zoomDrag();
				}

				if (_this.core.isTouch) {
					_this.zoomSwipe();
				}
			};

			// Reset zoom effect
			Zoom.prototype.resetZoom = function () {
				utils.removeClass(this.core.outer, 'lg-zoomed');
				for (var i = 0; i < this.core.___slide.length; i++) {
					if (this.core.___slide[i].querySelector('.lg-img-wrap')) {
						this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('style');
						this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-x');
						this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-y');
					}
				}

				for (var j = 0; j < this.core.___slide.length; j++) {
					if (this.core.___slide[j].querySelector('.lg-image')) {
						this.core.___slide[j].querySelector('.lg-image').removeAttribute('style');
						this.core.___slide[j].querySelector('.lg-image').removeAttribute('data-scale');
					}
				}

				// Reset pagx pagy values to center
				this.pageX = window.innerWidth / 2;
				this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
			};

			Zoom.prototype.zoomSwipe = function () {
				var _this = this;
				var startCoords = {};
				var endCoords = {};
				var isMoved = false;

				// Allow x direction drag
				var allowX = false;

				// Allow Y direction drag
				var allowY = false;

				for (var i = 0; i < _this.core.___slide.length; i++) {

					/*jshint loopfunc: true */
					utils.on(_this.core.___slide[i], 'touchstart.lg', function (e) {

						if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
							var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');

							allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
							allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;
							if (allowX || allowY) {
								e.preventDefault();
								startCoords = {
									x: e.targetTouches[0].pageX,
									y: e.targetTouches[0].pageY
								};
							}
						}
					});
				}

				for (var j = 0; j < _this.core.___slide.length; j++) {

					/*jshint loopfunc: true */
					utils.on(_this.core.___slide[j], 'touchmove.lg', function (e) {

						if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {

							var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
							var distanceX;
							var distanceY;

							e.preventDefault();
							isMoved = true;

							endCoords = {
								x: e.targetTouches[0].pageX,
								y: e.targetTouches[0].pageY
							};

							// reset opacity and transition duration
							utils.addClass(_this.core.outer, 'lg-zoom-dragging');

							if (allowY) {
								distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
							} else {
								distanceY = -Math.abs(_el.getAttribute('data-y'));
							}

							if (allowX) {
								distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
							} else {
								distanceX = -Math.abs(_el.getAttribute('data-x'));
							}

							if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {

								if (_this.core.s.useLeftForZoom) {
									_el.style.left = distanceX + 'px';
									_el.style.top = distanceY + 'px';
								} else {
									utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
								}
							}
						}
					});
				}

				for (var k = 0; k < _this.core.___slide.length; k++) {

					/*jshint loopfunc: true */
					utils.on(_this.core.___slide[k], 'touchend.lg', function () {
						if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
							if (isMoved) {
								isMoved = false;
								utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
								_this.touchendZoom(startCoords, endCoords, allowX, allowY);
							}
						}
					});
				}
			};

			Zoom.prototype.zoomDrag = function () {

				var _this = this;
				var startCoords = {};
				var endCoords = {};
				var isDraging = false;
				var isMoved = false;

				// Allow x direction drag
				var allowX = false;

				// Allow Y direction drag
				var allowY = false;

				for (var i = 0; i < _this.core.___slide.length; i++) {

					/*jshint loopfunc: true */
					utils.on(_this.core.___slide[i], 'mousedown.lgzoom', function (e) {

						// execute only on .lg-object
						var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');

						allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
						allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;

						if (utils.hasClass(_this.core.outer, 'lg-zoomed')) {
							if (utils.hasClass(e.target, 'lg-object') && (allowX || allowY)) {
								e.preventDefault();
								startCoords = {
									x: e.pageX,
									y: e.pageY
								};

								isDraging = true;

								// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
								_this.core.outer.scrollLeft += 1;
								_this.core.outer.scrollLeft -= 1;

								utils.removeClass(_this.core.outer, 'lg-grab');
								utils.addClass(_this.core.outer, 'lg-grabbing');
							}
						}
					});
				}

				utils.on(window, 'mousemove.lgzoom', function (e) {
					if (isDraging) {
						var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
						var distanceX;
						var distanceY;

						isMoved = true;
						endCoords = {
							x: e.pageX,
							y: e.pageY
						};

						// reset opacity and transition duration
						utils.addClass(_this.core.outer, 'lg-zoom-dragging');

						if (allowY) {
							distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
						} else {
							distanceY = -Math.abs(_el.getAttribute('data-y'));
						}

						if (allowX) {
							distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
						} else {
							distanceX = -Math.abs(_el.getAttribute('data-x'));
						}

						if (_this.core.s.useLeftForZoom) {
							_el.style.left = distanceX + 'px';
							_el.style.top = distanceY + 'px';
						} else {
							utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
						}
					}
				});

				utils.on(window, 'mouseup.lgzoom', function (e) {

					if (isDraging) {
						isDraging = false;
						utils.removeClass(_this.core.outer, 'lg-zoom-dragging');

						// Fix for chrome mouse move on click
						if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
							endCoords = {
								x: e.pageX,
								y: e.pageY
							};
							_this.touchendZoom(startCoords, endCoords, allowX, allowY);
						}

						isMoved = false;
					}

					utils.removeClass(_this.core.outer, 'lg-grabbing');
					utils.addClass(_this.core.outer, 'lg-grab');
				});
			};

			Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY) {

				var _this = this;
				var _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
				var image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
				var distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
				var distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
				var minY = (_this.core.outer.querySelector('.lg').clientHeight - image.offsetHeight) / 2;
				var maxY = Math.abs(image.offsetHeight * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientHeight + minY);
				var minX = (_this.core.outer.querySelector('.lg').clientWidth - image.offsetWidth) / 2;
				var maxX = Math.abs(image.offsetWidth * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientWidth + minX);

				if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
					if (allowY) {
						if (distanceY <= -maxY) {
							distanceY = -maxY;
						} else if (distanceY >= -minY) {
							distanceY = -minY;
						}
					}

					if (allowX) {
						if (distanceX <= -maxX) {
							distanceX = -maxX;
						} else if (distanceX >= -minX) {
							distanceX = -minX;
						}
					}

					if (allowY) {
						_el.setAttribute('data-y', Math.abs(distanceY));
					} else {
						distanceY = -Math.abs(_el.getAttribute('data-y'));
					}

					if (allowX) {
						_el.setAttribute('data-x', Math.abs(distanceX));
					} else {
						distanceX = -Math.abs(_el.getAttribute('data-x'));
					}

					if (_this.core.s.useLeftForZoom) {
						_el.style.left = distanceX + 'px';
						_el.style.top = distanceY + 'px';
					} else {
						utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
					}
				}
			};

			Zoom.prototype.destroy = function () {

				var _this = this;

				// Unbind all events added by lightGallery zoom plugin
				utils.off(_this.core.el, '.lgzoom');
				utils.off(window, '.lgzoom');
				for (var i = 0; i < _this.core.___slide.length; i++) {
					utils.off(_this.core.___slide[i], '.lgzoom');
				}

				utils.off(_this.core.el, '.lgtmzoom');
				_this.resetZoom();
				clearTimeout(_this.zoomabletimeout);
				_this.zoomabletimeout = false;
			};

			window.lgModules.zoom = Zoom;
		});

	},{}]},{},[1])(1)
});