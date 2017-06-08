var moment = require('moment')

function timestamper(req, res) {
    var result= {"unix": null, "natural": null}
    
    // try parsing different formats then send result
    var tmp = moment.unix(req.params.ts)
    if(!tmp.isValid()) {
      tmp = moment(req.params.ts, ["MM-DD-YYYY", "YYYY-MM-DD", "MMMM DD, YYYY"])
    }
    if(tmp.isValid()) {
      result["unix"] = tmp.unix()
      result["natural"] = tmp.format("MMMM DD, YYYY")
    }
    // send result
    res.json(result)
}

module.exports = {
  timestamper: timestamper
}