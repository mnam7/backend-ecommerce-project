const fs= require('fs').promises
const path = require("path");

class ProductManager{
    constructor(){
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
    }
}


module.exports = ProductManager;