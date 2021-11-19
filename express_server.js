const { json } = require('express');
const express = require('express');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { checkEmail, generateRandomString, urlsForUser } = require('./helper');
const app = express();
const PORT = 8080;

//NOTE: COHhMj gmail

app.use(express.urlencoded({extended: true}));
app.use(cookieSession({name: 'session', secret: 'shhh-this-is-a-secret'}));
app.set('view engine', 'ejs');

const urlDatabase = {};

const userDatabase = {};

//#region GET

// Redirects the user to the login screen first before being able to do anythin
app.get("/", (req, res) => {
  const userID = req.session.userID;

  if (!userID) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
  
});

//Showcases users saved url; If user is not logged in, it will redirect user to an error page
app.get('/urls', (req, res) => {
  const userID = req.session.userID;
  const userURl = urlsForUser(userID, urlDatabase);
  const templateVars = { users: userDatabase[userID] ,urls: userURl};

  if (!userID) {
    res.status(401).send('You have no authorization for this page! Please log in');
  } else {
    
    res.render('urls_index', templateVars);
  }

});

//Handles adding new urls to the userdatabase;
//If the user is not logged in, redirect to login page;
app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {users: userDatabase[userID]};
  
  if (!userID) {
    res.redirect('/login')
  } else {
    res.render("urls_new", templateVars);
  }
});

//If it belongs to the user, showcase the url details
app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const userURl = urlsForUser(userID, urlDatabase);
  const templateVars = {userURl, users: userDatabase[userID], shortURL, urlDatabase};

  if (!urlDatabase[shortURL]) {
    res.status(404).send('This shortURL does not exist!');
  } else if (!userID || !userURl[shortURL]) {
    res.status(401).send('You have no authorization to see this url!');
  } else {
    res.render('urls_show', templateVars);
  }
  

});

//Redirects the user to the site using the shortened url
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send('Short URL does not exist!');
  } else {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});

app.get("/register", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {users: userDatabase[userID]};

  if (userID) {
    res.redirect('/urls');
  }

  res.render('urls_registration', templateVars);
});

app.get('/login', (req, res) => {
  const userID = req.session.userID;
  if (userID) {
    res.redirect('/urls');
    return;
  }
const templateVars = {users: userDatabase[userID]};
res.render('urls_login', templateVars);

});

//#endregion

//#region POST
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const newURL = req.body.longURL;
  const userURl = urlsForUser(userID, urlDatabase);

  if (!userID && userID !== urlDatabase[shortURL].userID) {
    res.status(401).send('You have no authorization to edit nor add url');
  } else {
    userURl[shortURL].longURL = newURL;
    res.redirect('/urls')
  }


});


app.post('/urls', (req, res) => {
  const userID = req.session.userID;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const newURL = { longURL: longURL, userID: userID};
  
  if (userID) {
    urlDatabase[shortURL] = newURL;
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send('You have no authorization')
  }

});

// Redirects the user to the shortURL edit page
app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL

  res.redirect(`/urls/${shortURL}`);
});

// Deletes the url from the database
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;

  if (userID && userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  }
  
  res.redirect('/urls');
});

//- Add user into the database to access the apps funcitonalities;
//- They are required to login after registering
//- If the user is already logged in; accessing this url will lead them back to their /urls page
app.post('/register', (req, res) => {
  const userID = generateRandomString();
  const {email, password} = req.body;
  const newID = {id: userID, email: email, password: bcrypt.hashSync(password, 10)};

  if (email && password) {
    
    if (!checkEmail(email, userDatabase)) {
      userDatabase[userID] = newID;
      res.redirect('/login');
    } else {
      res.status(400).send('Bad request; Duplicate emails');
    }
    
  } else {
    
    res.status(400).send('Bad Request; empty email or password');
  }

});

// Checks if the user is registered in the database
// Redirects the user to their urls page upon successfully providing credentials
// Redirected to html error if wrong email or/and password entered or input box left blank
app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = checkEmail(email, userDatabase);

  if (user && bcrypt.compareSync(password ,user.password)) {
    req.session.userID = user.id;
    res.redirect('/urls');
  } else {
    res.status(403).send('Wrong email or/and password');
    res.redirect('/login');
  }

});

//Clears cookie and session and is redirected to the login page
app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  req.cookieSession = null;
  res.redirect('/');
});
//#endregion

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});