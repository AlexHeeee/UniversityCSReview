const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const UniCSReview = require('../models/UniCSReview');
const passport = require('passport');
const {isLoggedIn, isAuthor} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const {cloudinary} = require("../cloudinary");
const upload = multer({ storage })

router.get('/', async (req, res) => {
    const Universities = await UniCSReview.find({})
    res.render('Universities/index', { Universities})
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('Universities/new')
})

router.post('/', isLoggedIn, upload.array('image'), async(req, res) => {
    const university = new UniCSReview(req.body.University);
    university.author = req.user._id;
    //if images were uploaded
    if(req.files){
    university.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    } 
    await university.save();
    req.flash('success', 'Successfully made a new university!'); 
    res.redirect(`/Universities/${university._id}`)
})

router.get('/:id', async (req, res) => {
    const University = await UniCSReview.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!University){
        req.flash('error', 'Cannot find that university!')
        return res.redirect('/Universities')
    }
    res.render('Universities/show', {University});
})

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const university = await UniCSReview.findById(req.params.id)
    if(!university){
        req.flash('error', 'Cannot find that university!')
        return res.redirect('/Universities')
    }
    res.render('Universities/edit', {University : university});
})


//update an university
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), async(req, res) => {
    const { id } = req.params;
    const uni = await UniCSReview.findByIdAndUpdate(id, {...req.body.University})
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    uni.images.push(...imgs);
    await uni.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await uni.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/Universities/${uni._id}`)
})

router.delete('/:id', isLoggedIn, async (req,res) => {
    const { id } = req.params;
    await UniCSReview.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted university!')
    res.redirect('/Universities');
})

module.exports = router;