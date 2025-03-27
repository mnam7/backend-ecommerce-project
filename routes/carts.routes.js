const express= require('express');
const cartController = require('../controller/carts.controller');
const router= express.Router()



router.post('/', cartController.addCart)
router.get('/carts/:cid', cartController.getCartbyId)
router.post('/:cid/product/:pid', cartController.addProductCart);
router.delete('/carts/:cid',cartController.deleteProductsCart);
router.delete('/carts/:cid/product/:pid',cartController.deleteOneProductCart);
router.put('/carts/:cid/product/:pid', cartController.updateProductQuantityCart);
router.put('/carts/:cid', cartController.updateCart);


module.exports= router