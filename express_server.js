const { json } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

//const urlDatabase = {
//  "b2xVn2": "http://www.lighthouselabs.ca",
//  "9sm5xK": "http://www.google.com"
//};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: 'randomID1'
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: 'randomID2'
  }
};



const userDatabase = {
  "randomID1": {
    id: 'randomID1',
    email: '101@gmail.com',
    password: '101'

  },

  "randomID2": {
    id: 'randomID2',
    email: '102@gmail.com',
    password: '102'

  },
}

//HELPERS
// Generate a random string for shortURL
const generateRandomString = function () {
  const stringLength = 6;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = '';

  for (let i = 0; i < stringLength; i++) {
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return shortURL;

}

const usersURL = function(id) {
  const userURl = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURl[shortURL] = urlDatabase[shortURL];
    }
  }

  return userURl;

};

const checkEmail = function(email){
  // Passes new registered email through the parameter
  // Checks if email already exists inside the database
  // returns true send 400 status code returns false adds a new user

  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }

  return undefined;

};

//#region GET
app.get('/urls', (req, res) => {
  const userID = req.cookies['userID'];
  const userURl = usersURL(userID);
  const templateVars = { users: userDatabase[userID] ,urls: userURl};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies['userID'];
  const templateVars = {users: userDatabase[userID]};
  
  if (!userID) {
    console.log('Need to login first!');
    res.redirect('/login')
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies['userID'];
  const shortURL = req.params.shortURL;
  const userURl = usersURL(userID);
  const templateVars = {longURL: userURl[shortURL].longURL, users: userDatabase[userID], shortURL, urlDatabase};
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const userID = req.cookies['userID'];
  const shortURL = req.params.shortURL;
  const userURl = usersURL(userID);
  const longURL = userURl[shortURL].longURL

  res.redirect(longURL);
});
app.get("/register", (req, res) => {
  const userID = req.cookies['userID'];
  const templateVars = {users: userDatabase[userID]};
  res.render('urls_registration', templateVars);
});

app.get('/login', (req, res) => {

const userID = req.cookies['userID'];
const templateVars = {users: userDatabase[userID]};
res.render('urls_login', templateVars);

});

//#endregion

//#region POST
app.post('/urls/:shortURL', (req, res) => {
  const shortUrl = req.params.shortURL;
  const newURL = req.body.longURL;

  urlDatabase[shortUrl] = newURL;
  res.redirect('/urls')
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  const userID = req.cookies['userID'];
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const newURL = { longURL: longURL, userID: userID};

  urlDatabase[shortURL] = newURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL

  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const url = req.params.shortURL;

  delete urlDatabase[url];
  res.redirect('/urls');

});

app.post('/register', (req, res) => {
  console.log(req.body);
  const userID = generateRandomString();
  const {email, password} = req.body;
  const newID = {id: userID, email: email, password: password};

  if (!email || !password) {
    res.status(400).send('Bad Request; empty email or password');
  }

  if (!checkEmail(email)) {
    userDatabase[userID] = newID;
    res.redirect('/login');
  } else {
    res.status(400).send('Bad request; Duplicate emails');
  }

});

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = checkEmail(email);
  console.log(userDatabase);

  if (user && user.password === password) {
    res.cookie('userID',user.id);
    res.redirect('/urls');
  } else {
    res.status(403).send('Wrong email or/and password');
    res.redirect('/login');
  }

});

app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('/login');
});
//#endregion

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});