const express = require('express');
const router = express.Router();
const knex = require('../db/connection');

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

module.exports = router;
