import express, {Router} from "express";

import {ProductManager} from "./products.router.js"
import __dirname from "../utils.js";

const router = Router();
    
router.get("/", (req, res) => {
    const pm = new ProductManager("./productos.json");
    const products = pm.getProducts();
    res.render("home", {products});
})

router.get("/realtimeproducts", (req, res) => {
    const pm = new ProductManager("./productos.json");
    const products = pm.getProducts();
    res.render("realTimeProducts", {products} );
})

router.get("/productsHandlerWebSockets", (req, res) => {
    res.render("productsHandlerWebSockets", {});
})


export default router; 