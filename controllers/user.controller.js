const UserServiceModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

class UserController{
    static async getUserByUsername(req, res){
        const reqUsername = req.params.username;
        const existingUser = await UserServiceModel.findbyUsername(reqUsername);
        (existingUser) ? res.status(200).json(existingUser) : res.status(404).json({message: 'User not found'});
    }
    static async login (req, res) {
        const {username, password} = req.body;
        const existingUser = await UserServiceModel.findbyUsername(username);
        if(existingUser) {
            if(existingUser.password == password) {
                res.status(200).json({
                    message: 'Login successful',
                    token: jwt.sign( process.env.SECRET_KEY,
                    {expiresIn: '3h'}, {ratelimit: {max : 10}})
                });
            } else {
                res.status(401).json({
                    message: 'Invalid password'
                })
            }
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    }
    static async logout (req, res) {
        res.status(200).json({
            message: 'Logout successful',
            token: null
        });
    }
    static async createNewUser(req, res){
        const {id, username, firstName, lastName, email, password, phone, userStatus} = req.body;
        const newUser = {id, username, firstName, lastName, email, password, phone, userStatus};
        if(newUser.id == null || newUser.username == null || newUser.firstName == null || newUser.lastName == null || newUser.email == null || newUser.password == null || newUser.phone == null || newUser.userStatus == null || typeof(newUser.id) != 'number' || typeof(newUser.username) != 'string' || typeof(newUser.firstName) != 'string' || typeof(newUser.lastName) != 'string' || typeof(newUser.email) != 'string' || typeof(newUser.password) != 'string' || typeof(newUser.phone) != 'string' || typeof(newUser.userStatus) != 'boolean' || newUser.username.length < 6) {
            res.status(405).json({
                message: 'Invalid input user supplied'
            })
        }
        else {
            const existingUser = await UserServiceModel.findbyUsername(newUser.username);
            if(existingUser) {
                res.status(409).json({
                    message: 'Username already exists'
                })
            }
            else {
            const createdUser = await UserServiceModel.createNewUser(newUser)
            createdUser ? res.status(201).json(createdUser) : res.status(500).json({message: 'Error creating user'});        
            }
        }
    }
    static async updateUserByUsername(req, res){
        const reqUsername = req.params.username;
        const {id, username, firstName, lastName, email, password, phone, userStatus} = req.body;
        const newUser = {id, username, firstName, lastName, email, password, phone, userStatus};
        if(newUser.id == null || newUser.username == null || newUser.firstName == null || newUser.lastName == null || newUser.email == null || newUser.password == null || newUser.phone == null || newUser.userStatus == null || typeof(newUser.id) != 'number' || typeof(newUser.username) != 'string' || typeof(newUser.firstName) != 'string' || typeof(newUser.lastName) != 'string' || typeof(newUser.email) != 'string' || typeof(newUser.password) != 'string' || typeof(newUser.phone) != 'string' || typeof(newUser.userStatus) != 'boolean' || newUser.username.length < 6) {
            res.status(405).json({
                message: 'Invalid input user supplied'
            })
        }
        else {
            const existingUser = await UserServiceModel.findbyUsername(reqUsername);
            if(existingUser) {
                const updatedUser = await UserServiceModel.updateUser(reqUsername, newUser);
                updatedUser ? res.status(200).json(updatedUser) : res.status(500).json({message: 'Error updating user'});
            } else {
                res.status(404).json({
                    message: 'User not found'
                })
            }
        }
    }
    static async deleteUserByUsername(req, res){
        const reqUsername = req.params.username;
        const existingUser = await UserServiceModel.findbyUsername(reqUsername);
        if(existingUser) {
            const deletedUser = await UserServiceModel.deleteUser(reqUsername);
            deletedUser ? res.status(200).json(deletedUser) : res.status(500).json({message: 'Error deleting user'});
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }
    }
}

module.exports = UserController;