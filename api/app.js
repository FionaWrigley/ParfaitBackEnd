const express = require('express');
var cors = require('cors');
var group = require('./model/group');
var bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var member = require('./services/memberservices');
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const port = 5000;

const app = express();
app.use(session({
    name: "parfaitSession",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60000 * 60 * 24,
        path: "/"
    }
}))

app.use(cors({origin: 'http://localhost:3000', credentials:true }));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(limiter);

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

//app.use('/', routes);

app.post('/login', (req, res) => {

    // if (req.session.userID) {
    //     //find code for login when already logged in
    // } else {
        if (req.body.user.email && req.body.user.password) {
            member.login(req.body.user.email, req.body.user.password, (userID) => {
                if (userID > 0) {
                    req.session.userID = userID;
                    //console.log(results);
                    console.log(req.sessionID);
                    console.log(userID);
                    res.sendStatus(200);
                } else {
                    console.log('in failed')
                    res.sendStatus('401');
                }
            });
        } else {
            res.sendStatus('400');
        }
   // }
});

app.get('/groups', (req, res) => {

    console.log(req.session.id);
    console.log(req.session.userID);
    if (req.session.userID) {
        group.getGroups(req.session.userID, (result) => {
            console.log(result);
            res.send(result);
        })
    } else {
        res.sendStatus(403);
    }
});

app.get('/profilePic', (req, res) => {

    console.log(req.session.id);
    console.log("in /profilePic route")
    console.log(req.session.userID);
   // if (req.session.userID) {
        
        member.getProfilePic(8, (result) => {
            console.log(result);
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk");
            res.send(result[0].profilePic);
        })  
       
    //} else {
       // res.sendStatus(403);
    //}
});

app.get('/profile', (req, res) => {

    console.log(req.session.id);
    console.log("in /profile route")
    console.log(req.session.userID);
   // if (req.session.userID) {
        
        member.getProfile(8, (result) => {
            console.log(result);
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk");
            res.send(result[0]);
        })  
});



app.get('/logout', (req, res) => {

});