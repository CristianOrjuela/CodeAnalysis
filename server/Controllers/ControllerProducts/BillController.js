
// Import ModelFactory
let ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create Bill
async function create(req) {

    try {

        // Get atributes
        const { Amount, Id_haulage } = req;

        // Create Bill
        await ModelFactory.getModel("Bill").create(
            {
              Amount: Amount,
              Id_haulage: Id_haulage
            },
            {
                fields: ["Amount", "Id_haulage"]
            }
        );
        logger.info("BillController: Bill was created successfully.");
        return {status:1};
        
    } catch (error) {
        logger.error("BillController: " + error);
        return {status:-1, error: error};
    }

}

async function getRegisterBy(query)
{
    //query to find Bill by given query
    try {

        let bill = await ModelFactory.getModel("Bill").findAll(
            { where: query }
            )
        //query returns array of bills that match were clause
        if(bill.length==0)
        {
            logger.info("BillController/getRegisterBy: no bills found")
            return {status:0, data:"not found"}
        }
        else{
            logger.info("BillController/getRegisterBy: Bill found")
            //bill[0] should be the only bill in array, .dataValues is Json containing atributes
            return {status: 1,data: bill[0].dataValues}
        }

    } catch (error) {
        logger.info("BillController/getRegisterBy: "+ error)
        return {status:-1, error:error}

    }
}

module.exports = { 
    create: create,
    getRegisterBy:getRegisterBy 
};
