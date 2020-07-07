
// Import Assert
var assert = require("assert");

// Import api.js for test
const businessLogicFactory = require('../../BusinessLogic/BusinessLogicFactory');

// BusinessLogic test
describe("Log client test:", async function(){
  
    // Bad result
    it('If getBusinessLogic in is bad return null', () => assert.equal(businessLogicFactory.getBusinessLogic("sfsdf"), null))
  
    // Good result
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Driver_Vehicle"), require("../../BusinessLogic/BusinessLogicProducts/Driver_VehicleHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Driver"), require("../../BusinessLogic/BusinessLogicProducts/DriverHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Fields"), require("../../BusinessLogic/BusinessLogicProducts/FieldsHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Haulage_Driver_Vehicle"), require("../../BusinessLogic/BusinessLogicProducts/Haulage_Driver_VehicleHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Haulage"), require("../../BusinessLogic/BusinessLogicProducts/HaulageHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Image"), require("../../BusinessLogic/BusinessLogicProducts/ImageHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("User"), require("../../BusinessLogic/BusinessLogicProducts/UserHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Vehicle"), require("../../BusinessLogic/BusinessLogicProducts/VehicleHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Cargo"), require("../../BusinessLogic/BusinessLogicProducts/CargoHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Route"), require("../../BusinessLogic/BusinessLogicProducts/RouteHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Status"), require("../../BusinessLogic/BusinessLogicProducts/StatusHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Rating"), require("../../BusinessLogic/BusinessLogicProducts/RatingHandler")))
    it('If getBusinessLogic in is good return import', () => assert.equal(businessLogicFactory.getBusinessLogic("Notification"), require("../../BusinessLogic/BusinessLogicProducts/NotificationHandler")))

});