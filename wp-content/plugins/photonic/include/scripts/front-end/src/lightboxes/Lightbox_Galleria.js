function Photonic_Lightbox_Galleria() {
	Photonic_Lightbox.call(this);
}
Photonic_Lightbox_Galleria.prototype = Object.create(Photonic_Lightbox.prototype);

Photonic_Lightbox_Galleria.prototype.initialize = function(selector, group) {
	this.handleSolos();
	var self = this;

	Galleria.run('.photonic-level-1-container, .photonic-level-2-container');
};

photonicLightbox = new Photonic_Lightbox_Galleria();
photonicLightbox.initialize();
