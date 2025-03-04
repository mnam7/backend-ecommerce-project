const express = require('express')
const router= express.Router()
const ProductManager = require('../manager/ProductManager');  

const productManager = new ProductManager();

const getAllproducts= async(req, res) =>{
    try{
        const products= await productManager.getProduct();
        res.json({products});
    } catch(error){
        res.status(500).json({message:error.message})
    }
}

const getAllProductsView = async (req, res) => {
    try {
        const products = await productManager.getProduct();
        res.render("home",  {products} );
    } catch (error) {
        res.status(500).send("Error al cargar la página.");
    }
};

const getRealTimeProducts = async (req, res) => {
    try {
        const products = await productManager.getProduct();
        res.render("realTimeProducts",  {products} );
    } catch (error) {
        res.status(500).send("Error al cargar la página.");
    }
};





const getProductbyId= async(req, res) =>{
    const { pid } = req.params;
    try{
        const product= await productManager.getProductbyId(pid);
        res.json({product});
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

const addProduct =async(req,res) =>{
    const { title, description, price, status, code, category, stock, thumbnails } = req.body;
    const newProduct = { title, description, price, status, code, category, stock, thumbnails };

    try {
        await productManager.addProduct(newProduct);
        res.status(200).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const updateProduct = async(req,res) =>{
    const { pid } = req.params;
    const { title, description, price, status, code, category, stock, thumbnails} = req.body;
    const updatedProduct = {title, description, price, status, code, category, stock, thumbnails }; 
    try {
        const product = await productManager.updateProduct(parseInt(pid), updatedProduct);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado exitosamente'});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


const deleteProduct= async(req,res) =>{
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(parseInt(pid));
        res.json({ message: `Producto con id: ${pid} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
}



const addProductSocket = async (producto) => {
    const { title, description, price, status, code, category, stock, thumbnails } = producto;
    const newProduct = { title, description, price, status, code, category, stock, thumbnails };

    try {
        await productManager.addProduct(newProduct);
        return newProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports={getAllproducts, getProductbyId, addProduct, updateProduct,deleteProduct, getAllProductsView,addProductSocket, getRealTimeProducts}