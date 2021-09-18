const mongoose = require('mongoose');
const universities = require('./universities')
const UniCSReview = require('../models/UniCSReview');

mongoose.connect('mongodb://localhost:27017/UniCSReview', {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const seedDB = async() => {
    await UniCSReview.deleteMany({});
    for(let i = 0; i < 100; i++){
        //const random1000 = Math.floor(Math.random() *1000);
        const Uni = new UniCSReview({
            author: '6141e5b19591f75e07c45bcd',
            title: `${universities[i].title}`,
            location: `${universities[i].location}`,
            images: [ { "url" : "https://res.cloudinary.com/doqwnmsv5/image/upload/v1631860962/University/ontere2ge9mkgt8arisx.jpg", "filename" : "University/ontere2ge9mkgt8arisx"},
             { "url" : "https://res.cloudinary.com/doqwnmsv5/image/upload/v1631860962/University/pfhaq8i7gzmhyffgrmtt.jpg", "filename" : "University/pfhaq8i7gzmhyffgrmtt"},
             { "url" : "https://res.cloudinary.com/doqwnmsv5/image/upload/v1631860962/University/zbuh2v7nmldgwktqjtcb.jpg", "filename" : "University/zbuh2v7nmldgwktqjtcb"} ],
            //'https://source.unsplash.com/collection/598450',
            description: `${universities[i].description}`,
            numberStudents: `${universities[i].numberStudents}`,
            studentsStaffRatio: `${universities[i].studentsStaffRatio}`,
            percIntlStudents: `${universities[i].percIntlStudents}`,
            genderRatio: `${universities[i].genderRatio}`,
            overallScore: `${universities[i].overallScore}`,
            teachingScore: `${universities[i].teachingScore}`,
            researchScore: `${universities[i].researchScore}`,
            citationsScore: `${universities[i].citationsScore}`,
            industryIncomeScore: `${universities[i].industryIncomeScore}`,
            intlOutlookScore: `${universities[i].intlOutlookScore}`
        })
        await Uni.save();
    }
}

seedDB();