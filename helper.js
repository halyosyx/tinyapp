//HELPERS

const generateRandomString = function () {
  const stringLength = 6;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortURL = '';

  for (let i = 0; i < stringLength; i++) {
    shortURL += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return shortURL;

}

const urlsForUser = function(id, urlDatabase) {
  const userURl = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURl[shortURL] = urlDatabase[shortURL];
    }
  }

  return userURl;

};

const checkEmail = function(email, userDatabase){
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return undefined;
};










module.exports = { checkEmail, generateRandomString, urlsForUser };