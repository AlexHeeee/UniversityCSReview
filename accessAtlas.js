//configuring cloudinary
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();}
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const engine = require('ejs-mate')
const UniCSReview = require('./models/UniCSReview');
const Review = require('./models/review');

const session = require('express-session');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/UniCSReview'
console.log(dbUrl);
const mongoose = require('mongoose');
const universityRoutes = require('./routes/universities');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
});

console.log(dbUrl)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

var adminLogin = mongoose.model("User");

adminLogin.find({}, function(err, data){
    console.log(">>>> " + data );
});