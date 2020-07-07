'use strict';
//there are 4 types of possibles status, this file can insert them all (or delete them all)

// Import logger
const logger = require('./../../utils/logger/logger');
//const Status = require('../../Models/Status'); changed
const Status = require('../../Models/ModelProducts/Status');


module.exports = {
  up: (queryInterface, Sequelize) => {
    //inserting
    return Promise.all([
      queryInterface.bulkInsert('Status', [{Status_description: 'In progress'}], {}),
      queryInterface.bulkInsert('Status', [{Status_description: 'Reserved'}], {}),
      queryInterface.bulkInsert('Status', [{Status_description: 'Cancelled'}], {}),
      queryInterface.bulkInsert('Status', [{Status_description: 'Done'}], {})
    ]).then(() => {
      logger.info("Seeders/statusDescription: Insertion complete.");
    })
    .catch(err => {
      logger.error("Seeders/statusDescription: Can't insert data: " + err);
    });

  },

  down: (queryInterface, Sequelize) => {
    //deleting
   return Promise.all([

    Status.truncate({restartIdentity: true, cascade: true})

  ]).then(() => {
    logger.info("Seeders/statusDescription: Deletion complete.");
  })
  .catch(err => {
    logger.error("Seeders/statusDescription: Can't Delete data: " + err);
  });
  }
};
