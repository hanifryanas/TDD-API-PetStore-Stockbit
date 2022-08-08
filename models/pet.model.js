const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const petSchema = new Schema({
    id : Number,
    category : {
        id : Number,
        name : String
    },
    name : String,
    photoUrls : [
        String
    ],
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
        return await petModel.updateOne({id: id}, {$push: {photoUrls: image}});
    }
    static async updateNameStatusPet(id, newPet) {
        return await petModel.updateOne({id: id}, newPet);
    }
    static async updatePet(id, updatedPet){
        return await petModel.updateOne({id: id}, updatedPet);
    }
    static async deletePet(id) {
        return await petModel.deleteOne({id: id});
    }
}

module.exports = PetServiceModel;