
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create Driver_Vehicle
async function create( Id_driver, Id_vehicle, Is_owner ) {

    try {

        // Get atributes
        //const { Id_driver, Id_vehicle, Is_owner } = req.body.request;

        // Create Driver_Vehicle
        await ModelFactory.getModel("Driver_Vehicle").create(
            {
                Id_driver: Id_driver,
                Id_vehicle: Id_vehicle,
                Is_owner: Is_owner
            }
        )
        logger.info("Driver_VehicleController: Driver_Vehicle was created successfully.");
        return {status: 1};

    } catch (error) {
        logger.error("Driver_VehicleController: " + error);
        return {status:-1, error:error};
    }
}

//status 0 = Driver not found
//status 1 = Driver found, Driver returned
//status -1 = error, error message returned
async function getRegisterBy(query, registerToGet)
{
    //query to find Driver by given email (which is unique)
    try {
        let registers;
        if(registerToGet=="Vehicle")
        { 
            registers = await  ModelFactory.getModel("Driver").findAll(
                { where:  query , 
                  attributes: [],
                  include: [{model: ModelFactory.getModel("Vehicle"), required: true}]
                }
            )
        }else if(registerToGet=="Driver")
        {
            registers = await ModelFactory.getModel("Driver_Vehicle").findAll({
                where: query,
                raw:true
            })
        }
        //query returns array of Drivers or vehicles that match were clause
        if(registers.length==0)

        {
            logger.info("Driver_VehicleController: id doesnt match known Driver with Vehicle")
            return {status:0, data:"not found"}
        }
        else{
            logger.info("Driver_VehicleController: Driver vehicle found")
            if(registerToGet=="Vehicle")
            {
                return {status: 1,data: registers[0].dataValues} 
            }else if(registerToGet=="Driver")
            {
                return {status: 1,data: registers}
            }
            
        }
              
    } catch (error) {
        logger.error("Driver_VehicleController: "+ error)
        return {status:-1, error:error}
        
    }
}

module.exports = {
    create: create,
    getRegisterBy: getRegisterBy
};
