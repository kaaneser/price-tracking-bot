const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const auth = (requiredRole = "user") => {
    return async (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            req.user = user;
            req.role = decoded.role;

            if (requiredRole && req.role !== requiredRole && requiredRole !== "user") {
                return res.status(403).json({ error: "Access denied. You do not have sufficient privileges." });
            }

            next();
        } catch (err) {
            return res.status(400).json({ error: "Invalid token." });
        }
    };
};

module.exports = auth;
