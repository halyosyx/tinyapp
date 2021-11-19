//HELPERS

// Loops through a string of characters, randomly choosing 6 to create a new string for 
// the short URL
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

// Checks if email is in the database and returns the user
// If it doesn't exist, return undefined
const checkEmail = function(email, userDatabase){
  for (const user in userDatabase) {
    if (email === userDatabase[user].email) {
      return userDatabase[user];
    }
  }
  return undefined;
};










module.exports = { checkEmail, generateRandomString, urlsForUser };