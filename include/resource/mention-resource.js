"use strict";

const utils = require("../utils.js");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mentionScheme = new Schema({
    company_id      : String,
    source          : String,
    url             : String,
    sentiment_mag   : Number,
    sentiment_score : Number,
    timestamp       : Date
});

const Mention = mongoose.model("Mention", mentionScheme);

/**
* METHODS
*/

exports.addMention = (mention, err_cb) => {
    const newMention = new Mention(mention);

    newMention.save((err, mention) => {
        if (err) {
            utils.logError("error saving mention", {"err": err, "mention": mention});
            if (err_cb) err_cb(err);
        } else {
            utils.logInfo("new mention added:", mention);
        }
    });
}

exports.getMentions = (callback, query) => {
    if (query == null) query = {}
    Mention.find(query, (err, results) => {
        if (err) utils.logError("error in searching for mentions", err);
        callback(results);
    });
}

/**
* REST ROUTES
*/
exports.index = (req, res) => {
    // "search" route
    if (req.query.q != undefined) {
        // TODO: improve search
        Mention.find({"source": new RegExp(req.query.q, "i") }, (err, results) => {
            utils.handleError(err, res);
            utils.logInfo(`search for mention '${req.query.q}' yielded:`, results);
            res.send(results);
        });

    // route for searching by any attribute
    } else if (req.query != undefined) {
        let query = req.query; //new mongoose.Query();

        // create date query if requested
        if (query.start_date != undefined) {
            let startDate = new Date(query.start_date);
            delete query.start_date; // remove so doesn't limit results

            // end date is now if not specified
            // let endDate = new Date();
            // if (req.query.end_date != undefined) {
            //     endDate = new Date(req.query.end_date);
            //     delete req.query.end_date; // remove so doesn't limit results
            // }

            query["timestamp"] = { $gte: startDate }; // reversed for some reason .gte(new Date())
        }
        // query.find(req.query);

        Mention.find(query, (err, results) => {
            utils.handleError(err, res);
            res.send(results);
        });

        // just send full index if no search term is provided
    } else {
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
// Mention.count({}, (err, size) => {
//     if (size === 0) {
//         let testMention1 = new Mention({
//             "company_id": "59eb9fb6c18ed043b434d7fe", // Facebook
//             "source": "The Washington Post",
//             "url": "www.washingtonpost.com",
//             "sentiment": -0.9,
//             "timestamp": new Date(2017, 10, 21)});
//             testMention1.save();
//
//             let testMention2 = new Mention({
//                 "company_id": "59eb9fb6c18ed043b434d7fd", // Google
//                 "source": "Twitter",
//                 "url": "www.twitter.com",
//                 "sentiment": 0.8,
//                 "timestamp": new Date(2017, 10, 19)
//             });
//             testMention2.save();
//
//             let testMention3 = new Mention({
//                 "company_id": "59eb9fb6c18ed043b434d7ff", // Intel
//                 "source": "Facebook",
//                 "url": "www.facebook.com",
//                 "sentiment": 0,
//                 "timestamp": new Date(2016, 1, 15)
//             });
//             testMention3.save();
//
//             let testMention4 = new Mention({
//                 "company_id": "59eb9fb6c18ed043b434d7fe", // Facebook
//                 "source": "Wired",
//                 "url": "www.wired.com",
//                 "sentiment": -.1,
//                 "timestamp": new Date(2017, 9, 28)
//             });
//             testMention4.save();
//         }
//     });
