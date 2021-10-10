const { json } = require("body-parser");
const express = require("express");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const passwordHash = require("password-hash");
let users = [];
const jwtSecret = "secret@!@#";

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

app.use((request, response, next) => {
  console.log(`method: ${request.method} url: ${request.url}`);
  next();
});

app.use(cors());

app.use(express.json());
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

app.get("/", (request, response) => {
  response.json({
    message: "Api is working...",
  });
});

app.get("/api/users", (request, response) => {
  console.log("/api/users");
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
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, jwtSecret);

    return response.json({ message: "login success", token, type: "Bearer" });
  }

  return response.status(400).json({
    message: "Invalid Email or Password",
  });
});

function authMiddleware(request, response, next) {
  const { authorization } = request.headers;

  try {
    const token = authorization.split(" ")[1]; // ["Bearer" , 'token']
    jwt.verify(token, jwtSecret);
  } catch (error) {
    return response.status(400).json({ error: "Unauthorized Access" });
  }

  next();
}

app.get("/api/orders", authMiddleware, (req, res) => {
  res.json({ orders: ["order1", "order2", "order3"] });
});

app.get("/api/profile", authMiddleware, (request, response) => {
  response.json({ profile: { name: "virendra" } });
});
