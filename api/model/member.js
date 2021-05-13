var mysql = require('mysql');
var _db = require('./dbconfig');
var crypto = require('crypto');
var pool = mysql.createPool(_db);
const {logger} = require('../services/logger');

module.exports = {
    getMemberIDPassword: function (email, cb) {
        let sql = 'SELECT `memberID`, `password`, `userType`, `activeFlag` FROM `member` where emai' +
                'l = ?'

        pool.query(sql, email, function (err, results, fields) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get select from member, getMemberIDPassword, sql: ${sql}, values: ${email} error: ${err}`});
                throw err;
            }
            return cb(results);
        })
    },

    getMemberPassword: function (id, cb) {
        let sql = 'SELECT `password` FROM `member` where `memberID` = ?';
            

        pool.query(sql, id, function (err, results) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get select from member, getMemberPassword, sql: ${sql}, values: ${id} error: ${err}`});
                throw err;
            }
            return cb(results);
        })
    },

    updatePassword: function (id, pass, cb) {
        let sql = 'UPDATE `member` set `password` = ? where `memberID` = ?';

        values = [
            pass,
            id
        ]
        
        pool.query(sql, values, function (err, results) {
            if (err) {
                logger.log({level: 'error', message: `Failed to udpate password, updatePassword, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            }
            return cb(results);
        })
    },

    //check if email already exists
    memberExists: function (email, cb) {

        let sql = 'SELECT memberID FROM `member` where email = ?';

        pool.query(sql, email, function (err, results, fields) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get select from member, memberExists, sql: ${sql}, values: ${email} error: ${err}`});
                throw err;
            }
            if (results.length > 0) {
                return cb(results[0]); //return memberID
            }
            return cb(0); //return nothing
        })
    },

    //create a new member with hashed password
    createMember: function (user, cb) {

        var sql = 'INSERT INTO `member`(`fname`, `lname`, `email`, `phone`, `password`, `userType`)' +
                ' VALUES (?)';
        let hash = crypto
            .createHash('sha1')
            .update(user.password)
            .digest('base64');

        let values = [
            user.fname,
            user.lname,
            user.email,
            user.phone,
            hash,
            user.userType
        ];

        pool.query(sql, [values], function (err, result) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get insert into member, getMemberIDPassword, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            } else {
                cb(result.insertId);
            }
        });
    },

    //update a member
    updateMember: function (user, cb) {

        let sql = 'UPDATE `member` SET `fname` = ? , `lname` = ? , `email` = ?, `phone` = ? WHERE m' +
                'emberID = ?';

        let values = [user.fname, user.lname, user.email, user.phone, user.memberID];

        pool.query(sql, values, function (err, result) {
            if (err) {
                logger.log({level: 'error', message: `Failed to update member, updateMember, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            }
            cb(result.insertId);
        });
    },

    //get member details for a specific member ID
    getMember: function (id, cb) {

        let sql = 'SELECT `memberID`, `fname`, `lname`, `email`, `phone`, `userType`, `profilePicPa' +
                'th`, `activeFlag` FROM `member` where memberID = ?';

        pool.query(sql, id, function (err, results, fields) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get select from member, getMember, sql: ${sql}, values: ${id} error: ${err}`});
                throw err;
            }
            if (results.length > 0) {
                return cb(results);
            }
            return cb(results);
        })
    },

    //search member on phone/first name/surname/or email
    searchMembers: function (str, userID, cb) {

        var sql = 'SELECT `memberID`, `fname`, `lname`, `email`, `phone`, `userType`, `profilePicPa' +
                'th` FROM `member` WHERE ((`fname` LIKE ?) OR (`lname` LIKE ?) OR (`email` LIKE ?' +
                ') OR (`phone` LIKE ?) OR (`memberID` LIKE ?)) AND memberID NOT IN (?) AND active' +
                'Flag = 1';
        let values = [
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%',
            '%' + str + '%',
            userID
        ];
        pool.query(sql, values, function (err, result) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get select from member, searchMembers, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            }
            cb(result);
        });
    },

    //get member profile pic
    getProfilePic: function (id, cb) {

        let sql = 'SELECT profilePicPath FROM `member` where memberID = ?'
        pool.query(sql, id, function (err, results, fields) {
            if (err) {
                logger.log({level: 'error', message: `Failed to get select from member, getProfilePic, sql: ${sql}, values: ${id} error: ${err}`});
                throw err;
            }
            return cb(results);
        })
    },

    //update profile pic - blob
    updateProfilePic: function (id, pic, cb) {

        let sql = 'UPDATE `member` SET `profilePicPath` = ? WHERE memberID = ?';

        let values = [pic, id];

        pool.query(sql, values, function (err, result) {
            if (err) {

                logger.log({level: 'error', message: `Failed to udpate member, updateProfilePic, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            }
            cb(result);
        });
    },

    updateUserType: function (id, userType, cb) {

        let sql = 'UPDATE `member` SET `userType` = ? WHERE memberID = ?';

        let values = [userType, id];

        pool.query(sql, values, function (err, result) {
            if (err) {

                logger.log({level: 'error', message: `Failed to udpate member, updateUserType, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            }
            cb(result);
        });
    },

    updateActiveFlag: function (id, activeFlag, cb) {

        let sql = 'UPDATE `member` SET `activeFlag` = ? WHERE memberID = ?';

        let values = [activeFlag, id];

        pool.query(sql, values, function (err, result) {
            if (err) {

                logger.log({level: 'error', message: `Failed to udpate member, updateActiveFlag, sql: ${sql}, values: ${values} error: ${err}`});
                throw err;
            }
            cb(result);
        });
    },

    //search member on phone/first name/surname/or email
    getMembers: function (str, userID, cb) {

        let values;
        if (str === '*') {

            var sql = 'SELECT `memberID`, `fname`, `lname`, `email`, `userType`, `profilePicPath`, `act' +
                    'iveFlag` FROM `member` WHERE memberID NOT IN (?)';
            values = userID;

        } else {

            var sql = 'SELECT `memberID`, `fname`, `lname`, `email`, `userType`, `profilePicPath`, `act' +
                    'iveFlag` FROM `member` WHERE ((`fname` LIKE ?) OR (`lname` LIKE ?) OR (`email` L' +
                    'IKE ?) OR (`phone` LIKE ?) OR (`memberID` LIKE ?)) AND memberID NOT IN (?)';
            values = [
                '%' + str + '%',
                '%' + str + '%',
                '%' + str + '%',
                '%' + str + '%',
                '%' + str + '%',
                userID
            ];

        }
        pool
            .query(sql, values, function (err, result) {
                if (err) {
                    logger.log({level: 'error', message: `Failed to get select from member, searchMembers, sql: ${sql}, values: ${values} error: ${err}`});
                    throw err;
                }
                cb(result);
            });
    },

    deleteMember: function (id, cb) {

        //delete events for given user
        let sql = 'DELETE FROM event WHERE eventID in (select eventID from eventmember where member' +
                'ID = ?)';

        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    logger.log({level: 'error', message: `Failed to create connection, createGroup, error: ${err}`});
                    throw err;
                }
                connection.query(sql, id, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            logger.log({level: 'error', message: `Failed to delete user events, sql: ${sql}, values: ${id} error: ${err}`});
                            connection.release();
                            throw err;
                        });
                    }

                    sql = 'DELETE FROM eventmember WHERE memberID = ?';

                    connection.query(sql, id, (err, results) => {
                        if (err) {
                            return connection.rollback(() => {
                                logger.log({level: 'error', message: `Failed to delete member events, sql: ${sql}, values: ${id} error: ${err}`});
                                connection.release();
                                throw err;
                            });
                        }

                        //find groups that will be empty / orphaned on delete of user
                        sql = 'SELECT `groupID` FROM groupmember where groupID in (SELECT `groupID` FROM groupM' +
                                'ember WHERE memberID = ? ) Group BY groupID having count(memberID) = 1';

                        
                        let orphanGroups = [];

                        connection.query(sql, id, (err, results) => {
                            if (err) {
                                return connection.rollback(() => {
                                    logger.log({level: 'error', message: `Failed to select orphan groups, sql: ${sql}, values: ${id} error: ${err}`});
                                    connection.release();
                                    throw err;
                                });

                            }
                            orphanGroups = results;
                            
                            //remove user from all groups
                            sql = 'delete from `groupmember` where `memberID` = ?';
                            connection.query(sql, id, (err, results) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        logger.log({level: 'error', message: `Failed to delete user from groups, sql: ${sql}, values: ${id} error: ${err}`});
                                        connection.release();
                                        throw err;
                                    });

                                }

                                orphanGroups.push('#');
                               
                                //delete orphaned groups
                                sql = 'DELETE FROM `parfaitgroup` WHERE `groupID` IN (?)';
                                connection.query(sql, [orphanGroups], (err, results) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            logger.log({level: 'error', message: `Failed to delete orphaned groups, sql: ${sql}, values: ${orphanGroups} error: ${err}`});
                                            connection.release();
                                            throw err;
                                        });

                                    }
                                

                                    sql = 'DELETE FROM `member` WHERE `memberID` = ?';
                                    connection.query(sql, id, (err, results) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                logger.log({level: 'error', message: `Failed to delete member, sql: ${sql}, values: ${id} error: ${err}`});
                                                connection.release();
                                                throw err;
                                            });

                                        }
                                        connection
                                            .commit(function (err) { //all queries were successful
                                                if (err) {
                                                    return connection.rollback(function () {
                                                        logger.log({level: 'error', message: `Failed to commit, createGroup, error: ${err}`});
                                                        connection.release();
                                                        throw err;
                                                    });
                                                }
                                                connection.release();
                                                return cb('success');
                                            });
                                    })
                                });
                            })
                        })
                    })
                })
            })
        })
    }
    
    


}