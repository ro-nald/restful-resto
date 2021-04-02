const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})


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

router.get("/", ProductsController.get_all_products);
router.post("/",
    checkAuth,
    upload.single('productImage'),
    ProductsController.create_product
);
router.get('/:productId', ProductsController.get_single_product);
router.patch('/:productId', ProductsController.update_product);
router.delete('/:productId', ProductsController.delete_product);

module.exports = router;