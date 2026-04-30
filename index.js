import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import authRouter from "./router/auth.js"
import productRouter from "./router/products.js"
import Categories from "./router/categories.js"
import userRouter from "./router/user.js"
import OrderRouter from "./router/order.js"
import express from "express"
import cors from "cors"

let app = express()
app.use(cors({
    origin: "http://localhost:5173", // порт твоего React
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }))
 
app.use(express.json())
app.use('/upload',express.static("upload"))

mongoose.connect(process.env.URL_MONGOOSE).then(() => {
    console.log("mongoose");
}).catch((err) => {
    console.log(err.message);
})

app.use(productRouter)
app.use(Categories)
app.use(authRouter)
app.use(userRouter)
app.use(OrderRouter)




app.listen(process.env.PORT, () => {
    console.log("stort port ");
})


