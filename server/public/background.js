var recognizeSpeech = function () {
    if (!('webkitSpeechRecognition' in window)) {
        console.log("webkit speecch recogition not there?");
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        console.log("so recognition object created");
        recognition.interimResults = false;
	var final_transcript = "";
        recognition.onerror = function(err) {
            console.log(err);
        };
        recognition.onstart = function() {
            console.log("recognition started")
        };
	recognition.onend = function(err) {
	    console.log("Service ended");
	    // recognition.start();
	}
        recognition.onresult = function (event) {
            console.log("recognition called");
	    var transcript = '';

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                } else {
                    transcript += event.results[i][0].transcript;
                }
            }
	    if (transcript !== ""){
	        var data = {
		    "text": transcript,
		    "end_time": Date.now()
		}
	    }
	    if (data) {
		$.ajax({
			type: "POST",
			url: "/text",
			data: data,
			success: function (resp) {
			    console.log ("YAY sent");
			    console.log(resp);
			},
		    });
	    }

        };
        return recognition;
    }
    return null;
};


if (document.createElement("input").webkitSpeech === undefined) {
    console.log("Speech input is not supported in your browser.");
}

document.addEventListener("DOMContentLoaded", function (event) {
	var rec = recognizeSpeech();
	console.log('trying to start...');
	rec.start();
    });
