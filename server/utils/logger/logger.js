
// Import modules for make logger
const {createLogger, format, transports} = require('winston');

// create and export logger
var logger = createLogger({     

    // Set simple format
    format: format.combine(                        
        format.simple(), 
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] : ${info.level} : ${info.message}`)
    ),      

    // Set transports types
    transports: [                                   
        
        // In files
        new transports.File({
            maxsize: 5120000,                       // Max bits
            maxFiles: 5,                            // Max files (If files fill up the first file is deleted)
            filename: `${__dirname}/logs/log.log`   // Logs location
        }),

        // In Console
        new transports.Console({level: 'debug'})

    ]

})

module.exports = global.logger = logger;

/*
    Logger call types

    logger.error('text');       // Error message
    logger.warn('text');        // Warning message
    logger.info('text');        // Info message
    logger.verbose('text');     // Detailed message
    logger.debug('text');       // Debug message

*/