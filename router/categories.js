import express from "express";
import Categories from "../model/categoriesSchema.js";

let route = express.Router();

route.get("/categories", async (req, res) => {
    let { title } = req.query;

    let filter = {};
    if (title) {
        filter.title = title;
    }

    try {
        let categories = await Categories.find(filter);
        res.send(categories);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

route.get("/categories/:id", async (req, res) => {
    try {
        let categories = await Categories.findById(req.params.id);
        res.send(categories);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

route.post("/categories", async (req, res) => {
    try {
        let categories = new Categories(req.body);
        await categories.save();
        res.send("Categories created!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

route.put("/categories/:id", async (req, res) => {
    try {
        let uCategories = await Categories.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.send({ message: "Categories updated", uCategories });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

route.delete("/categories/:id", async (req, res) => {
    try {
        let dCategories = await Categories.findByIdAndDelete(req.params.id);
        res.send({ message: "Categories deleted", dCategories });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default route;
