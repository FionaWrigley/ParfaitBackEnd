const express = require('express');
var cors = require('cors');
var group = require('./model/group');
var bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var member = require('./services/memberservices');
const rateLimit = require("express-rate-limit");
const fileUpload = require('express-fileupload');
var multer = require('multer');
var upload = multer();


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
app.use(fileUpload());
app.use(cors({origin: 'http://localhost:3000', credentials:true }));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(limiter);
app.use(upload.array()); 
app.use(express.static('public'));

app.listen(port, () => console.log(`Parfait listening on port ${port}!`));



app.post('/login', (req, res) => {

    // if (req.session.userID) {
    //     //find code for login when already logged in
    // } else {
        if (req.body.user.email && req.body.user.password) {
            member.login(req.body.user.email, req.body.user.password, (userID) => {
                if (userID > 0) {
                    req.session.userID = userID;
                    res.sendStatus(200);
                } else {
                    res.sendStatus('401');
                }
            });
        } else {
            res.sendStatus('400');
        }
   // }
});

app.get('/groups', (req, res) => {

    if (req.session.userID) {
        group.getGroups(req.session.userID, (result) => {
            res.send(result);
        })
    } else {
        res.sendStatus(403);
    }
});

app.post('/updateProfilePic', upload.single('profilePic'), (req, res) => {
    console.log("in update profile pic");
    console.log(JSON.stringify(req.body.profilePic));
    console.log(req.profilePic);
    // var img = fs.readFileSync(req.file.path);
    // var encode_image = img.toString('base64');
    // console.log(encode_image);
     
    // if (req.session.userID) {
         //member.updatePic(req.session.userID, req.body.profilePic);
        
    // } else {
    //     res.sendStatus(403);
    // }
});

app.get('/profilePic', (req, res) => {

   if (req.session.userID) {
        member.getProfilePic(req.session.userID, (result) => {
            res.send(result[0].profilePic);
        })  
    }
});

app.get('/profile', (req, res) => {

    if (req.session.userID) {
        member.getProfile(req.session.userID, (result) => {
            res.send(result[0]);
        })  
    }
});

app.post('/register', (req, res) => {
    console.log('in /register');
    console.log(req.body.user.email);
    if (req.body.user.email && req.body.user.password) {

        member.register(req.body.user.fname, req.body.user.lname, req.body.user.email, req.body.user.phone, req.body.user.password, (userID) => {
            if (userID > 0) {
                req.session.userID = userID;
                res.sendStatus(200);
            } else {
                res.sendStatus('401');
            }
        });
    } else {
        res.sendStatus('400');
    }

});



app.get('/logout', (req, res) => {

});