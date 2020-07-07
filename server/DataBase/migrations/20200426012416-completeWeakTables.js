'use strict';
//This migration updates the Haulage_Driver_Vehicle tables and creates all foreign keys, 
//or deletes them if migration were undone

// Import logger
const logger = require('./../../utils/logger/logger');

module.exports = {
  up: (queryInterface, Sequelize) => {
    //adding all foreign keys
    return Promise.all(
      [
        queryInterface.addConstraint('Haulage_Driver_Vehicle', ['Id_driver'], {
        type: 'foreign key',
        name: 'Haulage_Driver_Id_driver_fkey',
        references: { //Required field
          table: 'Driver',
          field: 'Id_driver'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
        }),

        queryInterface.addConstraint('Haulage_Driver_Vehicle', ['Id_haulage'], {
          type: 'foreign key',
          name: 'Haulage_Driver_Id_haulage_fkey',
          references: { //Required field
            table: 'Haulage',
            field: 'Id_haulage'
          },
          onDelete: 'cascade',
          onUpdate: 'cascade'
          }),

          queryInterface.addConstraint('Haulage_Driver_Vehicle', ['Id_vehicle'], {
            type: 'foreign key',
            name: 'Haulage_Driver_Id_vehicle_fkey',
            references: { //Required field
              table: 'Vehicle',
              field: 'Id_vehicle'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
            })
      ]
    ).then(() => {
      logger.info("Migrations/completeWeakTables: Migration completed.");
    })
    .catch(err => {
      logger.error("Migrations/completeWeakTables: Migration failed." + err);
    });
  },

  down: (queryInterface, Sequelize) => {
    //removing all foreign keys
    return Promise.all([
      queryInterface.removeConstraint("Haulage_Driver_Vehicle", "Haulage_Driver_Id_driver_fkey"),
      queryInterface.removeConstraint("Haulage_Driver_Vehicle", "Haulage_Driver_Id_haulage_fkey"),
      queryInterface.removeConstraint("Haulage_Driver_Vehicle", "Haulage_Driver_Id_vehicle_fkey")
    ]).then(() => {
      logger.info("Migrations/completeWeakTables: Migration reverted.");
    })
    .catch(err => {
      logger.error("Migrations/completeWeakTables: Migration failed." + err);
    });
  }
};
