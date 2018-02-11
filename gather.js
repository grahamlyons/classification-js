const Twit = require('twit');
const { writeFile } = require('fs-extra');
const { join } = require('path');
const { hashtags, dataPath } = require('./local-constants');

const consumer_key = process.env['CONSUMER_KEY'];
const consumer_secret = process.env['CONSUMER_SECRET'];
const access_token = process.env['ACCESS_TOKEN'];
const access_token_secret = process.env['ACCESS_TOKEN_SECRET'];

const T = new Twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret,
});

async function searchTweets(query) {
    var {data} = await T.get('search/tweets', { q: query, count: 100  });
    return data['statuses'];
}

function gatherData(...hashtags) {
    hashtags.forEach(async function(hashtag) {
        var data = await searchTweets(hashtag);
        console.log(`Found ${data.length} for ${hashtag}`);
        await writeFile(join(dataPath, `${hashtag}.json`), JSON.stringify(data));
    });
}

gatherData(...hashtags)
