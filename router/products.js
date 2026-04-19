import express, { Router } from "express"
import mongoose from "mongoose"
import Product from "../model/productsSchema.js"
import category from "../router/categories.js"
import checkAdmin from "../middlewares/checkAdmin.js"
import upload from "../middlewares/upload.js"
let router = express.Router()


router.get("/products", async (req, res) => {

    let { title, img, color, minPrice, maxPrice, category } = req.query
    let filter = {}


    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }

    if (img) {
        filter.img = img
    }
    if (color) {
        filter.color = color
    }
    if (category) {
        const categories = category.split(',').map(id => new mongoose.Types.ObjectId(id));
        filter.category = { $in: categories };
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    try {
        let products = await Product.find(filter).populate("category", "title")
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

router.post("/products", checkAdmin, upload.single("image"), async (req, res) => {

    const imageUrl =
        req.protocol + ".//" + req.get("host") + "/uploads/" + req.file.fieldname;

    try {
        let producs = new Product({
            title: req.body.title,
            color: req.body.color,
            price: req.body.price,
            desc: req.body.desc,
            img: imageUrl,


        })
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

router.put("/products/:id", upload.single("image"), checkAdmin, async (req, res) => {

    let updateData = ({
        title, price, color, desc
    } = req.body)

    if (req.file) {
        const imageUrl = req.protocol + ".//" + req.get("host") + "/uploads/" + req.file.fieldname;
        updateData.img = imageUrl

    }



    try {
        let uProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
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