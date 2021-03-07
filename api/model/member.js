var mysql = require('mysql');
var _db = require('./dbconfig');    
var crypto = require('crypto');
var pool = mysql.createPool(_db);

module.exports = {

    //get user id and password for an email address
    getMemberIDPassword: function (email, cb) {
       
        pool.query('SELECT `memberID`, `password` FROM `member` where email = "' + email + '"', function (err, results, fields) {
            if (err) 
                throw err;
            console.log(results);
            return cb(results);
        })
    },

    //check if email already exists
    memberExists: function (email, cb) {

        pool.query('SELECT * FROM `member` where email = "' + email + '"', function (err, results, fields) {
            if (err) 
                throw err;
            if (results.length > 0) {
                return cb(true);
            }
            return cb(false);
        })
    },

    //create a new member with hashed password
    createMember: function (fname, lname, email, phone, password, cb) {

        console.log("in create member");
        var sql = 'INSERT INTO `member`(`memberName`, `memberSurname`, `email`, `phone`, `password`' +
                ') VALUES (?)';
        let hash = crypto
            .createHash('sha1')
            .update(password)
            .digest('base64');

        let values = [
            fname,
            lname,
            email,
            phone,
            hash
        ];

        pool.query(sql, [values], function (err, result) {
            if (err) 
                throw err;
            cb(result.insertId);
        });
    },

    //update a member
    updateMember: function (user, cb) {

        let hash = crypto
            .createHash('sha1')
            .update(user.password)
            .digest('base64');
        let sql = 'UPDATE `member` SET `memberName` = ? , `memberSurname` = ? , `email` = ?, `phone' +
                '` = ?, `password` = ? WHERE memberID = ?';

        let values = [
            user.fname,
            user.lname,
            user.email,
            user.phone,
            hash,
            user.id
        ];

        pool.query(sql, values, function (err, result) {
            if (err) 
                throw err;
            cb(result.insertId);
        });
    },

    //get member details for a specific member ID
    getMember: function (id, cb) {
        pool.query('SELECT * FROM `member` where memberID = "' + id + '"', function (err, results, fields) {
            if (err) 
                throw err;
            if (results.length > 0) {
                return cb(results);
            }
            return cb(results);
        })
    },

    //search member on phone/first name/surname/or email
    searchMember: function (str, cb) {

        var sql = 'SELECT * FROM `member` WHERE (`memberName` LIKE ?) OR (`memberSurname` LIKE ?) O' +
                'R (`email` LIKE ?) OR (`phone` LIKE ?)';
        let values = [
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%'
        ];
        pool.query(sql, values, function (err, result) {
            if (err) 
                throw err;
            cb(result);
        });
    },

    //get member profile pic
    getProfilePic: function (id, cb) {
        pool.query('SELECT profilePic FROM `member` where memberID = "' + id + '"', function (err, results, fields) {
            if (err) 
                throw err;
            
            return cb(results);
        })
    },

    //update profile pic - blob
    updateProfilePic: function (id, pic, cb) {
    }
}