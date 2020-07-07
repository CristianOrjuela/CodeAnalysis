
// Import Assert
var assert = require("assert");
var httpMocks  = require('node-mocks-http');

// Import file system
var fs = require('fs');
const path = require("path");

// Import sync database
var syncDB = require("../../DataBase/syncDB.js");

// Import api.js for test
var api = require("../../routes/api");

// Import Business Logic Factory
const businessLogicFactory = require('../../BusinessLogic/BusinessLogicFactory');

// Import Controller Factory
const controllerFactory = require('../../Controllers/ControllerFactory');

// User test
// Driver {nombre: TestDriverName, Apellido: TestDriverLastName, Cedula: 123456, Telefono: 567890, E-Mail: testdrivername@hotmail.com, Direccion: TestDriverDirection, Contraseña: 123456, Foto: "123456"}
// Car {Marca: TestBrand, Modelo: TestModel, Placa: TestPlate, Capadidad: 5, Foto: "/uploads/vehicles/123456.png"}
// Client {nombre: TestClientName, Apellido: TestClientLastName, E-Mail: testclientname@hotmail.com, Direccion: TestClientDirection, Contraseña: 123456}

// Test images
let userPhoto = "data:image/png;base64," + fs.readFileSync(path.resolve(__dirname, './userPhotoTest.png'), 'base64');
let carPhoto = "data:image/png;base64," + fs.readFileSync(path.resolve(__dirname, './carPhotoTest.png'), 'base64');

// Test data
let lastResult = undefined;     // Last result
var db_driver_id = undefined;   // Driver id
var db_driver_id2 = undefined;   // Driver id
var db_user_id = undefined;     // User id
var Id_haulage = undefined;     // Id acarreo


// Check Status Request in functions
async function checkStatusRequest (status, fun, params){

  // Simulate Request and Response
  var req = httpMocks.createRequest(params);
  var res = httpMocks.createResponse();

  // Make equal test
  lastResult = (await fun(req, res));
  assert.equal(lastResult.statusCode, status);

}

// Log client test
describe("Log client test:", async function(){
  
  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If client log request doesn\'t have "error" key',   () => checkStatusRequest(400, api.logClientErrors, {method: 'POST', body: {}}))
    it('If client log request doesn\'t have "message" key', () => checkStatusRequest(400, api.logClientErrors, {method: 'POST', body: {error: {stack: "Stack message"}}}));
    it('If client log request doesn\'t have "stack" key',   () => checkStatusRequest(400, api.logClientErrors, {method: 'POST', body: {error: {message: "Test message"}}}));
  });

  // Good work
  describe("Ok in good work: ", async function() {
    it('If client log works', () => checkStatusRequest(200, api.logClientErrors, {method: 'POST', body: {error: {message: "Test message", stack: "Stack message"}}}));
  });

});

// Driver signup test
describe("Driver signup test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
    // Delete driver notification if exist
    await businessLogicFactory.getBusinessLogic("Notification").deleteByDriverIdentityCard(123456);
    await businessLogicFactory.getBusinessLogic("Notification").deleteByDriverIdentityCard(1234562);
    // Delete test driver if exist
    await controllerFactory.getController("Driver").deleteByIdentityCard(123456);
    await controllerFactory.getController("Driver").deleteByIdentityCard(1234562);
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If driver signup doesn\'t have "request" key',          () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {}}));
    it('If driver signup doesn\'t have "Driver_name" key',      () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_last_name" key', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Identity_card: "123456", Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Identity_card" key',    () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_phone" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_Email" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_address" key',   () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_password" key',  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "Driver_photo" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have "foto_data" key',        () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456"}}}));
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If driver signup doesn\'t have String data type in "Driver_name" key',      () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: 123456, Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_last_name" key', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: 123456, Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have Number data type in "Identity_card" key',    () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: "123456", Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_phone" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: "567890", Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_Email" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: 123456, Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_address" key',   () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: 123456, Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_password" key',  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: 123456, Driver_photo: "123456", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "Driver_photo" key',     () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: 123456, foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have String data type in "foto_data" key',        () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: 12323423}}}));
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    it('If driver signup have digits in "Driver_name" key',                           () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "Test5Driver5Name", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have special characters in "Driver_name" key',               () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "Test_Driver_Name", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_name" key',                               () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: " ", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have digits in "Driver_last_name" key',                      () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "Test5Driver5Last5Name", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have special characters in "Driver_last_name" key',          () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "Test_Driver_Last_Name", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_last_name" key',                          () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: " ", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have numbers <= 0 in "Identity_card" key',                   () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: -123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have decimal number in "Identity_card" key',                 () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456.234, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have numbers <= 0 in "Driver_phone" key',                    () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: -567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have decimal number in "Driver_phone" key',                  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890.345, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup doesn\'t have correct e-mail format in "Driver_Email" key',  () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "sdfsdfsdf", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_Email" key',                              () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: " ", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_address" key',                            () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: " ", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_password" key',                           () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: " ", Driver_photo: "/uploads/drivers/123456.png", foto_data: userPhoto}}}));
    it('If driver signup have empty "Driver_photo" key',                              () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: " ", foto_data: userPhoto}}}));
    it('If driver signup have empty "foto_data" key',                                 () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 12345, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "/uploads/drivers/123456.png", foto_data: " "}}}));

  });

  // Good work
  describe("OK in good work checks: ", async function() {
    
    // Before actions
    beforeEach(async function() {
      // Delete test driver if exist
      await controllerFactory.getController("Driver").deleteByIdentityCard(123456);
    });
    
    it('Should return Created if driver signup works', () => checkStatusRequest(201, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    it('Should return Created if driver signup works with blanks in name and last name', () => checkStatusRequest(201, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "Test Driver Name", Driver_last_name: "Test Driver Last Name", Identity_card: 123456, Driver_phone: 567890, Driver_Email: "testdrivername@hotmail.com", Driver_address: "TestDriverDirection", Driver_password: "123456", Driver_photo: "123456", foto_data: userPhoto}}}));
    
  });

  // Good work
  describe("OK in good work checks: ", async function() {
    
    // Before actions
    before(async function() {
      // Get regiter test driver
    db_driver_id = (await lastResult)._getJSONData().db_driver_id;
      // Delete test driver if exist
      await controllerFactory.getController("Driver").deleteByIdentityCard(1234562);
    });
    
    it('Should return Created if another driver signup works', () => checkStatusRequest(201, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverNameTwo", Driver_last_name: "TestDriverLastNameTwo", Identity_card: 1234562, Driver_phone: 5678902, Driver_Email: "testdrivername2@hotmail.com", Driver_address: "TestDriverDirection2", Driver_password: "1234562", Driver_photo: "1234562", foto_data: userPhoto}}}));
    
  });

  // Good work
  describe("Bad in duplications: ", async function() {
    
    // Before actions
    before(async function() {
      // Get regiter test driver
      db_driver_id2 = (await lastResult)._getJSONData().db_driver_id;
    });

    it('Should return Bad in duplication', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverNameTwo", Driver_last_name: "TestDriverLastNameTwo", Identity_card: 1234562, Driver_phone: 5678902, Driver_Email: "testdrivername2@hotmail.com", Driver_address: "TestDriverDirection2", Driver_password: "1234562", Driver_photo: "1234562", foto_data: userPhoto}}}));
    it('Should return Bad in duplication', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverNameTwo", Driver_last_name: "TestDriverLastNameTwo", Identity_card: 12345622, Driver_phone: 5678902, Driver_Email: "testdrivername2@hotmail.com", Driver_address: "TestDriverDirection2", Driver_password: "1234562", Driver_photo: "1234562", foto_data: userPhoto}}}));
    it('Should return Bad in duplication', () => checkStatusRequest(400, api.driverSignup, {method: 'POST', body: {request: {Driver_name: "TestDriverNameTwo", Driver_last_name: "TestDriverLastNameTwo", Identity_card: 12345622, Driver_phone: 56789022, Driver_Email: "testdrivername2@hotmail.com", Driver_address: "TestDriverDirection2", Driver_password: "1234562", Driver_photo: "1234562", foto_data: userPhoto}}}));
    
  });

});

// Vehicle signup test
describe("Vehicle signup test:", async function() {

  // Before actions
  before(async function() {
    // Delete test vehicle if exist
    await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate");
    await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate2");
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If vehicle signup doesn\'t have "request" key',           () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {}}));
    it('If vehicle signup doesn\'t have "Identity_card" key',     () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "db_driver_id" key',      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Plate" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Brand" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Model" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Payload_capacity" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Photo" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "foto_data" key',         () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", Is_owner: true}}}));
    it('If vehicle signup doesn\'t have "Is_owner" key',          () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto}}}));
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If vehicle signup doesn\'t have Number data type in "Identity_card" key',     () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: "123456", db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have Number data type in "db_driver_id" key',      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: "123", Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Plate" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: 123456, Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Brand" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: 123456, Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Model" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: 123456, Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have Number data type in "Payload_capacity" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: "5", Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "Photo" key',             () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: 123456, foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have String data type in "foto_data" key',         () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: 123456, Is_owner: true}}}));
    it('If vehicle signup doesn\'t have Boolean data type in "Is_owner" key',         () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: "sdfsd"}}}));
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    it('If vehicle signup have numbers <= 0 in "Identity_card" key',    () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: -123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have decimal number in "Identity_card" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456.234, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have numbers <= 0 in "db_driver_id" key',     () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: -234, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have decimal number in "db_driver_id" key',   () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: 2344.3243, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Plate" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: " ", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Brand" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: " ", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Model" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: " ", Payload_capacity: 5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have number <= 0 in "Payload_capacity" key',  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: -5, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "Photo" key',                      () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: " ", foto_data: carPhoto, Is_owner: true}}}));
    it('If vehicle signup have empty "foto_data" key',                  () => checkStatusRequest(400, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 5, Photo: "123456", foto_data: " ", Is_owner: true}}}));
  });

  // Good work
  describe("OK in good work checks: ", async function() {
    
    // Before actions
    before(async function() {
      // Delete test vehicle if exist
      await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate");
      await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate2");
      await controllerFactory.getController("Vehicle").deleteByPlate("TestPlate3");
    });
    
    it('Should return Created if vehicle signup works',  () => checkStatusRequest(201, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 123456, db_driver_id: db_driver_id, Plate: "TestPlate", Brand: "TestBrand", Model: "TestModel", Payload_capacity: 100, Photo: "123456", foto_data: carPhoto, Is_owner: true}}}));
    it('Should return Created if vehicle signup works',  () => checkStatusRequest(201, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 1234562, db_driver_id: db_driver_id2, Plate: "TestPlate2", Brand: "TestBrand2", Model: "TestModel2", Payload_capacity: 100, Photo: "1234562", foto_data: carPhoto, Is_owner: true}}}));

    it('Should return Error if fail',  () => checkStatusRequest(500, api.vehicleSignup, {method: 'POST', body: {request: {Identity_card: 1234562, db_driver_id: 456456456, Plate: "TestPlate3", Brand: "TestBrand2", Model: "TestModel2", Payload_capacity: 100, Photo: "1234562", foto_data: carPhoto, Is_owner: true}}}));


  });

   // Hualage Good work
   describe("OK in good work checks: ", async function() {
    
    it('If driver empty haulage list work', () => checkStatusRequest(200, api.haulageDriverList, {method: 'GET', params: { Id_driver: db_driver_id}}));

  });
  

});

// Client signup test
describe("Client signup test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
     // Delete client notification if exist
     await businessLogicFactory.getBusinessLogic("Notification").deleteByUserEmail("testclientname@hotmail.com");
    // Delete haulage if exist
    await businessLogicFactory.getBusinessLogic("Haulage").deleteByUserEmail("testclientname@hotmail.com");
    // Delete test client if exist
    await controllerFactory.getController("User").deleteByUserEmail("testclientname@hotmail.com");
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If client signup doesn\'t have "request" key',        () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {}}));
    it('If client signup doesn\'t have "User_name" key',      () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_last_name: "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have "User_last_name" key', () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have "User_password" key',  () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have "User_address" key',   () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have "User_Email" key',     () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection" }}}));
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If client signup doesn\'t have String data type in "User_name" key',      () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: 123, User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have String data type in "User_last_name" key', () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  123, User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have String data type in "User_password" key',  () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: 123, User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have String data type in "User_address" key',   () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: 123, User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup doesn\'t have String data type in "User_Email" key',     () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: 123 }}}));
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    it('If client signup have digits in "User_name" key',                   () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "Test2Client2Name", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have special characters in "User_name" key',       () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "Test_Client_Name", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have empty "User_name" key',                       () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: " ", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have digits in "User_last_name" key',              () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "Test2Client2Last2Name", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have special characters in "User_last_name" key',  () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "Test_Client_Last_Name", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have empty "User_last_name" key',                  () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  " ", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have empty "User_password" key',                   () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: " ", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have empty "User_address" key',                    () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: " ", User_Email: "testclientname@hotmail.com" }}}));
    it('If client signup have empty "User_Email" key',                      () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: " " }}}));
  });

  // Good work
  describe("OK in good work checks: ", async function() {
    
    // Before actions
    beforeEach(async function() {
      // Delete test client if exist
      await controllerFactory.getController("User").deleteByUserEmail("testclientname@hotmail.com");
    });
    
    it('Should return Created if client signup works',                                    () => checkStatusRequest(201, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
    it('Should return Created if client signup works with blanks in name and last name',  () => checkStatusRequest(201, api.clientSignup, {method: 'POST', body: {request: { User_name: "Test Client Name", User_last_name:  "Test Client Last Name", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
  });

  // Good work
  describe("OK in good work in PK unique: ", async function() {
    
    it('Should return Bad if client exist',                                    () => checkStatusRequest(400, api.clientSignup, {method: 'POST', body: {request: { User_name: "TestClientName", User_last_name:  "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com" }}}));
  
  });

});

// Login test
describe("Login test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB(); 
    // Insert client user test if doesn't exist
    await businessLogicFactory.getBusinessLogic("User").createUser({body:{request:{User_name: "TestClientName", User_last_name: "TestClientLastName", User_password: "123456", User_address: "TestClientDirection", User_Email: "testclientname@hotmail.com"}}}); 
     // Insert driver user test if doesn't exist
    await businessLogicFactory.getBusinessLogic("Driver").createDriver({body:{request:{Driver_name: "TestDriverName", Driver_last_name: "TestDriverLastName", Driver_password: "123456", Driver_address: "TestDriverDirection", Driver_Email: "testdrivername@hotmail.com", Driver_phone: 567890, Identity_card: 123456, Driver_photo: "/uploads/drivers/123456.png"}}});
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If login doesn\'t have "type_of_user" key',         () => checkStatusRequest(400, api.login, {method: 'POST', body: {}}));
    it('If client login doesn\'t have "request" key',       () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {}}));
    it('If client login doesn\'t have "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_password: "123456"}}}));
    it('If client login doesn\'t have "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com"}}}));
    it('If driver login doesn\'t have "request" key',       () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {}}));
    it('If driver login doesn\'t have "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_password: "123456"}}}));
    it('If driver login doesn\'t have "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testclientname@hotmail.com"}}}));  
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If login doesn\'t have String data type in "type_of_user" key',         () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: 345545}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: "123456"}}}));  
    it('If client login doesn\'t have String data type in "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: 345432345, User_password: "123456"}}}));  
    it('If client login doesn\'t have String data type in "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: 123456}}}));  
    it('If driver login doesn\'t have String data type in "User_Email" key',    () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: 345432345, User_password: "123456"}}}));  
    it('If driver login doesn\'t have String data type in "User_password" key', () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: 123456}}}));  
  });

   // Data format checks
   describe("Bad request in data format checks: ", async function() {
    it('If login doesn\'t have "client" or "driver" values in "type_of_user" key',  () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "asdas"}, body: {request: {User_Email: " ", User_password: "123456"}}}));
    it('If client login have empty "User_Email" key',                               () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: " ", User_password: "123456"}}}));
    it('If client login have empty "User_password" key',                            () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: " "}}}));
    it('If client login doesn\'t have correct e-mail format in "User_Email" key',   () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "234ewrw3", User_password: "123456"}}}));
    it('If driver login have empty "User_Email" key',                               () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: " ", User_password: "123456"}}}));
    it('If driver login have empty "User_password" key',                            () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: " "}}}));
    it('If driver login doesn\'t have correct e-mail format in "User_Email" key',   () => checkStatusRequest(400, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "234ewrw3", User_password: "123456"}}}));
  });

  // Good work
  describe("OK in good work checks: ", async function() {
    it('If client login works', () => checkStatusRequest(200, api.login, {method: 'POST', params: {type_of_user: "client"}, body: {request: {User_Email: "testclientname@hotmail.com", User_password: "123456"}}}));
    it('If driver login works', () => checkStatusRequest(200, api.login, {method: 'POST', params: {type_of_user: "driver"}, body: {request: {User_Email: "testdrivername@hotmail.com", User_password: "123456"}}}));
  });

});

// Haulage create and modify test
describe("Haulage create and modify test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
    // Get regiter test user
    db_user_id =  (await controllerFactory.getController("User").getUserBy({User_Email: "testclientname@hotmail.com"})).data.Id_user;
    // Delete test haulage if exist
    await controllerFactory.getController("Haulage").deleteByIdUser(db_user_id);
    // Delete test caego if exist
    //await controllerFactory.getController("Cargo").deleteByDescription("DescriptionTest");
  });

   // Haulage client Good work 
   describe("OK in Haulage client Good work: ", async function() {
    
    it('Haulage client Good work ', () => checkStatusRequest(200, api.haulageUserList, {method: 'GET', params: { Id_user: db_user_id}}));
  
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {
    it('If haulage create doesn\'t have "request" key',           () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {}}));
    it('If haulage create doesn\'t have "Date" key',              () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
     it('If haulage create doesn\'t have "Year" key',              () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Month" key',             () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Day" key',               () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Hour" key',              () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Minute" key',            () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Origin_coord" key',      () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30} , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Destination_coord" key', () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Description" key',       () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Comments" key',          () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Weight" key',            () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Duration" key',          () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Id_user" key',           () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have "Id_haulage" key',        () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id}}}));
  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    it('If haulage create doesn\'t have Number data type in "Year" key',              () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: "2020", Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Month" key',             () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: "7", Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Day" key',               () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: "24", Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Hour" key',              () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: "4", Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Minute" key',            () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: "30"}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have String data type in "Origin_coord" key',      () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: 123 , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have String data type in "Destination_coord" key', () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: 123, Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have String data type in "Description" key',       () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: 123, Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have String data type in "Comments" key',          () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: 123, Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Weight" key',            () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: "30", Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Duration" key',          () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: "1000*60*30", Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Id_user" key',           () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: "123", Id_haulage: -1}}}));
    it('If haulage create doesn\'t have Number data type in "Id_haulage" key',        () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: "-1"}}}));
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If haulage create have numbers <= 0 in "Year" key',         () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: -2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Year" key',       () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020.234, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Month" key',        () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: -7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Month" key',      () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7.34, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Day" key',          () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: -24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Day" key',        () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24.34, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Hour" key',         () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: -4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Hour" key',       () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4.345, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Minute" key',       () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: -30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Minute" key',     () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30.34}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have empty "Origin_coord" key',           () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: " " , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have empty "Destination_coord" key',      () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: " ", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have empty "Description" key',            () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: " ", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Weight" key',       () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: -30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Duration" key',     () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: -1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Duration" key',   () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000.2343, Id_user: db_user_id, Id_haulage: -1}}}));
    it('If haulage create have numbers <= 0 in "Id_user" key',      () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: -123, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Id_user" key',    () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: 123.234, Id_haulage: -1}}}));
    it('If haulage create have decimal number in "Id_haulage" key', () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "Description", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: 234.234}}}));
    
  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    // Before actions
    beforeEach(async function() {
      // Delete test haulage if exist
      await controllerFactory.getController("Haulage").deleteByIdUser(db_user_id);
    });
    
    it('Should return Created if haulage create works',  () => checkStatusRequest(201, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "DescriptionTest", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));
    it('Should return Created if another haulage create works in the same time',  () => checkStatusRequest(201, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "DescriptionTest", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: -1}}}));

  });

  // Good work modify
  describe("OK in good modify checks: ", async function() {
    
    // Before actions
    beforeEach(async function() {
      // Get regiter test haulage
    Id_haulage = (await lastResult)._getJSONData().Id_haulage;
    });
    
    it('Should return Created if haulage modify works',  () => checkStatusRequest(201, api.haulageCreate, {method: 'POST', body: {request: { Date:{Year: 2020, Month: 7, Day: 24, Hour: 4, Minute: 30}, Origin_coord: "Origin_coord" , Destination_coord: "Destination_coord", Description: "DescriptionTest", Comments: "Comments", Weight: 30, Duration: 1000*60*30, Id_user: db_user_id, Id_haulage: Id_haulage}}}));
    it('Should return Ok if haulage dont\'t have vehicles available for Weight in modify',  () => checkStatusRequest(200, api.haulageCreate, {method: 'POST', body: {"request" : { "Origin_coord": "13,413", "Destination_coord": "534,534", "Weight": 100000000000000000, "Description": "new descr", "Comments": "new comments", "Date": {"Year":2010,"Month":3,"Day":15,"Hour":2,"Minute":3}, "Id_user": db_user_id, "Duration": 2, "Id_haulage":Id_haulage}}}));
    it('Should return Bad Request if haulage doesnt\'t exist in modify',  () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {"request" : { "Origin_coord": "13,413", "Destination_coord": "534,534", "Weight": 10, "Description": "new descr", "Comments": "new comments", "Date": {"Year":2010,"Month":3,"Day":15,"Hour":2,"Minute":3}, "Id_user": db_user_id, "Duration": 2, "Id_haulage":12312}}}));
    it('Should return Bad Request if user doesnt\'t exist in modify',  () => checkStatusRequest(400, api.haulageCreate, {method: 'POST', body: {"request" : { "Origin_coord": "13,413", "Destination_coord": "534,534", "Weight": 10, "Description": "new descr", "Comments": "new comments", "Date": {"Year":2010,"Month":3,"Day":15,"Hour":2,"Minute":3}, "Id_user": 123321, "Duration": 2, "Id_haulage":Id_haulage}}}));
  
  });

});

// User notification test
describe("User notification test:", async function() {

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
  });

  // Bad request structure checks
  describe("Bad request in structure checks: ", async function() {

    it('If User notification doesn\'t have "type_of_user" key', () => checkStatusRequest(400, api.haulageCreate, {method: 'GET', params: { Id: db_driver_id}}));
    it('If User notification doesn\'t have "Id" key',           () => checkStatusRequest(400, api.haulageCreate, {method: 'GET', params: { type_of_user: "Driver"}}));

  });

  // Data type checks
  describe("Bad request in data type checks: ", async function() {
    
    it('If User notification doesn\'t have Number data type in "Id" key',           () => checkStatusRequest(400, api.userNotificationCheck, {method: 'GET', params: { Id: "sdfsdf", type_of_user: "driver"}}));
    it('If User notification doesn\'t have String data type in "type_of_user" key', () => checkStatusRequest(400, api.userNotificationCheck, {method: 'GET', params: { Id: db_driver_id, type_of_user: 34544}}));
    
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If User notification have numbers <= 0 in "Id" key',                                  () => checkStatusRequest(400, api.userNotificationCheck, {method: 'GET', params: { Id: "-2343", type_of_user: "driver"}}));
    it('If User notification have decimal number in in "Id" key',                             () => checkStatusRequest(400, api.userNotificationCheck, {method: 'GET', params: { Id: "234.3423", type_of_user: "driver"}}));
    it('If User notification doesn\'t have "driver" o "client" values in "type_of_user" key', () => checkStatusRequest(400, api.userNotificationCheck, {method: 'GET', params: { Id: db_driver_id.toString(), type_of_user: "sdfd"}}));
    
  });

  // Bad work 
  describe("OK in bad work: ", async function() {
      
    it('Should return Error if Driver notification not work', () => checkStatusRequest(500, api.userNotificationCheck, {method: 'GET', params: { Id: "345345345345345345345345", type_of_user: "driver"}}));
  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    it('Should return Created if Driver notification works', () => checkStatusRequest(200, api.userNotificationCheck, {method: 'GET', params: { Id: db_driver_id.toString(), type_of_user: "driver"}}));
    it('Should return Created if Client notification works', () => checkStatusRequest(200, api.userNotificationCheck, {method: 'GET', params: { Id: db_user_id.toString(), type_of_user: "client"}}));

  });

});

// User notification delete
describe("User notification delete:", async function() {

  let Id_Notification_Type = undefined;

  // Before actions
  before(async function() {
    // DataBase connection
    await syncDB();  
    // get haulage of driver
    let result = (await controllerFactory.getController("Notification").getRegisterBy("Driver", {Id_driver: db_driver_id}))
    Id_haulage = result.data[0].Id_haulage
    Id_Notification_Type = result.data[0].Id_Notification_Type
  });

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If User notification doesn\'t have "driver" o "client" values in "type_of_user" key', () => checkStatusRequest(400, api.userNotificationDelete, {method: 'GET', params: { Id: db_driver_id, type_of_user: "sdfd", Id_haulage: Id_haulage, type_notif: Id_Notification_Type}}));
    
  });

  // Good work delete
  describe("Bad in delete: ", async function() {
      
    it('Should return Created if Driver delete notification not work', () => checkStatusRequest(500, api.userNotificationDelete, {method: 'GET', params: { Id: db_driver_id, type_of_user: "driver", Id_haulage: Id_haulage, type_notif: "sdfsdf"}}));
  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    it('Should return Created if Driver delete notification works', () => checkStatusRequest(200, api.userNotificationDelete, {method: 'GET', params: { Id: db_driver_id, type_of_user: "driver", Id_haulage: Id_haulage, type_notif: Id_Notification_Type}}));
    it('Should return Created if Driver delete notification works', () => checkStatusRequest(200, api.userNotificationDelete, {method: 'GET', params: { Id: db_driver_id, type_of_user: "client", Id_haulage: Id_haulage, type_notif: Id_Notification_Type}}));
  
  });

});

// User haulage list
describe("User haulage list:", async function() {

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If User haulage list not work', () => checkStatusRequest(500, api.haulageUserList, {method: 'GET', params: { Id_user: "sdss"}}));
    
  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    it('If User haulage list work', () => checkStatusRequest(200, api.haulageUserList, {method: 'GET', params: { Id_user: db_user_id}}));
  
  });

});

// Driver haulage list
describe("Driver haulage list:", async function() {

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If User haulage list not work', () => checkStatusRequest(500, api.haulageDriverList, {method: 'GET', params: { Id_driver: "sdss"}}));
    
  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    it('If User haulage list work', () => checkStatusRequest(200, api.haulageDriverList, {method: 'GET', params: { Id_driver: db_driver_id}}));
  
  });

});

// Haulage rate test
describe("Haulage rate test:", async function() {

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If Haulage rate not work', () => checkStatusRequest(500, api.haulageRate, {method: 'POST', body: {Id_haulage: Id_haulage, Puntuality: "asdas", Cargo_state: 3, Customer_support: 4, Comments: "Coments"}}));
    it('If Haulage rate not work', () => checkStatusRequest(500, api.haulageRate, {method: 'POST', body: {Id_haulage: "scdsdf", Puntuality: 5, Cargo_state: 3, Customer_support: 4, Comments: "Coments"}}));
    

  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    it('If Haulage rate work', () => checkStatusRequest(200, api.haulageRate, {method: 'POST', body: {Id_haulage: Id_haulage, Puntuality: 5, Cargo_state: 3, Customer_support: 4, Comments: "Coments"}}));
  
  });

});

// Haulage begin test
describe("Haulage begin test:", async function() {

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If Haulage begin not work', () => checkStatusRequest(500, api.haulageBegin, {method: 'POST', body: {request: {Id_haulage: "sdfsd"}}}));
    
  });

  // Good work create
  describe("OK in good create checks: ", async function() {
    
    it('If Haulage begin work', () => checkStatusRequest(200, api.haulageBegin, {method: 'POST', body: {request: {Id_haulage: Id_haulage}}}));
  
  });

});

// Haulage begin test
describe("Haulage finish test:", async function() {

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If Haulage finish not work', () => checkStatusRequest(500, api.haulageFinish, {method: 'POST', body: {request: {Id_haulage: "sdfsd"}}}));
    
  });

  // Good work create
  describe("OK in good checks: ", async function() {
    
    it('If Haulage finish work', () => checkStatusRequest(200, api.haulageFinish, {method: 'POST', body: {request: {Id_haulage: Id_haulage}}}));
  
  });

});

// Haulage cancel test
describe("Haulage cancel test:", async function() {

  // Data format checks
  describe("Bad request in data format checks: ", async function() {
    
    it('If Haulage cancel not work', () => checkStatusRequest(500, api.haulageCancel, {method: 'POST', body: {request: {Id_haulage: "sdfsd", vehicles: [{driver: {Id_driver: db_driver_id}}]}}}));
    
  });

  // Good work create
  describe("OK in good checks: ", async function() {
    
    it('If Haulage cancel work', () => checkStatusRequest(200, api.haulageCancel, {method: 'POST', body: {request: {Id_haulage: Id_haulage, vehicles: [{driver: {Id_driver: db_driver_id}}]}}}));
  
  });

});

// Redirect test
describe("Redirect test:", async function() {

  // Good work 
  describe("OK in good checks: ", async function() {
    
    it('If Haulage Redirect work', async () => {
      
      // Simulate Request and Response
      var req = httpMocks.createRequest({method: '*'});
      var res = httpMocks.createResponse();

      // Make equal test
      assert.equal(undefined, await api.redirect(req, res));
    
    });
  
  });

});