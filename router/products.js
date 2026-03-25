import express, { Router } from "express"
import Product from "../model/productsSchema.js"    
import category from "../router/categories.js"
import checkAdmin from "../middlewares/checkAdmin.js"
let router = express.Router()


router.get("/products", async (req, res) => {

    let { title, img, minPrice, maxPrice, category } = req.query
    let filter = {}


    if (title) {
        filter.title = title
    }

    if(img){
        filter.img = img
    }

    if(category){
        filter.category = category
    }

    if(minPrice || maxPrice){
        filter.price = {};
        if(minPrice) filter.price.$gte = Number(minPrice);
        if(maxPrice) filter.price.$lte = Number(maxPrice);
    }

    try {
        let products = await Product.find().populate("category","title" )
        res.send(products)
    } catch (err) {
        console.log(err.message);
    }
})


router.get("/products/:id", async (req, res) => {
    try {
        let producs = await Product.findById(req.params.id)
        res.send(producs)
    } catch (err) {
        console.log(err.message);
    }
})

router.post("/products",checkAdmin, async (req, res) => {
    try {
        let producs = new Product(req.body)
        await producs.save()
        res.send("Products created!")
    } catch (err) {
        console.log(err.message);
    }
})
router.patch("/products/:id/comment", async (req, res) => {
    try {
        let { user, text } = req.body

        let product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        product.comments.push({ user, text })

        await product.save()

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put("/products/:id", checkAdmin,async (req, res) => {
    try {
        let uProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.send({ message: "Product updated", uProduct })
    } catch (err) {
        console.log(err.message);
    }
})

router.delete("/products/:id", checkAdmin, async (req, res) => {
    try {
        let dProduct = await Product.findByIdAndDelete(
            req.params.id
        )
        res.send({ message: "Products deleted", dProduct })
    } catch (err) {
        console.log(err.message);
    }
})



export default router