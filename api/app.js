const express = require('express');
//require('dotenv').config({ path: './.env'});
//dotenv.config();
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


const { body, validationResult } = require('express-validator');


const secondLimit = rateLimit({
    windowMs: 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const dailyLimit = rateLimit({
    windowMs: 1440 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
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
app.use(secondLimit, dailyLimit);
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
                    res.sendStatus(204);
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
        res.sendStatus(401);
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

app.get('/users/:searchVal', (req, res) => {
    if (req.session.userID) {
        console.log(req.params.searchVal)
        member.searchMembers(req.params.searchVal, (result) => {
            res.send(result);
        })  
    }else{
        res.sendStatus(403);
    }
});

// app.post('/register',  (req, res) => {
//     console.log('in /register');
//     console.log(req.body.user.email);
//     if (req.body.user.email && req.body.user.password) {

//         member.register(req.body.user.fname, req.body.user.lname, req.body.user.email, req.body.user.phone, req.body.user.password, (userID) => {
//             if (userID > 0) {
//                 req.session.userID = userID;
//                 res.sendStatus(200);
//             } else {
//                 res.sendStatus('401');
//             }
//         });
//     } else {
//         res.sendStatus('400');
//     }

// });

app.post('/register', [
    body('user.fname', "Invalid Name").isAlpha(),
    body('user.lname', "Invalid Name").isAlpha(),
    body('user.email', "Not a valid email").isEmail(),
    body('user.phone', "Phone number should be 10 digits and contain only numbers").isLength({min: 10}).isNumeric(),
    body('user.password', "Password should contain a minimum of 8 characters, including one upper case letter, one lower case letter, and one number.").isStrongPassword()],

  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

        member.register(req.body.user.fname, req.body.user.lname, req.body.user.email, req.body.user.phone, req.body.user.password, (userID) => {
            if (userID > 0) {
                req.session.userID = userID;
                res.sendStatus(200);
            } else {
                res.sendStatus('401');
            }
        });
});


app.get('/logout', (req, res) => {

});