const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stockSchema = new Schema({
    id : Number,
    petId : Number,
    name : String,
    quantity : Number,
    price : Number
});
const orderSchema = new Schema({
    id : Number,
    petId : Number,
    quantity : Number,
    shipDate : Date,
    status : String,
    complete : Boolean
});

const stockModel = mongoose.model('Stock', stockSchema);
const orderModel = mongoose.model('Order', orderSchema);

class StoreServiceModel {
    static async getStock(){
        return await stockModel.find({$gt: {quantity: 0}});
    }
    static async getStockByPetId(id) {
        return await stockModel.findOne({petId: id});
    }
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