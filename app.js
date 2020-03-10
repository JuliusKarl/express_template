const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Routes re-routing
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// MongoDB connection
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@juliuskarlcluster0-ql03u.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(uri, function(err) {
    if (err) {console.log(err)}
    else {console.log("Connected to MongoDB... ")}
});

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://JuliusKarl:24031997@juliuskarlcluster0-ql03u.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// Middleware setup
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '*');
//     if (req.method == 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, DELETE, GET');
//         return res.status(200).json({});
//     };
// });

// Routes which should handle requests.
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;