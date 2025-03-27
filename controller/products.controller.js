const express = require('express')
const router= express.Router()
const ProductManager = require('../manager/ProductManager');  
const Producto= require('../models/product.schema');

const productManager = new ProductManager();

/*const getAllproducts= async(req, res) =>{
    try{
        const products= await productManager.getProduct();
        res.json({products});
    } catch(error){
        res.status(500).json({message:error.message})
    }
}
*/

const getAllproducts =async(req,res)=>{
    try {
        const limit = parseInt(req.query.limit) || 10;  
        const page = parseInt(req.query.page) || 1; 
        const query = req.query.query || {};  
        const sort = req.query.sort || '';  
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const filters = {};
        if (query.category) {
          filters.category = query.category;
        }
        if (query.stock) {
          filters.stock = query.stock;
        }
        const result = await Producto.paginate(filters, options);
        console.log("......::::", result);
        
        //console.log(result.docs);
        res.render("home", {
          productos: JSON.parse(JSON.stringify(result.docs)),
          currentPage: result.page,
          totalPages: result.totalPages,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
        });
      } catch (err) {
        res.status(500).send(err.message);
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

const addProduct = async (dataOrReq, resSocket) => {
    let title, description, price, status, code, category, stock, thumbnails;
  
    if (dataOrReq.body) {
      ({ title, description, price, status, code, category, stock, thumbnails } = dataOrReq.body);
    } else {
      ({ title, description, price, status, code, category, stock, thumbnails } = dataOrReq);
    }
    const newProduct = { title, description, price, status, code, category, stock, thumbnails };
  
    try {
      await productManager.addProduct(newProduct);  // Llama a la función que agrega el producto
  
      if (resSocket) {
        resSocket.emit('productAdded', { message: 'Producto agregado exitosamente' });
      } else {
        resSocket.status(200).json({ message: 'Producto agregado exitosamente' });
      }
    } catch (error) {
      if (resSocket) {
        resSocket.emit('error', { message: error.message });  // Responde con error por socket
      } else {
        resSocket.status(500).json({ message: error.message });  // Responde con error por HTTP
      }
    }
  };

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


const deleteProduct= async(data,resSocket) =>{

    const productoId = data.params ? data.params.pid : data;

    try {
        await productManager.deleteProduct(parseInt(productoId));
        const updatedProducts = await productManager.getProduct();
        if(resSocket && resSocket.status){
            res.json({ message: `Producto con id: ${productoId} eliminado correctamente` });
        }
        else if(resSocket && resSocket.emit){
           return updatedProducts
        }
       
    } catch (error) {
        
        if (resSocket && resSocket.status){
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        else if( resSocket && resSocket.emit){
            resSocket.emit('error', errorMessage)
        }

    }
}


module.exports={getAllproducts, getProductbyId, addProduct, updateProduct,deleteProduct, getAllProductsView, getRealTimeProducts}