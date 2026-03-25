import express from "express"
import checkAdmin from "../middlewares/checkAdmin.js"
import Users from "../model/userSchema.js"
let router = express.Router()

router.get("/users", async (req, res) => {

    try {
        let products = await Users.find()
        res.send(products)
    } catch (err) {
        console.log(err.message);
    }
})


router.get("/users/:id", async (req, res) => {
    try {
        let producs = await Users.findById(req.params.id)
        res.send(producs)
    } catch (err) {
        console.log(err.message);
    }
})

router.post("/Users", checkAdmin ,async (req, res) => {
    try {
        let producs = new Users(req.body)
        await producs.save()
        res.send("Products created!")
    } catch (err) {
        console.log(err.message);
    }
})


router.put("/users/:id",checkAdmin, async (req, res) => {
    try {
        let uProduct = await Users.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.send({ message: "Product updated", uProduct })
    } catch (err) {
        console.log(err.message);
    }
})

router.delete("/users/:id",checkAdmin, async (req, res) => {
    try {
        let dProduct = await Users.findByIdAndDelete(
            req.params.id
        )
        res.send({ message: "Products deleted", dProduct })
    } catch (err) {
        console.log(err.message);
    }
})

export default router