const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const uploadRoutes = require("./routes/uploadRoutes.js");

app.use("/api/upload",uploadRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running on Port ${PORT}`
  );
});