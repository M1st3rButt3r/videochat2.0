var express = require('express')
var router = express.Router();
var database = require('../../includes/database')

router.get('/', (req, res) => {
    var sql = 'SELECT * FROM relations WHERE status="0" AND uuidb="'+req.user.id+'"'
    database.connection.query(sql, (err, result) => {
        if (err) throw err

        var jsonarray = []

        for (let i = 0; i < result.length; i++) {
            jsonarray.push(result[i].uuida)
        }

        var json = JSON.parse(JSON.stringify(jsonarray))

        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).status(200).json(json)
    })
})

module.exports = router