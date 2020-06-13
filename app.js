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
const customer = require('./models/customer');
const merchant = require('./models/merchant');
const { response } = require('express');

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
console.log("login trigered");
return response.redirect('/home');
});


//handling post requests
app.post('/customerSignup',function(req,res){
    var name= req.body.name;
    var lastName=req.body.lastName;
    var email=req.body.Email;
    var number=req.body.number;
    var addres=req.body.address;
    var password = req.body.password;
    var data = {
        userType:"customer",
        name:name,
        lastName:lastName,
        email:email,
        number:number,
        address:addres,
        password:password,
    } 
    /*db.collection("Users").insertOne(data,function(err,collection){
        if(err) throw err;
        console.log("1 Customer record created for: ",name);
    })*/
    var user=db.collection("Users").findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                data.password = hash;
                db.collection("Users").insertOne(data,function(err,collection){
                    if(err) throw err;
                    console.log("1 Customer record Created for: ",data.name);
                });
            });
            
        }else{
            console.log("error:user already exists");
        }
    })
    .catch(err=>{
        console.log(err);
    })
});



app.post('/merchantSignup',function(req,res){
    var name=req.body.name;
    var lastName=req.body.lastName;
    var email=req.body.Email;
    var number=req.body.number;
    var company=req.body.company;
    var address = req.body.address;
    var password = req.body.password;
    var data = {
        userType:"merchant",
        name:name,
        lastName:lastName,
        email:email,
        number:number,
        company:company,
        address:address,
        password:password,
    }
    db.collection("Users").insertOne(data,function(err,collection){
        if(err) throw err;
        console.log("1 merchant record created for company: ",company);
    });
    return res.redirect('/home');
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