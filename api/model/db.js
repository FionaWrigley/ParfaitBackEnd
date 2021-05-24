var mysql = require('mysql');
var _dbconfig = require('./dbconfig');

let pool;

module.exports = {

    getPool: function () {
        if (pool){          
            return pool; // if it is already there, grab it here

        }else{
        pool = mysql.createPool(_dbconfig);
        return pool;
    
        }
    }
}