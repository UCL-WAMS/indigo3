!function(e){Drupal.behaviors.ucl_indigo_access_ucl={attach:function(i,a){e(document).ready((function(){e("#access-ucl-widget").after('<div id="access-ucl-form" style="background-color:transparent">Access UCL widget loading</div>');var i='<strong>Applications from forced migrants</strong> will be assessed on a case-by-case basis. Please email <a href="mailto:EFY@ucl.ac.uk">EFY@ucl.ac.uk</a> to determine if your qualifications meet the criteria.',a='<strong>Applications from mature applicants</strong> will be assessed on a case-by-case basis. It is expected that both your work experience and your educational qualifications will contribute to your academic eligibility for the programme. Please email <a href="mailto:EFY@ucl.ac.uk">EFY@ucl.ac.uk</a> to confirm whether you meet the entry requirements.',t="2024",l={},r=[],o=["home-fees","level4","forced-migrant","over21","care","attend","young-carer","estranged","educational-gap","free-meals","postcode-test","ucas","grades","ineligible","eligible","case-by-case","indeterminate","ajax-spinner","lightbox"],n=["home-fees"],s=["home-fees","level4","forced-migrant","over21","care","attend"],d=["estranged","educational-gap","free-meals","postcode-test"];function c(e){for(var i=[],a=d.indexOf(e),t=0;t<r.length;t++){a>d.indexOf(r[t])&&i.push(r[t])}r=i}function u(e){for(var i=0;i<r.length;i++)if(r[i]==e)return;r.push(e)}function p(i){for(var a=0;a<i.length;a++)e("input[name='"+i[a]+"']").prop("checked",!1)}function v(i,a){if("resetter"!=a){!function(e){for(var i=0;i<n.length;i++)if(n[i]==e){p(n.slice(i+1)),n=n.slice(0,i+1);break}}(i),function(e){s.includes(e)&&(r=[])}(i),"string"==typeof a?n.push(a):n.concat(a);for(var t=0;t<o.length;t++){var l=!1;e:for(var d=0;d<n.length;d++)if(o[t]==n[d]){"none"==e("#"+n[d]).css("display")&&e("#"+n[d]).fadeIn("slow"),l=!0;break e}l||e("#"+o[t]).css("display","none")}}else e("#"+a).fadeIn("slow")}function h(){e(".hiddenField").css("display","none"),e("#checker-widget").trigger("reset"),l={}}void 0===String.prototype.trim&&(String.prototype.trim=function(){return String(this).replace(/^\s+|\s+$/g,"")}),e("body").on("click","input[name='home-fees']",(function(){"N"==e(this).val()?v("home-fees","ineligible"):v("home-fees","level4"),v("home-fees","resetter")})),e("body").on("click","input[name='level4']",(function(){"Y"==e(this).val()?v("level4","ineligible"):v("level4","forced-migrant")})),e("body").on("click","input[name='forced-migrant']",(function(){"N"==e(this).val()?v("forced-migrant","over21"):(e("#maybe-text").html(i),v("forced-migrant","case-by-case"))})),e("body").on("click","input[name='over21']",(function(){"N"==e(this).val()?v("over21","care"):(e("#maybe-text").html(a),v("over21","case-by-case"))})),e("body").on("click","input[name='care']",(function(){"N"==e(this).val()?v("care","attend"):v("care","ucas")})),e("body").on("click","input[name='attend']",(function(){"N"==e(this).val()?v("attend","ineligible"):v("attend","young-carer")})),e("body").on("click","input[name='young-carer']",(function(){c("young-carer"),"N"==e(this).val()?v("young-carer","estranged"):(u("young-carer"),r.length>1?v("young-carer","ucas"):v("young-carer","estranged"))})),e("body").on("click","input[name='estranged']",(function(){c("estranged"),"N"==e(this).val()?v("estranged","educational-gap"):(u("estranged"),r.length>1?v("estranged","ucas"):v("estranged","educational-gap"))})),e("body").on("click","input[name='educational-gap']",(function(){c("educational-gap"),"N"==e(this).val()?v("educational-gap","free-meals"):(u("educational-gap"),r.length>1?v("educational-gap","ucas"):v("educational-gap","free-meals"))})),e("body").on("click","input[name='free-meals']",(function(){c("free-meals"),"N"==e(this).val()?v("free-meals","postcode-test"):(u("free-meals"),r.length>1?v("free-meals","ucas"):v("free-meals","postcode-test"))})),e("body").on("click","input[name='ucas']",(function(){"N"==e(this).val()?v("ucas","ineligible"):v("ucas","grades")})),e("body").on("click","input[name='grades']",(function(){"N"==e(this).val()?v("grades","ineligible"):v("grades","eligible")}));var g=location.href.indexOf("local-micro.lndo.site")>-1?"https://local-micro.lndo.site/access-ucl/www/eligibility-2024.php":location.href.indexOf("wwwapps-uat.ucl.ac.uk")>-1?"https://wwwapps-uat.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-2024.php":"https://www.ucl.ac.uk/digital-presence-services/access-ucl/www/eligibility-2024.php";e("body").on("submit","#checker-widget",(function(i){var a,o;c("postcode-test"),v("postcode-test","#postcode-criteria-msg"),i.preventDefault(),e("#ajax-spinner").is("div")||e("body").prepend('<div class="hiddenField" id="ajax-spinner">Loading<br/><img src="//cdn.ucl.ac.uk/skins/UCLIndigoSkin/default-theme/images/iris/ajax-loader.gif" alt="Loading..."></div><div id="lightbox"></div>'),e("input[name='postcode']").val()?((o=e("#lightbox")).css("height",e(window).height()+"px"),o.css("width",e(window).width()+"px"),o.css("top",e(window).scrollTop()+"px"),function(i){i.css("position","absolute"),i.css("top",Math.max(0,(e(window).height()-e(i).outerHeight())/2+e(window).scrollTop())+"px"),i.css("left",Math.max(0,(e(window).width()-e(i).outerWidth())/2+e(window).scrollLeft())+"px")}(e("#ajax-spinner")),v("postcode-test",["ajax-spinner","lightbox"]),messages={school:"Your A-Level is not an eligible school.",imd:"Your postcode isn't IMD eligible.",polar:"Your postcode isn't POLAR eligible.",acorn:"Your postcode isn't Acorn eligible."},e(".errorField").removeClass("errorField"),l.pc=(" "!=(a=e("input[name='postcode']").val()).charAt(a.length-4)&&(a=a.substring(0,a.length-3)+" "+a.substring(a.length-3)),a),l.efy="true",l.year=t,e.get(g,l,(function(i){var a=!1,t=!1;const l=["L","M","O","P","Q"];i?6==i.polar_4_quintile&&11==i.imd_decile?(e("input[name='postcode']").parent().addClass("errorField"),alert("Your home postcode does not appear in our database. Please check it and try again.")):(null===i.polar_4_quintile||""===i.polar_4_quintile||0===i.polar_4_quintile||"0"==i.polar_4_quintile||"NULL"==i.polar_4_quintile||"R"==i.polar_4_quintile?(t=!0,messages.polar="Your postcode is not available in our POLAR 4 database."):""!==i.polar_4_quintile&&"0"!=i.polar_4_quintile&&i.polar_4_quintile>0&&i.polar_4_quintile<2&&(a=!0,messages.polar="Your postcode is POLAR eligible."),null===i.imd_decile||""===i.imd_decile||0===i.imd_decile||"0"==i.imd_decile||"NULL"==i.imd_decile?(t=!0,messages.imd="Your postcode is not available in our IMD database."):""!==i.imd_decile&&"0"!=i.imd_decile&&i.imd_decile>0&&i.imd_decile<3&&(a=!0,messages.imd="Your postcode is IMD eligible."),""!==i.acorn_group&&"0"!=i.acorn_group&&null!=i.acorn_group&&l.includes(i.acorn_group)&&(a=!0,messages.acorn="Your postcode is Acorn eligible."),a&&u("postcode-test"),function(e){r.length>1?v("postcode-test","ucas"):1==r.length&&e?v("postcode-test","indeterminate"):v("postcode-test","ineligible")}(t)):(e("input[name='postcode']").parent().addClass("errorField"),alert("You have entered an invalid home postcode. Please check and try again."),v("","#ajax-spinner,#lightbox"))}),"jsonp")):e("input[name='postcode']").parent().addClass("errorField")})),e("body").on("click","#form-reset",(function(){h()}));e("#access-ucl-form").html('<form action="" method="get" id="checker-widget" autocomplete="off">    <fieldset>      <h3 class="darr">Start here &darr;</h3>      <div class="field" id="home-fees">          <p class="darr hiddenField">&darr;</p>          <div>Are you eligible for UK/home fee status?</div>          <div><label><input type="radio" name="home-fees" value="Y"> Yes</label></div>          <div><label><input type="radio" name="home-fees" value="N"> No</label></div>          <div class="discreet">If you are not sure, please check <a target="_blank" href="https://www.ucl.ac.uk/students/fees-and-funding/pay-your-fees/fee-schedules/student-fee-status#assessment">UCL\'s guidance on student fee status.</a></div>      </div>      <div class="field hiddenField" id="level4">          <p class="darr">&darr;</p>          <div>Have you completed study at or above Level 4?</div>          <div><label><input type="radio" name="level4" value="Y"> Yes</label></div>          <div><label><input type="radio" name="level4" value="N"> No</label></div>          <div class="discreet">Examples of <a target="_blank" href="https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels">Level 4 qualifications</a> include but are not limited to Higher National Certificates and Certificates of Higher Education. The first year of an undergraduate degree is equivalent to a Level 4 qualification.</div>      </div>      <div class="field hiddenField" id="forced-migrant">          <p class="darr">&darr;</p>          <div>Are you a forced migrant?</div>          <div><label><input type="radio" name="forced-migrant" value="Y"> Yes</label></div>          <div><label><input type="radio" name="forced-migrant" value="N"> No</label></div>          <div class="discreet">We use the term \'forced migrant\' to mean one of the following:<br>              <ul>                  <li>Refugee</li>                  <li>Asylum seeker</li>                  <li>Those who have been granted a temporary form of leave as the result of an asylum or human rights application (e.g. limited leave to remain, discretionary leave to remain, humanitarian protection, UASC leave)</li>              </ul>          </div>      </div>      <div class="field hiddenField" id="over21">          <p class="darr">&darr;</p>          <div>Would you be 21 or older on the day you start your first undergraduate degree?</div>          <div><label><input type="radio" name="over21" value="Y"> Yes</label></div>          <div><label><input type="radio" name="over21" value="N"> No</label></div>      </div>      <div class="field hiddenField" id="care">          <p class="darr">&darr;</p>          <div>Are you care experienced?</div>          <div><label><input type="radio" name="care" value="Y"> Yes</label></div>          <div><label><input type="radio" name="care" value="N"> No</label></div>          <div class="discreet">We define this as meaning you were looked after by or were in kinship care as a formal agreement with a local authority, for three (not necessarily consecutive) months. You would need to be under 25 on your first day at UCL.</div>      </div>      <div class="field hiddenField" id="attend">          <p class="darr">&darr;</p>          <div>Did you attend/are you attending a UK state school for your Level 3 qualifications?</div>          <div><label><input type="radio" name="attend" value="Y"> Yes</label></div>          <div><label><input type="radio" name="attend" value="N"> No</label></div>      </div>      <div class="field hiddenField" id="young-carer">          <p class="darr">&darr;</p>          <div>Are you a young carer?</div>          <div><label><input type="radio" name="young-carer" value="Y"> Yes</label></div>          <div><label><input type="radio" name="young-carer" value="N"> No</label></div>          <div class="discreet">A young adult carer is someone whose life is adversely affected by providing ongoing care for a parent or guardian (that they live with) who has a chronic illness. You must be under 21 on your first day at UCL.</div>      </div>      <div class="field hiddenField" id="estranged">          <p class="darr">&darr;</p>          <div>Are you estranged from your family?</div>          <div><label><input type="radio" name="estranged" value="Y"> Yes</label></div>          <div><label><input type="radio" name="estranged" value="N"> No</label></div>          <div class="discreet">UCL\'s definition of estrangement is not communicating with or receiving support from any and all family members. This will apply if an applicant is permanently estranged from their family and has been for at least a year.</div>      </div>      <div class="field hiddenField" id="educational-gap">          <p class="darr">&darr;</p>          <div>Have you had an educational gap of at least a year?</div>          <div><label><input type="radio" name="educational-gap" value="Y"> Yes</label></div>          <div><label><input type="radio" name="educational-gap" value="N"> No</label></div>          <div class="discreet">An example of an educational gap is leaving school at 16 but returning to complete a Level 3 qualification after several years in work. Please note that deferred or \'gap\' years between school and university are not considered under this criterion.</div>      </div>      <div class="field hiddenField" id="free-meals">          <p class="darr">&darr;</p>          <div>Are you eligible for free school meals?</div>          <div><label><input type="radio" name="free-meals" value="Y"> Yes</label></div>          <div><label><input type="radio" name="free-meals" value="N"> No</label></div>          <div class="discreet">Applicants who were known to be eligible for free school meals (FSMs) at the end of Key Stage 4 (Year 11) and/or six years prior to this point (England); were known to be eligible for FSMs in the 6 years prior to Year 12 (Northern Ireland); or were known to have been eligible for FSMs between the start of Year 11 and the January five years prior to this (Wales).</div>      </div>      <div id="postcode-test" class="hiddenField">          <p class="darr">&darr;</p>          <div class="field">              <label>Please enter your current home postcode<br><strong>All postcodes must include the space between the two halves.</strong></label>              <input type="text" class="postcodefield" name="postcode" value="" />          </div>          <div class="field submitter" id="submitter">              <input type="submit" class="access-button btn-cta" value="Check my eligibility &rsaquo;" />          </div>          <div class="discreet">              <p><br/>This checks for applicants who live in an area that has a high level of financial, social or economic deprivation, or low progression to higher education.<br/>              We use the <a target="_blank" href="https://www.gov.uk/government/statistics/english-indices-of-deprivation-2019">Index of Multiple of Deprivation</a> and <a target="_blank" href="https://acorn.caci.co.uk/">Acorn data</a> to identify levels of financial, social or economic deprivation. We use POLAR classification to look at how likely young people are to participate in HE across the UK.</p>          </div>      </div>      <div class="field hiddenField" id="ucas">          <p class="darr">&darr;</p>          <div>Do you have or are predicted to have a minimum of 100 UCAS points?</div>          <div><label><input type="radio" name="ucas" value="Y"> Yes</label></div>          <div><label><input type="radio" name="ucas" value="N"> No</label></div>          <div class="discreet">Please see the Engineering Foundation Year\'s <a target="_blank" href="https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/engineering-foundation-year#entry-requirements">academic entry requirements</a> for details of which Level 3 qualifications we accept (examples include A-Levels and IB Diplomas). If you are not sure how many UCAS points your qualifications are worth, you can use <a target="_blank" href="https://www.ucas.com/ucas/tariff-calculator">UCAS\' Tariff Calculator</a>.</div>      </div>      <div class="field hiddenField" id="grades">          <p class="darr">&darr;</p>          <div>Did you achieve a minimum of Grades 4 or C in Mathematics and English Language GCSE?</div>          <div><label><input type="radio" name="grades" value="Y"> Yes</label></div>          <div><label><input type="radio" name="grades" value="N"> No</label></div>      </div>      <div class="hiddenField" id="indeterminate">          <p class="darr">&darr;</p>          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">              <div class="alert__icon">                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>              </div>              <div class="alert__content">                  <h4>Sorry, we cannot determine whether you are eligible for the EFY</h4>                  <div id="postcode-checked-indeterminate" class="hiddenField">                      <p>Your postcode is not available in our database, please contact <a href="mailto:EFY@ucl.ac.uk">EFY@ucl.ac.uk</a> to check your eligibility.</p>                  </div>              </div>          </div>      </div>      <div class="hiddenField" id="ineligible">          <p class="darr">&darr;</p>          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-warn clearfix">              <div class="alert__icon">                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>              </div>              <div class="alert__content">                  <h4>Sorry, you are not eligible for the EFY</h4>                  <p>Based on the information you\'ve provided, you are not eligible to apply to join the Engineering Foundation Year course.</p>              </div>          </div>      </div>      <div class="hiddenField" id="eligible">          <p class="darr">&darr;</p>          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-success clearfix">              <div class="alert__icon">                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>              </div>              <div class="alert__content">                  <h4>Great news! You are eligible for the EFY</h4>                  <p>Based on the information you\'ve provided, you are eligible to apply to join the Engineering Foundation Year course.</p>              </div>          </div>      </div>      <div class="hiddenField" id="case-by-case">          <p class="darr">&darr;</p>          <div class="entity entity-paragraphs-item paragraphs-item-alert-box alert alert-info clearfix">              <div class="alert__icon">                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0d68cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>              </div>              <div class="alert__content">                  <h4>You may be eligible for the EFY</h4>                  <p id="maybe-text"></p>              </div>          </div>      </div>    </fieldset>    <div class="field hiddenField" id="resetter">        <p class="darr">&nbsp;</p>        <input type="reset" class="access-button btn-cta" id="form-reset" value="Start again &olarr;" />    </div></form>'),h()}))}}}(jQuery,Drupal);