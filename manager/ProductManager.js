const fs= require('fs').promises
const path = require("path");
const mongoose= require("mongoose");
const Producto= require("../models/product.schema")
const Cart= require("../models/cart.schema")

class ProductManager{


    //CON FILESYSTEM
   /* constructor(){
        this.path = path.join(__dirname, "../bd/products.json");
    }
    async addProduct(product) {

        try {
              
            const data = await fs.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            product.id = products.length + 1;
            products.push(product);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log('Producto agregado exitosamente');
            } 
        catch (error) {
             console.error('Error al agregar producto:', error);
        }    
    }

     async getProduct(){
        try {
            const data= await fs.readFile(this.path,'utf8');
            const products= JSON.parse(data);
            return products;
        } catch (error) {
            console.log("No se pudo leer el archivo",error);
        }
    }

    async getProductbyId(id){
        try {
            const data= await fs.readFile(this.path, 'utf8');
            const products= JSON.parse(data);
            const product= products.find(p=> p.id == id);

            if(!product){
                console.log("producto no encontrado")
            }
            
            return product;

        }
         catch (error) {
            console.error('Error al obtener el producto',error);
        }
        
       }
    
    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProduct();
            const product = products.find(product => product.id == id);

            if (!product) return null;

            product.title = updatedProduct.title || product.title;
            product.description = updatedProduct.description || product.description;
            product.price = updatedProduct.price || product.price;
            product.status = updatedProduct.status || product.status;
            product.code = updatedProduct.code || product.code;
            product.category = updatedProduct.category || product.category;
            product.stock = updatedProduct.stock || product.stock;
            product.thumbnails= updatedProduct.thumbnails || product.thumbnails; 

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            console.error("Error al actualizar producto",error);
        }
    }

    async deleteProduct(id){
        try {
            const data= await fs.readFile(this.path,'utf8');
            const products = JSON.parse(data);
            const updatedProducts = products.filter(product => product.id !== id);
            await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
            console.log(`Usuario con id: ${id} eliminado correctamente`);
        } catch (error) {
            console.log('Error al eliminar usuario', error);
        }
    }*/

    //CON MONGODB

    async addProduct(product){
        try {
            
            if(!product) throw new Error("Datos de producto no proporcionados");
            console.log("Producto recibido:", product);  
            const producto= new Producto(product)
            return await producto.save()

        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }
    
    async getProduct(){
        try {
            const productos=await Producto.find({},"title description price status code category stock thumbnails")
            return productos
        } catch (error) {
            console.log("No se pudo leer el archivo",error);
        }
    }
     
    

      async addCart(){
        try {
            const newCart = new Cart({
              products: []
            });
            return await newCart.save();
        
          } catch (error) {
            res.status(500).json({ success: false, message: error.message });
          }
      }

      async addProductCart(cid, pid, quantity){
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
              throw new Error('Carrito no encontrado');
            }
            const existingProductIndex = cart.products.findIndex(
              (item) => item.producto.toString() === pid
            );
            if (existingProductIndex !== -1) {
              cart.products[existingProductIndex].quantity += quantity;
            } else {
              cart.products.push({ producto: pid, quantity });
            }
            await cart.save();
      
            return cart;  
        } catch (error) {
            throw new Error(error.message);
        }
      }
     
      async deleteProductsCart(cid) {
        try {
          // Validar
          const deleteProducto = await Cart.updateOne(
            {_id:cid},
            {$set:{products:[]}}
            )
          console.log("----->", deleteProducto)
          // Validar
          return deleteProducto
    
        } catch (error) {
          console.error("Error eliminando producto:", error.message);
          return { success: false, message: error.message };
        }
      }


      async deleteOneProductCart(cid,pid){
        try {
            const cart = await Cart.findById(cid);
            cart.products= cart.products.filter(p=>p.producto.toString()!==pid)
            return await cart.save();
        } catch (error) {
            console.error("Error eliminando producto:", error.message);
          return { success: false, message: error.message };
        }
      }
    
      async updateProductQuantityCart (cid, pid, quantity){
        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: cid, "products.producto": pid },  
                { 
                    $set: { "products.$.quantity":quantity } 
                },
                { new: true }            
            );
            if (!cart) {
                throw new Error('Carrito o producto no encontrado');
            }
            return { success: true, cart };
        } catch (error) {
            return { success: false, message: error.message };
        }
      }

      async updateCart(cid,data){
        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: cid},  
                { 
                    $set: { "products":data } 
                },
                { new: true }            
            );
            return { success: true, cart };
        } catch (error) {
            return{sucess:false, message:error.message}
        }
      } 

      async getCartbyId(cid){
        try {
            const cart= await Cart.findById(cid).populate('products.producto')
            return cart
        } catch (error) {
            return{sucess:false, message:error.message}
        }
      }



    }




module.exports = ProductManager;