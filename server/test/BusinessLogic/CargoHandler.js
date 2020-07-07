
// Import Assert
var assert = require("assert");

// Import api.js for test
const CargoHandler = require('../../BusinessLogic/BusinessLogicProducts/CargoHandler');

// BusinessLogic test
describe("BusinessLogic test:", async function(){
  
    it('If No cargo found with that id', async () => assert.equal(await (await CargoHandler.getCargoInfo(0)).status, 0))
    it('If database cargo error', async () => assert.equal(await (await CargoHandler.getCargoInfo("asdas")).status, -1))
  
});