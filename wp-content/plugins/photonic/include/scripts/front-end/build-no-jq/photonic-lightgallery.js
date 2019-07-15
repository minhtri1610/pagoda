	// Utility functions - Basic jQuery method replacements
	;(function(win) {
		"use strict";
		win.photonicUtils = function() {
			win.photonicUtils.hasClass = function(element, className) {
				if (element.classList) {
					return element.classList.contains(className);
				}
				else {
					return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
				}
			};

			win.photonicUtils.addClass = function(element, className) {
				if (!element) {
					return;
				}

				if (element.classList) {
					element.classList.add(className);
				}
				else {
					element.className += ' ' + className;
				}
			};

			win.photonicUtils.removeClass = function(element, className) {
				if (!element) {
					return;
				}

				if (element.classList) {
					element.classList.remove(className);
				}
				else {
					element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			};

			function ajax(method, url, args, callback) {
				var xhr = new XMLHttpRequest();
				xhr.open(method, url);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.onload = function() {
					if (xhr.status === 200) {
						var data = xhr.responseText;
						callback(data);
					}
				};
				xhr.send(encodeURI());
			}

			win.photonicUtils.post = function(url, args, callback) {
				ajax('POST', url, args, callback);
			};

			win.photonicUtils.get = function(url, args, callback) {
				ajax('GET', url, args, callback);
			};

			win.photonicUtils.closest = function (elem, selector) {
				// Element.matches() polyfill
				if (!Element.prototype.matches) {
					Element.prototype.matches =
						Element.prototype.matchesSelector ||
						Element.prototype.mozMatchesSelector ||
						Element.prototype.msMatchesSelector ||
						Element.prototype.oMatchesSelector ||
						Element.prototype.webkitMatchesSelector ||
						function(s) {
							var matches = (this.document || this.ownerDocument).querySelectorAll(s),
								i = matches.length;
							while (--i >= 0 && matches.item(i) !== this) {}
							return i > -1;
						};
				}

				// Get closest match
				for ( ; elem && elem !== document; elem = elem.parentNode ) {
					if ( elem.matches( selector ) ) return elem;
				}

				return null;
			};

			win.photonicUtils.parents = function ( elem, selector ) {

				// Element.matches() polyfill
				if (!Element.prototype.matches) {
					Element.prototype.matches =
						Element.prototype.matchesSelector ||
						Element.prototype.mozMatchesSelector ||
						Element.prototype.msMatchesSelector ||
						Element.prototype.oMatchesSelector ||
						Element.prototype.webkitMatchesSelector ||
						function(s) {
							var matches = (this.document || this.ownerDocument).querySelectorAll(s),
								i = matches.length;
							while (--i >= 0 && matches.item(i) !== this) {}
							return i > -1;
						};
				}

				// Setup parents array
				var parents = [];

				// Get matching parent elements
				for ( ; elem && elem !== document; elem = elem.parentNode ) {

					// Add matching parents to array
					if ( selector ) {
						if ( elem.matches( selector ) ) {
							parents.push( elem );
						}
					} else {
						parents.push( elem );
					}

				}

				return parents;

			};

			win.photonicUtils.getText = function(value){
				var txt = document.createElement("div");
				txt.innerHTML = value;
				return txt.innerText;
			};

			win.photonicUtils.getElement = function(value){
				var el = document.createElement("div");
				el.innerHTML = value;
				return el.innerHTML;
			};

			win.photonicUtils.click = function (elem) {
				// Create our event (with options)
				var evt = new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window
				});
				// If cancelled, don't dispatch our event
				var canceled = !elem.dispatchEvent(evt);
			};
		}
	})(window);
	// <-- End utility functions


// ImagesLoaded
(function(){"use strict";function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if("object"==typeof a){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if("object"===c)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:this.EventEmitter=a}).call(this),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):a.eventie=f}(this),function(a,b){"use strict";"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(c,d){return b(a,c,d)}):"object"==typeof module&&module.exports?module.exports=b(a,require("wolfy87-eventemitter"),require("eventie")):a.imagesLoaded=b(a,a.EventEmitter,a.eventie)}(window,function(a,b,c){function d(a,b){for(var c in b)a[c]=b[c];return a}function e(a){return"[object Array]"==l.call(a)}function f(a){var b=[];if(e(a))b=a;else if("number"==typeof a.length)for(var c=0;c<a.length;c++)b.push(a[c]);else b.push(a);return b}function g(a,b,c){if(!(this instanceof g))return new g(a,b,c);"string"==typeof a&&(a=document.querySelectorAll(a)),this.elements=f(a),this.options=d({},this.options),"function"==typeof b?c=b:d(this.options,b),c&&this.on("always",c),this.getImages(),j&&(this.jqDeferred=new j.Deferred);var e=this;setTimeout(function(){e.check()})}function h(a){this.img=a}function i(a,b){this.url=a,this.element=b,this.img=new Image}var j=a.jQuery,k=a.console,l=Object.prototype.toString;g.prototype=new b,g.prototype.options={},g.prototype.getImages=function(){this.images=[];for(var a=0;a<this.elements.length;a++){var b=this.elements[a];this.addElementImages(b)}},g.prototype.addElementImages=function(a){"IMG"==a.nodeName&&this.addImage(a),this.options.background===!0&&this.addElementBackgroundImages(a);var b=a.nodeType;if(b&&m[b]){for(var c=a.querySelectorAll("img"),d=0;d<c.length;d++){var e=c[d];this.addImage(e)}if("string"==typeof this.options.background){var f=a.querySelectorAll(this.options.background);for(d=0;d<f.length;d++){var g=f[d];this.addElementBackgroundImages(g)}}}};var m={1:!0,9:!0,11:!0};g.prototype.addElementBackgroundImages=function(a){for(var b=n(a),c=/url\(['"]*([^'"\)]+)['"]*\)/gi,d=c.exec(b.backgroundImage);null!==d;){var e=d&&d[1];e&&this.addBackground(e,a),d=c.exec(b.backgroundImage)}};var n=a.getComputedStyle||function(a){return a.currentStyle};return g.prototype.addImage=function(a){var b=new h(a);this.images.push(b)},g.prototype.addBackground=function(a,b){var c=new i(a,b);this.images.push(c)},g.prototype.check=function(){function a(a,c,d){setTimeout(function(){b.progress(a,c,d)})}var b=this;if(this.progressedCount=0,this.hasAnyBroken=!1,!this.images.length)return void this.complete();for(var c=0;c<this.images.length;c++){var d=this.images[c];d.once("progress",a),d.check()}},g.prototype.progress=function(a,b,c){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!a.isLoaded,this.emit("progress",this,a,b),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,a),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&k&&k.log("progress: "+c,a,b)},g.prototype.complete=function(){var a=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emit(a,this),this.emit("always",this),this.jqDeferred){var b=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[b](this)}},h.prototype=new b,h.prototype.check=function(){var a=this.getIsImageComplete();return a?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,c.bind(this.proxyImage,"load",this),c.bind(this.proxyImage,"error",this),c.bind(this.img,"load",this),c.bind(this.img,"error",this),void(this.proxyImage.src=this.img.src))},h.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},h.prototype.confirm=function(a,b){this.isLoaded=a,this.emit("progress",this,this.img,b)},h.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},h.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},h.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},h.prototype.unbindEvents=function(){c.unbind(this.proxyImage,"load",this),c.unbind(this.proxyImage,"error",this),c.unbind(this.img,"load",this),c.unbind(this.img,"error",this)},i.prototype=new h,i.prototype.check=function(){c.bind(this.img,"load",this),c.bind(this.img,"error",this),this.img.src=this.url;var a=this.getIsImageComplete();a&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},i.prototype.unbindEvents=function(){c.unbind(this.img,"load",this),c.unbind(this.img,"error",this)},i.prototype.confirm=function(a,b){this.isLoaded=a,this.emit("progress",this,this.element,b)},g.makeJQueryPlugin=function(b){b=b||a.jQuery,b&&(j=b,j.fn.imagesLoaded=function(a,b){var c=new g(this,a,b);return c.jqDeferred.promise(j(this))})},g.makeJQueryPlugin(),g});

// ModaliseJS (replaces jquery-ui-dialog)
!function i(l,s,c){function a(e,n){if(!s[e]){if(!l[e]){var t="function"==typeof require&&require;if(!n&&t)return t(e,!0);if(d)return d(e,!0);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}var r=s[e]={exports:{}};l[e][0].call(r.exports,function(n){return a(l[e][1][n]||n)},r,r.exports,i,l,s,c)}return s[e].exports}for(var d="function"==typeof require&&require,n=0;n<c.length;n++)a(c[n]);return a}({1:[function(o,l,n){!function(n,e){"use strict";var r=n.document,i=o("./utils/extend"),t=function(n,e){var t,o=this;return o.callbacks={},t={start:function(){o.events={onShow:new Event("onShow"),onConfirm:new Event("onConfirm"),onHide:new Event("onHide")},o.modal=r.getElementById(n),o.classClose=".close",o.classCancel=".cancel",o.classConfirm=".confirm",o.btnsOpen=[],o.utils={extend:i},o.utils.extend(o,e)}},this.show=function(){return o.modal.dispatchEvent(o.events.onShow),o.modal.style.display="block",o},this.hide=function(){return o.modal.dispatchEvent(o.events.onHide),o.modal.style.display="none",o},this.removeEvents=function(){var n=o.modal.cloneNode(!0);return o.modal.parentNode.replaceChild(n,o.modal),o.modal=n,o},this.on=function(n,e){return this.modal.addEventListener(n,e),o},this.attach=function(){for(var n=[],e=(n=o.modal.querySelectorAll(o.classClose)).length-1;0<=e;e--)n[e].addEventListener("click",function(){o.hide()});for(e=(n=o.modal.querySelectorAll(o.classCancel)).length-1;0<=e;e--)n[e].addEventListener("click",function(){o.hide()});for(e=(n=o.modal.querySelectorAll(o.classConfirm)).length-1;0<=e;e--)n[e].addEventListener("click",function(){o.modal.dispatchEvent(o.events.onConfirm),o.hide()});for(e=o.btnsOpen.length-1;0<=e;e--)o.btnsOpen[e].addEventListener("click",function(){o.show()});return o},this.addOpenBtn=function(n){o.btnsOpen.push(n)},t.start(),o};"function"==typeof define&&define.amd&&define(function(){return t}),l.exports=t,n.Modalise=t}(window)},{"./utils/extend":2}],2:[function(n,e,t){e.exports=function(n){for(var e,t=Array.prototype.slice.call(arguments,1),o=0;e=t[o];o++)if(e)for(var r in e)n[r]=e[r];return n}},{}]},{},[1]);

// PhotonicTooltip - jQuery-free tooltip; compressed - 2KB
!function(t){"use strict";window.photonicTooltip=function(t,e){var o,i,n,l=document.documentElement.querySelectorAll(t);function r(t){!function(t,e){var o=e.getAttribute("data-photonic-tooltip");if(""!==o){e.setAttribute("title",""),n=e.getBoundingClientRect();var i=document.createTextNode(o);t.appendChild(i),n.left>window.innerWidth-100?t.className="photonic-tooltip-container tooltip-left":n.left+n.width/2<100?t.className="photonic-tooltip-container tooltip-right":t.className="photonic-tooltip-container tooltip-center"}}(o,t.currentTarget),function(t,e){if(""!==e.getAttribute("data-photonic-tooltip")){void 0===n&&(n=e.getBoundingClientRect());var o=n.top+n.height+window.scrollY,i=window.innerWidth-100;if(n.left+window.scrollX>i&&n.width<50)t.style.left=n.left+window.scrollX-(t.offsetWidth+n.width)+"px",t.style.top=e.offsetTop+"px";else if(n.left+window.scrollX>i&&50<n.width)t.style.left=n.left+window.scrollX-t.offsetWidth-20+"px",t.style.top=e.offsetTop+"px";else if(n.left+window.scrollX+n.width/2<100)t.style.left=n.left+window.scrollX+n.width+20+"px",t.style.top=e.offsetTop+"px";else{var l=n.left+window.scrollX+n.width/2-t.offsetWidth/2;t.style.left=l+"px",t.style.top=o+"px"}}}(o,t.currentTarget)}function c(t){if(o.className=i+" no-display",""!==o.innerText){o.removeChild(o.firstChild),o.removeAttribute("style");var e=t.currentTarget;e.setAttribute("title",e.getAttribute("data-photonic-tooltip"))}}null!==(o=document.documentElement.querySelector(e))&&0!==o.length||(o=document.createElement("div"),i=e.replace(/^\.+/g,""),o.className=i,document.body.appendChild(o)),Array.prototype.forEach.call(l,function(t){t.addEventListener("mouseenter",r,!1),t.addEventListener("mouseleave",c,!1)})}}();

window.onload = function() {
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

	window.photonicShowLoading = function() {
		var loading = document.getElementsByClassName('photonic-loading');
		if (loading.length > 0) {
			loading = loading[0];
		}
		else {
			loading = document.createElement('div');
			loading.className = 'photonic-loading';
		}
		loading.style.display = 'block';
		document.body.appendChild(loading);
	};

	window.photonicHideLoading = function() {
		var loading = document.getElementsByClassName('photonic-loading');
		if (loading.length > 0) {
			loading = loading[0];
			loading.style.display = 'none';
		}
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

		var existing = document.getElementById('photonic-' + provider + '-panel-' + identifier);

		if (existing.length === 0) {
			existing = document.getElementById(args['panel_id']);
			if (photonicUtils.hasClass(existing, 'photonic-' + provider + '-passworded')) {
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
		photonicUtils.post(Photonic_JS.ajaxurl, args, function(data) {
			if (data.substr(0, Photonic_JS.password_failed.length) === Photonic_JS.password_failed) {
				photonicHideLoading();
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
						photonicHideLoading();
					}
				}
			}
		});
	};

	window.photonicProcessL3Request = function(clicked, container, args) {
		args['action'] = 'photonic_display_level_3_contents';
		photonicShowLoading();
		photonicUtils.post(Photonic_JS.ajaxurl, args, function(data){
			var insert = photonicUtils.getElement(data);

			if (container) {
				container.insertAdjacentHTML('afterend', data);
			}

			var layout = insert.querySelector('.photonic-level-2-container');

			if (photonicUtils.hasClass(layout, 'photonic-random-layout')) {
				photonicJustifiedGridLayout(false);
			}
			else if (photonicUtils.hasClass(layout, 'photonic-mosaic-layout')) {
				photonicMosaicLayout(false);
			}
			else if (photonicUtils.hasClass(layout, 'photonic-masonry-layout')) {
				photonicMasonryLayout(false);
			}

			var level2 = insert.querySelectorAll('.photonic-level-2');
			Array.prototype.forEach.call(level2, function(item) {
				item.style.display = 'inline-block';
			});

			if (!($ && $.fn && $.fn.tooltip)) {
				photonicTooltip('[data-photonic-tooltip]', '.photonic-tooltip-container');
			}
			photonicHideLoading();

			photonicUtils.removeClass(clicked, 'photonic-level-3-expand-plus');
			photonicUtils.addClass(clicked, 'photonic-level-3-expand-up');
			clicked.setAttribute('title', Photonic_JS.minimize_panel === undefined ? 'Hide' : Photonic_JS.minimize_panel);
		});
	};

	window.photonicMoveHTML5External = function() {
		var videos = document.getElementById('photonic-html5-external-videos');
		if (!videos) {
			videos = document.createElement('div');
			videos.id = 'photonic-html5-external-videos';
			videos.style.display = 'none';
			document.body.appendChild(videos);
		}

		var current = document.querySelectorAll('.photonic-html5-external');
		if (current) {
			var cLen = current.length;
			for (var c = 0; c < cLen; c++) {
				photonicUtils.removeClass(current[c], 'photonic-html5-external');
				videos.appendChild(current[c]);
			}
		}
	};
	photonicMoveHTML5External();

	//.photonic-level-2-thumb
	document.addEventListener('click', function(e) {
		if (!e.target.matches('.photonic-level-2-thumb')) {
			return;
		}

		e.preventDefault();
		var clicked = e.target;
		var provider = clicked.getAttribute('data-photonic-provider');
		var singular = clicked.getAttribute('data-photonic-singular');

		var args = {
			"panel_id": clicked.getAttribute('id'),
			"popup": clicked.getAttribute('data-photonic-popup'),
			"photo_count": clicked.getAttribute('data-photonic-photo-count'),
			"photo_more": clicked.getAttribute('data-photonic-photo-more')
		};

		if (provider === 'google' || provider === 'zenfolio') args.thumb_size = clicked.getAttribute('data-photonic-thumb-size');
		if (provider === 'flickr' || provider === 'smug' || provider === 'google' || provider === 'zenfolio') {
			args.overlay_size = clicked.getAttribute('data-photonic-overlay-size');
			args.overlay_video_size = clicked.getAttribute('data-photonic-overlay-video-size');
		}
		if (provider === 'google') { args.overlay_crop = clicked.getAttribute('data-photonic-overlay-crop'); }
		photonicDisplayLevel2(provider, singular, args);

	}, false);

	document.addEventListener('click', function (e) {
		if (!e.target.matches('.photonic-password-submit')) {
			return;
		}

		e.preventDefault();
		var album_id = $(this).parents('.photonic-password-prompter').attr('id');

	}, false);

	$(document).on('click', '.photonic-password-submit', function(e) {
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



};
