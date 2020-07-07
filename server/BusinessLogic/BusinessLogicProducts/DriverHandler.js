
// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Used to hash password
var bcrypt = require('bcryptjs');

// Create Driver
async function createDriver(req) {
    // Get atributes
    //const { Driver_name, Driver_last_name, Driver_password, Driver_address, Driver_Email, Average_rating, Driver_photo, Driver_phone, Identity_card } = req.body.request;
    const { Driver_name, Driver_last_name, Driver_password, Driver_address, Driver_Email, Driver_phone, Identity_card, Driver_photo } = req.body.request;
    //Hash the password
    var Driver_password_hashed = bcrypt.hashSync(Driver_password, 10);
    // Create Driver
    var result = await ControllerFactory.getController("Driver").create(Driver_name, Driver_last_name, Driver_password_hashed, Driver_address, Driver_Email, Driver_phone, Identity_card, Driver_photo)
    if(result.status==1)
    {
      logger.info("DriverHandler: Driver was created successfully.");
      return {status: 1, data: result.data}
    }
    else{
      logger.error("DriverHandler: " + result.error);
      return {status: -1, message: result.error};
    }
}

// Validate Driver
//status 0 = Driver not found
//status 1 = Driver found, id returned
//status -1 = error in DriverModel.count, error message returned
//status -2 = error in DriverModel.findAll from getDriverByEmail, error message returned
async function validateDriver(req) {
  // Get atributes
  const { Driver_Email, Driver_password } = req.body.request;

  // Validate Driver
  let driver =await ControllerFactory.getController("Driver").getRegisterBy({Driver_Email:Driver_Email})
  if(driver.status==1) {
      //Compare hashed passwords
      if(bcrypt.compareSync(Driver_password, driver.data.Driver_password) == false){
        return {status: 0, data: 'Las contraseñas no coinciden'};
      }
      logger.info("DriverHandler: succesfull call to getDriverByEmail")
      return {status: 1, data: driver.data};
  } else if(driver.status==0) {   
      logger.info("DriverHandler: Driver is not valid");
      return {status: 0, data: false};
  } else {   
      logger.error("DriverHandler: error from getDriverByEmail"+ driver.error)
      return {status: -1, data: driver.error};
  }

}

async function getDriverInfo(driver_id){
    let driver = await ControllerFactory.getController("Driver").getDriverInfo(driver_id)
    if(driver.status == -1){
      logger.error("Driver Handler: " +driver.data);
      return {status: -1, data: driver.data};
    }
    if(driver.status == 0){
      logger.error("driver Handler: " +driver.data);
      return {status: 0, data: driver.data};
    }

    return {status: 1, data: driver.data}

}

module.exports = {
    validateDriver: validateDriver,
    createDriver : createDriver,
    getDriverInfo: getDriverInfo
  };
