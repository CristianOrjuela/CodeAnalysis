
// Import Assert
var assert = require("assert");

// Import Driver Handler
const Driver_VehicleHandler = require('../../BusinessLogic/BusinessLogicProducts/Driver_VehicleHandler');

// Import Business Logic Factory
const businessLogicFactory = require('../../BusinessLogic/BusinessLogicFactory');

// Import Controller Factory
const controllerFactory = require('../../Controllers/ControllerFactory');

// Driver handler test
describe("Driver vehicle handler test:", async function(){
    
    let id_driver = undefined;
    let id_vehicle = undefined;

    before(async function() {
        // Insert driver if doesn't exist
        await businessLogicFactory.getBusinessLogic("Driver").createDriver({body:{request:{Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Driver_password: "123456", Driver_address: "TestDriverDirection", Driver_Email: "testdrivernamenovehicle@hotmail.com", Driver_phone: 5678901, Identity_card: 1234567, Driver_photo: "/uploads/drivers/123456.png"}}});
        // Get driver id
        id_driver =  (await controllerFactory.getController("Driver").getRegisterBy({Driver_Email: "testdrivernamenovehicle@hotmail.com"})).data.Id_driver;
        // Insert vehicle if doesn't exist
        await businessLogicFactory.getBusinessLogic("Vehicle").createVehicle({body:{request:{ Plate: "TestPlateNoDriver", Brand: "TestBrandNoDriver", Model: "TestModelNoDriver", Payload_capacity: 100, Photo: "1234567" }}});
        // Get vehicle id
        id_vehicle =  (await controllerFactory.getController("Vehicle").getVehicleBy({Plate: "TestPlateNoDriver"})).data.Id_vehicle;
    });

    it('If database createDriver_Vehicle error', async () => assert.notEqual(await (await Driver_VehicleHandler.createDriver_Vehicle("sdf", "sdf", "sdfd")).status, 1))
    
    it('If database getVehicleByDriverId error', async () => assert.equal(await (await Driver_VehicleHandler.getVehicleByDriverId("sdfd")).status, -1))
    it('If id_driver doesnt match known Driver with Vehicle', async () => assert.equal(await (await Driver_VehicleHandler.getVehicleByDriverId(id_driver)).status, 0))
    
    it('If database getDriversByVehicleId error', async () => assert.equal(await (await Driver_VehicleHandler.getDriversByVehicleId("ssdfs")).status, -1))
    it('If id_vehicle doesnt match known Driver with Vehicle', async () => assert.equal(await (await Driver_VehicleHandler.getDriversByVehicleId(id_vehicle)).status, 0))

    it('If database chooseFreeDriver error', async () => assert.equal(await (await Driver_VehicleHandler.chooseFreeDriver("sfssd",["dfsdf"])).status, -1))

    after(async function() {
        // Delete test vehicle if exist
        await controllerFactory.getController("Vehicle").deleteByPlate("TestPlateNoDriver");
        // Delete test driver if exist
        await controllerFactory.getController("Driver").deleteByIdentityCard(1234567);
    });

});