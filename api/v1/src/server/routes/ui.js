const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const _ = require('lodash');

router.get('/monitor-groups', (req, res, next) => {
  knex('monitor_group AS mg')
    .select(['mg.nickname AS groupName', 'm.monitorAddress', 'm.nickname AS monitorName', 'm.firstBlock'])
    .join('monitor_monitor_group AS mmg', 'mg.monitorGroupID', 'mmg.monitorGroupID')
    .join('monitor AS m', 'mmg.monitorAddress', 'm.monitorAddress')
  .then((monitors) => {
    let monitorGroups = _.groupBy(monitors, 'groupName');
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
