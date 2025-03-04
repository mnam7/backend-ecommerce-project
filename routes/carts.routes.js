const express= require('express');
const cartController = require('../controller/carts.controller');
const router= express.Router()



router.post('/', cartController.addCart)
router.get('/:cid', cartController.getCartbyId)
router.post('/:cid/product/:pid', cartController.addProductCart);


module.exports= router