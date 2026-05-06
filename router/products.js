import express, { Router } from "express"
import mongoose from "mongoose"
import Product from "../model/productsSchema.js"
import category from "../router/categories.js"
import checkAdmin from "../middlewares/checkAdmin.js"
import upload from "../middlewares/upload.js"
let router = express.Router()
import auth  from "../middlewares/auth.js"

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


// Бэкенд - исправь этот роут
router.get("/products/:id", async (req, res) => {
    try {
      let product = await Product.findById(req.params.id).populate("category", "title"); // ← добавь populate
      res.send(product);
    } catch (err) {
      console.log(err.message);
    }
  });

router.post("/products", auth, checkAdmin, async (req, res) => {
    try {
        const product = new Product({
            title: req.body.title,
            color: req.body.color,
            price: Number(req.body.price),
            desc: req.body.desc,
            img: req.body.img,
            category: req.body.category,
        })
        await product.save()
        
        // ✅ Возвращаем объект с _id, populate категории
        const populated = await product.populate("category", "title")
        res.status(201).json(populated)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: err.message })
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
}),

router.put("/products/:id", auth, checkAdmin, async (req, res) => {
    const { title, price, color, desc, img, category } = req.body

    const updateData = {}
    if (title    !== undefined) updateData.title    = title
    if (price    !== undefined) updateData.price    = Number(price)
    if (color    !== undefined) updateData.color    = color
    if (desc     !== undefined) updateData.desc     = desc
    if (img      !== undefined) updateData.img      = img
    if (category !== undefined) updateData.category = category

    try {
        const uProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate("category", "title") // ✅ populate чтобы фронт получил объект категории

        if (!uProduct) return res.status(404).json({ message: "Product not found" })
        res.json(uProduct) // ✅ возвращаем объект, а не обёртку
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: err.message })
    }
})


router.delete("/products/:id", auth,checkAdmin, async (req, res) => {
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