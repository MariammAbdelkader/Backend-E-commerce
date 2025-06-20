const Joi = require("joi");
const{requestreturnService,getReturnsService,getOrderHistoryServices}=require('../services/returns.services');
const { json } = require("sequelize");

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
const requestReturnController = async (req, res) => {
    const returnRequestSchema = Joi.object({
      orderId: Joi.number().integer().required(),
      productId: Joi.number().integer().required(),
      quantity:Joi.number().integer().required(),
      ReturnReason: Joi.string().min(5).required(),
    });
  
    try {
      const { error } = returnRequestSchema.validate(req.body);
      if (error) {
        console.log(error.details[0].message)
        return res.status(400).json({ error: error.details[0].message });
      }
      let data={
        orderId,
        productId,
        quantity,
        ReturnReason
      }=req.body

      data.userId=req.userId;
  
      const result = await requestreturnService(data);
      res.status(201).json({ message: "Return requested successfully", result });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong", details: err.message });
    }
  };
  
  const getOrderHistoryController=async(req,res)=>{
    const userId= req.userId

    const data= await getOrderHistoryServices(userId)

    res.status(200).json({data});

  }


module.exports = { requestReturnController ,getReturnsController,getOrderHistoryController};
