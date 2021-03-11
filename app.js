const express = require('express');
const morgan =  require('morgan');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const app = express();

app.use(morgan('dev'))

// Set up a Middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;