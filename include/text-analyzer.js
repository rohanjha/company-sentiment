/**
* Analyzes text to determine characteristics
*/
const MAX_SESSION_CALLS = -1; // 100

const utils = require("./utils.js");

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a client
const client = new language.LanguageServiceClient({
    "keyFilename": "./google-credentials.json"
});

let numAnalyzeCalls = 0;

function analyzeDocument(document, callback) {
    // Detects the sentiment of the text
    client.analyzeEntitySentiment({document: document})
    .then(results => {
        const entities = results[0].entities;
        // utils.logInfo("entities", entities)

        if (entities != null) {
            organizations = {};

            entities.forEach(entity => {
                if (entity.type === "ORGANIZATION") {
                    if (organizations[entity.name] == undefined) {
                        organizations[entity.name] = {
                            count: 1,
                            // for averaging
                            totalSentimentScore: entity.sentiment.score,
                            totalSentimentMag: entity.sentiment.mag
                        }
                    } else {
                        organizations[entity.name].count++;
                        organizations[entity.name].totalSentimentScore = organizations[entity.name].totalSentimentScore + entity.sentiment.score;
                        organizations[entity.name].totalSentimentMag = organizations[entity.name].totalSentimentMag + entity.sentiment.mag;
                    }
                }
            });

            // send sentiment for every organization in the text
            for (let organization in organizations) {
                const count = organizations[organization].count;
                let sentiment_score = organizations[organization].totalSentimentScore / count;
                if (isNaN(sentiment_score)) sentiment_score = 0;
                let sentiment_mag = organizations[organization].totalSentimentMag / count;
                if (isNaN(sentiment_mag)) sentiment_mag = 0;

                callback({
                    "sentiment_score" : sentiment_score,
                    "sentiment_mag" : sentiment_mag,
                    "company_name" : organization.toLowerCase() // TO LOWER
                });
            }
        } else {
            utils.logError(`entities are null for: `, document);
            callback(null);
        }
    }).catch((err) => {
        utils.logError("google text analyze:", err);
        callback(null);
    });
}

exports.analyzeText = (text, callback) => {
    // prevent TONS of calls : TODO: REMOVE!!!!!
    numAnalyzeCalls++;
    if (MAX_SESSION_CALLS >= 0 && numAnalyzeCalls >= MAX_SESSION_CALLS) {
        utils.logError("MAX_SESSION_CALLS exceeded... blocking further calls");
        callback(null);
        return;
    }

    if (text != null) {
        analyzeDocument({
            content: text,
            type: 'PLAIN_TEXT',
        }, callback);
    } else {
        utils.logError("text input to analyzeText is null");
        callback(null);
    }
}
