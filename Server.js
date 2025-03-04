const express = require('express');
const handlebars= require('express-handlebars')
const fs= require('fs').promises
const productRouter= require('./routes/products.routes.js')
const cartRouter= require('./routes/carts.routes.js')
const path = require("path");
const http= require('http')
const socketIo=require('socket.io');
const { addProductSocket } = require('./controller/products.controller.js');
const app= express();
const server=http.createServer(app)
const io=socketIo(server);

//config handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set("view engine", 'handlebars')
app.set("views", path.join(__dirname,'views'))


//middlewares
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

io.on("connection", (socket) => {
    console.log(`Usuario conectado con ID: ${socket.id}`);

    socket.on("agregarProducto", async(producto)=>{
          //console.log(producto)
        try {
            const productoNuevo= await addProductSocket(producto)
            io.emit("productoNuevo",productoNuevo)
            console.log(productoNuevo)
        } catch (error) {
            console.log("Error al agregar producto",error)
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
app.use('/carts',cartRouter)
app.use('/home',productRouter)
app.use('/realTimeProducts',productRouter)



module.exports = {app,server, io};