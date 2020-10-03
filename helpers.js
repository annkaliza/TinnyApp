const urlDatabase = {};

// a function that will help us to generate a random string to use as ID

const generateRandomString = () => {
  return Math.random().toString(20).substring(2, 6);
};

// lookup function for user in User's db

const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};


// FUNCTION THAT WILL FILTER ONLY USER'S URL

const urlsForUser = (id) => {
  let urlById = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlById[url] = {
        longURL: urlDatabase[url].longURL,
      };
    }
  }
  return urlById;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  urlDatabase,
};
