(function ($) {
    Drupal.behaviors.pg_application = {
        attach: function (context, settings) {
            $(document).ready(function() {
                if ($("#edit-ucl-international-equivalencies").val() && !$("#international-equivalencies-content").html().trim()) {
                    if ($("a[href='#tab3-other']").is("a")) {
                        $("a[href='#tab3-other']").trigger("click");
                    }
                    $("#edit-ucl-international-equivalencies").trigger("change");
                    const dropdown = document.getElementById('edit-ucl-international-equivalencies');
                    dropdown.scrollIntoView();
                }
            });
        }
    };
})(jQuery, Drupal);
