require('dotenv').config(); 

const express = require("express");
const path = require("path");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

const connectDB = require("./app/config/dbcon");
const authRoutes = require("./app/routes/authroutes");
const campaignRoutes = require("./app/routes/campaignroutes");
const categoryRoutes = require("./app/routes/categoryroutes");
const reportRoutes = require("./app/routes/reportroutes");
const donationRoutes = require("./app/routes/donationroutes");


const { morganMiddleware } = require("./app/middleware/morgan-Middleware");
// const { limiter } = require("./app/middleware/rateLimitMiddleware");
const { sessionMiddleware } = require("./app/middleware/sessionMiddleware");
const { errorMiddleware } = require("./app/middleware/errorMiddleware");

connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(morganMiddleware);
// app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, 'public')));


const authViewRoutes = require("./app/routes/authviewroutes");
app.use("/", authViewRoutes);
const mainRoutes = require("./app/routes/mainviewroutes");
app.use("/dashboard", mainRoutes);
const campaignviewRoutes = require("./app/routes/campaignviewroutes");
app.use("/campaigns", campaignviewRoutes);
// const paymentviewRoutes = require("./app/routes/paymentviewroutes");
// app.use("/payment", paymentviewRoutes);


// API routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/donation", donationRoutes);


app.use(errorMiddleware);


app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});









