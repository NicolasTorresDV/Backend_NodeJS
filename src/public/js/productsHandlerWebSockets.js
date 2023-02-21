const socket = io();

const createProductButton = document.getElementById("createProduct");
const updateProductButton = document.getElementById("updateProduct");
const deleteProductButton = document.getElementById("deleteProduct");

socket.on("createProductMessage", data => {
    if (!data.id) {
        document.getElementById("message").innerHTML = data.message
    }
    else{
        document.getElementById("message").innerHTML = "Producto creado correctamente!"
    }
})

socket.on("updateProductMessage", data => {
        document.getElementById("message").innerHTML = data.message
})

socket.on("deleteProductMessage", data => {
        document.getElementById("message").innerHTML = data.message
})


createProductButton.onclick = () => {
    let data = getFormData();
    socket.emit("createProduct",data);
}
updateProductButton.onclick = () => {
    let data = getFormData();
    let id = document.getElementById("productId").value;
    if (id.lenght >= 0) {
        document.getElementById("message").innerHTML = "No puede estar el ID vacio"
    }else{

        socket.emit("updateProduct",{id, data});
    }
}
deleteProductButton.onclick = () => {
    let id = document.getElementById("productId").value;
    if (id.lenght >= 0) {
        document.getElementById("message").innerHTML = "No puede estar el ID vacio"
    }else{
        socket.emit("deleteProduct",id);    
    }
}

function getFormData(){
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let code = document.getElementById("code").value;
    let price = parseInt(document.getElementById("price").value);
    let stock = parseInt(document.getElementById("stock").value);
    let category = document.getElementById("category").value;
    let thumbnails = document.getElementById("thumbnails").value.split(",");

    return {title,description,code,price,status: true,stock,category,thumbnails}
}
