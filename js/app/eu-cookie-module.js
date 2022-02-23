//Show hide EU Cookie settings.
(function ($) {
  Drupal.behaviors.ucl_indigo_eu_cookie_module = {
    attach: function (context, settings) {
      // Show hide EU Cookie description settings.
      function cookieShowHide() {
        $("#eu-cookie-compliance-settings_show-hide").toggle();
      }

      // Show hide individual EU Cookie descriptions.
      function cookieDescShowHide() {
        var para = $(this).siblings(".eu-cookie-compliance-category-description").first();
        $(para).toggle();
      }
      function initCookieSettings() {
        if ($("#eu-cookie-compliance-settings_show-hide").css("display") !== "none") {
          $("#eu-cookie-compliance-settings_show-hide").css("display", "none");
        }
        if ($(".eu-cookie-compliance-category-description").css("display") !== "none") {
          $(".eu-cookie-compliance-category-description").css("display", "none");
        }
      }

      $(document).ready(function() {
        initCookieSettings();
        $("#sliding-popup").off("click", "#manage-cookie-btn", cookieShowHide).on("click", "#manage-cookie-btn", cookieShowHide);
        $("#sliding-popup").off("click", ".toggle-text", cookieDescShowHide).on("click", ".toggle-text", cookieDescShowHide);
        $("#sliding-popup").off("click", "button.eu-cookie-withdraw-tab", initCookieSettings).on("click", "button.eu-cookie-withdraw-tab", initCookieSettings);
      });
    }
  };
})(jQuery, Drupal);