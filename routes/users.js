const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { nextTick } = require('async');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res, next) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({ email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) {
            next(err) // Pass errors to Express.
          }
        res.redirect('/Universities');
    })
    req.flash('success', 'Welcome to Yelp Camp!');
    res.redirect('/Universities');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/Universities';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}) 

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/Universities');
})

module.exports = router