var mysql = require('mysql');
var _db = require('./dbconfig');    
var crypto = require('crypto');
var pool = mysql.createPool(_db);

module.exports = {

    getMemberIDPassword: function (email, cb) {
       let sql = 'SELECT `memberID`, `password`, `userType` FROM `member` where email = ?'

    pool.query(sql, email, function (err, results, fields) {
            if (err) 
                throw err;
            return cb(results[0]);
        })
    },

    //check if email already exists
    memberExists: function (email, cb) {

        let sql = 'SELECT * FROM `member` where email = ?';

        pool.query(sql, email, function (err, results, fields) {
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

        var sql = 'INSERT INTO `member`(`fname`, `lname`, `email`, `phone`, `password`' +
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

        console.log('model member update ')
        console.log(user);

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
                console.log(err);
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

        var sql = 'SELECT * FROM `member` WHERE (`fname` LIKE ?) OR (`lname` LIKE ?) O' +
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

        let sql = 'SELECT profilePic FROM `member` where memberID = ?'
        pool.query(sql, id, function (err, results, fields) {
            if (err) 
                throw err;
            
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
            if (err) 
                throw err;
            cb(result);
        });
    }
}