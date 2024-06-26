const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // encrypt and decrypt password and store it in database
const jwt = require("jsonwebtoken");

// Which layout we need to be run?
const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// ADD MIDDLEWARE TO HELP US LOGOUT
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "unauthorized",
      });
    }
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({
        message: "unauthorized",
      });
    }
  };

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin Page",
      discription: "Studying Nodejs Express & MongoDB",
    };
    res.render("admin/index", { locals, adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// LOGIN
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
    res.render("admin/dashboard");
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      res.status(201).json({
        message: "User created",
        user,
      });
      // {"message":"User created",
      //  "user":{
      //     "username":"cheryl",
      //     "password":"$2b$10$sBgDe34EHbHgf4S0x3CwoeNQ96hEZCr6spLO9iq2Ts8mMXl8Q513.",
      //     "_id":"6620da20f288a01b5a663b33",
      //     "__v":0
      // }}
    } catch (error) {
      if ((error.code = 11000)) {
        res.status(409).json({
          message: "User already in use",
        });
      }
      res.status(500).json({
        message: "Internal server error",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// FIRST CHECKING ADMIN
// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (username === "admin" && password === "password") {
//       res.send("Log in successfully!");
//     } else {
//       res.send("Wrong password!");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
