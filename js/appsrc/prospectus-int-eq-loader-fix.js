(function ($) {
    Drupal.behaviors.pg_application = {
        attach: function (context, settings) {
            $(document).ready(function() {
                if ($("#edit-ucl-international-equivalencies").val() && !$("#international-equivalencies-content").html().trim()) {
                    $("#edit-ucl-international-equivalencies").trigger("change");
                    const dropdown = document.getElementById('edit-ucl-international-equivalencies');
                    dropdown.scrollIntoView();
                }
            });
        }
    };
})(jQuery, Drupal);
