const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("./verifyToken");
const Product = require("../model/product");

router.route("/products")
    .get(async (req, res) => {
        // totalProducts
        const countProduct = await Product.find().countDocuments(); // .countDocuments räknar bara hur många object som finns i databasen.

        // localhost:8000/product/?page=1

      
        const products = await Product.find().populate("user -password").skip((page - 1) * pageLength).limit(pageLength)

        console.log("products", products)
        res.send("Product has been shown.")

        const pageLength = 3
        let productLength = await Product.find().countDocuments() / pageLength
        productLength = Math.ceil(productLength)
        const page = parseInt(req.query.page)

        res.render("product", {
            products,
            productLength,
            page
        })
    })


router.route("/createproduct")
    .get(async (req, res) => {
        await new Product({
            name: "Sko",
            price: 1000,
            description: "Hej och hallå",
            user: req.body.user._id
            
        }).save()
        // res.redirect("/products")
        res.send("Product is created.")
    })


module.exports = router;