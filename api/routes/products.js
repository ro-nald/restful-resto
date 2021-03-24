const express = require('express');
const Product = require('../models/products');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/", (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
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
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
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
});

router.get('/:productId',
    (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then( doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + doc._id
                    },
                    request: {
                        type: 'PATCH',
                        url: "http://localhost:3000/products/" + doc._id
                    },
                    request: {
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
});

router.patch('/:productId',
    (req, res, next) => {
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
});

router.delete('/:productId',
    (req, res, next) => {
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
});

module.exports = router;