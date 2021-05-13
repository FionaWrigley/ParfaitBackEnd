const {
    authenticate
} = require('../model/member');
const member = require('../model/member');
const group = require('../model/group');
var crypto = require('crypto');
var validator = require('validator');

module.exports = {
    login: function (email, password, cb) {
        member
            .getMemberIDPassword(email, (results) => {

                if (results.length > 0) {

                    if(results[0].activeFlag){
                        let hash = crypto
                            .createHash('sha1')
                            .update(password)
                            .digest('base64');

                        if (results[0].password == hash) {
                            return cb(results[0]);
                        } else {
                            return cb(401);
                        }
                    }else { 
                        return cb(403);
                    }
                } else {
                    return cb(401);
                }
            });
    },

    changePassword: function (id, oldPass, newPass, cb){

        console.log(oldPass, newPass);

        //check password supplied matches existing password
        member
            .getMemberPassword(id, (results) => {
                //existing member has a password
                if (results.length > 0) {

                    //hash password supplied
                    let hash = crypto
                            .createHash('sha1')
                            .update(oldPass)
                            .digest('base64');

                    if (results[0].password == hash) { //supplied password matches current password

                        let newhash = crypto
                            .createHash('sha1')
                            .update(newPass)
                            .digest('base64');

                        member.updatePassword(id, newhash, (result) => {
                            cb(result)
                        })
                    }else{
                        cb(422);
                    }
                }else{
                    return cb(401);
                }

       
        //check hashed value against db password 
            //if no match - 422 invalid password
            //else update password with new value
            })

    },

    getProfilePic: function (id, cb) {
        member
            .getProfilePic(id, function (results) {
                return cb(results);
            });
    }
}