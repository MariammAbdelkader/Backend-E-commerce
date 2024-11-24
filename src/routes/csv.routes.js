const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { isAdmin } = require("../utilities/isAdmin");
const { upload } = require("../middlewares/csv.middlewares");
const { uploadCsv } = require("../controllers/csv.controllers");

const csvRouter = express.Router();

csvRouter.post("/csv",upload.single("file"),uploadCsv)

module.exports={csvRouter}