const { segmentAllUsersServices,getSegmentationsServices } = require('../services/CustomerSegmentation.services');

const segmentAllUsersController = async (req, res) => {
    try {
        await segmentAllUsersServices(); // Wait for function to complete

        const{type} = req.body;
        const updatedSegmentations = await getSegmentationsServices(type); // Wait for function result
        res.status(200).json(updatedSegmentations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getSegmentationsController = async (req, res) => {
    try { 
        const {type} = req.body;
        console.log("Type:", type); // Log the type to check if it's being received correctly
        
        const data = await getSegmentationsServices( type); // Wait for function result
        res.status(200).json({segmenteedUsers:data});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { segmentAllUsersController, getSegmentationsController };
