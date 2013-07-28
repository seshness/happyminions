var recognizeSpeech = function () {
  if (!('webkitSpeechRecognition' in window)) {
    console.log("webkit speecch recogition not there?");
    return null;
  }

  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  console.log("so recognition object created");
  recognition.interimResults = true;

  recognition.onerror = function(err) {
    $('.microphone')
      .removeClass('disabled')
      .addClass('inactive');
    console.log(err);
  };
  recognition.onstart = function() {
    $('.microphone')
      .removeClass('inactive')
      .removeClass('disabled');
    console.log("recognition started");
  };
  recognition.onend = function(err) {
    $('.microphone')
      .removeClass('disabled')
      .addClass('inactive');

    console.log("Service ended");
    window.setTimeout(function() {
      recognition.start();
    }, 1000);
  };
  var displayText = function(transcript) {
    $('.spoken-text').text(transcript);
    $('.spoken-text-container')
      .removeClass('fadeOutLeft')
      .removeClass('invisible')
      .addClass('fadeInLeft');
    window.setTimeout(function() {
      $('.spoken-text-container')
        .addClass('animated fadeOutLeft');
    }, 5000);
  };
  var start_time_filled = false;
  recognition.onresult = function(event) {
    $('.microphone')
      .removeClass('disabled')
      .removeClass('inactive')
      .addClass('animated tada');
    window.setTimeout(function() {
      $('.microphone').removeClass('animated tada');
    }, 750);
    // console.log("recognition called");
    var transcript = '';
    var end_time;
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
	end_time = Date.now();
	start_time_filled = false;
	console.log("Transcript is " + transcript);
	console.log ("Ends at " + end_time);
	displayText(transcript);
      } else {
	  if (!start_time_filled) {
	      var start_time = Date.now();
	      start_time_filled = true;
	      console.log("Starts at " + start_time);
	  }
	  transcript += event.results[i][0].transcript;
	  displayText(transcript);
	  return;
      }
    }

    var data;
    if (transcript !== "") {
      data = {
        "text": transcript,
	"start_time": start_time,
        "end_time": end_time
      };
    }
    if (data) {
      $.ajax({
        type: "POST",
        url: "/text",
        data: data,
        success: function (resp) {
          console.log(transcript);
        }
      });
    }
  };
  window.displayText = displayText;
  return recognition;
};

$(function() {
  if (document.createElement("input").webkitSpeech === undefined) {
    console.log("Speech input is not supported in your browser.");
    $('.microphone').removeClass('inactive').addClass('disabled');
    return;
  }

  var rec = recognizeSpeech();
  console.log('trying to start...');
  rec.start();
});

$(function() {
  $('.fetchHappyMoments').click(function() {
    var success = function(happyMoments) {
      window.happyMoments = happyMoments;
      var tbody = d3.select('.happyMoments')
        .classed('invisible', false)
        .select('tbody');

      var row = tbody.selectAll('tr')
        .data(happyMoments.texts.sort(function(a, b) {
          return (new Date(b.end_time)).getTime() -
            (new Date(a.end_time)).getTime();
        }))
        .enter()
        .append('tr');

      row
        .selectAll('td')
        .data(function(row) {
          return ['end_time', 'text'].map(function(i) {
            return i === 'end_time' ? moment(row[i]).fromNow() : row[i];
          });
        })
        .enter()
        .append('td')
        .text(function(d) {
          return d;
        });

      row.exit().remove();

    };
    $.ajax({
      type: "GET",
      url: "happytexts",
      success: success
    });
  });
});
