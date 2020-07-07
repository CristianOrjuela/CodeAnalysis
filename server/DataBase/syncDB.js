
// Import ModelFactory
let ModelFactory = require('../Models/ModelFactory');

async function syncDB() {
  try {

    let models = ["User", "Driver", "Vehicle", "Rating", "Route", "Status", "Cargo", "Haulage", "Bill", "Driver_Vehicle", 
              "Haulage_Driver_Vehicle", "Notification_Type", "User_Notification", "Driver_Notification"]

    //creating all tables if they dont exist allready
    for (let model of models) {
      await ModelFactory.getModel(model).sync()
    }
    
    logger.info("Server: database tables created if the dont exist");
    
  } catch (err) {
    logger.error("Server: unable to create database tables: "+err)
  }
 }

 module.exports = syncDB