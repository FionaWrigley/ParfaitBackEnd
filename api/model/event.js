var mysql = require('mysql');
var _db = require('./dbconfig');
var pool = mysql.createPool(_db);
const {logger} = require('../services/logger');

module.exports = {

    //add an event
    createEvent: function (event, userID, cb) {
        let sql = 'INSERT INTO `event`(`startDate`, `startTime`, `endDate`, `endTime`, `eventName`,`eventDescription`, `repeatFrequency`, `repeatUntil`, `groupID`) VALUES (?)';

        let values = [
            event.startDate,
            event.startTime,
            event.endDate,
            event.endTime,
            event.eventName,
            event.eventDescription,
            event.frequency,
            event.repeatUntil,
            0
        ];
        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    logger.log({
                        level: 'error',
                        message: `Failed to create connection, createEvent, error: ${err}`
                      });
                    throw err;
                }
                connection.query(sql, [values], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            logger.log({
                                level: 'error',
                                message: `Failed to insert into event, sql: ${sql}, values: ${values} error: ${err}`
                              });
                            connection.release();
                            throw err;
                        });
                    }
                    let eventID = results.insertId;
                    sql = 'INSERT INTO `eventmember`(`eventID`, `memberID`, `acceptedFlag`) VALUES (?)';
                    values = [eventID, userID, true];
                    
                    connection.query(sql, [values], (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                logger.log({
                                    level: 'error',
                                    message: `Failed to insert into eventmember, sql: ${sql}, values: ${values} error: ${err}`
                                  });
                                connection.release();
                                throw error;
                            });
                        }
                        connection
                            .commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        logger.log({
                                            level: 'error',
                                            message: `Failed to commit, create event, error: ${err}`
                                          });
                                        connection.release();
                                        throw err;
                                    });
                                }
                                connection.release();
                                return cb(eventID);
                            });
                    });
                })
            })
        })
    },

    deleteEvent: function (eventID, userID, cb) {
        //delete event for all members
        let sql = 'DELETE FROM `eventmember` WHERE `eventID` = ?';
        pool.getConnection((err, connection) => {
            connection.beginTransaction((err) => {
                if (err) {
                    logger.log({
                        level: 'error',
                        message: `Failed to create connection, deleteEvent, error: ${err}`
                      });
                    throw err;
                }
                connection.query(sql, eventID, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            logger.log({
                                level: 'error',
                                message: `Failed to delete from eventmember, sql: ${sql}, values: ${eventID} error: ${err}`
                              });
                            connection.release();
                            throw err;
                        });
                    }

                    sql = 'DELETE FROM `event` WHERE `eventID` = ?';

                    connection.query(sql, eventID, (error, results2) => {
                        if (error) {
                            return connection.rollback(() => {
                                logger.log({
                                    level: 'error',
                                    message: `Failed to delete from event, sql: ${sql}, values: ${eventID} error: ${err}`
                                  });
                                connection.release();
                                throw error;
                            });
                        }
                        connection
                            .commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        logger.log({
                                            level: 'error',
                                            message: `Failed to commit, deleteEvent, error: ${err}`
                                          });
                                        connection.release();
                                        throw err;
                                    });
                                }
                                connection.release();
                                return cb(1);
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
                    logger.log({
                        level: 'error',
                        message: `Failed to create connection, deleteMemberEvent, error: ${err}`
                      });
                    throw err;
                }
                connection.query(sql, values, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            logger.log({
                                level: 'error',
                                message: `Failed to delete from eventmember, sql: ${sql}, values: ${values} error: ${err}`
                              });
                            connection.release();
                            throw err;
                        });
                    }
                    sql = 'DELETE FROM `event` WHERE `eventID` = ? AND `groupID` = 0';


                    connection.query(sql, eventID, (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                logger.log({
                                    level: 'error',
                                    message: `Failed to delete from event, sql: ${sql}, values: ${eventID} error: ${err}`
                                  });
                                connection.release();
                                throw error;
                            });
                        }
                        connection
                            .commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        logger.log({
                                            level: 'error',
                                            message: `Failed to commit, deleteMemberEvent, error: ${err}`
                                          });
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
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to udpate event, editEvent, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
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
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to update eventmember, acceptEvent, event, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
            cb(result);
        });
    },

    //get events for a member for a specific date
    getMemberEvents: function (memberID, dateSelected, cb) {
        
        let sql = 'SELECT * FROM `event` INNER JOIN `eventmember` where event.eventID = eventmember.eventID AND eventmember.memberID = ? AND (? BETWEEN event.startDate AND event.endDate) ORDER BY event.startDate, event.startTime';
        let values = [
            memberID,
            dateSelected
        ];

        pool.query(sql, values, function (err, results) { 
            if (err) {
                logger.log({
                    level: 'error',
                    message: `Failed to select from event, getMemberEvents, sql: ${sql}, values: ${values} error: ${err}`
                  });
                throw err;
            }
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
                    logger.log({
                        level: 'error',
                        message: `Failed to create connection, createGroupEvent, error: ${err}`
                      });
                    throw err;
                }
                connection.query(sql, [values], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            logger.log({
                                level: 'error',
                                message: `Failed to insert into event, createGroupEvent, sql: ${sql}, values: ${values} error: ${err}`
                              });
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
                   
                    
                    connection.query(sql, [records], (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                logger.log({
                                    level: 'error',
                                    message: `Failed to insert into eventmember, createGroupEvent, sql: ${sql}, values: ${records} error: ${err}`
                                  });
                                connection.release();
                                throw error;
                            });
                        }
                        connection
                            .commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        logger.log({
                                            level: 'error',
                                            message: `Failed to commit, createGroupEvent, error: ${err}`
                                          });
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

    getGroupEvents: function (minDate, maxDate, userList, cb){
   
            //get all events for all users in group from min date to max date
            sql = 'SELECT eventmember.memberID, eventmember.acceptedFlag, event.*'
            + ' FROM `eventmember` INNER JOIN event ON eventmember.eventID = event.eventID' 
            + ' WHERE eventmember.memberID IN (?) AND'
            + ' (event.startDate BETWEEN ? AND ?'
            + ' OR event.endDate BETWEEN ?  AND ?'
            + ' OR (event.startDate < ? AND event.endDate > ?))';

            values = [
                userList,
                minDate,
                maxDate,
                minDate,
                maxDate,
                minDate,
                maxDate
            ]

            pool.query(sql, values, (error, results) => {
                if (error) {
                    logger.log({
                        level: 'error',
                        message: `Failed to get group schedules, getGroupSchedule, sql: ${sql}, values: ${values} error: ${err}`
                      });
                    throw error; 
                }
                return cb(results);
            }) 
    },
}