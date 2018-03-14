const express = require('express');
const router = express.Router();

const knex = require('../db/connection');

router.get('/', (req, res, next) => {
  knex('transactions').select('*')
  .then((transactions) => {
    res.status(200).json({
      status: 'success',
      data: transactions
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      data: err
    });
  });
});

module.exports = router;
