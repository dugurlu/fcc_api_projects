'use strict';
var express = require('express')
var router = express.Router()
var mongodb = require('mongodb')
var assert = require('assert')
var validate = require('validate.js')
// validate.js provides a validate(attributes, constraints,[options])
// this validates 'attributes' against 'constraints'

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/url_shortener'
var db
var collection

MongoClient.connect(url, (err, dbConnection) => {
    assert.equal(null, err)
    console.log('connected to server')
    db = dbConnection
    collection = db.collection('urls')
})


router.get('/new/:url*', add)

router.get('/new', (req, res) => {
    res.json({error: 'specify a URL, e.g. /new/http://foo.bar'})
})

router.get('/:url*', get)

router.get('/', (req, res) => {
    res.json({error: 'specify a URL, e.g. /http://foo.bar'})
})

// retrieve a full url from a shortened string
function get(req, res) {
    collection.findOne({'short_url': req.params.url}, (err, result) => {
        assert.equal(null, err)
        // console.log('Redirecting to', result.original_url)
        res.redirect(result.original_url)
    })
}

function add(req, res) {
    let url = req.url.slice(5)
    
    let validationResult = validate({url: url}, {
        url: {
            url: {
                schemes: ['http', 'https'],
                allowLocal: true,
            }
        }
    })
    
    let result = {}
    // validate() returns nothing if validation succeeds. if validation fails, errors are returned
    if(validationResult) {
        result = {error: validationResult.url[0] + ': ' + url}
    } else {
        let appUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
        let urlKey = Math.random().toString(36).slice(2)
        let target = appUrl + '/' + urlKey
        
        result = {original_url: url, short_url: target}
        
        collection.insert({original_url: url, short_url: urlKey})
    }
    res.json(result)
}


module.exports = router