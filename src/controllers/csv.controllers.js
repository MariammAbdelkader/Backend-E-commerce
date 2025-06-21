// TO DO 

const { uploadCsvService } = require("../services/csv.services");

const uploadCsv = async (req, res) => {
  try {
    const filePath = req.file.path;
    await uploadCsvService(filePath);

    res.status(200).json({
      success: true,
      message: "CSV uploaded successfully!",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || "Failed to upload CSV.",
    });
  }
};

module.exports={uploadCsv}