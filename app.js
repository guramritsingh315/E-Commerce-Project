var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost/";
var path = require('path');
app.set('views',path.join(__dirname,'public','views'));
app.set('view engine','ejs');


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

app.listen(8080,function(error){
    if(error) throw error;
    else{
        console.log("Running at: 127.0.0.1:8080");
    }
});

app.use(express.static('public'));
//handling customer data
app.get('/',function(request,response){
    response.render('signup');
});


function handleCustomer(request,callback){
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
                callback();
            });
        });
    });
}

//handling post requests
app.post('/customerData',function(request,response){
    handleCustomer(request,(err)=>{
        console.log("render index.ejs");
        response.render('index'); //Not working
    });
});


app.post('/merchantData',function(request,response){
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
});
