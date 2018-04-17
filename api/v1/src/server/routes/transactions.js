const express = require('express');
const router = express.Router();
const knex = require('../db/connection');
const authHelpers = require('../auth/_helpers');

const selectCols = [
  'mt.monitorAddress AS monitorAddress',
  'b.timeStamp AS blockTimeStamp',
  't.blockNumber AS blockNumber',
  't.transID AS transID',
  't.traceID AS traceID',
  't.fromAddress AS fromAddress',
  't.toAddress AS toAddress',
  't.valueWei',
  't.gasUsed',
  't.gasPrice',
  't.isError',
  't.articulated'
]

router.get('/monitor/:monitorAddress', (req, res, next) => {
  knex('transaction AS t').select(selectCols)
    .join('monitor_transaction AS mt', function() {
      this.on('t.blockNumber', '=', 'mt.blockNumber')
      .andOn('t.transID', '=', 'mt.transID')
      .andOn('t.traceID', '=', 'mt.traceID')
    })
    .join('block AS b', 't.blockNumber', 'b.blockNumber')
    .whereRaw(`mt.monitorAddress = '${req.params.monitorAddress}'`)
    .then((transactions) => {
      res.status(200).json({status: 'success', data: transactions});
    }).catch((err) => {
      res.status(500).json({status: 'error', data: err});
    });
})

router.get('/summaries/byWeek/:monitorAddress', (req, res, next) => {
  knex('transaction AS t').select(selectCols)
    .join('monitor_transaction AS mt', function() {
      this.on('t.blockNumber', '=', 'mt.blockNumber')
      .andOn('t.transID', '=', 'mt.transID')
      .andOn('t.traceID', '=', 'mt.traceID')
    })
    .join('block AS b', 't.blockNumber', 'b.blockNumber')
    .whereRaw(`mt.monitorAddress = '${req.params.monitorAddress}'`)
    .then((transactions) => {
      res.status(200).json({status: 'success', data: transactions});
    }).catch((err) => {
      res.status(500).json({status: 'error', data: err});
    });
})

router.get('/', (req, res, next) => {
  knex('transaction').select('*').then((transactions) => {
    res.status(200).json({status: 'success', data: transactions});
  }).catch((err) => {
    res.status(500).json({status: 'error', data: err});
  });
});

// router.post('/',
//   authHelpers.ensureAuthenticated,
//   (req, res, next) => {
//   return knex.transaction((t) => {
//     const toInsert = req.body.map(obj => {
//       return {
//         dateTime: obj.dateTime,
//         blockNumber: obj.blockNumber,
//         transactionIndex: obj.transactionIndex,
//         from: obj.from,
//         to: obj.to,
//         value: obj.value,
//         gasCost: obj.gasCost,
//         isError: obj.isError,
//         isFinalized: obj.isFinalized,
//         articulated: obj.articulated
//       }
//     });
//     return Promise.all(toInsert.map((obj) => {
//       return t.insert(obj).into('transactions');
//     }));
//   }).then((transactions) => {
//     res.status(201).json({status: 'success', data: transactions});
//   }).catch((err) => {
//     res.status(500).json({status: 'error', data: err});
//   });
// });

module.exports = router;
