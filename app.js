const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const connectToDatabase = require("./database/connect");
const cors = require("./middlewares/cors");
const apiRouter = require("./routes/apiRouter");
const cookieParser = require("cookie-parser");
const pagesRouter = require("./routes/pages");

const app = express();
const PORT = (3001)//тут убрал 3000порт

connectToDatabase();

app.use(
  cors,
  cookieParser(),
  pagesRouter,
  bodyParser.json(),
  express.static(path.join(__dirname, "public")),
  apiRouter 

);

app.listen(PORT);
