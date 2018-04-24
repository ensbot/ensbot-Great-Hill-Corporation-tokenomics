require('dotenv').config();
const fs = require('fs');
const csv = require('csv');
const util = require('util');
const csvParse = util.promisify(csv.parse);
const readFile = util.promisify(fs.readFile);

const config = {
  flatFilePath: './src/server/db/seeds/exportedMonitorData.sql',
}

exports.seed = function(knex, Promise) {
  //   return readFile(config.flatFilePath)
  //     .then((sql) => {
  //
  //       return knex.raw(sql.toString());
  //     }).then((knexStatement) => {
  //       return Promise.all([knexStatement])
  //     }
  //     )
  //   .catch(e => {
  //   return console.log(e)
  // });
};
