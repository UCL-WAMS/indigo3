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
                $("#access-ucl-widget").after("<div id=\"access-ucl-form\" style=\"background-color:transparent\">Engineering Foundation Year widget loading</div>");

                var maybe = {
                    "equivalent-overseas":"<strong>Applications with an equivalent overseas level 3 qualification</strong> will be assessed on a case-by-case basis. Please email <a href=\"mailto:EFY@ucl.ac.uk\">EFY@ucl.ac.uk</a> to determine confirm whether you meet the entry requirements.",
                    "forced-migrant":"<p>Based on your answers, you meet the non-academic eligibility criteria for the Engineering Foundation Year. Applications from forced migrants will be assessed on a case-by-case basis. </p><p>You may wish to contact <a href=\"mailto:efy@ucl.ac.uk\">efy@ucl.ac.uk</a> to discuss your suitability for the programme. However, please note that we cannot always confirm your academic eligibility until we have received an application from you.</p>",
                    "over21":"<p>Based on your answers, you meet the non-academic eligibility criteria for the Engineering Foundation Year. Applications from mature students will be assessed on a case-by-case basis. If you are a mature applicant, it is expected that both your work experience and your educational qualifications will contribute to your academic eligibility for the programme. </p><p>You may wish to contact <a href=\"mailto:efy@ucl.ac.uk\">efy@ucl.ac.uk</a> to discuss your suitability for the programme. However, please note that we cannot always confirm your academic eligibility until we have received an application from you.</p>"
                }
                var year = '2026';
                // This holds postcode eligibility data.
                var eligibilityData = {};
                // Display a special "may be eligible" message.
                var specialMayBe = false;
                
                
                // This is a list of all elements that might need to be hidden.
                // At each step we iterate this and hide them all, except the new one to be revealed, and any already in the 'path' of the user journey.
                var elementlist = ["home-fees","level4","forced-migrant","over21","care","attend","estranged","educational-gap","free-meals","postcode-test","ucas","grades","ineligible","eligible","case-by-case","indeterminate","ajax-spinner","lightbox"];
                // This is the list of items in the path. It grows dynamically as we move along the path.
                var pathlist = ["home-fees"];

                // Utility functions 
                // Trim shim, for older browsers.
                if (typeof(String.prototype.trim) === "undefined") {
                    String.prototype.trim = function() {
                        return String(this).replace(/^\s+|\s+$/g, '');
                    }
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
//                        resetTwoCriteriaIfRelevant(myid);
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
                
                function handleClicks(name, val) {
                    switch(name) {
                        case "home-fees":
                            specialMayBe = false;
                            showMe("home-fees", "resetter");
                            if (val == "N") {
                                showMe(name, "ineligible");
                            } else {
                                showMe(name, "level4");
                            }
                            break;
                        case "level4":
                            specialMayBe = false;
                            if (val == "N") {
                                showMe(name, "forced-migrant");
                            } else {
                                showMe(name, "ineligible");
                            }
                            break;
                        case "forced-migrant":
                            if (val == "N") {
                                specialMayBe = false;
                                showMe(name, "over21");
                            } else {
                                showMe(name, "ucas");
                                // This has to be reset if you go back or reset the widget.
                                specialMayBe = "forced-migrant";
                            }
                            break;
                        case "over21":
                            if (val == "N") {
                                specialMayBe = false;
                                showMe(name, "care");
                            } else {
                                showMe(name, "ucas");
                                // This has to be reset if you go back or reset the widget.
                                specialMayBe = "over21";
                            }
                            break;
                        case "care":
                            if (val == "N") {
                                showMe(name, "attend");
                            } else {
                                showMe(name, "ucas");
                            }
                            break;
                        case "attend":
                            if (val == "N") {
                                showMe(name, "ineligible");
                            } else {
                                showMe(name, "estranged");
                            }
                            break;
                        case "estranged":
                            if (val == "N") {
                                showMe(name, "educational-gap");
                            } else {
                                showMe(name, "ucas");
                            }
                            break;
                        case "educational-gap":
                            if (val == "N") {
                                showMe(name, "free-meals");
                            } else {
                                showMe(name, "ucas");
                            }
                            break;
                        case "free-meals":
                            if (val == "N") {
                                showMe(name, "postcode-test");
                            } else {
                                showMe(name, "ucas");
                            }
                            break;
                        case "ucas":
                            if (val == "N") {
                                if (specialMayBe) {
                                    $("#maybe-text").html(maybe[specialMayBe]);
                                    showMe(name, "case-by-case");
                                } else {
                                    showMe(name, "ineligible");
                                }
                            } else {
                                showMe(name, "grades");
                            }
                            break;
                        case "grades":
                            if (val == "N") {
                                if (specialMayBe) {
                                    $("#maybe-text").html(maybe[specialMayBe]);
                                    showMe(name, "case-by-case");
                                } else {
                                    showMe(name, "ineligible");
                                }
                            } else {
                                showMe(name, "eligible");
                            }
                            break;
                    }
                }
                // End utility functions.


                // Event handling from here.

                // Handle specific radio button selections.
                
                $("body").on("click", ".widget-checker", function() {
                    handleClicks($(this).attr("name"), $(this).val());
                });
                
                var get_url = (location.href.indexOf("local-micro.lndo.site") > -1?"https://local-micro.lndo.site/access-ucl/www/eligibility-" + year + ".php":(location.href.indexOf("wwwapps-uat.ucl.ac.uk") > -1?"https://wwwapps-uat.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-" + year + ".php":"https://www.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-" + year + ".php"));
                $("body").on("submit", "#checker-widget", function(e) {
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
                                        showMe("postcode-test", "ucas");
                                        // Set messages after search.
                                    } else {
                                        showMe("postcode-test", "ineligible");
                                    }
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
var widget = '<p><strong>Important:</strong> UCL Admissions review and where necessary update definitions to the below criteria annually. Applications for 2026 entry will be assessed based on the review due in September 2025. Once this review has taken place, this notice (and if necessary, the definitions) will be updated.</p>\
<p><strong>The outcome of this checker is indicative, and your eligibility will be reviewed upon receipt of your UCAS application.</strong></p>\
  <form action="" method="get" id="checker-widget" autocomplete="off">\
    <fieldset>\
      <h3 class="darr">Start here &darr;</h3>\
      <div class="field" id="home-fees">\
          <p class="darr hiddenField">&darr;</p>\
          <div>Are you eligible for UK/home fee status?</div>\
          <div><label><input type="radio" name="home-fees" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="home-fees" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet">If you are not sure, please check <a target="_blank" href="https://www.ucl.ac.uk/students/fees-and-funding/pay-your-fees/fee-schedules/student-fee-status#assessment">UCL\'s guidance on student fee status.</a></div>\
      </div>\
\
      <div class="field hiddenField" id="level4">\
          <p class="darr">&darr;</p>\
          <div>Have you completed study at or above Level 4?</div>\
          <div><label><input type="radio" name="level4" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="level4" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet">Examples of <a target="_blank" href="https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels">Level 4 qualifications</a> include but are not limited to Higher National Certificates and Certificates of Higher Education. The first year of an undergraduate degree is equivalent to a Level 4 qualification.</div>\
      </div>\
\
      <div class="field hiddenField" id="forced-migrant">\
          <p class="darr">&darr;</p>\
          <div>Are you a forced migrant?</div>\
          <div><label><input type="radio" name="forced-migrant" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="forced-migrant" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet">We use the term \'forced migrant\' to mean one of the following:<br\>\
              <ul>\
                  <li>Refugee</li>\
                  <li>Asylum seeker</li>\
                  <li>Those who have been granted a temporary form of leave as the result of an asylum or human rights application (e.g. limited leave to remain, discretionary leave to remain, humanitarian protection, UASC leave).</li>\
              </ul>\
          </div>\
      </div>\
\
      <div class="field hiddenField" id="over21">\
          <p class="darr">&darr;</p>\
          <div>Would you be 21 or older on the day you start your first undergraduate degree?</div>\
          <div><label><input type="radio" name="over21" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="over21" value="N" class="widget-checker"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="care">\
          <p class="darr">&darr;</p>\
          <div>Are you care-experienced, and did you go to a UK school for your Level 3 qualifications?</div>\
          <div><label><input type="radio" name="care" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="care" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet"><p>We define someone as care-experienced if they have studied at a UK school for their A levels (or equivalent Level 3 qualifications) and been looked after by a local authority or been in kinship care as a formal agreement with the local authority, for three months (at least 84 days) in their life. The months do not need to be consecutive. They must also be under 25 on your first day at UCL.<p></div>\
      </div>\
\
      <div class="field hiddenField" id="attend">\
          <p class="darr">&darr;</p>\
          <div>Did you attend/are you attending a UK state school for your Level 3 qualifications?</div>\
          <div><label><input type="radio" name="attend" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="attend" value="N" class="widget-checker"> No</label></div>\
      </div>\
\
      <div class="field hiddenField" id="estranged">\
          <p class="darr">&darr;</p>\
          <div>Are you estranged from both your parents?</div>\
          <div><label><input type="radio" name="estranged" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="estranged" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet"><p>UCL\'s definition of estrangement is that you must be permanently estranged from both parents with no support from, or contact with, either parent for at least a year. This does not apply to single-parent families, where you are still in contact with one parent. You must be under 25 on your first day at UCL.</p><p><strong>Note:</strong> If you have been in local authority care, you may be considered \'care experienced\' rather than \'estranged\'.</p></div>\
      </div>\
\
      <div class="field hiddenField" id="educational-gap">\
          <p class="darr">&darr;</p>\
          <div>Have you had an educational gap of at least a year?</div>\
          <div><label><input type="radio" name="educational-gap" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="educational-gap" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet">Applicants who have experienced an educational gap of more than one year (e.g. leaving school at 16 but returning to complete a Level 3 qualifications after several years in work). Deferred or \'gap\' years between school and university are not considered under this criterion.</div>\
      </div>\
\
      <div class="field hiddenField" id="free-meals">\
          <p class="darr">&darr;</p>\
          <div>Were you previously eligible for free school meals?</div>\
          <div><label><input type="radio" name="free-meals" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="free-meals" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet"><p>To meet this criterion, applicants must have been eligible for free schools during specified timeframes in their education, as outlined below.</p><p>England: Applicants who were known to be eligible for free school meals at the end of Key Stage 4 (Year 11) and/or six years prior to this point.</p><p>Northern Ireland: Applicants who were known to be eligible for free school meals in the 6 years prior to Year 12.</p><p>Wales: Applicants who were known to be eligible for free school meals between the start of Year 11 and the January five years prior to this.</p></div>\
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
              <p><br/>Applicants who live in an area that has a high level of financial, social or economic deprivation, or low participation in higher education.</p><p>UCL use the <a target="_blank" href="https://www.gov.uk/government/collections/english-indices-of-deprivation">Index of Multiple of Deprivation</a> to identify levels of financial, social or economic deprivation, and TUNDRA to measure participation rates.</p>\
          </div>\
      </div>\
\
      <div class="field hiddenField" id="ucas">\
          <p class="darr">&darr;</p>\
          <div>Do you have or are predicted to have a minimum of 100 UCAS points?</div>\
          <div><label><input type="radio" name="ucas" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="ucas" value="N" class="widget-checker"> No</label></div>\
          <div class="discreet">Please see the Engineering Foundation Year\'s <a target="_blank" href="https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/engineering-foundation-year#entry-requirements">academic entry requirements</a> for details of which Level 3 qualifications we accept (examples include A levels and the IB Diploma). If you are not sure how many UCAS points your qualifications are worth, you can use <a target="_blank" href="https://www.ucas.com/ucas/tariff-calculator">UCAS\' Tariff Calculator</a>.</div>\
      </div>\
\
      <div class="field hiddenField" id="grades">\
          <p class="darr">&darr;</p>\
          <div>Did you achieve a minimum of Grades 4 or C in Mathematics and English Language GCSE?</div>\
          <div><label><input type="radio" name="grades" value="Y" class="widget-checker"> Yes</label></div>\
          <div><label><input type="radio" name="grades" value="N" class="widget-checker"> No</label></div>\
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
                  <h4>You may be eligible for the UCL Engineering Foundation Year</h4>\
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

