const fs = require("fs");
const csv = require("fast-csv");
const { Product } = require("../models/product.models");

const uploadCsvService = async (path)=>{
try {
    let data = [];
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", async () => {
        await Product.bulkCreate(data) 
        return {
              message:
                "Uploaded the file successfully: " + path,
            };
         
         
      });
} catch (error) {
    return{
        message: "Fail to import data into database!",
        error: error.message,
      };
}
   
}

module.exports = {uploadCsvService}