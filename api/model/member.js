var mysql = require('mysql');
var _db = require('./dbconfig');


module.exports = {

    authenticate: function (email, password, cb) {

        var connection = mysql.createConnection(_db);
        connection.connect();

        connection.query('SELECT `password` FROM `member` where email = "' + email + '"', function (err, results, fields) {
            if (err) 
                throw err;
            
           if (results.length > 0){
                if (results[0].password == password){
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

        connection.end();

    }
}