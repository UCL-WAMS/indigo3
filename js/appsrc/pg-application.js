(function ($) {
    Drupal.behaviors.pg_application = {
        attach: function (context, settings) {
            $("#application-button").on("click", function(e) {
                e.preventDefault();
                var now = new Date();
                var start = new Date(2024, 3, 12, 17, 0);
                var end = new Date(2024, 3, 15, 12, 0);
                if (now > start && now < end) {
                    alert("*********************************************************\nUCL's graduate application system will be unavailable \nbetween 17:00 (UK time) on Friday, 12 April until 12:00\n (UK time) on Monday, 15 April 2024 for upgrading work. \nWe value your application and understand this may be \nfrustrating, especially if you have an application under \nway. Do return when the system is live again - we look \nforward to receiving it.\n\nIf you see this message outside those times, please \ncheck your computer's clock is showing the correct \ndate and time.\n*********************************************************");  
                } else if ($("input[name=application_option]:checked", "#application-form").is("input")) {
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
