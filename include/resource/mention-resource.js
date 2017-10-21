"use strict";

const utils = require("../utils.js");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mentionScheme = new Schema({
    title         : String,
    company_id    : String,
    source        : String,
    sentiment     : Number
});

const Mention = mongoose.model("Mention", mentionScheme);

/**
 * METHODS
 */

exports.addMention = (mention, err_cb) => {
  const newMention = new Mention({
    "title": mention.name,
    "company_id": mention.company_id,
    "source" : mention.source,
    "sentiment": mention.sentiment
  });

  newMention.save((err, mention) => {
    if (err) {
      utils.logError("error saving mention", {"err": err, "mention": mention});
      err_cb(err);
    } else {
      utils.logInfo("new mention added:", mention);
    }
  });
}

/**
 * REST ROUTES
 */
exports.index = (req, res) => {
  if (req.query.q != undefined) {

    // TODO: intelligent search

  } else if (req.query.size != 0) { // undefined signfies no params
    // utils.logInfo("params", req.params);
    Mention.find(req.query, (err, results) => {
      utils.handleError(err, res);
      res.send(results);
    });
  } else {
    // just send full index if no search term is provided
    Mention.find((err, mentions) => {
      utils.handleError(err, res);
      res.send(mentions);
    });
  }
};

exports.new = (req, res) => {
  res.status(400).send("The mention table is immutable.");
};

exports.create = (req, res) => {
  res.status(400).send("The mention table is immutable.");
};

exports.show = (req, res) => {
  Company.findOne({"_id": req.params.mention }, (err, mention) => {
    utils.handleError(err, res);
    res.send(mention);
  });
};

exports.edit = (req, res) => {
  res.status(400).send("The mention table is immutable.");
};

exports.update = (req, res) => {
  res.status(400).send("The mention table is immutable.");
};

exports.destroy = (req, res) => {
  res.status(400).send("The mention table is immutable.");
};

// ** TESTING DATA **
Mention.count({}, (err, size) => {
  if (size === 0) {
    let testMention1 = new Mention({"title": "United Airlines Does Bad Things", "company_id": "59eae432ff83914f9a39b614", "source": "The Washington Post", "sentiment": -0.9});
    let testMention2 = new Mention({"title": "Why I Love Facebook", "company_id": "59eae432ff83914f9a39b616", "source": "Twitter", "sentiment": 0.8});
    let testMention3 = new Mention({"title": "Intel: Meh", "company_id": "59eae432ff83914f9a39b617", "source": "Facebook", "sentiment": 0});
    let testMention4 = new Mention({"title": "Facebook programmers forced to code in VR", "company_id": "59eae432ff83914f9a39b616", "source": "Wired", "sentiment": 0.4});
    testMention1.save();
    testMention2.save();
    testMention3.save();
    testMention4.save();
  }
});
