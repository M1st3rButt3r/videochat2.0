var express = require('express')
var router = express.Router();
var database = require('../../includes/database')
var url = require('url');

router.get('/', (req, res) => {
    //parse uuid
    var uuid = url.parse(req.url, true).query.uuid;
    if(!uuid) {
        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
        return
    }

    //Delete relation
    var sql = 'DELETE FROM relations WHERE (uuida="'+req.user.id+'" AND uuidb="'+uuid+'") OR (uuidb="'+req.user.id+'" AND uuida="'+uuid+'")'
    database.connection.query(sql, (err, result) => {
        if(err) throw err

        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
    })
})

module.exports = router