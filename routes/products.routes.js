const express = require('express')
const router= express.Router()
const productController = require('../controller/products.controller');


router.get('/', productController.getAllproducts);
router.get('/home',productController.getAllProductsView);
router.get('/realTimeProducts',productController.getRealTimeProducts)
router.get('/:pid', productController.getProductbyId);
router.post('/', productController.addProduct);
router.put('/:pid',productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);


module.exports= router