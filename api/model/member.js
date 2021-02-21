var mysql = require('mysql');
var _db = require('./dbconfig');
const validator = require('validator');
var crypto = require('crypto');



module.exports = {
    
    authenticate: function (email, password, cb) {
        var connection = mysql.createConnection(_db);
        connection.connect();
        connection.query('SELECT `password` FROM `member` where email = "' + email + '"', function (err, results, fields) {
            if (err) 
                throw err;
           if (results.length > 0){
                
                let hash = crypto.createHash('sha1').update(password).digest('base64');
                if (results[0].password == hash){
                    return cb(true);
                }
            }
               return cb(false);
        })
        connection.end();
    },

    memberExists: function (email, cb) {
      
        var connection = mysql.createConnection(_db);
        connection.connect();
        connection.query('SELECT * FROM `member` where email = "' + email + '"', function (err, results, fields) {
            if (err) 
                throw err;
           if (results.length > 0){
                    return cb(true);  
            }
               return cb(false);
        })
        connection.end();
    },

    createMember: function (newUser, cb){

       var sql = 'INSERT INTO `member`(`memberName`, `memberSurname`, `email`, `phone`, `password`, `profilePic`) VALUES (?)';
       
       let hash = crypto.createHash('sha1').update(newUser.password).digest('base64');
       
       let values = [
           newUser.fname,
           newUser.lname,
           newUser.email,
           newUser.phone,
           hash,
           newUser.pic
       ];
       
       var connection = mysql.createConnection(_db);
        connection.connect();
        connection.query(sql, [values], function (err, result) {
          if (err) throw err;
          cb(result.insertId);
        });

        connection.createQuery
        connection.end();
    },

    updateMember: function (user, cb){
        
        let hash = crypto.createHash('sha1').update(user.password).digest('base64');
        //let sql = 'UPDATE `member` SET `memberName` = ? , `memberSurname` = ? `email` = ?, `phone` = ?, `password` = ?, `profilePic` = ? WHERE id = ?';
        let sql = 'UPDATE `member` SET `memberName` = ? , `memberSurname` = ? , `email` = ?, `phone` = ?, `password` = ?, `profilePic` = ? WHERE memberID = ?';

        let values = [
            user.fname, 
            user.lname, 
            user.email, 
            user.phone, 
            hash, 
            user.pic, 
            user.id];

        var connection = mysql.createConnection(_db);
         connection.connect();
         connection.query(sql, values, function (err, result) {
           if (err) throw err;
           cb(result.insertId);
         });
 
         connection.createQuery
         connection.end();
     },

     getMember: function (id, cb) {
      
        var connection = mysql.createConnection(_db);
        connection.connect();
        connection.query('SELECT * FROM `member` where memberID = "' + id + '"', function (err, results, fields) {
            if (err) 
                throw err;
           if (results.length > 0){
                    return cb(results);  
            }
               return cb(results);
        })
        connection.end();
    },

    searchMember: function (str, cb){

        var sql = 'SELECT * FROM `member` WHERE (`memberName` LIKE ?) OR (`memberSurname` LIKE ?) OR (`email` LIKE ?) OR (`phone` LIKE ?)';
        //var sql  = 'SELECT * FROM `member`';
        let values = [
            '%'+str+'%',
            '%'+str+'%',
            '%'+str+'%',
            '%'+str+'%',
        ];
        var connection = mysql.createConnection(_db);
         connection.connect();
         connection.query(sql, values, function (err, result) {
           if (err) throw err;
            cb(result);
         });
 
         connection.createQuery
         connection.end();
     },


}