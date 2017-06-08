var express = require('express')
var app = express()
var createLocaleMiddleware = require('express-locale')

var ts = require('./timestamp/timestamper')
var header = require('./header/header-parser')
var shorten = require('./shortener/url-shortener')

app.use(createLocaleMiddleware())

app.use("/timestamp", express.static('timestamp/public'))
app.use("/timestamp/:ts", ts.timestamper)
app.route("/header").get(header.parser)
app.use("/shorten", shorten)

app.listen(process.env.PORT, function () {
  console.log('listening on', process.env.PORT)
})