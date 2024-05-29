
const categories = require("../models/category");

const findAllCategories = async (req, res, next) => {
  req.categoriesArray = await categories.find({});

  

  next();
};

const findCategoryById = async (req, res, next) => {
  console.log(`GET /categories/:id ${req.params.id}`);
  try {
    req.category = await categories.findById(req.params.id);
    next(console.log("Окончаниеработы middlewares - findCategoryById"));
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({ message: "Категория не найдена" }));
  }
};

const createCategory = async (req, res, next) => {
  try {
    req.category = await categories.create(req.body);
    next(console.log("Окончание работы middlewares - createCategory"));
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(400)
      .send(JSON.stringify({ message: "Ошибка создания категории" }));
  }
};

const updateCategory = async (req, res, next) => {
  console.log("PUT /categories");
  try {
    req.category = await categories.findByIdAndUpdate(req.params.id, req.body);
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(400)
      .send(JSON.stringify({ message: "Ошибка обновления категории" }));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    req.category = await categories.findByIdAndDelete(req.params.id);
    next(); // Передаём управление в следующую функцию
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(404)
      .send(JSON.stringify({ message: "Ошибка удаления категории" }));
  }
};

const checkIsCategoryExists = async (req, res, next) => {
  const isInArray = req.categoriesArray.find((category) => {
    return req.body.name === category.name;
  });
  if (isInArray) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(
      JSON.stringify({
        message: "Категория с таким названием уже существует",
      })
    );
  } else {
  }
};


const categoryIsNew = async (req, res, next) => {
  console.log("Запуск middlewares - categoryIsNew ('Это новая категория?')");

  try {
    const rez4 = await categories.findOne({ name: req.body.name });
    if (rez4 === null) {
      next();
    } else {
      console.log("Такая запись уже есть в бд");
      res.setHeader("Content-Type", "application/json");
      res.status(400).send(
        JSON.stringify({
          message: "Такая категоия уже существует, транзакция отклонена!!!",
        })
      );
    }
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(
      JSON.stringify({
        message: "Категория с таким названием уже существует",
      })
    );
  }
};
const checkEmptyName = async (req, res, next) => {
  if (!req.body.name) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(400)
      .send(JSON.stringify({ message: "Заполни все поля" }));
  } else {

    next();
  }
};


module.exports = {
  findAllCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryIsNew,
  checkIsCategoryExists,
  checkEmptyName,
};
