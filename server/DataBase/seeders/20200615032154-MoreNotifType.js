'use strict';
const logger = require('./../../utils/logger/logger');
module.exports = {
  up: (queryInterface, Sequelize) => {
    //inserting
    return Promise.all([
      queryInterface.bulkInsert('Notification_Type', [{Description: 'Haulage has begun'}], {}),
    ]).then(() => {
      logger.info("Seeders/newNotifType: Insertion complete.");
    })
    .catch(err => {
      logger.error("Seeders/newNotifType: Can't insert data: " + err);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
  
      //not doing anything if reversed
   ]).then(() => {
     logger.info("Seeders/newStatus: Deletion complete.");
   })
   .catch(err => {
     logger.error("Seeders/newStatus: Can't Delete data: " + err);
   });
  }
};
