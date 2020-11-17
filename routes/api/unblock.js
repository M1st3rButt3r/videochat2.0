var express = require('express')
var router = express.Router();
var database = require('../../includes/database')
var url = require('url');

router.get('/', (req, res) => {
    //parse uuid
    var uuid = url.parse(req.url, true).query.uuid;
    if(!uuid) {
        res.sendStatus(404)
        return
    }
    //delete block
    var sql = 'DELETE FROM blocks WHERE uuida="'+req.user.id+'" AND uuidb="'+uuid+'"'
    database.connection.query(sql, (err) => {
        if(err) throw err
                        
        res.sendStatus(200)
    })
})

module.exports = router