
// Pattern Design Factory to allow Models access
class ModelFactory {

    // Get model acording to String type
    static getModel(type) {
        switch (type) {
            case "Bill":
                return require("./ModelProducts/Bill");
            case "Cargo":
                return require("./ModelProducts/Cargo");
            case "Driver_Notification":
                return require("./ModelProducts/Driver_Notification");
            case "Driver_Vehicle":
                return require("./ModelProducts/Driver_Vehicle");
            case "Driver":
                return require("./ModelProducts/Driver");
            case "Haulage_Driver_Vehicle":
                return require("./ModelProducts/Haulage_Driver_Vehicle");
            case "Haulage":
                return require("./ModelProducts/Haulage");
            case "Notification_Type":
                return require("./ModelProducts/Notification_Type");
            case "Rating":
                return require("./ModelProducts/Rating");
            case "Route":
                return require("./ModelProducts/Route");
            case "Status":
                return require("./ModelProducts/Status");
            case "User_Notification":
                return require("./ModelProducts/User_Notification");
            case "User":
                return require("./ModelProducts/User");
            case "Vehicle":
                return require("./ModelProducts/Vehicle");
            default:
                return null;
        }
    }
}

module.exports = ModelFactory;