const mongoose=require('mongoose');
const schema = mongoose.schema;
//create schema
const productSchema = new mongoose.Schema({
    name:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number
    },
    owner:{
        type:String
    }
})

module.exports = product = mongoose.model('Product',productSchema);