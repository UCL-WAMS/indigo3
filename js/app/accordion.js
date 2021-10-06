/*
*
This code is simplified from previous versions e.g. in ucl.js and the old carousel app
It handles multiple accordion instances independently without requiring an ID, and 
allows each accordion on the page to have one item open at a time.
It also toggles a single item open and closed on repeated clicks.
*
*/

(function ($) {
    Drupal.behaviors.ucl_indigo_accordion = {
        attach: function (context, settings) {
	
    function closeAllInactiveAccordionPanels() {
        $(".accordion__description").not(".active").slideUp();
    }

    function removeAllActiveClassesFromCurrentAccordion(accordion) {
        $(accordion).children(".accordion__description.active").removeClass("active");
        $(accordion).children(".accordion__title.active").removeClass("active");
    }

	function initAccordions(){
	    closeAllInactiveAccordionPanels();
        $(".accordion__title").on("click", function() {
            console.log("click");
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).next(".accordion__description").removeClass("active").slideUp();
            } else {
                $(this).addClass("active");
                $(this).next(".accordion__description").addClass("active").slideDown();
        	    closeAllInactiveAccordionPanels();
            }
        });
	}

    initAccordions();
}
};
})(jQuery, Drupal);
