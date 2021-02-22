const {authenticate} = require('../model/member');
const member = require('../model/member');
const group = require('../model/group');
var crypto = require('crypto');

module.exports = {

    login: function (email, password, cb) {

        member
            .authenticate(email, password, function (results) {

                if (results.length > 0) {

                    let hash = crypto
                        .createHash('sha1')
                        .update(password)
                        .digest('base64');
                    if (results[0].password == hash) {
                        
                        group.getGroups(results[0].memberID, function (results) {
                            return cb(results, true); 
                        })
                        
                    }else{ return cb([], false);}
                }else{ return cb([], false);}
            });
    }

    // auth: function (passwords, password){     console.log("in auth func");     if
    // (passwords.length > 0){         let hash =
    // crypto.createHash('sha1').update(password).digest('base64');         if
    // (passwords[0].password == hash){             return result = true;         }
    //    }     console.log(password);     console.log(passwords);     result =
    // false;     return result; }

}