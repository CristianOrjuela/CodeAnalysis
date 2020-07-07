
// Import Assert
var assert = require("assert");

// Import sync database
var syncDB = require("../../DataBase/syncDB.js");

// Import Business Logic Factory
const businessLogicFactory = require('../../BusinessLogic/BusinessLogicFactory');

// Import Controller Factory
const controllerFactory = require('../../Controllers/ControllerFactory');

// Import api.js for test
const UserHandler = require('../../BusinessLogic/BusinessLogicProducts/UserHandler');

// BusinessLogic test
describe("User handler test:", async function(){
  
    // Before actions
    before(async function() {
        // DataBase connection
        await syncDB(); 
        // Insert client user test if doesn't exist
        await businessLogicFactory.getBusinessLogic("User").createUser({body:{request:{User_name: "TestClientName", User_last_name: "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com"}}}); 
    });

    it('If user handler error', async () => assert.equal(await (await UserHandler.validateUser({body:{request:{ User_Email: "testclientname@hotmail.com", User_password: "serewr" }}})).status, 0))
    it('If user handler error', async () => assert.equal(await (await UserHandler.validateUser({body:{request:{ User_Email: "badtestclientname@hotmail.com", User_password: "serewr" }}})).status, 0))
    it('If user handler error', async () => assert.equal(await (await UserHandler.validateUser({body:{request:{ User_Email: 3454, User_password: "serewr" }}})).status, -1))
    it('If user handler error', async () => assert.equal(await (await UserHandler.getUserInfo("sfsdf")).status, -1))


    // After actions
    after(async function() {
        // Delete test client if exist
        await controllerFactory.getController("User").deleteByUserEmail("testclientname@hotmail.com");
    });

});