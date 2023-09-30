import Parameter from "../models/parameterModel.js";

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
            return res.status(400).json({ message: "Parameter already exists" });
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
    await Parameter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Parameter deleted' });
}

parameterController.updateParameter = async (req, res) => {
    const { name, isColor, colors } = req.body;
    await Parameter.findOneAndUpdate({ user: req.user.id, name }, { isColor, colors });
    res.json({ message: 'Parameter updated' });
}

export default parameterController;
