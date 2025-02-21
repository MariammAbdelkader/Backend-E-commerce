const express = require("express");
const { AuthMiddleware } = require("../middlewares/authentication.middlewares");
const { isAdmin } = require("../utilities/isAdmin");
const { upload } = require("../middlewares/csv.middlewares");
const { uploadCsv } = require("../controllers/csv.controllers");

const csvRouter = express.Router();
/**
 * @swagger
 * tags:
 *   - name: CSV
 *     description: CSV file upload operations (e.g., upload CSV to the server)
 */

/**
 * @swagger
 * /csv:
 *   post:
 *     summary: Upload a CSV file
 *     description: Uploads a CSV file for processing.
 *     tags:
 *       - CSV
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file to be uploaded.
 *     responses:
 *       200:
 *         description: CSV file uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "uploaded successfully"
 *                 response:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     recordsProcessed:
 *                       type: integer
 *                       example: 50
 *       400:
 *         description: Invalid file format or failed upload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Please upload only csv file."
 *       500:
 *         description: Internal server error.
 */

csvRouter.post("/csv",upload.single("file"),uploadCsv)

module.exports={csvRouter}