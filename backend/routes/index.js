const express = require("express");
const router = express.Router();

const trackedProductsRouter = require("./trackedProducts");
const authRouter = require("./auth");
const usersRouter = require("./users");
const priceHistoryRouter = require("./priceHistory");

router.use("/tracked-products", trackedProductsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/price-history", priceHistoryRouter);

module.exports = router;