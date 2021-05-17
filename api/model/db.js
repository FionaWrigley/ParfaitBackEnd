var mysql = require('mysql');
var _dbconfig = require('./dbconfig');

module.exports = mysql.createPool(_dbconfig);