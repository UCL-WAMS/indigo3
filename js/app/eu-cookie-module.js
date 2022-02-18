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
        $("#eu-cookie-compliance-settings_show-hide").css("display", "none");
        $(".eu-cookie-compliance-category-description").css("display", "none");
      }

      $(document).ready(function() {
        initCookieSettings();
        $("#sliding-popup").on("click", "#manage-cookie-btn", cookieShowHide);
        $("#sliding-popup").on("click", ".toggleText", cookieDescShowHide);
        $("#sliding-popup").on("click", "button.eu-cookie-withdraw-tab", function() {
          initCookieSettings();
        });
      });
    }
  }
})(jQuery, Drupal);
