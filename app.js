require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const connectDB = require("./server/config/db");
const MongoStore = require("connect-mongo");
const app = express();
const PORT = 5005 || process.env.PORT;

connectDB();

// Access search term
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Keyboard dog",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: new Date(Date.now() + 3600000) }, // cookie expired date
  })
);

app.use(express.static("public")); //public folder

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/admin"));
app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});