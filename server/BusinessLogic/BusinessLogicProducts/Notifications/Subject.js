// Import logger
const logger = require('../../../utils/logger/logger');
//import observer class
const Observer = require("./Observer").Observer
//import controller factory
const getController = require('../../../Controllers/ControllerFactory').getController;

class Subject {

    constructor() {
        this.notifications = new Set()
    }

    async registerObserver(observer,Id_haulage)
    {
        //console.log("registerObserver"+observer.observer_Id + "haulage "+Id_haulage)
        //create register in DriverNotification table or UserNotification table
        for (const notification of this.notifications) {
            
            let new_notif = await getController("Notification").create(observer.typeObserver,Id_haulage,notification,observer.observer_Id)
            if(new_notif.status==-1)
            {
                logger.error("Subject: in register observer: "+ new_notif.error)
                return {status:-1}
            }
            else
                logger.info("Subject: in register observer: success")
        }
        
    }

    async removeObserver(observer,Id_haulage, type_notif)
    {
        let query
        if(observer.typeObserver=="Driver")
        {
            query = {
                Id_driver:observer.observer_Id,
                Id_haulage:Id_haulage,
                Id_Notification_Type:type_notif

            }
        }else if(observer.typeObserver=="User")
        {
            query = {
                Id_user:observer.observer_Id,
                Id_haulage:Id_haulage,
                Id_Notification_Type:type_notif
            }
        }
        let result = await getController("Notification").remove(observer.typeObserver, query)
        if(result.status==-1)
        {
            logger.error("Subject:removeObserver "+result.error)
            return {status:-1,error:result.error}
        }
        logger.info("Subject:removeObserver ")
        return {status:result.status,data:""}
    }

    async notifyObserver(observer)
    {
        //notify all observers
        //console.log("notifyObserver")
        
        let update = await observer.update()
        if(update.status==-1)
        {
            return {status:-1, error: update.error}
        }
        else{
            return {status:update.status, data: update.data}
        }
        
        
    }
}

module.exports = {Subject:Subject}



