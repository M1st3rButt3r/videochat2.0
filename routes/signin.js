var express = require('express')
var router = express.Router();
var database = require('../includes/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    if(req.user)
    {
        res.redirect('/')
        return 
    }
    res.render('signin.ejs')
    return 
})

router.post('/', (req, res) => {
    
    //if logged in redirect
    if(req.user)
    {
        res.redirect('/')
        return 
    }

     //check if tag and name are given
     const namearray = req.body.name.split('#')
     if(namearray.length != 2)
     {
         res.redirect('/signin')
         return
     }
 
     //check if user exists
     var sql = 'SELECT password, uuid FROM user WHERE name="'+namearray[0]+'" AND tag="'+namearray[1]+'"'
     database.connection.query(sql, (err, result) => {
         if(err) throw err
         if(result.length <= 0)
         {
             res.redirect('/signin')
             return
         }
 
         //check if password is right
         bcrypt.compare(req.body.password, result[0].password, (err, authenticated) =>{
             if(!authenticated)
             {
                 res.redirect('/signin')
                 return
             }
 
             //set cookie and redirect
             const user = { id: result[0].uuid}
             const accessToken = jwt.sign(user, process.env.AUTHORIZATION_TOKEN)
             res.cookie('token', accessToken)
             res.cookie('uuid', result[0].uuid)
             res.redirect('/')
             return
         })
     })
})

module.exports = router