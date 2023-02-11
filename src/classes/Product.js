class Product{
 
    constructor(title,description,code,price,status,stock,category,thumbnails){
        this.title = String(title) || "";
        this.description = String(description) || "";
        this.code = String(code) ;
        this.price = parseInt(price) || 0;
        this.status = status || true;
        this.stock = parseInt(stock) || 0;
        this.category = String(category) || "";
        this.thumbnails = thumbnails || [];
    }
}

export default Product;