import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../model/userSchema.js"
import upload from "../middlewares/upload.js"

const router = express.Router()

router.post("/register", upload.single("img"), async (req, res) => {
  try {
    const { username, email, password, phone } = req.body


    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "Заполни все поля" })
    }

 
    const exist = await User.findOne({ email })
    if (exist) {
      return res.status(400).json({ message: "Email уже используется" })
    }

  
    const hash = await bcrypt.hash(password, 10)

    const img = req.file ? `/upload/${req.file.filename}` : ""

    const user = new User({
      username,
      email,
      password: hash,
      phone,
      img,
    })

    await user.save()

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token, role: "user" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}),


router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body  // убери phone

      const user = await User.findOne({ email })  // ✅ только по email
      if (!user) {
          return res.status(400).json({ message: "User not found" })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
          return res.status(400).json({ message: "Password is incorrect" })
      }

      const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
      )

      res.json({ message: "Login successful", token, role: user.role })

  } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: "Server error" })
  }
})

//  "username":"abdulaziz",
// "email":"abdulaziz11", 
// "password":"9694590" 
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWFlODBhODc3NjRmMWQ4MjY5YjRiZSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzcyODA4MjU2LCJleHAiOjE3NzI4OTQ2NTZ9.UrVI3vu-G0Z52iop6p0vXV7qOh2oVNHhVM1I_7xFi6k"



export default router