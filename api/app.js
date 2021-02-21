const express = require('express');

const port = 5000;

const app = express();
var user = require('./model/connection');
var authenicate = user.authenticate;


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));




app.get('/', (req, res) => {

    if(authenicate("bob@hotmail.com", "cheese")){
        res.send("true");
    }else{
        res.send("false");
    }
    
});