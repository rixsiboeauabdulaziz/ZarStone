import express from "express"
import Categories from "../model/categoriesSchema.js"
import auth from "../middlewares/auth.js"
import checkAdmin from "../middlewares/checkAdmin.js"

let router = express.Router()

router.get("/categories", async (req, res) => {
    let { title } = req.query
    let filter = {}
    if (title) filter.title = title
    try {
        let categories = await Categories.find(filter)
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get("/categories/:id", async (req, res) => {
    try {
        let category = await Categories.findById(req.params.id)
        res.json(category)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/categories", auth, checkAdmin, async (req, res) => {
    try {
        const category = new Categories({  // ✅ Categories, не Category
            title: req.body.title,
            img:   req.body.img,
            desc:  req.body.desc,
        })
        await category.save()
        res.status(201).json(category)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put("/categories/:id", auth, checkAdmin, async (req, res) => {
    try {
        const updated = await Categories.findByIdAndUpdate(  // ✅ Categories
            req.params.id,
            { title: req.body.title, img: req.body.img, desc: req.body.desc },
            { new: true }
        )
        if (!updated) return res.status(404).json({ message: "Not found" })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete("/categories/:id", auth, checkAdmin, async (req, res) => {
    try {
        const deleted = await Categories.findByIdAndDelete(req.params.id)
        res.json({ message: "Category deleted", deleted })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router