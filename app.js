const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./app/config/dbcon");
const authRoutes = require("./app/routes/authroutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
