const express= require('express')
const router= express.Router()
const fs= require('fs').promises
const path = require('path');
const Cart= require('../models/cart.schema');
const ProductManager = require('../manager/ProductManager');

//const cartsPath = path.join(__dirname, "../bd/carts.json"); 

const productManager = new ProductManager();

/*const getCartbyId = async (req,res) => {
    const {cid}=req.params;
    try {
        const carts = await fs.readFile(cartsPath, 'utf8');
        const cartList = JSON.parse(carts);

        const cart = cartList.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ cart });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}*/

const getCartbyId= async(req,res) =>{
    const {cid}=req.params;
    try {
        const cart= await productManager.getCartbyId(cid);
        res.render("cartsView",{carts: JSON.parse(JSON.stringify(cart))})
        console.log(cart);
        /*res.json(cart);*/
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}


/*const addCart= async (req,res) => {
    try {
        const carts = await fs.readFile(cartsPath, 'utf8');
        const cartList = JSON.parse(carts);
      
        const newCart = {
            id: cartList.length + 1, 
            products: []
        };

        cartList.push(newCart);
        await fs.writeFile('carts.json', JSON.stringify(cartList, null, 2));

        res.status(200).json({ message: 'Carrito creado exitosamente'});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
*/

const addCart=async(req,res)=>{
    try {
        const newCart = await productManager.addCart();
        res.status(200).json({
          sucess: true,
          cart: newCart  
        });
      } catch (error) {
        res.status(500).json({
          sucess:false,
          message: error.message
        });
      }
}
/*
const addProductCart = async(req,res) =>{
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const carts = await fs.readFile(carthsPath, 'utf8');
        const cartList = JSON.parse(carts);
        const cart = cartList.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
         const productIndex = cart.products.findIndex(p => p.id === parseInt(pid));

         if (productIndex !== -1) {
             
             cart.products[productIndex].quantity += 1;
         } else {
             
             cart.products.push({ id: parseInt(pid), quantity });
         }

        await fs.writeFile('carts.json', JSON.stringify(cartList, null, 2));

        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
*/

const addProductCart = async(req,res)=>{
   
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        const updatedCart = await productManager.addProductCart(cid, pid, quantity);
        res.status(200).json({
           success: true,
           cart: updatedCart  
    });
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

const deleteProductsCart = async (req, res) => {
    try {
      const {cid} = req.params 
      const result = await productManager.deleteProductsCart(cid)
      // if(!result){}
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ sucess:false, message: error.message });
    }
  };


  const deleteOneProductCart= async (req,res) =>{
    try {
        const {cid, pid} =req.params
        const result= await productManager.deleteOneProductCart(cid,pid)
        res.status(200).json(result)
     } catch (error) {
        res.status(400).json({sucess:false, message:error.message})
    }
  }

  const updateProductQuantityCart =async (req, res) =>{
    try {
        const {cid,pid}=req.params
        const { quantity } = req.body
        const result= await productManager.updateProductQuantityCart(cid,pid,quantity)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({sucess:false, message:error.message})
    }
  }

  const updateCart =async(req,res) =>{
    try {
        const {cid} = req.params
        const {products}= req.body
        const result= await productManager.updateCart(cid,products)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({sucess:false, message:error.message})
    }
  }

module.exports={getCartbyId, addCart, addProductCart,deleteProductsCart, deleteOneProductCart, updateProductQuantityCart, updateCart}