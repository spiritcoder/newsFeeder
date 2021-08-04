const mongoose = require('mongoose');

class dao{

    async create(model, data){
        const ModelClass = require(`./mongoose_models/${model}`);
        return ModelClass.create(data);
    }

    async findOneById(model,id,population = null, population_two = null){
        const ModelClass = require(`./mongoose_models/${model}`);

        if(population != null && population_two == null) {

            return ModelClass.findById(id).populate(population);

        }else if(population != null && population_two != null){
            
            return ModelClass.findById(id).populate(population,population_two)

        }else if(population == null && population_two != null){
            
            return ModelClass.findById(id).populate(population_two)

        }else{
            
            return ModelClass.findById(id)
        }
    }

    async findOne(model,query, population = null, population_two = null){
        const ModelClass = require(`./mongoose_models/${model}`);

        if(population != null && population_two == null) {

            return ModelClass.findOne(query).populate(population);

        }else if(population != null && population_two != null){
            
            return ModelClass.findOne(query).populate(population,population_two)

        }else if(population == null && population_two != null){
            
            return ModelClass.findOne(query).populate(population_two)

        }else{
            
            return ModelClass.findOne(query)
        }
    }

    async queryOne(model, query, population = null, population_two = null){
        const ModelClass = require(`./mongoose_models/${model}`);

        if(population != null && population_two == null) {

            return ModelClass.findOne(query).populate(population);

        }else if(population != null && population_two != null){
            
            return ModelClass.findOne(query).populate(population,population_two)

        }else if(population == null && population_two != null){
            
            return ModelClass.findOne(query).populate(population_two)

        }else{
            
            return ModelClass.findOne(query)
        }
    }

    async updateOne(model, id, update){
        const ModelClass = require(`./mongoose_models/${model}`);
        return ModelClass.findByIdAndUpdate(id, update);
    }

    async updateQuery(model, id, query){
        const ModelClass = require(`./mongoose_models/${model}`);
        return ModelClass.updateMany({_id:id},{$set:query},{multi:true,new:true});
    }

    async queryMore(model, query, population = null, population_two = null){
        const ModelClass = require(`./mongoose_models/${model}`);
        
        if(population != null && population_two == null) {

            return ModelClass.find(query).populate(population);

        }else if(population != null && population_two != null){
            
            return ModelClass.find(query).populate(population,population_two)

        }else if(population == null && population_two != null){
            
            return ModelClass.find(query).populate(population_two)

        }else{
            
            return ModelClass.find(query)
        }
    }

    async deleteOne(model, query){
        const ModelClass = require(`./mongoose_models/${model}`);
        return ModelClass.remove(query);
    }

    async deleteById(model, id){
        const ModelClass = require(`./mongoose_models/${model}`);
        return ModelClass.remove({_id:id});
    }

    async countQuery(model, query){
        const ModelClass = require(`./mongoose_models/${model}`);
        return ModelClass.countDocuments(query);
    }

    async UpdateObject(objectModel, query){
        return Object.assign(objectModel, query).save();
    }
}

module.exports = new dao();

