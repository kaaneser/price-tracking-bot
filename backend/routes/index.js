const express = require("express");
const router = express.Router();

const trackedProductsRouter = require("./trackedProducts");

router.use("/tracked-products", trackedProductsRouter);

module.exports = router;