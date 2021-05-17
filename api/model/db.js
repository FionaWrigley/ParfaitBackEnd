var mysql = require('mysql');
var _dbconfig = require('./dbconfig');

const pool = mysql.createPool(_dbconfig);

module.exports = pool;