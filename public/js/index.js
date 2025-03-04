//CLIENT

console.log("In clientaaaaaaaaaaaa")


//conexion con el servidor de socket.IO
const socket=io("http://localhost:8080")



async function agregarProducto(){
const { value: formValues } = await Swal.fire({
    title: "Datos del producto",
    html: `
         <div class="swal-container">
        <div class="swal-row">
          <label for="nombre-producto" class="swal-label">Nombre del producto:</label>
          <input id="nombre-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="desc-producto" class="swal-label">Descripción del producto:</label>
          <input id="desc-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="precio-producto" class="swal-label">Precio:</label>
          <input id="precio-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="status-producto" class="swal-label">Status:</label>
          <input id="status-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="codigo-producto" class="swal-label">Código:</label>
          <input id="codigo-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="categoria-producto" class="swal-label">Categoría:</label>
          <input id="categoria-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="stock-producto" class="swal-label">Stock:</label>
          <input id="stock-producto" class="swal-input">
        </div>
        <div class="swal-row">
          <label for="thumbnails-producto" class="swal-label">Thumbnails:</label>
          <input id="thumbnails-producto" class="swal-input">
        </div>
      </div>
    
    `,
    showCancelButton: true,
    confirmButtonText: 'Agregar Producto',
    focusConfirm: false,
    preConfirm: () => {
      return {
       title: document.getElementById("nombre-producto").value,
       description: document.getElementById("desc-producto").value,
       price: document.getElementById("precio-producto").value,
       status: document.getElementById("status-producto").value,
       code: document.getElementById("codigo-producto").value,
       category: document.getElementById("categoria-producto").value,
       stock: document.getElementById("stock-producto").value,
       thumbnails: document.getElementById("thumbnails-producto").value,
      }
    }
  });
  if (formValues) {
    const { title, description, price ,status, code, category, stock, thumbnails} = formValues;
    if (!title || !description || !price || !status || !code || !category || !stock || !thumbnails) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
    }
    else{
        const productoNuevo = {
            title,
            description,
            price,
            status,
            code,
            category,
            stock,
            thumbnails
          };
        socket.emit("agregarProducto",productoNuevo)
    }
  }
}

const updateProducts = (newProduct) => {
    const productList = document.getElementById("lista-producto");
    productList.innerHTML = '';  
      const productElement = document.createElement("li");
      productElement.innerHTML = `
        <h4>${newProduct.title}</h4>
      `;
      productList.appendChild(productElement); 
  }
  
socket.on("productoNuevo", (nuevoProducto) => {
    console.log(nuevoProducto)
    updateProducts(nuevoProducto);
});


agregarProducto();