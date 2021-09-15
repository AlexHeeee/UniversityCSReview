const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const UniCSReview = require('../models/UniCSReview');
const passport = require('passport');
const {isLoggedIn} = require('../middleware');

router.get('/', async (req, res) => {
    const Universities = await UniCSReview.find({})
    res.render('Universities/index', { Universities})
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('Universities/new')
})

router.post('/', isLoggedIn, async(req, res) => {
    const university = new UniCSReview(req.body.University);
    await university.save();
    req.flash('success', 'Successfully made a new university!'); 
    res.redirect(`/Universities/${university._id}`)
})

router.get('/:id', async (req, res) => {
    const University = await UniCSReview.findById(req.params.id).populate('reviews');
    if(!University){
        req.flash('error', 'Cannot find that university!')
        return res.redirect('/Universities')
    }
    res.render('Universities/show', {University});
})

router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const University = await UniCSReview.findById(req.params.id)
    if(!University){
        req.flash('error', 'Cannot find that university!')
        return res.redirect('/Universities')
    }
    res.render('Universities/edit', {University});
})

router.put('/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const university = await UniCSReview.findByIdAndUpdate(id, {...req.body.University})
    res.redirect(`/Universities/${university._id}`)
})

router.delete('/:id', isLoggedIn, async (req,res) => {
    const { id } = req.params;
    await UniCSReview.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted university!')
    res.redirect('/Universities');
})

module.exports = router;