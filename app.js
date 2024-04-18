require('dotenv').config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const app = express();
const PORT = 5005 || process.env.PORT;

connectDB();

// Access search term
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static('public')); //public folder

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/admin'));
app.use('/', require('./server/routes/main'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});