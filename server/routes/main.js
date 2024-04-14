const express = require('express');
const router = express.Router();

// Routes
router.get('', (req, res) => {
    // send message
    // res.send("Hello World");

    // create object
    const locals = {
        title: "Nodejs Blogs",
        description: " Studying Nodejs Express & MongoDB"
    }
    // page we want to render
    res.render('index', {locals});
});

router.get('/about', (req, res) => {
    res.render('about');
})


module.exports = router;