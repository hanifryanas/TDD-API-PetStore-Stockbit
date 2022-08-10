const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    id : Number,
    petId : Number,
    quantity : Number,
    shipDate : Date,
    status : String,
    complete : Boolean
});

const orderModel = mongoose.model('Order', orderSchema);

class StoreServiceModel {
    static async findbyId(id) {
        return await orderModel.findOne({id: id});
    }
    static async createNewOrder(newOrder) {
        return await orderModel.create(newOrder);
    }
    static async deleteOrder(id) {
        return await orderModel.deleteOne({id: id});
    }
}

module.exports = StoreServiceModel;