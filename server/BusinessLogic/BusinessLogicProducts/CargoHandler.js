// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Returns the cargo information
async function getCargoInfo(cargo_id){
    let cargo = await ControllerFactory.getController("Cargo").getCargoInfo(cargo_id)
    if(cargo.status == -1){
      logger.error("Cargo Handler: " +cargo.data);
      return {status: -1, data: cargo.data};
    }
    if(cargo.status == 0){
      logger.error("cargo Handler: " +cargo.data);
      return {status: 0, data: cargo.data};
    }

    return {status: 1, data: cargo.data}


}

module.exports = {
    getCargoInfo: getCargoInfo
    };
