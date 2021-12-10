import json
import urllib.request



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

    url = base_url + '/IR_Project4' + '/select?&q='+query+'&wt=json&indent=true'
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


    return replies




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

    return country


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

    return hash_srtd, ment_srtd

