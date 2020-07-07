
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Return status information
async function getStatusInfo(status_id){
    try{
    var StatusModel = await ModelFactory.getModel("Status")
    let status_info = await StatusModel.findAll(
        { where: { Id_status: status_id } }
        )
    //query returns array of status that match where clause, in this case only 1
    if(status_info.length==0)
    {
        logger.info("StatusController: No status information found with that id")
        return {status:0, data:" No status information found with that id"}
    }
    else{
        logger.info("StatusController: status info found")
        return {status: 1, data: status_info[0].dataValues}
    }

  } catch (error) {
    logger.info("StatusController: "+ error)
    return {status:-1, data:error}
    }
}


// Create Status
async function create(req) {

    try {

        // Get atributes
        const { status_description } = req.body.request;

        // Create Status
        await ModelFactory.getModel("Status").create(
            {
                status_description: status_description
            }
        );
        logger.info("StatusController: Status was created successfully.");
        return 1;

    } catch (error) {
        logger.error("StatusController: " + error);
        return error;
    }

}

module.exports = { create: create, getStatusInfo: getStatusInfo };
