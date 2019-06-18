// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('.sidenav');
//     var instances = M.Sidenav.init(elems, options);
// });

// Or with jQuery

$(document).ready(function(){
    $('.sidenav').sidenav();
});
var instance = M.Carousel.init({
    fullWidth: true,
    indicators: true
});

$('.carousel.carousel-slider').carousel({
    fullWidth: true,
    indicators: true
});