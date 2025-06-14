const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../core/middleware/authMiddleware');
const ResponseHelper = require('../core/responseHelper');

router.get("/", auth("admin"), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return ResponseHelper.user.listRetrieved(res, users);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving users", 500, err.message);
    }
});

router.get("/:id", auth(), async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (req.role !== "admin" && req.user._id.toString() !== userId) {
            return ResponseHelper.user.unauthorized(res);
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return ResponseHelper.user.notFound(res);
        }

        return ResponseHelper.user.retrieved(res, user);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving user", 500, err.message);
    }
});

router.put("/:id", auth(), async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, phone_number, telegram_id, password, role } = req.body;
        
        if (req.role !== "admin" && req.user._id.toString() !== userId) {
            return ResponseHelper.user.unauthorizedEdit(res);
        }

        const updateData = { email, phone_number, telegram_id };
        if (password) {
            updateData.password = password;
        }
        
        if (req.role === "admin" && role) {
            updateData.role = role;
        }

        const user = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return ResponseHelper.user.notFound(res);
        }

        return ResponseHelper.user.updated(res, user);
    } catch (err) {
        if (err.code === 11000) {
            return ResponseHelper.user.emailExists(res);
        }
        return ResponseHelper.error(res, "An error occurred while updating users", 500, err.message);
    }
});

router.delete("/:id", auth(), async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (req.role !== "admin" && req.user._id.toString() !== userId) {
            return ResponseHelper.user.unauthorizedDelete(res);
        }

        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return ResponseHelper.user.notFound(res);
        }

        return ResponseHelper.user.deleted(res);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while deleting users", 500, err.message);
    }
});

router.get("/profile/me", auth(), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        return ResponseHelper.user.retrieved(res, user);
    } catch (err) {
        return ResponseHelper.error(res, "An error occurred while retrieving profile", 500, err.message);
    }
});

module.exports = router;
