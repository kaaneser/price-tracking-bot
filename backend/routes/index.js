const express = require("express");
const router = express.Router();

const trackedProductsRouter = require("./trackedProducts");
const authRouter = require("./auth");

router.use("/tracked-products", trackedProductsRouter);
router.use("/auth", authRouter);

module.exports = router;