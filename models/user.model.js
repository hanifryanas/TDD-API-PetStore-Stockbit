const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    id : Number,
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    userStatus: Boolean
});

const userModel = mongoose.model('User', userSchema);

class UserServiceModel {
    static async findbyUsername(username) {
        return await userModel.findOne({username: username});
    }
    static async createNewUser(newUser) {
        return await userModel.create(newUser);
    }
    static async updateUser(username, newUser) {
        return await userModel.updateOne({username: username}, newUser);
    }
    static async deleteUser(username) {
        return await userModel.deleteOne({username: username});
    }
}

module.exports = UserServiceModel;


