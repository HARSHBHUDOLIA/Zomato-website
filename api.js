const express=require('express')//Here I imported the express package
var app=express()//Here I created an object of const express = require('express');
var port=9000//Here I created the port number where my projects will run
var mongodb=require('mongodb')//Here I imported the mongodb package
var bodyParser=require('body-parser')//Here I imported the body-parser package
var MongoClient=mongodb.MongoClient//MongoClient is a method inside mongo, basically it is used to create a client that will use mongdb for our project.
var mongourl="mongodb://localhost:27017";//27017 is the default port number of mongourl.
let cors=require('cors')//By this point you should know what this does otherwise paisa barbbad.
var db//I created this variable to access mongodb data
app.use(cors())//This is now using cors to remove any cross origin resource sharing, Need to ask about this to know more about it.
app.get('/',(req,res)=>{
  res.send("API is Working")
})
//This is the building block of learning backend so understand this, get is a method inside app object that is used to create routes. "/" this signifies default route. (res)->is the server responding and (req) is the user requesting.

app.get('/location',function(req,res){
  db.collection('city').find({}).toArray(function(err,result){
    if (err) throw err;
    res.send(result);

  })
})
//Here you see I used normal function instead of using call back function. db.collection is used to get a particular record when we enter the filter to it. toArray function is used to get it converted into an array because initially it is only a list of objects.toArray also takes a callback function which has an optional err param and result param which gives back the result from dbcollevction after it is converted into an array.
app.get('/mealtype',(req,res)=>{
  db.collection('mealType').find({}).toArray((err,result)=>{
    if (err) throw err;
    res.send(result);
  })
})

app.get("/cuisine",(req,res)=>{
  db.collection('cuisine').find({}).toArray((err,result)=>{
    if (err) throw err;
    res.send(result);
  })
}
)

app.get('/restaurents',(req,res) => {
    var condition = {};
    if(req.query.city && req.query.mealtype){
        condition = {city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        condition={city:req.query.city}
    } else if(req.query.mealtype){
        condition={"type.mealtype":req.query.mealtype}
    }
    else{
        condition={}
    }
    db.collection('restaurent').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//RestaurentDetai+
app.get('/restaurantdetails/:id',(req,res) => {
    var query = {_id:req.params.id}
    db.collection('restaurent').find(query).toArray((err,result) => {
        res.send(result)
    })
})

//RestaurentList
app.get('/restaurantList/:mealtype',(req,res) => {
    var condition = {};
    if(req.query.cuisine){
        condition={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.city){
        condition={"type.mealtype":req.params.mealtype,city:req.query.city}
    }else if(req.query.lcost && req.query.hcost){
        condition={"type.mealtype":req.params.mealtype,cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}
    }
    else{
        condition= {"type.mealtype":req.params.mealtype}
    }
    db.collection('restaurent').find(condition).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//PlaceOrder
app.post('/placeorder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('posted')
    })
})

//order
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

///Not Require in project
//Delete Orders
app.delete('/deleteorders',(req,res) => {
    db.collection('orders').remove({_id:req.body.id},(err,result) => {
        if(err) throw err;
        res.send('data deleted')
    })
})

//Update orders
app.put('/updateorders',(req,res) => {
    db.collection('orders').update({_id:req.body._id},
        {
            $set:{
                name:req.body.name,
                address:req.body.address
            }
        },(err,result) => {
            if(err) throw err;
            res.send('data updated')
        })
})

//Here although we have created a route but there is no data in the database because that will be dynamic once we get the form submissin from different orders.
MongoClient.connect(mongourl,(err,connection)=>{
  if (err) throw err;
  db=connection.db('EdurekaProject'); //As you can see here if connection is established then we connect it to the database of the Project the db on left hand side is different from connection.(db)
  app.listen(port,(err)=>{
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
  });
})
//app.listen is very important because it establishes the connection of the server with port without it you can run it into any port of your localhost,but it signifies that server is running.
