const fetch = require("node-fetch");
const companyResource = require("./company-resource");
const utils = require("../utils.js");

const DEBUG = true;

const Company = companyResource.Company;

// ** TESTING DATA **
exports.populate = () => {
    utils.logInfo("Checking if company must be populated");
    // Company.deleteMany({}, () => {}); // WIPE DATABASE
    Company.count({}, (err, size) => {
        if (size === 0) {
            utils.logInfo("Populating companies");
            if (DEBUG) {
                let testCompany1 = new Company({"name": "United Airlines"});
                let testCompany2 = new Company({"name": "Google"});
                let testCompany3 = new Company({"name": "Facebook"});
                let testCompany4 = new Company({"name": "Intel"});
                testCompany1.save();
                testCompany2.save();
                testCompany3.save();
                testCompany4.save();
            } else {
                // TODO????
            }
        }
    });

    // print initally
    // Company.find((err, companies) => {
    //     utils.logInfo("companies:", companies);
    // });
}
