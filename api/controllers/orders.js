const Order = require("../models/order");

//  Get all orders
exports.orders_get_all = (req, res, next) => {
    Order
        .find()
        .select('_id quantity productId')
        .populate('productId', '_id name')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                orders: result.map(result => {
                    return {
                        _id: result.id,
                        quantity: result.quantity,
                        productId: result.productId
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

// Get single order
exports.orders_get_one =  (req, res, next) => {
    const id = req.params.orderId;
    Order
        .findById(id)
        .populate('productId')
        .exec()
        .then(result => {
            const response = {
                _id: result.id,
                quantity: result.quantity,
                productId: result.productId
            }
            return res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
}

// Post single order
exports.orders_post_one = (req, res, next) => {
    Product
        .findById(req.body.productId)
        .then(product => {
                if (!product) {
                    return res.status(404).json({message: "Product not found"})
                }
                const order = new Order({
                    _id: new mongoose.Types.ObjectId,
                    quantity: req.body.quantity,
                    productId: req.body.productId
            })
            return order
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Created order",
                        createdOrder: {
                            _id: result.id,
                            quantity: result.quantity,
                            productId: result.productId
                        }
                    });
                    res.status(200).json(response);
                })
                .catch(err => {
                    res.status(500).json({error: err})
                })
        })
        .catch(err => {
            console.log("Product not found.");
            res.status(500).json({error: err})
        })
}

// Patch an order
exports.orders_patch_one = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.update({ _id: id }, { $set: updateOps})
        .exec()
        .then(result => {
            const response = {
                _id: result.id,
                quantity: result.quantity,
                productId: result.productId,
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(400).json({error: err})
        });
}

// Delete an order
exports.orders_delete_one = (req, res, next) => {
    const id = req.params.orderId;
    Order
        .remove({ _id: id})
        .exec()
        .then(result => {
            const response = {
                _id: result.id,
                quantity: result.quantity,
                productId: result.productId,
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}