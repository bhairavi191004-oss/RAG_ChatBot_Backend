const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const uploadRoutes = require("./routes/uploadRoutes");
const queryRoutes = require("./routes/queryRoutes");
app.use("/api/upload",uploadRoutes);
app.use("/api/query", queryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server Running on Port ${PORT}`
    );
});