const mongoose = require('mongoose');

// Define Schema (layout of data object)
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, // Connect Schema with the Product model
    quantity: { type: Number, default: 1}
});

// Define model - provides methods to construct the object

module.exports = mongoose.model('Order', orderSchema);
