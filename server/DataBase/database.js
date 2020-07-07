
// Import logger
const logger = require('./../utils/logger/logger');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'UN-Acarreo', //name of database
    'postgres', //user name
    'admin', //user password
    {
        host: 'localhost', // server name or IP address;
        dialect: 'postgres',
        pool:{
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        logging: false, //by default sequelize prints a lot of messages
        define: {
            // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
            // This was true by default, but now is false by default
            timestamps: false
          }
    }
)
//making connection to database
sequelize
  .authenticate()
  .then(() => {
    logger.info("DataBase: Connection to data base has been established successfully.");
  })
  .catch(err => {
    logger.error("DataBase: Unable to connect to the database: " + err);
  });
module.exports = sequelize;