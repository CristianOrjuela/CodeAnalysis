'use strict';
//status description must be unique, this file allows to add or remove unique constraint
//there are 4 types of possibles status, this file can add or remove check   constraint

// Import logger
const logger = require('./../../utils/logger/logger');

module.exports = {
  up: (queryInterface, Sequelize) => {
    //adding constraint
    return Promise.all([
      queryInterface.addConstraint('Status', ['Status_description'], {
        type: 'unique',
        name: 'Status_description_unique'
      }),

      queryInterface.addConstraint('Status', ['Status_description'], {
      type: 'check',
        where: {
            Status_description: ['In progress', 'Reserved', 'Cancelled', 'Done']
        }
      })
    ]).then(() => {
      logger.info("Migrations/statusConstraints: Migration completed.");
    })
    .catch(err => {
      logger.error("Migrations/statusConstraints: Migration failed." + err);
    });
  },

  down: (queryInterface, Sequelize) => {
    //removing constraint
    return Promise.all([
      queryInterface.removeConstraint("Status", "Status_description_unique"),
      queryInterface.removeConstraint("Status", "Status_Status_description_ck")
    ]).then(() => {
      logger.info("Migrations/statusConstraints: Migration reverted.");
    })
    .catch(err => {
      logger.error("Migrations/statusConstraints: Migration failed." + err);
    });
  
  }
};
