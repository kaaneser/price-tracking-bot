const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHelper = require('../core/responseHelper');
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return ResponseHelper.auth.userNotFound(res);
    }

    if (user.role !== "admin") {
        const isMatch = await user.isPasswordValid(password);

        if (!isMatch) {
            return ResponseHelper.auth.invalidCredentials(res);
        }
    }

    const token = jwt.sign(
        { id: user._id, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return ResponseHelper.auth.loginSuccess(res, token);
});

router.post("/register", async (req, res) => {
    const { email, password, phone_number, telegram_id } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return ResponseHelper.auth.emailExists(res);
    }

    const user = new User({
        email,
        password,
        phone_number,
        telegram_id,
        role: "user"
    });

    try {
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role || "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return ResponseHelper.auth.registerSuccess(res, token);
    } catch (err) {
        console.error(err);
        
        return ResponseHelper.auth.registerError(res, err.message);
    }
});

module.exports = router;