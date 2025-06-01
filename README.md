# Rental Service Backend

## Описание

Серверная часть приложения для аренды недвижимости, разработанная в рамках Лабораторной работы 2.

## Структура проекта

```
server/
├── config/
│   └── database.js          # Конфигурация подключения к БД
├── controllers/
│   └── offerController.js   # Контроллеры для работы с предложениями
├── models/
│   ├── user.js             # Модель пользователя
│   ├── offer.js            # Модель предложения
│   └── review.js           # Модель отзыва
├── routes/
│   ├── index.js            # Основной роутер
│   └── offerRoutes.js      # Маршруты для предложений
├── index.js                # Основной файл приложения
├── test-server.js          # Тестовый сервер без БД
├── package.json
└── .env                    # Переменные окружения
```

## Установка и настройка

### 1. Установка зависимостей

```bash
cd server
npm install
```

### 2. Настройка базы данных

Создайте файл `.env` в папке `server` со следующим содержимым:

```
PORT=5000
DB_NAME=rental_service
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
```

### 3. Настройка PostgreSQL

- Установите PostgreSQL
- Создайте базу данных `rental_service`
- Замените `your_password` на ваш пароль от PostgreSQL

## Запуск приложения

### Тестовый сервер (без БД)

```bash
node test-server.js
```

### Основной сервер (с БД)

```bash
npm run dev
```

## API Endpoints

### GET /api/offers

Получение всех предложений по аренде

**Пример запроса:**

```
GET http://localhost:5000/api/offers
```

**Пример ответа:**

```json
[]
```

## Тестирование

Используйте Postman для тестирования API:

1. Создайте новый запрос
2. Выберите метод GET
3. Введите URL: `http://localhost:5000/api/offers`
4. Нажмите Send

## Модели данных

### User (Пользователь)

- username: строка (1-15 символов)
- email: строка (уникальный, валидный email)
- password: строка
- userType: enum ('normal', 'pro')
- avatar: строка (необязательное)

### Offer (Предложение)

- title: строка (10-100 символов)
- description: строка (20-1024 символа)
- city: enum (Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf)
- previewImage: строка
- photos: массив строк
- isPremium: boolean
- isFavorite: boolean
- rating: decimal (1-5)
- type: enum (apartment, house, room, hotel)
- rooms: integer (1-8)
- guests: integer (1-10)
- price: integer (100-100000)
- latitude, longitude: float

### Review (Отзыв)

- text: строка (5-1024 символа)
- rating: integer (1-5)
- publishDate: дата

## Технологии

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- CORS
- dotenv
