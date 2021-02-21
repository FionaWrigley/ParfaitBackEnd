const { searchMember } = require('../model/member');
const member = require('../model/member');
var user = require('../model/member');
var authenicate = user.authenticate;

const newmember = {
    fname: "suzie",
    lname: "lovesalot",
    email: "suzie@hotmail.com",
    phone: "0422222222",
    password: "suzie",
    pic: null,
    id: 8
};


//authenicate("bob@hotmail.com", "cheese", logresult); //false
//authenicate("suzie@hotmail.com", "suzie", logresult); //true

//user.memberExists("yeah", logresult); //false
//user.memberExists("suzie@hotmail.com", logresult); //true

//user.createMember(newmember, logresult);
//user.updateMember(newmember, logresult);

//user.getMember(8, logresult);

user.searchMember("0411", logresult);

function logresult(result){
    console.log(result);
}

