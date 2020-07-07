
// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create Driver_Vehicle
async function createDriver_Vehicle( Id_driver, Id_vehicle, Is_owner ) {

    // Create Driver_Vehicle
    let result = await ControllerFactory.getController("Driver_Vehicle").create(Id_driver, Id_vehicle, Is_owner)
    logger.info("Driver_VehicleController: Driver_Vehicle was created successfully.");
    if(result.status==1)
        return 1;
    logger.error("Driver_VehicleController: " + result.error);
    return result.error;

}

// Get vehicle by driver id
async function getVehicleByDriverId(id)
{
    //query to find Vehicles by given drivers Id
    let vehicle = await ControllerFactory.getController("Driver_Vehicle").getRegisterBy({Id_driver: id},"Vehicle")  
    
    if(vehicle.status==1) {
        
        logger.info("Driver_VehicleHandler: Driver vehicle found")
        return {status: 1, data: vehicle.data} 
        
    } else if (vehicle.status==0) {
        
        logger.info("Driver_VehicleHandler: id doesnt match known Driver with Vehicle")
        return {status:0, data:"not found"}

    } else {
        
        logger.error("Driver_VehicleHandler: "+ vehicle.error)
        return {status:-1, error:vehicle.error}
    }

}

// Get driver by vehicle id
async function getDriversByVehicleId(Id_vehicle){
    //query to find Vehicles by given drivers Id

    let drivers = await ControllerFactory.getController("Driver_Vehicle").getRegisterBy({Id_vehicle : Id_vehicle},"Driver")  
    
    if(drivers.status==1) {
        
        logger.info("Driver_VehicleHandler: Driver vehicle found")
        return {status: 1, data: drivers.data} 

    } else if(drivers.status==0) {
        
        logger.info("Driver_VehicleHandler: id doesnt match known Driver with Vehicle")
        return {status:0, data:"not found"}

    } else {

        logger.error("Driver_VehicleHandler: "+ drivers.error)
        return {status:-1, error:drivers.error}

    }

}

// Choose free driver
async function chooseFreeDriver(Id_vehicle, bussy_drivers)
{
    console.log(bussy_drivers)
  let drivers = await getDriversByVehicleId(Id_vehicle);
  if(drivers.status!=1){
    logger.error("DriverHandler: Cant get list of drivers");
    return {status: -1, error: drivers.error};
  }
  let chosenDriver
  for (const driver of drivers.data) {
      if(!bussy_drivers.has(driver.Id_driver))
      {
          chosenDriver = driver
      }
  }
  //needs to check if drivers are bussy at hour of haulage
  
  return {status:1, data: chosenDriver};
  
}

module.exports = { 
    createDriver_Vehicle: createDriver_Vehicle,
    getVehicleByDriverId: getVehicleByDriverId,
    getDriversByVehicleId: getDriversByVehicleId,
    chooseFreeDriver: chooseFreeDriver
    };
  