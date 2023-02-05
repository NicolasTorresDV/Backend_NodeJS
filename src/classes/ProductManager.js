import Product from "./Product.js";
import fs from "fs"

// const fs = require("fs")

class ProductManager{
    
    constructor(path){
        this.path = [path];
        this.products = [];

        if(!fs.existsSync(this.path.toString())){
            fs.writeFileSync(this.path.toString(),JSON.stringify(this.products))
        }

    }

    getProducts(){
        let productsJSON = fs.readFileSync(this.path.toString(),'utf-8');
        return JSON.parse(productsJSON);
    }

    getProductsById(id){
        this.products = JSON.parse(fs.readFileSync(this.path.toString(),'utf-8'));
        
        for (let i = 0; i < this.products.length; i++) {
            
            if (this.products[i].id === id) {
                return this.products[i]
            }
            
        }

        return "Error, producto no encontrado"
    }

    addProduct(title,description,price,thumbnail,code,stock){

        this.products = this.getProducts();
        if ( this.products.filter(prod=>  prod.code === code).length>0){ return "Error Codigo repetido" }
        let newId = 1;
        if (this.products.length > 0) {
            newId = this.products[this.products.length - 1].id + 1
        }
        let auxProduct = new Product(title,description,price,thumbnail,code,stock)
        let newProduct = {
            id: newId,
            ...auxProduct
            
        } 
            
            this.products.push(newProduct);
            fs.writeFileSync(this.path.toString(), JSON.stringify(this.products));

            return newProduct;      
    }
    
    updateProduct(id,product){
        this.products = this.getProducts();
        if (!id || id <= 0) { return "Error Id no valido" }
        if ( this.products.filter(prod=>  prod.code === product.code && prod.id !== id).length>0)
        { return "Error Codigo repetido" }

        this.products = JSON.parse(fs.readFileSync(this.path.toString(),'utf-8'));
        let updatedProducts = this.products.map(
                (oneProduct) => {
                    if (oneProduct.id == id){
                        oneProduct = {id,...product}
                    }
                    return oneProduct
                }
            )
        fs.writeFileSync(this.path.toString(), JSON.stringify(updatedProducts));
    }

    deleteProduct(id){
        this.products = JSON.parse(fs.readFileSync(this.path.toString(),'utf-8'));
        let updatedProducts = this.products.filter(oneProduct => oneProduct.id != id);
        if (updatedProducts.length == this.products.length) {
            return "No se encontró el producto a eliminar"
        }else{
            fs.writeFileSync(this.path.toString(), JSON.stringify(updatedProducts));
        }

    }
}

// let pm = new ProductManager("./Productos.txt");

// // pm.addProduct("aa","aa",123,"aa",1234,1234)
// let pro = new Product("BB","CC",123,"aa",1234,1234);
// pm.updateProduct(1,pro)


export default ProductManager;