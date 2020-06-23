var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var users = express.Router();
var cors =require('cors');
var cookieParser = require('cookie-parser');
var passport = require('passport');
//importing schemas
const Customer = require('./models/customer');
const Merchant = require('./models/merchant');
const { response } = require('express');
const { allowedNodeEnvironmentFlags } = require('process');
//connecting to data base
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
app.use(cookieParser());
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
app.get('/home',ensureToken,function(request,response){
    jwt.verify(request.cookies.token,process.env.SECRET_KEY,function(err,data){
        if(err) throw err;
        else{
            user = data;
            response.render('index',{name:user.name});
        }
    })
});
app.get('/login.html',function(request,response){
    response.sendFile(path.join(__dirname,'views','login.html'));
});
app.get('/signup',function(request,response){
    response.render('signup');
});
app.get('/admin',function(req,res){
    res.render('admin');
});
app.get('/merchant_data',ensureToken,function(req,res){
    jwt.verify(req.cookies.token,process.env.SECRET_KEY,function(err,data){
        if(err) throw err;
        else{
            Merchant.find({},function(err,data){
                if(err) throw err;
                res.send(data);
            })
        }
    })  
});
app.get('/customer_data',ensureToken,function(req,res){
    jwt.verify(req.cookies.token,process.env.SECRET_KEY,function(err,data){
        if(err) throw err;
        else{
            Customer.find({},function(err,data){
                if(err) throw err;
                res.send(data);
            })
        }
    }) 
})

function ensureToken(req, res, next) {
    if (req.cookies.token) {
      next();
    } else {
      res.sendStatus(403);
    }
  }

//handling post requests
app.post('/authenticate',function(req,res){
    if(req.body.login_email==="admin@ecommerce.com" && req.body.login_password==="admin123"){
        var admin_payload={
            name:"Administrator",
            email:"admin@ecommerce.com"
        }
        let token = jwt.sign(admin_payload,process.env.SECRET_KEY,{expiresIn:24000});
        res.cookie('token',token);
        res.redirect("/admin");
    }
    else if(req.body.merchant==='merchant'){
        Merchant.findOne({email:req.body.login_email})
        .then(user=>{
            if(user){
                if(bcrypt.compareSync(req.body.login_password,user.password)){
                    var payload = {
                        _id:user._id,
                        name:user.name,
                        last_name:user.lastName,
                        email:user.email,
                    };
                    let token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:24000});
                    res.cookie('token',token); 
                    res.redirect("/home");
                }else{
                    //passwords do not match
                    res.json({error:'Passwords do not match!!'});
                } 
            }else{ 
                res.json({error:'User does not exist'});
            }
        })
        .catch(err=>{
            res.send('error: '+err);
        })
    }
    else if(typeof(req.body.merchant)==='undefined'){
        Customer.findOne({email:req.body.login_email})
        .then(user=>{
            if(user){
                if(bcrypt.compareSync(req.body.login_password,user.password)){
                    var Cust_payload = {
                        _id:user._id,
                        name:user.name,
                        last_name:user.lastName,
                        email:user.email,
                    };
                    let token = jwt.sign(Cust_payload,process.env.SECRET_KEY,{expiresIn:1440});
                    res.cookie('token',token); 
                    res.redirect("/home");
                }else{
                    //passwords do not match 
                    res.json({error:'Passwords do not match!!'});
                } 
            }else{ 
                res.json({error:'User does not exist'});
            }
        })
        .catch(err=>{
            res.send('error: '+err);
        })
    }
    
    
});
app.post('/customerSignup',function(req,res){
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
app.post("/logout",function(req,res){
    res.clearCookie("token");
    req.logOut();
     res.redirect("/");
})


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
                    //res.json('registered: '+req.body.company);
                    return res.redirect("/login.html");
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