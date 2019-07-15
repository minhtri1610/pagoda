	function Photonic_Lightbox_Strip() {
		Photonic_Lightbox.call(this);
	}
	Photonic_Lightbox_Strip.prototype = Object.create(Photonic_Lightbox.prototype);

	Photonic_Lightbox_Strip.prototype.changeVideoURL = function(element, regular, embed) {
		$(element).attr('href', regular);
		$(element).addClass('strip');
	};

	Photonic_Lightbox_Strip.prototype.initialize = function(selector, group) {
		this.handleSolos();
	};

	window.photonicStripSetHash = function(a) {
		if (Photonic_JS.deep_linking === undefined || Photonic_JS.deep_linking === 'none') {
			return;
		}

		var hash = $.type(a) === 'string' ? a : $(a).data('photonicDeep');
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

	window.photonicStripUnsetHash = function() {
		lastDeep = (lastDeep === undefined || deep !== '') ? location.hash : lastDeep;
		if (window.history && 'replaceState' in window.history) {
			history.replaceState({}, document.title, location.href.substr(0, location.href.length-location.hash.length));
		}
		else {
			window.location.hash = '';
		}
	};

	photonicLightbox = new Photonic_Lightbox_Strip();
	photonicLightbox.initialize();

