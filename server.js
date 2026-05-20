const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload",uploadRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server Running on Port ${PORT}`
    );
});