const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const _ = require('lodash');

router.get('/monitor-groups', (req, res, next) => {
  knex('monitor AS m')
    .select(['mg.monitorGroupName AS groupName', 'mg.monitorGroupID', 'm.monitorAddress', 'm.nickname AS monitorName', 'm.firstBlock'])
    .leftJoin('monitor_monitor_group AS mmg', 'm.monitorAddress', 'mmg.monitorAddress')
    .leftJoin('monitor_group AS mg', 'mg.monitorGroupID', 'mmg.monitorGroupID')
  .then((monitors) => {
    let monitorGroups = _(monitors)
      .groupBy(monitor => monitor.groupName)
      .map((val, key) => ({groupName: key, monitorGroupID: val[0].monitorGroupID, addresses: val}))
      .value();
    res.status(200).json({status: 'success', data: {
        monitorGroups: monitorGroups
      }});
    }).catch((err) => {
      res.status(500).json({status: 'error', data: err});
    });
});

module.exports = router;
