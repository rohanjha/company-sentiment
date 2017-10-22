"use strict";
const fetch = require("node-fetch");
const utils = require("./utils.js");

exports.googleNewsSources = [
    { id: 'abc-news-au', name: 'ABC News (AU)' },
    { id: 'al-jazeera-english', name: 'Al Jazeera English' },
    { id: 'ars-technica', name: 'Ars Technica' },
    { id: 'associated-press', name: 'Associated Press' },
    { id: 'bbc-news', name: 'BBC News' },
    { id: 'bbc-sport', name: 'BBC Sport' },
    { id: 'bild', name: 'Bild' },
    { id: 'bloomberg', name: 'Bloomberg' },
    { id: 'breitbart-news', name: 'Breitbart News' },
    { id: 'business-insider', name: 'Business Insider' },
    { id: 'business-insider-uk', name: 'Business Insider (UK)' },
    { id: 'buzzfeed', name: 'Buzzfeed' },
    { id: 'cnbc', name: 'CNBC' },
    { id: 'cnn', name: 'CNN' },
    { id: 'daily-mail', name: 'Daily Mail' },
    { id: 'der-tagesspiegel', name: 'Der Tagesspiegel' },
    { id: 'die-zeit', name: 'Die Zeit' },
    { id: 'engadget', name: 'Engadget' },
    { id: 'entertainment-weekly', name: 'Entertainment Weekly' },
    { id: 'espn', name: 'ESPN' },
    { id: 'espn-cric-info', name: 'ESPN Cric Info' },
    { id: 'financial-times', name: 'Financial Times' },
    { id: 'focus', name: 'Focus' },
    { id: 'football-italia', name: 'Football Italia' },
    { id: 'fortune', name: 'Fortune' },
    { id: 'four-four-two', name: 'FourFourTwo' },
    { id: 'fox-sports', name: 'Fox Sports' },
    { id: 'google-news', name: 'Google News' },
    { id: 'gruenderszene', name: 'Gruenderszene' },
    { id: 'hacker-news', name: 'Hacker News' },
    { id: 'handelsblatt', name: 'Handelsblatt' },
    { id: 'ign', name: 'IGN' },
    { id: 'independent', name: 'Independent' },
    { id: 'mashable', name: 'Mashable' },
    { id: 'metro', name: 'Metro' },
    { id: 'mirror', name: 'Mirror' },
    { id: 'mtv-news', name: 'MTV News' },
    { id: 'mtv-news-uk', name: 'MTV News (UK)' },
    { id: 'national-geographic', name: 'National Geographic' },
    { id: 'new-scientist', name: 'New Scientist' },
    { id: 'newsweek', name: 'Newsweek' },
    { id: 'new-york-magazine', name: 'New York Magazine' },
    { id: 'nfl-news', name: 'NFL News' },
    { id: 'polygon', name: 'Polygon' },
    { id: 'recode', name: 'Recode' },
    { id: 'reddit-r-all', name: 'Reddit /r/all' },
    { id: 'reuters', name: 'Reuters' },
    { id: 'spiegel-online', name: 'Spiegel Online' },
    { id: 't3n', name: 'T3n' },
    { id: 'talksport', name: 'TalkSport' },
    { id: 'techcrunch', name: 'TechCrunch' },
    { id: 'techradar', name: 'TechRadar' },
    { id: 'the-economist', name: 'The Economist' },
    { id: 'the-guardian-au', name: 'The Guardian (AU)' },
    { id: 'the-guardian-uk', name: 'The Guardian (UK)' },
    { id: 'the-hindu', name: 'The Hindu' },
    { id: 'the-huffington-post', name: 'The Huffington Post' },
    { id: 'the-lad-bible', name: 'The Lad Bible' },
    { id: 'the-new-york-times', name: 'The New York Times' },
    { id: 'the-next-web', name: 'The Next Web' },
    { id: 'the-sport-bible', name: 'The Sport Bible' },
    { id: 'the-telegraph', name: 'The Telegraph' },
    { id: 'the-times-of-india', name: 'The Times of India' },
    { id: 'the-verge', name: 'The Verge' },
    { id: 'the-wall-street-journal', name: 'The Wall Street Journal' },
    { id: 'the-washington-post', name: 'The Washington Post' },
    { id: 'time', name: 'Time' },
    { id: 'usa-today', name: 'USA Today' },
    { id: 'wired-de', name: 'Wired.de' },
    { id: 'wirtschafts-woche', name: 'Wirtschafts Woche' }
];

let sources = [{
    "id": "twitter",
    "name": "Twitter"
}];

exports.getSources = () => {
    return sources;
}

exports.fetchGoogleNewsSources = () => {
    // google news api
    fetch(utils.getGoogleNewsAPIURL("sources"))
    .then((res) => {
        // pass on json as promise
        return res.json();
    }).then((json) => {
        if (json == null || json.sources == null) {
            utils.logError("News api sources list is null!");
        } else {
            json.sources.forEach((source) => {
                let newSource = {
                    "id": source.id,
                    "name": source.name
                };
                // sources.push(newSource);
                console.log(newSource);
            });
        }
    }).catch((err) => {
        utils.logError(err);
    });
}
