import Parameter from "../models/parameterModel.js";
import Measurement from "../models/measurementModel.js";

const parameterController = {};

parameterController.getParameters = async (req, res) => {
    const parameters = await Parameter.find({ user: req.user.id });
    res.json(parameters);
}

parameterController.createParameter = async (req, res) => {
    try{
        let { name, isColor, colors } = req.body;
        if (!isColor) {
            colors = [];
        }
        name = name.toLowerCase();
        const oldParameter = await Parameter.findOne({ name, user: req.user.id });
        if (oldParameter) {
            return res.status(409).json({ message: "Parameter already exists" });
        }
        const parameter = new Parameter({ name, isColor, colors, user: req.user.id });
        await parameter.save();
        res.json({ message: 'Parameter saved' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

parameterController.getParameter = async (req, res) => {
    const  {parameterName} = req.params;
    console.log("parameterName", parameterName.toLowerCase());
    const parameter = await Parameter.findOne({user:req.user.id, name: parameterName.toLowerCase()});
    console.log("parameter", parameter)
    res.json(parameter);
}

parameterController.deleteParameter = async (req, res) => {
    const parameter = await Parameter.findOne({ user: req.user.id, name: req.params.parameterName });
    console.log("parameter", parameter)
    console.log("req.user.id", req.user.id)
    console.log("req.params.parameterName", req.params.parameterName)
    if (!parameter) {
        return res.status(400).json({ message: "Parameter not found" });
    }
    console.log("parameter", parameter);
    await Measurement.deleteMany({ parameter: parameter._id });
    const response = await Parameter.findByIdAndDelete(parameter._id);
    console.log("response", response);
    res.json({ message: 'Parameter deleted' });
}

parameterController.updateParameter = async (req, res) => {
    const { name, isColor, colors } = req.body;
    await Parameter.findOneAndUpdate({ user: req.user.id, name }, { isColor, colors });
    res.json({ message: 'Parameter updated' });
}

export default parameterController;
