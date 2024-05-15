const express = require('express');
const app = express();
const http = require('http');
const router = express.Router();
const log = require('pretty-log');
const session = require('express-session');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const db = require('./database/keys').mongoURI;

const { ObjectId } = require('mongodb');

mongoose
  .connect(db)
  .then(() => log.success("MongoDB connected"))
  .catch(err => console.log(err));




app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


app.use(express.json());

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));



function logEvent(req, res, next) {
    log.debug(new Date(), req.method, req.url);
    next();
}

async function isUserLoggedIn(req, res, next){
    if(!req.session.userInfo) {
        res.redirect('/register');
        return;
    }
    next();
}

async function getUserData(req) {

    const userID = req.session.userInfo;
    return await User.findOne({ _id: userID });

}

app.get('/dashboard', logEvent, isUserLoggedIn, async (req, res) => {
    res.render('dashboard');
});

app.get('/', isUserLoggedIn, logEvent, (req, res) => {
    res.render('dashboard');
});

app.get('/home', logEvent, isUserLoggedIn, async (req, res) => {
    const userData = await getUserData(req);
    res.render('home', { userData });
});


app.post('/users/create', async (req, res, next) => {
    const { firstname, lastname, email, username, newpassword} = req.body;

    console.log(newpassword);
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ error: 'Email already exists' });
    }
  
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
  
      const newUser = await User.create({ firstname, lastname, email, username, password: hashedPassword });
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  });
  


// LOGIN USER
app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json({ error: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(200).json({ error: 'Invalid password' });
      }
  
      req.session.userInfo = user._id;
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      next(error);
    }
  });
  


app.get('/index', logEvent, (req, res) => {
    console.log(req.session.word);
    res.render('index');
});


app.get('/login', logEvent, async (req, res) => {
    if(req.session.userInfo) {
        res.redirect('/home');
        res.end();
    }
    res.render('login');
});

app.get('/logout', logEvent, isUserLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500);
            return;
        }
        res.redirect('/login');
    });
});

app.get('/register', logEvent, async (req, res) => {
    if(req.session.userInfo) {
        res.redirect('/home');
        res.end();
    }
    res.render('register');
});

app.use((req, res, next) => {
    res.render('404');
});


http.createServer(app).listen(3002, function () {
    log.success('Server has started!');
});

