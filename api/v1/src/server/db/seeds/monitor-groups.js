require('dotenv').config();
const fs = require('fs');
const csv = require('csv');
const util = require('util');
const csvParse = util.promisify(csv.parse);
const readFile = util.promisify(fs.readFile);

const config = {
  flatFilePath: '../../data/monitors.json',
}

exports.seed = function(knex, Promise) {
  return knex('monitor').del().then(() => {
    return knex('monitor_group').del();
  }).then(() => {
    return knex('monitor_monitor_group').del()
  }).then(() => {
    const readFlatFileAndParse = (filePath) => {
      return readFile(config.flatFilePath)
        .then((res) => {
          return JSON.parse(res);
        })
        .then((res) => {
          // get addresses to lowercase
          return res.map((group) => {
            group.addresses = group.addresses.map((addressObj) => {
              addressObj.address = addressObj.address.toLowerCase();
              return addressObj;
            });
            return group;
          })
        });
      }
    return readFlatFileAndParse(config.flatFilePath)
  })
      .then((res) => {
    // At this point, the res object looks like the following:
    /*
    [
      {
        "name": "Address Handler",
        "addresses": [
          {
            "address": "0x25D94b021b69D9C01931Ff40Bd265CfC3D920f72", //except lowercase now
            "name": "Address Handle Service",
            "firstBlock": 5319337,
          },
          {
            "address": "0xFd495eeEd737b002Ea62Cf0534e7707a9656ba19", //except lowercase now
            "name": "AHS Owner",
            "firstBlock": 3719301,
          }
        ]
      },
      {
        "name": "Augur",
        "addresses": [
          {
            "address": "0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5", //except lowercase now
            "name": "REP-Augur-Old",
            "firstBlock": 2378196,
          },
          ...
        ]
      }
      ...
    ]
    */
    const seedDb = (res) => {
      let query = {
        monitorInsertions: undefined,
        monitorGroupInsertions: undefined,
        monitorMonitorGroupInsertions: undefined,
      };

      const monitorInsertions = res.map((group) => {
        return group.addresses.map((addressObj) => {
          return `('${addressObj.address}', '${addressObj.name}', ${addressObj.firstBlock})`;
        });
      }).join(',');

      query.monitorInsertions = knex.raw(`
        INSERT INTO monitor (monitorAddress, nickname, firstBlock)
           VALUES ${monitorInsertions}
          ON DUPLICATE KEY UPDATE nickname=nickname;
          `);

      const monitorGroupInsertions = res.map((group, index) => {
        return `(${index}, '${group.name}')`
      }).join(',');

      query.monitorGroupInsertions = knex.raw(`
        INSERT INTO monitor_group (monitorGroupID, nickname)
           VALUES ${monitorGroupInsertions}
          ON DUPLICATE KEY UPDATE monitorGroupID=monitorGroupID;
        `);

      const monitorMonitorGroupInsertions = res.map((group, index) => {
        return group.addresses.map((addressObj) => {
          return `(${index}, '${addressObj.address}')`
        });
      }).join(',');

      query.monitorMonitorGroupInsertions = knex.raw(`
        INSERT INTO monitor_monitor_group (monitorGroupID, monitorAddress)
           VALUES ${monitorMonitorGroupInsertions}
          ON DUPLICATE KEY UPDATE monitorGroupID=monitorGroupID;
          `);

      // 4. Run the SQL.
      return Promise.all([query.monitorInsertions, query.monitorGroupInsertions]).then((res) => {
        return Promise.all([// Do this later because it requires the presence of foreign key values introduced above.
          query.monitorMonitorGroupInsertions]);
      });
    }

    return seedDb(res);
  }).catch(e => {
    return console.log(e)
  });
};
