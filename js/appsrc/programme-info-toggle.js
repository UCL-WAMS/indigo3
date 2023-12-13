/*
*
This app toggles all the UK/Overseas and study mode information on all three 
graduate programme content types in the Indigo3 prospectus. It will be extended 
to cover the UG programme content type when that becomes an indigo 3 type.
*
*/
(function ($) {
    // New variable to store whether this script has initialised.
    // This helps prevent the mode initialisation from running when the 
    // Int Eq AJAX loads, causing the fees and duration text to fade out/in.
    Drupal.behaviors.ucl_indigo_uk_toggle_initialised = false;
    Drupal.behaviors.ucl_indigo_uk_toggle = {
        attach: function (context, settings) {
            function setButtons() {
                $(".uk-overseas-button").css("backgroundColor", "transparent");
                $(".uk-overseas-button").css("color", "#0D68CF");
                $(".highlight").css("backgroundColor", "#0D68CF");
                $(".highlight").css("color", "#FFF");
            }
        
            // Course mode toggle
            // Next line should only apply when there is a full time study mode
            // And ONLY when the the page first loads.
            if (!Drupal.behaviors.ucl_indigo_uk_toggle_initialised) {
                if ($(".study-mode.fulltime.fees").is("div")) {
                    $(".parttime, .flexible").css("display", "none");
                }
                // Load correct state when the page loads via the mode selector.
                if ($("#mode-selector").is("select")) {
                    var init_klass = "." + $("#mode-selector").val();
                    $(".study-mode").css("display", "none");
                    $(init_klass).fadeIn();
                }
                else {
                    // No mode selector, so select based on the content of the page.
                    var headings = $(".prog-key-info__text > h5");
                    headings.each(function() {
                        if ($(this).text() == "Study mode") {
                            var el = $(this).siblings("div").first();
                            var mode = $(el).text().toLowerCase().replace(" ", "").replace("-", "");
                            $(".study-mode").css("display", "none");
                            $("." + mode).fadeIn();
                        }
                    });
                }
            }
            // Change state when new modes are selected.
            $("#mode-selector").on("change", function() {
                $(".study-mode").css("display", "none");
                var klass = "." + $(this).val();
                $(klass).fadeIn();
            });
            // UK/Overseas toggle
            // First line should be done by CSS, but for now...
            // Don't run this if overseas is selected,
            if (!$(".overseas-button").hasClass("highlight")) {
                $(".international").css("display", "none");
                // This next four lines will also go when CSS is sorted...
                setButtons();
                $(".uk-overseas-button").css("textDecoration", "none");
                $(".uk-overseas-button").css("padding", "0.5rem 1rem");
                $(".prog-key-info .international").css("paddingTop", "0");
            }
            
            // Check the event isn't already bound
            var jqObject = $(".uk-overseas-button");
            var rawDOMElement = jqObject.get(0);
            var eventObject = $._data(rawDOMElement, "events");
            if (typeof eventObject == "undefined" || typeof eventObject.click == "undefined") {
                $(".uk-overseas-button").on("click", function(event) {
                    event.preventDefault();
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
            // Set the initialisation variable, so the modes code doesn't run again.
            Drupal.behaviors.ucl_indigo_uk_toggle_initialised = true;
        }
    }
})(jQuery, Drupal);
