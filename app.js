const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session=require("express-session")
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'myverysecurekey123@!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 },
   cookie: { secure: false }
}));

const authViewRoutes = require("./app/routes/authviewroutes");
app.use("/", authViewRoutes);
const mainRoutes = require("./app/routes/mainviewroutes");
app.use("/dashboard", mainRoutes);
const campaignviewRoutes = require("./app/routes/campaignviewroutes");
app.use("/campaigns", campaignviewRoutes);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/donation", donationRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
