import json
import urllib.request
import urllib.parse
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS



# aws_url = 'http://3.19.211.16:8983/solr'




def get_wordcloud(tweet_docs):
    '''
    Input: Takes in json/dict obj of tweets
    Output: Returnswordcloud IMG in path
    '''
    # f = open('negative_tweets.json',mode='r')
    # tweet_docs = json.load(f)
    full_str = ''
    if isinstance(tweet_docs, dict):
        for t in tweet_docs.keys():
            for tt in tweet_docs[t]:
                if 'text_en' in tt.keys():
                    full_str += tt['text_en'] + ' '
                elif 'text_hi' in tt.keys():
                    full_str += tt['text_hi'] + ' '
                elif 'text_es' in tt.keys():
                    full_str += tt['text_es'] + ' '
    
    elif isinstance(tweet_docs, list):
        for t in tweet_docs:
            if 'text_en' in t.keys():
                full_str += t['text_en'] + ' '

            elif 'text_hi' in t.keys():
                full_str += t['text_hi'] + ' '
            elif 'text_es' in t.keys():
                full_str += t['text_es'] + ' '
    
    full_str = full_str[:-1]
    
    stopwords = set(STOPWORDS)
    wordcloud = WordCloud(width=1600,
    stopwords=stopwords,height=800,max_font_size=200,max_words=50,collocations=False, background_color='black').generate(full_str)
    plt.figure(figsize=(40,30))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.savefig('wordcloud.png')




def get_replies(tweet_id, base_url):
    '''
    tweet_id : tweet_id of tweet whose replies are needed
    base_url : IP:8983/solr [url1]

    Output: Dictionary, 
    replies{
        'reply_list' : [list of replies],
        'positive' : count of positive sentiment tweets,
        'negative' : count of negative sentiment tweets,
        'neutral' : count of neutral sentiment tweets

    }

    '''

    
    replies = {}
    replies['reply_list'] = []
    replies['positive'] = 0
    replies['negative'] = 0
    replies['neutral'] = 0

    query = 'replied_to_tweet_id%3A'+ str(tweet_id)

    url = base_url + '/IR_Final1' + '/select?&q='+query+'&wt=json&indent=true'
    # print (f'URL: {url}')
    data = urllib.request.urlopen(url)
    docs = json.load(data)['response']['docs']

    for d in docs:
        replies['reply_list'].append(d)
        if d['sentiment'] == 1:
            replies['positive'] += 1
        elif d['sentiment'] == 0:
            replies['neutral'] += 1
        elif d['sentiment'] == -1:
            replies['negative'] += 1

    reply = {}
    reply['replies'] = replies['reply_list']
    reply['count'] = []
    obj = {}
    obj['name'] = 'Positive'
    obj['value'] = replies['positive']
    reply['count'].append(obj)
    obj = {}
    obj['name'] = 'Negative'
    obj['value'] = replies['negative']
    reply['count'].append(obj)
    obj = {}
    obj['name'] = 'Neutral'
    obj['value'] = replies['neutral']
    reply['count'].append(obj)
    
    return reply


def find_negative_tweets(base_url):
    '''
    Finding negative tweets off a list of negative keywords
    Find all tweets based on those keywords, storing them in a keyword-pair
    and saving in file
    '''
    space = ' '
    spaceParse = urllib.parse.quote(space)

    neg_terms = ['abolishbigpharma','VaccineInjuries','NoVaccineMandates','VaccineFailure','NoForcedFlushots','antivaccine','NoForcedVaccines','ArrestBillGates','notomandatoryvaccines','betweenmeandmydoctor','NoVaccine','bigpharmafia','NoVaccineForMe','bigpharmakills','novaccinemandates','BillGatesBioTerrorist','parentalrights','billgatesevil','parentsoverpharma','BillGatesIsEvil','saynotovaccines','billgatesisnotadoctor','stopmandatoryvaccination','billgatesvaccine','syringeslaughter','cdcfraud','unvaccinated','cdctruth','vvglobaldemo','cdcwhistleblower','vaccinationchoice','covidvaccineispoison','VaccineAgenda','depopulation','vaccinedamage','DoctorsSpeakUp','vaccinefailure','educatebuvax','vaccinefraud','exposebillgates','vaccineharm','forcedvaccines','vaccineinjuries','Fuckvaccines','vaccineinjury','idonotconsent','VaccinesAreNotTheAnswer','informedconsent','vaccinesarepoison','learntherisk','vaccinescause','medicalfreedom','vaccineskill','medicalfreedomofchoice','vaxxed','momsofunvaccinatedchildren','yeht','mybodymychoice','antivax','CrimeaAainsTHumanity','Antivaxxers','arrestbillgates',"VaccineDeaths","Iwillnotcomply","VaccineInjured","NoToVaccinePassport","VaccineSideEffects","NoCompulsoryVaccines","JustSayNo", "MedicalGenocide","VaccineForGenocide","BillGatesBioTerrorist","depopulation","COVIDHOAX", "CrimesAgainstHumanity"]

    negative_tweets = {}

    for t in neg_terms:

        # txt='hashtags%3A'+t+'%0Atweet_text%3A'+t+'%0Areply_text%3A'+t
        txt1 = 'hashtags%3A'+t+spaceParse+'or'+spaceParse+'tweet_text%3A'+t+spaceParse+'or'+spaceParse+'reply_text%3A'+t
        # parsed = urllib.parse.quote_plus(txt)
        # print (parsed)
        # space = ' '
        # spaceParse = urllib.parse.quote(space)
        url = 'http://'+AWS_IP+':8983/solr/'+'IR_Final1'+'/select?&q='+txt1+'&wt=json&indent=true&rows=400'
        #   url = 'http://'+AWS_IP+':8983/solr/'+core_name+'/select?q=text_en%3A'+parsed+spaceParse+'or'+ \
        #           spaceParse+'text_de%3A'+parsed+spaceParse+'or'+spaceParse+'text_ru%3A'+parsed+ \
        #           '&fl=id%2Cscore&wt=json&indent=true&rows=20'
        print (f'URL: {url}')
        data = urllib.request.urlopen(url)
        docs = json.load(data)['response']['docs']
        print (type(docs))
        print (t)
        if len(docs) == 0:
            continue
        else:
            negative_tweets[t] = docs

    with open('negative_tweets.json', 'w') as b:
        json.dump(negative_tweets, b)




def language_distribution(query_result):
    '''
    Returns the distribution of languages in the results
    returned from the query.
    '''

    lang = {}
    lang['English'] = 0
    lang['Hindi'] = 0
    lang['Spanish'] = 0
    lang['Others'] = 0

    for d in query_result:
        if d['tweet_lang'] == 'en':
            lang['English'] += 1
        elif d['tweet_lang'] == 'hi':
            lang['Hindi'] += 1
        elif d['tweet_lang'] == 'es':
            lang['Spanish'] += 1
        else:
            lang['Others'] += 1

    return lang



def country_distribution(query_result):
    '''
    Returns the country-based distribution of the doc results
    '''
    country = {}
    for d in query_result:
        if d['country'].lower() not in country.keys():
            country[d['country'].lower()] = 1
            
        else:
            country[d['country'].lower()] += 1

    finCountry = []
    for k in country.keys():
        obj = {}
        obj['name'] = k
        obj['value'] = country[k]
        finCountry.append(obj)

    return finCountry


def poi_with_sentiment(query_result):
    '''
    Returns number of tweets by POIs along with 
    the count of sentiment of their tweets
    '''
    pois_sntmt = {}
    for d in query_result:
        if 'poi_name' in d.keys():
            if d['poi_name'] in pois_sntmt.keys():
                pois_sntmt[d['poi_name']]['count'] += 1
                pois_sntmt[d['poi_name']]['sentiment'][d['sentiment']] += 1
            else:
                pois_sntmt[d['poi_name']] = {}
                pois_sntmt[d['poi_name']]['count'] = 1
                pois_sntmt[d['poi_name']]['sentiment'] = {}
                pois_sntmt[d['poi_name']]['sentiment'][0] = 0     ## neutral sentiment
                pois_sntmt[d['poi_name']]['sentiment'][1] = 0     ## positive sentiment
                pois_sntmt[d['poi_name']]['sentiment'][-1] = 0    ## negative sentiment
                pois_sntmt[d['poi_name']]['sentiment'][d['sentiment']] += 1
        else:
            continue

    return pois_sntmt


def popular_hashtags_mentions(query_result, k):
    '''
    Returns the top k hashtags and mentions given in the query
    result
    '''
    hashtags = {}
    mentions = {}

    for d in query_result:
        if 'hashtags' in d.keys() and isinstance(d['hashtags'], list):
            for l in d['hashtags']:
                if l not in hashtags.keys():
                    hashtags[l] = 1
                else:
                    hashtags[l] += 1
        if 'mentions' in d.keys() and isinstance(d['mentions'], list):
            for m in d['mentions']:
                if m not in mentions.keys():
                    mentions[m] = 1
                else:
                    mentions[m] += 1
    
    hash_srtd = sorted(hashtags.items(), key=lambda x: x[1], reverse=True)
    ment_srtd = sorted(mentions.items(), key=lambda x: x[1], reverse=True)

    if k < len(hash_srtd):
        hash_srtd = hash_srtd[:k]
    if k < len(ment_srtd):
        ment_srtd = ment_srtd[:k]

    ### Returned is a two-tuple list like this below
    ## [('COVID19', 496), ('VaccinEquity', 155), ('SecretGala11', 136), ('CrisLu25N', 123)]
    hashList = []
    mentList = []

    for i in range(len(hash_srtd)):
        obj = {}
        
        obj['name'] = hash_srtd[i][0]
        obj['value'] = hash_srtd[i][1]

        hashList.append(obj)
    
    for i in range(len(ment_srtd)):
        obj = {}
        
        obj['name'] = ment_srtd[i][0]
        obj['value'] = ment_srtd[i][1]

        mentList.append(obj)


    return hashList, mentList

