
// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Import status descriptions
const description = require("../../constants").status_description

async function getHaulageList(user_id){
    //count = await ControllerFactory.getController("Haulage").countWhere({Id_user: user_id})
    //count = await ControllerFactory.getController("Haulage").count({ where: { Id_user: user_id} })
    //if(count.status!=1)
    let haulages =await ControllerFactory.getController("Haulage").getHaulages(user_id)
    if(haulages.status == -1){
      logger.error("Haulage Handler: " +haulages.data);
      return {status: -1, data: haulages.data};
    }
    if(haulages.status == 0){
      logger.error("Haulage Handler: " +haulages.data);
      return {status: 0, data: haulages.data};
    }

    return {status: 1, data: haulages.data}


}

//returns status 1 if created succesfully, data is new haulage
//returns status -1 if cargo could not be created, error is returns as well
//returns status -2 if rout could not be created, error is returns as well
//returns status -3 if route and cargo were created but not haulage, error is returns as well
async function createHaulageWithRouteCargo(values)
{
    let route = await ControllerFactory.getController("Route").create({
        Origin_coord: values.Origin_coord, Destination_coord: values.Destination_coord,Duration: values.Duration
      });
      if(route.status==1)
      {
        //route created, creating cargo
        let cargo = await ControllerFactory.getController("Cargo").create({
          Weight: values.Weight, Description: values.Description, Comments: values.Comments
        });
        if(cargo.status==1)
        {
          //cargo created, creating haulage
          let date = new Date(values.Date.Year,values.Date.Month,values.Date.Day,values.Date.Hour,values.Date.Minute)

          let end_date = new Date(date.getTime());
          //values.Duration has duration in hours
          end_date.setTime(end_date.getTime() + values.Duration*60*60*1000);

          let haulage = await ControllerFactory.getController("Haulage").create({
            Date: date, End_date: end_date, Id_user: values.Id_user, Id_route: route.data, Id_cargo: cargo.data
          });
          if(haulage.status == 1)
          {
            logger.info("HaulageHandler: cargo and route of haulage created successfully")
            return{status:1,data:haulage.data};
          }
          else{
            logger.error("HaulageHandler: Could not create haulage: "+ haulage.error)
            return{status:-3,data:haulage.error};
          }
        }
        else{
          logger.error("HaulageHandler: Could not create cargo of haulage: "+ cargo.error)
          return{status:-1,error:cargo.error};
        }
      }
      else
      {
        logger.error("HaulageHandler: Could not create route haulage: "+ route.error)
        return{status:-2,error:route.error};
      }
}

async function getHaulageInfo(Id_haulage)
{
  let haualge = await ControllerFactory.getController("Haulage").getRegisterByPk(Id_haulage)
  if(haualge.status!=1)
  {
    logger.error("HaulageHandler: getHaulageInfo error: "+ haualge.error)
    return{status:-1,error:haualge.error};
  }
  logger.info("HaulageHandler: getHaulageInfo success")
  return{status:1,data: haualge.data}

}

async function setHaulageRating(haulage_id, rating_id)
{
  let haualge = await ControllerFactory.getController("Haulage").setHaulageRating(haulage_id, rating_id)
  if(haualge.status != 1)
  {
    logger.error("HaulageHandler: Haulage rating assignment error: "+ haualge.error)
    return {status: -1, error: haualge.error}
  }
  logger.info("HaulageHandler: Haulage rating assignment success")
  return  {status: 1}
}

async function finishHaulage(Id_haulage)
{

  // Finish haulage and set finish time
  let haualge = await ControllerFactory.getController("Haulage").updateHaulageById(Id_haulage, description.DONE, new Date().getTime(),"End")
  if(haualge.status!=1)
  {
    logger.error("HaulageHandler: finishHaulage error: "+ haualge.error)
    return{status:-1, error:haualge.error};
  }
  logger.info("HaulageHandler: finishHaulage success")

  // Get haulage duration
  haualge = await ControllerFactory.getController("Haulage").getRegisterByPk(Id_haulage)
  if(haualge.status!=1)
  {
    logger.error("HaulageHandler: finishHaulage error: "+ haualge.error)
    return{status:-1,error:haualge.error};
  }
  // In minutes
  let duration = Math.ceil((haualge.data.Date - haualge.data.End_date) / 60000)

  // Get haulage weight
  let cargo = await ControllerFactory.getController("Cargo").getCargoInfo(haualge.data.Id_cargo)
  if(cargo.status!=1)
  {
    logger.error("HaulageHandler: finishHaulage error: "+ cargo.error)
    return{status:-1,error:cargo.error};
  }
  let weight = cargo.data.Weight

  // Cost factor
  let factor = 1
  let cost = duration * weight * factor
  //console.log(duration)
  //console.log(weight)
  //console.log(factor)

  // Create bill of haulage
  haualge = await ControllerFactory.getController("Bill").create({Amount: cost, Id_haulage: Id_haulage})
  if(haualge.status!=1)
  {
    logger.error("HaulageHandler: finishHaulage error: " + haualge.error)
    return{status:-1, error:haualge.error};
  }

  logger.info("HaulageHandler: finishHaulage success")
  return{status:1, data: {Cost: cost, Duration : duration}}

}

async function beginHaulage(Id_haulage)
{
  // Finish haulage and set finish time
  let haualge = await ControllerFactory.getController("Haulage").updateHaulageById(Id_haulage, description.IN_PROGRESS, new Date().getTime(),"Begin")
  if(haualge.status!=1)
  {
    logger.error("HaulageHandler: beginHaulage error: "+ haualge.error)
    return{status:-1, error:haualge.error};
  }
  logger.info("HaulageHandler: beginHaulage success")
  return{status:1, data:"success"};
}

async function cancelHaulage(Id_haulage)
{
  // Cancel the haulage and set finish time
  let haulage = await ControllerFactory.getController("Haulage").updateHaulageById(Id_haulage, description.CANCELLED, new Date().getTime(),"End")
  if(haulage.status!=1)
  {
    logger.error("HaulageHandler: cancelHaulage error: "+ haulage.error)
    return{status:-1, error:haulage.error};
  }
  logger.info("HaulageHandler: cancelHaulage success")
  return{status:1, data:"success"};
}

async function deleteByUserEmail(Email) {

  // Select drivers by Identity_Card
  let result = await ControllerFactory.getController("User").getUserBy({User_Email: Email})

  // Delete notifcations with driver id
  if (result.status != 0) {

      await ControllerFactory.getController("Haulage").deleteByIdUser(result.data.Id_user)

  }

}

async function deleteByUserByPk(Id_haulage) {

  console.log(Id_haulage)
  let result = await ControllerFactory.getController("Haulage").deleteByPk(Id_haulage)

  if(result.status!=1)
  {
    logger.error("HaulageHandler: deleteByUserByPk error: "+ result.error)
    return{status:-1, error:result.error};
  }
  logger.info("HaulageHandler: deleteByUserByPk success")
  return{status:1};

}

module.exports = {
    createHaulageWithRouteCargo: createHaulageWithRouteCargo,
    getHaulageList: getHaulageList,
    getHaulageInfo: getHaulageInfo,
    finishHaulage: finishHaulage,
    setHaulageRating: setHaulageRating,
    deleteByUserEmail: deleteByUserEmail,
    beginHaulage: beginHaulage,
    deleteByUserByPk: deleteByUserByPk,
    cancelHaulage: cancelHaulage
};
