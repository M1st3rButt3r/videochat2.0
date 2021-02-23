require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const database = require('./includes/database');


//define routes
const signin = require('./routes/signin')
const signup = require('./routes/signup')
const index = require('./routes/index')
const logout = require('./routes/logout');
const { data } = require('jquery');

app.set('view-engine', 'ejs')


//app.use is for functions which are executed with an request, that can be multiple then they'll be executed in order.
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));

//Here we if we have set a cookie for the token
app.use(function(req, res, next)
{
    if(!req.cookies.token)
    {
        req.user = null
        next()
        return
    }
    //Verification of the token
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

//this is the last list of functions, which are all just executed if the corresponding path, they call the other scripts.
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/', index);

//This are just forwarding to other destinations if you put in /js or /css then you can use the folders from every directory.
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//listen on port 3000
server.listen(3000);

//this for handling socket request, that means send data if the site is already loaded
io.on('connection', (socket) => {

    //if we get the ready event fired, we store the data of the client in the list.
    socket.on("ready", (uuid) => {
        var sql = "INSERT INTO clients (uuid, socketid) VALUES ('"+uuid+"', '"+socket.id+"')";
        database.connection.query(sql);
    });
    
    //handling the call event
    socket.on("call", (id, peerid) => {
        //get the data for the called
        var sql = "SELECT * FROM clients WHERE uuid='"+id+"'";
        database.connection.query(sql, (err, r0) => {
            if(err) throw err;
            
            //get the data for the calling person
            var sql = "SELECT * FROM clients WHERE socketid='"+socket.id+"'";
            database.connection.query(sql, (err, r1) => {
                if(err) throw err;
                
                var callersId = r1[0].uuid;
                    
                r0.forEach(element => {
                    //send the call event to all connected clients of the called person.
                    io.to(element.socketid).emit("call", callersId, peerid);
                });
            });
        });
    });
    
    //On disconnected remove the table entry, this event is not fired if you stop the server.
    socket.on('disconnecting', () => {
        var sql = "DELETE FROM clients WHERE socketid = '"+socket.id+"'"
        database.connection.query(sql);
      });
});
