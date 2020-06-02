var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost/",function(err,db){
    if(err) throw err;
    var dbo = db.db("UserData");
    dbo.createCollection("Tasks",function(err,res){
        if(err) throw err;
        console.log("Collection created..");
        db.close();
    }); 
});
