const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Route Paths
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// MongoDB connection
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@juliuskarlcluster0-ql03u.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true}, function(err) {
    if (err) {console.log(err)}
    else {console.log("Connected to MongoDB... ")}
});

// Middleware setup
app.use(morgan("dev"));
app.use(express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Routes which should handle requests.
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//  Invalid Endpoint
app.use('/*', (req, res, next) => {
    res.status(404).json({
        error: "Page not Found"
    });
})

module.exports = app;




// EXTRA CODE BELOW!!!
//
//
// Allow CORS
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '*');
//     if (req.method == 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, DELETE, GET');
//         return res.status(200).json({});
//     };
// });