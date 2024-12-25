const { User } =require('../models/user.models');

const userProfileServices =async(userId)=>{

    const user= await User.findByPk(userId);

    const userData={
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        phone:user.phoneNumber,
        address:user.address
    }
    
    return userData
}

module.exports = {userProfileServices};