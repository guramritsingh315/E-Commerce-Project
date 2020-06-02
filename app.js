var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();

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

app.post('/customerData',function(request,response){
    readJSONBody(request,function(customerData){
        console.log(customerData);
    });
});
app.post('/merchantData',function(request,response){
    readJSONBody(request,function(merchantData){
        console.log(merchantData);
    });
});
