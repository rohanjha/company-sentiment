"use strict";
const credentials = require("../credentials.js");
const request = require("request");
const cheerio = require("cheerio");

exports.handleError = (err, res, ecode, extra) => {
    if (ecode == undefined) {
        ecode = 500;
    }

    if (err) {
        console.error("ERROR (request): " + err);
        if (extra) console.log(extra);
        res.status(ecode).send({"error": err});
    }
}

exports.logInfo = (info, extra) => {
    console.error("INFO  (server): " + info);
    if (extra !== undefined) console.log(extra);
}

exports.logError = (err, extra) => {
    console.error("ERROR (server): " + err);
    if (extra !== undefined) console.log(extra);
}

exports.getGoogleNewsAPIURL = (route) => {
    return `https://newsapi.org/v1/${route}?language=en&apiKey=${credentials.google_news_api_key}`;
}

exports.getTextAtURL = (url, callback) => {
    request({
        uri: url,
    }, function(error, response, body) {
        if (error) {
            console.log("ERROR (server): ")
            console.log(error);
        } else {
            let $ = cheerio.load(body);

            callback($("body").text());
        }
    });
}
