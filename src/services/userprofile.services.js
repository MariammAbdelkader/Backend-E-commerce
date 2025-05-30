const { User } =require('../models/user.models');

const userProfileServices = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] }, 
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


module.exports = {userProfileServices};