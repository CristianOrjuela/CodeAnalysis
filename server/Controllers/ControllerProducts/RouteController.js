
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Return route information
async function getRouteInfo(route_id){
    try{
    var RouteModel = await ModelFactory.getModel("Route")
    let route_info = await RouteModel.findAll(
        { where: { Id_route: route_id } }
        )
    //query returns array of routes that match where clause, in this case only 1
    if(route_info.length==0)
    {
        logger.info("RouteController: No route found with that id")
        return {status:0, data:" No route information found with that id"}
    }
    else{
        logger.info("RouteController: route info found")
        return {status: 1, data: route_info[0].dataValues}
    }

  } catch (error) {
    logger.info("RouteController: "+ error)
    return {status:-1, data:error}
    }
}

// Create Route
async function create(req) {

    try {

        // Get atributes
        const { Origin_coord, Destination_coord,Duration } = req;
        //console.log("duracion")
        //console.log(Duration)

        // Create Route
        const new_route = await ModelFactory.getModel("Route").create(
            {
                Origin_coord: Origin_coord,
                Destination_coord: Destination_coord,
                Duration: Duration
            }
        );
        logger.info("RouteController: Route was created successfully.");
        return {status: 1, data: new_route.Id_route};

    } catch (error) {
        logger.error("RouteController: " + error);
        return {status: -1, error: error};
    }

}

module.exports = { create: create, getRouteInfo: getRouteInfo };

/*
async function test(){

    let request_route ={Origin_coord:13241, Destination_coord:13134}
    let req_route ={body:{request:request_route}};
    let route_response = await createRoute(req_route);
    console.log(route_response);
}

test();
*/
