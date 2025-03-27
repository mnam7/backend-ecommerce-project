const express = require('express');
const handlebars= require('express-handlebars')
const fs= require('fs').promises
const productRouter= require('./routes/products.routes.js')
const cartRouter= require('./routes/carts.routes.js')
const path = require("path");
const http= require('http')
const socketIo=require('socket.io');
const { addProduct ,deleteProduct} = require('./controller/products.controller.js');
const app= express();
const server=http.createServer(app)
const io=socketIo(server);
const mongoose= require('mongoose')

require("dotenv").config();

//config handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set("view engine", 'handlebars')
app.set("views", path.join(__dirname,'views'))


//middlewares
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}))


//config mongoDB
MONGO_URI=process.env.MONGO_URI

mongoose.connect(MONGO_URI).then(()=>{
    console.log("MongoDB connected")
}).catch((error)=>console.error(error));

//SOCKET
io.on("connection", (socket) => {
    console.log(`Usuario conectado con ID: ${socket.id}`);

    socket.on("agregarProducto", async(producto)=>{
        try {
            const productoNuevo= await addProduct(producto,socket)
            io.emit("productoNuevo",productoNuevo)
        } catch (error) {
            console.log("Error al agregar producto",error)
        }
    })

    socket.on("eliminarProducto",async(idProducto)=>{
            try {
                const updateListProduct= await deleteProduct(idProducto,socket)
                io.emit("listaActualizada", updateListProduct)
            } catch (error) {
                console.log("Error al eliminar producto",error)
            }
    })


    socket.on("disconnect",()=>{
        console.log(`Usuario desconectado con ID: ${socket.id}`);
    })
        
});


app.get('/', (req,res)=>{
    res.render('realTimeProducts');
});

app.use('/products',productRouter)
app.use('/api',cartRouter) 




module.exports = {app,server, io};