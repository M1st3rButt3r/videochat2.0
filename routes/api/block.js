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

    //check if user to block exists
    var sql = 'SELECT * FROM user WHERE uuid="'+uuid+'"'
    database.connection.query(sql, (err, result) => {
        if(err) throw err

        if(result.length < 1) {
            res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
            return
        } else {
            //check if already blocked
            var sql = 'SELECT * FROM blocks WHERE uuida="'+req.user.id+'" AND uuidb="'+uuid+'"'
            database.connection.query(sql, (err, result) => {
                if(err) throw err

                if(result.length < 1) {
                    //check if friends and delete relation
                    var sql = 'SELECT * FROM relations WHERE (uuida="'+req.user.id+'" AND uuidb="'+uuid+'") OR (uuidb="'+req.user.id+'" AND uuida="'+uuid+'")'
                    database.connection.query(sql, (err, result) => {
                        if(err) throw err
                        if(result.length >= 1) {
                            //Delete relation
                            var sql = 'DELETE FROM relations WHERE (uuida="'+req.user.id+'" AND uuidb="'+uuid+'") OR (uuidb="'+req.user.id+'" AND uuida="'+uuid+'")'
                            database.connection.query(sql, (err, result) => {
                                if(err) throw err
                            })
                        }
                    })

                    //create block
                    var sql = 'INSERT INTO blocks (uuida, uuidb) VALUES ("'+req.user.id+'", "'+uuid+'")'
                    database.connection.query(sql, (err, result) => {
                        if(err) throw err
                        
                        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
                        return
                    })
                } else {
                    res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
                    return
                }
            })
        }
    })
})

module.exports = router