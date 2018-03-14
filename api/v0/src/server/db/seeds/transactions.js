const fs = require('fs');
const csv = require('csv');
const util = require('util');
const csvParse = util.promisify(csv.parse);
const readFile = util.promisify(fs.readFile);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
 return knex('transactions').del()
   .then(() => {
     return readFile('../../monitors/etherTip_data.txt')
       .then((res) => {
        return csvParse(res, {delimiter: '\t',
                       relax: true,
                       columns: true})
        })
    }).then((res) => {
      const dataToInsert = res.map((row) => {
        return {
          dateTime: row.DATESH + ' ' + row.TIME.slice(0, -4),
          blockNumber: row.BLOCKNUMBER,
          transactionIndex: row.TRANSACTIONINDEX,
          from: row.FROM,
          to: row.TO,
          value: row.ETHER,
          gasCost: row.GASCOST,
          articulated: row.ARTICULATED
        }
      });
     return Promise.all([
       // Inserts seed entries
       knex('transactions').insert(dataToInsert),
     ])
   })
     .catch(e => {
       return console.log(e)
     });
};
