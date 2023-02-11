import Product from "../classes/Product.js";
import {Router} from "express";
import fs from "fs"

const dirPath = "./productos.json";
const productsRouter = Router();

class ProductManager{
    
    constructor(path){
        this.path = [path];
        this.products = [];
        if(!fs.existsSync(this.path.toString())){
            fs.writeFileSync(this.path.toString(),JSON.stringify(this.products))
        }

    }

    productValidation(data){
         //Validaciones
         let errorMessage = "";
         if(!data.title || data.title.toString().length <= 0){
            return errorMessage+= "El titulo no puede estar vacio"
         }
         if(!data.description || data.description.toString().length <= 0){
            return errorMessage+= "La descripción no puede estar vacia"
         }
         if(!data.code || data.code.toString().length <= 0){
            return errorMessage+= "El codigo no puede estar vacio"
         }
         if(!data.price || !Number.isFinite(data.price) || data.price <= 0 ){
            return errorMessage+= "El precio no es válido"
         }
         if(!data.status || (data.status !== true || !data.status !== false)){
            return errorMessage+= "El status no es válido"
         }
         if(!data.stock || !Number.isFinite(data.stock) || data.price < 0 ){
            return errorMessage+= "El stock no es válido"
         }
         if(!data.category || data.category.toString().length <= 0){
            return errorMessage+= "La cateogria no puede estar vacia"
         }
         if(!data.description || data.description.toString().length <= 0){
            return errorMessage+= "La description no puede estar vacia"
         }
         if(!data.thumbnails || !Array.isArray(data.thumbnails)){
            return errorMessage+= "El/Los thmbnails no son validos"
         }
         
         return errorMessage;
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

        return {message: "Error, producto no encontrado"}
    }

    addProduct(data){

        let errorMessage = this.productValidation(data)
        
        if (errorMessage !== "") {
            return {message: "Error: " + errorMessage}
        }
        this.products = this.getProducts();
  
        if ( this.products.filter(prod=>  prod.code === data.code).length>0){ return {message: "Error: Codigo repetido" }}
        let newId = 1;
        
        if (this.products.length > 0) {
            newId = this.products[this.products.length - 1].id + 1
        }
        let auxProduct = new Product(data.title,data.description,data.code,data.price,data.status,data.stock,data.category,data.thumbnails)
        let newProduct = {
            id: newId,
            ...auxProduct
            
        } 
            
        this.products.push(newProduct);
        fs.writeFileSync(this.path.toString(), JSON.stringify(this.products));

        return newProduct;      
    }
    
    updateProduct(id,data){

        this.products = this.getProducts();
        if (!id || id <= 0) { return "Error Id no valido" }        
        if (this.products.filter(prod=> prod.id === id).length <= 0) { return "Error no existe producto con ese ID" } 

        if (this.products.filter(prod=> prod.code === data.code && prod.id !== id).length>0)
        {return "Error Codigo repetido" }

        this.products = JSON.parse(fs.readFileSync(this.path.toString(),'utf-8'));
        let updatedProducts = this.products.map(
                (oneProduct) => {
                    if (oneProduct.id == id){
                        oneProduct = {id,...oneProduct,...data}
                    }
                    return oneProduct
                }
            )
        fs.writeFileSync(this.path.toString(), JSON.stringify(updatedProducts));
        return `Producto ${id} actualizado`
        
    }

    deleteProduct(id){
        this.products = JSON.parse(fs.readFileSync(this.path.toString(),'utf-8'));
        let updatedProducts = this.products.filter(oneProduct => oneProduct.id != id);
        if (updatedProducts.length == this.products.length) {
            return "No se encontró el producto a eliminar"
        }else{
            fs.writeFileSync(this.path.toString(), JSON.stringify(updatedProducts));
            return `Producto ${id} eliminado`
        }

    }
}

const pm = new ProductManager(dirPath);

productsRouter.get('/', async (req,res) => {
    const pm = new ProductManager(dirPath);
    const { limit } = req.query;
    try {
        if (!limit) {
            res.status(200).json( await pm.getProducts())
        }else{
            let newProducts = pm.getProducts();
            res.status(200).json(newProducts.slice(0,limit));
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

productsRouter.post('/', async (req, res) => {
    const body = req.body;
    try {
        let newProduct = await pm.addProduct(body);
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
})

productsRouter.get('/:pid', async (req,res) => {
    const { pid } = req.params;
    res.status(200).json( await pm.getProductsById(parseInt(pid)))
});

productsRouter.put("/:pid", async (req,res) => {
    const { pid } = req.params;
    const body = req.body
    try {
        let message = await pm.updateProduct(parseInt(pid),body)
        res.status(200).json({message: message})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

productsRouter.delete('/:pid', async (req,res) => {
    const { pid } = req.params;
    try {
        let message = await pm.deleteProduct(pid)
        res.status(200).json({message: message})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

export {productsRouter , ProductManager};
