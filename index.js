// Основной файл серверного приложения

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import router from "./routes/index.js";
import errorHandler from "./middleware/ErrorHandlingMiddleware.js";

// Импорт моделей для создания таблиц
import { User } from "./models/user.js";
import { Offer } from "./models/offer.js";
import { Review } from "./models/review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(cors());

// Настройка обработки JSON
app.use(express.json());

// Раздача статических файлов
app.use("/static", express.static(path.resolve(__dirname, "static")));

// Основные маршруты
app.use("/", router);

// Middleware для обработки ошибок (должен быть последним)
app.use(errorHandler);

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
