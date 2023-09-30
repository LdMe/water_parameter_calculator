import Measurement from "../models/measurementModel.js";
import Parameter from "../models/parameterModel.js";


const measurementController = {};

measurementController.getMeasurementsByUser = async (req, res) => {
    const measurements = await Measurement.find({ user: req.user.id });
    res.json(measurements);
}

measurementController.getMeasurementsByParameter = async (req, res) => {
    console.log("req.params.parameterName", req.params.parameterName)
    const parameter  = await Parameter.findOne({ name: req.params.parameterName, user: req.user.id });
    console.log("parameter", parameter)
    if (!parameter) {
        return res.status(400).json({ message: "Parameter not found" });
    }

    const measurements = await Measurement.find({ parameter: parameter._id, user: req.user.id });
    res.json(measurements);
}

measurementController.createMeasurement = async (req, res) => {
    try{
        const { value, parameterName } = req.body;
        const  parameter = await Parameter.findOne({ name: parameterName, user: req.user.id });
        if (!parameter) {
            return res.status(400).json({ message: "Parameter not found" });
        }
        const measurement = new Measurement({ value, parameter, user: req.user.id });
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

