
const mongoose = require('mongoose');
const Product = require('../models/products');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            // if (docs.length > 0) {
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: "No entries found."
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then( result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully.",
            createdProduct: {
                name: product.name,
                price: product.price,
                _id: product._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.get_single_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then( doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request_method1: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + doc._id
                    },
                    request_method2: {
                        type: 'PATCH',
                        url: "http://localhost:3000/products/" + doc._id
                    },
                    request_method3: {
                        type: 'DELETE',
                        url: "http://localhost:3000/products/" + doc._id
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID."
                })
            }
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { $set: updateOps })
        .exec()
        .then( result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    res.status(200).json({
        message: 'Updated product!'
    })
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        }); // Don't need to pass exact copy of the object to be deleted, ID will be sufficient
}