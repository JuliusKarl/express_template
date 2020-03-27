const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

// const Order = require('../models/order');
// const Product = require('../models/product');

const OrdersController = require('../controllers/orders');

// GET all orders
router.get('/', checkAuth, OrdersController.orders_get_all);

// GET a single order by ID
router.get('/:orderId', checkAuth, OrdersController.orders_get_one);

// POST an order
router.post("/", checkAuth, OrdersController.orders_post_one);

// PATCH an order by ID
router.patch('/:orderId', checkAuth, OrdersController.orders_patch_one);

// DELETE an order
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_one);


module.exports = router;