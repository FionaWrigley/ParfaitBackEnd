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

                    let hash = crypto
                        .createHash('sha1')
                        .update(password)
                        .digest('base64');

                    if (results[0].password == hash) {
                        return cb(results[0]);
                    } else {
                        return cb(401);
                    }
                } else {
                    return cb(401);
                }
            });
    },

    getProfilePic: function (id, cb) {

        member
            .getProfilePic(id, function (results) {
                return cb(results);
            });
    },

    updatePic: function (id, pic, cb) {

        //select profile pic
        //if not null delete old pic 
        //save new pic

        member
            .updateProfilePic(id, pic, function (results) {

            });
    }

   

}