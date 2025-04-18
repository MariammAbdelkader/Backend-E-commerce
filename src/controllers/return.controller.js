const Joi = require("joi");
const{requestreturnService,getReturnsService}=require('../services/returns.services')

const getReturnsController=async(req,res)=>{
    try{
        const where= req.filters 
        const returns= await getReturnsService(where)

        return res.status(200).json({
            status: 'success',
            returns,
        });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch returns.',
        });
    }
}
const requestReturnController= async(req,res)=>{
    const returnRequestSchema = Joi.object({
        orderId: Joi.number().integer().required(),
        productId: Joi.number().integer().required(),
        userId: Joi.number().integer().required(),
        ReturnReason: Joi.string().min(5).required(),
    });
    try{
        const { error } = returnRequestSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
                
        
        const result = await requestreturnService(req.body);
        
        res.status(201).json({ message: "Return requested successfully", result });


    }catch(err){
        res.status(500).json({ err: "Something went wrong" });
        
    }

}


module.exports = { requestReturnController ,getReturnsController};
