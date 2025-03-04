const {app, server}= require('./Server');
const PORT= 8080;
const displayRoutes= require("express-routemap");

server.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});