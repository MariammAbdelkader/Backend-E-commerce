

const MetricMiddleware=async(req,res, next)=>{
    
    try{

        const path = req.path;  // example: /sum/Profit/2025
        const parts = path.split('/'); // split by /
        const metricName = parts[1]; // parts = ["","Profit", "sum",  "2025"]

  console.log("Metric Name:", metricName);
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