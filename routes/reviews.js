const express = require('express');
const router = express.Router({mergeParams: true});
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const Review = require('../models/review');
const UniCSReview = require('../models/UniCSReview');
const {isLoggedIn} = require('../middleware');


router.post('/', isLoggedIn, async (req, res) => {
    const university = await UniCSReview.findById(req.params.id)
    const review = new Review(req.body.review)
    university.reviews.push(review);
    await review.save();
    await university.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/universities/${university._id}`);
})

router.delete('/:reviewId',  isLoggedIn, async (req, res) => {
    const {id, reviewId} = req.params;
    await UniCSReview.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted review!')
    res.redirect(`/Universities/${id}`)
    const uni = await UniCSReview.findById(id)
})

module.exports = router;