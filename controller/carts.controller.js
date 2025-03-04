const express= require('express')
const router= express.Router()
const fs= require('fs').promises
const path = require('path');

const cartsPath = path.join(__dirname, "../bd/carts.json"); 

const getCartbyId = async (req,res) => {
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
}

const addCart= async (req,res) => {
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

module.exports={getCartbyId, addCart, addProductCart}