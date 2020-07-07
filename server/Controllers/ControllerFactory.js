
// Pattern Design Factory to allow Controller access
class ControllerFactory {

    // Get controller acording to String type
    static getController(type) {
        switch (type) {
            case "Bill":
                return require("./ControllerProducts/BillController");
            case "Cargo":
                return require("./ControllerProducts/CargoController");
            case "Driver_Vehicle":
                return require("./ControllerProducts/Driver_VehicleController");
            case "Driver":
                return require("./ControllerProducts/DriverController");
            case "Haulage_Driver_Vehicle":
                return require("./ControllerProducts/Haulage_Driver_VehicleController");
            case "Haulage":
                return require("./ControllerProducts/HaulageController");
            case "Rating":
                return require("./ControllerProducts/RatingController");
            case "Route":
                return require("./ControllerProducts/RouteController");
            case "Status":
                return require("./ControllerProducts/StatusController");
            case "User":
                return require("./ControllerProducts/UserController");
            case "Vehicle":
                return require("./ControllerProducts/VehicleController");
            case "Notification":
                return require("./ControllerProducts/NotificationController");
            default:
                return null;
        }
    }
}

module.exports = ControllerFactory;