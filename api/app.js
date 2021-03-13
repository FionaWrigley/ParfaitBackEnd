const express = require('express');
require('dotenv').config();
var cors = require('cors');
var group = require('./model/group');
var bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var member = require('./services/memberservices');
var group = require('./model/group');
var event = require('./model/event');
const rateLimit = require("express-rate-limit");
const fileUpload = require('express-fileupload');
var multer = require('multer');
var upload = multer();

const {body, validationResult} = require('express-validator');
const { default: validator } = require('validator');

const secondLimit = rateLimit({
    windowMs: 1000, // 1 second
    max: 3 // limit each IP to 100 requests per windowMs
});

const dailyLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1000 // limit each IP to 1000 requests per windowMs
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
        maxAge: 60000 * 60 * 48,
        path: "/"
    }
}))
app.use(fileUpload());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(secondLimit, dailyLimit);
app.use(upload.array());
app.use(express.static('public'));

app.listen(port, () => console.log(`Parfait listening on port ${port}!`));

app.post('/login', body('user.email').not().isEmpty(), body('user.password').not().isEmpty(), (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(400)
            .json({errors: "Invalid username or password"});
    }

    member.login(req.body.user.email, req.body.user.password, (userID) => {
        if (userID > 0) {
            req.session.userID = userID;
            res.sendStatus(204);
        } else {
            res.sendStatus('401');
        }
    });
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
    // var img = fs.readFileSync(req.file.path); var encode_image =
    // img.toString('base64'); console.log(encode_image); if (req.session.userID) {
    // member.updatePic(req.session.userID, req.body.profilePic); } else {
    // res.sendStatus(403); }
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

app.post('/profile', 
            body('user.fname', "Invalid Name").isAlpha().trim().escape(), 
            body('user.lname', "Invalid Name").isAlpha().trim().escape(), 
            body('user.email', "Not a valid email").isEmail().trim().escape().normalizeEmail(), 
            body('user.phone', "Phone number should be 10 digits and contain only numbers").isLength({min: 10}).isNumeric().trim().escape(), 
            
            (req, res) => {
    
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors);
                    return res.status(400).json({errors: errors.array()});
                }
                if (req.session.userID) {
                    
                    let user = req.body.user;
                    user.userID = req.session.userID;
                    console.log(user.userID);
                    member.updateProfile(user, (result) => {
                        res.sendStatus(204);
                    })
                }else {
                    res.sendStatus(403);
                }
});

app.get('/users/:searchVal', (req, res) => {
    if (req.session.userID) {
        console.log(req.params.searchVal)
        member.searchMembers(req.params.searchVal, (result) => {
            res.send(result);
        })
    } else {
        res.sendStatus(403);
    }
});

//register route
app.post('/register', [
    body('user.fname', "Invalid Name").isAlpha().trim().escape(),
    body('user.lname', "Invalid Name").isAlpha().trim().escape(),
    body('user.email', "Not a valid email").isEmail().trim().escape().normalizeEmail(),
    body('user.phone', "Phone number should be 10 digits and contain only numbers")
        .isLength({min: 10})
        .isNumeric().trim().escape(),
    body('user.password', "Password should contain a minimum of 8 characters, including one upper case lett" +
            "er, one lower case letter, and one number.").isStrongPassword().trim().escape()
], (req, res) => {
    console.log("in register")
    const errors = validationResult(req);
    
    //if posted fields are not valid
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(400)
            .json({
                errors: errors.array()
            });
    }

    //posted fields are valid, register user
    member.register(req.body.user, (userID) => {
        if (userID > 0) {
            console.log("success")
            req.session.userID = userID;
            res.sendStatus(200);
        } else {
            res.sendStatus('401');
        }
    });
});

app.get('/logout', (req, res) => {
    req
        .session
        .destroy(function (err) {
            if (err) {
                msg = 'Error destroying session';
                res.json(msg);
            } else {
                msg = 'Session destroyed successfully';
                console.log(msg)
                res.json(msg);
            }
        })
});

app.post('/creategroup', 
            body('group.name', "Group name must be alphanumeric").trim().escape(), 
            body('group.description').trim().escape(), 
            
            (req, res) => {
    
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors);
                    return res.status(400).json({errors: errors.array()});
                }
                if (req.session.userID) {
                    
                    group.createGroup(req.body.group, req.session.userID, (result) => {
                        res.sendStatus(200);
                    })
                }else {
                    res.sendStatus(500);
                }
});

app.get('/scheduleday/:date', (req, res) => {

    // console.log('in get request')
    // console.log(req.params)
    //console.log(req.params.date);
    // console.log(req.session.userID);
    var date = new Date(req.params.date);
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];

    console.log("date!!")
    //let selectedDate = validator.toDate(dateString);
    console.log(dateString)

    if (req.session.userID) {
        event.getMemberEvents(req.session.userID, dateString, (result) => {
            res.send(result);
        })
    }else {
        //res.sendStatus(500);
    }
});