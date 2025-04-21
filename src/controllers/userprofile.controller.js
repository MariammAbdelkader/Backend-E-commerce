const { userProfileServices } = require("../services/userprofile.services");


const userProfileController= async(req,res)=>{
    try {
        const userId = req.userId;
        const response = await userProfileServices(userId);
        
        res.status(200).json( {profile:response} );
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



module.exports = {userProfileController};