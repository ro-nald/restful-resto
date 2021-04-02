const express = require('express');
const morgan =  require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const app = express();

mongoose.connect('mongodb+srv://' + process.env.MONGO_ATLAS_USER + ":" +
                                        process.env.MONGO_ATLAS_PW +
                                        process.env.MONGO_ATLAS_PART_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // We're connected!
})

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false})); // false = only support simple bodies for url encoded data
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // * gives access to any origin - for APIs, want to do this.
    // Allow anything (*) or 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') { // Browser will always send am 'OPTIONS' request prior to a POST or PUT request.
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        ); // Add additional header, about permitted methods
        return res.status(200).json({}); // Return empty JSON response, as the headers contain the information.
    }
    next(); // Call next so that other routes can take over
})

// Set up a Middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error,
         req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;