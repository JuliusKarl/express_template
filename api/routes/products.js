const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling GET Requests"
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id == 'special') {
        res.status(200).json({
            message: "You discovered the special ID",
            id: id
        });
    }
    else {
        res.status(200).json({
            message: "You passed an id",
            id: id
        });
    }
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result)
        })
        .catch(err => {console.log(err)})
    res.status(201).json({
        message: "Handling post Requests",
        createdProduct: product
    });
});

module.exports = router;