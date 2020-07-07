
// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create vehicle
async function createVehicle(req)
{
    // Get atributes
    const { Plate, Brand, Model, Payload_capacity, Photo } = req.body.request;

    // Create Vehicle
    var result = await ControllerFactory.getController("Vehicle").create(Plate, Brand, Model, Payload_capacity, Photo)

    if(result.status==1)
    {
      logger.info("VehicleHandler: Vehicle was created successfully.");

      return {status: 1, data: result.data}
    }
    logger.error("VehicleHandler: " + result.error);
    return {status: -1, message: result.error};
  }

// get list of needed vehicles
// returns 1 if cars are enough or 0 if weight is to high, also returns needed cars list
function getListOfNeededVehicles(free_vehicles,weight)
{
  var needed_vehicles =[]
  var acum_capacity = 0;

  free_vehicles.sort((a,b)=>{
    let a_cap = a.Payload_capacity
    let b_cap = b.Payload_capacity
    //console.log("a:"+a_cap+" : "+typeof(a_cap))
    //console.log("b"+b_cap+" : "+typeof(b_cap))

    if(a_cap>=weight && b_cap>=weight)
    {
      console.log("a_cap>=weight && b_cap>=weight")
      if (a_cap > b_cap) {    
        //console.log("a_cap > b_cap")
        return 1;    
      } else if (a_cap < b_cap) { 
          //console.log("a_cap < b_cap")   
          return -1;    
      } 
    }else if (a_cap > b_cap) {    
      //console.log("a_cap > b_cap")
      return -1;    
    } else if (a_cap < b_cap) { 
        //console.log("a_cap < b_cap")   
        return 1;    
    }    
    return 0;    
  })
  //console.log(free_vehicles)
  for (const element of free_vehicles) {
    let Payload_capacity=element.Payload_capacity;
    if(weight>acum_capacity)
    {
      needed_vehicles.push(element)
      acum_capacity = acum_capacity+Payload_capacity
    }
  }
  if(weight>acum_capacity)
  {
    logger.info("VehicleHandler: not enough cars");
    return {status: 0, data:needed_vehicles};
  }
  else{
    logger.info("VehicleHandler:enough cars");
    return {status: 1, data:needed_vehicles};
  }
}

// Get Free vehicles that are not reserved in date
async function getFreeVehicles(bussyVehicles)
{
  let freeVehicles = []
  var allVehicles = await ControllerFactory.getController("Vehicle").getAll();

  if(allVehicles.status!=1)
  {
    logger.error("VehicleHandler:error getting all vehicles:"+allVehicles.error);
    return {status: -1, error:allVehicles.error};
  }
  for (const vehicle of allVehicles.data) {
    if(!bussyVehicles.has(vehicle.Id_vehicle))
    {
      freeVehicles.push(vehicle)
    }
  }

  logger.info("VehicleHandler:list of free vehciles ready:");
  return {status: 1, data:freeVehicles};

}

async function getVehicleInfo(vehicle_id){
    let vehicle = await ControllerFactory.getController("Vehicle").getVehicleInfo(vehicle_id)
    if(vehicle.status == -1){
      logger.error("vehicle Handler: " +vehicle.data);
      return {status: -1, data: vehicle.data};
    }
    if(vehicle.status == 0){
      logger.error("vehicle Handler: " +vehicle.data);
      return {status: 0, data: vehicle.data};
    }

    return {status: 1, data: vehicle.data}

}


module.exports = {
    getListOfNeededVehicles : getListOfNeededVehicles,
    createVehicle : createVehicle,
    getFreeVehicles: getFreeVehicles,
    getVehicleInfo: getVehicleInfo
  };
