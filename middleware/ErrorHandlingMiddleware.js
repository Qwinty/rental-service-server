import ApiError from "../error/ApiError.js";

export default function (err, req, res, next) {
  // Логируем все ошибки для отладки
  console.error("Error occurred:", {
    name: err.name,
    message: err.message,
    status: err.status,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof ApiError) {
    const response = {
      message: err.message,
      status: err.status,
    };

    // Добавляем массив ошибок, если есть
    if (err.errors && err.errors.length > 0) {
      response.errors = err.errors;
    }

    // В режиме разработки добавляем stack trace
    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }

    return res.status(err.status).json(response);
  }

  // Обработка ошибок Sequelize
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));

    return res.status(400).json({
      message: "Ошибка валидации данных",
      status: 400,
      errors,
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: `Значение '${error.value}' уже существует`,
      value: error.value,
    }));

    return res.status(409).json({
      message: "Нарушение ограничения уникальности",
      status: 409,
      errors,
    });
  }

  if (err.name === "SequelizeDatabaseError") {
    console.error("Database error:", err);

    return res.status(500).json({
      message: "Ошибка базы данных",
      status: 500,
    });
  }

  // Обработка ошибок валидации JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Некорректный JSON в теле запроса",
      status: 400,
    });
  }

  // Обработка ошибок превышения размера запроса
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Размер запроса слишком большой",
      status: 413,
    });
  }

  // Обработка timeout ошибок
  if (err.code === "ETIMEDOUT" || err.timeout) {
    return res.status(408).json({
      message: "Время ожидания запроса истекло",
      status: 408,
    });
  }

  // Общая обработка для всех остальных ошибок
  const response = {
    message: "Внутренняя ошибка сервера",
    status: 500,
  };

  // В режиме разработки показываем больше информации
  if (process.env.NODE_ENV === "development") {
    response.originalError = err.message;
    response.stack = err.stack;
  }

  return res.status(500).json(response);
}
