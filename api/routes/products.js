const express = require('express');
const Product = require('../models/products');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const router = express.Router();

const fileFilter = (req, file, cb) => {
    // Access file information
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // Accept file
        cb(null, true);
    } else {
        // Reject a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    },
    fileFilter: fileFilter
})

router.get("/", (req, res, next) => {
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
});

router.post("/", upload.single('productImage'), // One file only
    (req, res, next) => {
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
});

router.get('/:productId',
    (req, res, next) => {
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