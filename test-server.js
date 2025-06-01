import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Настройка CORS
app.use(cors());

// Настройка обработки JSON
app.use(express.json());

// Тестовый маршрут
app.get("/", (req, res) => {
  res.json({ message: "Тестовый сервер работает!" });
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
