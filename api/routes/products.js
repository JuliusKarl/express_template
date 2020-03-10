const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// Get all products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
    
});

// Get a single product ID
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            (doc? res.status(200).json(doc) : res.status(404).json({ message: "No valid entry found for provided ID"}));
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
});

// Post a product to the DB
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling post Requests",
                createdProduct: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err});
        })
});

router.delete('/:productId', function(req, res, next) {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
});

module.exports = router;