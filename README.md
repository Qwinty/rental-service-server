# Rental Service Backend

REST API для сервиса аренды жилья.

## Установка и запуск

### 1. Установите зависимости

```bash
npm install
```

### 2. Создайте файл .env и настройте переменные окружения

```env
HOST=http://localhost
PORT=5000
DB_NAME=rental_service
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key-for-jwt-tokens
```

### 3. Запустите сервер в режиме разработки

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
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "John Doe",
    "avatarUrl": "/static/avatar.jpg",
    "isPro": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "hasCustomAvatar": true
  }
}
```

#### POST /api/users/login

Авторизация пользователя

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/users/login

Проверка статуса аутентификации (требует авторизации)

**Заголовки:**

- `Authorization: Bearer {token}`

**Ответ:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "John Doe",
  "avatar": "/static/avatar.jpg",
  "isPro": false,
  "token": "новый_токен"
}
```

#### DELETE /api/users/logout

Выход пользователя

**Ответ:**

```json
{
  "message": "Вы успешно вышли из системы"
}
```

#### GET /api/users/:id

Получение информации о пользователе

**Ответ:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "John Doe",
    "avatarUrl": "/static/avatar.jpg",
    "isPro": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "hasCustomAvatar": true
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

#### GET /api/offers/favorite

Получение списка избранных предложений

**Ответ:**

Массив предложений с `isFavorite: true`

#### POST /api/offers/favorite/:offerId/:status

Добавление/удаление предложения в/из избранное (требует авторизации)

**Параметры:**

- `offerId` - ID предложения
- `status` - 1 для добавления в избранное, 0 для удаления

**Заголовки:**

- `Authorization: Bearer {token}`

**Ответ:**

Полная информация о предложении с обновленным статусом

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

### Отзывы

#### POST /api/reviews/:offerId

Добавление нового отзыва (требует авторизации)

**Параметры:**

- `offerId` - ID предложения

**Заголовки:**

- `Authorization: Bearer {token}`

**Тело запроса:**

```json
{
  "comment": "Отличное место для отдыха!",
  "rating": 5
}
```

**Ответ:**

```json
{
  "success": true,
  "review": {
    "id": 1,
    "text": "Отличное место для отдыха!",
    "rating": 5,
    "publishdate": "2024-01-01T00:00:00.000Z",
    "UserId": 1,
    "OfferId": 1
  }
}
```

#### GET /api/reviews/:offerId

Получение отзывов к предложению

**Параметры:**

- `offerId` - ID предложения

**Ответ:**

```json
[
  {
    "id": "1",
    "comment": "Отличное место для отдыха!",
    "rating": 5,
    "date": "2024-01-01T00:00:00.000Z",
    "user": {
      "name": "John Doe",
      "avatarUrl": "http://localhost:5000/static/avatar.jpg",
      "isPro": false
    }
  }
]
```

## Аутентификация

API использует JWT токены для аутентификации. После успешной авторизации клиент получает токен, который необходимо передавать в заголовке `Authorization: Bearer {token}` для доступа к защищенным endpoints.

**Защищенные endpoints:**

- `POST /api/reviews/:offerId` - добавление отзыва
- `POST /api/offers/favorite/:offerId/:status` - управление избранным
- `GET /api/users/login` - проверка статуса аутентификации

## Обработка ошибок

API использует централизованную систему обработки ошибок:

- `400 Bad Request` - Некорректные данные запроса
- `401 Unauthorized` - Не авторизован / недействительный токен
- `403 Forbidden` - Доступ запрещен
- `500 Internal Server Error` - Внутренняя ошибка сервера

Формат ответа при ошибке:

```json
{
  "message": "Описание ошибки"
}
```

## Тестирование

Для тестирования API используйте коллекцию Postman `test-endpoints.postman_collection.json`, которая включает все endpoints с предустановленными данными и автоматическим сохранением JWT токена.

Подробные инструкции по тестированию смотрите в файле `LAB4_TESTING.md`.

## Структура проекта

```filestructure
server/
├── adapters/           # Адаптеры для преобразования данных
├── config/            # Конфигурация БД
├── controllers/       # Контроллеры
├── error/            # Обработка ошибок
├── middleware/       # Middleware (включая аутентификацию)
├── models/           # Модели Sequelize
├── routes/           # Маршруты
├── static/           # Статические файлы
└── index.js          # Основной файл
```

## Описание

Серверная часть приложения для аренды недвижимости, разработанная в рамках лабораторных работ по веб-технологиям.

**Функциональность:**

- Регистрация и аутентификация пользователей с JWT
- Управление предложениями по аренде
- Система отзывов
- Управление избранными предложениями
- Загрузка и хранение изображений

## Технологии

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- multer
- CORS
- dotenv
