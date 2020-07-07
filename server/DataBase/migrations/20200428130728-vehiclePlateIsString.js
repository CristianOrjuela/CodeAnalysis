'use strict';
//There was a mistake in the atribute type of vehicle plate, it was int but should be string
//this migration fixes that

// Import logger
const logger = require('./../../utils/logger/logger');

module.exports = {
  up: (queryInterface, Sequelize) => {
    //making change
    return Promise.all([
      queryInterface.changeColumn('Vehicle', 'Plate', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }),
    ]).then(() => {
      logger.info("Migrations/vehiclePlateIsString: Migration completed.");
    })
    .catch(err => {
      logger.error("Migrations/vehiclePlateIsString: Migration failed." + err);
    });
  },
  down: (queryInterface, Sequelize) => {
    //changing data type to integer again
    return Promise.all([
      queryInterface.changeColumn('Vehicle', 'Plate', {
        type: 'INTEGER USING CAST("Plate" as INTEGER)',
        allowNull: false,
        unique: true
    }),
    //removing duplicate constraint that gets created
    queryInterface.removeConstraint("Vehicle", "Vehicle_Plate_key1"),
    ]).then(() => {
      logger.info("Migrations/vehiclePlateIsString: Migration reverted.");
    })
    .catch(err => {
      logger.error("Migrations/vehiclePlateIsString: Migration failed." + err);
    });
  }
};
