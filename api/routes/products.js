const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require("../controllers/products");

// Will not CREATE a folder, only works for existing folders
const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    });

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') 
        {cb(null, true);}
    else 
        {cb(null, false);}
};

const upload = multer({storage: storage, fileFilter: fileFilter})

const Product = require('../models/product');

// GET all products
router.get('/', ProductsController.products_get_all);

// GET a single product by ID
router.get('/:productId', ProductsController.products_get_one);

// POST a product
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_post_one);

// PATCH a product by ID
router.patch('/:productId', checkAuth, ProductsController.products_patch_one);

// DELETE a product by ID
router.delete('/:productId', ProductsController.products_delete_one);

// Delete all products
router.delete('/', ProductsController.products_delete_all);

module.exports = router;