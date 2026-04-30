import express from "express"
import checkAdmin from "../middlewares/checkAdmin.js"
import Users from "../model/userSchema.js"
import auth from "../middlewares/auth.js"
let router = express.Router()

router.get("/me", auth, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({ message: "Пользователь не найден" })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.get("/users", async (req, res) => {

    try {
        let users  = await Users.find()
        res.send(users )
    } catch (err) {
        console.log(err.message);
    }
})


router.get("/users/:id", async (req, res) => {
    try {
        let users  = await Users.findById(req.users.id)
        res.send(users )
    } catch (err) {
        console.log(err.message);
    }
})

router.post("/users",checkAdmin, async (req, res) => {
    try {
        let users  = new Users(req.body)
        await users.save()
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



router.delete("/users/:id", async (req, res) => {
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