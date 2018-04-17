// there are 4 steps to this seed process:
//   1. Read in flat file and parse it.
//   2. Make unique lists of addresses and block numbers.
//   3. Wrangle the data into SQL insertion queries.
//   4. Run the SQL.

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
    test: 10
  }
}

exports.seed = function(knex, Promise) {
  return knex('transaction').del().then(() => {
    // 1. Read in flat file and parse it.
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
    /*
    [
      {
        monitorAddress: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
        blockNumber: '1079183',
        transactionindex: '2',
        traceid: '1',
        from: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
        to: '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7',
        timeStamp: '1456769111',
        value: '0',
        gasused: '27463',
        gasprice: '50000000000',
        is_trace: '1',
        is_error: '0',
        encoding: '0x79c65068',
        articulated: ['mintToken', '0x120a270bbc009644e35f0bb6ab13f95b8199c4ad', '1']
      }, {
        monitorAddress: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359',
        blockNumber: '1097821',
        transactionindex: '4',
        traceid: '0',
        from: '0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb',
        to: '0x15c817923774384362de9a3942287088087bf427',
        ...
      }
    ]
    */
    const seedDb = (res) => {
      // 2. Make unique lists of block numbers.
      let reduced = res.reduce((acc, cur) => {
        acc.blockNumbers.push(cur.blockNumber);
        acc.blockTimestamps[cur.blockNumber] = cur.timeStamp;
        return acc;
      }, {
        blockNumbers: [],
        blockTimestamps: []
      });
      // unique block numbers and addresses:
      reduced.blockNumbers = [...new Set(reduced.blockNumbers)].filter(blockNum => blockNum > 0);

      // 3. Wrangle the data into SQL insertion queries.
      let query = {
        blockInsertions: undefined,
        txInsertions: undefined,
        monitorTxInsertions: undefined
      };

      const blockInsertions = reduced.blockNumbers.map((blockNo) => {
        return `(${blockNo}, ${reduced.blockTimestamps[blockNo]})`;
      }).join(',');

      query.blockInsertions = knex.raw(`
        INSERT INTO block (blockNumber, timeStamp)
           VALUES ${blockInsertions}
          ON DUPLICATE KEY UPDATE blockNumber=blockNumber;
          `);

      const txInsertions = res.map((tx) => {
        return `(
          ${tx.blockNumber},
          ${tx.transactionindex},
          ${tx.traceid},
          '${tx.to}',
          '${tx.from}',
          ${tx.value},
          ${tx.gasused},
          ${tx.gasprice},
          ${tx.is_error},
          '${tx.encoding}',
          '${JSON.stringify(tx.articulated).replace(/\'/gi, '\\\'').replace(/\\"/gi, '\\\\\"')}'
        )`
      }).join(',');

      query.txInsertions = knex.raw(`
          INSERT INTO transaction (blockNumber, transID, traceID, fromAddress, toAddress, valueWei, gasUsed, gasPrice, isError, encoding, articulated)
           VALUES ${txInsertions}
           ON DUPLICATE KEY UPDATE blockNumber=blockNumber;
        `);

      const monitorTxInsertions = res.map((tx) => {
        return `('${tx.monitorAddress}', ${tx.blockNumber}, ${tx.transactionindex}, ${tx.traceid})`;
      });

      query.monitorTxInsertions = knex.raw(`
        INSERT INTO monitor_transaction (monitorAddress, blockNumber, transID, traceID)
         VALUES ${monitorTxInsertions}
         ON DUPLICATE KEY UPDATE blockNumber=blockNumber;
      `);

      // 4. Run the SQL.
      return Promise.all([query.blockInsertions, query.txInsertions]).then((res) => {
        return Promise.all([// Do this later because it requires the presence of foreign key values introduced above.
          query.monitorTxInsertions]);
      });
    }

    return seedDb(res).then(() => {
      const fakeRes = res.slice(0, 400).map((tx) => {
        tx.monitorAddress = '0x99ea4db9ee77acd40b119bd1dc4e33e1c070b80d';
        return tx;
      });
      return seedDb(fakeRes);
    });
  }).catch(e => {
    return console.log(e)
  });
};
