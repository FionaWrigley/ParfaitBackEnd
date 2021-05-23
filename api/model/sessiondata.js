
let db = require('./db');
let pool = db.getPool();

const {logger} = require('../services/logger');

module.exports = {

    //get list of groups for a specific member
    getSessions: function (cb) {
        let sql = 'SELECT * FROM `sessions`';

        pool.query(sql, function (err, results) {
                if (err) {
                    logger.log({
                        level: 'error',
                        message: `Failed to select from sessions,  sql: ${sql}, error: ${err}`
                      });
                    throw err;
                }
                return cb(results);
            })
    },

    deleteSession: function(id, cb){

        let sql = 'DELETE FROM `sessions` WHERE `session_id` = ? ';

        pool.query(sql, id, function (err, results) {
                if (err) {
                    logger.log({
                        level: 'error',
                        message: `Failed to delete from sessions,  sql: ${sql}, id: ${id} error: ${err}`
                      });
                    throw err;
                }
                return cb(results);
            })
    },

    deleteAllSessions: function(cb){

        let sql = 'DELETE FROM `sessions` WHERE `session_id` IS NOT NULL';

        pool.query(sql, function (err, results) {
                if (err) {
                    logger.log({
                        level: 'error',
                        message: `Failed to delete all sessions,  sql: ${sql} error: ${err}`
                      });
                    throw err;
                }
                return cb(results);
            })
    },

    
}