var express = require('express')
var router = express.Router();
var database = require('../../includes/database')
var url = require('url');

router.get('/', (req, res) => {
    //parse uuid
    var uuid = url.parse(req.url, true).query.uuid;
    var name = url.parse(req.url, true).query.name;
    var tag = url.parse(req.url, true).query.tag;
    if(!uuid && !name && !tag) {
        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
        return
    } else if(!uuid & name != null & tag != null) {
        getUuid(name, tag, res).then((uuid) => {
            requestFriend(uuid, req, res);
        })
    } else if(uuid) {
        requestFriend(uuid, req, res);
    } else {
        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
        return
    }
});

function requestFriend(uuid, req, res) {
    //check if you want to friend yourself
    if(uuid == req.user.id) {
        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
        return
    }
 
    //check if other user exists
    var sql = 'SELECT * FROM user WHERE uuid="'+uuid+'"'
    database.connection.query(sql, (err, result) => {
        if(err) throw err
        
        if(result.length <= 0) {
            //user does not exist
            res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
            return
        } else {

            //check if you are blocked
            var sql = 'SELECT * FROM blocks WHERE uuida="'+uuid+'" AND uuidb="'+req.user.id+'"'
            database.connection.query(sql, (err, result) => {
                if(err) throw err

                if(result.length > 0) {
                    //you are blocked
                    res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(404)
                    return
                } else {
                    var sql = 'SELECT * FROM relations WHERE ((uuida="'+req.user.id+'" AND uuidb="'+uuid+'") OR (uuidb="'+req.user.id+'" AND uuida="'+uuid+'")) AND status="1"'
                    database.connection.query(sql, (err, result) => {
                        if(err) throw err
        
                        if(result.length > 0) {
                            //friendship exists
                            res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
                            return
                        } else {
                            //check if you are blocking the other one and delete it
                            var sql = 'SELECT * FROM blocks WHERE (uuida="'+req.user.id+'" AND uuidb="'+uuid+'") OR (uuidb="'+req.user.id+'" AND uuida="'+uuid+'")'
                            database.connection.query(sql, (err, result) => {
                                if(err) throw err

                                if(result.length > 0) {
                                    //delete block
                                    var sql = 'DELETE FROM blocks WHERE (uuida="'+req.user.id+'" AND uuidb="'+uuid+'") OR (uuidb="'+req.user.id+'" AND uuida="'+uuid+'")'
                                    database.connection.query(sql, (err, result) => {
                                        if(err) throw err
                                    })
                                }
                            })

                            //check if you are requested and change it or insert request
                            var sql = 'SELECT * FROM relations WHERE (uuidb="'+req.user.id+'" AND uuida="'+uuid+'") AND status="0"'
                            database.connection.query(sql, (err, result) => {
                                if(err) throw err

                                if(result.length > 0) {
                                    //change relation
                                    var sql = 'UPDATE relations SET status = "1" WHERE (uuidb="'+req.user.id+'" AND uuida="'+uuid+'") AND status="0"'
                                    database.connection.query(sql, (err, result) => {
                                        if(err) throw err

                                        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
                                        return
                                    })
                                } else {
                                    //check if already request
                                    var sql = 'SELECT * FROM relations WHERE (uuida="'+req.user.id+'" AND uuidb="'+uuid+'") AND status="0"'
                                    database.connection.query(sql, (err, result) => {
                                        if(err) throw err
                                         if(result.length <= 0) {
                                            //insert request
                                            var sql = 'INSERT INTO relations (uuida, uuidb, status) VALUES ("'+req.user.id+'", "'+uuid+'", "0")'
                                            database.connection.query(sql, (err, result) => {
                                                if(err) throw err

                                                res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
                                                return
                                            });
                                        } else {
                                            res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).sendStatus(200)
                                            return
                                        }
                                    })
                                    
                                }
                            });
                        }
                    })
                }
            });
        }
    });
}

async function getUuid(name, tag, res) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT uuid FROM user WHERE name ="' + name + '" AND tag = "' + tag + '"';
        database.connection.query(sql, (err, result) => {
            if(err) throw err;
            if(result.length > 0) {
                resolve(result[0].uuid);
            } else {
                reject();
            }
        });
    });
}

module.exports = router