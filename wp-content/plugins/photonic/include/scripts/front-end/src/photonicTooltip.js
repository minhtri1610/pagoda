/*
 * PhotonicTooltip
 * Based on JS CSS Tooltip v1.2.3 (https://github.com/mirelvt/js-css-tooltip)
 *
 * Released under the MIT license
 */
(function(win) {
	"use strict";

	win.photonicTooltip = function (selector, tooltip_element) {
		var tooltip, tooltip_class, elm_edges, tooltip_elms;

		function create(tooltip, elm) {
			var tooltipText = elm.getAttribute('data-photonic-tooltip');
			if (tooltipText !== '') {
				elm.setAttribute('title', ''); // Blank out the regular title

				// elm_edges relative to the viewport.
				elm_edges = elm.getBoundingClientRect();

				var tooltipTextNode = document.createTextNode(tooltipText);
				tooltip.innerHTML = ''; // Reset, or upon refresh the node gets repeated
				tooltip.appendChild(tooltipTextNode);

				// Remove no-display + set the correct classname based on the position
				// of the elm.
				if (elm_edges.left > window.innerWidth - 100) {
					tooltip.className = 'photonic-tooltip-container tooltip-left';
				}
				else if ((elm_edges.left + (elm_edges.width / 2)) < 100) {
					tooltip.className = 'photonic-tooltip-container tooltip-right';
				}
				else {
					tooltip.className = 'photonic-tooltip-container tooltip-center';
				}
			}
		}

		function position(tooltip, elm) {
			var tooltipText = elm.getAttribute('data-photonic-tooltip');
			if (tooltipText !== '') {
				if (elm_edges === undefined) {
					elm_edges = elm.getBoundingClientRect();
				}

				// 10 = arrow height
				var elm_top = elm_edges.top + elm_edges.height + window.scrollY;
				var viewport_edges = window.innerWidth - 100;

				// Position tooltip on the left side of the elm if the elm touches
				// the viewports right edge and elm width is < 50px.
				if (elm_edges.left + window.scrollX > viewport_edges && elm_edges.width < 50) {
					tooltip.style.left = (elm_edges.left + window.scrollX - (tooltip.offsetWidth + elm_edges.width)) + 'px';
					tooltip.style.top = elm.offsetTop + 'px';
					// Position tooltip on the left side of the elm if the elm touches
					// the viewports right edge and elm width is > 50px.
				}
				else if (elm_edges.left + window.scrollX > viewport_edges && elm_edges.width > 50) {
					tooltip.style.left = (elm_edges.left + window.scrollX - tooltip.offsetWidth - 20) + 'px';
					tooltip.style.top = elm.offsetTop + 'px';
				}
				else if ((elm_edges.left + window.scrollX + (elm_edges.width / 2)) < 100) {
					// position tooltip on the right side of the elm.
					tooltip.style.left = (elm_edges.left + window.scrollX + elm_edges.width + 20) + 'px';
					tooltip.style.top = elm.offsetTop + 'px';
				}
				else {
					// Position the toolbox in the center of the elm.
					var centered = (elm_edges.left + window.scrollX + (elm_edges.width / 2)) - (tooltip.offsetWidth / 2);
					tooltip.style.left = centered + 'px';
					tooltip.style.top = elm_top + 'px';
				}
			}
		}

		function show(evt) {
			create(tooltip, evt.currentTarget);
			position(tooltip, evt.currentTarget);
		}

		function hide(evt) {
			tooltip.className = tooltip_class + ' no-display';
			if (tooltip.innerText !== '') {
				tooltip.removeChild(tooltip.firstChild);
				tooltip.removeAttribute('style');
				var element = evt.currentTarget;
				element.setAttribute('title', element.getAttribute('data-photonic-tooltip'));
			}
		}

		win.photonicTooltip.init = function() {
			tooltip_elms = document.documentElement.querySelectorAll(selector);
			tooltip = document.documentElement.querySelector(tooltip_element);
			tooltip_class = tooltip_element.replace(/^\.+/g, '');

			if (tooltip === null || tooltip.length === 0) {
				tooltip = document.createElement('div');
				tooltip.className = tooltip_class + ' no-display';
				document.body.appendChild(tooltip);
			}

			Array.prototype.forEach.call(tooltip_elms, function(elm) {
				elm.removeEventListener('mouseenter', show);
				elm.removeEventListener('mouseleave', hide);

				elm.addEventListener('mouseenter', show, false);
				elm.addEventListener('mouseleave', hide, false);
			});
		};

		photonicTooltip.init();
	}
})(window);

