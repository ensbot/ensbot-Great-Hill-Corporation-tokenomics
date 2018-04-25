const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const _ = require('lodash');

/* using a temporary hack while monitor_transaction remains
   source of truth for monitor addresses.
   once monitor is populated by QB, the query will look
   something like the following. */

// router.get('/monitor-groups', (req, res, next) => {
//   knex('monitor_group AS mg')
//     .select(['mg.nickname AS groupName', 'm.monitorAddress', 'm.nickname AS monitorName', 'm.firstBlock'])
//     .join('monitor_monitor_group AS mmg', 'mg.monitorGroupID', 'mmg.monitorGroupID')
//     .join('monitor AS m', 'mmg.monitorAddress', 'm.monitorAddress')
//   .then((monitors) => {
//     let monitorGroups = _.groupBy(monitors, 'groupName');
//     res.status(200).json({status: 'success', data: {
//         monitorGroups: monitorGroups
//       }});
//     }).catch((err) => {
//       res.status(500).json({status: 'error', data: err});
//     });
// });

/* temporary hack */

router.get('/monitor-groups', (req, res, next) => {
  knex('monitor_transaction AS mt')
    .distinct('mt.monitorAddress')
    .select(['mg.nickname AS groupName', 'mt.monitorAddress', 'm.nickname AS monitorName', 'm.firstBlock'])
    .leftJoin('monitor AS m', 'mt.monitorAddress', 'm.monitorAddress')
    .leftJoin('monitor_monitor_group AS mmg', 'm.monitorAddress', 'mmg.monitorAddress')
    .leftJoin('monitor_group AS mg', 'mg.monitorGroupID', 'mmg.monitorGroupID')
  .then((monitors) => {
    let monitorGroups = _(monitors)
      .groupBy(monitor => monitor.groupName)
      .map((val, key) => ({groupName: key, addresses: val}))
      .value();
    res.status(200).json({status: 'success', data: {
        monitorGroups: monitorGroups
      }});
    }).catch((err) => {
      res.status(500).json({status: 'error', data: err});
    });
});

router.get('/', (req, res, next) => {
  knex('monitor_transaction AS mt')
    .distinct('monitorAddress')
    .select()
  .then((monitorAddresses) => {
    res.status(200).json({status: 'success', data: {
      monitorAddresses: monitorAddresses.map(row => row.monitorAddress)
    }});
  }).catch((err) => {
    res.status(500).json({status: 'error', data: err});
  });
});

// knex('transaction AS t').select(selectCols)
//   .join('monitor_transaction AS mt', function() {
//     this.on('t.blockNumber', '=', 'mt.blockNumber')
//     .andOn('t.transID', '=', 'mt.transID')
//     .andOn('t.traceID', '=', 'mt.traceID')
//   })



module.exports = router;
