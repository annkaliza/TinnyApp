const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());
const PORT = 8080; // default port 8080


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

let users = {};

const generateRandomString = () => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
        long: urlDatabase[url].longURL,
        date: urlDatabase[url].date
      };
    }
  }
  return urlById;
};



app.get("/urls", (req, res) => {


  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if(!req.cookies["user_id"]){
    res.redirect("/login");
  }
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});





app.get("/urls/:shortURL", (req, res) => {
  if (req.cookies["user_id"]&& urlDatabase[req.params.shortURL].userID === req.cookies["user_id"]) {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
}
res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration");
});

app.post("/urls", (req, res) => {
  if(req.cookies["user_id"]){
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies["user_id"]};
  res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.cookies["user_id"]&& urlDatabase[req.params.shortURL].userID === req.cookies["user_id"]) {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
} else{
  res.redirect("/urls");
}
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newUrl = req.body.longURL;
  if (req.cookies["user_id"]&& urlDatabase[req.params.shortURL].userID === req.cookies["user_id"]) {

  urlDatabase[id] = {longURL: newUrl, userID:req.cookies["user_id"]};

  res.redirect("/urls");
  } else {
  res.redirect("/urls");

  }
});

app.post("/login", (req, res) => {
  let user = getUserByEmail(req.body.email, users);

  if (!user) {
    res
      .status(403)
      .render('error', "Account not exist");
    return;
  }

  if (user) {
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res
        .status(403)
        .render('error', "Wrong logins");
      return;
    }
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);


  if (!email || email.length === 0) {
    res.status(400).send({ error: "email not provided!" });
  }
  if (!password || password.length === 0) {
    res.status(400).send({ error: "Password not provided!" });
  }
  if (getUserByEmail(req.body.email, users)) {
    res.status(400).send({ error: "Email already exists" });
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password,
  };
  res.cookie("user_id", userId);

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
