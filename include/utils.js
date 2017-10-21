"use strict";

exports.handleError = (err, res, ecode, extra) => {
  if (ecode == undefined) {
    ecode = 500;
  }

  if (err) {
    console.error("ERROR (request): " + err);
    console.log(extra);
    res.status(ecode).send({"error": err});
  }
}

exports.logInfo = (info, extra) => {
  console.error("INFO (server): " + info);
  console.log(extra);
}

exports.logError = (err, extra) => {
  console.error("ERROR (server): " + err);
  console.log(extra);
}
