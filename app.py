import operator
import requests
import json
import urllib
from flask import request,Response,send_from_directory
from flask_cors import CORS, cross_origin
try:
    import urllib.request as urllib2
except ImportError:
    import urllib2


from flask import Flask, jsonify

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

def get_url_by_field(x,y):
    url = ""
    for poi in x:
        url +=   y + ": " + poi + " or "
    n = urllib.parse.quote(url)
    return n[:len(n) - 8]

def make_summary(query,pois,langs,countries,sentiment,start):
    hashtags = {}
    mentions = {}
    lines = query
    url1 = 'http://3.135.204.148:8983/solr/'
    url2 = '/select?&defType=edismax&facet.field=tweet_lang&facet.field=country&facet.field=sentiment&facet=true&'
    if len(pois) > 0:
        url2 += "fq=" + get_url_by_field(pois, "poi_name") + "&"
    if len(langs) > 0:
        url2 += "fq=" + get_url_by_field(langs, "tweet_lang") + "&"
    if len(countries) > 0:
        url2 += "fq=" + get_url_by_field(countries, "country") + "&"
    if len(sentiment) > 0:
        url2 += "fq=" + get_url_by_field(sentiment, "sentiment") + "&"
    url2 += 'qf=text_en^3&qf=tweet_text^1&q.op=OR&q='
    url3 = '&wt=json&indent=true&rows=10&start=' + start
    models = ["IR_Project4"]
    lang1 = "text_en%3A"
    lang2 = "text_text%3A"
    # lang3 = "text_hi%3A"
    OR = "%20or%20"
    for model in models:
        line = str(lines)
        inurl = url1 + model + url2 + lang1 + line + OR + lang2 + line + url3
        print(inurl)
        data = json.loads(requests.get(inurl).text)
        inner_doc = data['response']['docs']
        for d in inner_doc:
            if not (d.get("hashtags") is None):
                totalHashtags = d["hashtags"]
                for h in totalHashtags:
                    if h in hashtags:
                        hashtags[h] += 1
                    else:
                        hashtags[h] = 1
            if not (d.get("mentions") is None):
                totalMentions = d["mentions"]
                for m in totalMentions:
                    if m in mentions:
                        mentions[m] += 1
                    else:
                        mentions[m] = 1
    sorted_hashtags = sorted(hashtags.items(), key=lambda item: item[1], reverse=False)
    data["hashtags"] = {k: v for k, v in sorted_hashtags}
    sorted_mentions = sorted(mentions.items(), key=lambda item: item[1], reverse=False)
    data["mentions"] = {k: v for k, v in sorted_mentions}
    return data

@app.route('/api',methods=["POST"])
def my_microservice():
    query = request.json["query"]
    start = request.json["start"]
    pois, langs, countries,sentiment = [],[],[],[]
    if "pois" in request.json:
        pois = request.json["pois"]
    if "languages" in request.json:
        langs = request.json["languages"]
    if "countries" in request.json:
        countries = request.json["countries"]
    if "sentiment" in request.json:
        sentiment = request.json["sentiment"]
    k = make_summary(query, pois,langs,countries,sentiment,start)
    return json.dumps(k,ensure_ascii=False, indent=4,sort_keys=True)


# if __name__ == '__main__':
#     app.config['RESTFUL_JSON'] = {
#         'ensure_ascii': True
#     }
#     app.run(host="0.0.0.0", port=9999, debug=True)

@app.route('/test', methods=['GET'])
def test():
    return "TEST"
