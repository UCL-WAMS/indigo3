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
                } else if ($("input[name=application_option]:checked", "#application-form").is("input") && $("input[name=DeclaredVisaRequired]:checked", "#application-form").is("input")) {
                    var route_code = $("input[name=application_option]:checked", "#application-form").attr("data-route_code");
                    var marketed_course_code = $("input[name=application_option]:checked", "#application-form").attr("data-marketed_course_code");
                    var mode_of_attendance = encodeURIComponent($("input[name=application_option]:checked", "#application-form").attr("data-mode_of_attendance"));
                    var academic_year = $("input[name=application_option]:checked", "#application-form").attr("data-academic_year");
                    academic_year = (academic_year.indexOf("-") > -1 ? academic_year.substring(0,4) : academic_year);
                    location.assign("https://ucl-rm-cubase.powerappsportals.com/selection_summary/?route_code=" + route_code + "&marketed_course_code=" + marketed_course_code + "&academic_year=" + academic_year + "&mode_of_attendance=" + mode_of_attendance);
                } else {
                    alert("Please pick a course option and tell us whether you need a visa to study at UCL before clicking the apply button.");
                }
            });
        }
    };
})(jQuery, Drupal);
