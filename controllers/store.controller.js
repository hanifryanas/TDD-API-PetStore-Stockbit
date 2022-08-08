const StoreServiceModel = require('../models/store.model');

class StoreController {
    static async getOrderById(req,res){
        const reqId = req.params.id;
        const existingOrder = await StoreServiceModel.findbyId(reqId);
        (existingOrder) ? res.status(200).json(existingOrder) : res.status(404).json({message: 'Order not found'});
    }
    static async getStock(req,res){
        const existingOrder = await StoreServiceModel.getStock();
        (existingOrder) ? res.status(200).json(existingOrder) : res.status(404).json({message: 'Stock is empty'});
    }
    static async createNewOrder(req,res){
        const { id, petId, quantity, shipDate, status, complete } = req.body;
        const newOrder = { id, petId, quantity, shipDate, status, complete };
        if(newOrder.id == null && newOrder.petId == null && newOrder.quantity == null && newOrder.shipDate == null && newOrder.status == null && newOrder.complete == null || typeof(newOrder.id) != 'number' && typeof(newOrder.petId) != 'number' && typeof(newOrder.quantity) != 'number' && typeof(newOrder.shipDate) != 'date' && typeof(newOrder.status) != 'string' && typeof(newOrder.complete) != 'boolean') {
            res.status(405).json({
                message: 'Invalid input order supplied'
            })
        } else {
            const existingOrder = await StoreServiceModel.findbyId(newOrder.id);
            if(existingOrder) {
                res.status(409).json({
                    message: 'Order already exists'
                })
            } else {
                const getProduct = await StoreServiceModel.getStockByPetId(newOrder.petId);
                if(getProduct.quantity < newOrder.quantity) {
                    res.status(409).json({
                        message: 'This product has not enough stock'
                    })
                } else {
                const createdOrder = await StoreServiceModel.createNewOrder(newOrder);
                (createdOrder) ? res.status(201).json(createdOrder) : res.status(500).json({message: 'Error creating order'});
                }
            }
        }
    }
    static async deleteOrder(req,res){
        const reqId = req.params.id;
        const existingOrder = await StoreServiceModel.findbyId(reqId);
        if(existingOrder) {
            const deletedOrder = await StoreServiceModel.deleteOrder(reqId);
            (deletedOrder) ? res.status(200).json(deletedOrder) : res.status(500).json({message: 'Error deleting order'});
        } else {
            res.status(404).json({
                message: 'Order not found'
            })
        }
    }
}

module.exports = StoreController;