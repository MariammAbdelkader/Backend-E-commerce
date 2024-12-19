const { UserInputServices } = require("../services/userinput.services");


const userinput= async(req,res)=>{
    try {
        const userId = req.userId;
        const response = await UserInputServices(userId);
        res.status(200).json({ response });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



module.exports = {userinput};