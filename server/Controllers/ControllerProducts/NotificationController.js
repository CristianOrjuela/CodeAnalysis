//importing model factory
const ModelFactory = require('../../Models/ModelFactory');
// Create notification
async function create(type, Id_haulage, Id_Notification_Type, Id) {

    try {
        let model
        let query
        if(type=="User")
        {
            model = "User_Notification"
            query = {
                Id_haulage: Id_haulage,
                Id_Notification_Type: Id_Notification_Type,
                Id_user: Id
            }
        }else if(type=="Driver")
        {
            model = "Driver_Notification"
            query = {
                Id_haulage: Id_haulage,
                Id_Notification_Type: Id_Notification_Type,
                Id_driver: Id
            }
        }
        // Create Driver
        var result = await ModelFactory.getModel(model).create(query)

        logger.info(type+"_NotificationController: notification was created successfully.");
        return {status: 1, data: result}

    } catch (error) {
        logger.error(type+"_NotificationController: " + error);
        return {status: -1, error: error};
    }

}
async function remove(type, query) {

    try {
        // Create Driver or user
        let result = await ModelFactory.getModel(type+"_Notification").destroy({
            where: query
          });
        
        if(result==0)
        {
            //driver had no notifications
            logger.info(type+"_NotificationController:"+type+" had no notifications.");
            return {status: 0, data: ""}
        }

        logger.info(type+"_NotificationController: notification was deleted successfully.");
        return {status: 1, data: ""}

    } catch (error) {
        logger.error(type+"_NotificationController: " + error);
        return {status: -1, error: error};
    }

}

async function getRegisterBy(type, query) {

    //query to find Driver by given email (which is unique)
    try {
        
        let notifications = await ModelFactory.getModel(type+"_Notification").findAll({
            where: query ,
            raw:true
        })
        //query returns array of Drivers that match were clause
        if(notifications.length==0)
        {
            logger.info(type+"_NotificationController:"+type+" has 0 notifications")
            return {status:0, data:"empty"}
        }
        else{
            logger.info("type"+"_NotificationController:notifications found")
            return {status: 1,data: notifications}
        }

    } catch (error) {
        logger.error("type"+"_NotificationController: "+ error)
        return {status:-1, error:error}

    }
}

module.exports = 
{
    create:create,
    getRegisterBy:getRegisterBy,
    remove:remove
}