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

parameterController.createDefaultParameters = async (userId) => {
    const parameters = [

        {
            name: "ph",
            colors: [
                {
                    color: { r: 227, g: 224, b: 170 },
                    value: 6
                },
                {
                    color: { r: 209, g: 214, b: 168 },
                    value: 6.5
                },
                {
                    color: { r: 191, g: 205, b: 189 },
                    value: 7
                },
                {
                    color: { r: 172, g: 213, b: 208 },
                    value: 7.5
                },
                {
                    color: { r: 147, g: 189, b: 208 },
                    value: 8
                },
                {
                    color: { r: 141, g: 163, b: 208 },
                    value: 8.5
                },
                {
                    color: { r: 135, g: 152, b: 196 },
                    value: 9
                }
            ],
            isColor: true
        },
        {
            name: "nitrite",
            colors: [
                {
                    color: { r: 255, g: 255, b: 255 },
                    value: 0
                },
                {
                    color: { r: 255, g: 240, b: 250 },
                    value: 0.5
                },
                {
                    color: { r: 255, g: 227, b: 237 },
                    value: 1
                },
                {
                    color: { r: 255, g: 220, b: 241 },
                    value: 2
                },
                {
                    color: { r: 255, g: 185, b: 219 },
                    value: 4
                },
                {
                    color: { r: 254, g: 145, b: 190 },
                    value: 8
                }
            ],
            isColor: true
        },
        {
            name: "dkh",
            isColor: false
        }
    ];
    parameters.forEach(async (parameter) => {
        const newParameter = new Parameter({ ...parameter, user: userId });
        await newParameter.save();
    });
}

parameterController.getParameter = async (req, res) => {
    const  {parameterName} = req.params;
    const parameter = await Parameter.findOne({user:req.user.id, name: parameterName.toLowerCase()});
    res.json(parameter);
}

parameterController.deleteParameter = async (req, res) => {
    const parameter = await Parameter.findOne({ user: req.user.id, name: req.params.parameterName });
    if (!parameter) {
        return res.status(400).json({ message: "Parameter not found" });
    }
    await Measurement.deleteMany({ parameter: parameter._id });
    const response = await Parameter.findByIdAndDelete(parameter._id);
    res.json({ message: 'Parameter deleted' });
}

parameterController.updateParameter = async (req, res) => {
    const { name, isColor, colors } = req.body;
    await Parameter.findOneAndUpdate({ user: req.user.id, name }, { isColor, colors });
    res.json({ message: 'Parameter updated' });
}

export default parameterController;
