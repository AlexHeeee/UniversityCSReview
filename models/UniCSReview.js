const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const UniCSReviewSchema = new Schema({
    title:String,
    location:String,
    numberStudents:String,
    studentsStaffRatio:String,
    percIntlStudents:String,
    genderRatio:String,
    overallScore:String,
    teachingScore:String,
    researchScore:String,
    citationsScore:String,
    industryIncomeScore:String,
    intlOutlookScore:String,
    description:String,
    images: [{
        url: String,
        filename: String
    }],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

UniCSReviewSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('UniCSReview', UniCSReviewSchema);