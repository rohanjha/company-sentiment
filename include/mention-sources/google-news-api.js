"use strict";

const fetch = require("node-fetch");

const utils = require("../utils.js");
const companyResource = require("../resource/company-resource.js");
const mentionResource = require("../resource/mention-resource.js");
const textAnalyzer = require("../text-analyzer.js");
const sources = require("../mention-sources.js");

function parseArticle(article, sourceName, addMention) {
    utils.logInfo("processing article: ", article.title);

    // check that we haven't seen this article before analyzing
    // we assume the article source and timestamp (which includes time)
    // are enough data (URL is easiest, BUT it does tend to change)
    mentionResource.getMentions((results) => {
        if (results.length === 0) {
            // get the article text (we can also use article.description as a backup)
            // let text = article.description;
            utils.logInfo(`fetching article text @`, article.url);
            utils.getTextAtURL(article.url, (text) => {
                // analyze the article text to determine sentiments
                textAnalyzer.analyzeText(text, (stats) => {
                    if (stats == null) {
                        utils.logError("text analyzing did not complete");
                        return;
                    } else if (stats.company_name == null ||
                                stats.sentiment_mag == null ||
                                stats.sentiment_score == null) {
                        utils.logError("some invalid text analysis property exists:", stats);
                        return;
                    }
                    utils.logInfo("storing mention with stats: ", stats);

                    // get company id from name
                    companyResource.getCompanyFromName(stats.company_name, (company) => {
                        let mention = {
                            // doing company_id next
                            source          : sourceName,
                            url             : article.url,
                            sentiment_mag   : stats.sentiment_mag,
                            sentiment_score : stats.sentiment_score,
                            timestamp       : new Date(article.publishedAt)
                        }

                        // add a new company if we find one
                        if (company == null) {
                            companyResource.addCompany(stats.company_name, (err, newCompany) => {
                                if (err || newCompany == undefined) {
                                    utils.logError("new company couldn't be created ", err);
                                } else {
                                    utils.logInfo("adding new company from mention", newCompany)
                                    // actually add mention to database
                                    mention["company_id"] = newCompany._id;
                                    addMention(mention);
                                }
                            });
                        } else {
                            // actually add mention to database
                            mention["company_id"] = company._id;
                            addMention(mention);
                        }
                    });
                });
            });
        } else {
            utils.logInfo(`skipped existing mentions from ${article.url}`);
        }
    }, { "url" : article.url }); // "source": source, "timestamp", new Date(article.publishedAt)
}

exports.fetchMentions = (addMention) => {
    utils.logInfo(`fetching google news api articles`);

    let j = 0;

    // get the mentions using the google news API
    // we have to go through all the possible sources and get their stories
    for (let i = 0; i < sources.googleNewsSources.length; i++) {
        let source = sources.googleNewsSources[i];

        // https://newsapi.org/#apiArticles
        const SORT_METHOD = "top"; // top | latest | popular
        fetch(`${utils.getGoogleNewsAPIURL("articles")}&sortBy=${SORT_METHOD}&source=${source.id}`)
        .then((res) => {
            // pass on json as promise
            return res.json();

        }).then((json) => {
            utils.logInfo(`fetched articles from ${source.name}`);

            if (json == null || json.articles == null) {
                utils.logError("News api articles list is null!");
            } else {
                json.articles.forEach((article) => {
                    // if (j < 10) {
                        parseArticle(article, source.name, addMention);
                    // }
                    j++;
                });
            }
        }).catch((err) => {
            utils.logError(err);
        });
    }
}
