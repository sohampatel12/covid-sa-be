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

def make_summary(query,pois,langs,countries,start):
    hashtags = {}
    mentions = {}
    lines = query
    url1 = 'http://3.144.30.130:8983/solr/'
    url2 = '/select?&defType=edismax&qf=text_en^7&qf=text_hi^4&qf=text_es^2&q.op=OR&q='
    url3 = '&wt=json&indent=true&rows=10&start=' + start
    models = ["IR_Project4"]
    lang1 = "text_en%3A"
    lang2 = "text_es%3A"
    lang3 = "text_hi%3A"
    OR = "%20or%20"
    eng, hin, max = 0,0,0
    usa,india,mexico = 0,0,0
    for model in models:
        line = str(lines)
        inurl = url1 + model + url2 + lang1 + line + OR + lang3 + line + OR + lang2 + line # lang1+line + url3
        if len(pois) > 0:
            inurl += OR + get_url_by_field(pois, "poi_name")
        if len(langs) > 0:
            inurl += OR + get_url_by_field(langs, "tweet_lang")
        if len(countries) > 0:
            inurl += OR + get_url_by_field(countries, "country")
        inurl += url3
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
            if d["tweet_lang"] == "en":
                eng += 1
            elif d["tweet_lang"] == "hi":
                hin += 1
            elif d["tweet_lang"] == "es":
                max += 1
            if d["country"] == "USA":
                usa += 1
            elif d["country"] == "India":
                india += 1
            elif d["country"] == "Mexico":
                mexico += 1
    data["country"] = {"usa":usa, "india":india, "mexico":mexico}
    data["lang"] = {"english":eng, "hindi":hin, "spanish": max}
    sorted_hashtags = sorted(hashtags.items(), key=lambda item: item[1], reverse=False)
    data["hashtags"] = {k: v for k, v in sorted_hashtags}
    sorted_mentions = sorted(mentions.items(), key=lambda item: item[1], reverse=False)
    data["mentions"] = {k: v for k, v in sorted_mentions}
    return data

@app.route('/api',methods=["POST"])
def my_microservice():
    query = request.json["query"]
    start = request.json["start"]
    pois, langs, countries = [],[],[]
    if "pois" in request.json:
        pois = request.json["pois"]
    if "languages" in request.json:
        langs = request.json["languages"]
    if "countries" in request.json:
        countries = request.json["countries"]
    k = make_summary(query, pois,langs,countries,start)
    return json.dumps(k,ensure_ascii=False, indent=4,sort_keys=True)

@app.route('/test', methods=['GET'])
def test():
    return "TEST"

# if __name__ == '__main__':
#     app.config['RESTFUL_JSON'] = {
#         'ensure_ascii': True
#     }
#     app.run(host="0.0.0.0", port=9999, debug=True)