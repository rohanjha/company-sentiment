/**
* Analyzes text to determine characteristics
*/
const utils = require("./utils.js");

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient({
    "keyFilename": "./google-credentials.json"
});

exports.analyze = (text, callback) => {

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    client
    .analyzeSentiment({document: document})
    .then(results => {
        const sentiment = results[0].documentSentiment;

        callback({
            "sentiment_score" : sentiment.score,
            "sentiment_mag" : sentiment.magnitude
        });
    })
    .catch(err => {
        utils.logError("google text analyze:", err);
        callback(null);
    });
}
