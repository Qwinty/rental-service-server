# Rental Service Backend

**Rental Service** is a RESTful API for a housing rental platform.  
The project is built with Node.js 18 + Express, uses PostgreSQL via Sequelize, and supports image uploads with Multer.

---

## Features

- **User Registration & Authentication** with JWT.
- **Rental Listings Management**: create, retrieve, update, delete listings.
- **Favorites**: add/remove listings to a user’s “Favorites” list.
- **Reviews**: post and retrieve reviews tied to specific listings.
- **Image Uploads**: upload cover images and gallery images (stored in `/static`).

---

## Technology Stack

| Category      | Stack                                  |
|---------------|----------------------------------------|
| Runtime       | Node.js 18, Express 5                  |
| Database      | PostgreSQL 15 + Sequelize 6            |
| Authentication| JWT (`jsonwebtoken`), bcrypt           |
| File Upload   | Multer, uuid                           |
| Utilities     | dotenv, cors, nodemon                  |
| CI / Deploy   | Railway + Nixpacks                     |

---

## Quick Start

> Requirements: **Node.js 18+**, **PostgreSQL**

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd rental-service-backend

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root:

   ```env
   HOST=http://localhost:5000
   PORT=5000

   DB_NAME=rental_service
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432

   JWT_SECRET=your_jwt_secret
   ```

4. **Initialize the database**

   Sequelize models will sync automatically on server start (`sequelize.sync()` is called in `index.js`).

5. **Run the server in development mode**

   ```bash
   npm run dev
   ```

---

## Available npm Scripts

| Script                  | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm start`             | Run in production mode                        |
| `npm run dev`           | Start with hot reload via nodemon             |
| `npm run add-test-data` | Seed the database with sample listings/images |

---

## Project Structure (overview)

```
├─ adapters/         # Convert Sequelize models → DTOs
├─ controllers/      # Business logic and request validation
├─ middleware/       # auth, upload handling, error handler
├─ models/           # Sequelize models and associations
├─ routes/           # Express routes (/users, /offers, /reviews)
├─ static/           # Uploaded images (cover + gallery)
├─ test-endpoints/   # Postman collection for testing
└─ index.js          # Entry point
```

---

## API Endpoints

All endpoints are prefixed with `/api`. Unless noted, routes that modify data require an `Authorization: Bearer <token>` header.

### Authentication

- **Register a new user**
  `POST /api/users/register`
  Request body:

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

  Response: JWT token and user data.

- **Login**
  `POST /api/users/login`
  Request body:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

  Response: JWT token and user data.

### Users

- **Get current user profile**
  `GET /api/users/me`
  Header: `Authorization: Bearer <token>`
  Response: User information.

### Listings (Offers)

- **Get all listings**
  `GET /api/offers`
  Response: Array of listing objects (with pagination).

- **Get a single listing by ID**
  `GET /api/offers/:offerId`
  Response: Listing object with details.

- **Create a new listing**
  `POST /api/offers`
  Header: `Authorization: Bearer <token>`
  Content-Type: `multipart/form-data`
  Fields:

  - `title` (string)
  - `description` (string)
  - `price` (number)
  - `location` (string)
  - `coverImage` (file)
  - `galleryImages` (files array)
    Response: Created listing object.

- **Update an existing listing**
  `PUT /api/offers/:offerId`
  Header: `Authorization: Bearer <token>`
  Content-Type: `multipart/form-data` (if uploading new images)
  Fields (any of):

  - `title`
  - `description`
  - `price`
  - `location`
  - `coverImage` (file)
  - `galleryImages` (files array)
    Response: Updated listing object.

- **Delete a listing**
  `DELETE /api/offers/:offerId`
  Header: `Authorization: Bearer <token>`
  Response: Confirmation of deletion.

### Favorites

- **Add listing to favorites**
  `POST /api/offers/:offerId/favorite`
  Header: `Authorization: Bearer <token>`
  Response: Updated favorites list or status.

- **Remove listing from favorites**
  `DELETE /api/offers/:offerId/favorite`
  Header: `Authorization: Bearer <token>`
  Response: Updated favorites list or status.

- **Get current user’s favorite listings**
  `GET /api/users/me/favorites`
  Header: `Authorization: Bearer <token>`
  Response: Array of favorited listings.

### Reviews

- **Get all reviews for a listing**
  `GET /api/offers/:offerId/reviews`
  Response: Array of review objects.

- **Post a review for a listing**
  `POST /api/offers/:offerId/reviews`
  Header: `Authorization: Bearer <token>`
  Request body:

  ```json
  {
    "rating": number,       // e.g., 1–5
    "comment": "string"
  }
  ```

  Response: Created review object.

### Image Upload (Standalone)

> These endpoints are optional—image uploads can also be handled directly through the listing routes with `multipart/form-data`.

- **Upload a single image**
  `POST /api/upload`
  Header: `Authorization: Bearer <token>`
  Content-Type: `multipart/form-data`
  Field:

  - `image` (file)
    Response: `{ "url": "/static/<filename>" }`

---

## Deployment on Railway

This project uses **Nixpacks**, so deploying on Railway is straightforward:

1. Link your Git repository to Railway.
2. Add the same environment variables from your local `.env`.
3. Click **Deploy**.

Railway will detect the Nixpacks configuration and handle the build/deploy automatically. A `railway.json` file defines health checks and restart policies.

---

## License

This project is licensed under the **MIT License**. Feel free to change to another license if needed.

---

## Contact

Found a bug? Open an issue or submit a pull request. For questions, reach out to the project maintainer directly.ы
