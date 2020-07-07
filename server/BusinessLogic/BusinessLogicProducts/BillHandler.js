// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

async function getBillInfo(Id_haulage)
{
    //gets info of bill from db, if there is no bill returns status 0
    let bill = await ControllerFactory.getController("Bill").getRegisterBy({Id_haulage:Id_haulage})
    if(bill.status==1)
    {
        logger.info("BillHandler/getBillInfo:Success")
        return {status:1, data:bill.data}
    }else if(bill.status==0)
    {
        logger.info("BillHandler/getBillInfo: No bill information")
        return {status:0, data:"El acarreo no tiene factura"}
    }else
    {
        logger.error("BillHandler/getBillInfo: "+bill.error)
        return {status:-1, error:bill.error}
    }
}

module.exports ={
    getBillInfo:getBillInfo
}