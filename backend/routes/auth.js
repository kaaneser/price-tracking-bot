const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
        const isMatch = await user.isPasswordValid(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    }

    const token = jwt.sign(
        { id: user._id, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        token: token
    });
});

router.post("/register", async (req, res) => {
    const { email, password, phone_number, telegram_id } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
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

        res.status(201).json({ token: token });
    } catch (err) {
        console.error(err);
        
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;