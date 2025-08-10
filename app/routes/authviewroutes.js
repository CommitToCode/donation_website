const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.render("register",{ error: null, success: null}); 
});


router.get("/login", (req, res) => {
  
  res.render("login",{ error: null, success: null,email : req.query.email || ""});
});


router.get("/verify", (req, res) => {
  res.render("verify",{error:null ,success:null,   email: req.query.email || ""});
});


router.get("/forgot-password", (req, res) => {
  res.render("forgot",{error:null ,success:null,   email: req.query.email || ""});
});


router.get("/reset-password", (req, res) => {
  res.render("reset",{error:null ,success:null,   email: req.query.email || ""});
});

module.exports = router;
