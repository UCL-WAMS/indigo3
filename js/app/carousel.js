(function ($) {
    Drupal.behaviors.ucl_indigo_carousel = {
        attach: function (context, settings) {
    if ($(".owl-carousel").is("div")) {
        $(".owl-carousel").owlCarousel({
            loop:true,
            margin:10,
            autoplay:true,
            lazyload:true,
            autoHeight: false,
            animateOut:'fadeOut',
            autoplayHoverPause: true,
            smartSpeed:450,
            autoplayTimeout:5000,
            dots:true,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:3,
                    nav:false
                },
                1000:{
                    items:5,
                    nav:true,
                    loop:false
                }
            }
        });
    }
}
};
})(jQuery, Drupal);
