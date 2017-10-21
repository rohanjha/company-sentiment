/*
 * File responsible for querying APIs to accumulate mentions
 */
const companyResource = require("./resource/company-resource.js");
const mentionResource = require("./resource/mention-resource.js");
const textAnalyzer = require("./text-analyzer.js");

const apis = [
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
   for (let api in apis) {
     api.fetchMentions(mentionResource.addMention,
                       textAnalyzer.analyze,
                       companyResource.getCompanyId);
   }
}
