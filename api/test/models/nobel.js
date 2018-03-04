const db = require('../db')

exports.getAll = function(req, res) {
  db.get().query('SELECT * FROM nobel', function (err, rows) {
    if (err) res.json(err);
    res.json(rows);
  })
}

// exports.create = function(userId, text, done) {
//   var values = [userId, text, new Date().toISOString()]
//
//   db.get().query('INSERT INTO comments (user_id, text, date) VALUES(?, ?, ?)', values, function(err, result) {
//     if (err) return done(err)
//     done(null, result.insertId)
//   })
// }
//
// exports.getAllByUser = function(userId, done) {
//   db.get().query('SELECT * FROM comments WHERE user_id = ?', userId, function (err, rows) {
//     if (err) return done(err)
//     done(null, rows)
//   })
// }
