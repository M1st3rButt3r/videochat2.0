require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

//define routes
const signin = require('./routes/signin')
const signup = require('./routes/signup')
const index = require('./routes/index')
const logout = require('./routes/logout')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next)
{
    if(!req.cookies.token)
    {
        req.user = null
        next()
        return
    }
    jwt.verify(req.cookies.token, process.env.AUTHORIZATION_TOKEN, (err, user) =>{
        if(err){
            req.user = null
            next()
            return
        }
        req.user = user
        next()
        return
    })
})

app.use('/signin', signin)
app.use('/signup', signup)
app.use('/logout', logout)
app.use('/', index)
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.listen(3000)