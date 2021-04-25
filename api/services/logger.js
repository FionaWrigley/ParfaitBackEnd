const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

//create logger
const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), json() ),
    defaultMeta: { service: 'user-service' },
    transports: [
      // Write all logs with level `error` and below to `error.log`
      new transports.File({ filename: '/logs/error.log', level: 'error' }),
      // Write all logs with level `info` and below to `combined.log`
      new transports.File({ filename: '/logs/combined.log' }),
    ],
  });

  module.exports = {
    logger
  }