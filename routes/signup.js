const express = require('express')
const router = express.Router();
const database = require('../includes/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    if(req.user)
    {
        res.redirect('/')
        return 
    }
    res.render('signup.ejs')
    return 
})

//handle post requests to directory /signup
router.post('/', async (req, res) => {

    //if logged in redirect
    if(req.user)
    {
        res.redirect('/')
        return 
    }

    //check if password and password repeat are equal
    if(req.body.password !== req.body.passwordrepeat) {
        res.redirect('/signup');
        return;
    }
    //check if password is long enough
    else if(req.body.password.length < 8) {
        res.redirect('/signup');
        return
    }

    //generate the tag
    var tag = 0;

    var sql = 'SELECT * FROM user WHERE name="'+req.body.name+'"'
    database.connection.query(sql, (err, result) => {
        if(err) throw err
        else 
        {
            tag = result.length

            if(tag > 8999)
            {
                res.redirect('/signup')
                return;
                
            }
            else
            {
                tag = tag + 1000
                tag = tag.toString()
            }
        }
    })
    
    //pass the user into the database
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        var sql = 'INSERT INTO user (name, tag, password) VALUES ("'+req.body.name+'","'+tag+'","'+hashedPassword+'")'
        database.connection.query(sql, function(err, result) {
            if(err) throw err
        })
    } catch(err) {
        if(err) throw err
        res.redirect('/signup')
    }

    var sql = 'SELECT uuid FROM user WHERE name="'+req.body.name+'" AND tag="'+tag+'"'
    database.connection.query(sql, (err, result) => {
        if(err) throw err
        
        //set cookie and redirect
        const user = { id: result[0].uuid}
        const accessToken = jwt.sign(user, process.env.AUTHORIZATION_TOKEN)
        res.cookie('token', accessToken)
        res.redirect('/')
        return
    })
})

module.exports = router