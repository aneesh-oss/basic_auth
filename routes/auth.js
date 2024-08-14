const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// Registration Route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { loginuser, email, loginpassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(loginpassword, 10);
        const user = new User({ loginuser, email, loginpassword: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(400).send('Error registering user');
    }
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { loginuser, loginpassword } = req.body;

    try {
        const user = await User.findOne({ loginuser });
        if (user && await bcrypt.compare(loginpassword, user.loginpassword)) {
            // Set a session cookie (or use your authentication strategy)
            res.cookie('sessionId', 'yourSessionValue', { httpOnly: true });
            res.redirect('/home');
        } else {
            res.status(404).render('404');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Home Page
router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;




