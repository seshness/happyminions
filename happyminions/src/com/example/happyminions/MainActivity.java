package com.example.happyminions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class MainActivity extends Activity implements OnClickListener {

	public final static String EXTRA_MESSAGE = "com.example.happyminions.MESSAGE";
	public final static String TAG = "HappyMinionsLogger";
	SpeechRecognizer sr;

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

	class MakePostRequestTask extends AsyncTask<String, Void, HttpEntity> {

		private Exception exception;
		private HttpEntity entity = null;

		protected HttpEntity doInBackground(String... text) {
			try {

			  String textToPost = text[0];
			  String start_time = text[1];
			  String endTime = new Long(new Date().getTime()).toString();
			  System.out.println("startTime  = " + start_time);
			  System.out.println("endTime = " + endTime);
				HttpClient httpclient = new DefaultHttpClient();
				HttpPost httppost = new HttpPost("http://43te.localtunnel.com/text");
				
				try {
					// Add your data
					List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
					nameValuePairs.add(new BasicNameValuePair("text", textToPost));
					nameValuePairs.add(new BasicNameValuePair("end_time", endTime));
					nameValuePairs.add(new BasicNameValuePair("start_time", start_time));
					httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
					System.out.println("Sets entity fine");

					// Execute HTTP Post Request
					HttpResponse response = httpclient.execute(httppost);

					entity = response.getEntity();
					System.out.println("Result got " + EntityUtils.toString(entity));
				} catch (ClientProtocolException e) {
					// TODO Auto-generated catch block
				} catch (IOException e) {
					// TODO Auto-generated catch block
				} catch (Exception e) {
					System.out.println("Exception =  " + e);
				}
			} catch (Exception e) {
				System.out.println("Exception = " + e);
			}

			return entity;
		}

		protected void onPostExecute() {
		}
	}

	boolean send_clicked = false;
	boolean alive = false;
	/* Called when the user clicks the Send button */
	@SuppressLint({ "NewApi", "ResourceAsColor" })
	public void sendMessage(View view) {
	  System.out.println("Reached send message");

		// Executes post request
		// new MakePostRequestTask().execute();
		
		// Do something in response to button   
		if (SpeechRecognizer.isRecognitionAvailable(getApplicationContext())) {
			Log.i("LOGGER", "Yes info avaialble");
			sr = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
			sr.setRecognitionListener(new listener());
			Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
      intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM); 
      intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, Long.valueOf(60000000));
      intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, Long.valueOf(60000000));
      intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, Long.valueOf(60000000));
			sr.startListening(intent);
			boolean first_time = true;
			/*while(true){
			  try {
			    if (first_time) {
			      Thread.sleep(25000);
			      first_time = false;
			    }
			    else {
			       Thread.sleep(5000);
			    }
			    System.out.println("5 seconds have passed");
          if (!alive) {
            System.out.println("Alive status = " + alive);
            sr.setRecognitionListener(new listener());
            sr.startListening(intent);
          }
        } catch (InterruptedException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
          
        }
			  
			}*/
			
		}
		
	}

	public void stopRecording(View v) {
		sr.stopListening();
		System.out.println("Stopped listening");
	}

	class listener implements RecognitionListener {
	  String start_time = "";
		public void onReadyForSpeech(Bundle params) {
			Log.d(TAG, "onReadyForSpeech");
		}

		public void onBeginningOfSpeech() {
			Log.d(TAG, "onBeginningOfSpeech");
			//alive = true;
			Log.d(TAG, "onBeginningOfSpeech alive status = " + alive);
			start_time = new Long(new Date().getTime()).toString();
		}

		public void onBufferReceived(byte[] buffer) {
			Log.d(TAG, "onBufferReceived");
		}

		public void onEndOfSpeech() {
			Log.d(TAG, "onEndofSpeech");
			alive = false;
			Log.d(TAG, "onEndOfSpeech alive status = " + alive);
	    
		}

		public void onError(int error) {
			Log.d(TAG, "error " + error);
		}

		public void onResults(Bundle results) {
		  Log.d(TAG, "onResults");
			String str = new String();
			System.out.println("onResults =  " + results);
			ArrayList<String> data = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
			float[] score = results.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
			float max = -1;
			for (int i = 0; i < data.size(); i++) {
				if (score[i] > max) {
					str = data.get(i);
					max = score[i];
				}

			}
			Log.d(TAG, "result " + str);
      new MakePostRequestTask().execute(str, start_time);
			max = -1;
		}

		public void onPartialResults(Bundle partialResults) {
			Log.d(TAG, "onPartialResults");
		}

		public void onEvent(int eventType, Bundle params) {
			Log.d(TAG, "onEvent " + eventType);
		}

		@Override
		public void onRmsChanged(float arg0) {
			// TODO Auto-generated method stub

		}
	}

	@Override
	public void onClick(View arg0) {
		// TODO Auto-generated method stub
	}

}
