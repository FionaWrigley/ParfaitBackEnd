var mysql = require('mysql');
var _db = require('./dbconfig');
var pool = mysql.createPool(_db);

module.exports = {

    //add an event
    createEvent: function (startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, groupID, memberID, acceptedFlag, cb) {
        let sql = 'INSERT INTO `event`(`startDate`, `startTime`, `endDate`, `endTime`, `eventName`,`eventDescription`, `repeatFrequency`, `repeatUntil`, `groupID`) VALUES (?)';

        let values = [
            startDate,
            startTime,
            endDate,
            endTime,
            eventName,
            eventDesc,
            repeatFrequency,
            repeatUntil,
            0
        ];
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
                    let eventID = results.insertId;
                    sql = 'INSERT INTO `eventmember`(`eventID`, `memberID`, `acceptedFlag`) VALUES (?)';
                    values = [eventID, memberID, acceptedFlag];
                    
                    connection.query(sql, [values], (error, results) => {
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

    deleteEvent: function (eventID, cb) {
        //delete event for all members
        let sql = 'DELETE FROM `eventmember` WHERE `eventID` = ?';
        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    throw err;
                }
                connection.query(sql, eventID, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            throw err;
                        });
                    }

                    sql = 'DELETE FROM `event` WHERE `eventID` = ?';

                    connection.query(sql, eventID, (error, results2) => {
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

    //delete member from event, if no other members share event - delete event.
    deleteMemberEvent: function (eventID, memberID, cb) {
  
        let sql = 'DELETE FROM `eventmember` WHERE `eventID` = ? AND `memberID` = ?';
        let values = [
            eventID,
            memberID
        ]

        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    throw err;
                }
                connection.query(sql, values, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            throw err;
                        });
                    }
                    sql = 'DELETE FROM `event` WHERE `eventID` = ? AND `groupID` = 0';


                    connection.query(sql, eventID, (error, results) => {
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

    editEvent: function  (eventID, startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, cb) {
        
        let sql = 'UPDATE `event` SET `startDate` = ?, `startTime` = ?, `endTime` = ?, `eventName` = ?, `eventDescription` = ?, `eventFrequency` = ?, `repeatUntil` = ?   WHERE eventID = ?';

        let values = [
            eventID,
            startDate,
            startTime,
            endDate,
            endTime,
            eventName,
            eventDesc,
            repeatFrequency,
            repeatUntil
        ];

        pool.query(sql, values, function (err, result) {
            if (err) 
                throw err;
            cb(result.insertId);
        });
    },

    //accepted flag = true where event ID and memberID
    acceptEvent: function (eventID, memberID, cb) {
      
        let sql = 'UPDATE `eventmember` SET `acceptedFlag` = true WHERE memberID = ? AND eventID = ?';

        let values = [
            memberID,
            eventID
        ];

        pool.query(sql, values, function (err, result) {
            if (err) 
                throw err;
            cb(result);
        });
    },

    //get events for a member for a specific date
    getMemberEvents: function (memberID, dateSelected, cb) {
        
        let sql = 'SELECT * FROM `event` INNER JOIN `eventmember` where event.eventID = eventmember.eventID AND eventmember.memberID = ? AND (? BETWEEN event.startDate AND event.endDate) ORDER BY event.startTime DESC';
        let values = [
            memberID,
            dateSelected
        ];

        pool.query(sql, values, function (err, results) { 
            if (err) 
                throw err;
            console.log(results);
            return cb(results);
        })
    },

    //create an event for multiple members
    createGroupEvent: function (startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, groupID, userList, cb) {

        var sql = 'INSERT INTO `event`(`startDate`, `startTime`, `endDate`, `endTime`, `eventName`,`eventDescription`, `repeatFrequency`, `repeatUntil`, `groupID`) VALUES (?)';

        let values = [
            startDate,
            startTime,
            endDate,
            endTime,
            eventName,
            eventDesc,
            repeatFrequency,
            repeatUntil,
            groupID
        ];
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
                    let eventID = results.insertId;
                    let records = [];

                    for (i = 0; i < userList.length; i++) {
                        records.push([eventID, userList[i].memberID, userList[i].acceptedFlag]);
                    }

                    sql = 'INSERT INTO `eventmember`(`eventID`, `memberID`, `acceptedFlag`) VALUES ?';
                    //values = [eventID, memberID, acceptedFlag];
                    
                    connection.query(sql, [records], (error, results) => {
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
    }
}