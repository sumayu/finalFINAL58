const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  console.log("___7__Запущен метод проверки авторизации (checkAuth)");

  const { authorization } = req.headers;
  console.log("req.body.users = ");
  console.log(req.body.users);

  console.log("req.headers");
  console.log(req.headers);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  next();
};
