const express = require('express');
const router = express.Router();

const knex = require('../db/connection');

router.get('/', (req, res, next) => {
  knex('transactions').select('*').then((transactions) => {
    res.status(200).json({status: 'success', data: transactions});
  }).catch((err) => {
    res.status(500).json({status: 'error', data: err});
  });
});

router.post('/', (req, res, next) => {
  knex('transactions').insert({
    dateTime: req.body.dateTime,
    blockNumber: req.body.blockNumber,
    transactionIndex: req.body.transactionIndex,
    from: req.body.from,
    to: req.body.to,
    value: req.body.value,
    gasCost: req.body.gasCost,
    isError: req.body.isError,
    isFinalized: req.body.isFinalized,
    articulated: req.body.articulated
  }).then((transaction) => {
    res.status(201).json({status: 'success', data: transaction});
  }).catch((err) => {
    res.status(500).json({status: 'error', data: err});
  });
});

module.exports = router;
