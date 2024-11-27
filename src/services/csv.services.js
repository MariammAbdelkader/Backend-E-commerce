const fs = require("fs");
const csv = require("fast-csv");
const { Product } = require("../models/product.models");

const uploadCsvService = async (path)=>{
try {
    return new Promise((resolve, reject) => {
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
        try {
          await Product.bulkCreate(data);
          fs.unlink(path, (err) => {
            if (err) {
              console.error(`Error deleting file: ${err.message}`);
              return reject(err);
            }
            console.log("File removed successfully!");
          });
          resolve({ message: "Uploaded successfully!" }); // Resolve the Promise here
        } catch (err) {
          reject(err); 
        }
      });
     }); 
} catch (error) {
    throw new Error("Failed to import data to db")
}
   
}

module.exports = {uploadCsvService}