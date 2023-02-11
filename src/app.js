// import ProductManager from "./routes/products.router.js";

import express from "express";
import routerApi from "./routes/index.js";

const PORT = 8080;
const myApp = express();

myApp.use(express.json());
myApp.use(express.urlencoded({extended:true}));


myApp.listen(PORT, () => {
    console.log("Mi port:" + PORT)
})

routerApi(myApp);