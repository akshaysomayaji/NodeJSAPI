const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/", productController.createProduct);                
router.get("/", productController.getAllProducts);                 
router.get("/trending", productController.getTrendingProducts);    
router.get("/popular", productController.getMostPopular);          
router.get("/:id", productController.getProductById);              
router.patch("/:id/flags", productController.updateFlags);         

module.exports = router;