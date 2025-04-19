const { segmentAllUsersServices } = require('../services/CustomerSegmentation.services');
const { getAllSegmentationsServices } = require('../services/CustomerSegmentation.services');

const segmentAllUsersController = async (req, res) => {
    try {
        await segmentAllUsersServices(); // Wait for function to complete

        const updatedSegmentations = await getAllSegmentationsServices(); 
        res.status(200).json(updatedSegmentations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllSegmentationsController = async (req, res) => {
    try {
        const data = await getAllSegmentationsServices(); // Wait for function result
        res.status(200).json({segmenteedUsers:data});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { segmentAllUsersController, getAllSegmentationsController };
