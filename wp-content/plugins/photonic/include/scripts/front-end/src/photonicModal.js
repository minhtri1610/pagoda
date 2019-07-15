/*=========================================
 * photonicModal - Based on the animatedModal script
 *
 * animatedModal.js: Version 1.0
 * author: João Pereira
 * website: http://www.joaopereira.pt
 * email: joaopereirawd@gmail.com
 * Licensed MIT
 =========================================*/

(function ($) {
	$.fn.photonicModal = function(options) {
		var modal = $(this);
		var $body = $('body');

		//Defaults
		var settings = $.extend({
			modalTarget:'photonicModal',
			closeCSS: '',
			closeFromRight: 0,
			width:'80%',
			height:'100%',
			top:'0px',
			left:'0px',
			zIndexIn: '9999',
			zIndexOut: '-9999',
			color: '#39BEB9',
			opacityIn:'1',
			opacityOut:'0',
			animatedIn:'zoomIn',
			animatedOut:'zoomOut',
			animationDuration:'.6s',
			overflow:'auto',

			// Callbacks
			beforeOpen: function() {},
			afterOpen: function() {},
			beforeClose: function() {},
			afterClose: function() {}
		}, options);

		var overlay = document.querySelectorAll('.photonicModalOverlay'),
			scrollable = $(document).find('.photonicModalOverlayScrollable');

		if (!overlay) {
			overlay = document.createElement('div');
			overlay.className = 'photonicModalOverlay';

			scrollable = document.createElement('div');
			scrollable.className = 'photonicModalOverlayScrollable';
			$(scrollable).appendTo($(overlay));

			$body.append(overlay);
		}
		scrollable = $(scrollable);

		var closeIcon = $(modal).find('.photonicModalClose');
		if (closeIcon.length === 0) {
			closeIcon = document.createElement('a');
			closeIcon.className = 'photonicModalClose ' + settings.closeCSS;
			$(closeIcon).css({'right': settings.closeFromRight});
			$(closeIcon).html('&times;');
			$(closeIcon).attr('href', '#');
			$(closeIcon).prependTo($(modal)).show();
		}

		closeIcon = $(modal).find('.photonicModalClose');

//		var id = $body.find('#'+settings.modalTarget);
		var id = document.querySelector('#'+settings.modalTarget);

		// Default Classes
		// id.addClass('photonicModal');
		// id.addClass(settings.modalTarget+'-off');

		//Init styles
		var initStyles = {
			'width':settings.width,
			'height':settings.height,
			'top':settings.top,
			'left':settings.left,
			'background-color':settings.color,
			'overflow-y':settings.overflow,
			'z-index':settings.zIndexOut,
			'opacity':settings.opacityOut,
			'-webkit-animation-duration':settings.animationDuration,
			'-moz-animation-duration':settings.animationDuration,
			'-ms-animation-duration':settings.animationDuration,
			'animation-duration':settings.animationDuration
		};
		//Apply stles
		// id.css(initStyles);

		if (id) {
			id.className = 'photonicModal ' + settings.modalTarget + '-off';
			id.style.cssText += initStyles.reduce(function (a, v, i) {
				return a + i + ': ' + v + ';';
			});

			open(id);
		}

		closeIcon.click(function(event) {
			event.preventDefault();
			document.body.style.overflow = 'hidden';

			settings.beforeClose(); //beforeClose
			if (photonicUtils.hasClass(id, settings.modalTarget+'-on')) {
				photonicUtils.removeClass(id, settings.modalTarget+'-on');
				photonicUtils.addClass(id, settings.modalTarget+'-off');
			}

			if (photonicUtils.hasClass(id, settings.modalTarget+'-off')) {
				id.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterClose);
			}

			id.css('overflow-y', 'hidden').slideUp();
			overlay.style.overflowY = 'hidden';
			overlay.style.display = 'none';
		});

		function open(id) {
			document.body.style.overflow = 'hidden';

			if (id.hasClass(settings.modalTarget+'-off')) {
				id.removeClass(settings.modalTarget+'-off');
				id.addClass(settings.modalTarget+'-on');
			}

			if (id.hasClass(settings.modalTarget+'-on')) {
				settings.beforeOpen();
				id.css({'opacity':settings.opacityIn,'z-index':settings.zIndexIn});
				id.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', afterOpen);
			}

			overlay.style.overflowY = settings.overflow;
			overlay.style.display = 'block';

			id.appendTo(scrollable).css('overflow-y', settings.overflow).hide().slideDown('slow'); // No "hide()" causes slideDown to not work the first time :-S
		}

		function afterClose () {
			id.css({'z-index':settings.zIndexOut});
			settings.afterClose(); //afterClose
		}

		function afterOpen () {
			settings.afterOpen(); //afterOpen
		}
	}; // End photonicModal.js
}(jQuery));

