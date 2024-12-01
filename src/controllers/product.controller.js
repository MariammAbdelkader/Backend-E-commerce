const { getProductServices } = require("../services/product.services");

const getProductController =async (req , res) => {
    try {
        console.log(req.params);

        const { productId }= req.params;
        
        console.log(productId);
        
        const response =await getProductServices(productId)

        res.status(200).json({message : "Product returned successfully" , response });
        
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

module.exports={getProductController}