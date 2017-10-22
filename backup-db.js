var fs = require('fs');
const companyResource = require('./include/resource/company-resource.js');
const mentionResource = require('./include/resource/mention-resource.js');

exports.backup = () => {

  companyResource.getCompanies((data) => {
    fs.writeFile("mongo_dump_companies.txt", data, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("mongo_dump_companies.txt saved");
    });

    // var stream = fs.createWriteStream("mongo_dump_companies.txt");
    // stream.once('open', function(fd) {
    //   for (let i = 0; i < data.length; i++) {
    //     stream.write(data[i]);
    //     console.log(data[i]);
    //   }
    //   stream.end();
    // });
  });

  mentionResource.getMentions((data) => {
    fs.writeFile("mongo_dump_mentions.txt", data, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("mongo_dump_mentions.txt saved");
    });
    // var stream = fs.createWriteStream("mongo_dump_mentions.txt");
    // stream.once('open', function(fd) {
    //   for (let i = 0; i < data.length; i++) {
    //     stream.write(data[i]);
    //     console.log(data[i]);
    //   }
    //   stream.end();
    // });
  });
}
