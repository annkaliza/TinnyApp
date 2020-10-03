
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

const generateRandomString = () => {
  return Math.random().toString(20).substring(2, 6);
};

const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};
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

module.exports  = { getUserByEmail, generateRandomString, urlsForUser, urlDatabase};