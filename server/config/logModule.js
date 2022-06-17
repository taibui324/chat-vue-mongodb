const winston = require('winston');
const fs = require('fs');
const logDirectory = 'logs';


if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: `${logDirectory}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${logDirectory}/info.log` })
    ]
});

module.exports = { logger };
