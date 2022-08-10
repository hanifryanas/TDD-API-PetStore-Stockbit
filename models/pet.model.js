const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const petSchema = new Schema({
    id : Number,
    category : {
        id : Number,
        name : String
    },
    name : String,
    photoUrls : Object,
    tags : [{
        id : Number,
        name : String
    }],
    status : String
})

const petModel = mongoose.model('Pet', petSchema);

class PetServiceModel {
    static async findbyId(id) {
        return await petModel.findOne({id: id});
    }
    static async findByStatus(reqStatus) {
        return await petModel.find({status: reqStatus});
    }
    static async createNewPet(newPet) {
        return await petModel.create(newPet);
    }
    static async addImagePet(id, image) {
        const petResult = await petModel.findOne({id: id});
        if(petResult) {
            let currentPhotoUrls = petResult.photoUrls;
            let newPhotoUrls = currentPhotoUrls.concat(image.photoUrls);
            const updatedPet = await petModel.updateOne({id: id}, {photoUrls: newPhotoUrls});
            if(updatedPet.acknowledged) {
                return await petModel.findOne({id: id});
            } else {
                return null;
            }
        }
    }
    static async updateNameStatusPet(id, newPet) {
        const result = await petModel.updateOne({id: id}, newPet);
        if(result.acknowledged) {
            return await petModel.findOne({id: id});
        } else {
            return null;
        }
    }
    static async updatePet(id, updatedPet){
        const result = await petModel.updateOne({id: id}, updatedPet);
        if(result.acknowledged) {
            return await petModel.findOne({id: id});
        }
        else {
            return null;
        }
    }
    static async deletePet(id) {
        return await petModel.deleteOne({id: id});
    }
}

module.exports = PetServiceModel;