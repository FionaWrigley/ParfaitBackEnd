var mysql = require('mysql');
var _db = require('./dbconfig');
var pool = mysql.createPool(_db);

module.exports = {

    createEvent: function (startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, groupID, memberID, acceptedFlag, cb) {
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
        var sql = 'DELETE FROM `eventmember` WHERE `eventID` ='+eventID;
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

                    sql = 'DELETE FROM `event` WHERE `eventID` ='+eventID;

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

    deleteMemberEvent: function (eventID, memberID, cb) {
        //delete member from event, if no other members share event - delete event.
        var sql = 'DELETE FROM `eventmember` WHERE `eventID` ='+eventID+ ' AND `memberID` = '+memberID;

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
                    sql = 'DELETE FROM `event` WHERE `eventID` ='+eventID+' AND `groupID` = 0';

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
                                return cb('success');
                            });
                    });
                })
            })
        })
    },

    editEvent: function (cb) {
        //self explanatory
    },

    acceptEvent: function (eventID, memberID, cb) {
        //accepted flag = true where group ID and memberID
    },

    getMemberEvents: function (memberID, dateSelected, cb) {
        //get events for a member for a specific date
    },

    createGroupEvent: function (startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, groupID, memberID, members, accpetedFlag, cb) {
        //create and event for multiple members
    }
}