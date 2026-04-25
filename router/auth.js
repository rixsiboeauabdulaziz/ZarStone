import express from "express"
import bcrypt from "bcryptjs"
import User from "../model/userSchema.js"
import jwt from "jsonwebtoken"

let router = express.Router()

router.post("/register", async (req, res) => {
    let { username, email, password, role ,img,phone} = req.body  // ← добавить role
    let exisUser = await User.findOne({ email });

    if (exisUser) {
        return res.status(400).send({ message: "This user already exist" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPasswort = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        img,
        phone,
        password: hashedPasswort,
        role  
    })

    res.send({ message: "User create", userId: user._id })
})



router.post("/login", async (req, res) => {
    try {
        const { email, password,phone} = req.body

        const user = await User.findOne({ email, phone})
        if (!user) {
            return res.status(400).send("User not found")
        }


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send("Password is incorrect")
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }

        )

        res.json({
            message: "Login successful",
            token,
        })

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})



//  "username":"abdulaziz",
// "email":"abdulaziz11", 
// "password":"9694590" 
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWFlODBhODc3NjRmMWQ4MjY5YjRiZSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzcyODA4MjU2LCJleHAiOjE3NzI4OTQ2NTZ9.UrVI3vu-G0Z52iop6p0vXV7qOh2oVNHhVM1I_7xFi6k"



export default router