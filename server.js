"use strict";

const express = require('express')
const resource = require('express-resource');
const mongoose = require('mongoose');

// resources
const companyResource = require('./include/resource/company-resource.js');
const mentionResource = require('./include/resource/mention-resource.js');

const lookup = require('./include/mention-lookup.js');

/**
* CONFIGURATION
*/
const LISTEN_PORT = 3001;
const MONGO_DB_URL = "ds229435.mlab.com:29435/company-sense";
const MENTION_FETCH_INTERVAL = 5000; // ms

/**
* DB SETUP
*/
let options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
const credentials = require("./credentials.js");
mongoose.connection.on('error', console.error.bind(console, 'ERROR (mongo):'));
mongoose.connect(`mongodb://${credentials.dbuser}:${credentials.dbpassword}@${MONGO_DB_URL}`, options, () => {
    console.log("INFO: Connected to MongoDB");
});

/**
* SERVER SETUP
*/
const app = express();
app.use(express.static('client/'))

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Main resource route setup
app.resource('api/company', companyResource);
app.resource('api/mention', mentionResource);
// companyResource.setupRoutes("/company", app);

// start api collection
lookup.start(MENTION_FETCH_INTERVAL);

/**
* SERVE
*/
app.listen(LISTEN_PORT, () => {
    console.log(`INFO: API server listening on port ${LISTEN_PORT}`)
})
