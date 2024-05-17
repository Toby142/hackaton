const express = require('express');
const app = express();
const http = require('http');
const router = express.Router();
const log = require('pretty-log');
const session = require('express-session');
const qr = require('qrcode');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const App = require('./models/App');
const Link = require('./models/Link');
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

async function getUserLink(req, id) {
  const linkID = id;
  const userID = req.session.userInfo;
  return await Link.findOne({ _id: linkID, _userID: userID });

}

async function getLink(id) {
  const linkID = id;
  return await Link.findOne({ _id: linkID });

}

async function getUserApps(req) {

  let userID = new ObjectId(req.session.userInfo);
  return await App.aggregate([
    {
      $match: {
        _userID: userID 
      }
    },
    {
      $lookup: {
        from: 'links', 
        localField: '_id',
        foreignField: '_appID', 
        as: 'links'
      }
    }
  ]);
}

async function getUserApp(req, id) {
  let appID = new ObjectId(id);
  let userID = new ObjectId(req.session.userInfo);
  return await App.aggregate([
    {
      $match: {
        _id: appID, 
        _userID: userID
      }
    },
    {
      $lookup: {
        from: 'links',
        localField: '_id',
        foreignField: '_appID',
        as: 'links'
      }
    }
  ]);
}

app.get('/', isUserLoggedIn, logEvent, async (req, res) => {
    const userData = await getUserData(req);
    const app = await getUserApps(req);
    res.render('home', { app, userData });
});

app.get('/home', logEvent, isUserLoggedIn, async (req, res) => {
    const userData = await getUserData(req);
    const app = await getUserApps(req);
    res.render('home', { app, userData });
});

app.get('/create-link/:id', logEvent, isUserLoggedIn, async (req, res) => {
  const { id } = req.params;
  const app = await getUserApp(req, id);

  const userData = await getUserData(req);
  res.render('create-link', { app, userData });
});


app.get('/create-app', logEvent, isUserLoggedIn, async (req, res) => {
  const userData = await getUserData(req);
  res.render('create-app', { userData });
});
app.get('/edit-app', logEvent, isUserLoggedIn, async (req, res) => {
  const userData = await getUserData(req);
  res.render('edit-app', { userData });
});

app.get('/profile', logEvent, isUserLoggedIn, async (req, res) => {
    const userData = await getUserData(req);
    res.render('profile', { userData });
});
  
app.get('/stats', logEvent, isUserLoggedIn, async (req, res) => {
  const userData = await getUserData(req);
  const app = await getUserApps(req);
  res.render('stats', { app, userData });
});

// make an app.get for the new page compat-check.ejs where a parameter /linkId is required
app.get('/compat-check/:linkId', logEvent, isUserLoggedIn, async (req, res) => {
  const linkId = req.params.linkId;
  const userData = await getUserData(req);
  res.render('compat-check', { userData, linkId });
});

// make 2 links to /invalid-device and requirements-help
app.get('/invalid-device', logEvent, async (req, res) => {
 
  res.render('invalid-device', );
});

app.get('/requirements-help', logEvent, isUserLoggedIn, async (req, res) => {
  const userData = await getUserData(req);
  res.render('requirements-help', { userData });
});

app.get('/app/:id', logEvent, isUserLoggedIn, async (req, res) => {
  const { id } = req.params;
  const app = await getUserApp(req, id);
  const userData = await getUserData(req);

  res.render('edit-app', { app, userData });
});


app.get('/link/:id', logEvent, isUserLoggedIn, async (req, res) => {


  const { id } = req.params;
  const app = await getUserLink(req, id);
  const qrcode = await qr.toDataURL(`http://localhost:3004/visit-link/${id}`);
  const userData = await getUserData(req);
  res.render('edit-link', { app, userData, qrcode });
});


app.get('/visit-link/:id', logEvent, async (req, res) => {
  const { id } = req.params;
  let linkID = new ObjectId(id);

  let link = await getLink(id);
  
  const result = await Link.findOneAndUpdate(
    { _id: linkID }, // Zoekvoorwaarde
    { $inc: { views: 1 } }, // Increment-operator om views met 1 te verhogen
    { new: true } // Optie om het bijgewerkte document terug te geven
  );

  res.render('compat-check', { link });
  // res.redirect(app.link);
});

app.get('/link/delete/:id', logEvent, isUserLoggedIn, async (req, res) => {

  const { id } = req.params;
  let linkID = new ObjectId(id);
  let userID = new ObjectId(req.session.userInfo);


  const result = await Link.deleteOne({ _id: linkID, _userID: userID });


  res.redirect('/home');
});

app.get('/app/delete/:id', logEvent, isUserLoggedIn, async (req, res) => {

  const { id } = req.params;
  let appID = new ObjectId(id);
  let userID = new ObjectId(req.session.userInfo);


  const result = await App.deleteOne({ _id: appID, _userID: userID });

  
  res.redirect('/home');
});

app.post('/users/create', async (req, res, next) => {
    const { firstname, lastname, email, username, newpassword} = req.body;
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



app.post('/app/create', async (req, res, next) => {
  const _userID = req.session.userInfo;
  const { name } = req.body;

  if(name) {
    try {

      const newApp = await App.create({ _userID, name });
      res.status(201).json({ message: 'App created' });
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(500);
    return;
  }
 
});

app.post('/link/create', async (req, res, next) => {
  const _userID = req.session.userInfo;
  const { _appID, name, link, requirements } = req.body;

  if(name && link && requirements && _appID) {
    try {

      const newLink = await Link.create({ _userID, _appID, name, link, requirements });
      res.status(201).json({ message: 'Link created' });
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(500);
    return;
  }
 
});

app.post('/link/update', async (req, res, next) => {
  const { _linkID, name, link, requirements } = req.body;
  const _userID = req.session.userInfo;

  if(!_linkID  || !name || !link || !requirements) {
      return;
  }

  try {
      const updateLink = await Link.findOneAndUpdate({ _id: _linkID, _userID: _userID }, { name: name, link: link, requirements: requirements }, { new: true });

      res.json({ message: 'Link updated successfully', updateLink });
  } catch (error) {
      next(error);
  }
});


app.post('/app/update', async (req, res, next) => {
  const { _appID, name } = req.body;
  const _userID = req.session.userInfo;

  if(!_appID  || !name ) {
      return;
  }

  try {
      const updateApp = await App.findOneAndUpdate({ _id: _appID, _userID: _userID }, { name: name }, { new: true });

      res.json({ message: 'App updated successfully', updateApp });
  } catch (error) {
      next(error);
  }
});

app.post('/profile/update', async (req, res, next) => {
  const { firstname, lastname, username, email } = req.body;
  const _userID = req.session.userInfo;

  if(!firstname  || !lastname || !username || !email) {
      return;
  }

  try {
      const updateUser = await User.findByIdAndUpdate(_userID, { firstname: firstname, lastname: lastname, username: username, email: email}, { new: true });

      res.json({ message: 'App updated successfully', updateUser });
  } catch (error) {
      next(error);
  }
});




app.use((req, res, next) => {
    res.render('404');
});


http.createServer(app).listen(3004, function () {
    log.success('Server has started!');
});

