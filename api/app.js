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
var decode = require('unescape');
const rateLimit = require("express-rate-limit");
const {logger} = require('./services/logger');
const multer = require('multer');
const {unescape, validationResult} = require('express-validator');
const {default: validator} = require('validator');
const {
    loginValidationRules,
    profileValidationRules,
    registerValidationRules,
    scheduleDayValidationRules,
    groupSchedValidationRules,
    createGroupSanitize,
    sanitizeSearchVal
} = require('./services/validator.js');
const {de} = require('date-fns/locale');

//set up file storage options
const storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

//set up rate limits
const secondLimit = rateLimit({
    windowMs: 1000, // 1 second
    max: 3 // limit each IP to 3 requests per 1000 windowMs - 3 per second
    //MORE THAN 1 PER SECOND REQUIRED TO HANDLE MULTIPLE COMPONENTS RENDERING / FETCHING AT ONCE
});

const dailyLimit = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours (24 * 60mins * 60sec * 1000ms to get number of ms in 24 hours)
    max: 1000 // limit each IP to 1000 requests per windowMs (1000 per 24 hours)
});


const app = express();





app.use(session({
    //proxy: true,
    name: "parfaitSession",
    secret: 'donkey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60000 * 60 * 48,
        path: "/"
    }
}))



app.use(cors({origin: process.env.ORIGIN, credentials: true}));


// app.use(function(req, res) {
    
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');

//     res.setHeader('Access-Control-Allow-Credentials', true);
// })


//app.use(cookieParser());
 app.use(bodyParser.json({limit: '50mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({parameterLimit: 100000, extended: true, limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(express.static('public'));


// RATE LIMITING prevents test scripts hence is currently commmented out
// app.use(secondLimit, dailyLimit); //returns error code 429 when either rate
// limit reached
// /////////////////////////////////////////////////////////////////////////////
// /
// //////////////////////////Routes/////////////////////////////////////////////
// /
// /////////////////////////////////////////////////////////////////////////////

app.get('/loggedin', (req, res) => {

    if (req.session.userID) { //if session already exists
        res.sendStatus(204); //return success - no content
    }else{
        res.sendStatus(401); //return not authorized
    }
})


// /////////////////////////////////////////////////////////////////////////////
// / //////////// login
// //////////////////////////////////////////////////////////////////////////////
app.post('/login', loginValidationRules(), (req, res) => {

    // if session already exists, destroy existing session, and attempt auth with
    // new login details

    console.log(req.body);
    if (req.session.userID) { //if session already exists
        delete req.session.userID; //remove existing user id and proceed with authentication
        delete req.session.userType;
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    //if fields are empty
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        logger.log({level: 'warn', message: `Failed login attempt, 422 Invalid user name or password - IP: ${ip} Email: ${req.body.email}`});

        return res
            .status(422)
            .json({errors: "Invalid username or password"});
    }
    //otherwise check login is a valid email / password combo
    memberService.login(req.body.email, req.body.password, (result) => {

        console.log('result', result);
        console.log('member id ', result.memberID || 'error')

        if (result.memberID) { //member ID was returned - authentication successful
            req.session.userID = result.memberID;
            req.session.userType = result.userType;



            logger.log({level: 'info', message: `Successful login, 204- IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, Email: ${req.body.email}`});
            res.sendStatus(204); //return success - no content
        } else if (result === 401) { //authentication failure
            logger.log({level: 'warn', message: `Failed login attempt, 401 - IP: ${ip} Email: ${req.body.email}`});
            res.sendStatus('401'); //not authorized
        } else {

            logger.log({level: 'Error', message: `Login attempt, 500 - ERR: ${result}, IP: ${ip} Email: ${req.body.email}`});
            res.send(500); //an error has occured in execution
        }
    });
});

// /////////////////////////////////////////////////////////////////////////////
// / ////////////// logout and destroy session
// //////////////////////////////////////////////////////////////////////////////

app.get('/logout', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    const session = req.session.id;
    const userID = req.session.userID;
    const userType = req.session.userType;

    req
        .session
        .destroy(function (err) { //end session
            if (err) {
                logger.log({level: 'error', message: `Logout failed - IP: ${ip}, session: ${session}, MemberID: ${userID}, userType: ${userType}`});
                res.json('Error destroying session');
            } else {
                logger.log({level: 'info', message: `Logout - IP: ${ip}, session: ${session}, MemberID: ${userID}, userType: ${userType}`});
                res
                    .status(204)
                    .json('Session destroyed successfully');
            }
        })
});

// /////////////////////////////////////////////////////////////////////////////
// / ////////// return a list of groups for authorized user
// //////////////////////////////////////////////////////////////////////////////
app.get('/groups', (req, res) => {

    console.log('in group req');
    console.log('user id ', req.session.userID)
    console.log('user id ', req.session.id)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    if (req.session.userID) { //user is authorized
        group.getGroups(req.session.userID, (result) => {

            logger.log({level: 'info', message: `Get groups - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});

            // res.setHeader('Access-Control-Allow-Headers', 'content-type,cache-control');
            // res.setHeader("Cache-Control", "max-age=31536000, immutable");
            res.send(result); //send group list
        })
    } else {
        logger.log({level: 'warn', message: `Unathorized access attempt - get groups - IP: ${ip}`});
        res.sendStatus(401); //not authorized
    }
});

// /////////////////////////////////////////////////////////////////////////////
// / ////////// create new group
// //////////////////////////////////////////////////////////////////////////////

app.post('/creategroup', createGroupSanitize(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    //input fields are invalid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.log({level: 'warn', message: `Failed group creation, 422 Invalid input ${errors} - IP: ${ip}`});
        return res
            .status(422)
            .json({
                errors: errors.array()
            });
    }

    if (req.session.userID) { //authorized

        group.createGroup(req.body.group, req.session.userID, (result) => {
            logger.log({level: 'info', message: `Create group - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, groupID:  ${result.groupID}`});
            res.sendStatus(200);
        })
    } else {
        logger.log({level: 'warn', message: `Unathorized create group, 401 IP: ${ip}`});
        res.sendStatus(401); //unathorized
    }
});

// /////////////////////////////////////////////////////////////////////////////
// / ////// get user list for given search value
// //////////////////////////////////////////////////////////////////////////////

app.get('/users/:searchVal', sanitizeSearchVal(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    if (req.session.userID) { //authorized
        member.searchMembers(req.params.searchVal, req.session.userID, (result) => {
            logger.log({level: 'info', message: `Search members - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, searchValue: ${req.params.searchVal}`});
            res.json(result);
        })
    } else { //not authorized
        logger.log({level: 'warn', message: `Unathorized access attempt - search users - IP: ${ip}`});
        res.sendStatus(401);
    }
});

// /////////////////////////////////////////////////////////////////////////////
// / /// return member profile information for logged in user
// //////////////////////////////////////////////////////////////////////////////
app.get('/profile', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    if (req.session.userID) { //authorized
        member.getMember(req.session.userID, (result) => {
            logger.log({level: 'info', message: `Get profile - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});
            res.json(result[0]);
        })
    } else {
        logger.log({level: 'warn', message: `Unathorized access attempt - get profile - IP: ${ip}`});
        res.sendStatus(401); //not authorized
    }
});

// /////////////////////////////////////////////////////////////////////////
// update member profile for logged in user
// ////////////////////////////////////////////////////////////////////////////
app.post('/profile', profileValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //fields are not valid return error messages
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.log({level: 'warn', message: `Failed profile update, 422 Invalid input ${errors} - IP: ${ip} Email: ${req.body.user.email}`});
        return res
            .status(422)
            .json({
                errors: errors.array()
            });
    }

    if (req.session.userID) { //authorized

        //posted fields are valid, check if email is already in use
        member.memberExists(req.body.user.email, (result) => {

            if (result.memberID === 0 || result.memberID === req.session.userID) { //email not in use or in use by current user

                member.updateMember(req.body.user, (result) => {
                    logger.log({level: 'info', message: `Update profile - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});
                    res.sendStatus(204);
                })

            } else { //email already in use

                logger.log({level: 'warn', message: `Failed profile update, email already in use by another account, 409 - search users - IP: ${ip}`});
                res.sendStatus('409');
            }
        })
    } else { //not authorized
        logger.log({level: 'warn', message: `Unathorized access attempt - get profile - IP: ${ip}`});
        res.sendStatus(401);
    }

});

// /////////////////////////////////////////////////////////////////////////////
// / //////////////// get profile picture for authorized user
// //////////////////////////////////////////////////////////////////////////////
app.get('/profilepic', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    if (req.session.userID) { //authorized
        memberService.getProfilePic(req.session.userID, (result) => {
            logger.log({level: 'info', message: `Get profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});
            console.log(result);
            
            res.sendFile(__dirname + '\\public\\' + result[0].profilePicPath); 
        })      
    } else { //not authorized
        logger.log({level: 'warn', message: `Unathorized to get profile pic, 401 IP: ${ip}`});
        res.sendStatus(401);
    }
});

// /////////////////////////////////////////////////////////////////////////////
// / //////////////// get profile picture for authorized user
// //////////////////////////////////////////////////////////////////////////////
app.get('/profilepic2', (req, res) => {

    console.log("profile pic 2")

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    if (req.session.userID) { //authorized
        memberService.getProfilePic(req.session.userID, (result) => {
            logger.log({level: 'info', message: `Get profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});
            console.log(result);
            
            console.log(result[0]);
            res.send(result[0]); 
        })      
    } else { //not authorized
        logger.log({level: 'warn', message: `Unathorized to get profile pic, 401 IP: ${ip}`});
        res.sendStatus(401);
    }
});

// /////////////////////////////////////////////////////////////////////////////
// / /////////////////////// update profile pic
// //////////////////////////////////////////////////////////////////////////////
app.post('/profilepic', (req, res, next) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    if (req.session.userID) { //user is authorized
        next()
    } else {
        logger.log({level: 'warn', message: `Unathorised to update profile pic, 401 IP: ${ip}`});
        res.sendStatus(401); //not authorized
    }
}, upload.single('profilepic'), //get file (Multer function)
        function (req, res, next) {

            let path = req.file.path.replace('public\\',""); //trim the public folder off path
            console
    memberService.updatePic(req.session.userID, path, (result) => {
        logger.log({level: 'info', message: `Update profile pic - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});
        res.sendStatus(204); //success
    })
})

// /////////////////////////////////////////////////////////////////////////////
// / //////////////// get schedule for a given date for logged in user
// //////////////////////////////////////////////////////////////////////////////
app.get('/scheduleday/:date', scheduleDayValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    //input fields are invalid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.log({level: 'warn', message: `Failed schedule day retreival, 422 Invalid input ${errors} - IP: ${ip}`});
        return res
            .status(422)
            .json({
                errors: errors.array()
            });
    }

    let dateStr = datefns.format(new Date(req.params.date), 'yyyy-MM-dd');

    if (req.session.userID) { //authorised
        event.getMemberEvents(req.session.userID, dateStr, (result) => {
            logger.log({level: 'info', message: `Get daily schedule - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType} date: ${dateStr}`});
            res.send(result);
        })
    } else {
        logger.log({ //unathorised
            level: 'warn',
            message: `Unathorized to get schedule, 401 IP: ${ip}`
        });
        res.sendStatus(401);
    }
});

// /////////////////////////////////////////////////////////////////////////////
// /  get group schedules for selected group of logged in user for given
// duration
// /////////////////////////////////////////////////////////////////////////////
// /
app.get('/groupschedule/:groupID/:currDate/:numberOfDays', groupSchedValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    const errors = validationResult(req);

    if (!errors.isEmpty()) { //validation errors
        logger.log({level: 'warn', message: `Failed group schedule retreival, 422 Invalid input ${errors} - IP: ${ip}`});
        return res
            .status(422)
            .json({
                errors: errors.array()
            });
    }

    if (req.session.userID) { //authorised
        groupService.getGroupSchedules2(req.params.groupID, req.params.currDate, req.params.numberOfDays, req.session.userID, (result) => {
            logger.log({level: 'info', message: `Get group schedule - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, group: ${req.params.groupID}, date: ${req.params.currDate}, numDays: ${req.params.numberOfDays}`});
            res.send(result);
        })
    } else { //unathorised
        logger.log({level: 'warn', message: `Unathorised to get group schedule, 401 IP: ${ip}`});
        res.sendStatus(401);
    }
});

// /////////////////////////////////////////////////////////////////////////////
// / ////////// register new member
// //////////////////////////////////////////////////////////////////////////////

app.post('/register', registerValidationRules(), (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    const errors = validationResult(req);

    if (req.session.userID) { //if session already exists
        delete req.session.userID; //remove existing user id and proceed with new user registration
        delete req.session.userType;
    }

    //if posted fields are not valid send error messages
    if (!errors.isEmpty()) {
        logger.log({level: 'warn', message: `Failed registration, 422 Invalid input ${errors} - IP: ${ip} Email: ${req.body.user.email}`});
        return res
            .status(422)
            .json({
                errors: errors.array()
            });
    }

    //posted fields are valid, check if email is already in use
    member.memberExists(req.body.user.email, (result) => {

        if (result.memberID > 0) { //email already in use

            logger.log({level: 'warn', message: `Failed registration attempt, email already in use, 409 - search users - IP: ${ip}`});
            res.sendStatus('409');

        } else { //email not already in use, proceed with create member

            member.createMember(req.body.user, (userID) => {
                if (userID > 0) {
                    req.session.userID = userID; //create session userID to log in automatically
                    req.session.userType = req.body.user.userType; //create session userType
                    logger.log({level: 'info', message: `Register - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}`});
                    res.sendStatus(204); //success - no content

                } else { //unauthorized
                    logger.log({level: 'warn', message: `Failed registration attempt attempt, 400 - search users - IP: ${ip}`});
                    res.sendStatus('400');
                }
            });
        }
    })
});

// /////////////////////////////////////////////////////////////////////////////
// / ////////// create new event
// //////////////////////////////////////////////////////////////////////////////

app.post('/createevent', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
    let eventObj = req.body.form;
    console.log(eventObj);
    //input fields are invalid
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     logger.log({level: 'warn', message: `Failed group creation, 422 Invalid input ${errors} - IP: ${ip}`});
    //     return res
    //         .status(422)
    //         .json({
    //             errors: errors.array()
    //         });
    // }

    if (req.session.userID) { //authorized

         event.createEvent(eventObj, req.session.userID, (result) => {
             logger.log({level: 'info', message: `Create event - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, groupID:  ${result.eventID}`});
             res.sendStatus(204);
         })
     } else { //unathorized
         logger.log({level: 'warn', message: `Unathorized create event, 401 IP: ${ip}`});
         res.sendStatus(401); //unathorized
     }
});

/////////////////////////////////////////////////////////////////////////////////////
//Delete event
///////////////////////////////////////////////////////////////////////////////////
app.post('/deleteevent', (req, res) => {

    console.log('eventID', req.body.eventID);
    

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address
  
    
    // const errors = validationResult(req);

    //if posted fields are not valid send error messages
    // if (!errors.isEmpty()) {
    //     logger.log({level: 'warn', message: `Failed registration, 422 Invalid input ${errors} - IP: ${ip} Email: ${req.body.user.email}`});
    //     return res
    //         .status(422)
    //         .json({
    //             errors: errors.array()
    //         });
    // }

    if (req.session.userID) { //authorised
        event.deleteEvent(req.body.eventID, req.session.userID, (result) => {
            
            logger.log({level: 'info', message: `Delete event - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, group: ${req.body.eventID}`});
            res.sendStatus(204);
        })
    } else { //unathorised
        logger.log({level: 'warn', message: `Unathorised attempt to delete event, 401 IP: ${ip}`});
        res.sendStatus(401);
    }
})

/////////////////////////////////////////////////////////////////////
/////getGroupPics
///////////////////////////////////////////////////////////////////
app.get('/grouppics/:groupID', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //client ip address

    // const errors = validationResult(req);

    // if (!errors.isEmpty()) { //validation errors
    //     logger.log({level: 'warn', message: `Failed group schedule retreival, 422 Invalid input ${errors} - IP: ${ip}`});
    //     return res
    //         .status(422)
    //         .json({
    //             errors: errors.array()
    //         });
    // }

    if (req.session.userID) { //authorised
        groupService.getGroupProfilePics(req.session.userID, req.params.groupID, (result) => {
            logger.log({level: 'info', message: `Get group profilePics - IP: ${ip}, session: ${req.session.id}, MemberID: ${req.session.userID}, userType: ${req.session.userType}, group: ${req.params.groupID}, date: ${req.params.currDate}, numDays: ${req.params.numberOfDays}`});
            res.send(result);
        })
    } else { //unathorised
        logger.log({level: 'warn', message: `Unathorised to get group profile pics, 401 IP: ${ip}`});
        res.sendStatus(401);
    }
});

// ///////////////////////////////TODO//////////////////////////////////////////
// / ////////////// edit event, edit group, delete group
// delete group member, change password

module.exports = app;