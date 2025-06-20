const { userProfileServices,updateProfile } = require("../services/userprofile.services");
const  Joi =require ('joi');

const userProfileController= async(req,res)=>{
    try {
        const userId = req.userId;
        const response = await userProfileServices(userId);
        
        res.status(200).json( {profile:response} );
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const updateUserProfile = async (req, res) => {
  try {
        const updateProfileSchema = Joi.object({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        address: Joi.string().allow('', null),
        phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
        email: Joi.string().email(),
        Gender: Joi.string().valid('Male', 'Female', 'Other')
        });

    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const updatedUser = await updateProfile(userId, req.body);

    res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = {userProfileController,updateUserProfile};