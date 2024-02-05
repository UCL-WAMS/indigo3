(function ($) {
    Drupal.behaviors.owl_accessibility_fix = {
        attach: function (context, settings) {
            $(document).ready(function() {
                var focusElement = null;
                function checkAndAddTabIndex() {
                    counter = 0;
                    if ($(".owl-dot").is("div")) {
                        $(".owl-dot, .owl-prev, .owl-next").attr("tabindex", "0");
                        $(".owl-dot, .owl-prev, .owl-next").on("focus", function() {
                            $(".owl-dot, .owl-prev, .owl-next").css("outline", "none");
                            $(this).css("outline", "#0549b5 solid 2px");
                            focusElement = $(this);
                        });
                    } else if (counter < 9) {
                        // In case the Owl script hasn't loaded (but only nine attempts).
                        counter++; 
                        setTimeout(checkAndAddTabIndex, 1000);
                    }
                }
                // Use a timeout to allow the Owl script to load first.
                setTimeout(checkAndAddTabIndex, 100);
                // Now set the enter keypress to work.
                $(document).on("keypress", function(e) {
                    if (e.keyCode === 13 && focusElement && ($(focusElement).hasClass("owl-dot") || $(focusElement).hasClass("owl-prev") || $(focusElement).hasClass("owl-next"))) {
                        $(focusElement).trigger("click");
                    }
                });
            });
        }
    };
})(jQuery, Drupal);
