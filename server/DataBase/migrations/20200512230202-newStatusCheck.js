'use strict';
const logger = require('./../../utils/logger/logger');
//Im going to add a new status description in the status table, so i need to add this to the check constraint
module.exports = {
  up: (queryInterface, Sequelize) => {
    //adding constraint
    return Promise.all([

      queryInterface.removeConstraint("Status", "Status_Status_description_ck"),

      queryInterface.addConstraint('Status', ['Status_description'], {
      type: 'check',
        where: {
            Status_description: ['In progress', 'Reserved', 'Waiting for driver', 'Cancelled', 'Done']
        }
      })
    ]).then(() => {
      logger.info("Migrations/newStatusCheck: Migration completed.");
    })
    .catch(err => {
      logger.error("Migrations/newStatusCheck: Migration failed." + err);
    });
  },

  down: (queryInterface, Sequelize) => {

    return Promise.all([

      queryInterface.removeConstraint("Status", "Status_Status_description_ck"),

      queryInterface.addConstraint('Status', ['Status_description'], {
        type: 'check',
          where: {
              Status_description: ['In progress', 'Reserved', 'Cancelled', 'Done']
          }
        })
    ]).then(() => {
      logger.info("Migrations/newStatusCheck: Migration reverted.");
    })
    .catch(err => {
      logger.error("Migrations/newStatusCheck: Migration failed." + err);
    });
  }
};
