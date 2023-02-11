//Centralizo mis routers aqui

import cartRouter from "./cart.router.js"
import {productsRouter} from "./products.router.js"

function routerApi(app){
    app.use("/api/products",productsRouter )
    app.use("/api/carts",cartRouter )
}

export default routerApi;