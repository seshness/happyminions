var recognizeSpeech = function () {
    if (!('webkitSpeechRecognition' in window)) {
        console.log("webkit speecch recogition not there?");
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        console.log("so recognition object created");
        recognition.interimResults = true;
	var final_transcript = "";
        recognition.onerror = function(err) {
            console.log(err);
        };
        recognition.onstart = function() {
            console.log("recognition started")
        };
	recognition.onend = function() {
	    console.log("Service ended");
	    recognition.start();
	}
        recognition.onresult = function (event) {
            console.log("recognition called");
            var interim_transcript = '';

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            //console.log(final_transcript);
            console.log(interim_transcript);
	    $.ajax({
		    type: "POST",
			url: "/text",
			data: interim_transcript,
			success: function (resp) {
			  console.log ("YAY sent");
			  console.log(resp);
		          },
			});

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
	rec.start();
    });
    
