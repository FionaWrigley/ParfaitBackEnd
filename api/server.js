//server.js
const app = require("./app");
const port = 5000;


//var express = require('express')
// var fs = require('fs')
// var https = require('https')
//var app = express()



// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app)
app.listen(port, () => console.log(`Parfait listening on port ${port}!`));





