# Rental Service Backend

REST API для сервиса аренды жилья.

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл .env и настройте переменные окружения:

```
HOST=http://localhost
PORT=5000
DB_NAME=rental_service
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

3. Запустите сервер в режиме разработки:

```bash
npm run dev
```

## API Endpoints

### Пользователи

#### POST /api/users/register

Регистрация нового пользователя

**Тело запроса (FormData):**

- `email` (string) - Email пользователя
- `password` (string) - Пароль
- `username` (string) - Имя пользователя
- `userType` (string) - Тип пользователя ("normal" или "pro")
- `avatar` (file) - Файл аватара

**Ответ:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "John Doe",
    "avatarUrl": "/static/avatar.jpg",
    "isPro": false
  }
}
```

### Предложения

#### GET /api/offers

Получение всех предложений

**Ответ:**

```json
[
  {
    "id": "1",
    "title": "Beautiful apartment",
    "type": "apartment",
    "price": 120,
    "city": {
      "name": "Paris",
      "location": {
        "latitude": 48.8566,
        "longitude": 2.3522,
        "zoom": 13
      }
    },
    "location": {
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "isFavorite": false,
    "isPremium": true,
    "rating": 4.5,
    "previewImage": "http://localhost:5000/static/image.jpg"
  }
]
```

#### GET /api/offers/:id

Получение полной информации о предложении

**Ответ:**

```json
{
  "id": "1",
  "title": "Beautiful apartment",
  "description": "A wonderful place to stay...",
  "type": "apartment",
  "price": 120,
  "city": {
    "name": "Paris",
    "location": {
      "latitude": 48.8566,
      "longitude": 2.3522,
      "zoom": 13
    }
  },
  "location": {
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "isFavorite": false,
  "isPremium": true,
  "rating": 4.5,
  "previewImage": "http://localhost:5000/static/image.jpg",
  "images": ["http://localhost:5000/static/image1.jpg"],
  "maxAdults": 4,
  "maxChildren": 0,
  "bedrooms": 2,
  "goods": ["WiFi", "Kitchen"],
  "host": {
    "id": 1,
    "name": "John Doe",
    "avatarUrl": "http://localhost:5000/static/avatar.jpg",
    "isPro": false
  }
}
```

#### POST /api/offers

Создание нового предложения

**Тело запроса (FormData):**

- `title` (string) - Название
- `description` (string) - Описание
- `city` (string) - Город
- `type` (string) - Тип ("apartment", "house", "room", "hotel")
- `price` (number) - Цена
- `rooms` (number) - Количество комнат
- `guests` (number) - Количество гостей
- `latitude` (number) - Широта
- `longitude` (number) - Долгота
- `isPremium` (boolean) - Премиум
- `isFavorite` (boolean) - В избранном
- `rating` (number) - Рейтинг
- `features` (string/array) - Удобства
- `userId` (number) - ID автора
- `previewImage` (file) - Превью изображение
- `photos` (files) - Дополнительные фото

## Обработка ошибок

API использует централизованную систему обработки ошибок:

- `400 Bad Request` - Некорректные данные запроса
- `401 Unauthorized` - Не авторизован
- `403 Forbidden` - Доступ запрещен
- `500 Internal Server Error` - Внутренняя ошибка сервера

Формат ответа при ошибке:

```json
{
  "message": "Описание ошибки"
}
```

## Структура проекта

```
server/
├── adapters/           # Адаптеры для преобразования данных
├── config/            # Конфигурация БД
├── controllers/       # Контроллеры
├── error/            # Обработка ошибок
├── middleware/       # Middleware
├── models/           # Модели Sequelize
├── routes/           # Маршруты
├── static/           # Статические файлы
└── index.js          # Основной файл
```

## Описание

Серверная часть приложения для аренды недвижимости, разработанная в рамках Лабораторной работы 2.

## Технологии

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- CORS
- dotenv
