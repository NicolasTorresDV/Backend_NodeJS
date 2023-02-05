const fs = require("fs")

class Product{
    constructor(id,title,description,price,thumbnail,code,stock){
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

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
        let newId = 1;
        if (this.products.length > 0) {
            newId = this.products[this.products.length - 1].id + 1
        }
        let newProduct = new Product(newId,title,description,price,thumbnail,code,stock);
            this.products.push(newProduct);
            fs.writeFileSync(this.path.toString(), JSON.stringify(this.products));

            return newProduct;      
    }
    
    updateProduct(product){
        this.products = JSON.parse(fs.readFileSync(this.path.toString(),'utf-8'));
        let updatedProducts = this.products.map(
                (oneProduct) => {
                    if (oneProduct.id == product.id){
                        oneProduct = {...product}
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

