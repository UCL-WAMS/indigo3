/********************************************************************
*
* App providing the goodness for the Access UCL eligibility checker web app
* AJAX requests to DB prove interactive experience
* TODO: No non-JS version as yet
* Consider making every school postcode keyup delete the schoolname and postcode 
* in case the school has been selected and the user realises it was an error
* The estranged click handler is declared multiple times with minor differences, so 
* try and combine them all into a single event handler.
*
*********************************************************************/

(function ($) {
    Drupal.behaviors.ucl_indigo_access_ucl = {
        attach: function (context, settings) {
            $(document).ready(function() {
                // Utility functions 
                // Trim shim, for older browsers.
                if (typeof(String.prototype.trim) === "undefined") {
                    String.prototype.trim = function() {
                        return String(this).replace(/^\s+|\s+$/g, '');
                    }
                }

                function showMe(show_ids,hide_ids) {
                    if (hide_ids) {
                        $(hide_ids).css("display","none");
                    }
                    if (show_ids) {
                        $(show_ids).fadeIn("slow");
                    }
                }

                function getValues(arr,val) {
                    var html = "";
                    if (val.length > 2) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].toLowerCase().indexOf(val.toLowerCase()) > -1) {
                                html += "<div class=\"myoption\">" + arr[i] + "</div>";
                            }
                        }
                    }
                    return html;
                }
    
                function ValidateAndFixPostcode(postcode) {
                    if (postcode.charAt(postcode.length-4) != " ") {
                        postcode = postcode.substring(0,postcode.length-3) + " " + postcode.substring(postcode.length-3);
                    }
                    return postcode;
                }

                // The following two functions create the lightbox and centre the AJAX spinner/loader gif.
                function centreOnScreen(obj) {
                    obj.css("position","absolute");
                    obj.css("top", Math.max(0, (($(window).height() - $(obj).outerHeight()) / 2) + $(window).scrollTop()) + "px");
                    obj.css("left", Math.max(0, (($(window).width() - $(obj).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
                }

                function fillScreen(obj) {
                    obj.css("height",$(window).height() + "px");
                    obj.css("width",$(window).width() + "px");
                    obj.css("top", $(window).scrollTop() + "px");
                }

                function setEligibilityMessages(targetId) {
                    var props = Object.getOwnPropertyNames(messages);
                    // Set messages on the page in appropriate pass/fail box.
                    for (var i = 0; i < props.length; i++) {
                        $(targetId + " ." + props[i]).text(messages[props[i]]);
                    }
                    $(targetId).fadeIn("fast");
                }
                // End utility functions.

                // Initialise the widget.
                $("#access-ucl-widget").after("<div id=\"access-ucl-form\">Access UCL widget loading</div>");

                // Event handling from here.

                // This handler resets all fields after a radio button change in the app flow.
                // Not required now, but left here to indicate how to handle this if it is required again.
                $("body").on("change", "input[type='radio']", function() {
                    var ls = ["domiciled","attend","history","attend-private","care-leaver","estranged"];
                    var check = false;
                    for (var i = 0; i < ls.length; i++) {
                        var input = $("input[name='" + ls[i] + "']");
                        if (check && input.is("input")) {
                            input.prop("checked",false);
                        }
                        if ($(this).attr("name") == ls[i]) {
                            check = true;
                        }
                    }
                });

                // Handle specific radio button selections.
                $("body").on("click", "input[name='attend']", function() {
                    eligibilityData = {};
                    if ($(this).val() == "N") {
                        showMe("#ineligible-school,#resetter","#postcode-test,#eligible,#ineligible,#indeterminate,#estranged,#case-by-case");
                    } else {
                        showMe("#postcode-test,#resetter","#eligible,#ineligible,#indeterminate,#case-by-case,#ineligible-school");
                    }
                });

                var year = '2025';
                var eligibilityData = {};
                var get_url = (location.href.indexOf("local-micro.lndo.site") > -1?"https://local-micro.lndo.site/access-ucl/www/eligibility-" + year + ".php":(location.href.indexOf("wwwapps-uat.ucl.ac.uk") > -1?"https://wwwapps-uat.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-" + year + ".php":"https://www.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-" + year + ".php"));
                $("body").on("submit", "#checker-widget", function(e) {
//                    showMe("#postcode-criteria-msg","#estranged,#school-checked-nopass,#school-checked-pass,#time-in-care");
                    e.preventDefault();
                    if (!$("#ajax-spinner").is("div")) {
                        $("body").prepend('<div class="hiddenField" id="ajax-spinner">Loading<br/><img src="//cdn.ucl.ac.uk/skins/UCLIndigoSkin/default-theme/images/iris/ajax-loader.gif" alt="Loading..."></div><div id="lightbox"></div>');
                    }
                    // This is the main scheme.
                    if (!$("input[name='postcode']").val()) {
                        // No home postcode entered.
                        $("input[name='postcode']").parent().addClass("errorField");
                    } else {
                        // We have a valid entry
                        fillScreen($("#lightbox"));
                        centreOnScreen($("#ajax-spinner"));
                        showMe("#ajax-spinner,#lightbox");
                        // These are the default messages to display after checking the DB.
                        messages = {
                            imd:"Your postcode isn't IMD eligible.",
                            tundra:"Your postcode isn't TUNDRA eligible.",
                        }
                        $(".errorField").removeClass("errorField");
                        eligibilityData["pc"] = ValidateAndFixPostcode($("input[name='postcode']").val());//$("input[name='postcode']").val().replace(/ /g,"");
                        // Must pass in the year as it is required to selected the DB in eligibility-XXXX.php
                        eligibilityData["year"] = year;
                        $.get(get_url, eligibilityData, function(data) {
                            var pass = false;
                            var indeterminate = false;
                            if (data) {
                                console.log(data);
                                if (data["tundra"] == 6 && data["imd_decile"] == 11) {
                                    // The home postcode is in neither IMD nor POLAR data tables.
                                    // 6 and 11 are illegal values set deliberately if there is no match.
                                    $("input[name='postcode']").parent().addClass("errorField");
                                    alert("Your home postcode does not appear in our database. Please double-check you have entered it correctly.  Please contact us at wp.accessucl@ucl.ac.uk if it is still not recognised.");
                                    showMe("","#ajax-spinner,#lightbox");
                                } else {
                                    if (data["tundra"] === null || data["tundra"] === "" || data["tundra"] === 0 || data["tundra"] == "0" || data["tundra"] == "NULL" || data["tundra"] == "R") {
                                        indeterminate = true;
                                        messages.tundra = "Your postcode is not available in our TUNDRA database.";
                                    } else if (data["tundra"] !== "" && data["tundra"] != "0" && data["tundra"] > 0 && data["tundra"] < 2) {
                                        pass = true;
                                        messages.tundra = "Your postcode is TUNDRA eligible.";
                                    }
                                    if (data["imd_decile"] === null || data["imd_decile"] === "" || data["imd_decile"] === 0 || data["imd_decile"] == "0" || data["imd_decile"] == "NULL") {
                                        indeterminate = true;
                                        messages.imd = "Your postcode is not available in our IMD database.";
                                    } else if (data["imd_decile"] !== "" && data["imd_decile"] != "0" && data["imd_decile"] > 0 && data["imd_decile"] < 3) {
                                        pass = true;
                                        messages.imd = "Your postcode is IMD eligible.";
                                    }
                                    // We now have a pass/fail for any complete set of data which we can use to 
                                    // determine which messages to display or further questions to ask.
                                    if (pass) {
                                        // This person seems eligible.
                                        showMe("#eligible","#ineligible,#ineligible-school,#indeterminate,#case-by-case,#ajax-spinner,#lightbox");
                                        // Set messages after search.
                                        setEligibilityMessages("#postcode-checked-pass");
                                    } else if (indeterminate) {
                                        // This person might be eligible if their POLAR_4, Acorn or IMD value were properly defined, so set a special message
                                        showMe("#indeterminate","#eligible,#ineligible,#case-by-case,#ajax-spinner,#lightbox");
                                        // Set messages after search.
                                        setEligibilityMessages("#postcode-checked-indeterminate");
                                    } else {
                                        // This doesn't match TUNDRA or IMD.
                                        showMe("#ineligible","#eligible,#indeterminate,#case-by-case,#ajax-spinner,#lightbox,#postcode-criteria-msg");
                                        // Set messages on the page in appropriate pass/fail box.
                                        setEligibilityMessages("#postcode-checked-nopass");
                                    }
                                }
                            } else {
                                $("input[name='postcode']").parent().addClass("errorField");
                                alert("You have entered an invalid home postcode. Please check and try again.");
                                showMe("","#ajax-spinner,#lightbox");
                            }
                        }, 'jsonp');
                    }
                });
                $("body").on("click", "#form-reset", function() {
                    // Reset everything else to init state (the form data is taken care of by default action of the click).
                    var showstring = "#attend-uk";
                    var hidestring = "#postcode-test,#eligible,#ineligible,#indeterminate,#case-by-case,#ineligible-school,#resetter"
                    showMe(showstring,hidestring);
                    eligibilityData = {};
                });
                // End event handling.

                // HTML template
/*var widget = '<p>Enter your details below to check your eligibility for Access UCL (you will need your home postcode and the postcode of the school where you took your A levels).</p>\
<p>Please bear in mind that the results given here are indicative only.</p>\
\*/
var widget = '<form action="" method="get" id="checker-widget" autocomplete="off">\
    <fieldset>\
      <h3 class="darr">Start here &darr;</h3>\
      <div class="field" id="attend-uk">\
          <div>Are you attending (or did you attend) a UK state school while completing the A levels (or equivalent qualifications) that you would use to meet UCL\'s entry requirements?</div>\
          <div><label><input type="radio" name="attend" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="attend" value="N"> No</label></div>\
      </div>\
\
      <div id="postcode-test" class="hiddenField">\
          <div class="field">\
              <p class="darr">&nbsp;</p>\
              <p>You may be eligible for Access UCL through your home postcode, please enter your home postcode in the box below.  By home postcode, UCL means the postcode of the address at which an applicant is ordinarily resident.  Please note that if you are not currently living in the U.K., you will not be eligible for Access UCL.</p>\
              <label>Enter your home postcode</label>\
              <input type="text" class="postcodefield" name="postcode" value="" />\
          </div>\
    \
          <div class="field submitter" id="submitter">\
              <input type="submit" class="access-button btn-cta" value="Check my eligibility &rsaquo;" />\
          </div>\
      </div>\
\
      <div class="hiddenField" id="indeterminate">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>Sorry, we cannot determine whether you are eligible for Access UCL</h4>\
                  <div id="postcode-checked-indeterminate" class="hiddenField">\
                      <ul>\
                          <li class="imd"></li>\
                          <li class="tundra"></li>\
                      </ul>\
                      <p>Your postcode is not available in our database, please contact <a href="mailto:wp.accessucl@ucl.ac.uk">wp.accessucl@ucl.ac.uk</a> to check your eligibility.</p>\
                  </div>\
              </div>\
          </div>\
      </div>\
      <div class="hiddenField" id="ineligible">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>Sorry, you are not eligible for Access UCL</h4>\
                  <p>Unfortunately, the answers you have provided indicate that your postcode does not meet the Access UCL eligibility criteria.</p>\
                  <div id="postcode-checked-nopass" class="hiddenField">\
                      <ul>\
                          <li class="imd"></li>\
                          <li class="tundra"></li>\
                      </ul>\
                  </div>\
                  <p>As you do not meet either of the home postcode criteria you are not eligible for Access UCL through this route.</p>\
                  <p>If you are care experienced, or estranged from both parents, you may be eligible for Access UCL.  Please see the information below for the full eligibility criteria for Access UCL through these routes.</p>\
                  <p>If you do not meet the care experienced or estranged criteria, based on the information you\'ve provided, if your application to UCL is successful, you will receive the standard UCL offer, not an Access UCL offer.</p>\
              </div>\
          </div>\
      </div>\
      <div class="hiddenField" id="ineligible-school">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
              <h4>Sorry, you are not eligible for Access UCL</h4>\
                  <p>Unfortunately, the answer you have provided indicates that you do not meet the postcode eligibility of the Access UCL scheme.  To meet the eligibility requirements of Access UCL through home postcode, applicants who live in an eligible postcode must also attend a UK state school to complete their A levels (or equivalent qualifications).</p>\
                  <p>If you are care experienced and attend a UK independent school, you may be eligible for Access UCL.  Please see the information below for the full eligibility criteria for Access UCL for applicants who are care experienced.</p>\
                  <p>If you have any questions, you can contact us at <a href="mailto:wp.accessucl@ucl.ac.uk">wp.accessucl@ucl.ac.uk</a>.</p>\
              </div>\
          </div>\
      </div>\
      <div class="hiddenField" id="eligible">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-success clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>Great news! You are eligible for Access UCL</h4>\
                  <p>The answers you have provided indicate that you are eligible for Access UCL.</p>\
                  <div id="postcode-checked-pass" class="hiddenField">\
                      <ul>\
                          <li class="imd"></li>\
                          <li class="tundra"></li>\
                      </ul>\
                      <p>As you meet at least one of the home postcode criteria, and attended a UK state school, you are eligible for Access UCL.</p>\
                  </div>\
                  <p>Based on the information you\'ve provided, if your application to UCL is successful, you will receive an Access UCL offer.</p>\
              </div>\
          </div>\
      </div>\
      <div class="hiddenField" id="case-by-case">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-info clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>You may still be eligible for Access UCL</h4>\
                  <p id="maybe-text">Students who attend or attended a UK private school who are care leavers are considered on a case-by-case basis. Email <a href="mailto:wp.accessucl@ucl.ac.uk">wp.accessucl@ucl.ac.uk</a> with your personal details for a decision.</p>\
              </div>\
          </div>\
      </div>\
    </fieldset>\
    <div class="field hiddenField" id="resetter">\
        <p class="darr">&nbsp;</p>\
        <input type="reset" class="access-button btn-cta" id="form-reset" value="Start again &olarr;" />\
    </div>\
</form>';
                // Finish intialising the widget and inject the HTML above.
                $("#access-ucl-form").html(widget);
                $(".hiddenField").css("display", "none");
                $("#checker-widget").trigger("reset");
            });
        }
    };
})(jQuery, Drupal);

