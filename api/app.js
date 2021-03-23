const express = require('express');
require('dotenv').config();
const datefns = require('date-fns');
const cors = require('cors');
const group = require('./model/group');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const memberService = require('./services/memberservices');
const groupService = require('./services/groupservices');
const member = require('./model/member');
const event = require('./model/event');
const path = require('path');
const rateLimit = require("express-rate-limit");
const winston = require('winston');
const multer = require('multer');
const {body, params, validationResult} = require('express-validator');
const { default: validator } = require('validator');
const { loginValidationRules, 
        profileValidationRules,
        registerValidationRules,
        scheduleDayValidationRules,
        groupSchedValidationRules,
        createGroupSanitize,
        sanitizeSearchVal
         } = require('./services/validator.js')

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
    max: 3 // limit each IP to 3 requests per 1000 windowMs - 3 per second
    //MORE THAN 1 PER SECOND REQUIRED TO HANDLE MULTIPLE COMPONENTS RENDERING / FETCHING AT ONCE
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

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////Routes////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////
//login
////////////////////////////////////////////////////////////////////////////////////////////
app.post('/login', loginValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
       
    //if fields are empty
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       
        logger.log({
            level: 'warn',
            message: `${timeStamp} - Failed login attempt, 422 Invalid user name or password - IP: ${ip} Email: ${req.body.user.email}`
          });

        return res
            .status(422)
            .json({errors: "Invalid username or password"});       
    }
    //otherwise check login is a valid email / password combo
    memberService.login(req.body.user.email, req.body.user.password, (result) => {

        console.log(result);

        if(result.memberID){ //member ID was returned - authentication successful
            req.session.userID = result.memberID;
            req.session.userType = result.userType;

            logger.log({
                level: 'info',
                message: `${timeStamp} - Successful login, 204- IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, Email: ${req.body.user.email}`
              });
            res.sendStatus(204); //return success - no content
        }else if(result === 401){ //authentication failure
                logger.log({
                    level: 'warn',
                    message: `${timeStamp} - Failed login attempt, 401 - IP: ${ip} Email: ${req.body.user.email}`
                });
            res.sendStatus('401'); //not authorized
        }else{
            
            logger.log({
            level: 'Error',
            message: `${timeStamp} - Login attempt, 500 - ERR: ${result}, IP: ${ip} Email: ${req.body.user.email}`
        });
        res.send(500); //an error has occured in execution
        }
    });
});

//////////////////////////////////////////////////////////////////////////////////////////
//return a list of groups for authorized user
//////////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////
//return member profile information for logged in user
////////////////////////////////////////////////////////////////////////////////////
app.get('/profile', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //authorized
        member.getMember(req.session.userID, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - get profile - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.json(result[0]); 
        })
    }else{
        logger.log({
            level: 'warn',
            message: `${timeStamp} - Unathorized access attempt - get profile - IP: ${ip}`
          });
        res.sendStatus(401); //not authorized
    }
});

///////////////////////////////////////////////////////////////////////////
//update member profile for logged in user
//////////////////////////////////////////////////////////////////////////////
app.post('/profile', profileValidationRules(), (req, res) => { 
    
                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                const timeStamp = Date.now();

                //fields are not valid return error messages
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    logger.log({
                        level: 'warn',
                        message: `${timeStamp} - Failed profile update, 422 Invalid input ${errors} - IP: ${ip} Email: ${req.body.user.email}`
                      });

                    return res.status(422).json({errors: errors.array()}); //bad request
                }

                if (req.session.userID) { //authorized  
                    let user = req.body.user;
                    member.updateMember(user, (result) => {
                        logger.log({
                            level: 'info',
                            message: `${timeStamp} - update profile - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
                          });
                        res.sendStatus(204);
                    })
                }else { //not authorized
                    logger.log({
                        level: 'warn',
                        message: `${timeStamp} - Unathorized access attempt - get profile - IP: ${ip}`
                      });
                    res.sendStatus(401); 
                }
});

//////////////////////////////////////////////////////////////////////////////////////
//get user list for given search value
//////////////////////////////////////////////////////////////////////////////////////
app.get('/users/:searchVal', sanitizeSearchVal(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //authorized
        member.searchMembers(req.params.searchVal, req.session.userID, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - search members - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, searchValue: ${req.params.searchVal}`
              });
            res.send(result);
        })
    } else { //not authorized
        logger.log({
            level: 'warn',
            message: `${timeStamp} - Unathorized access attempt - search users - IP: ${ip}`
          });
        res.sendStatus(401); 
    }
});

//////////////////////////////////////////////////////////////////////////////////////////
//register new member
//////////////////////////////////////////////////////////////////////////////////////////
app.post('/register', registerValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
    const errors = validationResult(req);
    
    //if posted fields are not valid send error messages
    if (!errors.isEmpty()) {
        logger.log({
            level: 'warn',
            message: `${timeStamp} - Failed registration, 422 Invalid input ${errors} - IP: ${ip} Email: ${req.body.user.email}`
          });
        return res.status(422).json({errors: errors.array()});
    }

    //posted fields are valid, register user
    member.createMember(req.body.user, (userID) => {
        if (userID > 0) {
            req.session.userID = userID; //create session userID to log in automatically
            req.session.userType = req.body.user.userType; //create session userType
            logger.log({
                level: 'info',
                message: `${timeStamp} - register - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.sendStatus(204); //success - no content

        } else { //unauthorized
            logger.log({
                level: 'warn',
                message: `${timeStamp} - Failed registration attempt attempt, 400 - search users - IP: ${ip}`
              });
            res.sendStatus('400'); 
        }
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////
//logout and destroy session
///////////////////////////////////////////////////////////////////////////////////////////////

app.get('/logout', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
    
    const session = req.session.id;
    const userID = req.session.userID;
    const userType = req.session.userType;

    req.session.destroy(function (err) { //end session
            if (err) {
                logger.log({
                    level: 'error',
                    message: `${timeStamp} - logout failed - IP: ${ip}, session: ${session}, MemberID: ${userID}, userType: ${userType}`
                  });
                res.json('Error destroying session');
            } else {
                logger.log({
                    level: 'info',
                    message: `${timeStamp} - logout - IP: ${ip}, session: ${session}, MemberID: ${userID}, userType: ${userType}`
                  });
                res.status(204).json('Session destroyed successfully');
            }
        })
});

//////////////////////////////////////////////////////////////////////////////////////////
//create new group
///////////////////////////////////////////////////////////////////////////////////////////

app.post('/creategroup', createGroupSanitize(), (req, res) => {

                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
                const timeStamp = Date.now(); //current UTC timestamp in ms

                //input fields are invalid
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    logger.log({
                        level: 'warn',
                        message: `${timeStamp} - Failed group creation, 422 Invalid input ${errors} - IP: ${ip}`
                      });
                    return res.status(422).json({errors: errors.array()});
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
                    logger.log({
                        level: 'warn',
                        message: `${timeStamp} - Unathorized create group, 401 IP: ${ip}`
                      });
                    res.sendStatus(401); //unathorized
                }
});

////////////////////////////////////////////////////////////////////////////////////////////////
// get schedule for a given date for logged in user
///////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/scheduleday/:date', scheduleDayValidationRules(), (req, res) => {
     
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    //input fields are invalid
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         logger.log({
             level: 'warn',
             message: `${timeStamp} - Failed schedule day retreival, 422 Invalid input ${errors} - IP: ${ip}`
           });
         return res.status(422).json({errors: errors.array()});
     }

    let dateStr = datefns.format(new Date(req.params.date), 'yyyy-MM-dd');

    if (req.session.userID) { //authorised
        event.getMemberEvents(req.session.userID, dateStr, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - get daily schedule - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType} date: ${dateStr}`
              });
            res.send(result);
        })
    }else {
        logger.log({ //unathorised
            level: 'warn',
            message: `${timeStamp} - Unathorized to get schedule, 401 IP: ${ip}`
          });
        res.sendStatus(401); 
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////
//get group schedules for selected group of logged in user for given duration
///////////////////////////////////////////////////////////////////////////////////////////////
app.get('/groupschedule/:groupID/:currDate/:numberOfDays', groupSchedValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms
    
    const errors = validationResult(req);
     
    if (!errors.isEmpty()) { //validation errors
         logger.log({
             level: 'warn',
             message: `${timeStamp} - Failed group schedule retreival, 422 Invalid input ${errors} - IP: ${ip}`
           });
         return res.status(422).json({errors: errors.array()});
     }

    if (req.session.userID) { //authorised
        groupService.getGroupSchedules(req.params.groupID, req.params.currDate, req.params.numberOfDays, req.session.userID, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - get group schedule - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, group: ${req.params.groupID}, date: ${req.params.currDate}, numDays: ${req.params.numberOfDays}`
              });
            res.send(result);
        })
    }else {//unathorised
        logger.log({ 
            level: 'warn',
            message: `${timeStamp} - Unathorised to get group schedule, 401 IP: ${ip}`
          });
        res.sendStatus(401); 
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//update profile pic
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/profilepic', (req, res, next) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) { //user is authorized     
        next()
    }else{
        logger.log({ 
            level: 'warn',
            message: `${timeStamp} - Unathorised to update profile pic, 401 IP: ${ip}`
          });
        res.sendStatus(401); //not authorized
    }
},
upload.single('profilePic'), //get file (Multer function)
    function (req, res, next) {

        memberService.updatePic(req.session.userID, req.file.path, (result) => {
            logger.log({
                level: 'info',
                message: `${timeStamp} - update profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.sendStatus(204); //success
        })
})

////////////////////////////////////////////////////////////////////////////////////////////////
//get profile picture for authorized user
///////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/profilePic', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const timeStamp = Date.now(); //current UTC timestamp in ms

    if (req.session.userID) {
        memberService.getProfilePic(req.session.userID, (result) => {

            logger.log({
                level: 'info',
                message: `${timeStamp} - get profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`
              });
            res.send(result[0].profilePic);
        })
    }else{ //not authorized
        logger.log({ 
            level: 'warn',
            message: `${timeStamp} - Unathorised to get profile pic, 401 IP: ${ip}`
          });
        res.sendStatus(401); 
    }
});

/////////////////////////////////TODO///////////////////////////////////////////////////////////
//edit event
//change password