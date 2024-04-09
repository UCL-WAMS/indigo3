/********************************************************************
*
* App providing the goodness for the EFY eligibility checker web app
* AJAX requests to DB prove interactive experience
* TODO: No non-JS version as yet
* Consider making every school postcode keyup delete the schoolname and postcode 
* in case the school has been selected and the user realises it was an error
*
*********************************************************************/

(function ($) {
    Drupal.behaviors.ucl_indigo_access_ucl = {
        attach: function (context, settings) {
            $(document).ready(function() {
                // Initialise the widget.
                $("#access-ucl-widget").after("<div id=\"access-ucl-form\" style=\"background-color:transparent\">Access UCL widget loading</div>");

                var maybe = {
                    "equivalent-overseas":"<strong>Applications equivalent overseas level 3 qualification</strong> will be assessed on a case-by-case basis. Please email <a href=\"mailto:EFY@ucl.ac.uk\">EFY@ucl.ac.uk</a> to determine confirm whether you meet the entry requirements.",
                    "forced-migrant":"<strong>Applications from forced migrants</strong> will be assessed on a case-by-case basis. Please email <a href=\"mailto:EFY@ucl.ac.uk\">EFY@ucl.ac.uk</a> to determine if your qualifications meet the criteria.",
                    "over21":"<strong>Applications from mature applicants</strong> will be assessed on a case-by-case basis. It is expected that both your work experience and your educational qualifications will contribute to your academic eligibility for the programme. Please email <a href=\"mailto:EFY@ucl.ac.uk\">EFY@ucl.ac.uk</a> to confirm whether you meet the entry requirements."
                }
                var year = '2024';
                // This holds postcode eligibility data.
                var eligibilityData = {};
                // If you reach the two-criteria stage, this stores the criteria you pass, allowing the JS to count them.
                var twoCriteria = [];
                
                // This is a list of all elements that might need to be hidden.
                // At each step we iterate this and hide them all, except the new one to be revealed, and any already in the 'path' of the user journey.
                var elementlist = ["home-fees","level4","forced-migrant","over21","care","attend","young-carer","estranged","educational-gap","free-meals","postcode-test","ucas","grades","ineligible","eligible","case-by-case","indeterminate","ajax-spinner","lightbox"];
                // This is the list of items in the path. It grows dynamically as we move along the path.
                var pathlist = ["home-fees"];
                // This array is required to allow the twoCriteria array to be reset if a radio button value prior to the two criteria path is changed.
                var early_elements = ["home-fees","level4","forced-migrant","over21","care","attend"];
                // This array is required to allow the twoCriteria array to be reset if a radio button value in the two criteria path is changed
                var two_criteria_elements = ["estranged","educational-gap","free-meals","postcode-test"];

                // Utility functions 
                // Trim shim, for older browsers.
                if (typeof(String.prototype.trim) === "undefined") {
                    String.prototype.trim = function() {
                        return String(this).replace(/^\s+|\s+$/g, '');
                    }
                }
                
                function resetTwoCriteriaIfRelevant(elementid) {
                    if (early_elements.includes(elementid)) {
                        twoCriteria = [];
                    }
                }
                
                function resetCriteria(elementid) {
                    var newCriteria = [];
                    var change_element_index = two_criteria_elements.indexOf(elementid);
                    for (var i = 0; i < twoCriteria.length; i++) {
                        var other_element_index = two_criteria_elements.indexOf(twoCriteria[i]);
                        if (change_element_index > other_element_index) {
                            newCriteria.push(twoCriteria[i]);
                        }
                    }
                    twoCriteria = newCriteria;
                }
                
                function checkCriteria(elementid) {
                    for (var i = 0; i < twoCriteria.length; i++) {
                        if (twoCriteria[i] == elementid) {
                            return;
                        }
                    }
                    twoCriteria.push(elementid);
                }
                
                function resetRadios(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        $("input[name='" + arr[i] + "']").prop("checked", false);
                    }
                }

                function resetPath(myid) {
                    for (var i = 0; i < pathlist.length; i++) {
                        if (pathlist[i] == myid) {
                            resetRadios(pathlist.slice(i + 1));
                            pathlist = pathlist.slice(0, i + 1);
                            break;
                        }
                    }
                }

                function showMe(myid, elementid) {
                    if (elementid != "resetter") {
                        resetPath(myid);
                        resetTwoCriteriaIfRelevant(myid);
                        if (typeof elementid == "string") {
                            pathlist.push(elementid);
                        } else {
                            pathlist.concat(elementid);
                        }
                        for (var i = 0; i < elementlist.length; i++) {
                            var showme = false;
                            INNER:
                            for (var j = 0; j < pathlist.length; j++) {
                                if (elementlist[i] == pathlist[j]) {
                                    if ($("#" + pathlist[j]).css("display") == "none") {
                                        $("#" + pathlist[j]).fadeIn("slow");
                                    }
                                    showme = true;
                                    break INNER;
                                }
                            }
                            if (!showme) {
                                $("#" + elementlist[i]).css("display", "none");
                            }
                        }
                    } else {
                        $("#" + elementid).fadeIn("slow");
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

                function checkEligibilityAfterPostcodeChecker(indeterminate) {
                    if (twoCriteria.length > 1) {
                        showMe("postcode-test", "ucas");
                    } else if (twoCriteria.length == 1 && indeterminate) {
                        showMe("postcode-test", "indeterminate");
                    } else {
                        showMe("postcode-test", "ineligible");
                    }
                }

                function resetWidget() {
                    $(".hiddenField").css("display", "none");
                    $("#checker-widget").trigger("reset");
                    eligibilityData = {};
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

                // This is not currently required.
                // It allows the order of elements to be rearranged in case of two possible routes.
                function moveFormElement(elementToMove, insertAfter) {
                    var el = $(elementToMove).detach();
                    $(insertAfter).after(el);
                }
                // End utility functions.


                // Event handling from here.

                // Handle specific radio button selections.
                $("body").on("click", "input[name='home-fees']", function() {
                    if ($(this).val() == "N") {
                        showMe("home-fees", "ineligible");
                    } else {
                        showMe("home-fees", "level4");
                    }
                    showMe("home-fees", "resetter");
                });
                $("body").on("click", "input[name='level4']", function() {
                    if ($(this).val() == "Y") {
                        showMe("level4", "ineligible");
                    } else {
                        showMe("level4", "forced-migrant");
                    }
                });
                $("body").on("click", "input[name='forced-migrant']", function() {
                    if ($(this).val() == "N") {
                        showMe("forced-migrant", "over21");
                    } else {
                        $("#maybe-text").html(maybe["forced-migrant"]);
                        showMe("forced-migrant", "case-by-case");
                    }
                });
                $("body").on("click", "input[name='over21']", function() {
                    if ($(this).val() == "N") {
                        showMe("over21", "care");
                    } else {
                        $("#maybe-text").html(maybe["over21"]);
                        showMe("over21", "case-by-case");
                    }
                });
                $("body").on("click", "input[name='care']", function() {
                    if ($(this).val() == "N") {
                        showMe("care", "attend");
                    } else {
                        showMe("care", "ucas");
                    }
                });
                $("body").on("click", "input[name='attend']", function() {
                    if ($(this).val() == "N") {
                        showMe("attend", "ineligible");
                    } else {
                        showMe("attend", "young-carer");
                    }
                });
                $("body").on("click", "input[name='young-carer']", function() {
                    resetCriteria("young-carer");
                    if ($(this).val() == "N") {
                        showMe("young-carer", "estranged");
                    } else {
                        checkCriteria("young-carer");
                        if (twoCriteria.length > 1) {
                            showMe("young-carer", "ucas");
                        } else {
                            showMe("young-carer", "estranged");
                        }
                    }
                });
                $("body").on("click", "input[name='estranged']", function() {
                    resetCriteria("estranged");
                    if ($(this).val() == "N") {
                        showMe("estranged", "educational-gap");
                    } else {
                        checkCriteria("estranged");
                        if (twoCriteria.length > 1) {
                            showMe("estranged", "ucas");
                        } else {
                            showMe("estranged", "educational-gap");
                        }
                    }
                });
                $("body").on("click", "input[name='educational-gap']", function() {
                    resetCriteria("educational-gap");
                    if ($(this).val() == "N") {
                        showMe("educational-gap", "free-meals");
                    } else {
                        checkCriteria("educational-gap");
                        if (twoCriteria.length > 1) {
                            showMe("educational-gap", "ucas");
                        } else {
                            showMe("educational-gap", "free-meals");
                        }
                    }
                });
                $("body").on("click", "input[name='free-meals']", function() {
                    resetCriteria("free-meals");
                    if ($(this).val() == "N") {
                        showMe("free-meals", "postcode-test");
                    } else {
                        checkCriteria("free-meals");
                        if (twoCriteria.length > 1) {
                            showMe("free-meals", "ucas");
                        } else {
                            showMe("free-meals", "postcode-test");
                        }
                    }
                });
                $("body").on("click", "input[name='ucas']", function() {
                    if ($(this).val() == "N") {
                        showMe("ucas", "ineligible");
                    } else {
                        showMe("ucas", "grades");
                    }
                });
                $("body").on("click", "input[name='grades']", function() {
                    if ($(this).val() == "N") {
                        showMe("grades", "ineligible");
                    } else {
                        showMe("grades", "eligible");
                    }
                });

                var get_url = (location.href.indexOf("local-micro.lndo.site") > -1?"https://local-micro.lndo.site/access-ucl/www/eligibility-" + year + ".php":(location.href.indexOf("wwwapps-uat.ucl.ac.uk") > -1?"https://wwwapps-uat.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-" + year + ".php":"https://www.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-" + year + ".php"));
                $("body").on("submit", "#checker-widget", function(e) {
                    resetCriteria("postcode-test")
                    showMe("postcode-test", "#postcode-criteria-msg");
                    e.preventDefault();
                    if (!$("#ajax-spinner").is("div")) {
                        $("body").prepend('<div class="hiddenField" id="ajax-spinner">Loading<br/><img src="//cdn.ucl.ac.uk/skins/UCLIndigoSkin/default-theme/images/iris/ajax-loader.gif" alt="Loading..."></div><div id="lightbox"></div>');
                    }
                    if (!$("input[name='postcode']").val()) {
                        // No home postcode entered.
                        $("input[name='postcode']").parent().addClass("errorField");
                    } else {
                        // We have a valid entry
                        // LIGHTBOX AND SPINNER NOT APPEARING
                        fillScreen($("#lightbox"));
                        centreOnScreen($("#ajax-spinner"));
                        showMe("postcode-test",["ajax-spinner","lightbox"]);
                        // These are the default messages to display after checking the DB.
                        messages = {
                            school:"Your A-Level is not an eligible school.",
                            imd:"Your postcode isn't IMD eligible.",
                            polar:"Your postcode isn't POLAR eligible.",
                            acorn:"Your postcode isn't Acorn eligible."
                        }
                        $(".errorField").removeClass("errorField");
                        eligibilityData["pc"] = ValidateAndFixPostcode($("input[name='postcode']").val());
                        eligibilityData["efy"] = "true";
                        eligibilityData["year"] = year;
                        $.get(get_url, eligibilityData, function(data) {
                            var pass = false;
                            var indeterminate = false;
                            const acorns = ["L","M","O","P","Q"];
                            if (data) {
                                if (data["polar_4_quintile"] == 6 && data["imd_decile"] == 11) {
                                    // The home postcode is in neither IMD nor POLAR data tables.
                                    // 6 and 11 are illegal values set deliberately if there is no match.
                                    $("input[name='postcode']").parent().addClass("errorField");
                                    alert("Your home postcode does not appear in our database. Please check it and try again.");
                                    // Hide the lightbox and spinner ??
                                } else {
                                    if (data["polar_4_quintile"] === null || data["polar_4_quintile"] === "" || data["polar_4_quintile"] === 0 || data["polar_4_quintile"] == "0" || data["polar_4_quintile"] == "NULL" || data["polar_4_quintile"] == "R") {
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
                                    // Blank or null Acorn data counts as not eligible
                                    if (data["acorn_group"] !== "" && data["acorn_group"] != "0" && data["acorn_group"] != null && acorns.includes(data["acorn_group"])) {
                                        pass = true;
                                        messages.acorn = "Your postcode is Acorn eligible.";
                                    }
                                    // We now have a pass/fail for any complete set of data which we can use to 
                                    // determine which messages to display or further questions to ask.
                                    if (pass) {
                                        checkCriteria("postcode-test");
                                        // Set messages after search.
                                    }
                                    // This is the check to see if the user hits the two criteria score and may proceed.
                                    checkEligibilityAfterPostcodeChecker(indeterminate);
                                }
                            } else {
                                $("input[name='postcode']").parent().addClass("errorField");
                                alert("You have entered an invalid home postcode. Please check and try again.");
                                showMe("","#ajax-spinner,#lightbox");
                            }
                        }, 'jsonp');
                    }
                    // Now display the appropriate message at the end of the process.
                });
                $("body").on("click", "#form-reset", function() {
                    // Reset everything else to init state (the form data is taken care of by default action of the click).
                    resetWidget();
                });
                // End event handling.

                // HTML template
var widget = '  <p><strong>The outcome of this checker is indicative, and your eligibility will be reviewed upon receipt of your UCAS application.</strong></p>\
  <form action="" method="get" id="checker-widget" autocomplete="off">\
    <fieldset>\
      <h3 class="darr">Start here &darr;</h3>\
      <div class="field" id="home-fees">\
          <p class="darr hiddenField">&darr;</p>\
          <div>Are you eligible for UK/home fee status?</div>\
          <div><label><input type="radio" name="home-fees" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="home-fees" value="N"> No</label></div>\
          <div class="discreet">If you are not sure, please check <a target="_blank" href="https://www.ucl.ac.uk/students/fees-and-funding/pay-your-fees/fee-schedules/student-fee-status#assessment">UCL\'s guidance on student fee status.</a></div>\
      </div>\
\
      <div class="field hiddenField" id="level4">\
          <p class="darr">&darr;</p>\
          <div>Have you completed study at or above Level 4?</div>\
          <div><label><input type="radio" name="level4" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="level4" value="N"> No</label></div>\
          <div class="discreet">Examples of <a target="_blank" href="https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels">Level 4 qualifications</a> include but are not limited to Higher National Certificates and Certificates of Higher Education. The first year of an undergraduate degree is equivalent to a Level 4 qualification.</div>\
      </div>\
\
      <div class="field hiddenField" id="forced-migrant">\
          <p class="darr">&darr;</p>\
          <div>Are you a forced migrant?</div>\
          <div><label><input type="radio" name="forced-migrant" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="forced-migrant" value="N"> No</label></div>\
          <div class="discreet">We use the term \'forced migrant\' to mean one of the following:<br\>\
              <ul>\
                  <li>Refugee</li>\
                  <li>Asylum seeker</li>\
                  <li>Those who have been granted a temporary form of leave as the result of an asylum or human rights application (e.g. limited leave to remain, discretionary leave to remain, humanitarian protection, UASC leave)</li>\
              </ul>\
          </div>\
      </div>\
\
      <div class="field hiddenField" id="over21">\
          <p class="darr">&darr;</p>\
          <div>Would you be 21 or older on the day you start your first undergraduate degree?</div>\
          <div><label><input type="radio" name="over21" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="over21" value="N"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="care">\
          <p class="darr">&darr;</p>\
          <div>Are you care experienced?</div>\
          <div><label><input type="radio" name="care" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="care" value="N"> No</label></div>\
          <div class="discreet">We define this as meaning you were looked after by or were in kinship care as a formal agreement with a local authority, for three (not necessarily consecutive) months. You would need to be under 25 on your first day at UCL.</div>\
      </div>\
\
      <div class="field hiddenField" id="attend">\
          <p class="darr">&darr;</p>\
          <div>Did you attend/are you attending a UK state school for your Level 3 qualifications?</div>\
          <div><label><input type="radio" name="attend" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="attend" value="N"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="young-carer">\
          <p class="darr">&darr;</p>\
          <div>Are you a young carer?</div>\
          <div><label><input type="radio" name="young-carer" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="young-carer" value="N"> No</label></div>\
          <div class="discreet">A young carer is someone whose life is adversely affected by providing ongoing care for a parent or guardian (that they live with) who has a chronic illness. You must be under 21 on your first day at UCL.</div>\
      </div>\
\
      <div class="field hiddenField" id="estranged">\
          <p class="darr">&darr;</p>\
          <div>Are you estranged from your family?</div>\
          <div><label><input type="radio" name="estranged" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="estranged" value="N"> No</label></div>\
          <div class="discreet">UCL\'s definition of estrangement is not communicating with or receiving support from any and all family members. This will apply if an applicant is permanently estranged from their family and has been for at least a year.</div>\
      </div>\
\
      <div class="field hiddenField" id="educational-gap">\
          <p class="darr">&darr;</p>\
          <div>Have you had an educational gap of at least a year?</div>\
          <div><label><input type="radio" name="educational-gap" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="educational-gap" value="N"> No</label></div>\
          <div class="discreet">An example of an educational gap is leaving school at 16 but returning to complete a Level 3 qualification after several years in work. Please note that deferred or \'gap\' years between school and university are not considered under this criterion.</div>\
      </div>\
\
      <div class="field hiddenField" id="free-meals">\
          <p class="darr">&darr;</p>\
          <div>Are you eligible for free school meals?</div>\
          <div><label><input type="radio" name="free-meals" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="free-meals" value="N"> No</label></div>\
          <div class="discreet">Applicants who were known to be eligible for free school meals (FSMs) at the end of Key Stage 4 (Year 11) and/or six years prior to this point (England); were known to be eligible for FSMs in the 6 years prior to Year 12 (Northern Ireland); or were known to have been eligible for FSMs between the start of Year 11 and the January five years prior to this (Wales).</div>\
      </div>\
\
      <div id="postcode-test" class="hiddenField">\
          <p class="darr">&darr;</p>\
          <div class="field">\
              <label>Please enter your current home postcode<br><strong>All postcodes must include the space between the two halves.</strong></label>\
              <input type="text" class="postcodefield" name="postcode" value="" />\
          </div>\
\
          <div class="field submitter" id="submitter">\
              <input type="submit" class="access-button btn-cta" value="Check my eligibility &rsaquo;" />\
          </div>\
          <div class="discreet">\
              <p><br/>This checks for applicants who live in an area that has a high level of financial, social or economic deprivation, or low progression to higher education.<br/>\
              We use the <a target="_blank" href="https://www.gov.uk/government/statistics/english-indices-of-deprivation-2019">Index of Multiple of Deprivation</a> and <a target="_blank" href="https://acorn.caci.co.uk/">Acorn data</a> to identify levels of financial, social or economic deprivation. We use POLAR classification to look at how likely young people are to participate in HE across the UK.</p>\
          </div>\
      </div>\
\
      <div class="field hiddenField" id="ucas">\
          <p class="darr">&darr;</p>\
          <div>Do you have or are predicted to have a minimum of 100 UCAS points?</div>\
          <div><label><input type="radio" name="ucas" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="ucas" value="N"> No</label></div>\
          <div class="discreet">Please see the Engineering Foundation Year\'s <a target="_blank" href="https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/engineering-foundation-year#entry-requirements">academic entry requirements</a> for details of which Level 3 qualifications we accept (examples include A-Levels and IB Diplomas). If you are not sure how many UCAS points your qualifications are worth, you can use <a target="_blank" href="https://www.ucas.com/ucas/tariff-calculator">UCAS\' Tariff Calculator</a>.</div>\
      </div>\
\
      <div class="field hiddenField" id="grades">\
          <p class="darr">&darr;</p>\
          <div>Did you achieve a minimum of Grades 4 or C in Mathematics and English Language GCSE?</div>\
          <div><label><input type="radio" name="grades" value="Y"> Yes</label></div>\
          <div><label><input type="radio" name="grades" value="N"> No</label></div>\
      </div>\
\
      <div class="hiddenField" id="indeterminate">\
          <p class="darr">&darr;</p>\
          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">\
              <div class="alert__icon">\
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>\
              </div>\
              <div class="alert__content">\
                  <h4>Sorry, we cannot determine whether you are eligible for the EFY</h4>\
                  <div id="postcode-checked-indeterminate" class="hiddenField">\
                      <p>Your postcode is not available in our database, please contact <a href="mailto:EFY@ucl.ac.uk">EFY@ucl.ac.uk</a> to check your eligibility.</p>\
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
                  <h4>Sorry, you are not eligible for the EFY</h4>\
                  <p>Based on the information you\'ve provided, you are not eligible to apply to join the Engineering Foundation Year course.</p>\
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
                  <h4>Great news! You are eligible for the EFY</h4>\
                  <p>Based on the information you\'ve provided, you are eligible to apply to join the Engineering Foundation Year course.</p>\
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
                  <h4>You may be eligible for the EFY</h4>\
                  <p id="maybe-text"></p>\
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
                resetWidget();
            });
        }
    };
})(jQuery, Drupal);

