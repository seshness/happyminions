var recognizeSpeech = function () {
    if (!('webkitSpeechRecognition' in window)) {
        console.log("webkit speecch recogition not there?");
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        console.log("so recognition object created");
        recognition.interimResults = true;
        recognition.onerror = function(err) {
            console.log(err);
        };
        recognition.onstart = function() {
            console.log("recognition started")
        };
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
            final_transcript = capitalize(final_transcript);
            console.log(final_transcript);
            console.log(interim_transcript);
        };
        return recognition;
    }
    return null;
};

chrome.app.runtime.onLaunched.addListener(function() {
    // chrome.app.window.create('window.html', {
    //  'bounds': {
    //      'width': 400,
    //      'height': 500
    //  }
    // });
    console.log("Dom content loaded");
    var rec = recognizeSpeech();
    rec.start();
});
