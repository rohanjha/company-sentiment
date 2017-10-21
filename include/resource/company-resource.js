"use strict";

const utils = require("../utils.js");
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name          : String,
    ticker        : String
});

const Company = mongoose.model("Company", companySchema);

/**
 * REST ROUTES
 */
exports.index = (req, res) => {
  if (req.query.q != undefined) {

    // TODO: intelligent search

  } else if (req.query.size != 0) { // undefined signfies no params
    // utils.logInfo("params", req.params);
    Company.find(req.query, (err, results) => {
      utils.handleError(err, res);
      res.send(results);
    });
  } else {
    // just send full index if no search term is provided
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
    let testCompany1 = new Company({"name": "United Airlines", "ticker": "UAL"});
    let testCompany2 = new Company({"name": "Google", "ticker": "GOOG"});
    let testCompany3 = new Company({"name": "Facebook", "ticker": "FB"});
    let testCompany4 = new Company({"name": "Intel", "ticker": "INTC"});
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
