const express = require('express');
const ProductManager= require('./ProductManager');
const fs= require('fs').promises
const app= express();
const PORT= 8080;

const productManager= new ProductManager('products.json')
app.use(express.json());

app.get('/products', async (req, res)=>{
    try{
        const products= await productManager.getProduct();
        res.json({products});
    } catch(error){
        res.status(404).json({error:'No se puede obtener los productos'})
    }
});

app.get('/products/:pid',async(req,res)=>{
    const { pid } = req.params;
    try{
        const product= await productManager.getProductbyId(pid);
        res.json({product});
    }catch(error){
        res.status(404).json({error:'No se puede obtener el producto por el id'})
    }
})


app.post('/products', async (req, res) => {
    const { title, description, price, status, code, category, stock, thumbnails } = req.body;
    const newProduct = { title, description, price, status, code, category, stock, thumbnails };

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: 'No se pudo agregar el producto' });
    }
});


app.put('/products/:pid',async(req, res)=>{
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
        res.status(500).json({ error: 'Error. No se pudo actualizar'});
    }
})


app.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(parseInt(pid));
        res.json({ message: `Producto con id: ${pid} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});



app.post('/carts', async (req, res)=>{
    try {
        const carts = await fs.readFile('carts.json', 'utf8');
        const cartList = JSON.parse(carts);
      
        const newCart = {
            id: cartList.length + 1, 
            products: []
        };

        cartList.push(newCart);
        await fs.writeFile('carts.json', JSON.stringify(cartList, null, 2));

        res.status(201).json({ message: 'Carrito creado exitosamente'});
    } catch (error) {
        res.status(404).json({ error: 'Error. No se puede crear el carrito' });
    }
})

app.get('/carts/:cid',async(req,res)=>{
    const {cid}=req.params;
    try {
        const carts = await fs.readFile('carts.json', 'utf8');
        const cartList = JSON.parse(carts);

        const cart = cartList.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }

})

app.post('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const carts = await fs.readFile('carts.json', 'utf8');
        const cartList = JSON.parse(carts);
        const cart = cartList.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }


         // Buscar si el producto ya está en el carrito
         const productIndex = cart.products.findIndex(p => p.id === parseInt(pid));

         if (productIndex !== -1) {
             // Si el producto ya existe, solo incrementamos la cantidad
             cart.products[productIndex].quantity += 1;
         } else {
             // Si el producto no está en el carrito, lo agregamos con la cantidad
             cart.products.push({ id: parseInt(pid), quantity });
         }

        await fs.writeFile('carts.json', JSON.stringify(cartList, null, 2));

        res.json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(404).json({ error: 'Error al agregar el producto al carrito' });
    }
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});