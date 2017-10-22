"use strict";
/*
* File responsible for querying APIs to accumulate mentions
*/
const utils = require("./utils.js");
const companyResource = require("./resource/company-resource.js");
const mentionResource = require("./resource/mention-resource.js");

const mentionSources = [
    require("./mention-sources/twitter.js"),
    require("./mention-sources/google-news-api.js")
]

let runTimeout = null;

exports.start = (initialStart, interval) => {
    if (initialStart >= 0) setTimeout(run, initialStart);
    runTimeout = setInterval(run, interval);
}

function run() {
    /**
    * Query APIs and get back data
    */
    utils.logInfo("fetching mentions...");

    for (let i = 0; i < mentionSources.length; i++) {
        mentionSources[i].fetchMentions(mentionResource.addMention);
    }
}
