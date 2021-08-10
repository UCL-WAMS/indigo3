(function ($) {
    Drupal.behaviors.ucl_indigo_carousel = {
        attach: function (context, settings) {
// DO WE NEED THIS GLOBAL VARIABLE ANY MORE, OR CAN WE BE SMARTER?
/*    if(typeof(globalSiteSpecificVars.carouselConfig)==="undefined"){
        carouselConfig = {
            margin:10, responsiveClass:true,
            loop:true,
            autoplay:true,
            lazyload:true,
            autoHeight: false,
            animateOut:'fadeOut',
            autoplayHoverPause: true,
            smartSpeed:450,
            autoplayTimeout:5000,
            dots:true,
            items:1,
            nav:false,
            responsive:{
                0:{
                    
                },
                500:{
             
                },
                700:{
                    nav:true,
                  
                },
                1000:
                {
                    nav:true,

                },
                1300:{
                    nav:true,

                }
            }
        };
    }else{
        carouselConfig = (globalSiteSpecificVars.carouselConfig);
        
    }*/
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

/*        if (typeof $.fn.owlCarousel == "undefined") {
            $.fn.owlCarousel = window.jQuery.fn.owlCarousel
        }
        $('.owl-carousel').owlCarousel(carouselConfig);
    }*/
    }
});

}
};
})(jQuery, Drupal);
