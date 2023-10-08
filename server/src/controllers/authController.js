import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import parameterController from './parameterController.js';
import locationController from './locationController.js';

const authController = {};

authController.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email not found" });
        }
        const comparation = await user.comparePassword(password);
        if (!comparation) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400,
        });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

authController.register = async (req, res) => {
    try{
        const { email, password } = req.body;
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hash  = await bcrypt.hash(password, 10);
        const user = new User({ email, password:hash });
        await user.save();
        await parameterController.createDefaultParameters(user._id);
        await locationController.createDefaultLocation(user._id);
        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400,
        });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default authController;


