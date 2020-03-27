const Product = require("../models/product");

// Get all products
exports.products_get_all = (req, res, next) => {
    Product
        .find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage     
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

// Get single product
exports.products_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product
        .findById(id)
        .exec()
        .then(doc => {
            const response = {
                name: doc.name,
                price: doc.price,
                _id: doc._id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
}

// Post single product
exports.products_post_one = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    id: result.id,
                    productImage: result.productImage
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err});
        })
}

// Patch a single product
exports.products_patch_one = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id }, { $set: updateOps})
        .exec()
        .then(result => {
            const response = {
                name: result.name,
                price: result.price,
                _id: result.id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(400).json({error: err})
        });
}

// Delete a single product
exports.products_delete_one = (req, res, next) => {
    const id = req.params.productId;
    Product
        .remove({ _id: id })
        .exec()
        .then(result => {
            const response = {
                name: result.name,
                price: result.price,
                _id: result.id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

// Delete all products
exports.products_delete_all = (req, res, next) => {
    Product
        .remove()
        .exec()
        .then(result => {
            const response = {
                name: result.name,
                price: result.price,
                _id: result.id
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}