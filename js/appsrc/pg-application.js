(function ($) {
    Drupal.behaviors.pg_application = {
        attach: function (context, settings) {
            $("#application-button").on("click", function(e) {
                e.preventDefault();
                const now = new Date();
                const start = new Date(2024, 3, 12, 17, 0);
                const end = new Date(2024, 3, 15, 12, 0);
                if (now > start && now < end) {
                    alert("*********************************************************\nUCL's graduate application system will be unavailable \nbetween 17:00 (UK time) on Friday, 12 April until 12:00\n (UK time) on Monday, 15 April 2024 for upgrading work. \nWe value your application and understand this may be \nfrustrating, especially if you have an application under \nway. Do return when the system is live again - we look \nforward to receiving it.\n\nIf you see this message outside those times, please \ncheck your computer's clock is showing the correct \ndate and time.\n*********************************************************");  
                } else if ($("#application-form input[name=application_option]:checked").is("input") && $("#application-form input[name=DeclaredVisaRequired]:checked").is("input")) {
                    const route_code = $("#application-form input[name=application_option]:checked").attr("data-route_code");
                    const marketed_course_code = $("#application-form input[name=application_option]:checked").attr("data-marketed_course_code");
                    const mode_of_attendance = encodeURIComponent($("#application-form input[name=application_option]:checked").attr("data-mode_of_attendance"));
                    let academic_year = $("#application-form input[name=application_option]:checked").attr("data-academic_year");
                    academic_year = (academic_year.indexOf("-") > -1 ? academic_year.substring(0,4) : academic_year);
                    const declared_visa_required = $("#application-form input[name=DeclaredVisaRequired]:checked").val();
                    location.assign("https://ucl-rm-atpuat.powerappsportals.com/selection_summary/?route_code=" + route_code + "&marketed_course_code=" + marketed_course_code + "&academic_year=" + academic_year + "&mode_of_attendance=" + mode_of_attendance + "&DeclaredVisaRequired=" + declared_visa_required);
                } else {
                    alert("Please pick a course option and tell us whether you need a visa to study at UCL before clicking the apply button.");
                }
            });
        }
    };
})(jQuery, Drupal);
