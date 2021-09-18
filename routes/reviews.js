const express = require('express');
const router = express.Router({mergeParams: true});
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const Review = require('../models/review');
const UniCSReview = require('../models/UniCSReview');
const {isLoggedIn, isReviewAuthor} = require('../middleware');


router.post('/', async (req, res) => {
    const university = await UniCSReview.findById(req.params.id)
    if (!req.isAuthenticated()){
        req.session.returnTo = `/universities/${university._id}`;
        req.flash('error', 'you must be signed in first!');
        return res.redirect('/login');
    }
    const review = new Review(req.body.review)
    review.author = req.user._id;
    university.reviews.push(review);
    await review.save();
    await university.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/universities/${university._id}`);
})

router.delete('/:reviewId',  isLoggedIn, isReviewAuthor,  async (req, res) => {
    const {id, reviewId} = req.params;
    await UniCSReview.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted review!')
    res.redirect(`/Universities/${id}`)
    const uni = await UniCSReview.findById(id)
})

module.exports = router;