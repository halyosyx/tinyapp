const { json } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post('/urls/:shortURL', (req, res) => {
  const shortUrl = req.params.shortURL;
  const newURL = req.body.longURL;

  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect('/urls')
});

app.post('/urls', (req, res) => {
  //req.body.shortURL = generateRandomString();
  console.log(req.body);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const newURL = {
    longURL: longURL
  };

  urlDatabase[shortURL] = newURL.longURL;

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

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



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

//console.log(generateRandomString());