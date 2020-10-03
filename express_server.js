const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({ name: "session", keys: ["key1", "key2"] }));
const PORT = 8080; 

const { getUserByEmail, generateRandomString, urlsForUser, urlDatabase } = require("./helpers");


let users = {};


app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id),
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (
    req.session.user_id &&
    urlDatabase[req.params.shortURL].userID === req.session.user_id
  ) {
    const templateVars = {
      user: users[req.session.user_id],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
    };
    res.render("urls_show", templateVars);
  } else{
  res.redirect("/urls");
  }
});

app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("registration");
});

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (
    req.session.user_id &&
    urlDatabase[req.params.shortURL].userID === req.session.user_id
  ) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newUrl = req.body.longURL;
    urlDatabase[id] = { longURL: newUrl, userID: req.session.user_id };
    res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let user = getUserByEmail(req.body.email, users);

  if (!user) {
    res.status(403).send({ error:  "Account not exist"});
  }

  if (user) {
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(403).send({ error: "Wrong email or password!" });
    }
  }

  req.session.user_id = user.id;
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
  req.session.user_id =  userId;

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
