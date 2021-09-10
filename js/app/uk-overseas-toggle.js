/*
*
This tiny app toggles all the UK/Overseas information on all three graduate 
programme content types in the Indigo3 prospectus. It will be extended to 
cover the UG programme content type when that becomes an indigo 3 type.
*
*/
$(document).ready(function() {
    // First line should be done by CSS, but for now...
    $(".international").css("display", "none");
    $(".uk-overseas-button").on("click", function() {
        $(".uk-overseas").fadeToggle();
        $(".uk-overseas-button").toggleClass("active");
    });
});
