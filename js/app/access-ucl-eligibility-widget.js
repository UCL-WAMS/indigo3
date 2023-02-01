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

                // check for EFY widget version.
                var isEFY = $("#access-ucl-widget").attr("data-wid") == "efy";
                var text1 = (isEFY ? "Engineering Foundation Year" : "Access UCL");
                var text2 = (isEFY ? "to apply for the Engineering Foundation Year" : "for Access UCL");

                // Initialise the widget.
                $("#access-ucl-widget").after("<div id=\"access-ucl-form\">" + text1 + " widget loading</div>");

                var maybe = {
                    "care-leaver":"Students who attend or attended a UK private school who are care leavers are considered on a case-by-case basis. Email <a href=\"mailto:wp.accessucl@ucl.ac.uk\">wp.accessucl@ucl.ac.uk</a> with your personal details for a decision.",
                    "estranged":"You may be eligible " + text2 + ", please contact <a href=\"mailto:wp.accessucl@ucl.ac.uk\">wp.accessucl@ucl.ac.uk</a> for further information."
                }

                // Event handling from here.
    
                // This handler resets all fields after a radio button change in the app flow.
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
                $("body").on("click", "input[name='domiciled']", function() {
                    if ($(this).val() == "N") {
                        showMe("#ineligible,#resetter","#attend-uk-private,#attend-uk,#care,#school-test,#eligible,#indeterminate,#case-by-case,#school-checked-nopass,#school-checked-pass,#estranged");
                    } else {
                        showMe("#attend-uk,#resetter","#attend-uk-private,#ineligible,#care,#school-test,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    }
                });
                $("body").on("click", "input[name='attend']", function() {
                    if ($(this).val() == "N") {
                        showMe("#attend-uk-private","#history-event,#care,#school-test,#eligible,#ineligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    } else if ($("#history-event").is("div")){
                        showMe("#history-event","#care,#attend-uk-private,#ineligible,#school-test,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    } else {
                        showMe("#care","#attend-uk-private,#ineligible,#school-test,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    }
                });
                $("body").on("click", "input[name='history']", function() {
                    if ($(this).val() == "N") {
                        showMe("#care","#attend-uk-private,#school-test,#ineligible,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    } else {
                        showMe("#eligible","#attend-uk-private,#ineligible,#care,#school-test,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    }
                });
                $("body").on("click", "input[name='attend-private']", function() {
                    if ($(this).val() == "N") {
                        showMe("#ineligible","#care,#school-test,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    } else {
                        showMe("#care","#ineligible,#school-test,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass");
                    }
                });
                $("body").on("click", "input[name='care-leaver']", function() {
                    if ($(this).val() == "N" && $("input[name='attend']:checked").val() == "Y") {
                        // State school + non-care-leaver = look at the main school and home criteria.
                        showMe("#school-test","#ineligible,#eligible,#indeterminate,#case-by-case,#attend-uk-private,#school-checked-nopass,#school-checked-pass,#time-in-care");
                    } else if ($(this).val() == "Y" && $("input[name='attend']:checked").val() == "Y") {
                        // State school + care-leaver = eligible.
                        showMe("#eligible,#time-in-care","#ineligible,#indeterminate,#case-by-case,#school-test,#attend-uk-private,#estranged,#school-checked-nopass,#school-checked-pass");
                    } else if ($(this).val() == "Y" && $("input[name='attend-private']:checked").val() == "Y") {
                        // Public school + care-leaver = eligible (was case-by-case).
                        // Set the case-by case text first.
             //           $("#maybe-text").html(maybe["care-leaver"]);
                        showMe("#eligible,#time-in-care","#case-by-case,#ineligible,#indeterminate,#school-test,#estranged,#school-checked-nopass,#school-checked-pass");
                    } else {
                        showMe("#ineligible","#school-test,#eligible,#indeterminate,#case-by-case,#estranged,#school-checked-nopass,#school-checked-pass,#postcode-criteria-msg,#time-in-care");
            /*            showMe("#estranged","#ineligible,#eligible,#indeterminate,#school-test,#case-by-case");
                        $("input[name='estranged']").click(function() {
                            // Public school + non-care-lever = young carer or estranged.
                            // Has this question been asked before or after the school and postcode checks?
                            var hideSchool = ($("input[name='postcode']").val()?"":",#school-test,#school-checked-nopass");
                            if ($(this).val() == "Y") {
                                // Young carer or extranged = case-by-case.
                                // Set the case-by case text first.
                                $("#maybe-text").html(maybe["estranged"]);
                                showMe("#case-by-case","#indeterminate,#ineligible,#eligible" + hideSchool);
                            } else {
                                // Public school + non-young-carer/estranged = ineligible.
                                showMe("#ineligible","#indeterminate,#eligible,#case-by-case" + hideSchool);
                            }
                        });*/
                    }
                });

                // If you start re-typing an a-level or GCSE school postcode, or home postcode
                // then this handler resets the data and allows a new school search.
                $("body").on("keyup", ".postcodefield", function() {
                    var fieldname = $(this).attr("name");
                    // Reset estranged field in case it has been set.
                    // It is the only radio field which may come after the postcode searches.
                    $("input[name='estranged']").prop("checked",false);
                    if (!$("#history-event").is("div")) {
                        if (fieldname == "alevel-school-postcode" || fieldname == "postcode") {
                            showMe("#school-test,#submitter","#ineligible,#eligible,#indeterminate,#case-by-case,#attend-uk-private,#estranged,#school-checked-nopass,#school-checked-pass,#time-in-care");
                            if (fieldname == "alevel-school-postcode") {
                                // The script must reset the eligibilityData for the A level schoolname.
                                delete eligibilityData["alevel_name"];
                            }
                        } else {
                            // Hide only the eligibility bits.
                            showMe("#submitter","#ineligible,#eligible,#indeterminate,#case-by-case,#attend-uk-private,#estranged,#school-checked-nopass,#school-checked-pass,#time-in-care");
                            // The script must reset the eligibilityData for the GCSE schoolname.
                            delete eligibilityData["gcse_name"];
                        }
                    }
                });

                var eligibilityData = {};
                var get_url = (location.href.indexOf("local-micro.lndo.site") > -1?"https://local-micro.lndo.site/access-ucl/www/eligibility-2023.php":(location.href.indexOf("wwwapps-uat.ucl.ac.uk") > -1?"https://wwwapps-uat.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-2023.php":"https://www.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-2023.php"));
                $("body").on("keyup", ".selector-widget", function() {
                    var schooltype_postcode = $(this).attr("name").replace(/-/g,"_");
                    var parts = schooltype_postcode.split("_");
                    var schooltype = parts[0];
                    var optionstring = "#" + schooltype + "-option-school";
                    var namestring = schooltype + "_name";
                    var school_postcode = $(this).val();
                    eligibilityData["schoolsearch"] = schooltype;
                    if (school_postcode.length > 1) {
                        // Start the AJAX lookup after two characters, to catch postcodes like N3, G5 etc.
                         // The list will appear as they type, allowing the user to select their school by name.
                        eligibilityData[schooltype_postcode] = school_postcode;
                        $.get(get_url, eligibilityData, function(data) {
                            var html = "";
                            if (data) {
                                for (var i = 0; i < data.length; i++) {
                                    html += "<div class='myoption'><span class='schoolname'>" + data[i]["school_name"] + "</span> (<span class='school-postcode'>" + data[i]["postcode"] + "</span>)</div>";
                                }
                                $(optionstring).html(html);
                                $(optionstring).fadeIn("slow");
                                $(optionstring + " > .myoption").click(function() {
                                    $(this).addClass("selected");
                                    eligibilityData[namestring] = $(this).children(".schoolname").first().text().replace(/\'/g,"\\'");
                                    eligibilityData[schooltype_postcode] = $(this).children(".school-postcode").first().text();
                                    $(this).siblings(".myoption").fadeOut("fast");
                                });
                            } else {
                                html += "<div class='noschool'>No schools in this postcode</div>";
                                $(optionstring).html(html);
                                $(optionstring).fadeIn("slow");
                            }
                        }, 'jsonp');
                    }
                });

                $("body").on("submit", "#checker-widget", function(e) {
                    showMe("#postcode-criteria-msg","#estranged,#school-checked-nopass,#school-checked-pass,#time-in-care");
                    e.preventDefault();
                    delete eligibilityData["schoolsearch"];
                    if (!$("#ajax-spinner").is("div")) {
                        $("body").prepend('<div class="hiddenField" id="ajax-spinner">Loading<br/><img src="//cdn.ucl.ac.uk/skins/UCLIndigoSkin/default-theme/images/iris/ajax-loader.gif" alt="Loading..."></div><div id="lightbox"></div>');
                    }
                    if (!$("#history-event").is("div")) {
                        // This is the main scheme.
                        if (!$("input[name='postcode']").val()) {
                            // No home postcode entered.
                            $("input[name='postcode']").parent().addClass("errorField");
                        } else if (typeof eligibilityData["alevel_name"] == "undefined" || !eligibilityData["alevel_name"]) {
                            // No school selected
                            $("input[name='alevel-school-postcode']").parent().addClass("errorField");
                            alert("You need to enter a school postcode and then click on a school name to select it.");
                        } else {
                            // We have a valid entry
                            fillScreen($("#lightbox"));
                            centreOnScreen($("#ajax-spinner"));
                            showMe("#ajax-spinner,#lightbox");
                            // These are the default messages to display after checking the DB.
                            messages = {
                                school:"Your A-Level is not an eligible school.",
                                imd:"Your postcode isn't IMD eligible.",
                                polar:"Your postcode isn't POLAR eligible.",
                                acorn:"Your postcode isn't Acorn eligible."
                            }
                            $(".errorField").removeClass("errorField");
                            eligibilityData["pc"] = ValidateAndFixPostcode($("input[name='postcode']").val());//$("input[name='postcode']").val().replace(/ /g,"");
                            $.get(get_url, eligibilityData, function(data) {
                                // We're now scoring in such a way as to create a unique set of scores for each result, as follows:
                                // PASS IMD or Polar4 scores 6
                                // PASS school scores 3 points
                                // Undefined IMD or Polar4 scores 1
                                // FAIL scores 0
                                var pass = false;
                                var indeterminate = false;
                                const acorns = ["L","M","O","P","Q"];
                                if (data) {
                                    if (data["polar_4_quintile"] == 6 && data["imd_decile"] == 11) {
                                        // The home postcode is in neither IMD nor POLAR data tables.
                                        // 6 and 11 are illegal values set deliberately if there is no match.
                                        $("input[name='postcode']").parent().addClass("errorField");
                                        alert("Your home postcode does not appear in our database. Please check it and try again.");
                                        showMe("","#ajax-spinner,#lightbox");
                                    } else if (!data["state_independent"]) {
                                        // There is a problem with the school data, probably caused by a duplicate school.
                                        showMe("","#ajax-spinner,#lightbox");
                                        alert("There was a problem with your school selection. Please try again. If the problem persists, contact wp.accessucl@ucl.ac.uk and let us know which school is affected.");
                                        $("#checker-widget").trigger("reset");
                                        $("#form-reset").click();
                                    } else {
                                        if (data["state_independent"] == "Independent") {
                                            messages.school = "Your A-level school is not a state school.";
                                            messages.imd = "Your postcode IMD score is not relevant as you attended an Independent school for A-level."
                                            messages.polar = "Your postcode POLAR score is not relevant as you attended an Independent school for A-level."
                                            messages.acorn = "Your postcode Acorn score is not relevant as you attended an Independent school for A-level."
                                        } else {
                                            messages.school = "Your A-Level school is an eligible school.";
                                            if (data["polar_4_quintile"] === null || data["polar_4_quintile"] === "" || data["polar_4_quintile"] === 0 || data["polar_4_quintile"] == "0" || data["polar_4_quintile"] == "NULL") {
                                                indeterminate = true;
                                                messages.polar = "Your postcode is not available in our POLAR 4 database.";
                                            } else if (data["polar_4_quintile"] !== "" && data["polar_4_quintile"] != "0" && data["polar_4_quintile"] > 0 && data["polar_4_quintile"] < 2) {
                                                pass = true;
                                                messages.polar = "Your postcode is POLAR eligible.";
                                            }
                                            if (data["imd_decile"] === null || data["imd_decile"] === "" || data["imd_decile"] === 0 || data["imd_decile"] == "0" || data["imd_decile"] == "NULL") {
                                                indeterminate = true;
                                                messages.imd = "Your postcode is not available in our IMD database.";
                                            } else if (data["imd_decile"] !== "" && data["imd_decile"] != "0" && data["imd_decile"] > 0 && data["imd_decile"] < 3) {
                                                pass = true;
                                                messages.imd = "Your postcode is IMD eligible.";
                                            }
                                            if (data["acorn_group"] === null || data["acorn_group"] === "" || data["acorn_group"] === 0 || data["acorn_group"] == "0" || data["acorn_group"] == "NULL") {
                                                indeterminate = true;
                                                messages.acorn = "Your postcode is not available in our Acorn database.";
                                            } else if (data["acorn_group"] !== "" && data["acorn_group"] != "0" && acorns.includes(data["acorn_group"])) {
                                                pass = true;
                                                messages.acorn = "Your postcode is Acorn eligible.";
                                            }
                                        }
                                        // We now have a pass/fail for any complete set of data which we can use to 
                                        // determine which messages to display or further questions to ask.
                                        if (pass) {
                                            // This person seems eligible.
                                            showMe("#eligible","#ineligible,#indeterminate,#case-by-case,#ajax-spinner,#lightbox");
                                            // Set messages after search.
                                            setEligibilityMessages("#school-checked-pass");
                                        } else if (indeterminate) {
                                            // This person might be eligible if their POLAR_4, Acorn or IMD value were properly defined, so set a special message
                                            showMe("#indeterminate","#eligible,#ineligible,#case-by-case,#ajax-spinner,#lightbox");
                                            // Set messages after search.
                                            setEligibilityMessages("#school-checked-indeterminate");
                                        } else {
                                            // This doesn't match POLAR, IMD or Acorn, so check the extranged status, if they attended a state school.
                                            if (data["state_independent"] != "Independent") {
                                                showMe("#estranged","#ineligible,#eligible,#indeterminate,#case-by-case,#ajax-spinner,#lightbox");
                                                $("input[name='estranged']").click(function() {
                                                    // Ineligible school + non-care-lever = young carer or estranged.
                                                    if ($(this).val() == "Y") {
                                                        // Young carer or extranged = case-by-case.
                                                        // Set the case-by case text first.
                                                        $("#maybe-text").html(maybe["estranged"]);
                                                        showMe("#case-by-case","#ineligible,#eligible,#indeterminate,#case-by-case,#ajax-spinner,#lightbox");
                                                    } else {
                                                        // ineligible school + non-young carer/estranged = ineligible.
                                                        showMe("#ineligible","#eligible,#indeterminate,#case-by-case,#ajax-spinner,#lightbox");
                                                    }
                                                });
                                            } else {
                                                // ineligible independent school.
                                                // We've already asked if they're care experienced and they said no, so no second chance here...
                                                showMe("#ineligible","#eligible,#indeterminate,#case-by-case,#ajax-spinner,#lightbox,#postcode-criteria-msg");
                                            }
                                            // Set messages on the page in appropriate pass/fail box.
                                            setEligibilityMessages("#school-checked-nopass");
                                        }
                                    }
                                } else {
                                    $("input[name='postcode']").parent().addClass("errorField");
                                    alert("You have entered an invalid home postcode. Please check and try again.");
                                    showMe("","#ajax-spinner,#lightbox");
                                }
                            }, 'jsonp');
                        }
                    }
                });
                $("body").on("click", "#form-reset", function() {
                    // Reset everything else to init state (the form data is taken care of by default action of the click).
                    var showstring = "#domiciled-uk,#postcode-criteria-msg";
                    var hidestring = "#attend-uk-private,#attend-uk,#care,#school-test,#eligible,#ineligible,#indeterminate,#case-by-case,#school-checked-nopass,#estranged,#time-in-care,#resetter"
                    if ($("#history-event").is("div")) {
                        hidestring += ",#history-event";
                    }
                    showMe(showstring,hidestring);
                    $("#alevel-option-school,#gcse-option-school").html("");
                    eligibilityData = {};
                });
                // End event handling.
                
                // HTML template
var widget = '<p>Enter your details below to check your eligibility ' + text2 + ' (you will need your home postcode and the postcode of the school where you took your A levels).</p>\
<p>Please bear in mind that the results given here are indicative only.</p>\
\
<form action="" method="get" id="checker-widget" autocomplete="off">\
    <fieldset>\
      <h3 class="darr">Start here &darr;</h3>\
      <div class="field" id="domiciled-uk">\
          <div>Do you currently live in the UK?</div>\
          <div><label><input type="radio" name="domiciled" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="domiciled" value="N"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="attend-uk">\
          <p class="darr">&darr;</p>\
          <div>Did you attend/Do you attend a UK state school for your post-16 qualifications?</div>\
          <div><label><input type="radio" name="attend" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="attend" value="N"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="attend-uk-private">\
          <p class="darr">&darr;</p>\
          <div>Did you attend/Do you attend a UK private school for your post-16 qualifications?</div>\
          <div><label><input type="radio" name="attend-private" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="attend-private" value="N"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="care">\
          <p class="darr">&darr;</p>\
          <div>Are you care experienced?<br />\
          <span class="discreet">(This means you have been looked after by a local authority for three months in your life, the months do not need to be consecutive.)</span></div>\
          <div><label><input type="radio" name="care-leaver" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="care-leaver" value="N"> No</label></div>\
      </div>\
\
      <div id="school-test" class="hiddenField">\
          <p class="darr">&darr;</p>\
          <p><strong>All postcodes must include the space between the two halves.</strong></p>\
          <div class="field">\
              <label>\
                  Enter a few characters of the postcode of the school where you took/are taking your A-levels and then select from the schools listed.\
              </label>\
              <input class="selector-widget postcodefield" type="text" name="alevel-school-postcode" value="" />\
              <div class="optionholder">\
                  <div class="optiontext" id="alevel-option-school"></div>\
              </div>\
          </div>\
\
          <p class="darr">&nbsp;</p>\
          <div class="field">\
              <label>And enter your current home postcode</label>\
              <input type="text" class="postcodefield" name="postcode" value="" />\
          </div>\
\
\
          <div class="field submitter" id="submitter">\
              <input type="submit" class="access-button btn-cta" value="Check my eligibility &rsaquo;" />\
          </div>\
      </div>\
\
      <div class="field hiddenField" id="estranged">\
          <p class="darr">&darr;</p>\
          <div>Are you a young adult carer* or estranged from your family**?</div>\
          <div><label><input type="radio" name="estranged" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="estranged" value="N"> No</label></div>\
          <p class="discreet">* A young adult carer is someone whose life is adversely affected by caring for a family member who has a chronic physical or sensory disability, learning disability, medical conditions, mental health difficulties, or has an addiction.<br />\
          A young adult carer is someone who provides ongoing unpaid support to a family member who could not manage without this help. This usually means looking after one of their parents or caring for a brother or sister.<br />\
          Young adult carers must be aged 20 or under on their first day of study at UCL.</p>\
          <p class="discreet">** This means you no longer have the support of your family due to a permanent breakdown in your relationship(s) which has led to ceased contact for at least a year. This might mean your biological, step or adoptive parents, or wider family members who have been responsible for supporting you in the past. Students estranged from their family must be aged under 25 on their first day of study at UCL.</p>\
      </div>\
\
      <div class="hiddenField" id="indeterminate">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>Sorry, we cannot determine whether you are eligible ' + text2 + '</h4>\
                  <div id="school-checked-indeterminate" class="hiddenField">\
                      <ul>\
                          <li class="imd"></li>\
                          <li class="polar"></li>\
                          <li class="acorn"></li>\
                          <li class="school"></li>\
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
              <h4>Sorry, you are not eligible ' + text2 + '</h4>\
                  <div id="school-checked-nopass" class="hiddenField">\
                      <ul>\
                          <li class="imd"></li>\
                          <li class="polar"></li>\
                          <li class="acorn"></li>\
                          <li class="school"></li>\
                      </ul>\
                      <p id="postcode-criteria-msg">As you do not meet any of the three home postcode criteria you are not eligible ' + text2 + '.</p>\
                  </div>' +
                  (isEFY ? '' : '<p>Based on the information you\'ve provided, if your application to UCL is successful, you will only receive the standard UCL offer. You will not receive an Access UCL offer.</p>') +
              '</div>\
          </div>\
      </div>\
      <div class="hiddenField" id="eligible">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-success clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>Great news! You are eligible ' + text2 + '</h4>\
                  <div id="school-checked-pass" class="hiddenField">\
                      <ul>\
                          <li class="imd"></li>\
                          <li class="polar"></li>\
                          <li class="acorn"></li>\
                          <li class="school"></li>\
                      </ul>\
                      <p>As you meet at least one of the three home postcode criteria, and attended a state school, you are eligible ' + text2 + '.</p>\
                  </div>' +
                  (isEFY ? '' : '<p>Based on the information you\'ve provided, if your application to UCL is successful, you will receive an Access UCL offer.</p>') +
                  '<p id="time-in-care" class="hiddenField">Please ensure you tick the \'time in care\' box on your UCAS application.</p>\
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
                  <h4>You may still be eligible ' + text2 + '</h4>\
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

