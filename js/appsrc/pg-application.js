(function ($) {
    Drupal.behaviors.pg_application = {
        attach: function (context, settings) {
            $("#application-button").on("click", function(e) {
                e.preventDefault();
                if ($("input[name=application_option]:checked", "#application-form").is("input")) {
                    var code1 = $("input[name=application_option]:checked", "#application-form").attr("data-code1");
                    var code2 = $("input[name=application_option]:checked", "#application-form").attr("data-code2");
                    location.assign("https://evision.ucl.ac.uk/urd/sits.urd/run/siw_ipp_lgn.login?process=siw_ipp_app&code1=" + code1 + "&code2=" + code2);
                } else {
                    alert("Please pick a course option before clicking the apply button.");
                }
            });
        }
    };
})(jQuery, Drupal);
