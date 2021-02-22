const express = require('express');
var cors = require('cors');
var group = require('./model/group');
var bodyParser = require('body-parser');
var member = require('./services/memberservices');
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(limiter);

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

//app.use('/', routes);
app.get('/', (req, res) => {
    res.send("simon");
});

app.post('/login', (req, res) => {
    if (req.body.user.email && req.body.user.password) {
        member.login(req.body.user.email, req.body.user.password, (results, pass) => {
            if (pass) {
                console.log(results);
                //res.send(results);
            } else {
                console.log('in failed')
                res.sendStatus('401');
            }
        });
    }else{
        res.sendStatus('400');
    }
});

app.get('/groups', (req, res) => {

    group.getGroups(8,(result) => {
        console.log(result);
        res.send(result);
    })

});