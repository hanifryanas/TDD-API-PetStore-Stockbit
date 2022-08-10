const PetServiceModel = require('../models/pet.model');

class PetController {
    static async getPetById(req,res){
        const reqId = req.params.id;
        const existingPet = await PetServiceModel.findbyId(reqId);
        (existingPet) ? res.status(200).json(existingPet) : res.status(404).json({message: 'Pet not found'});
    }
    static async getPetByStatus(req,res){
        const reqStatus = req.query.status;
        const existingPet = await PetServiceModel.findbyStatus(reqStatus);
        (existingPet) ? res.status(200).json(existingPet) : res.status(404).json({message: 'Pet not found'});
    }
    static async createNewPet(req,res){
        const {id, name, category, status, photoUrls, tags} = req.body;
        const newPet = {id, name, category, status, photoUrls, tags};
        if(newPet.id == null || newPet.name == null || newPet.category == null || newPet.status == null || newPet.photoUrls == null || newPet.tags == null || typeof(newPet.id) != 'number' || typeof(newPet.name) != 'string' || typeof(newPet.category) != 'object' || typeof(newPet.status) != 'string' || typeof(newPet.photoUrls) != 'object' || typeof(newPet.tags) != 'object') {
            res.status(405).json({
                message: 'Invalid input pet supplied'
            })
        }
        else {
            const existingPet = await PetServiceModel.findbyId(newPet.id);
            if(existingPet) {
                res.status(409).json({
                    message: 'Pet already exists'
                })
            }
            else {
                const createdPet = await PetServiceModel.createNewPet(newPet)
                createdPet ? res.status(201).json({
                    message: 'Pet created successfully',
                    pet : createdPet
                }) : res.status(500).json({message: 'Error creating pet'});        
            }
        }
    }
    static async updateNameStatusPet(req,res){
        const reqId = req.params.id;
        const {name, status} = req.body;
        const newPet = {name, status};
        if(Object.values(newPet)[0] == undefined && Object.values(newPet)[1] == undefined) {
            res.status(405).json({
                message: 'Invalid input pet supplied'
            })
        }
        else if (Object.values(newPet)[0]!==undefined && typeof Object.values(newPet)[0] != 'string' || Object.values(newPet)[1]!==undefined && typeof Object.values(newPet)[1] != 'string') {
            res.status(405).json({
                message: 'Invalid input pet supplied'
            })
        }
        else {
            const existingPet = await PetServiceModel.findbyId(reqId);
            if(existingPet) {
                const updatedPet = await PetServiceModel.updateNameStatusPet(reqId, newPet);
                updatedPet!=null ? res.status(200).json({
                    message: 'Pet updated successfully',
                    pet : updatedPet
                }) : res.status(500).json({message: 'Error updating pet'});
            } else {
                res.status(404).json({
                    message: 'Pet not found'
                })
            }
        }
    }
    static async addImagePet(req,res){
        const reqId = req.params.id;
        const {photoUrls} = req.body;
        const newPet = {photoUrls};
        if(newPet.photoUrls == null || typeof(newPet.photoUrls) != 'object') {
            res.status(405).json({
                message: 'Invalid input pet supplied'
            })
        }
        else {
            const existingPet = await PetServiceModel.findbyId(reqId);
            if(existingPet) {
                const updatedPet = await PetServiceModel.addImagePet(reqId, newPet);
                updatedPet!=null ? res.status(200).json({
                    message: 'Pet image uploaded successfully',
                    pet : updatedPet
                }) 
                : res.status(500).json({message: 'Error updating pet'});
            } else {
                res.status(404).json({
                    message: 'Pet not found'
                })
            }
        }
    }
    static async updatePet(req,res){
        const reqId = req.body.id;
        const {category, name, photoUrls, tags, status} = req.body;
        const newPet = {category, name, photoUrls, tags, status};
        if(newPet.category == null && newPet.name == null && newPet.photoUrls == null && newPet.tags == null && newPet.status == null || typeof(newPet.category) != 'object' && typeof(newPet.name) != 'string' && typeof(newPet.photoUrls) != 'object' && typeof(newPet.tags) != 'object' && typeof(newPet.status) != 'string') {
            res.status(405).json({
                message: 'Invalid input pet supplied'
            })
        }
        else {
            const existingPet = await PetServiceModel.findbyId(reqId);
            if(existingPet) {
                const updatedPet = await PetServiceModel.updatePet(reqId, newPet);
                updatedPet ? res.status(200).json({
                    message: 'Pet updated successfully',
                    pet : updatedPet
                }) : res.status(500).json({message: 'Error updating pet'});
            } else {
                res.status(404).json({
                    message: 'Pet not found'
                })
            }
        }
    }
    static async deletePet(req,res){
        const reqId = req.params.id;
        const existingPet = await PetServiceModel.findbyId(reqId);
        if(existingPet) {
            const deletedPet = await PetServiceModel.deletePet(reqId);
            deletedPet ? res.status(200).json({message: 'Pet deleted successfully'}) : res.status(500).json({message: 'Error deleting pet'});
        } else {
            res.status(404).json({
                message: 'Pet not found'
            })
        }
    }
}

module.exports = PetController;