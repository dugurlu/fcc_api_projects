'use strict';

var useragent = require('express-useragent')

function parser(req, res) {
    let ip = req.ip
    let language = req.headers["accept-language"]
    let uaHeader = req.get("User-Agent")
    let ua = useragent.parse(uaHeader)
    
    // send result
    res.json({ip: ip, language: req.locale.toString(), software: ua.os})
}

module.exports = {
  parser: parser
}