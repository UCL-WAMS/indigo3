/*
*
This app toggles all the UK/Overseas and study mode information on all three 
graduate programme content types in the Indigo3 prospectus. It will be extended 
to cover the UG programme content type when that becomes an indigo 3 type.
*
*/
(function ($) {
    Drupal.behaviors.ucl_indigo_uk_toggle = {
        attach: function (context, settings) {
            function setButtons() {
                $(".uk-overseas-button").css("backgroundColor", "transparent");
                $(".uk-overseas-button").css("color", "#0D68CF");
                $(".highlight").css("backgroundColor", "#0D68CF");
                $(".highlight").css("color", "#FFF");
            }
        
            // Course mode toggle
            // First line should be done by CSS, but for now...
            $(".parttime, .flexible").css("display", "none");
            $("#mode-selector").on("change", function() {
                $(".study-mode").css("display", "none");
                var klass = "." + $(this).val();
                $(klass).fadeIn();
            })
            // UK/Overseas toggle
            // First line should be done by CSS, but for now...
            $(".international").css("display", "none");
            // This next four lines will also go when CSS is sorted...
            setButtons();
            $(".uk-overseas-button").css("textDecoration", "none");
            $(".uk-overseas-button").css("padding", "3px");
            $(".prog-key-info .international").css("paddingTop", "0");
            $(".uk-overseas-button").on("click", function(e) {
                $(".uk-overseas-button").css
                e.preventDefault();
                if ($(this).hasClass("uk-button")) {
                    $(".international").css("display", "none");
                    $(".uk").fadeIn();
                } else if ($(this).hasClass("overseas-button")) {
                    $(".uk").css("display", "none");
                    $(".international").fadeIn();
                }
                $(".uk-overseas-button").toggleClass("highlight");
                setButtons();
            });
        }
    }
})(jQuery, Drupal);
