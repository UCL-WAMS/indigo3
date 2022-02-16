/*
*
This app shows one set of qualification equivalencies depending on the option
selected from a select field, hiding all other fields
*
*/
(function ($) {
    Drupal.behaviors.ucl_indigo_uk_equivalencies = {
        attach: function (context, settings) {
            $(document).ready(function() {
                $(".alt-qualifications__hidden").css("display", "none");
                // UK equivalencies select event handling
                $(".dropdown_uk_qualifications").on("change", function(){
                    $(".alt-qualifications__hidden").css("display","None");
                    if ($(this).val())
                        $("#info-" + $(this).val()).fadeIn();
                });
            });
        }
    }
})(jQuery, Drupal);
