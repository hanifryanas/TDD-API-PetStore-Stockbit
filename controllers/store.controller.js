const StoreServiceModel = require('../models/store.model');
const PetServiceModel = require('../models/pet.model');

class StoreController {
    static async getOrderById(req,res){
        const reqId = req.params.id;
        const existingOrder = await StoreServiceModel.findbyId(reqId);
        (existingOrder) ? res.status(200).json(existingOrder) : res.status(404).json({message: 'Order not found'});
    }
    static async getStock(req,res){
        const existingStock = await PetServiceModel.getStock();
        (existingStock.length>0) ? res.status(200).json(existingStock) : res.status(404).json({message: 'Stock is empty'});
    }
    static async createNewOrder(req,res){
        const { id, petId, quantity, shipDate, status, complete } = req.body;
        const newOrder = { id, petId, quantity, shipDate, status, complete };
        if(newOrder.id == null || newOrder.petId == null || newOrder.quantity == null || newOrder.shipDate == null || newOrder.status == null || newOrder.complete == null || typeof(newOrder.id) != 'number' && typeof(newOrder.petId) != 'number' && typeof(newOrder.quantity) != 'number' && typeof(newOrder.shipDate) != 'date' && typeof(newOrder.status) != 'string' && typeof(newOrder.complete) != 'boolean') {
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
                const getProduct = await PetServiceModel.findbyId(newOrder.petId);
                if(getProduct) {
                    if(getProduct.status != 'available') {
                        res.status(404).json({
                            message: 'This pet is not available'
                        })
                    } else {
                        const createdOrder = await StoreServiceModel.createNewOrder(newOrder);
                        if(createdOrder) {
                            const updatedPet = await PetServiceModel.updatePet(newOrder.petId, {status: 'pending'});
                            res.status(201).json({
                                message: 'Order created successfully',
                                order: createdOrder,
                                pet : updatedPet
                            })
                        } else {
                            res.status(500).json({
                                message: 'Error creating order'
                            })
                        }
                    }
                } else {
                    res.status(404).json({
                        message: 'Pet not found'
                    })
                }
            }
        }
    }
    static async deleteOrder(req,res){
        const reqId = req.params.id;
        const existingOrder = await StoreServiceModel.findbyId(reqId);
        if(existingOrder) {
            const deletedOrder = await StoreServiceModel.deleteOrder(reqId);
            (deletedOrder) ? res.status(200).json({message : 'Order deleted successfully'}) : res.status(500).json({message: 'Error deleting order'});
        } else {
            res.status(404).json({
                message: 'Order not found'
            })
        }
    }
}

module.exports = StoreController;