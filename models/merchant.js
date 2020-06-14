const mongoose=require('mongoose');
const schema = mongoose.schema;
//create schema
const merchantSchema = new mongoose.Schema({
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
    company:{
        type:String
    },
    address:{
        type:String
    },
    password:{
        type:String
    }
})

module.exports = merchant = mongoose.model('Merchant',merchantSchema);