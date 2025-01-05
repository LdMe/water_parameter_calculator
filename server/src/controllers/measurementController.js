import Measurement from "../models/measurementModel.js";
import Parameter from "../models/parameterModel.js";
import Location from "../models/locationModel.js";


const getMeasurementsByUser = async (req, res) => {
    try {
        let measurementsList = await Measurement.find({ user: req.user.id });
        const parameters = await Parameter.find({ user: req.user.id });

        const measurementsByParameter = {};
        for (const parameter of parameters) {
            measurementsByParameter[parameter.name] = [];
        }
        for (const measurement of measurementsList) {
            const parameter = parameters.find(p => p._id == measurement.parameter.toString());
            if (!parameter) {
                continue;
            }
            measurementsByParameter[parameter.name].push(measurement);
        }
        res.json(measurementsByParameter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getMeasurementsByParameter = async (req, res) => {
    try{
        const parameter = await Parameter.findOne({ name: req.params.parameterName, user: req.user.id });
        if (!parameter) {
            return res.status(400).json({ message: "Parameter not found" });
        }
    
        const measurements = await Measurement.find({ parameter: parameter._id, user: req.user.id });
        res.json(measurements);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getMeasurementsByLocation = async (req, res) => {
    try{
        const location = await Location.findOne({ _id: req.params.location, user: req.user.id });
        if (!location) {
            return res.status(400).json({ message: "Location not found" });
        }
        const parameters = await Parameter.find({ user: req.user.id });
        const measurements = await Measurement.find({ location: location._id, user: req.user.id }).sort({ date: -1 });
        const measurementsByParameter = {};
        for (const parameter of parameters) {
            measurementsByParameter[parameter.name] = [];
        }
        for (const measurement of measurements) {
            const parameter = parameters.find(p => p._id == measurement.parameter.toString());
            if (!parameter) {
                continue;
            }
            measurementsByParameter[parameter.name].push(measurement);
        }
        const measurementsByDate = {};
        for (const measurement of measurements) {
            const date = new Date(measurement.date).toISOString().split('T')[0]; // measurement.date;
            measurementsByDate[date] = measurementsByDate[date] || [];
            const parameter = parameters.find(p => p._id == measurement.parameter.toString());
            const newMeasurement = { ...measurement._doc, parameter: parameter.name, hasColor: parameter.hasColor };
            measurementsByDate[date].push(newMeasurement);
        }
        const measurementsByParameterArray = [];
        for (const parameter in measurementsByParameter) {
            measurementsByParameterArray.push({
                parameter,
                hasColor: parameters.find(p => p.name == parameter).hasColor,
                measurements: measurementsByParameter[parameter]
            });
        }
        const measurementsByDateArray = [];
        for (const date in measurementsByDate) {
            measurementsByDateArray.push({
                date,
                measurements: measurementsByDate[date]
            });
        }
        const totalMeasurements = measurements.length;
        res.json({ byParameter: measurementsByParameterArray, byDate: measurementsByDateArray, totalMeasurements });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const createMeasurement = async (req, res) => {
    try {
        const { value, parameterName, color, locationName } = req.body;
        const parameter = await Parameter.findOne({ name: parameterName, user: req.user.id });
        if (!parameter) {
            return res.status(400).json({ message: "Parameter not found" });
        }
        const data = {
            value,
            parameter: parameter._id,
            user: req.user.id,
        }
        if (color) {
            data.color = color;
        }
        if (locationName) {
            const location = await Location.findOne({ name: locationName, user: req.user.id });
            if (!location) {
                return res.status(400).json({ message: "Location not found" });
            }
            data.location = location._id;
        }
        const measurement = new Measurement(data);
        await measurement.save();
        res.json({ message: 'Measurement saved' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMeasurement = async (req, res) => {
    try{
        const measurement = await Measurement.findById(req.params.id);
        res.json(measurement);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteMeasurement = async (req, res) => {
    try{
        await Measurement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Measurement deleted' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


export default {
    getMeasurementsByUser,
    getMeasurementsByParameter,
    getMeasurementsByLocation,
    createMeasurement,
    getMeasurement,
    deleteMeasurement
} 

