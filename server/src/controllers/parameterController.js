import Parameter from "../models/parameterModel.js";
import Measurement from "../models/measurementModel.js";
import mongoose from "mongoose";

const parameterController = {};

const getParameters = async (req, res) => {
    try {
        const parameters = await Parameter.find({ user: req.user.id });
        res.json(parameters);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
}

const createParameter = async (req, res) => {
    try {
        let { name, hasColor, colors } = req.body;
        if (!hasColor) {
            colors = [];
        }
        name = name.toLowerCase();
        const oldParameter = await Parameter.findOne({ name, user: req.user.id });
        if (oldParameter) {
            return res.status(409).json({ message: "Parameter already exists" });
        }
        const parameter = new Parameter({ name, hasColor, colors, user: req.user.id });
        await parameter.save();
        res.json(parameter);
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
}

const createDefaultParameters = async (userId) => {
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
            hasColor: true
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
            hasColor: true
        },
        {
            name: "dkh",
            hasColor: false
        }
    ];
    parameters.forEach(async (parameter) => {
        const newParameter = new Parameter({ ...parameter, user: userId });
        await newParameter.save();
    });
}

const getParameter = async (req, res) => {
    try {
        const { parameterId } = req.params;
        const parameter = await Parameter.findById(parameterId);
        res.json(parameter);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }

}
const getParameterByName = async (req, res) => {
    try {
        console.log("getting parameter by name")
        const { parameterName } = req.params;
        const parameter = await Parameter.findOne({ user: req.user.id, name: parameterName.toLowerCase() });
        res.json(parameter);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
}

const deleteParameter = async (req, res) => {
    try {
        const { parameterId } = req.params;
        const parameter = await Parameter.findById(parameterId);
        if (!parameter) {
            return res.status(400).json({ message: "Parameter not found" });
        }
        await Measurement.deleteMany({ parameter: parameter._id });
        const response = await Parameter.findByIdAndDelete(parameter._id);
        res.json({ message: 'Parameter deleted' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message });
    }
}

const updateParameter = async (req, res) => {
    try{
        const { parameterId } = req.params;
        const { name, hasColor, colors } = req.body;
        const parameter = await Parameter.findOne({ user: req.user.id, _id: parameterId });
        if (!parameter) {
            return res.status(400).json({ message: "Parametro no encontrado" });
        }
        parameter.name = name;
        parameter.hasColor = hasColor;
        parameter.colors = colors;
        await parameter.save();
        return res.json(parameter);
    }catch(error){
        console.error(error)
        res.status(500).json({ message: error.message });
    }
}


export default {
    getParameters,
    createParameter,
    getParameter,
    getParameterByName,
    deleteParameter,
    updateParameter,
    createDefaultParameters
};
