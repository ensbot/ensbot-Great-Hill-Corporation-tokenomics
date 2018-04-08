require('dotenv').config();
const fs = require('fs');
const csv = require('csv');
const util = require('util');
const csvParse = util.promisify(csv.parse);
const readFile = util.promisify(fs.readFile);

const config = {
  flatFilePath: '../../monitors/etherTip_data_edited.txt',
  // how many lines from our flat file should we seed?
  // we want our tests to be fast, so let's only load 10 lines.
  seedLength: {
    development: 5000,
    testing: 10
  }
}

exports.seed = function(knex, Promise) {
  return knex('transaction').del().then(() => {
    // STEP 1: READ IN FLAT FILE
    const readFlatFileAndParse = (filePath) => {
      return readFile(config.flatFilePath).then((res) => {
        return csvParse(res, {
          delimiter: '\t',
          relax: true,
          columns: true
        })
      }).then((rows) => {
        rows = rows.slice(0, config.seedLength[process.env.NODE_ENV]);
        let rowsWithParsedArticulation = rows.map((row) => {
          return csvParse(row.articulated, {
            delimiter: '|',
            relax: true,
            quote: false
          });
        });
        return Promise.all(rowsWithParsedArticulation).then((articulatedData) => {
          return rows.map((row, index) => {
            row.articulated = articulatedData[index][0];
            return row;
          });
        });
      });
    };
    return readFlatFileAndParse(config.flatFilePath);
  }).then((res) => {
    // At this point, the res object looks like the following:
    // [
    //   {
    //     monitor_address: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
    //     blocknumber: '1079183',
    //     transactionindex: '2',
    //     traceid: '1',
    //     from: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
    //     to: '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7',
    //     timestamp: '1456769111',
    //     value: '0',
    //     gasused: '27463',
    //     gasprice: '50000000000',
    //     is_trace: '1',
    //     is_error: '0',
    //     encoding: '0x79c65068',
    //     articulated: ['mintToken', '0x120a270bbc009644e35f0bb6ab13f95b8199c4ad', '1']
    //   }, {
    //     monitor_address: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
    //     blocknumber: '1097821',
    //     transactionindex: '4',
    //     traceid: '0',
    //     from: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb',
    //     to: '0x15c817923774384362de9a3942287088087bf427',
    //     ...
    //   }
    // ]
    
    let query = {
      blockInsertions: null,
      addressInsertions: null,
      txInsertions: null,
      monitorTxInsertions: null
    };

    let reduced = res.reduce((acc, cur) => {
      acc.blockNumbers.push(cur.blocknumber);
      acc.addresses.push(cur.to, cur.from, cur.monitor_address);
      acc.blockTimestamps[cur.blocknumber] = cur.timestamp;
      return acc;
    }, {
      blockNumbers: [],
      blockTimestamps: [],
      addresses: []
    });
    // unique block numbers and addresses
    reduced.blockNumbers = [...new Set(reduced.blockNumbers)].filter(blockNum => blockNum > 0);
    reduced.addresses = [...new Set(reduced.addresses)];

    const blockInsertions = reduced.blockNumbers.map((blockNo) => {
      return `(${blockNo}, ${reduced.blockTimestamps[blockNo]})`;
    }).join(',');

    query.blockInsertions = knex.raw(`
      INSERT INTO block (block_number, timestamp)
         VALUES ${blockInsertions}
        ON DUPLICATE KEY UPDATE block_number=block_number;
        `);

    const addressInsertions = reduced.addresses.map((address) => {
      return `(UNHEX("${address.substring(2)}"))`;
    }).join(',');

    query.addressInsertions = knex.raw(`
      INSERT INTO address (address)
       VALUES ${addressInsertions}
       ON DUPLICATE KEY UPDATE address=address;
       `);

    const txInsertions = res.map((tx) => {
      return `(
        ${tx.blocknumber},
        ${tx.transactionindex},
        ${tx.traceid},
        UNHEX('${tx.to.substring(2)}'),
        UNHEX('${tx.from.substring(2)}'),
        ${tx.value},
        ${tx.gasused},
        ${tx.gasprice},
        ${tx.is_error},
        UNHEX('${tx.encoding.substring(2)}'),
        '${JSON.stringify(tx.articulated).replace(/\'/gi, '\\\'').replace(/\\"/gi, '\\\\\"')}'
      )`
    }).join(',');

    query.txInsertions = knex.raw(`
        INSERT INTO transaction (block_number, tx_index, trace_id, from_address, to_address, value_wei, gas_used, gas_price, is_error, abi_encoding, input_articulated)
         VALUES ${txInsertions}
         ON DUPLICATE KEY UPDATE block_number=block_number;
      `);

    const monitorTxInsertions = res
    // .filter((tx) => { // uncomment if you want to save space but make querying a disaster
    //   return tx.monitor_address != tx.to && monitor_address != tx.from;
    // })
      .map((tx) => {
      return `(UNHEX('${tx.monitor_address.substring(2)}'), ${tx.blocknumber}, ${tx.transactionindex}, ${tx.traceid})`;
    });

    query.monitorTxInsertions = knex.raw(`
      INSERT INTO monitor_transaction (address, block_number, tx_index, trace_id)
       VALUES ${monitorTxInsertions}
       ON DUPLICATE KEY UPDATE block_number=block_number;
    `);

    return Promise.all([query.blockInsertions, query.addressInsertions, query.txInsertions]).then((res) => {
      return Promise.all([
        // Do this later because it requires the presence of foreign key values introduced above.
        query.monitorTxInsertions]);
    });
  }).catch(e => {
    return console.log(e)
  });
};
