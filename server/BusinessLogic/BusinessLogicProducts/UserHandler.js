
// Import ControllerFactory
const ControllerFactory = require('../../Controllers/ControllerFactory');

// Import logger
const logger = require('../../utils/logger/logger');

//Used to hash password
var bcrypt = require('bcryptjs');

// Create user
async function createUser(req) {
    // Get atributes
    const { User_name, User_last_name, User_password, User_address, User_Email } = req.body.request;
    //Hash the password
    var User_password_hashed = bcrypt.hashSync(User_password, 10);
    // Create user
    let user = await ControllerFactory.getController("User").create(User_name, User_last_name, User_password_hashed, User_address, User_Email)
    if(user.status==1)
    {
        logger.info("UserHandler: User was created successfully.");
        return 1;
    }
    else{
        logger.error("UserHandler: " + user.error);
        return user.error;
    }
}

// Validate user
//status 0 = user not found
//status 1 = user found, id returned
//status -1 = error in UserModel.count, error message returned
//status -2 = error in UserModel.findAll from getUserByEmail, error message returned
async function validateUser(req) {
    // Get atributes
    const { User_Email, User_password } = req.body.request;

    let user =await ControllerFactory.getController("User").getUserBy({User_Email:User_Email})
    if(user.status==1) {
        //Compare hashed passwords
        if(bcrypt.compareSync(User_password, user.data.User_password) == false){
            return {status: 0, data: 'Las contraseñas no coinciden'};
        }
        logger.info("UserHandler: succesfull call to getUserByEmail")
        return {status: 1, data: user.data};
    } else if(user.status==0) {    
        logger.info("UserHandler: User is not valid");
        return {status: 0, data: false}; 
    } else {    
        logger.error("UserHandler: error from getUserBeEmail"+ user.error)
        return {status: -1, data: user.error};
    }

}
async function getUserInfo(Id_user)
{
    let user =await ControllerFactory.getController("User").getUserBy({Id_user:Id_user})
    if(user.status==1)
    {
        logger.info("UserHandler: succesfull call to getUserInfo")
        return {status: 1, data: user.data};
    }else
    {    logger.error("UserHandler: error from getUserInfo"+ user.error)
        return {status: -1, data: user.error};
    }
}
module.exports = { createUser: createUser, validateUser: validateUser,getUserInfo:getUserInfo }