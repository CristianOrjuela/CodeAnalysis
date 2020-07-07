
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create Haulage_Driver_Vehicle
async function create(Id_haulage, Id_driver, Id_vehicle, Is_active) {

    try {


        // Create Haulage_Driver_Vehicle
        await ModelFactory.getModel("Haulage_Driver_Vehicle").create(
            {
                Id_haulage: Id_haulage,
                Id_driver: Id_driver,
                Id_vehicle: Id_vehicle,
                Is_active: Is_active
            }
        );
        logger.info("Haulage_Driver_VehicleController: Haulage_Driver_Vehicle was created successfully.");
        return {status:1};

    } catch (error) {
        logger.error("Haulage_Driver_VehicleController: " + error);
        return {status:-1,error:error};
    }

}

// get Register by
async function getRegisterBy(query,attributes) {

    try {
        let list = await ModelFactory.getModel("Haulage_Driver_Vehicle").findAll({
            attributes:attributes,
            where:query,
            raw:true
        });
        logger.info("Haulage_Driver_VehicleController: registers found.");
        return {status: 1, data: list};
    } catch (error) {
        logger.error("Haulage_Driver_VehicleController: Error getting list:"+error);
        return {status: -1, error: error};
    }

}


async function getAll(query) {

    try {

        let list = await ModelFactory.getModel("Haulage").findAll({});
        logger.info("Haulage_Driver_VehicleController: list of all registers returned successfully.");
        return {status: 1, data: list};
    } catch (error) {
        logger.error("Haulage_Driver_VehicleController: Error getting list:"+error);
        return {status: -1, error: error};
    }
}

async function getVehiclesAssigned(haulage_id){
    try{
    var Model = await ModelFactory.getModel("Haulage_Driver_Vehicle")
    let driver_vehicle_info = await Model.findAll(
        { where: { Id_haulage: haulage_id } }
        )
    //query returns array of haulage-driver-vehicle
    if(driver_vehicle_info.length==0)
    {
        logger.info("Haulage_Driver_VehicleController: No driver_vehicle_info found with that id")
        return {status:0, data:" No driver_vehicle_info information found with that id"}
    }
    else{
        logger.info("Haulage_Driver_VehicleController: driver_vehicle_info info found")
        return {status: 1, data: driver_vehicle_info}
    }

  } catch (error) {
    logger.info("Haulage_Driver_VehicleController: "+ error)
    return {status:-1, data:error}
    }
}

module.exports = {
    create: create,
    getRegisterBy: getRegisterBy,
    getAll: getAll,
    getVehiclesAssigned: getVehiclesAssigned
 };
