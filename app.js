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
const Product = require('./models/product');
const product = require('./models/product');

//connecting to data base
mongoose.connect('mongodb://localhost/UserData', { useNewUrlParser: true,useUnifiedTopology:true });
var db=mongoose.connection;
db.on('error',console.log.bind(console,"connection error"));
db.once('open',function(callback){
    console.log("connection successful");
});

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
mongoose.set('useFindAndModify', false);
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
app.get('/merchantHome',ensureToken,function(request,response){
    jwt.verify(request.cookies.token,process.env.SECRET_KEY,function(err,data){
        if(err) throw err;
        else{
            user = data;
            response.render('merchantHome',{name:user.name});
        }
    })
})
app.get('/login.html',function(request,response){
    response.sendFile(path.join(__dirname,'views','login.html'));
});
app.get('/signup',function(request,response){
    response.render('signup');
});
app.get('/admin',function(req,res){
    res.sendFile(path.join(__dirname,'views','admin.html'));
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
app.get('/productRequests',ensureToken,function(req,res){
    jwt.verify(req.cookies.token,process.env.SECRET_KEY,function(err,data){
        if(err){
            res.send("Something went wrong!!");
        } 
        else{
            res.send("Product request initiate");
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
  function readJSONBody(request, callback) 
  {
    var body = '';
    request.on('data', function(chunk) {
                       body += chunk;
              });
  
    request.on('end', function() {
                      var data = JSON.parse(body);
                      callback(data);
             });
  }
//handling post requests
app.post('/authenticate',function(req,res){
    if(req.body.login_email==="admin@ecommerce.com" && req.body.login_password==="admin123"){
        var admin_payload={
            name:"Administrator",
            email:"admin@ecommerce.com"
        }
        let token = jwt.sign(admin_payload,process.env.SECRET_KEY,{expiresIn:2*60*60});
        res.cookie('token',token,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
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
                    let token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:2*60*60});
                    res.cookie('token',token); 
                    res.redirect("/merchantHome");
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
                    let token = jwt.sign(Cust_payload,process.env.SECRET_KEY,{expiresIn:2*60*60});
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
//handling signups
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
     res.redirect("/login.html");
})
//User editing and deletion
app.post('/delete_cust',ensureToken,function(req,res){
    readJSONBody(req,function(cust){
        var query = {email:cust.email};
        Customer.deleteOne(query,function(err){
            if(err) return res.send(500,'deletion failed');
          return res.send(200,"deletion successfull");
        })     
    })
});
app.post('/delete_merchant',ensureToken,function(req,res){
    readJSONBody(req,function(cust){
        var query = {email:cust.email};
        Merchant.deleteOne(query,function(err){
            if(err) res.send(500,"deletion failed");
            return res.send(200,"deletion successfull");
        })     
    })
})
app.post('/updateMerchant',ensureToken,function(req,res){
    readJSONBody(req,function(user){
        var query = {email:user.email};
        var data = {
            name:user.name,
            lastName:user.lastName,
            email:user.email,
            number:user.phone,
            address:user.address
        };
       Merchant.findOne(query)
       .then(user=>{
            Merchant.updateOne(query,data,{upsert:false},function(err,doc){
                if(err) return res.send(500,{err:err});
                res.status(200).send();
            })
       })//this block ending
       .catch(err=>{
           res.send({err:err});
       })
    })
});



app.post('/updateCustomer',function(req,res){
    readJSONBody(req,function(user){
        var query = {email:user.email};
        var data = {
            name:user.name,
            lastName:user.lastName,
            email:user.email,
            number:user.phone,
            address:user.address
        };
       Customer.findOne(query)
       .then(user=>{
            Customer.updateOne(query,data,{upsert:false},function(err,doc){
                if(err) return res.send(500,{err:err});
                res.status(200).send();
            })
       })//this block ending
       .catch(err=>{
           res.send({err:err});
       })//catch ending
    })
});

app.post('/addProduct',ensureToken,function(req,res){
jwt.verify(req.cookies.token,process.env.SECRET_KEY,function(err,data){
        var productSpec = {
            name:req.body.productName,
            price: req.body.productPrice,
            quantity: req.body.productQuantity,
            owner:data.email   
        }
        Product.create(productSpec);
        res.status(200).send("Product Created");

    })
})

