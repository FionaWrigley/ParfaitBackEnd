const {authenticate} = require('../model/member');
const member = require('../model/member');
const group = require('../model/group');
var crypto = require('crypto');
var validator = require('validator');


module.exports = {

    login: function (email, password, cb) {
        member
            .getMemberIDPassword(email, function (results) {

                if (results.length > 0) {
                    let hash = crypto
                        .createHash('sha1')
                        .update(password)
                        .digest('base64');
                    if (results[0].password == hash) {
                            return cb(results[0].memberID); 
                    }else{ return cb(0);}
                }else{ return cb(0);}
            });
    },

    register: function (user, cb) {

        member
            .createMember(user.fname, user.lname, user.email, user.phone, user.password, function (results) {

                //console.log(results);
                if (results) {
                            return cb(results); 
                }else{ return cb(0);}
            });
    },

    searchMembers: function (searchTerm, cb) {

        member.searchMember(searchTerm, function (results) {
            return cb(results);

            })
    },

    getProfilePic: function (id, cb) {

        member
            .getProfilePic(id, function (results) {
               return cb(results); 
                    }
            );
    },

    getProfile: function (id, cb) {
        member
            .getMember(id, function (results) {

               return cb(results);             
                    }
            );
    },  

    updateProfile: function (user, cb) {

        console.log("member services update");
        member
            .updateMember(user, function (results) {

               return cb(results);             
                    }
            );
    },

    updatePic: function (id, image, cb) {

        console.log("in update pic member service");
        //console.log(image);
        // member
        //     .updatePic(id, function (results) {

        //         console.log("get member")
        //         console.log(results);
        //        return cb(results); 
                    
        //             }
        //     );
    }

    // auth: function (passwords, password){     console.log("in auth func");     if
    // (passwords.length > 0){         let hash =
    // crypto.createHash('sha1').update(password).digest('base64');         if
    // (passwords[0].password == hash){             return result = true;         }
    //    }     console.log(password);     console.log(passwords);     result =
    // false;     return result; }

}