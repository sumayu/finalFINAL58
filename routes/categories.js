// Файл routes/categories.js

// Создаём роут для запросов категорий
const categoriesRouter = require("express").Router();

// Импортируем вспомогательные функции
const {
  findAllCategories,
  createCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
  categoryIsNew,
  checkIsCategoryExists,
  checkEmptyName,
} = require("../middlewares/categories");
const {
  sendAllCategories,
  sendCategoryCreated,
  sendCategoryById,
  sendCategoryUpdated,
  sendCategoryDeleted,
} = require("../controllers/categories");

const { checkAuth } = require("../middlewares/auth");

// Обрабатываем GET-запрос с роутом '/categories'
categoriesRouter.get("/categories", findAllCategories, sendAllCategories);

// Обрабатываем GET-запрос с роутом '/categories/:id'
categoriesRouter.get("/categories/:id", findCategoryById, sendCategoryById);

// Обрабатываем POST-запрос с роутом '/categories'
categoriesRouter.post(
  "/categories",
  findAllCategories,
  checkEmptyName,
  categoryIsNew,
  //checkIsCategoryExists  //Проверяет что такое название отсутсвует
  checkAuth, // Проверяем авторизацию пользователя по наличию JWT-токена
  createCategory,
  sendCategoryCreated
);

categoriesRouter.put(
  "/categories/:id", // Слушаем запросы по эндпоинту
  findCategoryById, // Шаг 1. Находим игру по id из запроса

  //Проверяет что такое название отсутсвует (метод из коробки)
  // не работает в пут запросе, т.к. не запрашивается массив с категориями
  // checkIsCategoryExists,
  checkEmptyName,
  checkAuth, // Проверяем авторизацию пользователя по наличию JWT-токена
  categoryIsNew, // Шаг 2. Выполняем проверки для корректного обновления (опционально)
  updateCategory, // Шаг 3. Обновляем запись с игрой
  sendCategoryUpdated // Шаг 4. Возвращаем на клиент ответ с результатом обновления
);

categoriesRouter.delete(
  "/categories/:id",
  checkAuth, // Проверяем авторизацию пользователя по наличию JWT-токена
  deleteCategory,
  sendCategoryDeleted
);

// Экспортируем роут для использования в приложении — app.js
module.exports = categoriesRouter;
