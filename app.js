var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var users = express.Router();
var cors =require('cors');
//importing schemas
const Customer = require('./models/customer');
const Merchant = require('./models/merchant');
const { response } = require('express');
const customer = require('./models/customer');

mongoose.connect('mongodb://localhost/UserData', { useNewUrlParser: true,useUnifiedTopology:true });
var db=mongoose.connection;
db.on('error',console.log.bind(console,"connection error"));
db.once('open',function(callback){
    console.log("connection successful");
});
app.use(cors());
process.env.SECRET_KEY = 'secret';
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
    {
        extended:true,
    }));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.listen(8080,function(error){
    if(error) throw error;
    else{
        console.log("Running at: 127.0.0.1:8080");
    }
});

//handling get requests
app.get('/',function(request,response){
    response.render('signup');
});
app.get('/home',function(request,response){
    response.render('index');
});
app.get('/login.html',function(request,response){
    response.sendFile(path.join(__dirname,'views','login.html'));
});
app.get('/signup',function(request,response){
    response.render('signup');
});
app.post('/login',function(request,response){
if(request.body.merchant){
    console.log("merchant login");
}
else{
    console.log("customer login")
}

});


//handling post requests
app.post('/customerSignup',function(req,res){
    /*var name= req.body.name;
    var lastName=req.body.lastName;
    var email=req.body.Email;
    var number=req.body.number;
    var addres=req.body.address;
    var password = req.body.password;*/
    var data = {
        userType:"customer",
        name:req.body.name,
        lastName:req.body.lastName,
        email:req.body.Email,
        number:req.body.number,
        address:req.body.address,
        password:req.body.password,
    } 
    Customer.findOne({email:req.body.Email})
    .then(user=>{
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                data.password = hash;
                Customer.create(data)
                .then(customer=>{
                    //res.json('registered: '+req.body.name);
                    return res.redirect('/login.html');
                })
                .catch(err=>{
                    res.send('err: '+err);
                })
            })
        }else{
            res.send({error:'user already exists'});
        }
    })
    .catch(err=>{
        res.send('err: '+err);
    })
});



app.post('/merchantSignup',function(req,res){
    var data = {
        userType:"merchant",
        name:req.body.name,
        lastName:req.body.lastName,
        email:req.body.Email,
        number:req.body.number,
        company:req.body.company,
        address:req.body.address,
        password:req.body.password,
    }
    Merchant.findOne({email:req.body.Email})
    .then(merchant=>{
        if(!merchant){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                data.password = hash;
                Merchant.create(data)
                .then(customer=>{
                    res.json('registered: '+req.body.company);
                })
                .catch(err=>{
                    res.send('err: '+err);
                })
            })
        }else{
            res.send({error:'merchant record already exists'});
        }
    })
    .catch(err=>{
        res.send('err: '+err);
    })
});






/*
function handleCustomer(request,response){
    readJSONBody(request,function(customerData){
        MongoClient.connect(mongoURL,{ useUnifiedTopology: true },function(err,db){
            if(err) throw err;
            dbo=db.db("UserData");
            var obj = {
                type:customerData.type,
                name:customerData.name,
                last_name:customerData.last_name,
                email:customerData.email,
                phone:customerData.phone,
                address:customerData.address,
                password:customerData.password,            
            };
            dbo.collection("Users").insertOne(obj,function(err,db){
                if(err) throw err;
                console.log("1 user record created: ",customerData.name);
            });
            return response.redirect("/home");
        });
    });
}
function handleMerchant(request,response){
    readJSONBody(request,function(merchantData){
        MongoClient.connect(mongoURL,{ useUnifiedTopology: true },function(err,db){
            if(err) throw err;
            dbo=db.db("UserData");
            var obj = {
                type:merchantData.type,
                name:merchantData.name,
                last_name:merchantData.last_name,
                email:merchantData.email,
                phone:merchantData.phone,
                address:merchantData.address,
                password:merchantData.password,       
                company:merchantData.company,     
            };
            dbo.collection("Users").insertOne(obj,function(err,db){
                if(err) throw err;
                console.log("1 merchant record created for: ",merchantData.company);
            });
        });
    });
}
//handling post requests
app.post('/customerData',function(request,response){
    handleCustomer(request,response);
});

app.post('/merchantData',function(request,response){
   handleMerchant(request,response); 
});*/