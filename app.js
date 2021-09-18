//configuring cloudinary
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
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

const universityRoutes = require('./routes/universities');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})
const app = express();

app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({
    extended: true
    }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret'

const sessionConfig = {
    store: MongoDbStore.create({
        mongoUrl: dbUrl
    }),
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize());

app.use((req,res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.use((err, req, res, next) => {
//     res.send('Something went wrong!')
// })

app.get('/', (rep, res) => {
    res.render('home')
})

app.get('/UniCSReview', (rep, res) => {
    res.render('UniCSReview')
})

app.use('/', userRoutes);
app.use("/Universities", universityRoutes);
app.use('/Universities/:id/reviews', reviewRoutes);


const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Serving on port ${port}`)
})

