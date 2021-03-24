var mysql = require('mysql');
var _db = require('./dbconfig');    
var crypto = require('crypto');
var pool = mysql.createPool(_db);
const {logger} = require('../services/logger');

module.exports = {
    getMemberIDPassword: function (email, cb) {
       let sql = 'SELECT `memberID`, `password`, `userType` FROM `member` where email = ?'

    pool.query(sql, email, function (err, results, fields) {
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to get select from member, getMemberIDPassword, sql: ${sql}, values: ${email} error: ${err}`
                  });
                throw err;
            }
            return cb(results);
        })
    },

    //check if email already exists
    memberExists: function (email, cb) {

        let sql = 'SELECT * FROM `member` where email = ?';

        pool.query(sql, email, function (err, results, fields) {
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to get select from member, memberExists, sql: ${sql}, values: ${email} error: ${err}`
                  });
                throw err;
            }
            if (results.length > 0) {
                return cb(true);
            }
            return cb(false);
        })
    },

    //create a new member with hashed password
    createMember: function (user, cb) {

        var sql = 'INSERT INTO `member`(`fname`, `lname`, `email`, `phone`, `password`, `userType`' +
                ') VALUES (?)';
        let hash = crypto
            .createHash('sha1')
            .update(user.password)
            .digest('base64');

        let values = [
            user.fname,
            user.lname,
            user.email,
            user.phone,
            user.userType,
            hash
        ];

        pool.query(sql, [values], function (err, result) {
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to get insert into member, getMemberIDPassword, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
            cb(result.insertId);
        });
    },

    //update a member
    updateMember: function (user, cb) {

        let sql = 'UPDATE `member` SET `fname` = ? , `lname` = ? , `email` = ?, `phone` = ? WHERE memberID = ?';

        let values = [
            user.fname,
            user.lname,
            user.email,
            user.phone,
            user.memberID
        ];

        pool.query(sql, values, function (err, result) {
            if (err){
                logger.log({
                    level: 'error',
                    message: `Failed to update member, updateMember, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
            console.log(result);
            cb(result.insertId);
        });
    },

    //get member details for a specific member ID
    getMember: function (id, cb) {

        let sql = 'SELECT * FROM `member` where memberID = ?';

        pool.query(sql, id, function (err, results, fields) {
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to get select from member, getMember, sql: ${sql}, values: ${id} error: ${err}`
                  });
                throw err;
            }
            if (results.length > 0) {
                return cb(results);
            }
            return cb(results);
        })
    },

    //search member on phone/first name/surname/or email
    searchMembers: function (str, userID, cb) {

        var sql = 'SELECT * FROM `member` WHERE ((`fname` LIKE ?) OR (`lname` LIKE ?) O' +
                'R (`email` LIKE ?) OR (`phone` LIKE ?)) AND memberID NOT IN (?)';
        let values = [
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%',
            userID
        ];
        pool.query(sql, values, function (err, result) {
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to get select from member, searchMembers, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
            cb(result);
        });
    },

    //get member profile pic
    getProfilePic: function (id, cb) {

        let sql = 'SELECT profilePic FROM `member` where memberID = ?'
        pool.query(sql, id, function (err, results, fields) {
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to get select from member, getProfilePic, sql: ${sql}, values: ${id} error: ${err}`
                  });
                throw err;
            }
            
            return cb(results);
        })
    },

    //update profile pic - blob
    updateProfilePic: function (id, pic, cb) {

        let sql = 'UPDATE `member` SET `profilePicPath` = ? WHERE memberID = ?';
        
        let values = [
            pic,
            id
        ];
        
        pool.query(sql, values, function (err, result) {
            if (err) {

                logger.log({
                    level: 'error',
                    message: `Failed to udpate member, updateProfilePic, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
            cb(result);
        });
    }
}