"use strict";

const express = require('express')
const resource = require('express-resource');
const mongoose = require('mongoose');

// resources
const companyResource = require('./include/resource/company-resource.js');
const mentionResource = require('./include/resource/mention-resource.js');

const lookup = require('./include/mention-lookup.js');

const LISTEN_PORT = 3001;

/**
 * DB SETUP
 */
mongoose.connection.on('error', console.error.bind(console, 'ERROR (mongo):'));
mongoose.connect('mongodb://localhost/todomvc', () => {
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
app.resource('company', companyResource);
app.resource('mention', mentionResource);
// companyResource.setupRoutes("/company", app);

// start api collection
lookup.start();

/**
 * SERVE
 */
app.listen(LISTEN_PORT, () => {
  console.log(`INFO: API server listening on port ${LISTEN_PORT}`)
})
