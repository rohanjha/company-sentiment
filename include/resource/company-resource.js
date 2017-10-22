"use strict";

const utils = require("../utils.js");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name          : String,
});

const Company = mongoose.model("Company", companySchema);

/**
* METHODS
*/
exports.getCompanyFromName = (companyName, callback) => {
    // TODO: improve search
    Company.findOne({"name": new RegExp(companyName, "i") }, (err, company) => {
        if (err) {
            callback(null);
        }
        callback(company);
    });
}

exports.forEachCompany = (callback) => {
    Company.find({}, (err, results) => {
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
        Company.find({"name": new RegExp(req.query.q, "i") }, (err, results) => {
            // console.log(results);
            utils.handleError(err, res);
            res.send(results);
        });

    // route for searching by any attribute
    } else if (req.query.size != 0) {
        Company.find(req.query, (err, results) => {
            utils.handleError(err, res);
            res.send(results);
        });

    // send full index if no search term is provided
    } else {
        Company.find((err, companies) => {
            utils.handleError(err, res);
            res.send(companies);
        });
    }
};

exports.new = (req, res) => {
    res.status(400).send("The company table is immutable.");
};

exports.create = (req, res) => {
    res.status(400).send("The company table is immutable.");
};

exports.show = (req, res) => {
    Company.findOne({"_id": req.params.company }, (err, company) => {
        utils.handleError(err, res);
        res.send(company);
    });
};

exports.edit = (req, res) => {
    res.status(400).send("The company table is immutable.");
};

exports.update = (req, res) => {
    res.status(400).send("The company table is immutable.");
};

exports.destroy = (req, res) => {
    res.status(400).send("The company table is immutable.");
};

// ** TESTING DATA **
Company.count({}, (err, size) => {
    if (size === 0) {
        let testCompany1 = new Company({"name": "United Airlines"});
        let testCompany2 = new Company({"name": "Google"});
        let testCompany3 = new Company({"name": "Facebook"});
        let testCompany4 = new Company({"name": "Intel"});
        testCompany1.save();
        testCompany2.save();
        testCompany3.save();
        testCompany4.save();
    }
});

// print initally
Company.find((err, companies) => {
    utils.logInfo("companies:", companies);
});
