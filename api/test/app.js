const express = require("express");
const logger = require("morgan");
const https = require("https");
const app = express();
const db = require('./db');

app.use(logger("short"));
app.use('/api/test/nobel', require('./models/nobel').getAll);

// Connect to MySQL on start
db.connect(db.MODE_TEST, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})
