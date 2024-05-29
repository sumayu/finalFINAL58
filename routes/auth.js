// routes/auth.js

const authRouter = require("express").Router();
const { login } = require("../controllers/auth.js");

authRouter.post("/auth/login", login);
authRouter.post("/auth/local", login);

module.exports = authRouter;
