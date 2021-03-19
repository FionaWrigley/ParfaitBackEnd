var mysql = require('mysql');
var _db = require('./dbconfig');
var pool = mysql.createPool(_db);

module.exports = {

    //get list of groups for a specific member
    getGroups: function (memberID, cb) {
        pool.query('SELECT * FROM `parfaitgroup` INNER JOIN `groupmember` ON parfaitgroup.groupID = ' +
                    'groupmember.groupID where groupmember.memberID = "' + memberID + '"', function (err, results, fields) {
                if (err) 
                    throw err;
                return cb(results);
            })
    },

    //create a new group including update of group members table
   // createGroup: function (groupName, groupDescription, groupPic, userList, cb) {
    createGroup: function (group, userID, cb) {

        let userList = group.members;
        let values = [group.name, group.description, null];

        var sql = 'INSERT INTO `parfaitgroup`(`groupName`, `groupDescription`, `groupPic`) VALUES (' +
                '?)';
        

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

                     
                    //generate groupmember records
                    for (i = 0; i < userList.length; i++) {
                        records.push([groupID, userList[i].memberID, true, false]);
                    }

                    records.push([groupID, userID, true, true]); //add current user to group

                    connection.query(sql, [records], (error, results2) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                throw error;
                            });
                        }
                        connection.commit(function (err) {
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

    //delete group including group member entries, 
    
///////////////////////TODO/////////////////////////////////////////
//delete group events

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

    //delete group member, if last group member, also delete group

///////////////////////TODO/////////////////////////////////////////
//delete group event from member && if last group member delete all group events for group
    
deleteGroupMember: function (memberID, groupID, cb) {

        let sql = 'DELETE FROM `groupmember` WHERE `groupID` = ? AND `memberID` = ?';
        
        let values = [
            groupID,
            memberID,
        ];

        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                     throw err;
                    }
                
                    connection.query(sql, values, (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                throw error;
                            });
                        }

                        //check if any other group members exist
                        sql = 'SELECT COUNT(groupID) from `groupMember` WHERE groupID = ' + groupID;
                        
                        connection.query(sql, (error, results) => {
                            if (error) 
                            {
                                return connection.rollback(() => {
                                    connection.release();
                                    throw error;
                                });
                            }
                        
                            //if no other group members exist - delete group
                            if(results < 1){

                                sql = 'DELETE FROM `parfaitgroup` WHERE groupID = ' + groupID;
                                connection.query(sql, (error, results) => {
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
                                        return cb(results);
                                    });
                                })

                            }else{ //other group members exist - do nothing
                                connection
                                .commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            throw err;
                                        });
                                    }
                                    connection.release();
                                    return cb(results);
                                });
                            }
                        })    
                    })
            })
        })
    },

    //set accept flag for a member in a group
    acceptGroup: function (memberID, groupID, cb){
                let sql = 'UPDATE `groupmember` SET `activeFlag` = true WHERE memberID = ? AND groupID = ?';

                let values = [
                    memberID,
                    groupID
                ];
        
                pool.query(sql, values, function (err, result) {
                    if (err) 
                        throw err;
                    cb(result.insertId);
                });
    },

    getGroupSchedule: function (groupID, minDate, maxDate, userID, cb){

        //check the user is in the group ergo can retrieve group records
        let sql = 'SELECT * FROM `groupmember` WHERE memberID = '+ userID+' AND groupID = '+ groupID;

        pool.query(sql, (error, results) => {
            if (error)
                throw error;

            if(results.length > 0){//user is a group member 
            //get all events for all users in group from min date to max date
            sql = 'SELECT parfaitgroup.*, member.memberID, member.fname, member.lname, member.profilePic, groupmember.activeFlag, groupmember.adminFlag, eventmember.acceptedFlag, event.* FROM `parfaitgroup` INNER JOIN `groupmember` on groupmember.groupID = parfaitgroup.groupID INNER JOIN `member` ON member.memberID = groupmember.memberID LEFT JOIN `eventmember` ON member.memberID = eventmember.memberID LEFT JOIN event ON eventmember.eventID = event.eventID WHERE parfaitgroup.groupID =' + groupID 
            + ' AND (event.startDate BETWEEN "'+ minDate + '" AND "'+ maxDate
            + '" OR event.endDate BETWEEN "'+ minDate + '" AND "'+ maxDate
            + '" OR (event.startDate < "'+ minDate + '" AND event.endDate > "'+maxDate+'"))';  

            pool.query(sql, (error, results) => {
                if (error) 
                    throw error; 

                return cb(results);
            }) 
            }else{//user is not in group and should not get schedule data
                cb([]);
            }  
        })
    }
}