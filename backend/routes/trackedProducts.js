const express = require('express');
const router = express.Router();
const TrackedProduct = require('../models/TrackedProduct');
const auth = require('../core/middleware/authMiddleware');
const ResponseHelper = require('../core/responseHelper');

router.post("/", auth("user"), async (req, res) => {
    try {
        const productData = {
            ...req.body,
            user_id: req.user._id
        };
        
        const product = new TrackedProduct(productData);
        await product.save();
        
        await product.populate('user_id');
        
        return ResponseHelper.product.created(res, product);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while creating product track", 400, err.message);
    }
});

router.get("/", auth(), async (req, res) => {
    try {
        let products;

        if (req.role === "admin") {
            products = await TrackedProduct.find().populate("user_id");
        } else {
            products = await TrackedProduct.find({ user_id: req.user._id }).populate("user_id");
        }

        return ResponseHelper.product.listRetrieved(res, products);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving product tracks", 500, err.message);
    }
});

router.get("/:id", auth(), async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await TrackedProduct.findById(productId).populate("user_id");
        
        if (!product) {
            return ResponseHelper.product.notFound(res);
        }
        
        if (req.role !== "admin" && product.user_id._id.toString() !== req.user._id.toString()) {
            return ResponseHelper.product.unauthorized(res);
        }

        return ResponseHelper.product.retrieved(res, product);
    } catch (err) {
        return ResponseHelper.error(res, "An error occured while retrieving product track info", 500, err.message);
    }
});

router.put("/:id", auth(), async (req, res) => {
    try {
        const productId = req.params.id;
        const { product_url, price_target, current_price } = req.body;
        
        const product = await TrackedProduct.findById(productId);
        
        if (!product) {
            return ResponseHelper.product.notFound(res);
        }
        
        if (req.role !== "admin" && product.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.product.unauthorized(res);
        }

        const updateData = { product_url, price_target, current_price };
        
        if (req.role === "admin" && req.body.user_id) {
            updateData.user_id = req.body.user_id;
        }

        const updatedProduct = await TrackedProduct.findByIdAndUpdate(
            productId, 
            updateData, 
            { new: true, runValidators: true }
        ).populate("user_id");

        return ResponseHelper.product.updated(res, updatedProduct);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while updating product track", 500, err.message);
    }
});

router.delete("/:id", auth(), async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await TrackedProduct.findById(productId);
        
        if (!product) {
            return ResponseHelper.product.notFound(res);
        }
        
        if (req.role !== "admin" && product.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.product.unauthorized(res);
        }

        await TrackedProduct.findByIdAndDelete(productId);

        return ResponseHelper.product.deleted(res);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while deleting product track", 500, err.message);
    }
});

module.exports = router;