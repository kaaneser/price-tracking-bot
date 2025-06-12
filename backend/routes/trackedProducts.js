const express = require('express');
const router = express.Router();
const TrackedProduct = require('../models/TrackedProduct');
const auth = require('../core/middleware/authMiddleware');

router.post("/", auth("user"), async (req, res) => {
    try {
        const product = new TrackedProduct(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", auth(), async (req, res) => {
    let products;

    if (req.role === "admin") {
        products = await TrackedProduct.find().populate("user_id");
    } else {
        products = await TrackedProduct.find({ user_id: req.user._id }).populate("user_id");
    }

    res.json(products);
});

module.exports = router;