const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

const connectDB = require("./app/config/dbcon");
const authRoutes = require("./app/routes/authroutes");
const campaignRoutes = require("./app/routes/campaignroutes");
const categoryRoutes = require("./app/routes/categoryroutes");
const reportRoutes = require("./app/routes/reportroutes");
const donationRoutes = require("./app/routes/donationroutes");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/donation", donationRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
