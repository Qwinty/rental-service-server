import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Настройка CORS
app.use(cors());

// Настройка обработки JSON
app.use(express.json());

// Раздача статических файлов
app.use("/static", express.static(path.resolve(__dirname, "static")));

// Тестовый маршрут
app.get("/test", (req, res) => {
  res.json({ message: "Сервер работает!" });
});

// Тестовый маршрут для offers
app.get("/api/offers", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Тестовое предложение",
      city: "Paris",
      price: 100,
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Тестовый сервер запущен на порту ${PORT}`);
});
