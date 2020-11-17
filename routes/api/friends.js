var express = require('express')
var router = express.Router();
var database = require('../../includes/database')


router.get('/', (req, res) => {
    var sql = 'SELECT * FROM relations WHERE status="1" AND (uuida="'+req.user.id+'" OR uuidb="'+req.user.id+'")'
    database.connection.query(sql, (err, result) => {
        if (err) throw err

        var jsonarray = []

        for (let i = 0; i < result.length; i++) {
            if(result[i].uuida != req.user.id)
            {
                jsonarray.push(result[i].uuida)
            }
            else
            {
                jsonarray.push(result[i].uuidb)
            }
        }

        var json = JSON.parse(JSON.stringify(jsonarray))

        res.header('Access-Control-Allow-Origin', "http://localhost:3000").header('Access-Control-Allow-Credentials', true).status(200).json(json)
    })
})

module.exports = router