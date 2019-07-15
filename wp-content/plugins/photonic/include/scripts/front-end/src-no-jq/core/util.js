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

