const express = require('express');
const app = express();

module.exports = function () {

    // app.post('/login', (req, res) => {

    //     // res.writeHead(300, {'Content-Type': 'application/json'});
    //     console.log(req.body.user.email);
    //     console.log(req.body.user.password);

    //     // let valid = false; members.map((element, index) => {     if (element.email ==
    //     // req.body.user.email) {         valid = true;     } }) if (valid) {     res
    //     //      .status(200); } else {     res.sendStatus(401); }

    //     res.send('login');
    // });

    app.get('/', (req, res) => {

        // //     if(authenicate("bob@hotmail.com", "cheese")){ //
        // res.send("true"); //     }else{ //         res.send("false"); //     }
        // app.use('/', routes);
        res.send("simon");

    });

}