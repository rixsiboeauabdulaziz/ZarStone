import mongoose from "mongoose";
import express from "express"
let router = express.Router()

router.post("/orders", async (req, res) => {
    try {
        let { user, product, quantity } = req.body;

        let order = new order({
            user,
            product,
            quantity
        });

        await order.save();
        res.json(order);

    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.get("/orders", async (req, res) => {
    try {
        let orders = await Order.find()
            .populate("user")
            .populate("product");

        res.json(orders);

    } catch (error) {
        res.status(500).json(error.message);
    }
});

export default router