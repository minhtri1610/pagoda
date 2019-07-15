/*! PhotoSwipe - v4.1.2 - 2017-04-05
* http://photoswipe.com
* Copyright (c) 2017 Dmitry Semenov; */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipe = factory();
	}
})(this, function () {

	'use strict';
	var PhotoSwipe = function(template, UiClass, items, options){

		/*>>framework-bridge*/
		/**
		 *
		 * Set of generic functions used by gallery.
		 *
		 * You're free to modify anything here as long as functionality is kept.
		 *
		 */
		var framework = {
			features: null,
			bind: function(target, type, listener, unbind) {
				var methodName = (unbind ? 'remove' : 'add') + 'EventListener';
				type = type.split(' ');
				for(var i = 0; i < type.length; i++) {
					if(type[i]) {
						target[methodName]( type[i], listener, false);
					}
				}
			},
			isArray: function(obj) {
				return (obj instanceof Array);
			},
			createEl: function(classes, tag) {
				var el = document.createElement(tag || 'div');
				if(classes) {
					el.className = classes;
				}
				return el;
			},
			getScrollY: function() {
				var yOffset = window.pageYOffset;
				return yOffset !== undefined ? yOffset : document.documentElement.scrollTop;
			},
			unbind: function(target, type, listener) {
				framework.bind(target,type,listener,true);
			},
			removeClass: function(el, className) {
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			},
			addClass: function(el, className) {
				if( !framework.hasClass(el,className) ) {
					el.className += (el.className ? ' ' : '') + className;
				}
			},
			hasClass: function(el, className) {
				return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
			},
			getChildByClass: function(parentEl, childClassName) {
				var node = parentEl.firstChild;
				while(node) {
					if( framework.hasClass(node, childClassName) ) {
						return node;
					}
					node = node.nextSibling;
				}
			},
			arraySearch: function(array, value, key) {
				var i = array.length;
				while(i--) {
					if(array[i][key] === value) {
						return i;
					}
				}
				return -1;
			},
			extend: function(o1, o2, preventOverwrite) {
				for (var prop in o2) {
					if (o2.hasOwnProperty(prop)) {
						if(preventOverwrite && o1.hasOwnProperty(prop)) {
							continue;
						}
						o1[prop] = o2[prop];
					}
				}
			},
			easing: {
				sine: {
					out: function(k) {
						return Math.sin(k * (Math.PI / 2));
					},
					inOut: function(k) {
						return - (Math.cos(Math.PI * k) - 1) / 2;
					}
				},
				cubic: {
					out: function(k) {
						return --k * k * k + 1;
					}
				}
				/*
					elastic: {
						out: function ( k ) {

							var s, a = 0.1, p = 0.4;
							if ( k === 0 ) return 0;
							if ( k === 1 ) return 1;
							if ( !a || a < 1 ) { a = 1; s = p / 4; }
							else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
							return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

						},
					},
					back: {
						out: function ( k ) {
							var s = 1.70158;
							return --k * k * ( ( s + 1 ) * k + s ) + 1;
						}
					}
				*/
			},

			/**
			 *
			 * @return {object}
			 *
			 * {
			 *  raf : request animation frame function
			 *  caf : cancel animation frame function
			 *  transfrom : transform property key (with vendor), or null if not supported
			 *  oldIE : IE8 or below
			 * }
			 *
			 */
			detectFeatures: function() {
				if(framework.features) {
					return framework.features;
				}
				var helperEl = framework.createEl(),
					helperStyle = helperEl.style,
					vendor = '',
					features = {};

				// IE8 and below
				features.oldIE = document.all && !document.addEventListener;

				features.touch = 'ontouchstart' in window;

				if(window.requestAnimationFrame) {
					features.raf = window.requestAnimationFrame;
					features.caf = window.cancelAnimationFrame;
				}

				features.pointerEvent = navigator.pointerEnabled || navigator.msPointerEnabled;

				// fix false-positive detection of old Android in new IE
				// (IE11 ua string contains "Android 4.0")

				if(!features.pointerEvent) {

					var ua = navigator.userAgent;

					// Detect if device is iPhone or iPod and if it's older than iOS 8
					// http://stackoverflow.com/a/14223920
					//
					// This detection is made because of buggy top/bottom toolbars
					// that don't trigger window.resize event.
					// For more info refer to _isFixedPosition variable in core.js

					if (/iP(hone|od)/.test(navigator.platform)) {
						var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
						if(v && v.length > 0) {
							v = parseInt(v[1], 10);
							if(v >= 1 && v < 8 ) {
								features.isOldIOSPhone = true;
							}
						}
					}

					// Detect old Android (before KitKat)
					// due to bugs related to position:fixed
					// http://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript

					var match = ua.match(/Android\s([0-9\.]*)/);
					var androidversion =  match ? match[1] : 0;
					androidversion = parseFloat(androidversion);
					if(androidversion >= 1 ) {
						if(androidversion < 4.4) {
							features.isOldAndroid = true; // for fixed position bug & performance
						}
						features.androidVersion = androidversion; // for touchend bug
					}
					features.isMobileOpera = /opera mini|opera mobi/i.test(ua);

					// p.s. yes, yes, UA sniffing is bad, propose your solution for above bugs.
				}

				var styleChecks = ['transform', 'perspective', 'animationName'],
					vendors = ['', 'webkit','Moz','ms','O'],
					styleCheckItem,
					styleName;

				for(var i = 0; i < 4; i++) {
					vendor = vendors[i];

					for(var a = 0; a < 3; a++) {
						styleCheckItem = styleChecks[a];

						// uppercase first letter of property name, if vendor is present
						styleName = vendor + (vendor ?
							styleCheckItem.charAt(0).toUpperCase() + styleCheckItem.slice(1) :
							styleCheckItem);

						if(!features[styleCheckItem] && styleName in helperStyle ) {
							features[styleCheckItem] = styleName;
						}
					}

					if(vendor && !features.raf) {
						vendor = vendor.toLowerCase();
						features.raf = window[vendor+'RequestAnimationFrame'];
						if(features.raf) {
							features.caf = window[vendor+'CancelAnimationFrame'] ||
								window[vendor+'CancelRequestAnimationFrame'];
						}
					}
				}

				if(!features.raf) {
					var lastTime = 0;
					features.raf = function(fn) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function() { fn(currTime + timeToCall); }, timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};
					features.caf = function(id) { clearTimeout(id); };
				}

				// Detect SVG support
				features.svg = !!document.createElementNS &&
					!!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

				framework.features = features;

				return features;
			}
		};

		framework.detectFeatures();

// Override addEventListener for old versions of IE
		if(framework.features.oldIE) {

			framework.bind = function(target, type, listener, unbind) {

				type = type.split(' ');

				var methodName = (unbind ? 'detach' : 'attach') + 'Event',
					evName,
					_handleEv = function() {
						listener.handleEvent.call(listener);
					};

				for(var i = 0; i < type.length; i++) {
					evName = type[i];
					if(evName) {

						if(typeof listener === 'object' && listener.handleEvent) {
							if(!unbind) {
								listener['oldIE' + evName] = _handleEv;
							} else {
								if(!listener['oldIE' + evName]) {
									return false;
								}
							}

							target[methodName]( 'on' + evName, listener['oldIE' + evName]);
						} else {
							target[methodName]( 'on' + evName, listener);
						}

					}
				}
			};

		}

		/*>>framework-bridge*/

		/*>>core*/
//function(template, UiClass, items, options)

		var self = this;

		/**
		 * Static vars, don't change unless you know what you're doing.
		 */
		var DOUBLE_TAP_RADIUS = 25,
			NUM_HOLDERS = 3;

		/**
		 * Options
		 */
		var _options = {
			allowPanToNext:true,
			spacing: 0.12,
			bgOpacity: 1,
			mouseUsed: false,
			loop: true,
			pinchToClose: true,
			closeOnScroll: true,
			closeOnVerticalDrag: true,
			verticalDragRange: 0.75,
			hideAnimationDuration: 333,
			showAnimationDuration: 333,
			showHideOpacity: false,
			focus: true,
			escKey: true,
			arrowKeys: true,
			mainScrollEndFriction: 0.35,
			panEndFriction: 0.35,
			isClickableElement: function(el) {
				return el.tagName === 'A';
			},
			getDoubleTapZoom: function(isMouseClick, item) {
				if(isMouseClick) {
					return 1;
				} else {
					return item.initialZoomLevel < 0.7 ? 1 : 1.33;
				}
			},
			maxSpreadZoom: 1.33,
			modal: true,

			// not fully implemented yet
			scaleMode: 'fit' // TODO
		};
		framework.extend(_options, options);


		/**
		 * Private helper variables & functions
		 */

		var _getEmptyPoint = function() {
			return {x:0,y:0};
		};

		var _isOpen,
			_isDestroying,
			_closedByScroll,
			_currentItemIndex,
			_containerStyle,
			_containerShiftIndex,
			_currPanDist = _getEmptyPoint(),
			_startPanOffset = _getEmptyPoint(),
			_panOffset = _getEmptyPoint(),
			_upMoveEvents, // drag move, drag end & drag cancel events array
			_downEvents, // drag start events array
			_globalEventHandlers,
			_viewportSize = {},
			_currZoomLevel,
			_startZoomLevel,
			_translatePrefix,
			_translateSufix,
			_updateSizeInterval,
			_itemsNeedUpdate,
			_currPositionIndex = 0,
			_offset = {},
			_slideSize = _getEmptyPoint(), // size of slide area, including spacing
			_itemHolders,
			_prevItemIndex,
			_indexDiff = 0, // difference of indexes since last content update
			_dragStartEvent,
			_dragMoveEvent,
			_dragEndEvent,
			_dragCancelEvent,
			_transformKey,
			_pointerEventEnabled,
			_isFixedPosition = true,
			_likelyTouchDevice,
			_modules = [],
			_requestAF,
			_cancelAF,
			_initalClassName,
			_initalWindowScrollY,
			_oldIE,
			_currentWindowScrollY,
			_features,
			_windowVisibleSize = {},
			_renderMaxResolution = false,
			_orientationChangeTimeout,


			// Registers PhotoSWipe module (History, Controller ...)
			_registerModule = function(name, module) {
				framework.extend(self, module.publicMethods);
				_modules.push(name);
			},

			_getLoopedId = function(index) {
				var numSlides = _getNumItems();
				if(index > numSlides - 1) {
					return index - numSlides;
				} else  if(index < 0) {
					return numSlides + index;
				}
				return index;
			},

			// Micro bind/trigger
			_listeners = {},
			_listen = function(name, fn) {
				if(!_listeners[name]) {
					_listeners[name] = [];
				}
				return _listeners[name].push(fn);
			},
			_shout = function(name) {
				var listeners = _listeners[name];

				if(listeners) {
					var args = Array.prototype.slice.call(arguments);
					args.shift();

					for(var i = 0; i < listeners.length; i++) {
						listeners[i].apply(self, args);
					}
				}
			},

			_getCurrentTime = function() {
				return new Date().getTime();
			},
			_applyBgOpacity = function(opacity) {
				_bgOpacity = opacity;
				self.bg.style.opacity = opacity * _options.bgOpacity;
			},

			_applyZoomTransform = function(styleObj,x,y,zoom,item) {
				if(!_renderMaxResolution || (item && item !== self.currItem) ) {
					zoom = zoom / (item ? item.fitRatio : self.currItem.fitRatio);
				}

				styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
			},
			_applyCurrentZoomPan = function( allowRenderResolution ) {
				if(_currZoomElementStyle) {

					if(allowRenderResolution) {
						if(_currZoomLevel > self.currItem.fitRatio) {
							if(!_renderMaxResolution) {
								_setImageSize(self.currItem, false, true);
								_renderMaxResolution = true;
							}
						} else {
							if(_renderMaxResolution) {
								_setImageSize(self.currItem);
								_renderMaxResolution = false;
							}
						}
					}


					_applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
				}
			},
			_applyZoomPanToItem = function(item) {
				if(item.container) {

					_applyZoomTransform(item.container.style,
						item.initialPosition.x,
						item.initialPosition.y,
						item.initialZoomLevel,
						item);
				}
			},
			_setTranslateX = function(x, elStyle) {
				elStyle[_transformKey] = _translatePrefix + x + 'px, 0px' + _translateSufix;
			},
			_moveMainScroll = function(x, dragging) {

				if(!_options.loop && dragging) {
					var newSlideIndexOffset = _currentItemIndex + (_slideSize.x * _currPositionIndex - x) / _slideSize.x,
						delta = Math.round(x - _mainScrollPos.x);

					if( (newSlideIndexOffset < 0 && delta > 0) ||
						(newSlideIndexOffset >= _getNumItems() - 1 && delta < 0) ) {
						x = _mainScrollPos.x + delta * _options.mainScrollEndFriction;
					}
				}

				_mainScrollPos.x = x;
				_setTranslateX(x, _containerStyle);
			},
			_calculatePanOffset = function(axis, zoomLevel) {
				var m = _midZoomPoint[axis] - _offset[axis];
				return _startPanOffset[axis] + _currPanDist[axis] + m - m * ( zoomLevel / _startZoomLevel );
			},

			_equalizePoints = function(p1, p2) {
				p1.x = p2.x;
				p1.y = p2.y;
				if(p2.id) {
					p1.id = p2.id;
				}
			},
			_roundPoint = function(p) {
				p.x = Math.round(p.x);
				p.y = Math.round(p.y);
			},

			_mouseMoveTimeout = null,
			_onFirstMouseMove = function() {
				// Wait until mouse move event is fired at least twice during 100ms
				// We do this, because some mobile browsers trigger it on touchstart
				if(_mouseMoveTimeout ) {
					framework.unbind(document, 'mousemove', _onFirstMouseMove);
					framework.addClass(template, 'pswp--has_mouse');
					_options.mouseUsed = true;
					_shout('mouseUsed');
				}
				_mouseMoveTimeout = setTimeout(function() {
					_mouseMoveTimeout = null;
				}, 100);
			},

			_bindEvents = function() {
				framework.bind(document, 'keydown', self);

				if(_features.transform) {
					// don't bind click event in browsers that don't support transform (mostly IE8)
					framework.bind(self.scrollWrap, 'click', self);
				}


				if(!_options.mouseUsed) {
					framework.bind(document, 'mousemove', _onFirstMouseMove);
				}

				framework.bind(window, 'resize scroll orientationchange', self);

				_shout('bindEvents');
			},

			_unbindEvents = function() {
				framework.unbind(window, 'resize scroll orientationchange', self);
				framework.unbind(window, 'scroll', _globalEventHandlers.scroll);
				framework.unbind(document, 'keydown', self);
				framework.unbind(document, 'mousemove', _onFirstMouseMove);

				if(_features.transform) {
					framework.unbind(self.scrollWrap, 'click', self);
				}

				if(_isDragging) {
					framework.unbind(window, _upMoveEvents, self);
				}

				clearTimeout(_orientationChangeTimeout);

				_shout('unbindEvents');
			},

			_calculatePanBounds = function(zoomLevel, update) {
				var bounds = _calculateItemSize( self.currItem, _viewportSize, zoomLevel );
				if(update) {
					_currPanBounds = bounds;
				}
				return bounds;
			},

			_getMinZoomLevel = function(item) {
				if(!item) {
					item = self.currItem;
				}
				return item.initialZoomLevel;
			},
			_getMaxZoomLevel = function(item) {
				if(!item) {
					item = self.currItem;
				}
				return item.w > 0 ? _options.maxSpreadZoom : 1;
			},

			// Return true if offset is out of the bounds
			_modifyDestPanOffset = function(axis, destPanBounds, destPanOffset, destZoomLevel) {
				if(destZoomLevel === self.currItem.initialZoomLevel) {
					destPanOffset[axis] = self.currItem.initialPosition[axis];
					return true;
				} else {
					destPanOffset[axis] = _calculatePanOffset(axis, destZoomLevel);

					if(destPanOffset[axis] > destPanBounds.min[axis]) {
						destPanOffset[axis] = destPanBounds.min[axis];
						return true;
					} else if(destPanOffset[axis] < destPanBounds.max[axis] ) {
						destPanOffset[axis] = destPanBounds.max[axis];
						return true;
					}
				}
				return false;
			},

			_setupTransforms = function() {

				if(_transformKey) {
					// setup 3d transforms
					var allow3dTransform = _features.perspective && !_likelyTouchDevice;
					_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
					_translateSufix = _features.perspective ? ', 0px)' : ')';
					return;
				}

				// Override zoom/pan/move functions in case old browser is used (most likely IE)
				// (so they use left/top/width/height, instead of CSS transform)

				_transformKey = 'left';
				framework.addClass(template, 'pswp--ie');

				_setTranslateX = function(x, elStyle) {
					elStyle.left = x + 'px';
				};
				_applyZoomPanToItem = function(item) {

					var zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
						s = item.container.style,
						w = zoomRatio * item.w,
						h = zoomRatio * item.h;

					s.width = w + 'px';
					s.height = h + 'px';
					s.left = item.initialPosition.x + 'px';
					s.top = item.initialPosition.y + 'px';

				};
				_applyCurrentZoomPan = function() {
					if(_currZoomElementStyle) {

						var s = _currZoomElementStyle,
							item = self.currItem,
							zoomRatio = item.fitRatio > 1 ? 1 : item.fitRatio,
							w = zoomRatio * item.w,
							h = zoomRatio * item.h;

						s.width = w + 'px';
						s.height = h + 'px';


						s.left = _panOffset.x + 'px';
						s.top = _panOffset.y + 'px';
					}

				};
			},

			_onKeyDown = function(e) {
				var keydownAction = '';
				if(_options.escKey && e.keyCode === 27) {
					keydownAction = 'close';
				} else if(_options.arrowKeys) {
					if(e.keyCode === 37) {
						keydownAction = 'prev';
					} else if(e.keyCode === 39) {
						keydownAction = 'next';
					}
				}

				if(keydownAction) {
					// don't do anything if special key pressed to prevent from overriding default browser actions
					// e.g. in Chrome on Mac cmd+arrow-left returns to previous page
					if( !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey ) {
						if(e.preventDefault) {
							e.preventDefault();
						} else {
							e.returnValue = false;
						}
						self[keydownAction]();
					}
				}
			},

			_onGlobalClick = function(e) {
				if(!e) {
					return;
				}

				// don't allow click event to pass through when triggering after drag or some other gesture
				if(_moved || _zoomStarted || _mainScrollAnimating || _verticalDragInitiated) {
					e.preventDefault();
					e.stopPropagation();
				}
			},

			_updatePageScrollOffset = function() {
				self.setScrollOffset(0, framework.getScrollY());
			};







// Micro animation engine
		var _animations = {},
			_numAnimations = 0,
			_stopAnimation = function(name) {
				if(_animations[name]) {
					if(_animations[name].raf) {
						_cancelAF( _animations[name].raf );
					}
					_numAnimations--;
					delete _animations[name];
				}
			},
			_registerStartAnimation = function(name) {
				if(_animations[name]) {
					_stopAnimation(name);
				}
				if(!_animations[name]) {
					_numAnimations++;
					_animations[name] = {};
				}
			},
			_stopAllAnimations = function() {
				for (var prop in _animations) {

					if( _animations.hasOwnProperty( prop ) ) {
						_stopAnimation(prop);
					}

				}
			},
			_animateProp = function(name, b, endProp, d, easingFn, onUpdate, onComplete) {
				var startAnimTime = _getCurrentTime(), t;
				_registerStartAnimation(name);

				var animloop = function(){
					if ( _animations[name] ) {

						t = _getCurrentTime() - startAnimTime; // time diff
						//b - beginning (start prop)
						//d - anim duration

						if ( t >= d ) {
							_stopAnimation(name);
							onUpdate(endProp);
							if(onComplete) {
								onComplete();
							}
							return;
						}
						onUpdate( (endProp - b) * easingFn(t/d) + b );

						_animations[name].raf = _requestAF(animloop);
					}
				};
				animloop();
			};



		var publicMethods = {

			// make a few local variables and functions public
			shout: _shout,
			listen: _listen,
			viewportSize: _viewportSize,
			options: _options,

			isMainScrollAnimating: function() {
				return _mainScrollAnimating;
			},
			getZoomLevel: function() {
				return _currZoomLevel;
			},
			getCurrentIndex: function() {
				return _currentItemIndex;
			},
			isDragging: function() {
				return _isDragging;
			},
			isZooming: function() {
				return _isZooming;
			},
			setScrollOffset: function(x,y) {
				_offset.x = x;
				_currentWindowScrollY = _offset.y = y;
				_shout('updateScrollOffset', _offset);
			},
			applyZoomPan: function(zoomLevel,panX,panY,allowRenderResolution) {
				_panOffset.x = panX;
				_panOffset.y = panY;
				_currZoomLevel = zoomLevel;
				_applyCurrentZoomPan( allowRenderResolution );
			},

			init: function() {

				if(_isOpen || _isDestroying) {
					return;
				}

				var i;

				self.framework = framework; // basic functionality
				self.template = template; // root DOM element of PhotoSwipe
				self.bg = framework.getChildByClass(template, 'pswp__bg');

				_initalClassName = template.className;
				_isOpen = true;

				_features = framework.detectFeatures();
				_requestAF = _features.raf;
				_cancelAF = _features.caf;
				_transformKey = _features.transform;
				_oldIE = _features.oldIE;

				self.scrollWrap = framework.getChildByClass(template, 'pswp__scroll-wrap');
				self.container = framework.getChildByClass(self.scrollWrap, 'pswp__container');

				_containerStyle = self.container.style; // for fast access

				// Objects that hold slides (there are only 3 in DOM)
				self.itemHolders = _itemHolders = [
					{el:self.container.children[0] , wrap:0, index: -1},
					{el:self.container.children[1] , wrap:0, index: -1},
					{el:self.container.children[2] , wrap:0, index: -1}
				];

				// hide nearby item holders until initial zoom animation finishes (to avoid extra Paints)
				_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'none';

				_setupTransforms();

				// Setup global events
				_globalEventHandlers = {
					resize: self.updateSize,

					// Fixes: iOS 10.3 resize event
					// does not update scrollWrap.clientWidth instantly after resize
					// https://github.com/dimsemenov/PhotoSwipe/issues/1315
					orientationchange: function() {
						clearTimeout(_orientationChangeTimeout);
						_orientationChangeTimeout = setTimeout(function() {
							if(_viewportSize.x !== self.scrollWrap.clientWidth) {
								self.updateSize();
							}
						}, 500);
					},
					scroll: _updatePageScrollOffset,
					keydown: _onKeyDown,
					click: _onGlobalClick
				};

				// disable show/hide effects on old browsers that don't support CSS animations or transforms,
				// old IOS, Android and Opera mobile. Blackberry seems to work fine, even older models.
				var oldPhone = _features.isOldIOSPhone || _features.isOldAndroid || _features.isMobileOpera;
				if(!_features.animationName || !_features.transform || oldPhone) {
					_options.showAnimationDuration = _options.hideAnimationDuration = 0;
				}

				// init modules
				for(i = 0; i < _modules.length; i++) {
					self['init' + _modules[i]]();
				}

				// init
				if(UiClass) {
					var ui = self.ui = new UiClass(self, framework);
					ui.init();
				}

				_shout('firstUpdate');
				_currentItemIndex = _currentItemIndex || _options.index || 0;
				// validate index
				if( isNaN(_currentItemIndex) || _currentItemIndex < 0 || _currentItemIndex >= _getNumItems() ) {
					_currentItemIndex = 0;
				}
				self.currItem = _getItemAt( _currentItemIndex );


				if(_features.isOldIOSPhone || _features.isOldAndroid) {
					_isFixedPosition = false;
				}

				template.setAttribute('aria-hidden', 'false');
				if(_options.modal) {
					if(!_isFixedPosition) {
						template.style.position = 'absolute';
						template.style.top = framework.getScrollY() + 'px';
					} else {
						template.style.position = 'fixed';
					}
				}

				if(_currentWindowScrollY === undefined) {
					_shout('initialLayout');
					_currentWindowScrollY = _initalWindowScrollY = framework.getScrollY();
				}

				// add classes to root element of PhotoSwipe
				var rootClasses = 'pswp--open ';
				if(_options.mainClass) {
					rootClasses += _options.mainClass + ' ';
				}
				if(_options.showHideOpacity) {
					rootClasses += 'pswp--animate_opacity ';
				}
				rootClasses += _likelyTouchDevice ? 'pswp--touch' : 'pswp--notouch';
				rootClasses += _features.animationName ? ' pswp--css_animation' : '';
				rootClasses += _features.svg ? ' pswp--svg' : '';
				framework.addClass(template, rootClasses);

				self.updateSize();

				// initial update
				_containerShiftIndex = -1;
				_indexDiff = null;
				for(i = 0; i < NUM_HOLDERS; i++) {
					_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, _itemHolders[i].el.style);
				}

				if(!_oldIE) {
					framework.bind(self.scrollWrap, _downEvents, self); // no dragging for old IE
				}

				_listen('initialZoomInEnd', function() {
					self.setContent(_itemHolders[0], _currentItemIndex-1);
					self.setContent(_itemHolders[2], _currentItemIndex+1);

					_itemHolders[0].el.style.display = _itemHolders[2].el.style.display = 'block';

					if(_options.focus) {
						// focus causes layout,
						// which causes lag during the animation,
						// that's why we delay it untill the initial zoom transition ends
						template.focus();
					}


					_bindEvents();
				});

				// set content for center slide (first time)
				self.setContent(_itemHolders[1], _currentItemIndex);

				self.updateCurrItem();

				_shout('afterInit');

				if(!_isFixedPosition) {

					// On all versions of iOS lower than 8.0, we check size of viewport every second.
					//
					// This is done to detect when Safari top & bottom bars appear,
					// as this action doesn't trigger any events (like resize).
					//
					// On iOS8 they fixed this.
					//
					// 10 Nov 2014: iOS 7 usage ~40%. iOS 8 usage 56%.

					_updateSizeInterval = setInterval(function() {
						if(!_numAnimations && !_isDragging && !_isZooming && (_currZoomLevel === self.currItem.initialZoomLevel)  ) {
							self.updateSize();
						}
					}, 1000);
				}

				framework.addClass(template, 'pswp--visible');
			},

			// Close the gallery, then destroy it
			close: function() {
				if(!_isOpen) {
					return;
				}

				_isOpen = false;
				_isDestroying = true;
				_shout('close');
				_unbindEvents();

				_showOrHide(self.currItem, null, true, self.destroy);
			},

			// destroys the gallery (unbinds events, cleans up intervals and timeouts to avoid memory leaks)
			destroy: function() {
				_shout('destroy');

				if(_showOrHideTimeout) {
					clearTimeout(_showOrHideTimeout);
				}

				template.setAttribute('aria-hidden', 'true');
				template.className = _initalClassName;

				if(_updateSizeInterval) {
					clearInterval(_updateSizeInterval);
				}

				framework.unbind(self.scrollWrap, _downEvents, self);

				// we unbind scroll event at the end, as closing animation may depend on it
				framework.unbind(window, 'scroll', self);

				_stopDragUpdateLoop();

				_stopAllAnimations();

				_listeners = null;
			},

			/**
			 * Pan image to position
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Boolean} force Will ignore bounds if set to true.
			 */
			panTo: function(x,y,force) {
				if(!force) {
					if(x > _currPanBounds.min.x) {
						x = _currPanBounds.min.x;
					} else if(x < _currPanBounds.max.x) {
						x = _currPanBounds.max.x;
					}

					if(y > _currPanBounds.min.y) {
						y = _currPanBounds.min.y;
					} else if(y < _currPanBounds.max.y) {
						y = _currPanBounds.max.y;
					}
				}

				_panOffset.x = x;
				_panOffset.y = y;
				_applyCurrentZoomPan();
			},

			handleEvent: function (e) {
				e = e || window.event;
				if(_globalEventHandlers[e.type]) {
					_globalEventHandlers[e.type](e);
				}
			},


			goTo: function(index) {

				index = _getLoopedId(index);

				var diff = index - _currentItemIndex;
				_indexDiff = diff;

				_currentItemIndex = index;
				self.currItem = _getItemAt( _currentItemIndex );
				_currPositionIndex -= diff;

				_moveMainScroll(_slideSize.x * _currPositionIndex);


				_stopAllAnimations();
				_mainScrollAnimating = false;

				self.updateCurrItem();
			},
			next: function() {
				self.goTo( _currentItemIndex + 1);
			},
			prev: function() {
				self.goTo( _currentItemIndex - 1);
			},

			// update current zoom/pan objects
			updateCurrZoomItem: function(emulateSetContent) {
				if(emulateSetContent) {
					_shout('beforeChange', 0);
				}

				// itemHolder[1] is middle (current) item
				if(_itemHolders[1].el.children.length) {
					var zoomElement = _itemHolders[1].el.children[0];
					if( framework.hasClass(zoomElement, 'pswp__zoom-wrap') ) {
						_currZoomElementStyle = zoomElement.style;
					} else {
						_currZoomElementStyle = null;
					}
				} else {
					_currZoomElementStyle = null;
				}

				_currPanBounds = self.currItem.bounds;
				_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;

				_panOffset.x = _currPanBounds.center.x;
				_panOffset.y = _currPanBounds.center.y;

				if(emulateSetContent) {
					_shout('afterChange');
				}
			},


			invalidateCurrItems: function() {
				_itemsNeedUpdate = true;
				for(var i = 0; i < NUM_HOLDERS; i++) {
					if( _itemHolders[i].item ) {
						_itemHolders[i].item.needsUpdate = true;
					}
				}
			},

			updateCurrItem: function(beforeAnimation) {

				if(_indexDiff === 0) {
					return;
				}

				var diffAbs = Math.abs(_indexDiff),
					tempHolder;

				if(beforeAnimation && diffAbs < 2) {
					return;
				}


				self.currItem = _getItemAt( _currentItemIndex );
				_renderMaxResolution = false;

				_shout('beforeChange', _indexDiff);

				if(diffAbs >= NUM_HOLDERS) {
					_containerShiftIndex += _indexDiff + (_indexDiff > 0 ? -NUM_HOLDERS : NUM_HOLDERS);
					diffAbs = NUM_HOLDERS;
				}
				for(var i = 0; i < diffAbs; i++) {
					if(_indexDiff > 0) {
						tempHolder = _itemHolders.shift();
						_itemHolders[NUM_HOLDERS-1] = tempHolder; // move first to last

						_containerShiftIndex++;
						_setTranslateX( (_containerShiftIndex+2) * _slideSize.x, tempHolder.el.style);
						self.setContent(tempHolder, _currentItemIndex - diffAbs + i + 1 + 1);
					} else {
						tempHolder = _itemHolders.pop();
						_itemHolders.unshift( tempHolder ); // move last to first

						_containerShiftIndex--;
						_setTranslateX( _containerShiftIndex * _slideSize.x, tempHolder.el.style);
						self.setContent(tempHolder, _currentItemIndex + diffAbs - i - 1 - 1);
					}

				}

				// reset zoom/pan on previous item
				if(_currZoomElementStyle && Math.abs(_indexDiff) === 1) {

					var prevItem = _getItemAt(_prevItemIndex);
					if(prevItem.initialZoomLevel !== _currZoomLevel) {
						_calculateItemSize(prevItem , _viewportSize );
						_setImageSize(prevItem);
						_applyZoomPanToItem( prevItem );
					}

				}

				// reset diff after update
				_indexDiff = 0;

				self.updateCurrZoomItem();

				_prevItemIndex = _currentItemIndex;

				_shout('afterChange');

			},



			updateSize: function(force) {

				if(!_isFixedPosition && _options.modal) {
					var windowScrollY = framework.getScrollY();
					if(_currentWindowScrollY !== windowScrollY) {
						template.style.top = windowScrollY + 'px';
						_currentWindowScrollY = windowScrollY;
					}
					if(!force && _windowVisibleSize.x === window.innerWidth && _windowVisibleSize.y === window.innerHeight) {
						return;
					}
					_windowVisibleSize.x = window.innerWidth;
					_windowVisibleSize.y = window.innerHeight;

					//template.style.width = _windowVisibleSize.x + 'px';
					template.style.height = _windowVisibleSize.y + 'px';
				}



				_viewportSize.x = self.scrollWrap.clientWidth;
				_viewportSize.y = self.scrollWrap.clientHeight;

				_updatePageScrollOffset();

				_slideSize.x = _viewportSize.x + Math.round(_viewportSize.x * _options.spacing);
				_slideSize.y = _viewportSize.y;

				_moveMainScroll(_slideSize.x * _currPositionIndex);

				_shout('beforeResize'); // even may be used for example to switch image sources


				// don't re-calculate size on inital size update
				if(_containerShiftIndex !== undefined) {

					var holder,
						item,
						hIndex;

					for(var i = 0; i < NUM_HOLDERS; i++) {
						holder = _itemHolders[i];
						_setTranslateX( (i+_containerShiftIndex) * _slideSize.x, holder.el.style);

						hIndex = _currentItemIndex+i-1;

						if(_options.loop && _getNumItems() > 2) {
							hIndex = _getLoopedId(hIndex);
						}

						// update zoom level on items and refresh source (if needsUpdate)
						item = _getItemAt( hIndex );

						// re-render gallery item if `needsUpdate`,
						// or doesn't have `bounds` (entirely new slide object)
						if( item && (_itemsNeedUpdate || item.needsUpdate || !item.bounds) ) {

							self.cleanSlide( item );

							self.setContent( holder, hIndex );

							// if "center" slide
							if(i === 1) {
								self.currItem = item;
								self.updateCurrZoomItem(true);
							}

							item.needsUpdate = false;

						} else if(holder.index === -1 && hIndex >= 0) {
							// add content first time
							self.setContent( holder, hIndex );
						}
						if(item && item.container) {
							_calculateItemSize(item, _viewportSize);
							_setImageSize(item);
							_applyZoomPanToItem( item );
						}

					}
					_itemsNeedUpdate = false;
				}

				_startZoomLevel = _currZoomLevel = self.currItem.initialZoomLevel;
				_currPanBounds = self.currItem.bounds;

				if(_currPanBounds) {
					_panOffset.x = _currPanBounds.center.x;
					_panOffset.y = _currPanBounds.center.y;
					_applyCurrentZoomPan( true );
				}

				_shout('resize');
			},

			// Zoom current item to
			zoomTo: function(destZoomLevel, centerPoint, speed, easingFn, updateFn) {
				/*
					if(destZoomLevel === 'fit') {
						destZoomLevel = self.currItem.fitRatio;
					} else if(destZoomLevel === 'fill') {
						destZoomLevel = self.currItem.fillRatio;
					}
				*/

				if(centerPoint) {
					_startZoomLevel = _currZoomLevel;
					_midZoomPoint.x = Math.abs(centerPoint.x) - _panOffset.x ;
					_midZoomPoint.y = Math.abs(centerPoint.y) - _panOffset.y ;
					_equalizePoints(_startPanOffset, _panOffset);
				}

				var destPanBounds = _calculatePanBounds(destZoomLevel, false),
					destPanOffset = {};

				_modifyDestPanOffset('x', destPanBounds, destPanOffset, destZoomLevel);
				_modifyDestPanOffset('y', destPanBounds, destPanOffset, destZoomLevel);

				var initialZoomLevel = _currZoomLevel;
				var initialPanOffset = {
					x: _panOffset.x,
					y: _panOffset.y
				};

				_roundPoint(destPanOffset);

				var onUpdate = function(now) {
					if(now === 1) {
						_currZoomLevel = destZoomLevel;
						_panOffset.x = destPanOffset.x;
						_panOffset.y = destPanOffset.y;
					} else {
						_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
						_panOffset.x = (destPanOffset.x - initialPanOffset.x) * now + initialPanOffset.x;
						_panOffset.y = (destPanOffset.y - initialPanOffset.y) * now + initialPanOffset.y;
					}

					if(updateFn) {
						updateFn(now);
					}

					_applyCurrentZoomPan( now === 1 );
				};

				if(speed) {
					_animateProp('customZoomTo', 0, 1, speed, easingFn || framework.easing.sine.inOut, onUpdate);
				} else {
					onUpdate(1);
				}
			}


		};


		/*>>core*/

		/*>>gestures*/
		/**
		 * Mouse/touch/pointer event handlers.
		 *
		 * separated from @core.js for readability
		 */

		var MIN_SWIPE_DISTANCE = 30,
			DIRECTION_CHECK_OFFSET = 10; // amount of pixels to drag to determine direction of swipe

		var _gestureStartTime,
			_gestureCheckSpeedTime,

			// pool of objects that are used during dragging of zooming
			p = {}, // first point
			p2 = {}, // second point (for zoom gesture)
			delta = {},
			_currPoint = {},
			_startPoint = {},
			_currPointers = [],
			_startMainScrollPos = {},
			_releaseAnimData,
			_posPoints = [], // array of points during dragging, used to determine type of gesture
			_tempPoint = {},

			_isZoomingIn,
			_verticalDragInitiated,
			_oldAndroidTouchEndTimeout,
			_currZoomedItemIndex = 0,
			_centerPoint = _getEmptyPoint(),
			_lastReleaseTime = 0,
			_isDragging, // at least one pointer is down
			_isMultitouch, // at least two _pointers are down
			_zoomStarted, // zoom level changed during zoom gesture
			_moved,
			_dragAnimFrame,
			_mainScrollShifted,
			_currentPoints, // array of current touch points
			_isZooming,
			_currPointsDistance,
			_startPointsDistance,
			_currPanBounds,
			_mainScrollPos = _getEmptyPoint(),
			_currZoomElementStyle,
			_mainScrollAnimating, // true, if animation after swipe gesture is running
			_midZoomPoint = _getEmptyPoint(),
			_currCenterPoint = _getEmptyPoint(),
			_direction,
			_isFirstMove,
			_opacityChanged,
			_bgOpacity,
			_wasOverInitialZoom,

			_isEqualPoints = function(p1, p2) {
				return p1.x === p2.x && p1.y === p2.y;
			},
			_isNearbyPoints = function(touch0, touch1) {
				return Math.abs(touch0.x - touch1.x) < DOUBLE_TAP_RADIUS && Math.abs(touch0.y - touch1.y) < DOUBLE_TAP_RADIUS;
			},
			_calculatePointsDistance = function(p1, p2) {
				_tempPoint.x = Math.abs( p1.x - p2.x );
				_tempPoint.y = Math.abs( p1.y - p2.y );
				return Math.sqrt(_tempPoint.x * _tempPoint.x + _tempPoint.y * _tempPoint.y);
			},
			_stopDragUpdateLoop = function() {
				if(_dragAnimFrame) {
					_cancelAF(_dragAnimFrame);
					_dragAnimFrame = null;
				}
			},
			_dragUpdateLoop = function() {
				if(_isDragging) {
					_dragAnimFrame = _requestAF(_dragUpdateLoop);
					_renderMovement();
				}
			},
			_canPan = function() {
				return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
			},

			// find the closest parent DOM element
			_closestElement = function(el, fn) {
				if(!el || el === document) {
					return false;
				}

				// don't search elements above pswp__scroll-wrap
				if(el.getAttribute('class') && el.getAttribute('class').indexOf('pswp__scroll-wrap') > -1 ) {
					return false;
				}

				if( fn(el) ) {
					return el;
				}

				return _closestElement(el.parentNode, fn);
			},

			_preventObj = {},
			_preventDefaultEventBehaviour = function(e, isDown) {
				_preventObj.prevent = !_closestElement(e.target, _options.isClickableElement);

				_shout('preventDragEvent', e, isDown, _preventObj);
				return _preventObj.prevent;

			},
			_convertTouchToPoint = function(touch, p) {
				p.x = touch.pageX;
				p.y = touch.pageY;
				p.id = touch.identifier;
				return p;
			},
			_findCenterOfPoints = function(p1, p2, pCenter) {
				pCenter.x = (p1.x + p2.x) * 0.5;
				pCenter.y = (p1.y + p2.y) * 0.5;
			},
			_pushPosPoint = function(time, x, y) {
				if(time - _gestureCheckSpeedTime > 50) {
					var o = _posPoints.length > 2 ? _posPoints.shift() : {};
					o.x = x;
					o.y = y;
					_posPoints.push(o);
					_gestureCheckSpeedTime = time;
				}
			},

			_calculateVerticalDragOpacityRatio = function() {
				var yOffset = _panOffset.y - self.currItem.initialPosition.y; // difference between initial and current position
				return 1 -  Math.abs( yOffset / (_viewportSize.y / 2)  );
			},


			// points pool, reused during touch events
			_ePoint1 = {},
			_ePoint2 = {},
			_tempPointsArr = [],
			_tempCounter,
			_getTouchPoints = function(e) {
				// clean up previous points, without recreating array
				while(_tempPointsArr.length > 0) {
					_tempPointsArr.pop();
				}

				if(!_pointerEventEnabled) {
					if(e.type.indexOf('touch') > -1) {

						if(e.touches && e.touches.length > 0) {
							_tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
							if(e.touches.length > 1) {
								_tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2);
							}
						}

					} else {
						_ePoint1.x = e.pageX;
						_ePoint1.y = e.pageY;
						_ePoint1.id = '';
						_tempPointsArr[0] = _ePoint1;//_ePoint1;
					}
				} else {
					_tempCounter = 0;
					// we can use forEach, as pointer events are supported only in modern browsers
					_currPointers.forEach(function(p) {
						if(_tempCounter === 0) {
							_tempPointsArr[0] = p;
						} else if(_tempCounter === 1) {
							_tempPointsArr[1] = p;
						}
						_tempCounter++;

					});
				}
				return _tempPointsArr;
			},

			_panOrMoveMainScroll = function(axis, delta) {

				var panFriction,
					overDiff = 0,
					newOffset = _panOffset[axis] + delta[axis],
					startOverDiff,
					dir = delta[axis] > 0,
					newMainScrollPosition = _mainScrollPos.x + delta.x,
					mainScrollDiff = _mainScrollPos.x - _startMainScrollPos.x,
					newPanPos,
					newMainScrollPos;

				// calculate fdistance over the bounds and friction
				if(newOffset > _currPanBounds.min[axis] || newOffset < _currPanBounds.max[axis]) {
					panFriction = _options.panEndFriction;
					// Linear increasing of friction, so at 1/4 of viewport it's at max value.
					// Looks not as nice as was expected. Left for history.
					// panFriction = (1 - (_panOffset[axis] + delta[axis] + panBounds.min[axis]) / (_viewportSize[axis] / 4) );
				} else {
					panFriction = 1;
				}

				newOffset = _panOffset[axis] + delta[axis] * panFriction;

				// move main scroll or start panning
				if(_options.allowPanToNext || _currZoomLevel === self.currItem.initialZoomLevel) {


					if(!_currZoomElementStyle) {

						newMainScrollPos = newMainScrollPosition;

					} else if(_direction === 'h' && axis === 'x' && !_zoomStarted ) {

						if(dir) {
							if(newOffset > _currPanBounds.min[axis]) {
								panFriction = _options.panEndFriction;
								overDiff = _currPanBounds.min[axis] - newOffset;
								startOverDiff = _currPanBounds.min[axis] - _startPanOffset[axis];
							}

							// drag right
							if( (startOverDiff <= 0 || mainScrollDiff < 0) && _getNumItems() > 1 ) {
								newMainScrollPos = newMainScrollPosition;
								if(mainScrollDiff < 0 && newMainScrollPosition > _startMainScrollPos.x) {
									newMainScrollPos = _startMainScrollPos.x;
								}
							} else {
								if(_currPanBounds.min.x !== _currPanBounds.max.x) {
									newPanPos = newOffset;
								}

							}

						} else {

							if(newOffset < _currPanBounds.max[axis] ) {
								panFriction =_options.panEndFriction;
								overDiff = newOffset - _currPanBounds.max[axis];
								startOverDiff = _startPanOffset[axis] - _currPanBounds.max[axis];
							}

							if( (startOverDiff <= 0 || mainScrollDiff > 0) && _getNumItems() > 1 ) {
								newMainScrollPos = newMainScrollPosition;

								if(mainScrollDiff > 0 && newMainScrollPosition < _startMainScrollPos.x) {
									newMainScrollPos = _startMainScrollPos.x;
								}

							} else {
								if(_currPanBounds.min.x !== _currPanBounds.max.x) {
									newPanPos = newOffset;
								}
							}

						}


						//
					}

					if(axis === 'x') {

						if(newMainScrollPos !== undefined) {
							_moveMainScroll(newMainScrollPos, true);
							if(newMainScrollPos === _startMainScrollPos.x) {
								_mainScrollShifted = false;
							} else {
								_mainScrollShifted = true;
							}
						}

						if(_currPanBounds.min.x !== _currPanBounds.max.x) {
							if(newPanPos !== undefined) {
								_panOffset.x = newPanPos;
							} else if(!_mainScrollShifted) {
								_panOffset.x += delta.x * panFriction;
							}
						}

						return newMainScrollPos !== undefined;
					}

				}

				if(!_mainScrollAnimating) {

					if(!_mainScrollShifted) {
						if(_currZoomLevel > self.currItem.fitRatio) {
							_panOffset[axis] += delta[axis] * panFriction;

						}
					}


				}

			},

			// Pointerdown/touchstart/mousedown handler
			_onDragStart = function(e) {

				// Allow dragging only via left mouse button.
				// As this handler is not added in IE8 - we ignore e.which
				//
				// http://www.quirksmode.org/js/events_properties.html
				// https://developer.mozilla.org/en-US/docs/Web/API/event.button
				if(e.type === 'mousedown' && e.button > 0  ) {
					return;
				}

				if(_initialZoomRunning) {
					e.preventDefault();
					return;
				}

				if(_oldAndroidTouchEndTimeout && e.type === 'mousedown') {
					return;
				}

				if(_preventDefaultEventBehaviour(e, true)) {
					e.preventDefault();
				}



				_shout('pointerDown');

				if(_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
					if(pointerIndex < 0) {
						pointerIndex = _currPointers.length;
					}
					_currPointers[pointerIndex] = {x:e.pageX, y:e.pageY, id: e.pointerId};
				}



				var startPointsList = _getTouchPoints(e),
					numPoints = startPointsList.length;

				_currentPoints = null;

				_stopAllAnimations();

				// init drag
				if(!_isDragging || numPoints === 1) {



					_isDragging = _isFirstMove = true;
					framework.bind(window, _upMoveEvents, self);

					_isZoomingIn =
						_wasOverInitialZoom =
							_opacityChanged =
								_verticalDragInitiated =
									_mainScrollShifted =
										_moved =
											_isMultitouch =
												_zoomStarted = false;

					_direction = null;

					_shout('firstTouchStart', startPointsList);

					_equalizePoints(_startPanOffset, _panOffset);

					_currPanDist.x = _currPanDist.y = 0;
					_equalizePoints(_currPoint, startPointsList[0]);
					_equalizePoints(_startPoint, _currPoint);

					//_equalizePoints(_startMainScrollPos, _mainScrollPos);
					_startMainScrollPos.x = _slideSize.x * _currPositionIndex;

					_posPoints = [{
						x: _currPoint.x,
						y: _currPoint.y
					}];

					_gestureCheckSpeedTime = _gestureStartTime = _getCurrentTime();

					//_mainScrollAnimationEnd(true);
					_calculatePanBounds( _currZoomLevel, true );

					// Start rendering
					_stopDragUpdateLoop();
					_dragUpdateLoop();

				}

				// init zoom
				if(!_isZooming && numPoints > 1 && !_mainScrollAnimating && !_mainScrollShifted) {
					_startZoomLevel = _currZoomLevel;
					_zoomStarted = false; // true if zoom changed at least once

					_isZooming = _isMultitouch = true;
					_currPanDist.y = _currPanDist.x = 0;

					_equalizePoints(_startPanOffset, _panOffset);

					_equalizePoints(p, startPointsList[0]);
					_equalizePoints(p2, startPointsList[1]);

					_findCenterOfPoints(p, p2, _currCenterPoint);

					_midZoomPoint.x = Math.abs(_currCenterPoint.x) - _panOffset.x;
					_midZoomPoint.y = Math.abs(_currCenterPoint.y) - _panOffset.y;
					_currPointsDistance = _startPointsDistance = _calculatePointsDistance(p, p2);
				}


			},

			// Pointermove/touchmove/mousemove handler
			_onDragMove = function(e) {

				e.preventDefault();

				if(_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
					if(pointerIndex > -1) {
						var p = _currPointers[pointerIndex];
						p.x = e.pageX;
						p.y = e.pageY;
					}
				}

				if(_isDragging) {
					var touchesList = _getTouchPoints(e);
					if(!_direction && !_moved && !_isZooming) {

						if(_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
							// if main scroll position is shifted – direction is always horizontal
							_direction = 'h';
						} else {
							var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
							// check the direction of movement
							if(Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
								_direction = diff > 0 ? 'h' : 'v';
								_currentPoints = touchesList;
							}
						}

					} else {
						_currentPoints = touchesList;
					}
				}
			},
			//
			_renderMovement =  function() {

				if(!_currentPoints) {
					return;
				}

				var numPoints = _currentPoints.length;

				if(numPoints === 0) {
					return;
				}

				_equalizePoints(p, _currentPoints[0]);

				delta.x = p.x - _currPoint.x;
				delta.y = p.y - _currPoint.y;

				if(_isZooming && numPoints > 1) {
					// Handle behaviour for more than 1 point

					_currPoint.x = p.x;
					_currPoint.y = p.y;

					// check if one of two points changed
					if( !delta.x && !delta.y && _isEqualPoints(_currentPoints[1], p2) ) {
						return;
					}

					_equalizePoints(p2, _currentPoints[1]);


					if(!_zoomStarted) {
						_zoomStarted = true;
						_shout('zoomGestureStarted');
					}

					// Distance between two points
					var pointsDistance = _calculatePointsDistance(p,p2);

					var zoomLevel = _calculateZoomLevel(pointsDistance);

					// slightly over the of initial zoom level
					if(zoomLevel > self.currItem.initialZoomLevel + self.currItem.initialZoomLevel / 15) {
						_wasOverInitialZoom = true;
					}

					// Apply the friction if zoom level is out of the bounds
					var zoomFriction = 1,
						minZoomLevel = _getMinZoomLevel(),
						maxZoomLevel = _getMaxZoomLevel();

					if ( zoomLevel < minZoomLevel ) {

						if(_options.pinchToClose && !_wasOverInitialZoom && _startZoomLevel <= self.currItem.initialZoomLevel) {
							// fade out background if zooming out
							var minusDiff = minZoomLevel - zoomLevel;
							var percent = 1 - minusDiff / (minZoomLevel / 1.2);

							_applyBgOpacity(percent);
							_shout('onPinchClose', percent);
							_opacityChanged = true;
						} else {
							zoomFriction = (minZoomLevel - zoomLevel) / minZoomLevel;
							if(zoomFriction > 1) {
								zoomFriction = 1;
							}
							zoomLevel = minZoomLevel - zoomFriction * (minZoomLevel / 3);
						}

					} else if ( zoomLevel > maxZoomLevel ) {
						// 1.5 - extra zoom level above the max. E.g. if max is x6, real max 6 + 1.5 = 7.5
						zoomFriction = (zoomLevel - maxZoomLevel) / ( minZoomLevel * 6 );
						if(zoomFriction > 1) {
							zoomFriction = 1;
						}
						zoomLevel = maxZoomLevel + zoomFriction * minZoomLevel;
					}

					if(zoomFriction < 0) {
						zoomFriction = 0;
					}

					// distance between touch points after friction is applied
					_currPointsDistance = pointsDistance;

					// _centerPoint - The point in the middle of two pointers
					_findCenterOfPoints(p, p2, _centerPoint);

					// paning with two pointers pressed
					_currPanDist.x += _centerPoint.x - _currCenterPoint.x;
					_currPanDist.y += _centerPoint.y - _currCenterPoint.y;
					_equalizePoints(_currCenterPoint, _centerPoint);

					_panOffset.x = _calculatePanOffset('x', zoomLevel);
					_panOffset.y = _calculatePanOffset('y', zoomLevel);

					_isZoomingIn = zoomLevel > _currZoomLevel;
					_currZoomLevel = zoomLevel;
					_applyCurrentZoomPan();

				} else {

					// handle behaviour for one point (dragging or panning)

					if(!_direction) {
						return;
					}

					if(_isFirstMove) {
						_isFirstMove = false;

						// subtract drag distance that was used during the detection direction

						if( Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
							delta.x -= _currentPoints[0].x - _startPoint.x;
						}

						if( Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
							delta.y -= _currentPoints[0].y - _startPoint.y;
						}
					}

					_currPoint.x = p.x;
					_currPoint.y = p.y;

					// do nothing if pointers position hasn't changed
					if(delta.x === 0 && delta.y === 0) {
						return;
					}

					if(_direction === 'v' && _options.closeOnVerticalDrag) {
						if(!_canPan()) {
							_currPanDist.y += delta.y;
							_panOffset.y += delta.y;

							var opacityRatio = _calculateVerticalDragOpacityRatio();

							_verticalDragInitiated = true;
							_shout('onVerticalDrag', opacityRatio);

							_applyBgOpacity(opacityRatio);
							_applyCurrentZoomPan();
							return ;
						}
					}

					_pushPosPoint(_getCurrentTime(), p.x, p.y);

					_moved = true;
					_currPanBounds = self.currItem.bounds;

					var mainScrollChanged = _panOrMoveMainScroll('x', delta);
					if(!mainScrollChanged) {
						_panOrMoveMainScroll('y', delta);

						_roundPoint(_panOffset);
						_applyCurrentZoomPan();
					}

				}

			},

			// Pointerup/pointercancel/touchend/touchcancel/mouseup event handler
			_onDragRelease = function(e) {

				if(_features.isOldAndroid ) {

					if(_oldAndroidTouchEndTimeout && e.type === 'mouseup') {
						return;
					}

					// on Android (v4.1, 4.2, 4.3 & possibly older)
					// ghost mousedown/up event isn't preventable via e.preventDefault,
					// which causes fake mousedown event
					// so we block mousedown/up for 600ms
					if( e.type.indexOf('touch') > -1 ) {
						clearTimeout(_oldAndroidTouchEndTimeout);
						_oldAndroidTouchEndTimeout = setTimeout(function() {
							_oldAndroidTouchEndTimeout = 0;
						}, 600);
					}

				}

				_shout('pointerUp');

				if(_preventDefaultEventBehaviour(e, false)) {
					e.preventDefault();
				}

				var releasePoint;

				if(_pointerEventEnabled) {
					var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');

					if(pointerIndex > -1) {
						releasePoint = _currPointers.splice(pointerIndex, 1)[0];

						if(navigator.pointerEnabled) {
							releasePoint.type = e.pointerType || 'mouse';
						} else {
							var MSPOINTER_TYPES = {
								4: 'mouse', // event.MSPOINTER_TYPE_MOUSE
								2: 'touch', // event.MSPOINTER_TYPE_TOUCH
								3: 'pen' // event.MSPOINTER_TYPE_PEN
							};
							releasePoint.type = MSPOINTER_TYPES[e.pointerType];

							if(!releasePoint.type) {
								releasePoint.type = e.pointerType || 'mouse';
							}
						}

					}
				}

				var touchList = _getTouchPoints(e),
					gestureType,
					numPoints = touchList.length;

				if(e.type === 'mouseup') {
					numPoints = 0;
				}

				// Do nothing if there were 3 touch points or more
				if(numPoints === 2) {
					_currentPoints = null;
					return true;
				}

				// if second pointer released
				if(numPoints === 1) {
					_equalizePoints(_startPoint, touchList[0]);
				}


				// pointer hasn't moved, send "tap release" point
				if(numPoints === 0 && !_direction && !_mainScrollAnimating) {
					if(!releasePoint) {
						if(e.type === 'mouseup') {
							releasePoint = {x: e.pageX, y: e.pageY, type:'mouse'};
						} else if(e.changedTouches && e.changedTouches[0]) {
							releasePoint = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, type:'touch'};
						}
					}

					_shout('touchRelease', e, releasePoint);
				}

				// Difference in time between releasing of two last touch points (zoom gesture)
				var releaseTimeDiff = -1;

				// Gesture completed, no pointers left
				if(numPoints === 0) {
					_isDragging = false;
					framework.unbind(window, _upMoveEvents, self);

					_stopDragUpdateLoop();

					if(_isZooming) {
						// Two points released at the same time
						releaseTimeDiff = 0;
					} else if(_lastReleaseTime !== -1) {
						releaseTimeDiff = _getCurrentTime() - _lastReleaseTime;
					}
				}
				_lastReleaseTime = numPoints === 1 ? _getCurrentTime() : -1;

				if(releaseTimeDiff !== -1 && releaseTimeDiff < 150) {
					gestureType = 'zoom';
				} else {
					gestureType = 'swipe';
				}

				if(_isZooming && numPoints < 2) {
					_isZooming = false;

					// Only second point released
					if(numPoints === 1) {
						gestureType = 'zoomPointerUp';
					}
					_shout('zoomGestureEnded');
				}

				_currentPoints = null;
				if(!_moved && !_zoomStarted && !_mainScrollAnimating && !_verticalDragInitiated) {
					// nothing to animate
					return;
				}

				_stopAllAnimations();


				if(!_releaseAnimData) {
					_releaseAnimData = _initDragReleaseAnimationData();
				}

				_releaseAnimData.calculateSwipeSpeed('x');


				if(_verticalDragInitiated) {

					var opacityRatio = _calculateVerticalDragOpacityRatio();

					if(opacityRatio < _options.verticalDragRange) {
						self.close();
					} else {
						var initalPanY = _panOffset.y,
							initialBgOpacity = _bgOpacity;

						_animateProp('verticalDrag', 0, 1, 300, framework.easing.cubic.out, function(now) {

							_panOffset.y = (self.currItem.initialPosition.y - initalPanY) * now + initalPanY;

							_applyBgOpacity(  (1 - initialBgOpacity) * now + initialBgOpacity );
							_applyCurrentZoomPan();
						});

						_shout('onVerticalDrag', 1);
					}

					return;
				}


				// main scroll
				if(  (_mainScrollShifted || _mainScrollAnimating) && numPoints === 0) {
					var itemChanged = _finishSwipeMainScrollGesture(gestureType, _releaseAnimData);
					if(itemChanged) {
						return;
					}
					gestureType = 'zoomPointerUp';
				}

				// prevent zoom/pan animation when main scroll animation runs
				if(_mainScrollAnimating) {
					return;
				}

				// Complete simple zoom gesture (reset zoom level if it's out of the bounds)
				if(gestureType !== 'swipe') {
					_completeZoomGesture();
					return;
				}

				// Complete pan gesture if main scroll is not shifted, and it's possible to pan current image
				if(!_mainScrollShifted && _currZoomLevel > self.currItem.fitRatio) {
					_completePanGesture(_releaseAnimData);
				}
			},


			// Returns object with data about gesture
			// It's created only once and then reused
			_initDragReleaseAnimationData  = function() {
				// temp local vars
				var lastFlickDuration,
					tempReleasePos;

				// s = this
				var s = {
					lastFlickOffset: {},
					lastFlickDist: {},
					lastFlickSpeed: {},
					slowDownRatio:  {},
					slowDownRatioReverse:  {},
					speedDecelerationRatio:  {},
					speedDecelerationRatioAbs:  {},
					distanceOffset:  {},
					backAnimDestination: {},
					backAnimStarted: {},
					calculateSwipeSpeed: function(axis) {


						if( _posPoints.length > 1) {
							lastFlickDuration = _getCurrentTime() - _gestureCheckSpeedTime + 50;
							tempReleasePos = _posPoints[_posPoints.length-2][axis];
						} else {
							lastFlickDuration = _getCurrentTime() - _gestureStartTime; // total gesture duration
							tempReleasePos = _startPoint[axis];
						}
						s.lastFlickOffset[axis] = _currPoint[axis] - tempReleasePos;
						s.lastFlickDist[axis] = Math.abs(s.lastFlickOffset[axis]);
						if(s.lastFlickDist[axis] > 20) {
							s.lastFlickSpeed[axis] = s.lastFlickOffset[axis] / lastFlickDuration;
						} else {
							s.lastFlickSpeed[axis] = 0;
						}
						if( Math.abs(s.lastFlickSpeed[axis]) < 0.1 ) {
							s.lastFlickSpeed[axis] = 0;
						}

						s.slowDownRatio[axis] = 0.95;
						s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
						s.speedDecelerationRatio[axis] = 1;
					},

					calculateOverBoundsAnimOffset: function(axis, speed) {
						if(!s.backAnimStarted[axis]) {

							if(_panOffset[axis] > _currPanBounds.min[axis]) {
								s.backAnimDestination[axis] = _currPanBounds.min[axis];

							} else if(_panOffset[axis] < _currPanBounds.max[axis]) {
								s.backAnimDestination[axis] = _currPanBounds.max[axis];
							}

							if(s.backAnimDestination[axis] !== undefined) {
								s.slowDownRatio[axis] = 0.7;
								s.slowDownRatioReverse[axis] = 1 - s.slowDownRatio[axis];
								if(s.speedDecelerationRatioAbs[axis] < 0.05) {

									s.lastFlickSpeed[axis] = 0;
									s.backAnimStarted[axis] = true;

									_animateProp('bounceZoomPan'+axis,_panOffset[axis],
										s.backAnimDestination[axis],
										speed || 300,
										framework.easing.sine.out,
										function(pos) {
											_panOffset[axis] = pos;
											_applyCurrentZoomPan();
										}
									);

								}
							}
						}
					},

					// Reduces the speed by slowDownRatio (per 10ms)
					calculateAnimOffset: function(axis) {
						if(!s.backAnimStarted[axis]) {
							s.speedDecelerationRatio[axis] = s.speedDecelerationRatio[axis] * (s.slowDownRatio[axis] +
								s.slowDownRatioReverse[axis] -
								s.slowDownRatioReverse[axis] * s.timeDiff / 10);

							s.speedDecelerationRatioAbs[axis] = Math.abs(s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis]);
							s.distanceOffset[axis] = s.lastFlickSpeed[axis] * s.speedDecelerationRatio[axis] * s.timeDiff;
							_panOffset[axis] += s.distanceOffset[axis];

						}
					},

					panAnimLoop: function() {
						if ( _animations.zoomPan ) {
							_animations.zoomPan.raf = _requestAF(s.panAnimLoop);

							s.now = _getCurrentTime();
							s.timeDiff = s.now - s.lastNow;
							s.lastNow = s.now;

							s.calculateAnimOffset('x');
							s.calculateAnimOffset('y');

							_applyCurrentZoomPan();

							s.calculateOverBoundsAnimOffset('x');
							s.calculateOverBoundsAnimOffset('y');


							if (s.speedDecelerationRatioAbs.x < 0.05 && s.speedDecelerationRatioAbs.y < 0.05) {

								// round pan position
								_panOffset.x = Math.round(_panOffset.x);
								_panOffset.y = Math.round(_panOffset.y);
								_applyCurrentZoomPan();

								_stopAnimation('zoomPan');
								return;
							}
						}

					}
				};
				return s;
			},

			_completePanGesture = function(animData) {
				// calculate swipe speed for Y axis (paanning)
				animData.calculateSwipeSpeed('y');

				_currPanBounds = self.currItem.bounds;

				animData.backAnimDestination = {};
				animData.backAnimStarted = {};

				// Avoid acceleration animation if speed is too low
				if(Math.abs(animData.lastFlickSpeed.x) <= 0.05 && Math.abs(animData.lastFlickSpeed.y) <= 0.05 ) {
					animData.speedDecelerationRatioAbs.x = animData.speedDecelerationRatioAbs.y = 0;

					// Run pan drag release animation. E.g. if you drag image and release finger without momentum.
					animData.calculateOverBoundsAnimOffset('x');
					animData.calculateOverBoundsAnimOffset('y');
					return true;
				}

				// Animation loop that controls the acceleration after pan gesture ends
				_registerStartAnimation('zoomPan');
				animData.lastNow = _getCurrentTime();
				animData.panAnimLoop();
			},


			_finishSwipeMainScrollGesture = function(gestureType, _releaseAnimData) {
				var itemChanged;
				if(!_mainScrollAnimating) {
					_currZoomedItemIndex = _currentItemIndex;
				}



				var itemsDiff;

				if(gestureType === 'swipe') {
					var totalShiftDist = _currPoint.x - _startPoint.x,
						isFastLastFlick = _releaseAnimData.lastFlickDist.x < 10;

					// if container is shifted for more than MIN_SWIPE_DISTANCE,
					// and last flick gesture was in right direction
					if(totalShiftDist > MIN_SWIPE_DISTANCE &&
						(isFastLastFlick || _releaseAnimData.lastFlickOffset.x > 20) ) {
						// go to prev item
						itemsDiff = -1;
					} else if(totalShiftDist < -MIN_SWIPE_DISTANCE &&
						(isFastLastFlick || _releaseAnimData.lastFlickOffset.x < -20) ) {
						// go to next item
						itemsDiff = 1;
					}
				}

				var nextCircle;

				if(itemsDiff) {

					_currentItemIndex += itemsDiff;

					if(_currentItemIndex < 0) {
						_currentItemIndex = _options.loop ? _getNumItems()-1 : 0;
						nextCircle = true;
					} else if(_currentItemIndex >= _getNumItems()) {
						_currentItemIndex = _options.loop ? 0 : _getNumItems()-1;
						nextCircle = true;
					}

					if(!nextCircle || _options.loop) {
						_indexDiff += itemsDiff;
						_currPositionIndex -= itemsDiff;
						itemChanged = true;
					}



				}

				var animateToX = _slideSize.x * _currPositionIndex;
				var animateToDist = Math.abs( animateToX - _mainScrollPos.x );
				var finishAnimDuration;


				if(!itemChanged && animateToX > _mainScrollPos.x !== _releaseAnimData.lastFlickSpeed.x > 0) {
					// "return to current" duration, e.g. when dragging from slide 0 to -1
					finishAnimDuration = 333;
				} else {
					finishAnimDuration = Math.abs(_releaseAnimData.lastFlickSpeed.x) > 0 ?
						animateToDist / Math.abs(_releaseAnimData.lastFlickSpeed.x) :
						333;

					finishAnimDuration = Math.min(finishAnimDuration, 400);
					finishAnimDuration = Math.max(finishAnimDuration, 250);
				}

				if(_currZoomedItemIndex === _currentItemIndex) {
					itemChanged = false;
				}

				_mainScrollAnimating = true;

				_shout('mainScrollAnimStart');

				_animateProp('mainScroll', _mainScrollPos.x, animateToX, finishAnimDuration, framework.easing.cubic.out,
					_moveMainScroll,
					function() {
						_stopAllAnimations();
						_mainScrollAnimating = false;
						_currZoomedItemIndex = -1;

						if(itemChanged || _currZoomedItemIndex !== _currentItemIndex) {
							self.updateCurrItem();
						}

						_shout('mainScrollAnimComplete');
					}
				);

				if(itemChanged) {
					self.updateCurrItem(true);
				}

				return itemChanged;
			},

			_calculateZoomLevel = function(touchesDistance) {
				return  1 / _startPointsDistance * touchesDistance * _startZoomLevel;
			},

			// Resets zoom if it's out of bounds
			_completeZoomGesture = function() {
				var destZoomLevel = _currZoomLevel,
					minZoomLevel = _getMinZoomLevel(),
					maxZoomLevel = _getMaxZoomLevel();

				if ( _currZoomLevel < minZoomLevel ) {
					destZoomLevel = minZoomLevel;
				} else if ( _currZoomLevel > maxZoomLevel ) {
					destZoomLevel = maxZoomLevel;
				}

				var destOpacity = 1,
					onUpdate,
					initialOpacity = _bgOpacity;

				if(_opacityChanged && !_isZoomingIn && !_wasOverInitialZoom && _currZoomLevel < minZoomLevel) {
					//_closedByScroll = true;
					self.close();
					return true;
				}

				if(_opacityChanged) {
					onUpdate = function(now) {
						_applyBgOpacity(  (destOpacity - initialOpacity) * now + initialOpacity );
					};
				}

				self.zoomTo(destZoomLevel, 0, 200,  framework.easing.cubic.out, onUpdate);
				return true;
			};


		_registerModule('Gestures', {
			publicMethods: {

				initGestures: function() {

					// helper function that builds touch/pointer/mouse events
					var addEventNames = function(pref, down, move, up, cancel) {
						_dragStartEvent = pref + down;
						_dragMoveEvent = pref + move;
						_dragEndEvent = pref + up;
						if(cancel) {
							_dragCancelEvent = pref + cancel;
						} else {
							_dragCancelEvent = '';
						}
					};

					_pointerEventEnabled = _features.pointerEvent;
					if(_pointerEventEnabled && _features.touch) {
						// we don't need touch events, if browser supports pointer events
						_features.touch = false;
					}

					if(_pointerEventEnabled) {
						if(navigator.pointerEnabled) {
							addEventNames('pointer', 'down', 'move', 'up', 'cancel');
						} else {
							// IE10 pointer events are case-sensitive
							addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
						}
					} else if(_features.touch) {
						addEventNames('touch', 'start', 'move', 'end', 'cancel');
						_likelyTouchDevice = true;
					} else {
						addEventNames('mouse', 'down', 'move', 'up');
					}

					_upMoveEvents = _dragMoveEvent + ' ' + _dragEndEvent  + ' ' +  _dragCancelEvent;
					_downEvents = _dragStartEvent;

					if(_pointerEventEnabled && !_likelyTouchDevice) {
						_likelyTouchDevice = (navigator.maxTouchPoints > 1) || (navigator.msMaxTouchPoints > 1);
					}
					// make variable public
					self.likelyTouchDevice = _likelyTouchDevice;

					_globalEventHandlers[_dragStartEvent] = _onDragStart;
					_globalEventHandlers[_dragMoveEvent] = _onDragMove;
					_globalEventHandlers[_dragEndEvent] = _onDragRelease; // the Kraken

					if(_dragCancelEvent) {
						_globalEventHandlers[_dragCancelEvent] = _globalEventHandlers[_dragEndEvent];
					}

					// Bind mouse events on device with detected hardware touch support, in case it supports multiple types of input.
					if(_features.touch) {
						_downEvents += ' mousedown';
						_upMoveEvents += ' mousemove mouseup';
						_globalEventHandlers.mousedown = _globalEventHandlers[_dragStartEvent];
						_globalEventHandlers.mousemove = _globalEventHandlers[_dragMoveEvent];
						_globalEventHandlers.mouseup = _globalEventHandlers[_dragEndEvent];
					}

					if(!_likelyTouchDevice) {
						// don't allow pan to next slide from zoomed state on Desktop
						_options.allowPanToNext = false;
					}
				}

			}
		});


		/*>>gestures*/

		/*>>show-hide-transition*/
		/**
		 * show-hide-transition.js:
		 *
		 * Manages initial opening or closing transition.
		 *
		 * If you're not planning to use transition for gallery at all,
		 * you may set options hideAnimationDuration and showAnimationDuration to 0,
		 * and just delete startAnimation function.
		 *
		 */


		var _showOrHideTimeout,
			_showOrHide = function(item, img, out, completeFn) {

				if(_showOrHideTimeout) {
					clearTimeout(_showOrHideTimeout);
				}

				_initialZoomRunning = true;
				_initialContentSet = true;

				// dimensions of small thumbnail {x:,y:,w:}.
				// Height is optional, as calculated based on large image.
				var thumbBounds;
				if(item.initialLayout) {
					thumbBounds = item.initialLayout;
					item.initialLayout = null;
				} else {
					thumbBounds = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
				}

				var duration = out ? _options.hideAnimationDuration : _options.showAnimationDuration;

				var onComplete = function() {
					_stopAnimation('initialZoom');
					if(!out) {
						_applyBgOpacity(1);
						if(img) {
							img.style.display = 'block';
						}
						framework.addClass(template, 'pswp--animated-in');
						_shout('initialZoom' + (out ? 'OutEnd' : 'InEnd'));
					} else {
						self.template.removeAttribute('style');
						self.bg.removeAttribute('style');
					}

					if(completeFn) {
						completeFn();
					}
					_initialZoomRunning = false;
				};

				// if bounds aren't provided, just open gallery without animation
				if(!duration || !thumbBounds || thumbBounds.x === undefined) {

					_shout('initialZoom' + (out ? 'Out' : 'In') );

					_currZoomLevel = item.initialZoomLevel;
					_equalizePoints(_panOffset,  item.initialPosition );
					_applyCurrentZoomPan();

					template.style.opacity = out ? 0 : 1;
					_applyBgOpacity(1);

					if(duration) {
						setTimeout(function() {
							onComplete();
						}, duration);
					} else {
						onComplete();
					}

					return;
				}

				var startAnimation = function() {
					var closeWithRaf = _closedByScroll,
						fadeEverything = !self.currItem.src || self.currItem.loadError || _options.showHideOpacity;

					// apply hw-acceleration to image
					if(item.miniImg) {
						item.miniImg.style.webkitBackfaceVisibility = 'hidden';
					}

					if(!out) {
						_currZoomLevel = thumbBounds.w / item.w;
						_panOffset.x = thumbBounds.x;
						_panOffset.y = thumbBounds.y - _initalWindowScrollY;

						self[fadeEverything ? 'template' : 'bg'].style.opacity = 0.001;
						_applyCurrentZoomPan();
					}

					_registerStartAnimation('initialZoom');

					if(out && !closeWithRaf) {
						framework.removeClass(template, 'pswp--animated-in');
					}

					if(fadeEverything) {
						if(out) {
							framework[ (closeWithRaf ? 'remove' : 'add') + 'Class' ](template, 'pswp--animate_opacity');
						} else {
							setTimeout(function() {
								framework.addClass(template, 'pswp--animate_opacity');
							}, 30);
						}
					}

					_showOrHideTimeout = setTimeout(function() {

						_shout('initialZoom' + (out ? 'Out' : 'In') );


						if(!out) {

							// "in" animation always uses CSS transitions (instead of rAF).
							// CSS transition work faster here,
							// as developer may also want to animate other things,
							// like ui on top of sliding area, which can be animated just via CSS

							_currZoomLevel = item.initialZoomLevel;
							_equalizePoints(_panOffset,  item.initialPosition );
							_applyCurrentZoomPan();
							_applyBgOpacity(1);

							if(fadeEverything) {
								template.style.opacity = 1;
							} else {
								_applyBgOpacity(1);
							}

							_showOrHideTimeout = setTimeout(onComplete, duration + 20);
						} else {

							// "out" animation uses rAF only when PhotoSwipe is closed by browser scroll, to recalculate position
							var destZoomLevel = thumbBounds.w / item.w,
								initialPanOffset = {
									x: _panOffset.x,
									y: _panOffset.y
								},
								initialZoomLevel = _currZoomLevel,
								initalBgOpacity = _bgOpacity,
								onUpdate = function(now) {

									if(now === 1) {
										_currZoomLevel = destZoomLevel;
										_panOffset.x = thumbBounds.x;
										_panOffset.y = thumbBounds.y  - _currentWindowScrollY;
									} else {
										_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
										_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
										_panOffset.y = (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
									}

									_applyCurrentZoomPan();
									if(fadeEverything) {
										template.style.opacity = 1 - now;
									} else {
										_applyBgOpacity( initalBgOpacity - now * initalBgOpacity );
									}
								};

							if(closeWithRaf) {
								_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete);
							} else {
								onUpdate(1);
								_showOrHideTimeout = setTimeout(onComplete, duration + 20);
							}
						}

					}, out ? 25 : 90); // Main purpose of this delay is to give browser time to paint and
					// create composite layers of PhotoSwipe UI parts (background, controls, caption, arrows).
					// Which avoids lag at the beginning of scale transition.
				};
				startAnimation();


			};

		/*>>show-hide-transition*/

		/*>>items-controller*/
		/**
		 *
		 * Controller manages gallery items, their dimensions, and their content.
		 *
		 */

		var _items,
			_tempPanAreaSize = {},
			_imagesToAppendPool = [],
			_initialContentSet,
			_initialZoomRunning,
			_controllerDefaultOptions = {
				index: 0,
				errorMsg: '<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',
				forceProgressiveLoading: false, // TODO
				preload: [1,1],
				getNumItemsFn: function() {
					return _items.length;
				}
			};


		var _getItemAt,
			_getNumItems,
			_initialIsLoop,
			_getZeroBounds = function() {
				return {
					center:{x:0,y:0},
					max:{x:0,y:0},
					min:{x:0,y:0}
				};
			},
			_calculateSingleItemPanBounds = function(item, realPanElementW, realPanElementH ) {
				var bounds = item.bounds;

				// position of element when it's centered
				bounds.center.x = Math.round((_tempPanAreaSize.x - realPanElementW) / 2);
				bounds.center.y = Math.round((_tempPanAreaSize.y - realPanElementH) / 2) + item.vGap.top;

				// maximum pan position
				bounds.max.x = (realPanElementW > _tempPanAreaSize.x) ?
					Math.round(_tempPanAreaSize.x - realPanElementW) :
					bounds.center.x;

				bounds.max.y = (realPanElementH > _tempPanAreaSize.y) ?
					Math.round(_tempPanAreaSize.y - realPanElementH) + item.vGap.top :
					bounds.center.y;

				// minimum pan position
				bounds.min.x = (realPanElementW > _tempPanAreaSize.x) ? 0 : bounds.center.x;
				bounds.min.y = (realPanElementH > _tempPanAreaSize.y) ? item.vGap.top : bounds.center.y;
			},
			_calculateItemSize = function(item, viewportSize, zoomLevel) {

				if (item.src && !item.loadError) {
					var isInitial = !zoomLevel;

					if(isInitial) {
						if(!item.vGap) {
							item.vGap = {top:0,bottom:0};
						}
						// allows overriding vertical margin for individual items
						_shout('parseVerticalMargin', item);
					}


					_tempPanAreaSize.x = viewportSize.x;
					_tempPanAreaSize.y = viewportSize.y - item.vGap.top - item.vGap.bottom;

					if (isInitial) {
						var hRatio = _tempPanAreaSize.x / item.w;
						var vRatio = _tempPanAreaSize.y / item.h;

						item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
						//item.fillRatio = hRatio > vRatio ? hRatio : vRatio;

						var scaleMode = _options.scaleMode;

						if (scaleMode === 'orig') {
							zoomLevel = 1;
						} else if (scaleMode === 'fit') {
							zoomLevel = item.fitRatio;
						}

						if (zoomLevel > 1) {
							zoomLevel = 1;
						}

						item.initialZoomLevel = zoomLevel;

						if(!item.bounds) {
							// reuse bounds object
							item.bounds = _getZeroBounds();
						}
					}

					if(!zoomLevel) {
						return;
					}

					_calculateSingleItemPanBounds(item, item.w * zoomLevel, item.h * zoomLevel);

					if (isInitial && zoomLevel === item.initialZoomLevel) {
						item.initialPosition = item.bounds.center;
					}

					return item.bounds;
				} else {
					item.w = item.h = 0;
					item.initialZoomLevel = item.fitRatio = 1;
					item.bounds = _getZeroBounds();
					item.initialPosition = item.bounds.center;

					// if it's not image, we return zero bounds (content is not zoomable)
					return item.bounds;
				}

			},




			_appendImage = function(index, item, baseDiv, img, preventAnimation, keepPlaceholder) {


				if(item.loadError) {
					return;
				}

				if(img) {

					item.imageAppended = true;
					_setImageSize(item, img, (item === self.currItem && _renderMaxResolution) );

					baseDiv.appendChild(img);

					if(keepPlaceholder) {
						setTimeout(function() {
							if(item && item.loaded && item.placeholder) {
								item.placeholder.style.display = 'none';
								item.placeholder = null;
							}
						}, 500);
					}
				}
			},



			_preloadImage = function(item) {
				item.loading = true;
				item.loaded = false;
				var img = item.img = framework.createEl('pswp__img', 'img');
				var onComplete = function() {
					item.loading = false;
					item.loaded = true;

					if(item.loadComplete) {
						item.loadComplete(item);
					} else {
						item.img = null; // no need to store image object
					}
					img.onload = img.onerror = null;
					img = null;
				};
				img.onload = onComplete;
				img.onerror = function() {
					item.loadError = true;
					onComplete();
				};

				img.src = item.src;// + '?a=' + Math.random();

				return img;
			},
			_checkForError = function(item, cleanUp) {
				if(item.src && item.loadError && item.container) {

					if(cleanUp) {
						item.container.innerHTML = '';
					}

					item.container.innerHTML = _options.errorMsg.replace('%url%',  item.src );
					return true;

				}
			},
			_setImageSize = function(item, img, maxRes) {
				if(!item.src) {
					return;
				}

				if(!img) {
					img = item.container.lastChild;
				}

				var w = maxRes ? item.w : Math.round(item.w * item.fitRatio),
					h = maxRes ? item.h : Math.round(item.h * item.fitRatio);

				if(item.placeholder && !item.loaded) {
					item.placeholder.style.width = w + 'px';
					item.placeholder.style.height = h + 'px';
				}

				img.style.width = w + 'px';
				img.style.height = h + 'px';
			},
			_appendImagesPool = function() {

				if(_imagesToAppendPool.length) {
					var poolItem;

					for(var i = 0; i < _imagesToAppendPool.length; i++) {
						poolItem = _imagesToAppendPool[i];
						if( poolItem.holder.index === poolItem.index ) {
							_appendImage(poolItem.index, poolItem.item, poolItem.baseDiv, poolItem.img, false, poolItem.clearPlaceholder);
						}
					}
					_imagesToAppendPool = [];
				}
			};



		_registerModule('Controller', {

			publicMethods: {

				lazyLoadItem: function(index) {
					index = _getLoopedId(index);
					var item = _getItemAt(index);

					if(!item || ((item.loaded || item.loading) && !_itemsNeedUpdate)) {
						return;
					}

					_shout('gettingData', index, item);

					if (!item.src) {
						return;
					}

					_preloadImage(item);
				},
				initController: function() {
					framework.extend(_options, _controllerDefaultOptions, true);
					self.items = _items = items;
					_getItemAt = self.getItemAt;
					_getNumItems = _options.getNumItemsFn; //self.getNumItems;



					_initialIsLoop = _options.loop;
					if(_getNumItems() < 3) {
						_options.loop = false; // disable loop if less then 3 items
					}

					_listen('beforeChange', function(diff) {

						var p = _options.preload,
							isNext = diff === null ? true : (diff >= 0),
							preloadBefore = Math.min(p[0], _getNumItems() ),
							preloadAfter = Math.min(p[1], _getNumItems() ),
							i;


						for(i = 1; i <= (isNext ? preloadAfter : preloadBefore); i++) {
							self.lazyLoadItem(_currentItemIndex+i);
						}
						for(i = 1; i <= (isNext ? preloadBefore : preloadAfter); i++) {
							self.lazyLoadItem(_currentItemIndex-i);
						}
					});

					_listen('initialLayout', function() {
						self.currItem.initialLayout = _options.getThumbBoundsFn && _options.getThumbBoundsFn(_currentItemIndex);
					});

					_listen('mainScrollAnimComplete', _appendImagesPool);
					_listen('initialZoomInEnd', _appendImagesPool);



					_listen('destroy', function() {
						var item;
						for(var i = 0; i < _items.length; i++) {
							item = _items[i];
							// remove reference to DOM elements, for GC
							if(item.container) {
								item.container = null;
							}
							if(item.placeholder) {
								item.placeholder = null;
							}
							if(item.img) {
								item.img = null;
							}
							if(item.preloader) {
								item.preloader = null;
							}
							if(item.loadError) {
								item.loaded = item.loadError = false;
							}
						}
						_imagesToAppendPool = null;
					});
				},


				getItemAt: function(index) {
					if (index >= 0) {
						return _items[index] !== undefined ? _items[index] : false;
					}
					return false;
				},

				allowProgressiveImg: function() {
					// 1. Progressive image loading isn't working on webkit/blink
					//    when hw-acceleration (e.g. translateZ) is applied to IMG element.
					//    That's why in PhotoSwipe parent element gets zoom transform, not image itself.
					//
					// 2. Progressive image loading sometimes blinks in webkit/blink when applying animation to parent element.
					//    That's why it's disabled on touch devices (mainly because of swipe transition)
					//
					// 3. Progressive image loading sometimes doesn't work in IE (up to 11).

					// Don't allow progressive loading on non-large touch devices
					return _options.forceProgressiveLoading || !_likelyTouchDevice || _options.mouseUsed || screen.width > 1200;
					// 1200 - to eliminate touch devices with large screen (like Chromebook Pixel)
				},

				setContent: function(holder, index) {

					if(_options.loop) {
						index = _getLoopedId(index);
					}

					var prevItem = self.getItemAt(holder.index);
					if(prevItem) {
						prevItem.container = null;
					}

					var item = self.getItemAt(index),
						img;

					if(!item) {
						holder.el.innerHTML = '';
						return;
					}

					// allow to override data
					_shout('gettingData', index, item);

					holder.index = index;
					holder.item = item;

					// base container DIV is created only once for each of 3 holders
					var baseDiv = item.container = framework.createEl('pswp__zoom-wrap');



					if(!item.src && item.html) {
						if(item.html.tagName) {
							baseDiv.appendChild(item.html);
						} else {
							baseDiv.innerHTML = item.html;
						}
					}

					_checkForError(item);

					_calculateItemSize(item, _viewportSize);

					if(item.src && !item.loadError && !item.loaded) {

						item.loadComplete = function(item) {

							// gallery closed before image finished loading
							if(!_isOpen) {
								return;
							}

							// check if holder hasn't changed while image was loading
							if(holder && holder.index === index ) {
								if( _checkForError(item, true) ) {
									item.loadComplete = item.img = null;
									_calculateItemSize(item, _viewportSize);
									_applyZoomPanToItem(item);

									if(holder.index === _currentItemIndex) {
										// recalculate dimensions
										self.updateCurrZoomItem();
									}
									return;
								}
								if( !item.imageAppended ) {
									if(_features.transform && (_mainScrollAnimating || _initialZoomRunning) ) {
										_imagesToAppendPool.push({
											item:item,
											baseDiv:baseDiv,
											img:item.img,
											index:index,
											holder:holder,
											clearPlaceholder:true
										});
									} else {
										_appendImage(index, item, baseDiv, item.img, _mainScrollAnimating || _initialZoomRunning, true);
									}
								} else {
									// remove preloader & mini-img
									if(!_initialZoomRunning && item.placeholder) {
										item.placeholder.style.display = 'none';
										item.placeholder = null;
									}
								}
							}

							item.loadComplete = null;
							item.img = null; // no need to store image element after it's added

							_shout('imageLoadComplete', index, item);
						};

						if(framework.features.transform) {

							var placeholderClassName = 'pswp__img pswp__img--placeholder';
							placeholderClassName += (item.msrc ? '' : ' pswp__img--placeholder--blank');

							var placeholder = framework.createEl(placeholderClassName, item.msrc ? 'img' : '');
							if(item.msrc) {
								placeholder.src = item.msrc;
							}

							_setImageSize(item, placeholder);

							baseDiv.appendChild(placeholder);
							item.placeholder = placeholder;

						}




						if(!item.loading) {
							_preloadImage(item);
						}


						if( self.allowProgressiveImg() ) {
							// just append image
							if(!_initialContentSet && _features.transform) {
								_imagesToAppendPool.push({
									item:item,
									baseDiv:baseDiv,
									img:item.img,
									index:index,
									holder:holder
								});
							} else {
								_appendImage(index, item, baseDiv, item.img, true, true);
							}
						}

					} else if(item.src && !item.loadError) {
						// image object is created every time, due to bugs of image loading & delay when switching images
						img = framework.createEl('pswp__img', 'img');
						img.style.opacity = 1;
						img.src = item.src;
						_setImageSize(item, img);
						_appendImage(index, item, baseDiv, img, true);
					}


					if(!_initialContentSet && index === _currentItemIndex) {
						_currZoomElementStyle = baseDiv.style;
						_showOrHide(item, (img ||item.img) );
					} else {
						_applyZoomPanToItem(item);
					}

					holder.el.innerHTML = '';
					holder.el.appendChild(baseDiv);
				},

				cleanSlide: function( item ) {
					if(item.img ) {
						item.img.onload = item.img.onerror = null;
					}
					item.loaded = item.loading = item.img = item.imageAppended = false;
				}

			}
		});

		/*>>items-controller*/

		/*>>tap*/
		/**
		 * tap.js:
		 *
		 * Displatches tap and double-tap events.
		 *
		 */

		var tapTimer,
			tapReleasePoint = {},
			_dispatchTapEvent = function(origEvent, releasePoint, pointerType) {
				var e = document.createEvent( 'CustomEvent' ),
					eDetail = {
						origEvent:origEvent,
						target:origEvent.target,
						releasePoint: releasePoint,
						pointerType:pointerType || 'touch'
					};

				e.initCustomEvent( 'pswpTap', true, true, eDetail );
				origEvent.target.dispatchEvent(e);
			};

		_registerModule('Tap', {
			publicMethods: {
				initTap: function() {
					_listen('firstTouchStart', self.onTapStart);
					_listen('touchRelease', self.onTapRelease);
					_listen('destroy', function() {
						tapReleasePoint = {};
						tapTimer = null;
					});
				},
				onTapStart: function(touchList) {
					if(touchList.length > 1) {
						clearTimeout(tapTimer);
						tapTimer = null;
					}
				},
				onTapRelease: function(e, releasePoint) {
					if(!releasePoint) {
						return;
					}

					if(!_moved && !_isMultitouch && !_numAnimations) {
						var p0 = releasePoint;
						if(tapTimer) {
							clearTimeout(tapTimer);
							tapTimer = null;

							// Check if taped on the same place
							if ( _isNearbyPoints(p0, tapReleasePoint) ) {
								_shout('doubleTap', p0);
								return;
							}
						}

						if(releasePoint.type === 'mouse') {
							_dispatchTapEvent(e, releasePoint, 'mouse');
							return;
						}

						var clickedTagName = e.target.tagName.toUpperCase();
						// avoid double tap delay on buttons and elements that have class pswp__single-tap
						if(clickedTagName === 'BUTTON' || framework.hasClass(e.target, 'pswp__single-tap') ) {
							_dispatchTapEvent(e, releasePoint);
							return;
						}

						_equalizePoints(tapReleasePoint, p0);

						tapTimer = setTimeout(function() {
							_dispatchTapEvent(e, releasePoint);
							tapTimer = null;
						}, 300);
					}
				}
			}
		});

		/*>>tap*/

		/*>>desktop-zoom*/
		/**
		 *
		 * desktop-zoom.js:
		 *
		 * - Binds mousewheel event for paning zoomed image.
		 * - Manages "dragging", "zoomed-in", "zoom-out" classes.
		 *   (which are used for cursors and zoom icon)
		 * - Adds toggleDesktopZoom function.
		 *
		 */

		var _wheelDelta;

		_registerModule('DesktopZoom', {

			publicMethods: {

				initDesktopZoom: function() {

					if(_oldIE) {
						// no zoom for old IE (<=8)
						return;
					}

					if(_likelyTouchDevice) {
						// if detected hardware touch support, we wait until mouse is used,
						// and only then apply desktop-zoom features
						_listen('mouseUsed', function() {
							self.setupDesktopZoom();
						});
					} else {
						self.setupDesktopZoom(true);
					}

				},

				setupDesktopZoom: function(onInit) {

					_wheelDelta = {};

					var events = 'wheel mousewheel DOMMouseScroll';

					_listen('bindEvents', function() {
						framework.bind(template, events,  self.handleMouseWheel);
					});

					_listen('unbindEvents', function() {
						if(_wheelDelta) {
							framework.unbind(template, events, self.handleMouseWheel);
						}
					});

					self.mouseZoomedIn = false;

					var hasDraggingClass,
						updateZoomable = function() {
							if(self.mouseZoomedIn) {
								framework.removeClass(template, 'pswp--zoomed-in');
								self.mouseZoomedIn = false;
							}
							if(_currZoomLevel < 1) {
								framework.addClass(template, 'pswp--zoom-allowed');
							} else {
								framework.removeClass(template, 'pswp--zoom-allowed');
							}
							removeDraggingClass();
						},
						removeDraggingClass = function() {
							if(hasDraggingClass) {
								framework.removeClass(template, 'pswp--dragging');
								hasDraggingClass = false;
							}
						};

					_listen('resize' , updateZoomable);
					_listen('afterChange' , updateZoomable);
					_listen('pointerDown', function() {
						if(self.mouseZoomedIn) {
							hasDraggingClass = true;
							framework.addClass(template, 'pswp--dragging');
						}
					});
					_listen('pointerUp', removeDraggingClass);

					if(!onInit) {
						updateZoomable();
					}

				},

				handleMouseWheel: function(e) {

					if(_currZoomLevel <= self.currItem.fitRatio) {
						if( _options.modal ) {

							if (!_options.closeOnScroll || _numAnimations || _isDragging) {
								e.preventDefault();
							} else if(_transformKey && Math.abs(e.deltaY) > 2) {
								// close PhotoSwipe
								// if browser supports transforms & scroll changed enough
								_closedByScroll = true;
								self.close();
							}

						}
						return true;
					}

					// allow just one event to fire
					e.stopPropagation();

					// https://developer.mozilla.org/en-US/docs/Web/Events/wheel
					_wheelDelta.x = 0;

					if('deltaX' in e) {
						if(e.deltaMode === 1 /* DOM_DELTA_LINE */) {
							// 18 - average line height
							_wheelDelta.x = e.deltaX * 18;
							_wheelDelta.y = e.deltaY * 18;
						} else {
							_wheelDelta.x = e.deltaX;
							_wheelDelta.y = e.deltaY;
						}
					} else if('wheelDelta' in e) {
						if(e.wheelDeltaX) {
							_wheelDelta.x = -0.16 * e.wheelDeltaX;
						}
						if(e.wheelDeltaY) {
							_wheelDelta.y = -0.16 * e.wheelDeltaY;
						} else {
							_wheelDelta.y = -0.16 * e.wheelDelta;
						}
					} else if('detail' in e) {
						_wheelDelta.y = e.detail;
					} else {
						return;
					}

					_calculatePanBounds(_currZoomLevel, true);

					var newPanX = _panOffset.x - _wheelDelta.x,
						newPanY = _panOffset.y - _wheelDelta.y;

					// only prevent scrolling in nonmodal mode when not at edges
					if (_options.modal ||
						(
							newPanX <= _currPanBounds.min.x && newPanX >= _currPanBounds.max.x &&
							newPanY <= _currPanBounds.min.y && newPanY >= _currPanBounds.max.y
						) ) {
						e.preventDefault();
					}

					// TODO: use rAF instead of mousewheel?
					self.panTo(newPanX, newPanY);
				},

				toggleDesktopZoom: function(centerPoint) {
					centerPoint = centerPoint || {x:_viewportSize.x/2 + _offset.x, y:_viewportSize.y/2 + _offset.y };

					var doubleTapZoomLevel = _options.getDoubleTapZoom(true, self.currItem);
					var zoomOut = _currZoomLevel === doubleTapZoomLevel;

					self.mouseZoomedIn = !zoomOut;

					self.zoomTo(zoomOut ? self.currItem.initialZoomLevel : doubleTapZoomLevel, centerPoint, 333);
					framework[ (!zoomOut ? 'add' : 'remove') + 'Class'](template, 'pswp--zoomed-in');
				}

			}
		});


		/*>>desktop-zoom*/

		/*>>history*/
		/**
		 *
		 * history.js:
		 *
		 * - Back button to close gallery.
		 *
		 * - Unique URL for each slide: example.com/&pid=1&gid=3
		 *   (where PID is picture index, and GID and gallery index)
		 *
		 * - Switch URL when slides change.
		 *
		 */


		var _historyDefaultOptions = {
			history: true,
			galleryUID: 1
		};

		var _historyUpdateTimeout,
			_hashChangeTimeout,
			_hashAnimCheckTimeout,
			_hashChangedByScript,
			_hashChangedByHistory,
			_hashReseted,
			_initialHash,
			_historyChanged,
			_closedFromURL,
			_urlChangedOnce,
			_windowLoc,

			_supportsPushState,

			_getHash = function() {
				return _windowLoc.hash.substring(1);
			},
			_cleanHistoryTimeouts = function() {

				if(_historyUpdateTimeout) {
					clearTimeout(_historyUpdateTimeout);
				}

				if(_hashAnimCheckTimeout) {
					clearTimeout(_hashAnimCheckTimeout);
				}
			},

			// pid - Picture index
			// gid - Gallery index
			_parseItemIndexFromURL = function() {
				var hash = _getHash(),
					params = {};

				if(hash.length < 5) { // pid=1
					return params;
				}

				var i, vars = hash.split('&');
				for (i = 0; i < vars.length; i++) {
					if(!vars[i]) {
						continue;
					}
					var pair = vars[i].split('=');
					if(pair.length < 2) {
						continue;
					}
					params[pair[0]] = pair[1];
				}
				if(_options.galleryPIDs) {
					// detect custom pid in hash and search for it among the items collection
					var searchfor = params.pid;
					params.pid = 0; // if custom pid cannot be found, fallback to the first item
					for(i = 0; i < _items.length; i++) {
						if(_items[i].pid === searchfor) {
							params.pid = i;
							break;
						}
					}
				} else {
					params.pid = parseInt(params.pid,10)-1;
				}
				if( params.pid < 0 ) {
					params.pid = 0;
				}
				return params;
			},
			_updateHash = function() {

				if(_hashAnimCheckTimeout) {
					clearTimeout(_hashAnimCheckTimeout);
				}


				if(_numAnimations || _isDragging) {
					// changing browser URL forces layout/paint in some browsers, which causes noticable lag during animation
					// that's why we update hash only when no animations running
					_hashAnimCheckTimeout = setTimeout(_updateHash, 500);
					return;
				}

				if(_hashChangedByScript) {
					clearTimeout(_hashChangeTimeout);
				} else {
					_hashChangedByScript = true;
				}


				var pid = (_currentItemIndex + 1);
				var item = _getItemAt( _currentItemIndex );
				if(item.hasOwnProperty('pid')) {
					// carry forward any custom pid assigned to the item
					pid = item.pid;
				}
				var newHash = _initialHash + '&'  +  'gid=' + _options.galleryUID + '&' + 'pid=' + pid;

				if(!_historyChanged) {
					if(_windowLoc.hash.indexOf(newHash) === -1) {
						_urlChangedOnce = true;
					}
					// first time - add new hisory record, then just replace
				}

				var newURL = _windowLoc.href.split('#')[0] + '#' +  newHash;

				if( _supportsPushState ) {

					if('#' + newHash !== window.location.hash) {
						history[_historyChanged ? 'replaceState' : 'pushState']('', document.title, newURL);
					}

				} else {
					if(_historyChanged) {
						_windowLoc.replace( newURL );
					} else {
						_windowLoc.hash = newHash;
					}
				}



				_historyChanged = true;
				_hashChangeTimeout = setTimeout(function() {
					_hashChangedByScript = false;
				}, 60);
			};





		_registerModule('History', {



			publicMethods: {
				initHistory: function() {

					framework.extend(_options, _historyDefaultOptions, true);

					if( !_options.history ) {
						return;
					}


					_windowLoc = window.location;
					_urlChangedOnce = false;
					_closedFromURL = false;
					_historyChanged = false;
					_initialHash = _getHash();
					_supportsPushState = ('pushState' in history);


					if(_initialHash.indexOf('gid=') > -1) {
						_initialHash = _initialHash.split('&gid=')[0];
						_initialHash = _initialHash.split('?gid=')[0];
					}


					_listen('afterChange', self.updateURL);
					_listen('unbindEvents', function() {
						framework.unbind(window, 'hashchange', self.onHashChange);
					});


					var returnToOriginal = function() {
						_hashReseted = true;
						if(!_closedFromURL) {

							if(_urlChangedOnce) {
								history.back();
							} else {

								if(_initialHash) {
									_windowLoc.hash = _initialHash;
								} else {
									if (_supportsPushState) {

										// remove hash from url without refreshing it or scrolling to top
										history.pushState('', document.title,  _windowLoc.pathname + _windowLoc.search );
									} else {
										_windowLoc.hash = '';
									}
								}
							}

						}

						_cleanHistoryTimeouts();
					};


					_listen('unbindEvents', function() {
						if(_closedByScroll) {
							// if PhotoSwipe is closed by scroll, we go "back" before the closing animation starts
							// this is done to keep the scroll position
							returnToOriginal();
						}
					});
					_listen('destroy', function() {
						if(!_hashReseted) {
							returnToOriginal();
						}
					});
					_listen('firstUpdate', function() {
						_currentItemIndex = _parseItemIndexFromURL().pid;
					});




					var index = _initialHash.indexOf('pid=');
					if(index > -1) {
						_initialHash = _initialHash.substring(0, index);
						if(_initialHash.slice(-1) === '&') {
							_initialHash = _initialHash.slice(0, -1);
						}
					}


					setTimeout(function() {
						if(_isOpen) { // hasn't destroyed yet
							framework.bind(window, 'hashchange', self.onHashChange);
						}
					}, 40);

				},
				onHashChange: function() {

					if(_getHash() === _initialHash) {

						_closedFromURL = true;
						self.close();
						return;
					}
					if(!_hashChangedByScript) {

						_hashChangedByHistory = true;
						self.goTo( _parseItemIndexFromURL().pid );
						_hashChangedByHistory = false;
					}

				},
				updateURL: function() {

					// Delay the update of URL, to avoid lag during transition,
					// and to not to trigger actions like "refresh page sound" or "blinking favicon" to often

					_cleanHistoryTimeouts();


					if(_hashChangedByHistory) {
						return;
					}

					if(!_historyChanged) {
						_updateHash(); // first time
					} else {
						_historyUpdateTimeout = setTimeout(_updateHash, 800);
					}
				}

			}
		});


		/*>>history*/
		framework.extend(self, publicMethods); };
	return PhotoSwipe;
});



/*! PhotoSwipe Default UI - 4.1.2 - 2017-04-05
* http://photoswipe.com
* Copyright (c) 2017 Dmitry Semenov; */
/**
 *
 * UI on top of main sliding area (caption, arrows, close button, etc.).
 * Built just using public methods/properties of PhotoSwipe.
 *
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.PhotoSwipeUI_Default = factory();
	}
})(this, function () {

	'use strict';



	var PhotoSwipeUI_Default =
		function(pswp, framework) {

			var ui = this;
			var _overlayUIUpdated = false,
				_controlsVisible = true,
				_fullscrenAPI,
				_controls,
				_captionContainer,
				_fakeCaptionContainer,
				_indexIndicator,
				_shareButton,
				_shareModal,
				_shareModalHidden = true,
				_initalCloseOnScrollValue,
				_isIdle,
				_listen,

				_loadingIndicator,
				_loadingIndicatorHidden,
				_loadingIndicatorTimeout,

				_galleryHasOneSlide,

				_options,
				_defaultUIOptions = {
					barsSize: {top:44, bottom:'auto'},
					closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
					timeToIdle: 4000,
					timeToIdleOutside: 1000,
					loadingIndicatorDelay: 1000, // 2s

					addCaptionHTMLFn: function(item, captionEl /*, isFake */) {
						if(!item.title) {
							captionEl.children[0].innerHTML = '';
							return false;
						}
						captionEl.children[0].innerHTML = item.title;
						return true;
					},

					closeEl:true,
					captionEl: true,
					fullscreenEl: true,
					zoomEl: true,
					shareEl: true,
					counterEl: true,
					arrowEl: true,
					preloaderEl: true,

					tapToClose: false,
					tapToToggleControls: true,

					clickToCloseNonZoomable: true,

					shareButtons: [
						{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
						{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
						{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/'+
								'?url={{url}}&media={{image_url}}&description={{text}}'},
						{id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
					],
					getImageURLForShare: function( /* shareButtonData */ ) {
						return pswp.currItem.src || '';
					},
					getPageURLForShare: function( /* shareButtonData */ ) {
						return window.location.href;
					},
					getTextForShare: function( /* shareButtonData */ ) {
						return pswp.currItem.title || '';
					},

					indexIndicatorSep: ' / ',
					fitControlsWidth: 1200

				},
				_blockControlsTap,
				_blockControlsTapTimeout;



			var _onControlsTap = function(e) {
					if(_blockControlsTap) {
						return true;
					}


					e = e || window.event;

					if(_options.timeToIdle && _options.mouseUsed && !_isIdle) {
						// reset idle timer
						_onIdleMouseMove();
					}


					var target = e.target || e.srcElement,
						uiElement,
						clickedClass = target.getAttribute('class') || '',
						found;

					for(var i = 0; i < _uiElements.length; i++) {
						uiElement = _uiElements[i];
						if(uiElement.onTap && clickedClass.indexOf('pswp__' + uiElement.name ) > -1 ) {
							uiElement.onTap();
							found = true;

						}
					}

					if(found) {
						if(e.stopPropagation) {
							e.stopPropagation();
						}
						_blockControlsTap = true;

						// Some versions of Android don't prevent ghost click event
						// when preventDefault() was called on touchstart and/or touchend.
						//
						// This happens on v4.3, 4.2, 4.1,
						// older versions strangely work correctly,
						// but just in case we add delay on all of them)
						var tapDelay = framework.features.isOldAndroid ? 600 : 30;
						_blockControlsTapTimeout = setTimeout(function() {
							_blockControlsTap = false;
						}, tapDelay);
					}

				},
				_fitControlsInViewport = function() {
					return !pswp.likelyTouchDevice || _options.mouseUsed || screen.width > _options.fitControlsWidth;
				},
				_togglePswpClass = function(el, cName, add) {
					framework[ (add ? 'add' : 'remove') + 'Class' ](el, 'pswp__' + cName);
				},

				// add class when there is just one item in the gallery
				// (by default it hides left/right arrows and 1ofX counter)
				_countNumItems = function() {
					var hasOneSlide = (_options.getNumItemsFn() === 1);

					if(hasOneSlide !== _galleryHasOneSlide) {
						_togglePswpClass(_controls, 'ui--one-slide', hasOneSlide);
						_galleryHasOneSlide = hasOneSlide;
					}
				},
				_toggleShareModalClass = function() {
					_togglePswpClass(_shareModal, 'share-modal--hidden', _shareModalHidden);
				},
				_toggleShareModal = function() {

					_shareModalHidden = !_shareModalHidden;


					if(!_shareModalHidden) {
						_toggleShareModalClass();
						setTimeout(function() {
							if(!_shareModalHidden) {
								framework.addClass(_shareModal, 'pswp__share-modal--fade-in');
							}
						}, 30);
					} else {
						framework.removeClass(_shareModal, 'pswp__share-modal--fade-in');
						setTimeout(function() {
							if(_shareModalHidden) {
								_toggleShareModalClass();
							}
						}, 300);
					}

					if(!_shareModalHidden) {
						_updateShareURLs();
					}
					return false;
				},

				_openWindowPopup = function(e) {
					e = e || window.event;
					var target = e.target || e.srcElement;

					pswp.shout('shareLinkClick', e, target);

					if(!target.href) {
						return false;
					}

					if( target.hasAttribute('download') ) {
						return true;
					}

					window.open(target.href, 'pswp_share', 'scrollbars=yes,resizable=yes,toolbar=no,'+
						'location=yes,width=550,height=420,top=100,left=' +
						(window.screen ? Math.round(screen.width / 2 - 275) : 100)  );

					if(!_shareModalHidden) {
						_toggleShareModal();
					}

					return false;
				},
				_updateShareURLs = function() {
					var shareButtonOut = '',
						shareButtonData,
						shareURL,
						image_url,
						page_url,
						share_text;

					for(var i = 0; i < _options.shareButtons.length; i++) {
						shareButtonData = _options.shareButtons[i];

						image_url = _options.getImageURLForShare(shareButtonData);
						page_url = _options.getPageURLForShare(shareButtonData);
						share_text = _options.getTextForShare(shareButtonData);

						shareURL = shareButtonData.url.replace('{{url}}', encodeURIComponent(page_url) )
							.replace('{{image_url}}', encodeURIComponent(image_url) )
							.replace('{{raw_image_url}}', image_url )
							.replace('{{text}}', encodeURIComponent(share_text) );

						shareButtonOut += '<a href="' + shareURL + '" target="_blank" '+
							'class="pswp__share--' + shareButtonData.id + '"' +
							(shareButtonData.download ? 'download' : '') + '>' +
							shareButtonData.label + '</a>';

						if(_options.parseShareButtonOut) {
							shareButtonOut = _options.parseShareButtonOut(shareButtonData, shareButtonOut);
						}
					}
					_shareModal.children[0].innerHTML = shareButtonOut;
					_shareModal.children[0].onclick = _openWindowPopup;

				},
				_hasCloseClass = function(target) {
					for(var  i = 0; i < _options.closeElClasses.length; i++) {
						if( framework.hasClass(target, 'pswp__' + _options.closeElClasses[i]) ) {
							return true;
						}
					}
				},
				_idleInterval,
				_idleTimer,
				_idleIncrement = 0,
				_onIdleMouseMove = function() {
					clearTimeout(_idleTimer);
					_idleIncrement = 0;
					if(_isIdle) {
						ui.setIdle(false);
					}
				},
				_onMouseLeaveWindow = function(e) {
					e = e ? e : window.event;
					var from = e.relatedTarget || e.toElement;
					if (!from || from.nodeName === 'HTML') {
						clearTimeout(_idleTimer);
						_idleTimer = setTimeout(function() {
							ui.setIdle(true);
						}, _options.timeToIdleOutside);
					}
				},
				_setupFullscreenAPI = function() {
					if(_options.fullscreenEl && !framework.features.isOldAndroid) {
						if(!_fullscrenAPI) {
							_fullscrenAPI = ui.getFullscreenAPI();
						}
						if(_fullscrenAPI) {
							framework.bind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
							ui.updateFullscreen();
							framework.addClass(pswp.template, 'pswp--supports-fs');
						} else {
							framework.removeClass(pswp.template, 'pswp--supports-fs');
						}
					}
				},
				_setupLoadingIndicator = function() {
					// Setup loading indicator
					if(_options.preloaderEl) {

						_toggleLoadingIndicator(true);

						_listen('beforeChange', function() {

							clearTimeout(_loadingIndicatorTimeout);

							// display loading indicator with delay
							_loadingIndicatorTimeout = setTimeout(function() {

								if(pswp.currItem && pswp.currItem.loading) {

									if( !pswp.allowProgressiveImg() || (pswp.currItem.img && !pswp.currItem.img.naturalWidth)  ) {
										// show preloader if progressive loading is not enabled,
										// or image width is not defined yet (because of slow connection)
										_toggleLoadingIndicator(false);
										// items-controller.js function allowProgressiveImg
									}

								} else {
									_toggleLoadingIndicator(true); // hide preloader
								}

							}, _options.loadingIndicatorDelay);

						});
						_listen('imageLoadComplete', function(index, item) {
							if(pswp.currItem === item) {
								_toggleLoadingIndicator(true);
							}
						});

					}
				},
				_toggleLoadingIndicator = function(hide) {
					if( _loadingIndicatorHidden !== hide ) {
						_togglePswpClass(_loadingIndicator, 'preloader--active', !hide);
						_loadingIndicatorHidden = hide;
					}
				},
				_applyNavBarGaps = function(item) {
					var gap = item.vGap;

					if( _fitControlsInViewport() ) {

						var bars = _options.barsSize;
						if(_options.captionEl && bars.bottom === 'auto') {
							if(!_fakeCaptionContainer) {
								_fakeCaptionContainer = framework.createEl('pswp__caption pswp__caption--fake');
								_fakeCaptionContainer.appendChild( framework.createEl('pswp__caption__center') );
								_controls.insertBefore(_fakeCaptionContainer, _captionContainer);
								framework.addClass(_controls, 'pswp__ui--fit');
							}
							if( _options.addCaptionHTMLFn(item, _fakeCaptionContainer, true) ) {

								var captionSize = _fakeCaptionContainer.clientHeight;
								gap.bottom = parseInt(captionSize,10) || 44;
							} else {
								gap.bottom = bars.top; // if no caption, set size of bottom gap to size of top
							}
						} else {
							gap.bottom = bars.bottom === 'auto' ? 0 : bars.bottom;
						}

						// height of top bar is static, no need to calculate it
						gap.top = bars.top;
					} else {
						gap.top = gap.bottom = 0;
					}
				},
				_setupIdle = function() {
					// Hide controls when mouse is used
					if(_options.timeToIdle) {
						_listen('mouseUsed', function() {

							framework.bind(document, 'mousemove', _onIdleMouseMove);
							framework.bind(document, 'mouseout', _onMouseLeaveWindow);

							_idleInterval = setInterval(function() {
								_idleIncrement++;
								if(_idleIncrement === 2) {
									ui.setIdle(true);
								}
							}, _options.timeToIdle / 2);
						});
					}
				},
				_setupHidingControlsDuringGestures = function() {

					// Hide controls on vertical drag
					_listen('onVerticalDrag', function(now) {
						if(_controlsVisible && now < 0.95) {
							ui.hideControls();
						} else if(!_controlsVisible && now >= 0.95) {
							ui.showControls();
						}
					});

					// Hide controls when pinching to close
					var pinchControlsHidden;
					_listen('onPinchClose' , function(now) {
						if(_controlsVisible && now < 0.9) {
							ui.hideControls();
							pinchControlsHidden = true;
						} else if(pinchControlsHidden && !_controlsVisible && now > 0.9) {
							ui.showControls();
						}
					});

					_listen('zoomGestureEnded', function() {
						pinchControlsHidden = false;
						if(pinchControlsHidden && !_controlsVisible) {
							ui.showControls();
						}
					});

				};



			var _uiElements = [
				{
					name: 'caption',
					option: 'captionEl',
					onInit: function(el) {
						_captionContainer = el;
					}
				},
				{
					name: 'share-modal',
					option: 'shareEl',
					onInit: function(el) {
						_shareModal = el;
					},
					onTap: function() {
						_toggleShareModal();
					}
				},
				{
					name: 'button--share',
					option: 'shareEl',
					onInit: function(el) {
						_shareButton = el;
					},
					onTap: function() {
						_toggleShareModal();
					}
				},
				{
					name: 'button--zoom',
					option: 'zoomEl',
					onTap: pswp.toggleDesktopZoom
				},
				{
					name: 'counter',
					option: 'counterEl',
					onInit: function(el) {
						_indexIndicator = el;
					}
				},
				{
					name: 'button--close',
					option: 'closeEl',
					onTap: pswp.close
				},
				{
					name: 'button--arrow--left',
					option: 'arrowEl',
					onTap: pswp.prev
				},
				{
					name: 'button--arrow--right',
					option: 'arrowEl',
					onTap: pswp.next
				},
				{
					name: 'button--fs',
					option: 'fullscreenEl',
					onTap: function() {
						if(_fullscrenAPI.isFullscreen()) {
							_fullscrenAPI.exit();
						} else {
							_fullscrenAPI.enter();
						}
					}
				},
				{
					name: 'preloader',
					option: 'preloaderEl',
					onInit: function(el) {
						_loadingIndicator = el;
					}
				}

			];

			var _setupUIElements = function() {
				var item,
					classAttr,
					uiElement;

				var loopThroughChildElements = function(sChildren) {
					if(!sChildren) {
						return;
					}

					var l = sChildren.length;
					for(var i = 0; i < l; i++) {
						item = sChildren[i];
						classAttr = item.className;

						for(var a = 0; a < _uiElements.length; a++) {
							uiElement = _uiElements[a];

							if(classAttr.indexOf('pswp__' + uiElement.name) > -1  ) {

								if( _options[uiElement.option] ) { // if element is not disabled from options

									framework.removeClass(item, 'pswp__element--disabled');
									if(uiElement.onInit) {
										uiElement.onInit(item);
									}

									//item.style.display = 'block';
								} else {
									framework.addClass(item, 'pswp__element--disabled');
									//item.style.display = 'none';
								}
							}
						}
					}
				};
				loopThroughChildElements(_controls.children);

				var topBar =  framework.getChildByClass(_controls, 'pswp__top-bar');
				if(topBar) {
					loopThroughChildElements( topBar.children );
				}
			};




			ui.init = function() {

				// extend options
				framework.extend(pswp.options, _defaultUIOptions, true);

				// create local link for fast access
				_options = pswp.options;

				// find pswp__ui element
				_controls = framework.getChildByClass(pswp.scrollWrap, 'pswp__ui');

				// create local link
				_listen = pswp.listen;


				_setupHidingControlsDuringGestures();

				// update controls when slides change
				_listen('beforeChange', ui.update);

				// toggle zoom on double-tap
				_listen('doubleTap', function(point) {
					var initialZoomLevel = pswp.currItem.initialZoomLevel;
					if(pswp.getZoomLevel() !== initialZoomLevel) {
						pswp.zoomTo(initialZoomLevel, point, 333);
					} else {
						pswp.zoomTo(_options.getDoubleTapZoom(false, pswp.currItem), point, 333);
					}
				});

				// Allow text selection in caption
				_listen('preventDragEvent', function(e, isDown, preventObj) {
					var t = e.target || e.srcElement;
					if(
						t &&
						t.getAttribute('class') && e.type.indexOf('mouse') > -1 &&
						( t.getAttribute('class').indexOf('__caption') > 0 || (/(SMALL|STRONG|EM)/i).test(t.tagName) )
					) {
						preventObj.prevent = false;
					}
				});

				// bind events for UI
				_listen('bindEvents', function() {
					framework.bind(_controls, 'pswpTap click', _onControlsTap);
					framework.bind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);

					if(!pswp.likelyTouchDevice) {
						framework.bind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);
					}
				});

				// unbind events for UI
				_listen('unbindEvents', function() {
					if(!_shareModalHidden) {
						_toggleShareModal();
					}

					if(_idleInterval) {
						clearInterval(_idleInterval);
					}
					framework.unbind(document, 'mouseout', _onMouseLeaveWindow);
					framework.unbind(document, 'mousemove', _onIdleMouseMove);
					framework.unbind(_controls, 'pswpTap click', _onControlsTap);
					framework.unbind(pswp.scrollWrap, 'pswpTap', ui.onGlobalTap);
					framework.unbind(pswp.scrollWrap, 'mouseover', ui.onMouseOver);

					if(_fullscrenAPI) {
						framework.unbind(document, _fullscrenAPI.eventK, ui.updateFullscreen);
						if(_fullscrenAPI.isFullscreen()) {
							_options.hideAnimationDuration = 0;
							_fullscrenAPI.exit();
						}
						_fullscrenAPI = null;
					}
				});


				// clean up things when gallery is destroyed
				_listen('destroy', function() {
					if(_options.captionEl) {
						if(_fakeCaptionContainer) {
							_controls.removeChild(_fakeCaptionContainer);
						}
						framework.removeClass(_captionContainer, 'pswp__caption--empty');
					}

					if(_shareModal) {
						_shareModal.children[0].onclick = null;
					}
					framework.removeClass(_controls, 'pswp__ui--over-close');
					framework.addClass( _controls, 'pswp__ui--hidden');
					ui.setIdle(false);
				});


				if(!_options.showAnimationDuration) {
					framework.removeClass( _controls, 'pswp__ui--hidden');
				}
				_listen('initialZoomIn', function() {
					if(_options.showAnimationDuration) {
						framework.removeClass( _controls, 'pswp__ui--hidden');
					}
				});
				_listen('initialZoomOut', function() {
					framework.addClass( _controls, 'pswp__ui--hidden');
				});

				_listen('parseVerticalMargin', _applyNavBarGaps);

				_setupUIElements();

				if(_options.shareEl && _shareButton && _shareModal) {
					_shareModalHidden = true;
				}

				_countNumItems();

				_setupIdle();

				_setupFullscreenAPI();

				_setupLoadingIndicator();
			};

			ui.setIdle = function(isIdle) {
				_isIdle = isIdle;
				_togglePswpClass(_controls, 'ui--idle', isIdle);
			};

			ui.update = function() {
				// Don't update UI if it's hidden
				if(_controlsVisible && pswp.currItem) {

					ui.updateIndexIndicator();

					if(_options.captionEl) {
						_options.addCaptionHTMLFn(pswp.currItem, _captionContainer);

						_togglePswpClass(_captionContainer, 'caption--empty', !pswp.currItem.title);
					}

					_overlayUIUpdated = true;

				} else {
					_overlayUIUpdated = false;
				}

				if(!_shareModalHidden) {
					_toggleShareModal();
				}

				_countNumItems();
			};

			ui.updateFullscreen = function(e) {

				if(e) {
					// some browsers change window scroll position during the fullscreen
					// so PhotoSwipe updates it just in case
					setTimeout(function() {
						pswp.setScrollOffset( 0, framework.getScrollY() );
					}, 50);
				}

				// toogle pswp--fs class on root element
				framework[ (_fullscrenAPI.isFullscreen() ? 'add' : 'remove') + 'Class' ](pswp.template, 'pswp--fs');
			};

			ui.updateIndexIndicator = function() {
				if(_options.counterEl) {
					_indexIndicator.innerHTML = (pswp.getCurrentIndex()+1) +
						_options.indexIndicatorSep +
						_options.getNumItemsFn();
				}
			};

			ui.onGlobalTap = function(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;

				if(_blockControlsTap) {
					return;
				}

				if(e.detail && e.detail.pointerType === 'mouse') {

					// close gallery if clicked outside of the image
					if(_hasCloseClass(target)) {
						pswp.close();
						return;
					}

					if(framework.hasClass(target, 'pswp__img')) {
						if(pswp.getZoomLevel() === 1 && pswp.getZoomLevel() <= pswp.currItem.fitRatio) {
							if(_options.clickToCloseNonZoomable) {
								pswp.close();
							}
						} else {
							pswp.toggleDesktopZoom(e.detail.releasePoint);
						}
					}

				} else {

					// tap anywhere (except buttons) to toggle visibility of controls
					if(_options.tapToToggleControls) {
						if(_controlsVisible) {
							ui.hideControls();
						} else {
							ui.showControls();
						}
					}

					// tap to close gallery
					if(_options.tapToClose && (framework.hasClass(target, 'pswp__img') || _hasCloseClass(target)) ) {
						pswp.close();
						return;
					}

				}
			};
			ui.onMouseOver = function(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;

				// add class when mouse is over an element that should close the gallery
				_togglePswpClass(_controls, 'ui--over-close', _hasCloseClass(target));
			};

			ui.hideControls = function() {
				framework.addClass(_controls,'pswp__ui--hidden');
				_controlsVisible = false;
			};

			ui.showControls = function() {
				_controlsVisible = true;
				if(!_overlayUIUpdated) {
					ui.update();
				}
				framework.removeClass(_controls,'pswp__ui--hidden');
			};

			ui.supportsFullscreen = function() {
				var d = document;
				return !!(d.exitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen || d.msExitFullscreen);
			};

			ui.getFullscreenAPI = function() {
				var dE = document.documentElement,
					api,
					tF = 'fullscreenchange';

				if (dE.requestFullscreen) {
					api = {
						enterK: 'requestFullscreen',
						exitK: 'exitFullscreen',
						elementK: 'fullscreenElement',
						eventK: tF
					};

				} else if(dE.mozRequestFullScreen ) {
					api = {
						enterK: 'mozRequestFullScreen',
						exitK: 'mozCancelFullScreen',
						elementK: 'mozFullScreenElement',
						eventK: 'moz' + tF
					};



				} else if(dE.webkitRequestFullscreen) {
					api = {
						enterK: 'webkitRequestFullscreen',
						exitK: 'webkitExitFullscreen',
						elementK: 'webkitFullscreenElement',
						eventK: 'webkit' + tF
					};

				} else if(dE.msRequestFullscreen) {
					api = {
						enterK: 'msRequestFullscreen',
						exitK: 'msExitFullscreen',
						elementK: 'msFullscreenElement',
						eventK: 'MSFullscreenChange'
					};
				}

				if(api) {
					api.enter = function() {
						// disable close-on-scroll in fullscreen
						_initalCloseOnScrollValue = _options.closeOnScroll;
						_options.closeOnScroll = false;

						if(this.enterK === 'webkitRequestFullscreen') {
							pswp.template[this.enterK]( Element.ALLOW_KEYBOARD_INPUT );
						} else {
							return pswp.template[this.enterK]();
						}
					};
					api.exit = function() {
						_options.closeOnScroll = _initalCloseOnScrollValue;

						return document[this.exitK]();

					};
					api.isFullscreen = function() { return document[this.elementK]; };
				}

				return api;
			};



		};
	return PhotoSwipeUI_Default;


});

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
