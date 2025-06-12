const express = require('express');
const router = express.Router();
const TrackedProduct = require('../models/TrackedProduct');

router.post("/", async (req, res) => {
    try {
        const product = new TrackedProduct(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const products = await TrackedProduct.find().populate('user_id');
    res.json(products);
});

module.exports = router;