"use strict";
/*
 * File responsible for querying APIs to accumulate mentions
 */
const companyResource = require("./resource/company-resource.js");
const mentionResource = require("./resource/mention-resource.js");
const textAnalyzer = require("./text-analyzer.js");

const mentionSources = [
  require("./mention-sources/twitter.js"),
  // require("mention-sources/bloomberg.js")
]

exports.start = () => {
  // TODO:  run "run" periodically
}

function run() {
  /**
   * Query APIs and get back data
   */
   for (let source in mentionSources) {
     source.fetchMentions(mentionResource.addMention,
                          textAnalyzer.analyze,
                          companyResource.getCompanyId);
   }
}
