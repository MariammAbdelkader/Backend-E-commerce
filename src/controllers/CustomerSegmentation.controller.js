const { segmentAllUsersServices } = require('../services/CustomerSegmentation.services');
const { getSegmentationsServices } = require('../servicses/CustomerSegmentation.services');

const segmentAllUsersController = async (req, res) => {
    try {
        await segmentAllUsersServices(); // Wait for function to complete

        const updatedSegmentations = await getAllSegmentationsServices(); 
        res.status(200).json(updatedSegmentations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getSegmentationsController = async (req, res) => {
    try {
        
        const data = await getSegmentationsServices(req.filter); // Wait for function result
        res.status(200).json({segmenteedUsers:data});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { segmentAllUsersController, getSegmentationsController };
