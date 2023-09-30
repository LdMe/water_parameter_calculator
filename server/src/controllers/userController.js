
import userModel from '../models/userModel.js';

const userController = {};

userController.getUsers = (req, res) => {
    res.send('Get all users');
}

userController.createUser = (req, res) => {
    res.send('Create a user');
}

userController.getUser = (req, res) => {
    res.send('Get a user');
}

userController.deleteUser = (req, res) => {
    res.send('Delete a user');
}

userController.updateUser = (req, res) => {
    res.send('Update a user');
}

export default userController;
