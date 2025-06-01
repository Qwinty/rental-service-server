// Основной файл серверного приложения

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database.js";
import router from "./routes/index.js";

// Импорт моделей для создания таблиц
import { User } from "./models/user.js";
import { Offer } from "./models/offer.js";
import { Review } from "./models/review.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(cors());

// Настройка обработки JSON
app.use(express.json());

// Основные маршруты
app.use("/", router);

// Функция для подключения к БД и запуска сервера
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключение к БД установлено успешно.");

    // Синхронизация моделей с БД (создание таблиц)
    await sequelize.sync({ force: false });
    console.log("Таблицы синхронизированы с БД.");

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка подключения к БД:", error);
  }
};

start();
