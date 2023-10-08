import Location from "../models/locationModel.js";
import Measurement from "../models/measurementModel.js";

const locationController = {};

locationController.getLocations = async (req, res) => {
    const locations = await Location.find({ user: req.user.id });
    res.json(locations);
}

locationController.createLocation = async (req, res) => {
    try{
        const { name } = req.body;
        const oldLocation = await Location.findOne({ name, user: req.user.id });
        if (oldLocation) {
            return res.status(409).json({ message: "Location already exists" });
        }
        const location = new Location({ name, user: req.user.id });
        await location.save();
        res.json({ message: 'Location saved' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

locationController.createDefaultLocation = async (userId) => {
    const locations = [
        {
            name: "Default",
            user: userId
        }
    ];
    await Location.insertMany(locations);
}

locationController.getLocation = async (req, res) => {
    const location = await Location.findById(req.params.id);
    res.json(location);
}

locationController.deleteLocation = async (req, res) => {
    console.log("delete location, id: ", req.params.id);
    await Measurement.deleteMany({ location: req.params.id });
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Location deleted' });
}

locationController.updateLocation = async (req, res) => {
    const location = await Location.findById(req.params.id);
    if(!location) {
        return res.status(404).json({ message: 'Location not found' });
    }
    const { name } = req.body;
    location.name = name;
    await location.save();
    res.json({ message: 'Location updated' });
}


export default locationController;