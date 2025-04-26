

const MetricMiddleware=async(req,res, next)=>{
    
    try{

        const pathSegments = req.path.split('/').filter(Boolean); 
        const metricName = pathSegments[pathSegments.length - 1];  // get last segment

        if (!metricName) {
            return res.status(400).json({ message: 'Invalid route format.' });
        }
        req.metric = metricName;  
       next();
    }catch(error){
    throw new Error("gggggggggggggggggggggggg");
    }

}

module.exports={MetricMiddleware}