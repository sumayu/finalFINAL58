const jwt = require("jsonwebtoken");
const users = require("../models/user");
const path = require("path");

const login = (req, res) => {
console.log("Метод login - НАЧАЛО");

const { email, password } = req.body;

console.log("Запрос на авторизацию с параметрами req.body = ");
console.log(req.body);

users
.findUserByCredentials(email, password)
.then((user) => {
console.log("Пользователь с параметрами req.body найден в БД");
  
  const token = jwt.sign({ _id: user._id }, "some-secret-key", {
    expiresIn: "7d",
  });

  res.status(200).send({
    _id: user._id,
    username: user.username,
    email: user.email,
    jwt: token,
  });
})
.catch((error) => {
  res.status(401).send({ message: error.message });
});
};

const sendIndex = (req, res) => {
if (req.cookies.jwt) {
try {
jwt.verify(req.cookies.jwt, "some-secret-key");
return res.redirect("/admin/dashboard");
} catch (err) {
res.sendFile(path.join(__dirname, "../public/index.html"));
}
}
res.sendFile(path.join(__dirname, "../public/index.html"));
};

const sendDashboard = (req, res) => {
res.sendFile(path.join(__dirname, "../public/admin/dashboard.html"));
};

module.exports = { login, sendIndex, sendDashboard };

