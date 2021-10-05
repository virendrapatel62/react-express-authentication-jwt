const { json } = require("body-parser");
const express = require("express");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const passwordHash = require("password-hash");
let users = [];

function saveUserToFile(user) {
  users.push(user);
  fs.writeFileSync(
    path.join(__dirname, "../data/users.json"),
    JSON.stringify(users)
  );
}

function readUsersFromFile() {
  console.log(path.join(__dirname, "../data/users.json"));
  const buffer = fs.readFileSync(path.join(__dirname, "../data/users.json"));
  const stringData = buffer.toString();
  if (stringData) {
    users = JSON.parse(stringData);
  }
}
readUsersFromFile();

const app = express();

app.use(express.json());

app.listen(3002, () => {
  console.log("Listening on PORT 3001");
});

app.get("/", (request, response) => {
  response.json({
    message: "Api is working...",
  });
});

app.get("/api/users", (request, response) => {
  response.json({ users });
});

app.post("/api/users/register", (request, response) => {
  console.log("User Register in progress..");
  const user = request.body;
  user.id = uuid();
  user.password = passwordHash.generate(user.password);

  saveUserToFile(user);

  return response.json({
    user,
  });
});

app.post("/api/users/login", (request, response) => {
  console.log("User Login in progress..");
  const { email, password } = request.body;

  console.log({ email, password });

  const user = users.find((user) => {
    return user.email === email;
  });

  if (user && passwordHash.verify(password, user.password)) {
    // const token = jwt.sign()
    return response.json({ message: "Login Success" });
  }

  return response.status(400).json({
    message: "Invalid Email or Password",
  });
});
