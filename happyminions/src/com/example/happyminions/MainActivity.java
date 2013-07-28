package com.example.happyminions;

import java.util.ArrayList;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;

public class MainActivity extends Activity implements OnClickListener {

	public final static String EXTRA_MESSAGE = "com.example.happyminions.MESSAGE";
	public final static String TAG = "HappyMinionsLogger";
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    /** Called when the user clicks the Send button */
    public void sendMessage(View view) {
        // Do something in response to button
    	/*Intent intent = new Intent(this, DisplayMessageActivity.class);
    	EditText editText = (EditText) findViewById(R.id.edit_message);
    	String message = editText.getText().toString();
    	intent.putExtra(EXTRA_MESSAGE, message);
    	startActivity(intent);
    	*/
    	if (SpeechRecognizer.isRecognitionAvailable(getApplicationContext())){
    		Log.i("LOGGER", "Yes info avaialble");
    		SpeechRecognizer sr = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
    		sr.setRecognitionListener(new listener()); 
    		Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);       
    		sr.startListening(intent);
    	}
    }
    
    class listener implements RecognitionListener          
    {
             public void onReadyForSpeech(Bundle params)
             {
                      Log.d(TAG, "onReadyForSpeech");
             }
             public void onBeginningOfSpeech()
             {
                      Log.d(TAG, "onBeginningOfSpeech");
             }
             public void onRmsChanged(float rmsdB)
             {
                      Log.d(TAG, "onRmsChanged");
             }
             public void onBufferReceived(byte[] buffer)
             {
                      Log.d(TAG, "onBufferReceived");
             }
             public void onEndOfSpeech()
             {
                      Log.d(TAG, "onEndofSpeech");
             }
             public void onError(int error)
             {
                      Log.d(TAG,  "error " +  error);
             }
             public void onResults(Bundle results)                   
             {
                      String str = new String();
                      Log.d(TAG, "onResults " + results);
                      ArrayList data = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                      for (int i = 0; i < data.size(); i++)
                      {
                                //Log.d(TAG, "result " + data.get(i));
                                str += data.get(i);
                                Log.d(TAG, "result " + str); 
                      }             }
             public void onPartialResults(Bundle partialResults)
             {
                      Log.d(TAG, "onPartialResults");
             }
             public void onEvent(int eventType, Bundle params)
             {
                      Log.d(TAG, "onEvent " + eventType);
             }
    }

	@Override
	public void onClick(View arg0) {
		// TODO Auto-generated method stub
		
		if (SpeechRecognizer.isRecognitionAvailable(getApplicationContext())){
    		Log.i("LOGGER", "Yes info avaialble");
    		SpeechRecognizer sr = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
    		sr.setRecognitionListener(new listener()); 
    		Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);       
    		sr.startListening(intent);
    	}
		
	}
    
}
