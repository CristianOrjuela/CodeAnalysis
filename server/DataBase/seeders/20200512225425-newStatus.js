'use strict';
const logger = require('./../../utils/logger/logger');
module.exports = {
  up: (queryInterface, Sequelize) => {
    //inserting
    return Promise.all([
      queryInterface.bulkInsert('Status', [{Status_description: 'Waiting for driver'}], {}),
    ]).then(() => {
      logger.info("Seeders/newStatus: Insertion complete.");
    })
    .catch(err => {
      logger.error("Seeders/newStatus: Can't insert data: " + err);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
  
       
    ]).then(() => {
      logger.info("Seeders/newStatus: Deletion complete.");
    })
    .catch(err => {
      logger.error("Seeders/newStatus: Can't Delete data: " + err);
    });

  }
};
