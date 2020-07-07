
// Import Assert
var assert = require("assert");

// Import Driver Handler
const DriverHandler = require('../../BusinessLogic/BusinessLogicProducts/DriverHandler');

// Import Business Logic Factory
const businessLogicFactory = require('../../BusinessLogic/BusinessLogicFactory');

// Import Controller Factory
const controllerFactory = require('../../Controllers/ControllerFactory');

// Driver handler test
describe("Driver handler test:", async function(){
  
    let id_driver = undefined;

    before(async function() {
        // Insert driver user test if doesn't exist
        await businessLogicFactory.getBusinessLogic("Driver").createDriver({body:{request:{Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Driver_password: "123456", Driver_address: "TestDriverDirection", Driver_Email: "testdrivername@hotmail.com", Driver_phone: 567890, Identity_card: 123456, Driver_photo: "/uploads/drivers/123456.png"}}});
        // Get driver id
        id_driver =  (await controllerFactory.getController("Driver").getRegisterBy({Driver_Email: "testdrivername@hotmail.com"})).data.Id_driver;
    });

    it('If database driver validateDriver error', async () => assert.equal(await (await DriverHandler.validateDriver({body: {request: { Driver_Email: 123, Driver_password:234 }}})).status, -1))
    it('If passwords don\'t match', async () => assert.equal(await (await DriverHandler.validateDriver({body: {request: { Driver_Email: "testdrivername@hotmail.com", Driver_password:"1234567" }}})).status, 0))
    it('If driver is not valid', async () => assert.equal(await (await DriverHandler.validateDriver({body: {request: { Driver_Email: "asdasds@hotmail.com", Driver_password:"123456" }}})).status, 0))

    it('If database driver getDriverInfo error', async () => assert.equal(await (await DriverHandler.getDriverInfo("sdaasd")).status, -1))
    it('If database driver getDriverInfo don\'t match', async () => assert.equal(await (await DriverHandler.getDriverInfo(234234)).status, 0))
    it('If database driver getDriverInfo work', async () => assert.equal(await (await DriverHandler.getDriverInfo(id_driver)).status, 1))


});