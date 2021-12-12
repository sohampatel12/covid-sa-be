import json
import urllib.request
import urllib.parse
# import matplotlib.pyplot as plt
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
    wordcloud = WordCloud(stopwords=stopwords).process_text(full_str)
    wordList = sorted(wordcloud.items(), key=lambda x: x[1], reverse=True)

    wList = {}
    for w in wordList:
        wList[w[0]] = w[1]
    return wList




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

    url = base_url + 'IR_Final' + '/select?&q='+query+'&wt=json&indent=true'
    # print (f'URL: {url}')
    data = urllib2.urlopen(url)
    docs = json.load(data)['response']['docs']

    for d in docs:
        replies['reply_list'].append(d)
        if d['sentiment'] == '1':
            replies['positive'] += 1
        elif d['sentiment'] == '0':
            replies['neutral'] += 1
        elif d['sentiment'] == '2':
            replies['negative'] += 1

    print (replies)
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
        url = 'http://'+AWS_IP+':8983/solr/'+'IR_Final'+'/select?&q='+txt1+'&wt=json&indent=true&rows=400'
        #   url = 'http://'+AWS_IP+':8983/solr/'+core_name+'/select?q=text_en%3A'+parsed+spaceParse+'or'+ \
        #           spaceParse+'text_de%3A'+parsed+spaceParse+'or'+spaceParse+'text_ru%3A'+parsed+ \
        #           '&fl=id%2Cscore&wt=json&indent=true&rows=20'
        print (f'URL: {url}')
        data = urllib2.urlopen(url)
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



def generate_corpus_results(dir):

    dir_name = dir                     ### Put name of directory where tweets are present in 
    files = os.listdir(dir_name)  

    pois = {}
    country = {}
    lang = {} 
    sent_poi = {}
    
    sentiment = {}
    sentiment['Positive'] = 0
    sentiment['Negative'] = 0
    sentiment['Neutral'] = 0

    hashtags = {}
    mentions = {}

    date_count = {}

    for f in files:
        if f[-4:] == 'json':
            p = open(dir_name+'/'+f, 'r')
            data = json.load(p)
            
            for d in data:
                if 'poi_name' in d.keys():
                    if d['poi_name'] not in pois.keys():
                        pois[d['poi_name']] = 1
                        sent_poi[d['poi_name']] = {}
                        sent_poi[d['poi_name']]['Positive'] = 0
                        sent_poi[d['poi_name']]['Negative'] = 0
                        sent_poi[d['poi_name']]['Neutral'] = 0
                        if d['sentiment'] == '0' or d['sentiment'] == 0:
                            sent_poi[d['poi_name']]['Neutral'] += 1
                            sentiment['Neutral'] += 1
                        elif d['sentiment'] == '1' or d['sentiment'] == 1:
                            sent_poi[d['poi_name']]['Positive'] += 1
                            sentiment['Positive'] += 1
                        elif d['sentiment'] == '2' or d['sentiment'] == 2:
                            sent_poi[d['poi_name']]['Negative'] += 1
                            sentiment['Negative'] += 1
                        
                    
                    else:
                        pois[d['poi_name']] += 1
                        if d['sentiment'] == '0' or d['sentiment'] == 0:
                            sent_poi[d['poi_name']]['Neutral'] += 1
                            sentiment['Neutral'] += 1
                        elif d['sentiment'] == '1' or d['sentiment'] == 1:
                            sent_poi[d['poi_name']]['Positive'] += 1
                            sentiment['Positive'] += 1
                        elif d['sentiment'] == '2' or d['sentiment'] == 2:
                            sent_poi[d['poi_name']]['Negative'] += 1
                            sentiment['Negative'] += 1

                ## country
                if d['country'].lower() not in country.keys():
                    country[d['country'].lower()] = 1
                
                else:
                    country[d['country'].lower()] += 1
                
                ## language
                if d['tweet_lang'] not in lang.keys():
                    lang[d['tweet_lang']] = 1
                else:
                    lang[d['tweet_lang']] += 1

                ## poi_based_sentiment
                ### handled up at poi


                ## total sentiment
                ## handled in POIs
                

                ## top 10 hashtags and mentions
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




                ## number of tweets based on days
                if 'tweet_date' in d.keys():
                    dt = d['tweet_date'].split('T')[0]
                    if dt not in date_count.keys():
                        date_count[dt] = 1
                    else:
                        date_count[dt] += 1



    ## poi_static_json
    poisL = []
    poikList = list(pois.keys())
    for i in poikList:
        obj = {}
        
        obj['name'] = i
        obj['value'] = pois[i]

        poisL.append(obj)
    with open('static_pois.json', 'w') as ff:
        json.dump(poisL, indent = 4)

    countryL = []
    counkList = list(country.keys())
    for i in counkList:
        obj = {}
        
        obj['name'] = i
        obj['value'] = country[i]

        countryL.append(obj)
    with open('static_country.json', 'w') as ff:
        json.dump(countryL, indent = 4)

    langL = []
    langkList = list(lang.keys())
    for i in langkList:
        obj = {}
        
        obj['name'] = i
        obj['value'] = lang[i]

        langL.append(obj)
    with open('static_lang.json', 'w') as ff:
        json.dump(langL, indent = 4)

    sentL = []
    sentkList = list(sentiment.keys())
    for i in sentkList:
        obj = {}
        
        obj['name'] = i
        obj['value'] = sentiment[i]

        langL.append(obj)
    with open('static_sentiment.json', 'w') as ff:
        json.dump(sentL, indent = 4)

    with open('static_poi_sent.json', 'w') as ff:
        json.dump(sent_poi, indent = 4)

    hash_srtd = sorted(hashtags.items(), key=lambda x: x[1], reverse=True)
    ment_srtd = sorted(mentions.items(), key=lambda x: x[1], reverse=True)

    # if k < len(hash_srtd):
    #     hash_srtd = hash_srtd[:k]
    # if k < len(ment_srtd):
    #     ment_srtd = ment_srtd[:k]

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

    with open('static_hashtags.json', 'w') as ff:
        json.dump(hashList, indent = 4)

    with open('static_mentions.json', 'w') as ff:
        json.dump(mentList, indent = 4)


    

