import { ObjectId } from "mongoose";
import Measurement from "../models/measurementModel.js";
import Parameter from "../models/parameterModel.js";


const measurementController = {};

measurementController.getMeasurementsByUser = async (req, res) => {
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
}

measurementController.getMeasurementsByParameter = async (req, res) => {
    console.log("req.params.parameterName", req.params.parameterName);
    const parameter  = await Parameter.findOne({ name: req.params.parameterName, user: req.user.id });
    if (!parameter) {
        return res.status(400).json({ message: "Parameter not found" });
    }

    const measurements = await Measurement.find({ parameter: parameter._id, user: req.user.id });
    res.json(measurements);
}

measurementController.createMeasurement = async (req, res) => {
    try{
        const { value, parameterName,color } = req.body;
        const  parameter = await Parameter.findOne({ name: parameterName, user: req.user.id });
        if (!parameter) {
            return res.status(400).json({ message: "Parameter not found" });
        }
        const data = {
            value,
            parameter: parameter._id,
            user: req.user.id,
        }
        if(color){
            data.color = color;
        }
        const measurement = new Measurement(data);
        await measurement.save();
        res.json({ message: 'Measurement saved' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

measurementController.getMeasurement = async (req, res) => {
    const measurement = await Measurement.findById(req.params.id);
    res.json(measurement);
}

measurementController.deleteMeasurement = async (req, res) => {
    await Measurement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Measurement deleted' });
}


export default measurementController;

