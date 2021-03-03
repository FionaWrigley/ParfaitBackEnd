var mysql = require('mysql');
var _db = require('./dbconfig');
var pool = mysql.createPool(_db);

//const validator = require('validator'); var crypto = require('crypto');

module.exports = {

    getGroups: function (memberID, cb) {

        pool
            .query('SELECT * FROM `parfaitgroup` INNER JOIN `groupmember` ON parfaitgroup.groupID = ' +
                    'groupmember.groupID where groupmember.memberID = "' + memberID + '"', function (err, results, fields) {
                if (err) 
                    throw err;
                
                return cb(results);
            })
    },

    createGroup: function (groupName, groupDescription, groupPic, userList, cb) {

        let groupID = '';
        var sql = 'INSERT INTO `parfaitgroup`(`groupName`, `groupDescription`, `groupPic`) VALUES (' +
                '?)';

        let values = [groupName, groupDescription, groupPic];

        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    throw err;
                }
                connection.query(sql, [values], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            throw err;
                        });
                    }
                    let groupID = results.insertId;
                    let records = [];

                    sql = 'INSERT INTO `groupmember`(`groupID`, `memberID`, `activeFlag`, `adminFlag`) VALU' +
                            'ES ?';

                    for (i = 0; i < userList.length; i++) {
                        records.push([groupID, userList[i].memberID, userList[i].activeFlag, userList[i].adminFlag]);
                    }

                    connection.query(sql, [records], (error, results2) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                throw error;
                            });
                        }
                        connection
                            .commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        connection.release();
                                        throw err;
                                    });
                                }
                                connection.release();
                                return cb('success');
                            });
                    });
                })
            })
        })
    },


    deleteGroup: function (groupID, cb) {
 
        var sql = 'DELETE FROM `groupmember` WHERE `groupID` ='+groupID;

        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    throw err;
                }
                connection.query(sql, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            throw err;
                        });
                    }

                    sql = 'DELETE FROM `parfaitgroup` WHERE `groupID` ='+groupID;

                    connection.query(sql, (error, results2) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                throw error;
                            });
                        }
                        connection
                            .commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        throw err;
                                    });
                                }
                                connection.release();
                                return cb('success');
                            });
                    });
                })
            })
        })
    },

    deleteGroupMember: function (memberID, groupID, cb) {

        sql = 'DELETE FROM `groupmember` WHERE `groupID` = ? AND `memberID` = ?';
        
        let values = [
            groupID,
            memberID,
        ];

        pool.query(sql, values, (error, results) => {
                if (error) 
                    throw error;
                
                return cb(results);
            })
    },

    acceptGroup: function (memberID, groupID, cb){
        //set accepted flag to true for member / group
    },

    getGroupSchedule: function (groupID, cb){
        //get all events for all users in group from current date to 12 months from now
    }
}