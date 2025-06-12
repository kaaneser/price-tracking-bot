const express = require("express");
const connectDB = require("./db/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
connectDB();

// Middleware
app.use(express.json());

// Router
const apiRouter = require("./routes");
app.use("/api", apiRouter);

app.get("/", (req, res) => {
    res.send("Price tracking bot backend is running!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});