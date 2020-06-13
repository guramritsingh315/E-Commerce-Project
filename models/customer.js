const mongoose=require('mongoose');
const schema = mongoose.schema;
//create schema
const customerSchema = new mongoose.Schema({
    userType:{
        type:String
    },
    name:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    number:{
        type:String
    },
    address:{
        type:String
    },
    password:{
        type:String
    }
})

module.exports = User = mongoose.model('Customer',customerSchema);