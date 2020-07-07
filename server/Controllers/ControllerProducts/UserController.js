
// Import ModelFactory
const ModelFactory = require('../../Models/ModelFactory');

// Import logger
const logger = require('../../utils/logger/logger');

// Create user
async function create(User_name, User_last_name, User_password_hashed, User_address, User_Email) {
    try {
        // Create user

        let new_user = await ModelFactory.getModel("User").create(

            {
                User_name: User_name,
                User_last_name: User_last_name,
                User_password: User_password_hashed,
                User_address: User_address,
                User_Email: User_Email
            }
            ,{
                fields: ["User_name", "User_last_name", "User_password", "User_address", "User_Email"]
            }
        );
        logger.info("UserController: User was created successfully.");
        return {status:1,data:new_user.Id_user};

    } catch (error) {
        logger.error("UserController: " + error);
        return {status:-1, error: error};
    }

}

// Counts all register that matches field
//status 1 = number of count returned
//status -1 = error in UserModel.count, error message returned
async function countWhere(query) {

    try {
        let count = await ModelFactory.getModel("User").count({ where: query })
        logger.info("UserController:Number of users returned")
        return{status:1, data:count}

    } catch (error) {
        logger.error("UserController: " + error);
        return {status: -1, error: error};
    }
}

// Get user by email
//status 0 = user not found
//status 1 = user found, user returned
//status -1 = error, error message returned
async function getRegisterBy(query)
{
    //query to find user by given email (which is unique)
    try {

        let users = await ModelFactory.getModel("User").findAll(
            { where: query }

            )
        //query returns array of users that match were clause
        if(users.length==0)
        {
            logger.info("UserController:query doesnt match known user")
            return {status:0, data:"not found"}
        }
        else{
            logger.info("UserController:User found")
            //users[0] should be the only user in array, .dataValues is Json containing atributes
            return {status: 1,data: users[0].dataValues}
        }

    } catch (error) {
        logger.info("UserController: "+ error)
        return {status:-1, data:error}

    }
}

async function deleteByUserEmail(User_Email){
    try{

        let info = await ModelFactory.getModel("User").destroy({ where: { User_Email: User_Email }})

        //query returns array of clients that match where clause, in this case we expect only 1
        if(info.length==0)
        {
            logger.info("UserController: No client found with that Identity_card")
            return {status:0, data:" No client information found with that User_Email"}
        }
        else{
            logger.info("UserController: clients was deleted")
            return {status: 1, data: info[0].dataValues}
        }

    } catch (error) {
        logger.info("UserController: "+ error)
        return {status:-1, data:error}
    }
}

module.exports = { 
    create: create, 
    countWhere:countWhere,
    getUserBy:getRegisterBy,
    deleteByUserEmail: deleteByUserEmail

 };
