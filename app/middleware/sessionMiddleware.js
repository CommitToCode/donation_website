const session = require("express-session");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'myverysecurekey123@!',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 600000,
    secure: false 
  }
});

module.exports = { sessionMiddleware };