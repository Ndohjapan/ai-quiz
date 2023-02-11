const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(process.env.URL)
    res.render('pages/home.ejs', { message: process.env.URL })
});

module.exports = router;
