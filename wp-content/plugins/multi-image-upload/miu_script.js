jQuery(document).ready(function(){
    
    jQuery('.miu-remove').live( "click", function(e) {
        e.preventDefault();
        var id = jQuery(this).attr("id")
        var btn = id.split("-");
        var img_id = btn[1];
        jQuery("#row-"+img_id ).remove();
    });
    
    
    var formfield;
    var img_id;
    jQuery(document).on("click", '.Image_button', function(e) {
        e.preventDefault();
        var id = jQuery(this).attr("id")
        var btn = id.split("-");
        img_id = btn[1];
        formfield = jQuery('#img-'+img_id);
		
		var file_frame;
		var wp_media_post_id = wp.media.model.settings.post.id; // Store the old id
		var set_to_post_id = 0; // Set this
			
		if ( file_frame ) {
			// Set the post ID to what we want
			file_frame.uploader.uploader.param( 'post_id', set_to_post_id );
			// Open frame
			file_frame.open();
			return;
		} else {
			// Set the wp.media post id so the uploader grabs the ID we want when initialised
			wp.media.model.settings.post.id = set_to_post_id;
		}
		// Create the media frame.
		file_frame = wp.media.frames.file_frame = wp.media({
			title: 'Select a image to upload',
			button: {
				text: 'Use this image',
			},
			multiple: false	// Set to true to allow multiple files to be selected
		});
		// When an image is selected, run a callback.
		file_frame.on( 'select', function() {
			// We set multiple to false so only get one image from the uploader
			attachment = file_frame.state().get('selection').first().toJSON();
			// Do something with attachment.id and/or attachment.url here
			formfield.val( attachment.url );
			if(formfield.parent().find("img").length > 0)
				formfield.parent().find("img").attr("src", attachment.url);
			else
				formfield.parent().find("span").append('<a target="_blank" href="'+attachment.url+'"><img width="25" src="'+attachment.url+'" /></a>');
			// Restore the main post ID
			wp.media.model.settings.post.id = wp_media_post_id;
		});
		// Finally, open the modal
		file_frame.open();
    });
});

function addRow(image_url){
    if(typeof(image_url)==='undefined') image_url = "";
    itemsCount+=1;
    var emptyRowTemplate = '<div id=row-'+itemsCount+'> <input style=\'float:left;width:70%\' id=img-'+itemsCount+' type=\'text\' name=\'miu_images['+itemsCount+']\' value=\''+image_url+'\' />'
    +'&nbsp;<input type=\'button\' href=\'#\' class=\'Image_button button\' id=\'Image_button-'+itemsCount+'\' value=\'Upload\'>'
    +'&nbsp;<input class="miu-remove button" type=\'button\' value=\'Remove\' id=\'remove-'+itemsCount+'\' />'
    +'&nbsp;<span>';
    if(image_url)
    {
      emptyRowTemplate+= '<a target="_blank" href="'+image_url+'"><img width="25" src="'+image_url+'"></a>';

    }
    emptyRowTemplate+='</span>'
    +'</div>';
    jQuery('#miu_images').append(emptyRowTemplate);
}