import sys
import json
import requests

url = "http://access.alchemyapi.com/calls/text/TextGetTextSentiment"
apikey = "1818e38ad414e1e96dcf99da248fc6f46c532f2f"

def makeRequest(text):
  values = {
    "apikey" : apikey,
    "text"   : text,
    "outputMode" : "json"
  }
  r = requests.post(url, data=values)
  json_text = json.loads(r.text)
  docSentiment = json_text['docSentiment']
  return docSentiment

sentiment = makeRequest(sys.argv[1])
sentiment_type = sentiment['type']

if sentiment_type == "neutral":
  sentiment_result = {
    "sentiment_type" : sentiment_type,
    "sentiment_score" : 0.0
    }
else:
  sentiment_result = {
    "sentiment_type" : sentiment_type,
    "sentiment_score" : sentiment['score']
    }
print(json.dumps(sentiment_result))
