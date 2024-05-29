const mongoose = require("mongoose");

const categorySchema = require("./category");
const userSchema = require("./user");
const gameSchema = new mongoose.Schema({
  // Создали схему
  title: {
    // Поле со строковым значением
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  developer: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema, // Содержит ссылки на связанные с игрой модели пользователей
    },
  ],
  // Добавляем поле для списка категорий
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: categorySchema, // Содержит ссылки на связанные с игрой модели категорий
    },
  ],
});
gameSchema.statics.findGameByCategory = function (category) {
  return this.find({}) // Выполним поиск всех игр
    .populate({
      path: "categories",
      match: { name: category }, // Опция поможет сопоставить подходящие игры по выбранной категории
    })
    .populate({
      path: "users",
      select: "-password", // Позволяет получить записи о пользователях за исключением их паролей (они же хранятся в зашифрованном виде)
    })
    .then((games) => {
      return games.filter((game) => game.categories.length > 0);
    });
};
const game = mongoose.model("game", gameSchema); // создали модель на основе схемы
module.exports = game; 
