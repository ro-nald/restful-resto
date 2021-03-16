const mongoose = require('mongoose');

// Define Schema (layout of data object)
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
});

// Define model - provides methods to construct the object

module.exports = mongoose.model('Product', productSchema);
