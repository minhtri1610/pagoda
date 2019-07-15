/*! lightslider - v1.1.6 - 2016-10-25
 * https://github.com/sachinchoolur/lightslider
 * Copyright (c) 2016 Sachin N; Licensed MIT */
(function ($, undefined) {
	'use strict';
	var defaults = {
		item: 3,
		autoWidth: false,
		slideMove: 1,
		slideMargin: 10,
		addClass: '',
		mode: 'slide',
		useCSS: true,
		cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',
		easing: 'linear', //'for jquery animation',//
		speed: 400, //ms'
		auto: false,
		pauseOnHover: false,
		loop: false,
		slideEndAnimation: true,
		pause: 2000,
		keyPress: false,
		controls: true,
		prevHtml: '',
		nextHtml: '',
		rtl: false,
		adaptiveHeight: false,
		vertical: false,
		verticalHeight: 500,
		vThumbWidth: 100,
		thumbItem: 10,
		pager: true,
		gallery: false,
		galleryMargin: 5,
		thumbMargin: 5,
		currentPagerPosition: 'middle',
		enableTouch: true,
		enableDrag: true,
		freeMove: true,
		swipeThreshold: 40,
		responsive: [],
		/* jshint ignore:start */
		onBeforeStart: function ($el) {},
		onSliderLoad: function ($el) {},
		onBeforeSlide: function ($el, scene) {},
		onAfterSlide: function ($el, scene) {},
		onBeforeNextSlide: function ($el, scene) {},
		onBeforePrevSlide: function ($el, scene) {}
		/* jshint ignore:end */
	};
	$.fn.lightSlider = function (options) {
		if (this.length === 0) {
			return this;
		}

		if (this.length > 1) {
			this.each(function () {
				$(this).lightSlider(options);
			});
			return this;
		}

		var plugin = {},
			settings = $.extend(true, {}, defaults, options),
			settingsTemp = {},
			$el = this;
		plugin.$el = this;

		if (settings.mode === 'fade') {
			settings.vertical = false;
		}
		var $children = $el.children(),
			windowW = $(window).width(),
			breakpoint = null,
			resposiveObj = null,
			length = 0,
			w = 0,
			on = false,
			elSize = 0,
			$slide = '',
			scene = 0,
			property = (settings.vertical === true) ? 'height' : 'width',
			gutter = (settings.vertical === true) ? 'margin-bottom' : 'margin-right',
			slideValue = 0,
			pagerWidth = 0,
			slideWidth = 0,
			thumbWidth = 0,
			interval = null,
			isTouch = ('ontouchstart' in document.documentElement);
		var refresh = {};

		refresh.chbreakpoint = function () {
			windowW = $(window).width();
			if (settings.responsive.length) {
				var item;
				if (settings.autoWidth === false) {
					item = settings.item;
				}
				if (windowW < settings.responsive[0].breakpoint) {
					for (var i = 0; i < settings.responsive.length; i++) {
						if (windowW < settings.responsive[i].breakpoint) {
							breakpoint = settings.responsive[i].breakpoint;
							resposiveObj = settings.responsive[i];
						}
					}
				}
				if (typeof resposiveObj !== 'undefined' && resposiveObj !== null) {
					for (var j in resposiveObj.settings) {
						if (resposiveObj.settings.hasOwnProperty(j)) {
							if (typeof settingsTemp[j] === 'undefined' || settingsTemp[j] === null) {
								settingsTemp[j] = settings[j];
							}
							settings[j] = resposiveObj.settings[j];
						}
					}
				}
				if (!$.isEmptyObject(settingsTemp) && windowW > settings.responsive[0].breakpoint) {
					for (var k in settingsTemp) {
						if (settingsTemp.hasOwnProperty(k)) {
							settings[k] = settingsTemp[k];
						}
					}
				}
				if (settings.autoWidth === false) {
					if (slideValue > 0 && slideWidth > 0) {
						if (item !== settings.item) {
							scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
						}
					}
				}
			}
		};

		refresh.calSW = function () {
			if (settings.autoWidth === false) {
				slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
			}
		};

		refresh.calWidth = function (cln) {
			var ln = cln === true ? $slide.find('.lslide').length : $children.length;
			if (settings.autoWidth === false) {
				w = ln * (slideWidth + settings.slideMargin);
			} else {
				w = 0;
				for (var i = 0; i < ln; i++) {
					w += (parseInt($children.eq(i).width()) + settings.slideMargin);
				}
			}
			return w;
		};
		plugin = {
			doCss: function () {
				var support = function () {
					var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
					var root = document.documentElement;
					for (var i = 0; i < transition.length; i++) {
						if (transition[i] in root.style) {
							return true;
						}
					}
				};
				if (settings.useCSS && support()) {
					return true;
				}
				return false;
			},
			keyPress: function () {
				if (settings.keyPress) {
					$(document).on('keyup.lightslider', function (e) {
						if (!$(':focus').is('input, textarea')) {
							if (e.preventDefault) {
								e.preventDefault();
							} else {
								e.returnValue = false;
							}
							if (e.keyCode === 37) {
								$el.goToPrevSlide();
							} else if (e.keyCode === 39) {
								$el.goToNextSlide();
							}
						}
					});
				}
			},
			controls: function () {
				if (settings.controls) {
					$el.after('<div class="lSAction"><a class="lSPrev">' + settings.prevHtml + '</a><a class="lSNext">' + settings.nextHtml + '</a></div>');
					if (!settings.autoWidth) {
						if (length <= settings.item) {
							$slide.find('.lSAction').hide();
						}
					} else {
						if (refresh.calWidth(false) < elSize) {
							$slide.find('.lSAction').hide();
						}
					}
					$slide.find('.lSAction a').on('click', function (e) {
						if (e.preventDefault) {
							e.preventDefault();
						} else {
							e.returnValue = false;
						}
						if ($(this).attr('class') === 'lSPrev') {
							$el.goToPrevSlide();
						} else {
							$el.goToNextSlide();
						}
						return false;
					});
				}
			},
			initialStyle: function () {
				var $this = this;
				if (settings.mode === 'fade') {
					settings.autoWidth = false;
					settings.slideEndAnimation = false;
				}
				if (settings.auto) {
					settings.slideEndAnimation = false;
				}
				if (settings.autoWidth) {
					settings.slideMove = 1;
					settings.item = 1;
				}
				if (settings.loop) {
					settings.slideMove = 1;
					settings.freeMove = false;
				}
				settings.onBeforeStart.call(this, $el);
				refresh.chbreakpoint();
				$el.addClass('lightSlider').wrap('<div class="lSSlideOuter ' + settings.addClass + '"><div class="lSSlideWrapper"></div></div>');
				$slide = $el.parent('.lSSlideWrapper');
				if (settings.rtl === true) {
					$slide.parent().addClass('lSrtl');
				}
				if (settings.vertical) {
					$slide.parent().addClass('vertical');
					elSize = settings.verticalHeight;
					$slide.css('height', elSize + 'px');
				} else {
					elSize = $el.outerWidth();
				}
				$children.addClass('lslide');
				if (settings.loop === true && settings.mode === 'slide') {
					refresh.calSW();
					refresh.clone = function () {
						if (refresh.calWidth(true) > elSize) {
							/**/
							var tWr = 0,
								tI = 0;
							for (var k = 0; k < $children.length; k++) {
								tWr += (parseInt($el.find('.lslide').eq(k).width()) + settings.slideMargin);
								tI++;
								if (tWr >= (elSize + settings.slideMargin)) {
									break;
								}
							}
							var tItem = settings.autoWidth === true ? tI : settings.item;

							/**/
							if (tItem < $el.find('.clone.left').length) {
								for (var i = 0; i < $el.find('.clone.left').length - tItem; i++) {
									$children.eq(i).remove();
								}
							}
							if (tItem < $el.find('.clone.right').length) {
								for (var j = $children.length - 1; j > ($children.length - 1 - $el.find('.clone.right').length); j--) {
									scene--;
									$children.eq(j).remove();
								}
							}
							/**/
							for (var n = $el.find('.clone.right').length; n < tItem; n++) {
								$el.find('.lslide').eq(n).clone().removeClass('lslide').addClass('clone right').appendTo($el);
								scene++;
							}
							for (var m = $el.find('.lslide').length - $el.find('.clone.left').length; m > ($el.find('.lslide').length - tItem); m--) {
								$el.find('.lslide').eq(m - 1).clone().removeClass('lslide').addClass('clone left').prependTo($el);
							}
							$children = $el.children();
						} else {
							if ($children.hasClass('clone')) {
								$el.find('.clone').remove();
								$this.move($el, 0);
							}
						}
					};
					refresh.clone();
				}
				refresh.sSW = function () {
					length = $children.length;
					if (settings.rtl === true && settings.vertical === false) {
						gutter = 'margin-left';
					}
					if (settings.autoWidth === false) {
						$children.css(property, slideWidth + 'px');
					}
					$children.css(gutter, settings.slideMargin + 'px');
					w = refresh.calWidth(false);
					$el.css(property, w + 'px');
					if (settings.loop === true && settings.mode === 'slide') {
						if (on === false) {
							scene = $el.find('.clone.left').length;
						}
					}
				};
				refresh.calL = function () {
					$children = $el.children();
					length = $children.length;
				};
				if (this.doCss()) {
					$slide.addClass('usingCss');
				}
				refresh.calL();
				if (settings.mode === 'slide') {
					refresh.calSW();
					refresh.sSW();
					if (settings.loop === true) {
						slideValue = $this.slideValue();
						this.move($el, slideValue);
					}
					if (settings.vertical === false) {
						this.setHeight($el, false);
					}

				} else {
					this.setHeight($el, true);
					$el.addClass('lSFade');
					if (!this.doCss()) {
						$children.fadeOut(0);
						$children.eq(scene).fadeIn(0);
					}
				}
				if (settings.loop === true && settings.mode === 'slide') {
					$children.eq(scene).addClass('active');
				} else {
					$children.first().addClass('active');
				}
			},
			pager: function () {
				var $this = this;
				refresh.createPager = function () {
					thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
					var $children = $slide.find('.lslide');
					var length = $slide.find('.lslide').length;
					var i = 0,
						pagers = '',
						v = 0;
					for (i = 0; i < length; i++) {
						if (settings.mode === 'slide') {
							// calculate scene * slide value
							if (!settings.autoWidth) {
								v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
							} else {
								v += ((parseInt($children.eq(i).width()) + settings.slideMargin) * settings.slideMove);
							}
						}
						var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
						if (settings.gallery === true) {
							pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="#"><img src="' + thumb + '" /></a></li>';
						} else {
							pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
						}
						if (settings.mode === 'slide') {
							if ((v) >= w - elSize - settings.slideMargin) {
								i = i + 1;
								var minPgr = 2;
								if (settings.autoWidth) {
									pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
									minPgr = 1;
								}
								if (i < minPgr) {
									pagers = null;
									$slide.parent().addClass('noPager');
								} else {
									$slide.parent().removeClass('noPager');
								}
								break;
							}
						}
					}
					var $cSouter = $slide.parent();
					$cSouter.find('.lSPager').html(pagers);
					if (settings.gallery === true) {
						if (settings.vertical === true) {
							// set Gallery thumbnail width
							$cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
						}
						pagerWidth = (i * (settings.thumbMargin + thumbWidth)) + 0.5;
						$cSouter.find('.lSPager').css({
							property: pagerWidth + 'px',
							'transition-duration': settings.speed + 'ms'
						});
						if (settings.vertical === true) {
							$slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
						}
						$cSouter.find('.lSPager').css(property, pagerWidth + 'px');
					}
					var $pager = $cSouter.find('.lSPager').find('li');
					$pager.first().addClass('active');
					$pager.on('click', function () {
						if (settings.loop === true && settings.mode === 'slide') {
							scene = scene + ($pager.index(this) - $cSouter.find('.lSPager').find('li.active').index());
						} else {
							scene = $pager.index(this);
						}
						$el.mode(false);
						if (settings.gallery === true) {
							$this.slideThumb();
						}
						return false;
					});
				};
				if (settings.pager) {
					var cl = 'lSpg';
					if (settings.gallery) {
						cl = 'lSGallery';
					}
					$slide.after('<ul class="lSPager ' + cl + '"></ul>');
					var gMargin = (settings.vertical) ? 'margin-left' : 'margin-top';
					$slide.parent().find('.lSPager').css(gMargin, settings.galleryMargin + 'px');
					refresh.createPager();
				}

				setTimeout(function () {
					refresh.init();
				}, 0);
			},
			setHeight: function (ob, fade) {
				var obj = null,
					$this = this;
				if (settings.loop) {
					obj = ob.children('.lslide ').first();
				} else {
					obj = ob.children().first();
				}
				var setCss = function () {
					var tH = obj.outerHeight(),
						tP = 0,
						tHT = tH;
					if (fade) {
						tH = 0;
						tP = ((tHT) * 100) / elSize;
					}
					ob.css({
						'height': tH + 'px',
						'padding-bottom': tP + '%'
					});
				};
				setCss();
				if (obj.find('img').length) {
					if ( obj.find('img')[0].complete) {
						setCss();
						if (!interval) {
							$this.auto();
						}
					}else{
						obj.find('img').on('load', function () {
							setTimeout(function () {
								setCss();
								if (!interval) {
									$this.auto();
								}
							}, 100);
						});
					}
				}else{
					if (!interval) {
						$this.auto();
					}
				}
			},
			active: function (ob, t) {
				if (this.doCss() && settings.mode === 'fade') {
					$slide.addClass('on');
				}
				var sc = 0;
				if (scene * settings.slideMove < length) {
					ob.removeClass('active');
					if (!this.doCss() && settings.mode === 'fade' && t === false) {
						ob.fadeOut(settings.speed);
					}
					if (t === true) {
						sc = scene;
					} else {
						sc = scene * settings.slideMove;
					}
					//t === true ? sc = scene : sc = scene * settings.slideMove;
					var l, nl;
					if (t === true) {
						l = ob.length;
						nl = l - 1;
						if (sc + 1 >= l) {
							sc = nl;
						}
					}
					if (settings.loop === true && settings.mode === 'slide') {
						//t === true ? sc = scene - $el.find('.clone.left').length : sc = scene * settings.slideMove;
						if (t === true) {
							sc = scene - $el.find('.clone.left').length;
						} else {
							sc = scene * settings.slideMove;
						}
						if (t === true) {
							l = ob.length;
							nl = l - 1;
							if (sc + 1 === l) {
								sc = nl;
							} else if (sc + 1 > l) {
								sc = 0;
							}
						}
					}

					if (!this.doCss() && settings.mode === 'fade' && t === false) {
						ob.eq(sc).fadeIn(settings.speed);
					}
					ob.eq(sc).addClass('active');
				} else {
					ob.removeClass('active');
					ob.eq(ob.length - 1).addClass('active');
					if (!this.doCss() && settings.mode === 'fade' && t === false) {
						ob.fadeOut(settings.speed);
						ob.eq(sc).fadeIn(settings.speed);
					}
				}
			},
			move: function (ob, v) {
				if (settings.rtl === true) {
					v = -v;
				}
				if (this.doCss()) {
					if (settings.vertical === true) {
						ob.css({
							'transform': 'translate3d(0px, ' + (-v) + 'px, 0px)',
							'-webkit-transform': 'translate3d(0px, ' + (-v) + 'px, 0px)'
						});
					} else {
						ob.css({
							'transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
							'-webkit-transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
						});
					}
				} else {
					if (settings.vertical === true) {
						ob.css('position', 'relative').animate({
							top: -v + 'px'
						}, settings.speed, settings.easing);
					} else {
						ob.css('position', 'relative').animate({
							left: -v + 'px'
						}, settings.speed, settings.easing);
					}
				}
				var $thumb = $slide.parent().find('.lSPager').find('li');
				this.active($thumb, true);
			},
			fade: function () {
				this.active($children, false);
				var $thumb = $slide.parent().find('.lSPager').find('li');
				this.active($thumb, true);
			},
			slide: function () {
				var $this = this;
				refresh.calSlide = function () {
					if (w > elSize) {
						slideValue = $this.slideValue();
						$this.active($children, false);
						if ((slideValue) > w - elSize - settings.slideMargin) {
							slideValue = w - elSize - settings.slideMargin;
						} else if (slideValue < 0) {
							slideValue = 0;
						}
						$this.move($el, slideValue);
						if (settings.loop === true && settings.mode === 'slide') {
							if (scene >= (length - ($el.find('.clone.left').length / settings.slideMove))) {
								$this.resetSlide($el.find('.clone.left').length);
							}
							if (scene === 0) {
								$this.resetSlide($slide.find('.lslide').length);
							}
						}
					}
				};
				refresh.calSlide();
			},
			resetSlide: function (s) {
				var $this = this;
				$slide.find('.lSAction a').addClass('disabled');
				setTimeout(function () {
					scene = s;
					$slide.css('transition-duration', '0ms');
					slideValue = $this.slideValue();
					$this.active($children, false);
					plugin.move($el, slideValue);
					setTimeout(function () {
						$slide.css('transition-duration', settings.speed + 'ms');
						$slide.find('.lSAction a').removeClass('disabled');
					}, 50);
				}, settings.speed + 100);
			},
			slideValue: function () {
				var _sV = 0;
				if (settings.autoWidth === false) {
					_sV = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
				} else {
					_sV = 0;
					for (var i = 0; i < scene; i++) {
						_sV += (parseInt($children.eq(i).width()) + settings.slideMargin);
					}
				}
				return _sV;
			},
			slideThumb: function () {
				var position;
				switch (settings.currentPagerPosition) {
					case 'left':
						position = 0;
						break;
					case 'middle':
						position = (elSize / 2) - (thumbWidth / 2);
						break;
					case 'right':
						position = elSize - thumbWidth;
				}
				var sc = scene - $el.find('.clone.left').length;
				var $pager = $slide.parent().find('.lSPager');
				if (settings.mode === 'slide' && settings.loop === true) {
					if (sc >= $pager.children().length) {
						sc = 0;
					} else if (sc < 0) {
						sc = $pager.children().length;
					}
				}
				var thumbSlide = sc * ((thumbWidth + settings.thumbMargin)) - (position);
				if ((thumbSlide + elSize) > pagerWidth) {
					thumbSlide = pagerWidth - elSize - settings.thumbMargin;
				}
				if (thumbSlide < 0) {
					thumbSlide = 0;
				}
				this.move($pager, thumbSlide);
			},
			auto: function () {
				if (settings.auto) {
					clearInterval(interval);
					interval = setInterval(function () {
						$el.goToNextSlide();
					}, settings.pause);
				}
			},
			pauseOnHover: function(){
				var $this = this;
				if (settings.auto && settings.pauseOnHover) {
					$slide.on('mouseenter', function(){
						$(this).addClass('ls-hover');
						$el.pause();
						settings.auto = true;
					});
					$slide.on('mouseleave',function(){
						$(this).removeClass('ls-hover');
						if (!$slide.find('.lightSlider').hasClass('lsGrabbing')) {
							$this.auto();
						}
					});
				}
			},
			touchMove: function (endCoords, startCoords) {
				$slide.css('transition-duration', '0ms');
				if (settings.mode === 'slide') {
					var distance = endCoords - startCoords;
					var swipeVal = slideValue - distance;
					if ((swipeVal) >= w - elSize - settings.slideMargin) {
						if (settings.freeMove === false) {
							swipeVal = w - elSize - settings.slideMargin;
						} else {
							var swipeValT = w - elSize - settings.slideMargin;
							swipeVal = swipeValT + ((swipeVal - swipeValT) / 5);

						}
					} else if (swipeVal < 0) {
						if (settings.freeMove === false) {
							swipeVal = 0;
						} else {
							swipeVal = swipeVal / 5;
						}
					}
					this.move($el, swipeVal);
				}
			},

			touchEnd: function (distance) {
				$slide.css('transition-duration', settings.speed + 'ms');
				if (settings.mode === 'slide') {
					var mxVal = false;
					var _next = true;
					slideValue = slideValue - distance;
					if ((slideValue) > w - elSize - settings.slideMargin) {
						slideValue = w - elSize - settings.slideMargin;
						if (settings.autoWidth === false) {
							mxVal = true;
						}
					} else if (slideValue < 0) {
						slideValue = 0;
					}
					var gC = function (next) {
						var ad = 0;
						if (!mxVal) {
							if (next) {
								ad = 1;
							}
						}
						if (!settings.autoWidth) {
							var num = slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove);
							scene = parseInt(num) + ad;
							if (slideValue >= (w - elSize - settings.slideMargin)) {
								if (num % 1 !== 0) {
									scene++;
								}
							}
						} else {
							var tW = 0;
							for (var i = 0; i < $children.length; i++) {
								tW += (parseInt($children.eq(i).width()) + settings.slideMargin);
								scene = i + ad;
								if (tW >= slideValue) {
									break;
								}
							}
						}
					};
					if (distance >= settings.swipeThreshold) {
						gC(false);
						_next = false;
					} else if (distance <= -settings.swipeThreshold) {
						gC(true);
						_next = false;
					}
					$el.mode(_next);
					this.slideThumb();
				} else {
					if (distance >= settings.swipeThreshold) {
						$el.goToPrevSlide();
					} else if (distance <= -settings.swipeThreshold) {
						$el.goToNextSlide();
					}
				}
			},



			enableDrag: function () {
				var $this = this;
				if (!isTouch) {
					var startCoords = 0,
						endCoords = 0,
						isDraging = false;
					$slide.find('.lightSlider').addClass('lsGrab');
					$slide.on('mousedown', function (e) {
						if (w < elSize) {
							if (w !== 0) {
								return false;
							}
						}
						if ($(e.target).attr('class') !== ('lSPrev') && $(e.target).attr('class') !== ('lSNext')) {
							startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
							isDraging = true;
							if (e.preventDefault) {
								e.preventDefault();
							} else {
								e.returnValue = false;
							}
							// ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
							$slide.scrollLeft += 1;
							$slide.scrollLeft -= 1;
							// *
							$slide.find('.lightSlider').removeClass('lsGrab').addClass('lsGrabbing');
							clearInterval(interval);
						}
					});
					$(window).on('mousemove', function (e) {
						if (isDraging) {
							endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
							$this.touchMove(endCoords, startCoords);
						}
					});
					$(window).on('mouseup', function (e) {
						if (isDraging) {
							$slide.find('.lightSlider').removeClass('lsGrabbing').addClass('lsGrab');
							isDraging = false;
							endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
							var distance = endCoords - startCoords;
							if (Math.abs(distance) >= settings.swipeThreshold) {
								$(window).on('click.ls', function (e) {
									if (e.preventDefault) {
										e.preventDefault();
									} else {
										e.returnValue = false;
									}
									e.stopImmediatePropagation();
									e.stopPropagation();
									$(window).off('click.ls');
								});
							}

							$this.touchEnd(distance);

						}
					});
				}
			},




			enableTouch: function () {
				var $this = this;
				if (isTouch) {
					var startCoords = {},
						endCoords = {};
					$slide.on('touchstart', function (e) {
						endCoords = e.originalEvent.targetTouches[0];
						startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
						startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
						clearInterval(interval);
					});
					$slide.on('touchmove', function (e) {
						if (w < elSize) {
							if (w !== 0) {
								return false;
							}
						}
						var orig = e.originalEvent;
						endCoords = orig.targetTouches[0];
						var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
						var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
						if (settings.vertical === true) {
							if ((yMovement * 3) > xMovement) {
								e.preventDefault();
							}
							$this.touchMove(endCoords.pageY, startCoords.pageY);
						} else {
							if ((xMovement * 3) > yMovement) {
								e.preventDefault();
							}
							$this.touchMove(endCoords.pageX, startCoords.pageX);
						}

					});
					$slide.on('touchend', function () {
						if (w < elSize) {
							if (w !== 0) {
								return false;
							}
						}
						var distance;
						if (settings.vertical === true) {
							distance = endCoords.pageY - startCoords.pageY;
						} else {
							distance = endCoords.pageX - startCoords.pageX;
						}
						$this.touchEnd(distance);
					});
				}
			},
			build: function () {
				var $this = this;
				$this.initialStyle();
				if (this.doCss()) {

					if (settings.enableTouch === true) {
						$this.enableTouch();
					}
					if (settings.enableDrag === true) {
						$this.enableDrag();
					}
				}

				$(window).on('focus', function(){
					$this.auto();
				});

				$(window).on('blur', function(){
					clearInterval(interval);
				});

				$this.pager();
				$this.pauseOnHover();
				$this.controls();
				$this.keyPress();
			}
		};
		plugin.build();
		refresh.init = function () {
			refresh.chbreakpoint();
			if (settings.vertical === true) {
				if (settings.item > 1) {
					elSize = settings.verticalHeight;
				} else {
					elSize = $children.outerHeight();
				}
				$slide.css('height', elSize + 'px');
			} else {
				elSize = $slide.outerWidth();
			}
			if (settings.loop === true && settings.mode === 'slide') {
				refresh.clone();
			}
			refresh.calL();
			if (settings.mode === 'slide') {
				$el.removeClass('lSSlide');
			}
			if (settings.mode === 'slide') {
				refresh.calSW();
				refresh.sSW();
			}
			setTimeout(function () {
				if (settings.mode === 'slide') {
					$el.addClass('lSSlide');
				}
			}, 1000);
			if (settings.pager) {
				refresh.createPager();
			}
			if (settings.adaptiveHeight === true && settings.vertical === false) {
				$el.css('height', $children.eq(scene).outerHeight(true));
			}
			if (settings.adaptiveHeight === false) {
				if (settings.mode === 'slide') {
					if (settings.vertical === false) {
						plugin.setHeight($el, false);
					}else{
						plugin.auto();
					}
				} else {
					plugin.setHeight($el, true);
				}
			}
			if (settings.gallery === true) {
				plugin.slideThumb();
			}
			if (settings.mode === 'slide') {
				plugin.slide();
			}
			if (settings.autoWidth === false) {
				if ($children.length <= settings.item) {
					$slide.find('.lSAction').hide();
				} else {
					$slide.find('.lSAction').show();
				}
			} else {
				if ((refresh.calWidth(false) < elSize) && (w !== 0)) {
					$slide.find('.lSAction').hide();
				} else {
					$slide.find('.lSAction').show();
				}
			}
		};
		$el.goToPrevSlide = function () {
			if (scene > 0) {
				settings.onBeforePrevSlide.call(this, $el, scene);
				scene--;
				$el.mode(false);
				if (settings.gallery === true) {
					plugin.slideThumb();
				}
			} else {
				if (settings.loop === true) {
					settings.onBeforePrevSlide.call(this, $el, scene);
					if (settings.mode === 'fade') {
						var l = (length - 1);
						scene = parseInt(l / settings.slideMove);
					}
					$el.mode(false);
					if (settings.gallery === true) {
						plugin.slideThumb();
					}
				} else if (settings.slideEndAnimation === true) {
					$el.addClass('leftEnd');
					setTimeout(function () {
						$el.removeClass('leftEnd');
					}, 400);
				}
			}
		};
		$el.goToNextSlide = function () {
			var nextI = true;
			if (settings.mode === 'slide') {
				var _slideValue = plugin.slideValue();
				nextI = _slideValue < w - elSize - settings.slideMargin;
			}
			if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
				settings.onBeforeNextSlide.call(this, $el, scene);
				scene++;
				$el.mode(false);
				if (settings.gallery === true) {
					plugin.slideThumb();
				}
			} else {
				if (settings.loop === true) {
					settings.onBeforeNextSlide.call(this, $el, scene);
					scene = 0;
					$el.mode(false);
					if (settings.gallery === true) {
						plugin.slideThumb();
					}
				} else if (settings.slideEndAnimation === true) {
					$el.addClass('rightEnd');
					setTimeout(function () {
						$el.removeClass('rightEnd');
					}, 400);
				}
			}
		};
		$el.mode = function (_touch) {
			if (settings.adaptiveHeight === true && settings.vertical === false) {
				$el.css('height', $children.eq(scene).outerHeight(true));
			}
			if (on === false) {
				if (settings.mode === 'slide') {
					if (plugin.doCss()) {
						$el.addClass('lSSlide');
						if (settings.speed !== '') {
							$slide.css('transition-duration', settings.speed + 'ms');
						}
						if (settings.cssEasing !== '') {
							$slide.css('transition-timing-function', settings.cssEasing);
						}
					}
				} else {
					if (plugin.doCss()) {
						if (settings.speed !== '') {
							$el.css('transition-duration', settings.speed + 'ms');
						}
						if (settings.cssEasing !== '') {
							$el.css('transition-timing-function', settings.cssEasing);
						}
					}
				}
			}
			if (!_touch) {
				settings.onBeforeSlide.call(this, $el, scene);
			}
			if (settings.mode === 'slide') {
				plugin.slide();
			} else {
				plugin.fade();
			}
			if (!$slide.hasClass('ls-hover')) {
				plugin.auto();
			}
			setTimeout(function () {
				if (!_touch) {
					settings.onAfterSlide.call(this, $el, scene);
				}
			}, settings.speed);
			on = true;
		};
		$el.play = function () {
			$el.goToNextSlide();
			settings.auto = true;
			plugin.auto();
		};
		$el.pause = function () {
			settings.auto = false;
			clearInterval(interval);
		};
		$el.refresh = function () {
			refresh.init();
		};
		$el.getCurrentSlideCount = function () {
			var sc = scene;
			if (settings.loop) {
				var ln = $slide.find('.lslide').length,
					cl = $el.find('.clone.left').length;
				if (scene <= cl - 1) {
					sc = ln + (scene - cl);
				} else if (scene >= (ln + cl)) {
					sc = scene - ln - cl;
				} else {
					sc = scene - cl;
				}
			}
			return sc + 1;
		};
		$el.getTotalSlideCount = function () {
			return $slide.find('.lslide').length;
		};
		$el.goToSlide = function (s) {
			if (settings.loop) {
				scene = (s + $el.find('.clone.left').length - 1);
			} else {
				scene = s;
			}
			$el.mode(false);
			if (settings.gallery === true) {
				plugin.slideThumb();
			}
		};
		$el.destroy = function () {
			if ($el.lightSlider) {
				$el.goToPrevSlide = function(){};
				$el.goToNextSlide = function(){};
				$el.mode = function(){};
				$el.play = function(){};
				$el.pause = function(){};
				$el.refresh = function(){};
				$el.getCurrentSlideCount = function(){};
				$el.getTotalSlideCount = function(){};
				$el.goToSlide = function(){};
				$el.lightSlider = null;
				refresh = {
					init : function(){}
				};
				$el.parent().parent().find('.lSAction, .lSPager').remove();
				$el.removeClass('lightSlider lSFade lSSlide lsGrab lsGrabbing leftEnd right').removeAttr('style').unwrap().unwrap();
				$el.children().removeAttr('style');
				$children.removeClass('lslide active');
				$el.find('.clone').remove();
				$children = null;
				interval = null;
				on = false;
				scene = 0;
			}

		};
		setTimeout(function () {
			settings.onSliderLoad.call(this, $el);
		}, 10);
		$(window).on('resize orientationchange', function (e) {
			setTimeout(function () {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				refresh.init();
			}, 200);
		});
		return this;
	};
}(jQuery));
/*
 * Lightcase - jQuery Plugin
 * The smart and flexible Lightbox Plugin.
 *
 * @author		Cornel Boppart <cornel@bopp-art.com>
 * @copyright	Author
 *
 * @version		2.3.6 (20/12/2016)
 */

;(function ($) {

	'use strict';

	var _self = {
		cache: {},

		support: {},

		objects: {},

		/**
		 * Initializes the plugin
		 *
		 * @param	{object}	options
		 * @return	{object}
		 */
		init: function (options) {
			return this.each(function () {
				$(this).unbind('click.lightcase').bind('click.lightcase', function (event) {
					event.preventDefault();
					$(this).lightcase('start', options);
				});
			});
		},

		/**
		 * Starts the plugin
		 *
		 * @param	{object}	options
		 * @return	{void}
		 */
		start: function (options) {
			_self.origin = lightcase.origin = this;

			_self.settings = lightcase.settings = $.extend(true, {
					idPrefix: 'lightcase-',
					classPrefix: 'lightcase-',
					attrPrefix: 'lc-',
					transition: 'elastic',
					transitionIn: null,
					transitionOut: null,
					cssTransitions: true,
					speedIn: 250,
					speedOut: 250,
					maxWidth: 800,
					maxHeight: 500,
					forceWidth: false,
					forceHeight: false,
					liveResize: true,
					fullScreenModeForMobile: true,
					mobileMatchExpression: /(iphone|ipod|ipad|android|blackberry|symbian)/,
					disableShrink: false,
					shrinkFactor: .75,
					overlayOpacity: .9,
					slideshow: false,
					slideshowAutoStart: true,
					timeout: 5000,
					swipe: true,
					useKeys: true,
					useCategories: true,
					navigateEndless: true,
					closeOnOverlayClick: true,
					title: null,
					caption: null,
					showTitle: true,
					showCaption: true,
					showSequenceInfo: true,
					inline: {
						width: 'auto',
						height: 'auto'
					},
					ajax: {
						width: 'auto',
						height: 'auto',
						type: 'get',
						dataType: 'html',
						data: {}
					},
					iframe: {
						width: 800,
						height: 500,
						frameborder: 0
					},
					flash: {
						width: 400,
						height: 205,
						wmode: 'transparent'
					},
					video: {
						width: 400,
						height: 225,
						poster: '',
						preload: 'auto',
						controls: true,
						autobuffer: true,
						autoplay: true,
						loop: false
					},
					attr: 'data-rel',
					href: null,
					type: null,
					typeMapping: {
						'image': 'jpg,jpeg,gif,png,bmp',
						'flash': 'swf',
						'video': 'mp4,mov,ogv,ogg,webm',
						'iframe': 'html,php',
						'ajax': 'json,txt',
						'inline': '#'
					},
					errorMessage: function () {
						return '<p class="' + _self.settings.classPrefix + 'error">' + _self.settings.labels['errorMessage'] + '</p>';
					},
					labels: {
						'errorMessage': 'Source could not be found...',
						'sequenceInfo.of': ' of ',
						'close': 'Close',
						'navigator.prev': 'Prev',
						'navigator.next': 'Next',
						'navigator.play': 'Play',
						'navigator.pause': 'Pause'
					},
					markup: function () {
						$('body').append(
							_self.objects.overlay = $('<div id="' + _self.settings.idPrefix + 'overlay"></div>'),
							_self.objects.loading = $('<div id="' + _self.settings.idPrefix + 'loading" class="' + _self.settings.classPrefix + 'icon-spin"></div>'),
							_self.objects.case = $('<div id="' + _self.settings.idPrefix + 'case" aria-hidden="true" role="dialog"></div>')
						);
						_self.objects.case.after(
							_self.objects.nav = $('<div id="' + _self.settings.idPrefix + 'nav"></div>')
						);
						_self.objects.nav.append(
							_self.objects.close = $('<a href="#" class="' + _self.settings.classPrefix + 'icon-close"><span>' + _self.settings.labels['close'] + '</span></a>'),
							_self.objects.prev = $('<a href="#" class="' + _self.settings.classPrefix + 'icon-prev"><span>' + _self.settings.labels['navigator.prev'] + '</span></a>').hide(),
							_self.objects.next = $('<a href="#" class="' + _self.settings.classPrefix + 'icon-next"><span>' + _self.settings.labels['navigator.next'] + '</span></a>').hide(),
							_self.objects.play = $('<a href="#" class="' + _self.settings.classPrefix + 'icon-play"><span>' + _self.settings.labels['navigator.play'] + '</span></a>').hide(),
							_self.objects.pause = $('<a href="#" class="' + _self.settings.classPrefix + 'icon-pause"><span>' + _self.settings.labels['navigator.pause'] + '</span></a>').hide()
						);
						_self.objects.case.append(
							_self.objects.content = $('<div id="' + _self.settings.idPrefix + 'content"></div>'),
							_self.objects.info = $('<div id="' + _self.settings.idPrefix + 'info"></div>')
						);
						_self.objects.content.append(
							_self.objects.contentInner = $('<div class="' + _self.settings.classPrefix + 'contentInner"></div>')
						);
						_self.objects.info.append(
							_self.objects.sequenceInfo = $('<div id="' + _self.settings.idPrefix + 'sequenceInfo"></div>'),
							_self.objects.title = $('<h4 id="' + _self.settings.idPrefix + 'title"></h4>'),
							_self.objects.caption = $('<p id="' + _self.settings.idPrefix + 'caption"></p>')
						);
					},
					onInit: {},
					onStart: {},
					onFinish: {},
					onClose: {},
					onCleanup: {}
				},
				options,
				// Load options from data-lc-options attribute
				_self.origin.data ? _self.origin.data('lc-options') : {});

			// Call onInit hook functions
			_self._callHooks(_self.settings.onInit);

			_self.objectData = _self._setObjectData(this);

			_self._cacheScrollPosition();
			_self._watchScrollInteraction();

			_self._addElements();
			_self._open();

			_self.dimensions = _self.getViewportDimensions();
		},

		/**
		 * Getter method for objects
		 *
		 * @param	{string}	name
		 * @return	{object}
		 */
		get: function (name) {
			return _self.objects[name];
		},

		/**
		 * Getter method for objectData
		 *
		 * @return	{object}
		 */
		getObjectData: function () {
			return _self.objectData;
		},

		/**
		 * Sets the object data
		 *
		 * @param	{object}	object
		 * @return	{object}	objectData
		 */
		_setObjectData: function (object) {
			var $object = $(object),
				objectData = {
					title: _self.settings.title || $object.attr(_self._prefixAttributeName('title')) || $object.attr('title'),
					caption: _self.settings.caption || $object.attr(_self._prefixAttributeName('caption')) || $object.children('img').attr('alt'),
					url: _self._determineUrl(),
					requestType: _self.settings.ajax.type,
					requestData: _self.settings.ajax.data,
					requestDataType: _self.settings.ajax.dataType,
					rel: $object.attr(_self._determineAttributeSelector()),
					type: _self.settings.type || _self._verifyDataType(_self._determineUrl()),
					isPartOfSequence: _self._isPartOfSequence($object.attr(_self.settings.attr), ':'),
					isPartOfSequenceWithSlideshow: _self._isPartOfSequence($object.attr(_self.settings.attr), ':slideshow'),
					currentIndex: $(_self._determineAttributeSelector()).index($object),
					sequenceLength: $(_self._determineAttributeSelector()).length
				};

			// Add sequence info to objectData
			objectData.sequenceInfo = (objectData.currentIndex + 1) + _self.settings.labels['sequenceInfo.of'] + objectData.sequenceLength;

			// Add next/prev index
			objectData.prevIndex = objectData.currentIndex - 1;
			objectData.nextIndex = objectData.currentIndex + 1;

			return objectData;
		},

		/**
		 * Prefixes a data attribute name with defined name from 'settings.attrPrefix'
		 * to ensure more uniqueness for all lightcase related/used attributes.
		 *
		 * @param	{string}	name
		 * @return	{string}
		 */
		_prefixAttributeName: function (name) {
			return 'data-' + _self.settings.attrPrefix + name;
		},

		/**
		 * Determines the link target considering 'settings.href' and data attributes
		 * but also with a fallback to the default 'href' value.
		 *
		 * @return	{string}
		 */
		_determineLinkTarget: function () {
			return _self.settings.href || $(_self.origin).attr(_self._prefixAttributeName('href')) || $(_self.origin).attr('href');
		},

		/**
		 * Determines the attribute selector to use, depending on
		 * whether categorized collections are beeing used or not.
		 *
		 * @return	{string}	selector
		 */
		_determineAttributeSelector: function () {
			var	$origin = $(_self.origin),
				selector = '';

			if (typeof _self.cache.selector !== 'undefined') {
				selector = _self.cache.selector;
			} else if (_self.settings.useCategories === true && $origin.attr(_self._prefixAttributeName('categories'))) {
				var	categories = $origin.attr(_self._prefixAttributeName('categories')).split(' ');

				$.each(categories, function (index, category) {
					if (index > 0) {
						selector += ',';
					}
					selector += '[' + _self._prefixAttributeName('categories') + '~="' + category + '"]';
				});
			} else {
				selector = '[' + _self.settings.attr + '="' + $origin.attr(_self.settings.attr) + '"]';
			}

			_self.cache.selector = selector;

			return selector;
		},

		/**
		 * Determines the correct resource according to the
		 * current viewport and density.
		 *
		 * @return	{string}	url
		 */
		_determineUrl: function () {
			var dataUrl = _self._verifyDataUrl(_self._determineLinkTarget()),
				width = 0,
				density = 0,
				url;

			$.each(dataUrl, function (index, src) {
				if (
					// Check density
				_self._devicePixelRatio() >= src.density &&
				src.density >= density &&
					// Check viewport width
				_self._matchMedia()('screen and (min-width:' + src.width + 'px)').matches &&
				src.width >= width
				) {
					width = src.width;
					density = src.density;
					url = src.url;
				}
			});

			return url;
		},

		/**
		 * Normalizes an url and returns information about the resource path,
		 * the viewport width as well as density if defined.
		 *
		 * @param	{string}	url	Path to resource in format of an url or srcset
		 * @return	{object}
		 */
		_normalizeUrl: function (url) {
			var srcExp = /^\d+$/;

			return url.split(',').map(function (str) {
				var src = {
					width: 0,
					density: 0
				};

				str.trim().split(/\s+/).forEach(function (url, i) {
					if (i === 0) {
						return src.url = url;
					}

					var value = url.substring(0, url.length - 1),
						lastChar = url[url.length - 1],
						intVal = parseInt(value, 10),
						floatVal = parseFloat(value);
					if (lastChar === 'w' && srcExp.test(value)) {
						src.width = intVal;
					} else if (lastChar === 'h' && srcExp.test(value)) {
						src.height = intVal;
					} else if (lastChar === 'x' && !isNaN(floatVal)) {
						src.density = floatVal;
					}
				});

				return src;
			});
		},

		/**
		 * Verifies if the link is part of a sequence
		 *
		 * @param	{string}	rel
		 * @param	{string}	expression
		 * @return	{boolean}
		 */
		_isPartOfSequence: function (rel, expression) {
			var getSimilarLinks = $('[' + _self.settings.attr + '="' + rel + '"]'),
				regexp = new RegExp(expression);

			return (regexp.test(rel) && getSimilarLinks.length > 1);
		},

		/**
		 * Verifies if the slideshow should be enabled
		 *
		 * @return	{boolean}
		 */
		isSlideshowEnabled: function () {
			return (_self.objectData.isPartOfSequence && (_self.settings.slideshow === true || _self.objectData.isPartOfSequenceWithSlideshow === true));
		},

		/**
		 * Loads the new content to show
		 *
		 * @return	{void}
		 */
		_loadContent: function () {
			if (_self.cache.originalObject) {
				_self._restoreObject();
			}

			_self._createObject();
		},

		/**
		 * Creates a new object
		 *
		 * @return	{void}
		 */
		_createObject: function () {
			var $object;

			// Create object
			switch (_self.objectData.type) {
				case 'image':
					$object = $(new Image());
					$object.attr({
						// The time expression is required to prevent the binding of an image load
						'src': _self.objectData.url,
						'alt': _self.objectData.title
					});
					break;
				case 'inline':
					$object = $('<div class="' + _self.settings.classPrefix + 'inlineWrap"></div>');
					$object.html(_self._cloneObject($(_self.objectData.url)));

					// Add custom attributes from _self.settings
					$.each(_self.settings.inline, function (name, value) {
						$object.attr(_self._prefixAttributeName(name), value);
					});
					break;
				case 'ajax':
					$object = $('<div class="' + _self.settings.classPrefix + 'inlineWrap"></div>');

					// Add custom attributes from _self.settings
					$.each(_self.settings.ajax, function (name, value) {
						if (name !== 'data') {
							$object.attr(_self._prefixAttributeName(name), value);
						}
					});
					break;
				case 'flash':
					$object = $('<embed src="' + _self.objectData.url + '" type="application/x-shockwave-flash"></embed>');

					// Add custom attributes from _self.settings
					$.each(_self.settings.flash, function (name, value) {
						$object.attr(name, value);
					});
					break;
				case 'video':
					$object = $('<video></video>');
					$object.attr('src', _self.objectData.url);

					// Add custom attributes from _self.settings
					$.each(_self.settings.video, function (name, value) {
						$object.attr(name, value);
					});
					break;
				default :
					$object = $('<iframe></iframe>');
					$object.attr({
						'src': _self.objectData.url
					});

					// Add custom attributes from _self.settings
					$.each(_self.settings.iframe, function (name, value) {
						$object.attr(name, value);
					});
					break;
			}

			_self._addObject($object);
			_self._loadObject($object);
		},

		/**
		 * Adds the new object to the markup
		 *
		 * @param	{object}	$object
		 * @return	{void}
		 */
		_addObject: function ($object) {
			// Add object to content holder
			_self.objects.contentInner.html($object);

			// Start loading
			_self._loading('start');

			// Call onStart hook functions
			_self._callHooks(_self.settings.onStart);

			// Add sequenceInfo to the content holder or hide if its empty
			if (_self.settings.showSequenceInfo === true && _self.objectData.isPartOfSequence) {
				_self.objects.sequenceInfo.html(_self.objectData.sequenceInfo);
				_self.objects.sequenceInfo.show();
			} else {
				_self.objects.sequenceInfo.empty();
				_self.objects.sequenceInfo.hide();
			}
			// Add title to the content holder or hide if its empty
			if (_self.settings.showTitle === true && _self.objectData.title !== undefined && _self.objectData.title !== '') {
				_self.objects.title.html(_self.objectData.title);
				_self.objects.title.show();
			} else {
				_self.objects.title.empty();
				_self.objects.title.hide();
			}
			// Add caption to the content holder or hide if its empty
			if (_self.settings.showCaption === true && _self.objectData.caption !== undefined && _self.objectData.caption !== '') {
				_self.objects.caption.html(_self.objectData.caption);
				_self.objects.caption.show();
			} else {
				_self.objects.caption.empty();
				_self.objects.caption.hide();
			}
		},

		/**
		 * Loads the new object
		 *
		 * @param	{object}	$object
		 * @return	{void}
		 */
		_loadObject: function ($object) {
			// Load the object
			switch (_self.objectData.type) {
				case 'inline':
					if ($(_self.objectData.url)) {
						_self._showContent($object);
					} else {
						_self.error();
					}
					break;
				case 'ajax':
					$.ajax(
						$.extend({}, _self.settings.ajax, {
							url: _self.objectData.url,
							type: _self.objectData.requestType,
							dataType: _self.objectData.requestDataType,
							data: _self.objectData.requestData,
							success: function (data, textStatus, jqXHR) {
								// Unserialize if data is transferred as json
								if (_self.objectData.requestDataType === 'json') {
									_self.objectData.data = data;
								} else {
									$object.html(data);
								}
								_self._showContent($object);
							},
							error: function (jqXHR, textStatus, errorThrown) {
								_self.error();
							}
						})
					);
					break;
				case 'flash':
					_self._showContent($object);
					break;
				case 'video':
					if (typeof($object.get(0).canPlayType) === 'function' || _self.objects.case.find('video').length === 0) {
						_self._showContent($object);
					} else {
						_self.error();
					}
					break;
				default:
					if (_self.objectData.url) {
						$object.on('load', function () {
							_self._showContent($object);
						});
						$object.on('error', function () {
							_self.error();
						});
					} else {
						_self.error();
					}
					break;
			}
		},

		/**
		 * Throws an error message if something went wrong
		 *
		 * @return	{void}
		 */
		error: function () {
			_self.objectData.type = 'error';
			var $object = $('<div class="' + _self.settings.classPrefix + 'inlineWrap"></div>');

			$object.html(_self.settings.errorMessage);
			_self.objects.contentInner.html($object);

			_self._showContent(_self.objects.contentInner);
		},

		/**
		 * Calculates the dimensions to fit content
		 *
		 * @param	{object}	$object
		 * @return	{void}
		 */
		_calculateDimensions: function ($object) {
			_self._cleanupDimensions();

			// Set default dimensions
			var dimensions = {
				objectWidth: $object.attr('width') ? $object.attr('width') : $object.attr(_self._prefixAttributeName('width')),
				objectHeight: $object.attr('height') ? $object.attr('height') : $object.attr(_self._prefixAttributeName('height'))
			};

			if (!_self.settings.disableShrink) {
				// Add calculated maximum width/height to dimensions
				dimensions.maxWidth = parseInt(_self.dimensions.windowWidth * _self.settings.shrinkFactor);
				dimensions.maxHeight = parseInt(_self.dimensions.windowHeight * _self.settings.shrinkFactor);

				// If the auto calculated maxWidth/maxHeight greather than the userdefined one, use that.
				if (dimensions.maxWidth > _self.settings.maxWidth) {
					dimensions.maxWidth = _self.settings.maxWidth;
				}
				if (dimensions.maxHeight > _self.settings.maxHeight) {
					dimensions.maxHeight = _self.settings.maxHeight;
				}

				// Calculate the difference between screen width/height and image width/height
				dimensions.differenceWidthAsPercent = parseInt(100 / dimensions.maxWidth * dimensions.objectWidth);
				dimensions.differenceHeightAsPercent = parseInt(100 / dimensions.maxHeight * dimensions.objectHeight);

				switch (_self.objectData.type) {
					case 'image':
					case 'flash':
					case 'video':
						if (dimensions.differenceWidthAsPercent > 100 && dimensions.differenceWidthAsPercent > dimensions.differenceHeightAsPercent) {
							dimensions.objectWidth = dimensions.maxWidth;
							dimensions.objectHeight = parseInt(dimensions.objectHeight / dimensions.differenceWidthAsPercent * 100);
						}
						if (dimensions.differenceHeightAsPercent > 100 && dimensions.differenceHeightAsPercent > dimensions.differenceWidthAsPercent) {
							dimensions.objectWidth = parseInt(dimensions.objectWidth / dimensions.differenceHeightAsPercent * 100);
							dimensions.objectHeight = dimensions.maxHeight;
						}
						if (dimensions.differenceHeightAsPercent > 100 && dimensions.differenceWidthAsPercent < dimensions.differenceHeightAsPercent) {
							dimensions.objectWidth = parseInt(dimensions.maxWidth / dimensions.differenceHeightAsPercent * dimensions.differenceWidthAsPercent);
							dimensions.objectHeight = dimensions.maxHeight;
						}
						break;
					case 'error':
						if (!isNaN(dimensions.objectWidth) && dimensions.objectWidth > dimensions.maxWidth) {
							dimensions.objectWidth = dimensions.maxWidth;
						}
						break;
					default:
						if ((isNaN(dimensions.objectWidth) || dimensions.objectWidth > dimensions.maxWidth) && !_self.settings.forceWidth) {
							dimensions.objectWidth = dimensions.maxWidth;
						}
						if (((isNaN(dimensions.objectHeight) && dimensions.objectHeight !== 'auto') || dimensions.objectHeight > dimensions.maxHeight) && !_self.settings.forceHeight) {
							dimensions.objectHeight = dimensions.maxHeight;
						}
						break;
				}
			}

			if (_self.settings.forceWidth) {
				dimensions.maxWidth = dimensions.objectWidth;
			} else if ($object.attr(_self._prefixAttributeName('max-width'))) {
				dimensions.maxWidth =  $object.attr(_self._prefixAttributeName('max-width'));
			}

			if (_self.settings.forceHeight) {
				dimensions.maxHeight = dimensions.objectHeight;
			} else if ($object.attr(_self._prefixAttributeName('max-height'))) {
				dimensions.maxHeight =  $object.attr(_self._prefixAttributeName('max-height'));
			}

			_self._adjustDimensions($object, dimensions);
		},

		/**
		 * Adjusts the dimensions
		 *
		 * @param	{object}	$object
		 * @param	{object}	dimensions
		 * @return	{void}
		 */
		_adjustDimensions: function ($object, dimensions) {
			// Adjust width and height
			$object.css({
				'width': dimensions.objectWidth,
				'height': dimensions.objectHeight,
				'max-width': dimensions.maxWidth,
				'max-height': dimensions.maxHeight
			});

			_self.objects.contentInner.css({
				'width': $object.outerWidth(),
				'height': $object.outerHeight(),
				'max-width': '100%'
			});

			_self.objects.case.css({
				'width': _self.objects.contentInner.outerWidth()
			});

			// Adjust margin
			_self.objects.case.css({
				'margin-top': parseInt(-(_self.objects.case.outerHeight() / 2)),
				'margin-left': parseInt(-(_self.objects.case.outerWidth() / 2))
			});
		},

		/**
		 * Handles the _loading
		 *
		 * @param	{string}	process
		 * @return	{void}
		 */
		_loading: function (process) {
			if (process === 'start') {
				_self.objects.case.addClass(_self.settings.classPrefix + 'loading');
				_self.objects.loading.show();
			} else if (process === 'end') {
				_self.objects.case.removeClass(_self.settings.classPrefix + 'loading');
				_self.objects.loading.hide();
			}
		},


		/**
		 * Gets the client screen dimensions
		 *
		 * @return	{object}	dimensions
		 */
		getViewportDimensions: function () {
			return {
				windowWidth: $(window).innerWidth(),
				windowHeight: $(window).innerHeight()
			};
		},

		/**
		 * Verifies the url
		 *
		 * @param	{string}	dataUrl
		 * @return	{object}	dataUrl	Clean url for processing content
		 */
		_verifyDataUrl: function (dataUrl) {
			if (!dataUrl || dataUrl === undefined || dataUrl === '') {
				return false;
			}

			if (dataUrl.indexOf('#') > -1) {
				dataUrl = dataUrl.split('#');
				dataUrl = '#' + dataUrl[dataUrl.length - 1];
			}

			return _self._normalizeUrl(dataUrl.toString());
		},

		/**
		 * Verifies the data type of the content to load
		 *
		 * @param	{string}			url
		 * @return	{string|boolean}	Array key if expression matched, else false
		 */
		_verifyDataType: function (url) {
			var typeMapping = _self.settings.typeMapping;

			// Early abort if dataUrl couldn't be verified
			if (!url) {
				return false;
			}

			// Verify the dataType of url according to typeMapping which
			// has been defined in settings.
			for (var key in typeMapping) {
				if (typeMapping.hasOwnProperty(key)) {
					var suffixArr = typeMapping[key].split(',');

					for (var i = 0; i < suffixArr.length; i++) {
						var suffix = suffixArr[i].toLowerCase(),
							regexp = new RegExp('\.(' + suffix + ')$', 'i'),
						// Verify only the last 5 characters of the string
							str = url.toLowerCase().split('?')[0].substr(-5);

						if (regexp.test(str) === true || (key === 'inline' && (url.indexOf(suffix) > -1))) {
							return key;
						}
					}
				}
			}

			// If no expression matched, return 'iframe'.
			return 'iframe';
		},

		/**
		 * Extends html markup with the essential tags
		 *
		 * @return	{void}
		 */
		_addElements: function () {
			if (typeof _self.objects.case !== 'undefined' && $('#' + _self.objects.case.attr('id')).length) {
				return;
			}

			_self.settings.markup();
		},

		/**
		 * Shows the loaded content
		 *
		 * @param	{object}	$object
		 * @return	{void}
		 */
		_showContent: function ($object) {
			// Add data attribute with the object type
			_self.objects.case.attr(_self._prefixAttributeName('type'), _self.objectData.type);

			_self.cache.object = $object;
			_self._calculateDimensions($object);

			// Call onFinish hook functions
			_self._callHooks(_self.settings.onFinish);

			switch (_self.settings.transitionIn) {
				case 'scrollTop':
				case 'scrollRight':
				case 'scrollBottom':
				case 'scrollLeft':
				case 'scrollHorizontal':
				case 'scrollVertical':
					_self.transition.scroll(_self.objects.case, 'in', _self.settings.speedIn);
					_self.transition.fade(_self.objects.contentInner, 'in', _self.settings.speedIn);
					break;
				case 'elastic':
					if (_self.objects.case.css('opacity') < 1) {
						_self.transition.zoom(_self.objects.case, 'in', _self.settings.speedIn);
						_self.transition.fade(_self.objects.contentInner, 'in', _self.settings.speedIn);
					}
				case 'fade':
				case 'fadeInline':
					_self.transition.fade(_self.objects.case, 'in', _self.settings.speedIn);
					_self.transition.fade(_self.objects.contentInner, 'in', _self.settings.speedIn);
					break;
				default:
					_self.transition.fade(_self.objects.case, 'in', 0);
					break;
			}

			// End loading.
			_self._loading('end');
			_self.isBusy = false;
		},

		/**
		 * Processes the content to show
		 *
		 * @return	{void}
		 */
		_processContent: function () {
			_self.isBusy = true;

			switch (_self.settings.transitionOut) {
				case 'scrollTop':
				case 'scrollRight':
				case 'scrollBottom':
				case 'scrollLeft':
				case 'scrollVertical':
				case 'scrollHorizontal':
					if (_self.objects.case.is(':hidden')) {
						_self.transition.fade(_self.objects.case, 'out', 0, 0, function () {
							_self._loadContent();
						});
						_self.transition.fade(_self.objects.contentInner, 'out', 0);
					} else {
						_self.transition.scroll(_self.objects.case, 'out', _self.settings.speedOut, function () {
							_self._loadContent();
						});
					}
					break;
				case 'fade':
					if (_self.objects.case.is(':hidden')) {
						_self.transition.fade(_self.objects.case, 'out', 0, 0, function () {
							_self._loadContent();
						});
					} else {
						_self.transition.fade(_self.objects.case, 'out', _self.settings.speedOut, 0, function () {
							_self._loadContent();
						});
					}
					break;
				case 'fadeInline':
				case 'elastic':
					if (_self.objects.case.is(':hidden')) {
						_self.transition.fade(_self.objects.case, 'out', 0, 0, function () {
							_self._loadContent();
						});
					} else {
						_self.transition.fade(_self.objects.contentInner, 'out', _self.settings.speedOut, 0, function () {
							_self._loadContent();
						});
					}
					break;
				default:
					_self.transition.fade(_self.objects.case, 'out', 0, 0, function () {
						_self._loadContent();
					});
					break;
			}
		},

		/**
		 * Handles events for gallery buttons
		 *
		 * @return	{void}
		 */
		_handleEvents: function () {
			_self._unbindEvents();

			_self.objects.nav.children().not(_self.objects.close).hide();

			// If slideshow is enabled, show play/pause and start timeout.
			if (_self.isSlideshowEnabled()) {
				// Only start the timeout if slideshow autostart is enabled and slideshow is not pausing
				if (
					(_self.settings.slideshowAutoStart === true || _self.isSlideshowStarted) &&
					!_self.objects.nav.hasClass(_self.settings.classPrefix + 'paused')
				) {
					_self._startTimeout();
				} else {
					_self._stopTimeout();
				}
			}

			if (_self.settings.liveResize) {
				_self._watchResizeInteraction();
			}

			_self.objects.close.click(function (event) {
				event.preventDefault();
				_self.close();
			});

			if (_self.settings.closeOnOverlayClick === true) {
				_self.objects.overlay.css('cursor', 'pointer').click(function (event) {
					event.preventDefault();

					_self.close();
				});
			}

			if (_self.settings.useKeys === true) {
				_self._addKeyEvents();
			}

			if (_self.objectData.isPartOfSequence) {
				_self.objects.nav.attr(_self._prefixAttributeName('ispartofsequence'), true);
				_self.objects.nav.data('items', _self._setNavigation());

				_self.objects.prev.click(function (event) {
					event.preventDefault();

					if (_self.settings.navigateEndless === true || !_self.item.isFirst()) {
						_self.objects.prev.unbind('click');
						_self.cache.action = 'prev';
						_self.objects.nav.data('items').prev.click();

						if (_self.isSlideshowEnabled()) {
							_self._stopTimeout();
						}
					}
				});

				_self.objects.next.click(function (event) {
					event.preventDefault();

					if (_self.settings.navigateEndless === true || !_self.item.isLast()) {
						_self.objects.next.unbind('click');
						_self.cache.action = 'next';
						_self.objects.nav.data('items').next.click();

						if (_self.isSlideshowEnabled()) {
							_self._stopTimeout();
						}
					}
				});

				if (_self.isSlideshowEnabled()) {
					_self.objects.play.click(function (event) {
						event.preventDefault();
						_self._startTimeout();
					});
					_self.objects.pause.click(function (event) {
						event.preventDefault();
						_self._stopTimeout();
					});
				}

				// Enable swiping if activated
				if (_self.settings.swipe === true) {
					if ($.isPlainObject($.event.special.swipeleft)) {
						_self.objects.case.on('swipeleft', function (event) {
							event.preventDefault();
							_self.objects.next.click();
							if (_self.isSlideshowEnabled()) {
								_self._stopTimeout();
							}
						});
					}
					if ($.isPlainObject($.event.special.swiperight)) {
						_self.objects.case.on('swiperight', function (event) {
							event.preventDefault();
							_self.objects.prev.click();
							if (_self.isSlideshowEnabled()) {
								_self._stopTimeout();
							}
						});
					}
				}
			}
		},

		/**
		 * Adds the key events
		 *
		 * @return	{void}
		 */
		_addKeyEvents: function () {
			$(document).bind('keyup.lightcase', function (event) {
				// Do nothing if lightcase is in process
				if (_self.isBusy) {
					return;
				}

				switch (event.keyCode) {
					// Escape key
					case 27:
						_self.objects.close.click();
						break;
					// Backward key
					case 37:
						if (_self.objectData.isPartOfSequence) {
							_self.objects.prev.click();
						}
						break;
					// Forward key
					case 39:
						if (_self.objectData.isPartOfSequence) {
							_self.objects.next.click();
						}
						break;
				}
			});
		},

		/**
		 * Starts the slideshow timeout
		 *
		 * @return	{void}
		 */
		_startTimeout: function () {
			_self.isSlideshowStarted = true;

			_self.objects.play.hide();
			_self.objects.pause.show();

			_self.cache.action = 'next';
			_self.objects.nav.removeClass(_self.settings.classPrefix + 'paused');

			_self.timeout = setTimeout(function () {
				_self.objects.nav.data('items').next.click();
			}, _self.settings.timeout);
		},

		/**
		 * Stops the slideshow timeout
		 *
		 * @return	{void}
		 */
		_stopTimeout: function () {
			_self.objects.play.show();
			_self.objects.pause.hide();

			_self.objects.nav.addClass(_self.settings.classPrefix + 'paused');

			clearTimeout(_self.timeout);
		},

		/**
		 * Sets the navigator buttons (prev/next)
		 *
		 * @return	{object}	items
		 */
		_setNavigation: function () {
			var $links = $((_self.cache.selector || _self.settings.attr)),
				sequenceLength = _self.objectData.sequenceLength - 1,
				items = {
					prev: $links.eq(_self.objectData.prevIndex),
					next: $links.eq(_self.objectData.nextIndex)
				};

			if (_self.objectData.currentIndex > 0) {
				_self.objects.prev.show();
			} else {
				items.prevItem = $links.eq(sequenceLength);
			}
			if (_self.objectData.nextIndex <= sequenceLength) {
				_self.objects.next.show();
			} else {
				items.next = $links.eq(0);
			}

			if (_self.settings.navigateEndless === true) {
				_self.objects.prev.show();
				_self.objects.next.show();
			}

			return items;
		},

		/**
		 * Item information/status
		 *
		 */
		item: {
			/**
			 * Verifies if the current item is first item.
			 *
			 * @return	{boolean}
			 */
			isFirst: function () {
				return (_self.objectData.currentIndex === 0);
			},

			/**
			 * Verifies if the current item is last item.
			 *
			 * @return	{boolean}
			 */
			isLast: function () {
				return (_self.objectData.currentIndex === (_self.objectData.sequenceLength - 1));
			}
		},

		/**
		 * Clones the object for inline elements
		 *
		 * @param	{object}	$object
		 * @return	{object}	$clone
		 */
		_cloneObject: function ($object) {
			var $clone = $object.clone(),
				objectId = $object.attr('id');

			// If element is hidden, cache the object and remove
			if ($object.is(':hidden')) {
				_self._cacheObjectData($object);
				$object.attr('id', _self.settings.idPrefix + 'temp-' + objectId).empty();
			} else {
				// Prevent duplicated id's
				$clone.removeAttr('id');
			}

			return $clone.show();
		},

		/**
		 * Verifies if it is a mobile device
		 *
		 * @return	{boolean}
		 */
		isMobileDevice: function () {
			var deviceAgent = navigator.userAgent.toLowerCase(),
				agentId = deviceAgent.match(_self.settings.mobileMatchExpression);

			return agentId ? true : false;
		},

		/**
		 * Verifies if css transitions are supported
		 *
		 * @return	{string|boolean}	The transition prefix if supported, else false.
		 */
		isTransitionSupported: function () {
			var body = $('body').get(0),
				isTransitionSupported = false,
				transitionMapping = {
					'transition': '',
					'WebkitTransition': '-webkit-',
					'MozTransition': '-moz-',
					'OTransition': '-o-',
					'MsTransition': '-ms-'
				};

			for (var key in transitionMapping) {
				if (transitionMapping.hasOwnProperty(key) && key in body.style) {
					_self.support.transition = transitionMapping[key];
					isTransitionSupported = true;
				}
			}

			return isTransitionSupported;
		},

		/**
		 * Transition types
		 *
		 */
		transition: {
			/**
			 * Fades in/out the object
			 *
			 * @param	{object}	$object
			 * @param	{string}	type
			 * @param	{number}	speed
			 * @param	{number}	opacity
			 * @param	{function}	callback
			 * @return	{void}		Animates an object
			 */
			fade: function ($object, type, speed, opacity, callback) {
				var isInTransition = type === 'in',
					startTransition = {},
					startOpacity = $object.css('opacity'),
					endTransition = {},
					endOpacity = opacity ? opacity: isInTransition ? 1 : 0;

				if (!_self.isOpen && isInTransition) return;

				startTransition['opacity'] = startOpacity;
				endTransition['opacity'] = endOpacity;

				$object.css(startTransition).show();

				// Css transition
				if (_self.support.transitions) {
					endTransition[_self.support.transition + 'transition'] = speed + 'ms ease';

					setTimeout(function () {
						$object.css(endTransition);

						setTimeout(function () {
							$object.css(_self.support.transition + 'transition', '');

							if (callback && (_self.isOpen || !isInTransition)) {
								callback();
							}
						}, speed);
					}, 15);
				} else {
					// Fallback to js transition
					$object.stop();
					$object.animate(endTransition, speed, callback);
				}
			},

			/**
			 * Scrolls in/out the object
			 *
			 * @param	{object}	$object
			 * @param	{string}	type
			 * @param	{number}	speed
			 * @param	{function}	callback
			 * @return	{void}		Animates an object
			 */
			scroll: function ($object, type, speed, callback) {
				var isInTransition = type === 'in',
					transition = isInTransition ? _self.settings.transitionIn : _self.settings.transitionOut,
					direction = 'left',
					startTransition = {},
					startOpacity = isInTransition ? 0 : 1,
					startOffset = isInTransition ? '-50%' : '50%',
					endTransition = {},
					endOpacity = isInTransition ? 1 : 0,
					endOffset = isInTransition ? '50%' : '-50%';

				if (!_self.isOpen && isInTransition) return;

				switch (transition) {
					case 'scrollTop':
						direction = 'top';
						break;
					case 'scrollRight':
						startOffset = isInTransition ? '150%' : '50%';
						endOffset = isInTransition ? '50%' : '150%';
						break;
					case 'scrollBottom':
						direction = 'top';
						startOffset = isInTransition ? '150%' : '50%';
						endOffset = isInTransition ? '50%' : '150%';
						break;
					case 'scrollHorizontal':
						startOffset = isInTransition ? '150%' : '50%';
						endOffset = isInTransition ? '50%' : '-50%';
						break;
					case 'scrollVertical':
						direction = 'top';
						startOffset = isInTransition ? '-50%' : '50%';
						endOffset = isInTransition ? '50%' : '150%';
						break;
				}

				if (_self.cache.action === 'prev') {
					switch (transition) {
						case 'scrollHorizontal':
							startOffset = isInTransition ? '-50%' : '50%';
							endOffset = isInTransition ? '50%' : '150%';
							break;
						case 'scrollVertical':
							startOffset = isInTransition ? '150%' : '50%';
							endOffset = isInTransition ? '50%' : '-50%';
							break;
					}
				}

				startTransition['opacity'] = startOpacity;
				startTransition[direction] = startOffset;

				endTransition['opacity'] = endOpacity;
				endTransition[direction] = endOffset;

				$object.css(startTransition).show();

				// Css transition
				if (_self.support.transitions) {
					endTransition[_self.support.transition + 'transition'] = speed + 'ms ease';

					setTimeout(function () {
						$object.css(endTransition);

						setTimeout(function () {
							$object.css(_self.support.transition + 'transition', '');

							if (callback && (_self.isOpen || !isInTransition)) {
								callback();
							}
						}, speed);
					}, 15);
				} else {
					// Fallback to js transition
					$object.stop();
					$object.animate(endTransition, speed, callback);
				}
			},

			/**
			 * Zooms in/out the object
			 *
			 * @param	{object}	$object
			 * @param	{string}	type
			 * @param	{number}	speed
			 * @param	{function}	callback
			 * @return	{void}		Animates an object
			 */
			zoom: function ($object, type, speed, callback) {
				var isInTransition = type === 'in',
					startTransition = {},
					startOpacity = $object.css('opacity'),
					startScale = isInTransition ? 'scale(0.75)' : 'scale(1)',
					endTransition = {},
					endOpacity = isInTransition ? 1 : 0,
					endScale = isInTransition ? 'scale(1)' : 'scale(0.75)';

				if (!_self.isOpen && isInTransition) return;

				startTransition['opacity'] = startOpacity;
				startTransition[_self.support.transition + 'transform'] = startScale;

				endTransition['opacity'] = endOpacity;

				$object.css(startTransition).show();

				// Css transition
				if (_self.support.transitions) {
					endTransition[_self.support.transition + 'transform'] = endScale;
					endTransition[_self.support.transition + 'transition'] = speed + 'ms ease';

					setTimeout(function () {
						$object.css(endTransition);

						setTimeout(function () {
							$object.css(_self.support.transition + 'transform', '');
							$object.css(_self.support.transition + 'transition', '');

							if (callback && (_self.isOpen || !isInTransition)) {
								callback();
							}
						}, speed);
					}, 15);
				} else {
					// Fallback to js transition
					$object.stop();
					$object.animate(endTransition, speed, callback);
				}
			}
		},

		/**
		 * Calls all the registered functions of a specific hook
		 *
		 * @param	{object}	hooks
		 * @return	{void}
		 */
		_callHooks: function (hooks) {
			if (typeof(hooks) === 'object') {
				$.each(hooks, function(index, hook) {
					if (typeof(hook) === 'function') {
						hook.call(_self.origin);
					}
				});
			}
		},

		/**
		 * Caches the object data
		 *
		 * @param	{object}	$object
		 * @return	{void}
		 */
		_cacheObjectData: function ($object) {
			$.data($object, 'cache', {
				id: $object.attr('id'),
				content: $object.html()
			});

			_self.cache.originalObject = $object;
		},

		/**
		 * Restores the object from cache
		 *
		 * @return	void
		 */
		_restoreObject: function () {
			var $object = $('[id^="' + _self.settings.idPrefix + 'temp-"]');

			$object.attr('id', $.data(_self.cache.originalObject, 'cache').id);
			$object.html($.data(_self.cache.originalObject, 'cache').content);
		},

		/**
		 * Executes functions for a window resize.
		 * It stops an eventual timeout and recalculates dimenstions.
		 *
		 * @return	{void}
		 */
		resize: function () {
			if (!_self.isOpen) return;

			if (_self.isSlideshowEnabled()) {
				_self._stopTimeout();
			}

			_self.dimensions = _self.getViewportDimensions();
			_self._calculateDimensions(_self.cache.object);
		},

		/**
		 * Caches the actual scroll coordinates.
		 *
		 * @return	{void}
		 */
		_cacheScrollPosition: function () {
			var	$window = $(window),
				$document = $(document),
				offset = {
					'top': $window.scrollTop(),
					'left':  $window.scrollLeft()
				};

			_self.cache.scrollPosition = _self.cache.scrollPosition || {};

			if (!_self._assertContentInvisible()) {
				_self.cache.cacheScrollPositionSkipped = true;
			}
			else if (_self.cache.cacheScrollPositionSkipped) {
				delete _self.cache.cacheScrollPositionSkipped;
				_self._restoreScrollPosition();
			}
			else {
				if ($document.width() > $window.width()) {
					_self.cache.scrollPosition.left = offset.left;
				}
				if ($document.height() > $window.height()) {
					_self.cache.scrollPosition.top = offset.top;
				}
			}
		},

		/**
		 * Watches for any resize interaction and caches the new sizes.
		 *
		 * @return	{void}
		 */
		_watchResizeInteraction: function () {
			$(window).resize(_self.resize);
		},

		/**
		 * Stop watching any resize interaction related to _self.
		 *
		 * @return	{void}
		 */
		_unwatchResizeInteraction: function () {
			$(window).off('resize', _self.resize);
		},

		/**
		 * Watches for any scroll interaction and caches the new position.
		 *
		 * @return	{void}
		 */
		_watchScrollInteraction: function () {
			$(window).scroll(_self._cacheScrollPosition);
			$(window).resize(_self._cacheScrollPosition);
		},

		/**
		 * Stop watching any scroll interaction related to _self.
		 *
		 * @return	{void}
		 */
		_unwatchScrollInteraction: function () {
			$(window).off('scroll', _self._cacheScrollPosition);
			$(window).off('resize', _self._cacheScrollPosition);
		},

		/**
		 * Ensures that site content is invisible or has not height.
		 *
		 * @return	{boolean}
		 */
		_assertContentInvisible: function () {
			return $($('body').children().not('[id*=' + _self.settings.idPrefix + ']').get(0)).height() > 0;
		},

		/**
		 * Restores to the original scoll position before
		 * lightcase got initialized.
		 *
		 * @return	{void}
		 */
		_restoreScrollPosition: function () {
			$(window)
				.scrollTop(parseInt(_self.cache.scrollPosition.top))
				.scrollLeft(parseInt(_self.cache.scrollPosition.left))
				.resize();
		},

		/**
		 * Switches to the fullscreen mode
		 *
		 * @return	{void}
		 */
		_switchToFullScreenMode: function () {
			_self.settings.shrinkFactor = 1;
			_self.settings.overlayOpacity = 1;

			$('html').addClass(_self.settings.classPrefix + 'fullScreenMode');
		},

		/**
		 * Enters into the lightcase view
		 *
		 * @return	{void}
		 */
		_open: function () {
			_self.isOpen = true;

			_self.support.transitions = _self.settings.cssTransitions ? _self.isTransitionSupported() : false;
			_self.support.mobileDevice = _self.isMobileDevice();

			if (_self.support.mobileDevice) {
				$('html').addClass(_self.settings.classPrefix + 'isMobileDevice');

				if (_self.settings.fullScreenModeForMobile) {
					_self._switchToFullScreenMode();
				}
			}
			if (!_self.settings.transitionIn) {
				_self.settings.transitionIn = _self.settings.transition;
			}
			if (!_self.settings.transitionOut) {
				_self.settings.transitionOut = _self.settings.transition;
			}

			switch (_self.settings.transitionIn) {
				case 'fade':
				case 'fadeInline':
				case 'elastic':
				case 'scrollTop':
				case 'scrollRight':
				case 'scrollBottom':
				case 'scrollLeft':
				case 'scrollVertical':
				case 'scrollHorizontal':
					if (_self.objects.case.is(':hidden')) {
						_self.objects.close.css('opacity', 0);
						_self.objects.overlay.css('opacity', 0);
						_self.objects.case.css('opacity', 0);
						_self.objects.contentInner.css('opacity', 0);
					}
					_self.transition.fade(_self.objects.overlay, 'in', _self.settings.speedIn, _self.settings.overlayOpacity, function () {
						_self.transition.fade(_self.objects.close, 'in', _self.settings.speedIn);
						_self._handleEvents();
						_self._processContent();
					});
					break;
				default:
					_self.transition.fade(_self.objects.overlay, 'in', 0, _self.settings.overlayOpacity, function () {
						_self.transition.fade(_self.objects.close, 'in', 0);
						_self._handleEvents();
						_self._processContent();
					});
					break;
			}

			$('html').addClass(_self.settings.classPrefix + 'open');
			_self.objects.case.attr('aria-hidden', 'false');
		},

		/**
		 * Escapes from the lightcase view
		 *
		 * @return	{void}
		 */
		close: function () {
			_self.isOpen = false;

			if (_self.isSlideshowEnabled()) {
				_self._stopTimeout();
				_self.isSlideshowStarted = false;
				_self.objects.nav.removeClass(_self.settings.classPrefix + 'paused');
			}

			_self.objects.loading.hide();

			_self._unbindEvents();

			_self._unwatchResizeInteraction();
			_self._unwatchScrollInteraction();

			$('html').removeClass(_self.settings.classPrefix + 'open');
			_self.objects.case.attr('aria-hidden', 'true');

			_self.objects.nav.children().hide();

			_self._restoreScrollPosition();

			// Call onClose hook functions
			_self._callHooks(_self.settings.onClose);

			switch (_self.settings.transitionOut) {
				case 'fade':
				case 'fadeInline':
				case 'scrollTop':
				case 'scrollRight':
				case 'scrollBottom':
				case 'scrollLeft':
				case 'scrollHorizontal':
				case 'scrollVertical':
					_self.transition.fade(_self.objects.case, 'out', _self.settings.speedOut, 0, function () {
						_self.transition.fade(_self.objects.overlay, 'out', _self.settings.speedOut, 0, function () {
							_self.cleanup();
						});
					});
					break;
				case 'elastic':
					_self.transition.zoom(_self.objects.case, 'out', _self.settings.speedOut, function () {
						_self.transition.fade(_self.objects.overlay, 'out', _self.settings.speedOut, 0, function () {
							_self.cleanup();
						});
					});
					break;
				default:
					_self.cleanup();
					break;
			}
		},

		/**
		 * Unbinds all given events
		 *
		 * @return	{void}
		 */
		_unbindEvents: function () {
			// Unbind overlay event
			_self.objects.overlay.unbind('click');

			// Unbind key events
			$(document).unbind('keyup.lightcase');

			// Unbind swipe events
			_self.objects.case.unbind('swipeleft').unbind('swiperight');

			// Unbind navigator events
			_self.objects.prev.unbind('click');
			_self.objects.next.unbind('click');
			_self.objects.play.unbind('click');
			_self.objects.pause.unbind('click');

			// Unbind close event
			_self.objects.close.unbind('click');
		},

		/**
		 * Cleans up the dimensions
		 *
		 * @return	{void}
		 */
		_cleanupDimensions: function () {
			var opacity = _self.objects.contentInner.css('opacity');

			_self.objects.case.css({
				'width': '',
				'height': '',
				'top': '',
				'left': '',
				'margin-top': '',
				'margin-left': ''
			});

			_self.objects.contentInner.removeAttr('style').css('opacity', opacity);
			_self.objects.contentInner.children().removeAttr('style');
		},

		/**
		 * Cleanup after aborting lightcase
		 *
		 * @return	{void}
		 */
		cleanup: function () {
			_self._cleanupDimensions();

			_self.objects.loading.hide();
			_self.objects.overlay.hide();
			_self.objects.case.hide();
			_self.objects.prev.hide();
			_self.objects.next.hide();
			_self.objects.play.hide();
			_self.objects.pause.hide();

			_self.objects.case.removeAttr(_self._prefixAttributeName('type'));
			_self.objects.nav.removeAttr(_self._prefixAttributeName('ispartofsequence'));

			_self.objects.contentInner.empty().hide();
			_self.objects.info.children().empty();

			if (_self.cache.originalObject) {
				_self._restoreObject();
			}

			// Call onCleanup hook functions
			_self._callHooks(_self.settings.onCleanup);

			// Restore cache
			_self.cache = {};
		},

		/**
		 * Returns the supported match media or undefined if the browser
		 * doesn't support match media.
		 *
		 * @return	{mixed}
		 */
		_matchMedia: function () {
			return window.matchMedia || window.msMatchMedia;
		},

		/**
		 * Returns the devicePixelRatio if supported. Else, it simply returns
		 * 1 as the default.
		 *
		 * @return	{number}
		 */
		_devicePixelRatio: function () {
			return window.devicePixelRatio || 1;
		},

		/**
		 * Checks if method is public
		 *
		 * @return	{boolean}
		 */
		_isPublicMethod: function (method) {
			return (typeof _self[method] === 'function' && method.charAt(0) !== '_');
		},

		/**
		 * Exports all public methods to be accessible, callable
		 * from global scope.
		 *
		 * @return	{void}
		 */
		_export: function () {
			window.lightcase = {};

			$.each(_self, function (property) {
				if (_self._isPublicMethod(property)) {
					lightcase[property] = _self[property];
				}
			});
		}
	};

	_self._export();

	$.fn.lightcase = function (method) {
		// Method calling logic (only public methods are applied)
		if (_self._isPublicMethod(method)) {
			return _self[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _self.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.lightcase');
		}
	};
})(jQuery);
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

jQuery(document).ready(function($) {
	function Photonic_Lightbox_Lightcase() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Lightcase.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Lightcase.prototype.soloImages = function() {
		$('a[href]').filter(function() {
			return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)/i.test( $(this).attr('href'));
		}).filter(function() {
			var res = new RegExp('photonic-launch-gallery').test($(this).attr('class'));
			return !res;
		}).attr("data-rel", 'photonic-lightcase');
	};

	Photonic_Lightbox_Lightcase.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', embed);
		$(element).attr("data-rel", 'photonic-lightcase-video');
	};

	Photonic_Lightbox_Lightcase.prototype.hostedVideo = function(a) {
		var html5 = $(a).attr('href').match(new RegExp(/(\.mp4|\.webm|\.ogg)/i));
		var css = $(a).attr('class');
		css = css !== undefined && css.includes('photonic-launch-gallery');

		if (html5 !== null && !css) {
			$(a).addClass(Photonic_JS.slideshow_library + "-html5-video");
			$(a).attr("data-rel", 'photonic-html5-video');

			this.videoIndex++;
		}
	};

	Photonic_Lightbox_Lightcase.prototype.initialize = function(selector, group) {
		this.handleSolos();
		var self = this;

		$(selector).each(function() {
			var current = this;
			var provider = $(current).data('photonicStreamProvider');
			var lightbox_selector;
			var rel = $(current).find('a.launch-gallery-lightcase');
			if (rel.length > 0) {
				rel = $(rel[0]).data('rel');
			}

			lightbox_selector = selector.indexOf('data-rel') > -1 ? selector : 'a[data-rel="' + rel + '"]';
			$(lightbox_selector).lightcase({
				showSequenceInfo: false,
				transition: Photonic_JS.lc_transition_effect,
				slideshow: Photonic_JS.slideshow_mode,
				timeout: Photonic_JS.slideshow_interval,
				navigateEndless: Photonic_JS.lightbox_loop,
				disableShrink: Photonic_JS.lc_disable_shrink === '1',
				attrPrefix: '',
				caption: ' ',
				swipe: true,
				onStart: {
					getVideoSize: function() {
						var elem = this;
						var videoURL = $(elem).attr('data-html5-href');// || $(elem).attr('href');
						if (lightbox_selector.indexOf('photonic-html5-video') > -1 || videoURL !== undefined) {
							self.getVideoSize(videoURL === undefined ? $(elem).attr('href') : videoURL, {height: window.innerHeight * 0.8, width: 800 }).then(function(dimensions) {
								$(elem).attr('data-lc-options', '{"width": ' + Math.round(dimensions.newWidth) + ', "height": ' + Math.round(dimensions.newHeight) + '}');
								$('#lightcase-content').find('video').attr({ width: Math.round(dimensions.newWidth), height: Math.round(dimensions.newHeight)}).css({ width: Math.round(dimensions.newWidth), height: Math.round(dimensions.newHeight)});
								lightcase.resize({ width: Math.round(dimensions.newWidth), height: Math.round(dimensions.newHeight) });
							});
						}
					}
				},
				onFinish: {
					setHash: function() {
						self.setHash(this);
						var shareable = {
							'url': location.href,
							'title': photonicHtmlDecode($(this).data('title')),
							'image': $(this).attr('href')
						};
						self.addSocial('#lightcase-info', shareable);
					}
				},
				onClose: { unsetHash: self.unsetHash() }
			});
		});
	};

	Photonic_Lightbox_Lightcase.prototype.initializeForNewContainer = function(containerId) {
		this.initialize(containerId);
	};

	photonicLightbox = new Photonic_Lightbox_Lightcase();
	photonicLightbox.initialize('.photonic-standard-layout,.photonic-masonry-layout,.photonic-mosaic-layout');
	photonicLightbox.initialize('a[data-rel="photonic-lightcase"]');
	photonicLightbox.initialize('a[data-rel="photonic-lightcase-video"]');
	photonicLightbox.initialize('a[data-rel="photonic-html5-video"]');
});

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
