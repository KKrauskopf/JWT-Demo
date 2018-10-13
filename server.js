const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const PORT = 3000;

const userRoute = require('./user.route');

// DB 

mongoose.connect('mongodb://localhost/jwtauth');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to DB");
});

// Express

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, function(){
   console.log('Server is running on Port',PORT);
});

app.get('/checking', function(req, res){
    res.json({
       "Tutorial": "Welcome to the Node express JWT Tutorial"
    });
 });

 app.get('/secure/data', function(req, res){

    let token;
    let header = req.headers['authorization'];

    if (header.startsWith("Bearer ")){
        token = header.substring(7, header.length);
    } else {
      console.log("malformed auth header!");
    }

    try {
        var decoded = jwt.verify(token, 'secret');
        console.log("verified!" + JSON.stringify(decoded));
        res.json({
            "secureData": "xD"
         });
      } catch(err) {
        console.log("invalid JWT");
        res.json({
            "get": "fucked"
         });
      }
 });

 // User endpoint

 app.use('/user', userRoute);