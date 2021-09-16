  // This does the iframe resizing when the page expands to include new content instead of/as well as iframe-resize.
  $(document).ready(function() {
 
    // Set up variables.
    var isTop = self == top;
    var mywin = (isTop?window:window.parent);
    var iframeTop = (isTop?0:$("#ifrm",parent.document).offset().top);
    var isEventsWidget = $("#event-query").is("input");
    var fadeIn = false;

    // Utility functions to render the event, faculty and department selector HTML.
    function printFacultiesSelector() {
      var selector = '';
      for (var i = 0; i < faculties.length; i++) {
        var option = "";
        INNER:
        for (var j = 0; j < events.length; j++) {
          if (events[j]["dept_codes"].indexOf("_" + faculties[i]["facultyID"]) > -1 || events[j]["fac_codes"].indexOf(faculties[i]["facultyID"]) > -1) {
            option = '<option value="' + faculties[i]["facultyID"] + '">' + faculties[i]["facultyName"] + '</option>';
            break INNER;
          }
        }
        selector += (option?option:'<option value="' + faculties[i]["facultyID"] + '" disabled>' + faculties[i]["facultyName"] + '</option>');
      }
      if (selector) {
        return '<select class="dropdown__inner" name="faculties" id="faculties"><option value="">Filter by faculty</option>' + selector + '</select>';
      }
      return '';
    }
  
    function printDepartmentsSelector() {
      var selector = '';
      for (var i = 0; i < departments.length; i++) {
        if (departments[i]["deptCode"]) {
          var option = "";
          INNER:
          for (var j = 0; j < events.length; j++) {
            if (events[j]["dept_codes"].indexOf(departments[i]["deptCode"]) > -1) {
              option = '<option value="' + departments[i]["deptCode"] + '">' + departments[i]["deptName"] + '</option>';
              break INNER;
            }
          }
          selector += (option?option:'<option value="' + departments[i]["deptCode"] + '" disabled>' + departments[i]["deptName"] + '</option>');
        }
      }
      if (selector) {
        return '<select class="dropdown__inner" name="departments" id="departments"><option value="">Filter by department</option>' + selector + '</select>';
      }
      return '';
    }
    
    function printEventCounter(events) {
      var showVideos = $("#show-videos").val() == 'on-demand';
      var live = 0;
      var onDemand = 0;
      for (var i = 0; i < events.length; i++) {
          if (isFutureEvent(events[i])) {
              live++;
          } else if (eventHasVideo(events[i])) {
              onDemand++;
          }
      }
      var liveS = (live != 1?"s":"");
      var onDemandS = (onDemand != 1?"s":"");
      if (showVideos) {
          return 'Showing ' + onDemand + ' ' + 'on-demand event' + onDemandS + '; ' + live + ' live event' + liveS + ' also available.';
      } else {
          return 'Showing ' + live + ' ' + 'live event' + liveS + '; ' + onDemand + ' on-demand event' + onDemandS + ' also available.';
      }
    }
  
    function printEvent(event, n) {
      if (isEventsWidget) {
      	return (isFutureEvent(event)?printFutureEvent(event, n):printVideoEvent(event, n));
      } else {
      	return (isFutureEvent(event)?printSidebarFutureEvent(event, n):printSidebarVideoEvent(event, n));
      }
    }
    
    function printVideoEvent(event, n) {
      var html = '' +
      '<tr class="row' + (n > 9?' hidden-row':'') + '">' +
        '<td>' +
          '<p>' +
            '<span class="fa fa-youtube-play event-icon">&nbsp;</span>' +
            '<a target="_top" href="' +
               event['video_url'] + 
               '" class="clicktracker singleeventclick">Watch on demand event' +
            '</a>' +
          '</p>' +
        '</td>' +
        '<td>' +
          '<h4 class="heading">';
            if (event['video_url']) {
              html += '<a target="_top" href="' + event['video_url'] + '" class="clicktracker singleeventclick">' + event['name'] + '</a>';
            } else {
              html += '<span>' + event['name'] + '</span>';
            }
          html += '</h4>' +
          '<div>' +
            event['description'] +
          '</div>' +
        '</td>' +
      '</tr>';
      return html;
    }
    
    function printSidebarVideoEvent(event, n) {
      var titlehtml = (event['video_url']?'<a target="_top" href="' + event['video_url'] + '" class="clicktracker singleeventclick">' + event['name'] + '</a>':'<span>' + event['name'] + '</span>');
      var html = '' +
      '<tr class="row">' +
        '<td>' +
          '<h4 class="heading">' +
            titlehtml +
          '</h4>' +
          '<p>' +
            '<span class="fa fa-youtube-play event-icon">&nbsp;</span>' +
            '<a target="_top" href="' +
               event['video_url'] + 
               '" class="clicktracker singleeventclick">Watch on demand event' +
            '</a>' +
          '</p>' +
          '<div>' +
            event['description'] +
          '</div>' +
        '</td>' +
      '</tr>';
      return html;
    }
    
    function printFutureEvent(event, n) {
      function formatTime(time) {
        if (time.length > 5) {
          return time.substring(0,time.lastIndexOf(":"));
        }
        return time;
      }
      var timehtml = "";
      if (event['time_start']) {
        timehtml = "<br />" + formatTime(event["time_start"]);
        if (event["time_end"]) {
          timehtml += " - " + formatTime(event["time_end"]);
        }
      }
      var html = '' +
      '<tr class="row' + (n > 9?' hidden-row':'') + '">' +
        '<td>' +
          '<p>' +
            '<span class="fa fa-calendar event-icon">&nbsp;</span>' +
            '<span class="mobile-hide hidden-sm">' +
              '<strong>' + event['final_date'] + '</strong>' +
            '</span>' +
            '<span class="mobile-display visible-sm">' +
              '<strong>' + event['mobiledate'] + '</strong>' +
            '</span>' + timehtml +
          '</p>' +
          '<span>' + event['location'] + '</span>' +
        '</td>' +
        '<td>' +
          '<h4 class="heading">';
            if (event['link']) {
              html += '<a target="_top" href="' + event['link'] + '" class="clicktracker singleeventclick">' + event['name'] + '</a>';
            } else {
              html += '<span>' + event['name'] + '</span>';
            }
          html += '</h4>' +
          '<div>' +
            event['description'] +
          '</div>' +
        '</td>' +
      '</tr>';
      return html;
    }

    function printSidebarFutureEvent(event, n) {
      function formatTime(time) {
        if (time.length > 5) {
          return time.substring(0,time.lastIndexOf(":"));
        }
        return time;
      }
      var timehtml = "";
      if (event['time_start']) {
        timehtml = "<br />" + formatTime(event["time_start"]);
        if (event["time_end"]) {
          timehtml += " - " + formatTime(event["time_end"]);
        }
      }
      var titlehtml = (event['link']?'<a target="_top" href="' + event['link'] + '" class="clicktracker singleeventclick">' + event['name'] + '</a>':'<span>' + event['name'] + '</span>');
      var html = '' +
      '<tr>' +
        '<td>' +
          '<h4 class="heading">' +
            titlehtml +
          '</h4>' +
          '<div><strong>Date:</strong> ' +
            '<span class="fa fa-calendar event-icon">&nbsp;</span>' +
            '<span class="">' +
              event['final_date'] + 
            '</span>' + timehtml +
            '<br />' +
            '<strong>Location:</strong> ' + event['location'] + 
          '</div>' +
          '<div>' +
            event['description'] +
          '</div>' +
        '</td>' +
      '</tr>';
      return html;
    }

    function isFutureEvent(event) {
        var now = new Date();
        var start = new Date(event["date_start"]);
        var end = (event['date_end'] != "0000-00-00"?new Date(event["date_end"]):0);
        return (start >= now || end >= now);
    }

    function eventHasVideo(event) {
        return (event["video_url"]?true:false);
    }

    function testEvent(event) {
        var showVideos = $("#show-videos").val() == 'on-demand';
        var isFuture = isFutureEvent(event);
        return ((showVideos && !isFuture && eventHasVideo(event)) || (!showVideos && isFuture));
    }

    function printEventsHTML(eventslist) {
      var html = "";
      var live_n = 0;
      var video_n = 0;
      var n = 0;
      if (eventslist.length) {
        for (var i = 0; i < eventslist.length; i++) {
          if (testEvent(eventslist[i])) {
            if (isFutureEvent(eventslist[i])) {
              live_n++;
              n = live_n;
            } else if (eventHasVideo(eventslist[i])) {
              video_n++;
              n = video_n;
            }
            html += printEvent(eventslist[i], n);
          }
        }
      }
      return html;
    }
  
    // Utility functions to assist the event searches.
    function getDepartmentNames(codes) {
      var ls = codes.split(",");
      var deptString = "";
      for (var i = 0; i < departments.length; i++) {
        for (var j = 0; j < ls.length; j++) {
          if (departments[i]["deptCode"] == ls[j]) {
            deptString += departments[i]["deptName"] + ",";
            break;
          }
        }
      }
      return deptString;
    }
  
    function getFacultyNames(event) {
      for (var i = 0; i < departments.length; i++) {
        if (event["dept_codes"].indexOf(departments[i]["deptCode"]) > -1) {
          for (var j = 0; j < faculties.length; j++) {
            if (faculties[j].facultyID == departments[i]["facultyID_dept"]) {
              return faculties[j].facultyName
            }
          }
        }
      }
      return "";
    }
  
    function eventFreeTextSearch(event, txt) {
      // Need to add faculty names and related degrees searches to the below
      if (event["name"].toLowerCase().indexOf(txt) > -1 || getFacultyNames(event).toLowerCase().indexOf(txt) > -1 || getDepartmentNames(event["dept_codes"]).toLowerCase().indexOf(txt) > -1 || event["progTitles"].toLowerCase().indexOf(txt) > -1) {
        return true;
      }
      return false;
    }
  
    function filterByFaculty(event, facultyID) {
      if (!facultyID) {
        return true;
      } else if (event["fac_codes"].indexOf(facultyID) > -1) {
        return true;
      } else {
        for (var i = 0; i < departments.length; i++) {
          if (departments[i]["facultyID_dept"] == facultyID && event["dept_codes"].indexOf(departments[i]["deptCode"]) > -1) {
            return true;
          }
        }
      }
      return false;
    }
  
    function filterByDepartment(event, departmentID) {
      if (!departmentID) {
        return true;
      } else if (event["dept_codes"].indexOf(departmentID) > -1) {
        return true;
      }
      return false;
    }
  
    function searchFields(txt, facultyID, departmentID) {
      var newevents = [];
      for (var i = 0; i < events.length; i++) {
//        if (testEvent(events[i]) && eventFreeTextSearch(events[i], txt) && filterByFaculty(events[i], facultyID) && filterByDepartment(events[i], departmentID)) {
        if (eventFreeTextSearch(events[i], txt) && filterByFaculty(events[i], facultyID) && filterByDepartment(events[i], departmentID)) {
          newevents.push(events[i]);
        }
      }
      return newevents;
    }
    
    function setUpTripleSearch() {
      if (isEventsWidget) {
        var txt = $("#event-query").val().toLowerCase();
        if (txt.length < 3) {
          txt = "";
        }
	    filteredEvents = searchFields(txt, $("#faculties").val(), $("#departments").val());
	  } else {
	    filteredEvents = searchFields("", "", "");
	  }
      if (filteredEvents) {
          var newHTML = printEventsHTML(filteredEvents);
          if (newHTML) {
            $("#event-data").html(newHTML);
            $(".eventslist").css("display","table");
        } else {
            $("#event-data").html("<tr><td colspan='2'>&nbsp;</td></tr>");
            $(".eventslist").css("display","none");
        }
        $("#event-count").html(printEventCounter(filteredEvents));
        resizeParentIframe();
        if (filteredEvents.length > 10) {
          $(mywin).on("scroll", debounce(debouncedScroll, 100));
        }
      }
    }

    function resizeParentIframe() {
      if (parent.document.getElementById("ifrm")) {
        newHeight = document.getElementById("event-results").scrollHeight;
        newHeight = parseInt(newHeight) + 40;
        parent.document.getElementById("ifrm").style.height = newHeight + "px";
      }
    }

    // Scrolling functions to render hidden events
    // function to debounce any function
    function debounce(func, wait) {
      var timerID1;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timerID1);
        timerID1 = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    }
    // function to run when scrolling which is debounced by function above
    function debouncedScroll() {
      var rows = $("tr.hidden-row");
      if (rows.length) {
        if (!fadeIn) {
          checkPositionAndShow();
        }
      } else {
        // There are no more rows to display, so unbind the handler
        $(mywin).off("scroll");
      }
    }
    // function to load in a single hidden event
    function checkPositionAndShow() {
      var last = $("tr.row").not(".hidden-row").last();
      if ($(last).is("tr")) {
        var screenBottom = $(mywin).scrollTop() + $(mywin).height();
        // Add iframetop to give item's apparent position on the containing page.
        if (!iframeTop && iframeTop !== 0) {
          iframeTop = (isTop?0:$("#ifrm",parent.document).offset().top);
        }
        var rowtop = $(last).offset().top + iframeTop;
        if (screenBottom > rowtop) {
          var next = $(last).next("tr.hidden-row");
          if ($(next).is("tr")) {
            fadeIn = true;
            $(next).fadeIn(400, function() {
              $(this).removeClass("hidden-row");
              fadeIn = false;
              debouncedScroll();
            });
            resizeParentIframe();
          }
        }
      }
    }

    // Event handlers for the event searches and other events.
    // Keypress partial keyword search runs the dual field search.
    $("#event-query").on("keyup", function() {
      $("#departments").val('');
      $("#faculties").val('');
      setUpTripleSearch();
    });

    // Selecting a faculty runs the dual field search.
    $("#event-filter").on("change", "#faculties", function() {
      // Deselect any departments to prevent confusing results
      $("#event-query").val('');
      $("#departments").val('');
      setUpTripleSearch();
    });
    
    // Selecting a department runs the triple field search.
    $("#event-filter").on("change", "#departments", function() {
      // Deselect any faculties to prevent confusing results
      $("#event-query").val('');
      $("#faculties").val('');
      setUpTripleSearch();
    });
    
    // Toggle switch and run search when event type selector is clicked
    $("#event-type").on("click", function() {
        $(".event-option").toggleClass("active").toggleClass("inactive");
        $("#show-videos").val(($("#show-videos").val() == 'live'?'on-demand':'live'));
        setUpTripleSearch();
    });
    
    // Reset the form and search results
    $("#reset").on("click", function(e) {
      e.preventDefault();
      $("#event-filter-form").trigger("reset");
      	if (!$("#live").hasClass("active")) {
        $(".event-option").toggleClass("active").toggleClass("inactive");
        $("#show-videos").val("live");
      }
      setUpTripleSearch();
    });
    
    // Prevent the search form from submitting.
    $("#event-filter-form").on("submit", function(e) {
      e.preventDefault();
    });

    // Set up the debounced scrolling event handler.
    $(mywin).on("scroll", debounce(debouncedScroll, 100));
    
    // Set up the debounced resizing event handler.
    $(window).on("resize", debounce(resizeParentIframe, 100));
    
    // Run an initial search to print default view of live events listing
    setUpTripleSearch();

    // Print the department and faculty selectors
    $("#event-filter").html(printFacultiesSelector() + printDepartmentsSelector());
    
    // Check the live/on-demand switch is correctly set after reload
    if (($("#live").hasClass("active") && $("#show-videos").val() != "live") || ($("#video").hasClass("active") && $("#show-videos").val() != "on-demand")) {
      $(".event-option").toggleClass("active").toggleClass("inactive");
    }

   // Size the iframe on document ready.
    resizeParentIframe();

  });  
