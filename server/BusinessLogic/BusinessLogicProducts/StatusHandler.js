// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

const ControllerFactory = require("../../Controllers/ControllerFactory")
// Import logger
const logger = require('../../utils/logger/logger');

//Returns the status information
async function getStatusInfo(status_id){
    let status = await ControllerFactory.getController("Status").getStatusInfo(status_id)
    if(status.status == -1){
      logger.error("status Handler: " +status.data);
      return {status: -1, data: status.data};
    }
    if(status.status == 0){
      logger.error("status Handler: " +status.data);
      return {status: 0, data: status.data};
    }

    return {status: 1, data: status.data}


}

module.exports = {
    getStatusInfo: getStatusInfo
    };
