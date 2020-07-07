
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create Vehicle
async function create(Plate, Brand, Model, Payload_capacity, Photo) {

    try {

        // Create Vehicle
        var result = await ModelFactory.getModel("Vehicle").create(
            {
                Plate: Plate,
                Brand: Brand,
                Model: Model,
                Payload_capacity: Payload_capacity,
                Photo: Photo
            }
        )

        logger.info("VehicleController: Vehicle was created successfully.");
        return {status: 1, data: result.Id_vehicle}
        /*
        logger.info("VehicleController: Vehicle was created successfully.");
        return 1;*/

    } catch (error) {
        logger.error("VehicleController: " + error);
        return {status: -1, error: error};
    }
}

// get all vehicles
async function getAll()
{
    try {
        let vehicles = await ModelFactory.getModel("Vehicle").findAll(
            {
                attributes: ['Id_vehicle','Payload_capacity'],
                raw: true,
                //include: [{model:VehicleModel, atributes: ["Payload_capacity"]}]
            })
        logger.info("VehicleController: list was returned successfully.");
        return {status: 1, data:vehicles}

    } catch (error) {
        logger.error("VehicleController: " + error);
        return {status: -1, error: error};
    }
}

async function getRegisterByPk(Pk,attributes)
{
    try {
        let vehicle = await ModelFactory.getModel("Vehicle").findByPk(Pk,
            {
                attributes: attributes,
                raw: true
            })
        logger.info("VehicleController: list was returned successfully.");
        //console.log("driver: ")
        //console.log(vehicle)
        return {status: 1, data:vehicle}

    } catch (error) {
        logger.error("VehicleController: " + error);
        return {status: -1, error: error};
    }
}

//Return vehicle information
async function getVehicleInfo(vehicle_id){
    try{
    var VehicleModel = await ModelFactory.getModel("Vehicle")
    let vehicle_info = await VehicleModel.findAll(
        { where: { Id_vehicle: vehicle_id } }
        )
    //query returns array of vehicles that match where clause, in this case we expect only 1
    if(vehicle_info.length==0)
    {
        logger.info("VehicleController: No vehicle found with that id")
        return {status:0, data:" No vehicle information found with that id"}
    }
    else{
        logger.info("VehicleController: vehicle info found")
        return {status: 1, data: vehicle_info[0].dataValues}
    }

  } catch (error) {
    logger.info("VehicleController: "+ error)
    return {status:-1, data:error}
    }
}

//Return vehicle information
async function getVehicleBy(query){
    try{
    var VehicleModel = await ModelFactory.getModel("Vehicle")
    let vehicle_info = await VehicleModel.findAll(
        { where: query }
        )
    //query returns array of vehicles that match where clause, in this case we expect only 1
    if(vehicle_info.length==0)
    {
        logger.info("VehicleController: No vehicle found with that id")
        return {status:0, data:" No vehicle information found with that id"}
    }
    else{
        logger.info("VehicleController: vehicle info found")
        return {status: 1, data: vehicle_info[0].dataValues}
    }

  } catch (error) {
    logger.info("VehicleController: "+ error)
    return {status:-1, data:error}
    }
}

async function deleteByPlate(Plate){
    try{

        let driver_info = await ModelFactory.getModel("Vehicle").destroy({ where: { Plate: Plate }})

        //query returns array of drivers that match where clause, in this case we expect only 1
        if(driver_info.length==0)
        {
            logger.info("VehicleController: No vehicle found with that Plate")
            return {status:0, data:" No vehicle information found with that Plate"}
        }
        else{
            logger.info("VehicleController: vehicle was deleted")
            return {status: 1, data: driver_info[0].dataValues}
        }

    } catch (error) {
        logger.info("VehicleController: "+ error)
        return {status:-1, data:error}
    }
}

module.exports = {
    create: create,
    getAll: getAll,
    getRegisterByPk: getRegisterByPk,
    getVehicleInfo: getVehicleInfo,
    getVehicleBy: getVehicleBy,
    deleteByPlate: deleteByPlate
};
