const express = require('express');
require('dotenv').config();
const datefns = require('date-fns');
var cors = require('cors');
var group = require('./model/group');
var bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var member = require('./services/memberservices');
var groupservice = require('./services/groupservices');
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

    //console.log(req.body)
    //if fields are empty
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(400)
            .json({errors: "Invalid username or password"});
    }
    //otherwise check login is a valid email / password combo
    member.login(req.body.user.email, req.body.user.password, (userID) => {
        if (userID > 0) {
            req.session.userID = userID;
            res.sendStatus(204); //success - no content
        } else {
            res.sendStatus('401'); //not authorized
        }
    });
});

//return a list of groups for authorized user
app.get('/groups', (req, res) => {
    if (req.session.userID) { //user is authorized
        group.getGroups(req.session.userID, (result) => {
            res.send(result); //send group list
        })
    } else {
        res.sendStatus(401); //
    }
});


app.post('/updateProfilePic', upload.single('profilePic'), (req, res) => {
    
    // var img = fs.readFileSync(req.file.path); var encode_image =
    // img.toString('base64'); console.log(encode_image); if (req.session.userID) {
    // member.updatePic(req.session.userID, req.body.profilePic); } else {
    // res.sendStatus(403); }
});

//get profile picture for authorized user
app.get('/profilePic', (req, res) => {

    if (req.session.userID) {
        member.getProfilePic(req.session.userID, (result) => {
            res.send(result[0].profilePic);
        })
    }else{
        res.sendStatus(401); //Not authorized
    }
});

//return member profile information for logged in user
app.get('/profile', (req, res) => {

    if (req.session.userID) { //authorized
        member.getProfile(req.session.userID, (result) => {
            res.send(result[0]); 
        })
    }else{
        res.sendStatus(401); //Not authorized
    }
});

//update member profile for logged in user
app.post('/profile', 
            body('user.fname', "Invalid Name").isAlpha().trim().escape(), 
            body('user.lname', "Invalid Name").isAlpha().trim().escape(), 
            body('user.email', "Not a valid email").isEmail().trim().escape().normalizeEmail(), 
            body('user.phone', "Phone number should be 10 digits and contain only numbers").isLength({min: 10}).isNumeric().trim().escape(), 
            
            (req, res) => { //fields are not valid return error messages
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors);
                    return res.status(400).json({errors: errors.array()}); //bad request
                }

                if (req.session.userID) { //authorized  
                    let user = req.body.user;
                    user.userID = req.session.userID;
                    member.updateProfile(user, (result) => {
                        res.sendStatus(204);
                    })
                }else {
                    res.sendStatus(401); //not authorized
                }
});

//get user list for given search value
app.get('/users/:searchVal', (req, res) => {
    if (req.session.userID) { //authorized
        member.searchMembers(req.params.searchVal, (result) => {
            res.send(result);
        })
    } else {
        res.sendStatus(401); //not authorized
    }
});

//register new member
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
    const errors = validationResult(req);
    
    //if posted fields are not valid send error messages
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
            req.session.userID = userID; //create session userID
            res.sendStatus(204); //success - no content
        } else {
            res.sendStatus('401'); //unauthorized
        }
    });
});

//logout and destroy session
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

//create new group
app.post('/creategroup', 
            body('group.name', "Group name must be alphanumeric").trim().escape(), 
            body('group.description').trim().escape(), 
            
            (req, res) => {
                //input fields are invalid
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors);
                    return res.status(400).json({errors: errors.array()});
                }

                if (req.session.userID) { //authorized
                    
                    group.createGroup(req.body.group, req.session.userID, (result) => {
                        res.sendStatus(200);
                    })
                }else {
                    res.sendStatus(401); //unathorized
                }
});

// get schedule for a given date for logged in user
app.get('/scheduleday/:date', (req, res) => {

    let dateStr = datefns.format(new Date(req.params.date), 'yyyy-MM-dd');

    if (req.session.userID) {
        event.getMemberEvents(req.session.userID, dateStr, (result) => {
            res.send(result);
        })
    }else {
        res.sendStatus(401); //unathorised
    }
});

//get group schedules for selected group of logged in user for given duration
app.get('/groupschedule/:groupID/:currDate/:numberOfDays', (req, res) => {

    if (req.session.userID) { //authorized
        groupservice.getGroupSchedules(req.params.groupID, req.params.currDate, req.params.numberOfDays, req.session.userID, (result) => {
            res.send(result);
        })
    }else {
        res.sendStatus(401); //unathorized
    }
});