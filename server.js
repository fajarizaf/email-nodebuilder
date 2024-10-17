const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const sequelize = require('./models/').sequelize
const jwt = require('jsonwebtoken')
var Handlebars = require('handlebars');
const cors = require('cors')

const env = process.env.NODE_ENV || 'local';
const config = require(__dirname + '/config/config.json')[env];

// call controllers
const log = require("./controllers/email-log")

app.use(express.static('emails'))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors({
  credentials: true,
  origin: [config.url_frond_local, config.url_frond_local_2, config.url_frond_staging]
}))


const captureLog = (req, res, next) => {

  if (req.path == '/email/send') {
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks = [];

    res.write = (...restArgs) => {
      chunks.push(new Buffer(restArgs[0]));
      defaultWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {

      if (restArgs[0]) {
        chunks.push(new Buffer(restArgs[0]));
      }

      const body = Buffer.concat(chunks).toString('utf8');

      // save to db userlog
      // log activity
      log.createLogs(
        req.body.send_to,
        req.body.action,
        req,
        body
      )

      defaultEnd.apply(res, restArgs);
    };
  }
  next();

};


app.use(captureLog)

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});


require('./routes/email')(app)

const mysql = require('mysql2/promise');

mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password
}).then((connection) => {
  connection.query('CREATE DATABASE IF NOT EXISTS `node-email`;').then(() => {
    // Safe to use sequelize now
  })
})

sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('Server udah running sekarang')
    })
  })
  .catch(() => {
    console.log("Ada yang salah pada saat proses sync()")
  })
