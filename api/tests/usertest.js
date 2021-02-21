var user = require('../model/member');
var authenicate = user.authenticate;

var tree = authenicate("bob@hotmail.com", "cheese1", logresult);
var britany = user.memberExists("yeah", logresult);

function logresult(result){
    console.log(result);
}

