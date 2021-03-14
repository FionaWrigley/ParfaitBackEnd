
require('dotenv').config({path: '../.env'});

module.exports = {
    connectionLimit : 10,
    host: process.env.DB_HOST, 
    user: process.env.DB_USER , 
    port: process.env.DB_PORT , 
    database: process.env.DB_DATABASE,
    dateStrings: true
}