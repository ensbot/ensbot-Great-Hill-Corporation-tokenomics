const fs = require('fs');
const csv = require('csv');
const util = require('util');
const csvParse = util.promisify(csv.parse);
const readFile = util.promisify(fs.readFile);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('transaction').del().then(() => {
    return readFile('../../monitors/etherTip_data_edited.txt').then((res) => {
      return csvParse(res, {
        delimiter: '\t',
        relax: true,
        columns: true
      })
    }).then((json) => {
      let articulated = json.map((row) => {
        return csvParse(row.articulated, {
          delimiter: '|',
          relax: true,
          quote: false
        });
      });
      return Promise.all(articulated)
        .then((articulated) => {
          return json.map((a, index) => {
            a.articulated = articulated[index][0];
            return a;
          })
        });
    })
  }).then((res) => {
    //console.log(res);
    let reduceObj = res.reduce((acc, cur) => {
      cur.blocknumber != '' ? acc.blockNumbers.push(cur.blocknumber) : null;
      acc.blockTimestamps[cur.blocknumber] = cur.timestamp;
      acc.addresses.push(cur.to, cur.from, cur['monitor_address']);
      return acc;
    }, {blockNumbers: [], blockTimestamps: [], addresses: []});
    reduceObj.blockNumbers = [...new Set(reduceObj.blockNumbers)].filter(blockNum => blockNum > 0);
    reduceObj.addresses = [...new Set(reduceObj.addresses)];
    let insertBlocks = reduceObj.blockNumbers.map((blockNo) => {
      return `(${blockNo}, ${reduceObj.blockTimestamps[blockNo]})`;
    }).join(',');
    return Promise.all([knex.raw(`
      INSERT INTO block (block_number, timestamp) VALUES
        ${insertBlocks};`)]);

    // console.log(reduceObj);

    // const dataToInsert = res.slice(0, 10).map((row) => {
    //   return {
    //     dateTime: row.DATESH + ' ' + row.TIME.slice(0, -4),
    //     blockNumber: row.BLOCKNUMBER,
    //     transactionIndex: row.TRANSACTIONINDEX,
    //     from: row.FROM,
    //     to: row.TO,
    //     value: row.ETHER,
    //     gasCost: row.GASCOST,
    //     articulated: row.ARTICULATED
    //   }
    // });
    // return Promise.all([// Inserts seed entries
    //   knex('transactions').insert(dataToInsert)])

}).catch(e => {
    return console.log(e)
  });
};
