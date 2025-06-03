// Основной файл серверного приложения

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import router from "./routes/index.js";
import errorHandler from "./middleware/ErrorHandlingMiddleware.js";

// Импорт моделей с ассоциациями для создания таблиц
import { User, Offer, Favorite } from "./models/associations.js";
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

// Health check endpoint для Railway (moved to root level)
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Основные маршруты
app.use("/", router);

// Middleware для обработки ошибок (должен быть последним)
app.use(errorHandler);

// Функция для ожидания подключения к БД с exponential backoff
const waitForDatabase = async (maxRetries = 10, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("Подключение к БД установлено успешно.");
      return true;
    } catch (error) {
      console.log(
        `Попытка подключения к БД ${attempt}/${maxRetries} неудачна:`,
        error.message
      );

      if (attempt === maxRetries) {
        throw new Error(
          `Не удалось подключиться к БД после ${maxRetries} попыток`
        );
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, etc.
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Ожидание ${delay}ms перед следующей попыткой...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Функция для подключения к БД и запуска сервера
const start = async () => {
  try {
    // Ожидание подключения к БД с retry логикой
    await waitForDatabase();

    // Синхронизация моделей с БД (создание таблиц)
    await sequelize.sync({ force: false });
    console.log("Таблицы синхронизированы с БД.");

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Критическая ошибка при запуске сервера:", error);
    process.exit(1);
  }
};

// Graceful shutdown для serverless
process.on("SIGTERM", async () => {
  console.log("Получен сигнал SIGTERM, завершение работы...");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Получен сигнал SIGINT, завершение работы...");
  await sequelize.close();
  process.exit(0);
});

start();
