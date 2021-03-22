const express = require('express');
require('dotenv').config();
const datefns = require('date-fns');
const cors = require('cors');
const group = require('./model/group');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const member = require('./services/memberservices');
const groupservice = require('./services/groupservices');
const event = require('./model/event');
const path = require('path');
const rateLimit = require("express-rate-limit");
const winston = require('winston');
const multer = require('multer');
const {body, validationResult} = require('express-validator');
const { default: validator } = require('validator');
const { loginValidationRules, validate } = require('./services/validator.js')

//set up file storage options
const storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + 
    path.extname(file.originalname));

    }
});

const upload = multer({storage: storage});

//create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

//set up rate limits
const secondLimit = rateLimit({
    windowMs: 1000, // 1 second
    max: 3 // limit each IP to 3 requests per 1000 windowMs (3 per second)
});

const dailyLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1000 // limit each IP to 1000 requests per windowMs (1000 per 24 hours)
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

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({parameterLimit: 100000, extended: true, limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(secondLimit, dailyLimit); //returns error code 429 when rate limit reached

app.listen(port, () => console.log(`Parfait listening on port ${port}!`));

////////////////////////////////////////////////////////////////////////////////
////////////////////////////Routes//////////////////////////////////////////////
app.post('/login', loginValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
       
    //if fields are empty
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       
        logger.log({
            level: 'warn',
            message: `${timeStamp} - Failed login attempt, invalid user name or password - IP: ${ip} Email: ${req.body.user.email}`
          });

        return res
            .status(422)
            .json({errors: "Invalid username or password"});       
    }
    //otherwise check login is a valid email / password combo
    member.login(req.body.user.email, req.body.user.password, (user) => {

        if (user.memberID > 0) {
            req.session.userID = user.memberID;
            req.session.userType = user.userType;

            logger.log({
                level: 'info',
                message: `${timeStamp} - Successful login - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, Email: ${req.body.user.email}`
              });

            res.sendStatus(204); //success - no content
        } else {
            logger.log({
                level: 'warn',
                message: `${timeStamp} - Failed login attempt - IP: ${ip} Email: ${req.body.user.email}`
              });
            res.sendStatus('401'); //not authorized
        }
    });
});

//return a list of groups for authorized user
app.get('/groups', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //user is authorized
        group.getGroups(req.session.userID, (result) => {

            logger.log({
                level: 'info',
                message: `${timeStamp} - get groups - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.send(result); //send group list
        })
    } else {
        logger.log({
            level: 'warn',
            message: `${timeStamp} - Unathorized access attempt - get groups - IP: ${ip}`
          });
        res.sendStatus(401); //not authorized
    }
});

app.post('/profilepic', (req, res, next) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //user is authorized     
        next()
    }else{
        res.sendStatus(401); //not authorized
    }
},
upload.single('profilePic'),
    function (req, res, next) {
        member.updatePic(req.session.userID, req.file.path, (result) => {

            logger.log({
                level: 'info',
                message: `${timeStamp} - update profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });

            res.sendStatus(204); //success
        })
})


//get profile picture for authorized user
app.get('/profilePic', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) {
        member.getProfilePic(req.session.userID, (result) => {

            logger.log({
                level: 'info',
                message: `${timeStamp} - get profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.send(result[0].profilePic);
        })
    }else{
        res.sendStatus(401); //not authorized
    }
});

//get profile picture for authorized user
app.get('/profilepic1', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) {
        //member.getProfilePic(req.session.userID, (result) => {

            logger.log({
                level: 'info',
                message: `${timeStamp} - get profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.sendFile('public\images\profiles\profilePic-1616332765610.jpg');
        
    }else{
        res.sendStatus(401); //not authorized
    }
});

//return member profile information for logged in user
app.get('/profile', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //authorized
        member.getProfile(req.session.userID, (result) => {

            logger.log({
                level: 'info',
                message: `${timeStamp} - get profile - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.json(result[0]); 
        })
    }else{
        res.sendStatus(401); //not authorized
    }
});

//update member profile for logged in user
app.post('/profile', 
            body('user.fname', "Invalid Name").isAlpha().trim().escape(), 
            body('user.lname', "Invalid Name").isAlpha().trim().escape(), 
            body('user.email', "Not a valid email").isEmail().trim().escape().normalizeEmail(), 
            body('user.phone', "Phone number should be 10 digits and contain only numbers").isLength({min: 10}).isNumeric().trim().escape(), 
            
            (req, res) => { //fields are not valid return error messages

                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                const timeStamp = Date.now();

                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors);
                    return res.status(400).json({errors: errors.array()}); //bad request
                }

                if (req.session.userID) { //authorized  
                    let user = req.body.user;
                    user.userID = req.session.userID;
                    member.updateProfile(user, (result) => {
                        logger.log({
                            level: 'info',
                            message: `${timeStamp} - update profile - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
                          });
                        res.sendStatus(204);
                    })
                }else {
                    res.sendStatus(401); //not authorized
                }
});

//get user list for given search value
app.get('/users/:searchVal', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //authorized
        member.searchMembers(req.params.searchVal, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - search members - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, searchValue: ${req.params.searchVal}`
              });
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

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
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
            logger.log({
                level: 'info',
                message: `${timeStamp} - register - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.sendStatus(204); //success - no content
        } else {
            res.sendStatus('401'); //unauthorized
        }
    });
});

//logout and destroy session
app.get('/logout', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
    const session = req.session.id;
    const userID = req.session.userID;
    const userType = req.session.userType;

    req
        .session
        .destroy(function (err) {
            if (err) {
                logger.log({
                    level: 'info',
                    message: `${timeStamp} - logout - IP: ${ip}, session: ${session}, MemberID: ${userID}, userType: ${userType}`
                  });
                res.json('Error destroying session');
            } else {
                res.json('Session destroyed successfully');
            }
        })
});

//create new group
app.post('/creategroup', 
            body('group.name', "Group name must be alphanumeric").trim().escape(), 
            body('group.description').trim().escape(), 
            
            (req, res) => {

                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
                const timeStamp = Date.now(); //current UTC timestamp in ms

                //input fields are invalid
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log(errors);
                    return res.status(400).json({errors: errors.array()});
                }

                if (req.session.userID) { //authorized
                    
                    group.createGroup(req.body.group, req.session.userID, (result) => {
                        logger.log({
                            level: 'info',
                            message: `${timeStamp} - create group - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, groupID:  ${result.groupID}`
                          });
                        
                        res.sendStatus(200);
                    })
                }else {
                    res.sendStatus(401); //unathorized
                }
});

// get schedule for a given date for logged in user
app.get('/scheduleday/:date', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
    let dateStr = datefns.format(new Date(req.params.date), 'yyyy-MM-dd');

    if (req.session.userID) {
        event.getMemberEvents(req.session.userID, dateStr, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - get daily schedule - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType} date: ${dateStr}`
              });
            res.send(result);
        })
    }else {
        res.sendStatus(401); //unathorised
    }
});

//get group schedules for selected group of logged in user for given duration
app.get('/groupschedule/:groupID/:currDate/:numberOfDays', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //authorized
        groupservice.getGroupSchedules(req.params.groupID, req.params.currDate, req.params.numberOfDays, req.session.userID, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - get group schedule - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, group: ${req.params.groupID}, date: ${req.params.currDate}, numDays: ${req.params.numberOfDays}`
              });
            res.send(result);
        })
    }else {
        res.sendStatus(401); //unathorized
    }
});