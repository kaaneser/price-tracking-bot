const express = require('express');
const router = express.Router();
const PriceHistory = require('../models/PriceHistory');
const TrackedProduct = require('../models/TrackedProduct');
const auth = require('../core/middleware/authMiddleware');
const ResponseHelper = require('../core/responseHelper');

router.post("/", auth(), async (req, res) => {
    try {
        const { product_id, price } = req.body;
        
        const product = await TrackedProduct.findById(product_id);
        
        if (!product) {
            return ResponseHelper.product.notFound(res);
        }
        
        if (req.role !== "admin" && product.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.priceHistory.unauthorizedAdd(res);
        }

        const priceHistoryData = {
            product_id,
            price,
            date_checked: req.body.date_checked || new Date()
        };
        
        const priceHistory = new PriceHistory(priceHistoryData);
        await priceHistory.save();
        
        await priceHistory.populate('product_id');
        
        return ResponseHelper.priceHistory.created(res, priceHistory);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while adding price history", 400, err.message);
    }
});

router.get("/", auth(), async (req, res) => {
    try {
        let priceHistories;

        if (req.role === "admin") {
            priceHistories = await PriceHistory.find()
                .populate({
                    path: 'product_id',
                    populate: {
                        path: 'user_id'
                    }
                })
                .sort({ date_checked: -1 });
        } else {
            const userProducts = await TrackedProduct.find({ user_id: req.user._id });
            const productIds = userProducts.map(product => product._id);
            
            priceHistories = await PriceHistory.find({ product_id: { $in: productIds } })
                .populate({
                    path: 'product_id',
                    populate: {
                        path: 'user_id'
                    }
                })
                .sort({ date_checked: -1 });
        }

        return ResponseHelper.priceHistory.listRetrieved(res, priceHistories);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving price history", 500, err.message);
    }
});

router.get("/product/:productId", auth(), async (req, res) => {
    try {
        const productId = req.params.productId;
        
        const product = await TrackedProduct.findById(productId);
        
        if (!product) {
            return ResponseHelper.product.notFound(res);
        }
        
        if (req.role !== "admin" && product.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.priceHistory.unauthorized(res);
        }

        const priceHistories = await PriceHistory.find({ product_id: productId })
            .populate('product_id')
            .sort({ date_checked: -1 });

        return ResponseHelper.priceHistory.productHistoryRetrieved(res, priceHistories);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving product price history", 500, err.message);
    }
});

router.get("/:id", auth(), async (req, res) => {
    try {
        const historyId = req.params.id;
        
        const priceHistory = await PriceHistory.findById(historyId)
            .populate({
                path: 'product_id',
                populate: {
                    path: 'user_id'
                }
            });
        
        if (!priceHistory) {
            return ResponseHelper.priceHistory.notFound(res);
        }
        
        if (req.role !== "admin" && priceHistory.product_id.user_id._id.toString() !== req.user._id.toString()) {
            return ResponseHelper.priceHistory.unauthorized(res);
        }

        return ResponseHelper.priceHistory.retrieved(res, priceHistory);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving price history", 500, err.message);
    }
});

router.put("/:id", auth(), async (req, res) => {
    try {
        const historyId = req.params.id;
        const { price, date_checked } = req.body;
        
        const priceHistory = await PriceHistory.findById(historyId).populate('product_id');
        
        if (!priceHistory) {
            return ResponseHelper.priceHistory.notFound(res);
        }
        
        if (req.role !== "admin" && priceHistory.product_id.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.priceHistory.unauthorizedEdit(res);
        }

        const updateData = {};
        if (price !== undefined) updateData.price = price;
        if (date_checked !== undefined) updateData.date_checked = date_checked;

        const updatedPriceHistory = await PriceHistory.findByIdAndUpdate(
            historyId, 
            updateData, 
            { new: true, runValidators: true }
        ).populate({
            path: 'product_id',
            populate: {
                path: 'user_id'
            }
        });

        return ResponseHelper.priceHistory.updated(res, updatedPriceHistory);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while updating price history", 500, err.message);
    }
});

router.delete("/:id", auth(), async (req, res) => {
    try {
        const historyId = req.params.id;
        
        const priceHistory = await PriceHistory.findById(historyId).populate('product_id');
        
        if (!priceHistory) {
            return ResponseHelper.priceHistory.notFound(res);
        }
        
        if (req.role !== "admin" && priceHistory.product_id.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.priceHistory.unauthorizedDelete(res);
        }

        await PriceHistory.findByIdAndDelete(historyId);

        return ResponseHelper.priceHistory.deleted(res);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while deleting price history", 500, err.message);
    }
});

router.delete("/product/:productId", auth(), async (req, res) => {
    try {
        const productId = req.params.productId;
        
        const product = await TrackedProduct.findById(productId);
        
        if (!product) {
            return ResponseHelper.product.notFound(res);
        }
        
        if (req.role !== "admin" && product.user_id.toString() !== req.user._id.toString()) {
            return ResponseHelper.priceHistory.unauthorizedDelete(res);
        }

        const result = await PriceHistory.deleteMany({ product_id: productId });

        return ResponseHelper.priceHistory.bulkDeleted(res, result.deletedCount);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while deleting product price history", 500, err.message);
    }
});

module.exports = router; 