const mongoose = require('mongoose');

// Define Schema (layout of data object)
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

// Define model - provides methods to construct the object

module.exports = mongoose.model('Product', productSchema);
