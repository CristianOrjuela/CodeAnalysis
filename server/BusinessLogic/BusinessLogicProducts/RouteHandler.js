//Import controller factory
const ControllerFactory = require("../../Controllers/ControllerFactory")
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Returns the route information
async function getRouteInfo(route_id){
    let route = await ControllerFactory.getController("Route").getRouteInfo(route_id)
    if(route.status == -1){
      logger.error("Route Handler: " +route.data);
      return {status: -1, data: route.data};
    }
    if(route.status == 0){
      logger.error("Route Handler: " +route.data);
      return {status: 0, data: route.data};
    }

    return {status: 1, data: route.data}


}

module.exports = {
    getRouteInfo: getRouteInfo
    };
