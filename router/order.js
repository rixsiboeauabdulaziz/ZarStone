import mongoose from "mongoose";
import express from "express"
import Order from "../model/orderSchema.js";
let router = express.Router()

router.post("/orders", async (req, res) => {
    try {
        let { name, phone, product, quantity } = req.body;
        let order = new Order({ name, phone, product, quantity }); // Order с большой буквы!
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json(error.message);
    }
});
router.get("/orders", async (req, res) => {
    try {
        let orders = await Order.find()

            .populate("product");

        res.json(orders);

    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.delete("/orders/:id", async (req, res) => {
    try {
        let deleted = await Order.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ message: "Заказ не найден" })
        res.json({ message: "Заказ удалён", id: req.params.id })
    } catch (error) {
        res.status(500).json(error.message)
    }
})


export default router