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
      return Promise.all(articulated).then((articulated) => {
        return json.map((a, index) => {
          a.articulated = articulated[index][0];
          return a;
        })
      });
    })
  }).then((res) => {
    res = res.slice(0, 10);
    let reduceObj = res.reduce((acc, cur) => {
      cur.blocknumber != ''
        ? acc.blockNumbers.push(cur.blocknumber)
        : null;
      acc.blockTimestamps[cur.blocknumber] = cur.timestamp;
      acc.addresses.push(cur.to, cur.from, cur.monitor_address);
      return acc;
    }, {
      blockNumbers: [],
      blockTimestamps: [],
      addresses: []
    });
    reduceObj.blockNumbers = [...new Set(reduceObj.blockNumbers)].filter(blockNum => blockNum > 0);
    reduceObj.addresses = [...new Set(reduceObj.addresses)];
    const blockInsertions = reduceObj.blockNumbers.map((blockNo) => {
      return `(${blockNo}, ${reduceObj.blockTimestamps[blockNo]})`;
    }).join(',');
    const addressInsertions = reduceObj.addresses.map((address) => {
      return `(UNHEX("${address.substring(2)}"))`;
    }).join(',');
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
    const monitorTxInsertions = res.filter((tx) => {
      //return tx.monitor_address != tx.to && monitor_address != tx.from;
      return true;
    }).map((tx) => {
      return `(UNHEX('${tx.monitor_address.substring(2)}'), ${tx.blocknumber}, ${tx.transactionindex}, ${tx.traceid})`;
    });
    const query = {
      blockInsertion: knex.raw(`
        INSERT INTO block (block_number, timestamp)
           VALUES ${blockInsertions}
          ON DUPLICATE KEY UPDATE block_number=block_number;
          `),
      addressInsertion: knex.raw(`
        INSERT INTO address (address)
         VALUES ${addressInsertions}
         ON DUPLICATE KEY UPDATE address=address;
         `),
      txInsertion: knex.raw(`
        INSERT INTO transaction (block_number, tx_index, trace_id, from_address, to_address, value_wei, gas_used, gas_price, is_error, abi_encoding, input_articulated)
         VALUES ${txInsertions}
         ON DUPLICATE KEY UPDATE block_number=block_number;
      `),
      monitorTxInsertion: knex.raw(`
        INSERT INTO monitor_transaction (address, block_number, tx_index, trace_id)
         VALUES ${monitorTxInsertions}
         ON DUPLICATE KEY UPDATE block_number=block_number;
      `)
    }
    return Promise.all([query.blockInsertion, query.addressInsertion, query.txInsertion]).then((res) => {
      return Promise.all([query.monitorTxInsertion]);
    });
  }).catch(e => {
    return console.log(e)
  });
};
