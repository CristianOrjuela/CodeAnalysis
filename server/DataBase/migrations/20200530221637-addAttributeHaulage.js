'use strict';
// Import logger
const logger = require('./../../utils/logger/logger');
module.exports = {

  // Add End_date column
  up: (queryInterface, Sequelize) => {
    //adding constraint
    return Promise.all([

      queryInterface.addColumn(
        'Haulage',
        'End_date',
        Sequelize.DATE
      )

    ]).then(() => {
      logger.info("Migrations/addAttributeHaulage: Migration completed.");
    })
    .catch(err => {
      logger.error("Migrations/addAttributeHaulage: Migration failed." + err);
    });
  },

  // Remove End_date column
  down: (queryInterface, Sequelize) => {

    return Promise.all([

      queryInterface.removeColumn(
        'Haulage',
        'End_date'
      )

    ]).then(() => {
      logger.info("Migrations/addAttributeHaulage: Migration reverted.");
    })
    .catch(err => {
      logger.error("Migrations/addAttributeHaulage: Migration failed." + err);
    });
  }

};
