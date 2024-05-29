// Создаём роут для запросов категорий
const gamesRouter = require("express").Router();
// Импортируем вспомогательные функции
const {
  findAllGames,
  createGame,
  findGameById,
  updateGame,
  deleteGame,
  checkEmptyFields,
  checkIfCategoriesAvaliable,
  checkIfUsersAreSafe,
  checkIsGameExists,
  checkIsVoteRequest,
  massage,
} = require("../middlewares/games");
const {
  sendAllGames,
  sendGameCreated,
  sendGameById,
  sendGameUpdated,
  sendGameDeleted,
} = require("../controllers/games");
const { checkAuth } = require("../middlewares/auth");
const cors = require("../middlewares/cors");

//

// Обрабатываем GET-запрос (ПОЛУЧИТЬ ВСЕ) с роутом '/games'
gamesRouter.get("/games", findAllGames, sendAllGames);

//

// Обрабатываем GET-запрос (ПОЛУЧИТЬ по ID) с роутом '/games/:id'
gamesRouter.get("/games/:id", findGameById, sendGameById);

//

// Обрабатываем POST-запрос (СОЗДАТЬ) с роутом '/games'
gamesRouter.post(
  "/games",
  findAllGames,
  checkEmptyFields, //Проверяем что в теле запроса есть нужные поля
  checkIsGameExists, //// При создании проверяем что с таким имененм уженет в БД
  checkIfCategoriesAvaliable, // Проверяем наличие жанра у игры
  checkAuth, // Проверяем авторизацию пользователя по наличию JWT-токена
  findAllGames, // ищем игру
  createGame, // создаем игру
  sendGameCreated // отправляем ответ пользователю
);

//

// Обрабатываем PUT-запрос (ОБНОВЛЕНИЕ) с роутом '/games'
gamesRouter.put(
  // Слушаем запросы по эндпоинту
  "/games/:id",
  // Выводим сообщение в консоль о начале работы роута
  massage,
  // Шаг 1. Находим игру по id из запроса
  findGameById,
  checkIsVoteRequest, // Если это запрос на голоосвание, то сокращаем часть проверок
  // Шаг 2. Выполняем проверки для корректного обновления (опционально)
  checkEmptyFields, // Проверяем наличие полей в теле запроса
  checkIfCategoriesAvaliable, // Проверяем наличие жанра у игры
  checkIfUsersAreSafe, // Проверяем, есть ли users в теле запроса и не накручены ли голоса
  checkAuth, // Проверяем авторизацию пользователя по наличию JWT-токена
  // Шаг 3. Обновляем запись с игрой
  updateGame,
  // Шаг 4. Возвращаем на клиент ответ с результатом обновления
  sendGameUpdated
);

//

// Обрабатываем DELETE-запрос (УДАЛИТЬ по ID) с роутом '/games/:id'
gamesRouter.delete(
  "/games/:id", // Слушаем запросы по эндпоинту
  // Тут будут функция удаления элементов из MongoDB и ответ клиенту
  checkAuth, // Проверяем авторизацию пользователя по наличию JWT-токена
  deleteGame,
  sendGameDeleted
);

//

// Экспортируем роут для использования в приложении — app.js
module.exports = gamesRouter;
