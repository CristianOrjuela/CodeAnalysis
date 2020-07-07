'use strict';
//Previous migration creates a duplitcate constraint for vehicle plate, this one deletes it
//reverting this migration wont result in adding it again.
// Import logger
const logger = require('./../../utils/logger/logger');

module.exports = {
  up: (queryInterface, Sequelize) => {


  //removing constraint
  return Promise.all([
    queryInterface.removeConstraint("Vehicle", "Vehicle_Plate_key1"),
  ]).then(() => {
    logger.info("Migrations/RemovingVehicleDuplicateConstraints: Migration done.");
  })
  .catch(err => {
    logger.error("Migrations/RemovingVehicleDuplicateConstraints: Migration failed." + err);
  });  
   
  },

  down: (queryInterface, Sequelize) => {
    //Not adding duplicate constraints again, this section doesnt do anything
    return Promise.all([
    ]).then(() => {
      logger.info("Migrations/RemovingVehicleDuplicateConstraints: no need to revert this one.");
    })
    .catch(err => {
      logger.error("Migrations/RemovingVehicleDuplicateConstraints: Migration failed." + err);
    });  
   }
};
