const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../auth/_helpers');

router.get('/', (req, res, next) => {
  knex('transactions').select('*').then((transactions) => {
    res.status(200).json({status: 'success', data: transactions});
  }).catch((err) => {
    res.status(500).json({status: 'error', data: err});
  });
});

router.post('/',
  authHelpers.ensureAuthenticated,
  (req, res, next) => {
  return knex.transaction((t) => {
    const toInsert = req.body.map(obj => {
      return {
        dateTime: obj.dateTime,
        blockNumber: obj.blockNumber,
        transactionIndex: obj.transactionIndex,
        from: obj.from,
        to: obj.to,
        value: obj.value,
        gasCost: obj.gasCost,
        isError: obj.isError,
        isFinalized: obj.isFinalized,
        articulated: obj.articulated
      }
    });
    return Promise.all(toInsert.map((obj) => {
      return t.insert(obj).into('transactions');
    }));
  }).then((transactions) => {
    res.status(201).json({status: 'success', data: transactions});
  }).catch((err) => {
    res.status(500).json({status: 'error', data: err});
  });
});

module.exports = router;
