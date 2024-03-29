(function ($) {
    Drupal.behaviors.ps_international_equivalencies_reset = {
        attach: function (context, settings) {
            $(document).ready(function() {
                if ($("#edit-ucl-international-equivalencies").val() && !$("#international-equivalencies-content").html().trim()) {
                    if ($("a[href='#tab3-other']").is("a")) {
                        $("a[href='#tab3-other']").trigger("click");
                    } else if ($("a[href='#tab2-requirements']").is("a")) {
                        $("a[href='#tab2-requirements']").trigger("click");
                    }
                    $("#edit-ucl-international-equivalencies").trigger("change");
                    const dropdown = document.getElementById('edit-ucl-international-equivalencies');
                    dropdown.scrollIntoView();
                }
            });
        }
    };
})(jQuery, Drupal);
