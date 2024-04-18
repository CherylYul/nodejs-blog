const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Which layout we need to be run?
const adminLayout = "../views/layouts/admin";

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

router.post("/admin", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username === "admin" && password === "password") {
        res.send("Log in successfully!");
      } else {
        res.send("Wrong password!");
      }
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;