const express = require('express');


const port = 5000;

const app = express();
var user = require('./model/dbconfig');
var authenicate = user.authenticate;
const routes = require('./http/routes');


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

app.use('/', routes);


//  app.get('/', (req, res) => {

// //     if(authenicate("bob@hotmail.com", "cheese")){
// //         res.send("true");
// //     }else{
// //         res.send("false");
// //     }
// app.use('/', routes);
// res.send("chicken");


//});