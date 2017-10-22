"use strict";

const utils = require("../utils.js");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const companySchema = new Schema({
    name          : {
        type: String,
        unique: true
    },
    machine_name  : String
});

const Company = mongoose.model("Company", companySchema);
exports.Company = Company;

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

exports.getCompanies = (callback, query) => {
    if (query == undefined) query = {}
    Company.find(query, (err, results) => {
        if (err) utils.logError("error in searching for companies", err);
        callback(results);
    });
}

exports.addCompany = (name, callback) => {
    new Company({"name": name}).save(callback);
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
            utils.logInfo(`search for company '${req.query.q}' yielded:`, results);
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
