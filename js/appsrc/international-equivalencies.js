$(document).ready(function () {
	/***********************************************************
	* International/UK equivalencies select event handling:
	* This script handles the static UK equivalencies selection
	* As well as the AJAX call to a microservice page which 
	* returns JSON containing the equivalency data direct from 
	* the admissions data in the Report Lab MySQL DB.
	************************************************************/
	
	$(".country-select").on("change", function () {
		var country = $(this).val();
		var courseType = $(this).attr("data-courseType");
		var minLevel = $(this).attr("data-level");
		var year = $(this).attr("data-year");
		var fetchUrlRoot = (location.href.indexOf("micro.ucl.ac.uk") > -1?"":"/digital-presence-services");
		var fetchUrl = fetchUrlRoot + "/prospectus/0.4/json/international-equivalencies.php";
		var params = "countryISO=" + country + "&year=" + year + "&courseType=" + courseType;
		if (country == 'default') {
			$('.equiv-content').html('');
			$('.country-select__content').addClass('is-hidden');
		} else {
			$.ajax({
				url: fetchUrl,
				data: params,
		        dataType: 'JSON',
				error: function(e, error) {
					console.log(error);
				},
				success: function(json) {
					function buildHTML(json, minLevel) {
						// min_entry_ref = 2:1/2:2 in main JSON degree feed needs to be translated for the International Admissions data.
						var levels = {
							"2:1":"secondHigher",
							"2:2":"secondLower"
						}
						var html = "<h4>Equivalent qualifications for " + json["country"] + "</h4>";
						if (json[levels[minLevel]]) {
							html += "<div>" + json[levels[minLevel]] + "</div>";
							if (typeof json["otherQuals"] != "undefined" && json["otherQuals"]) {
								html += "<h5>Alternative qualifications</h5><p>" + json['otherQuals'] + "</p>";
							}
						} else {
							html += "<p>" + json["default_international_admissions"] + "</p>";
						}
						return html
					}
					$(".equiv-content").html(buildHTML(json, minLevel));
					$('.country-select__content').removeClass('is-hidden');
				}
			});
		}
	});
	// UK equivalencies select event handling.
	// This may no longer be required??
	$(".dropdown_uk_qualifications").on("change", function(){
		$(".alt-qualifications__hidden").css("display","None");
		if ($(this).val())
			$("#info-" + $(this).val()).fadeIn();
	});
});
