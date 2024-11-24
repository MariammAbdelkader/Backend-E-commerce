// TO DO 

const { uploadCsvService } = require("../services/csv.services");

const uploadCsv =async (req , res) => {
    try {
        const filePath =  req.file.path ; 
        const response = await uploadCsvService(filePath);
        res.status(200).json({message : "uploaded succesfully",response });
        
    } catch (err) {
        res.status(400).json({ error : err.message });
     }

}

module.exports={uploadCsv}