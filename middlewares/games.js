const games = require("../models/game");

const findAllGames = async (req, res, next) => {
  if (req.query["categories.name"]) {
    req.gamesArray = await games.findGameByCategory(
      req.query["categories.name"]
    );
    next();
    return;
  }
  req.gamesArray = await games
    .find({})
    .populate("categories")
    .populate({
      path: "users",
      select: "-password",
    });

  next();
};

const findGameById = async (req, res, next) => {
  try {
    req.game = await games
      .findById(req.params.id) // Поиск записи по id
      .populate("categories") // Загрузка связанных записей о категориях
      .populate({
        path: "users",
        select: "-password",
      });

    console.log("Найдена игра: ");
    console.log("req.game =");
    console.log(req.game);
    next(); // Передаём управление в следующую функцию
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({ message: "Игра не найдена" }));
  }
};

// Метод создания игры
const createGame = async (req, res, next) => {
  console.log("POST /games");
  try {
    req.game = await games.create(req.body);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ message: "Ошибка создания игры" }));
  }
};

// Метод обновления игры
const updateGame = async (req, res, next) => {

  try {
    req.game = await games.findByIdAndUpdate(req.params.id, req.body);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ message: "Ошибка обновления игры" }));
  }
};

// Метод удаления игры по ID
const deleteGame = async (req, res, next) => {
  console.log(
    `Запущен метод удаления игры по ID (deleteGame): ${req.params.id}`
  );
  try {
    // Методом findByIdAndDelete по id находим и удаляем документ из базы данных
    req.game = await games.findByIdAndDelete(req.params.id);
    next(); // Передаём управление в следующую функцию
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({ message: "Ошибка удаления игры" }));
  }
};

//Проверка что это запрос на голосование
const checkIsVoteRequest = async (req, res, next) => {
  console.log("req.body.users = ");
  console.log(req.body.users);

  console.log("req.body.users_permissions_users = ");
  console.log(req.body.users_permissions_users);

  console.log("req.game.users = ");
  console.log(req.game.users);

  console.log("req.game.users.length = ");
  console.log(req.game.users.length);

  // Если в запросе присылают только поле users
  if (Object.keys(req.body).length === 1 && req.body.users) {
    //Пропишем в запрос что это запрос на голосование
    req.isVoteRequest = true;
  }
  next();
};


//Проверяем наличие полей в теле запроса
const checkEmptyFields = async (req, res, next) => {
 
  if (req.isVoteRequest) {
    next();
    return;
  }
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.image ||
    !req.body.link ||
    !req.body.developer
  ) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(400)
      .send(JSON.stringify({ message: "Заполни все поля checkEmptyFields" }));
  } else {
    next();
  }
};

// Проверяем наличие жанра у игры
const checkIfCategoriesAvaliable = async (req, res, next) => {
  console.log(
    "___5__Запущен метод проверки наличие жанра у игры (checkIfCategoriesAvaliable)"
  );
  console.log("Это запрос на голоосвнаие req.isVoteRequest = ");
  console.log(req.isVoteRequest);
  console.log("Если да то пропускаем проверку");

  if (req.isVoteRequest) {
    next();
    return;
  }

  console.log("req.game.categories =");

  console.log("req.game.categories.length =");

  if (!req.body.categories || req.body.categories.length === 0) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(400)
      .send(JSON.stringify({ message: "Выбери хотя бы одну категорию" }));
  } else {
    next();
  }
};

const checkIfUsersAreSafe = async (req, res, next) => {
  console.log(
    "ПОля с пользователем присуствуют в теле зпроса req.body.users = "
  );
  console.log(req.body.users);


  if (!req.body.users) {
    console.log(
      "в запросе отсуствуют поля с пользователями !req.body.users - falsh"
    );
    next();
    return;
  }

  if (req.body.users.length - 1 === req.game.users.length) {
    console.log(
      "Количество пользователей в запросе больше на 1 - Голоса не накручены"
    );
    next();
    return;
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(
      JSON.stringify({
        message:
          "Нельзя удалять пользователей или добавлять больше одного пользователя",
      })
    );
  }
};
const checkIsGameExists = async (req, res, next) => {
  const isInArray = req.gamesArray.find((game) => {
    return req.body.title === game.title;
  });
  // Если нашли совпадение, то отвечаем кодом 400 и сообщением
  if (isInArray) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(
      JSON.stringify({
        message: "Игра с таким названием уже существует",
      })
    );
  } else {
    next();
  }
};

// СООБЩЕНИЕ В КОНСОЛЬ
const massage = (req, res, next) => {
  console.log("____1_Получен PUT запрос на обновление игры");
  console.log("req.params.id = ");
  console.log(req.params.id);

  console.log("req. = ");
  console.log(req);

  next();
};

// Экспортируем методы
module.exports = {
  findAllGames,
  findGameById,
  createGame,
  updateGame,
  deleteGame,
  checkEmptyFields,
  checkIfCategoriesAvaliable,
  checkIfUsersAreSafe,
  checkIsGameExists,
  checkIsVoteRequest,
  massage,
};
