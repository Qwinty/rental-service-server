export default class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = "ApiError";
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Пользователь не авторизован") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Доступ запрещен") {
    return new ApiError(403, message);
  }

  static notFound(message = "Ресурс не найден") {
    return new ApiError(404, message);
  }

  static conflict(message = "Конфликт данных") {
    return new ApiError(409, message);
  }

  static unprocessableEntity(
    message = "Невозможно обработать запрос",
    errors = []
  ) {
    return new ApiError(422, message, errors);
  }

  static tooManyRequests(message = "Слишком много запросов") {
    return new ApiError(429, message);
  }

  static internal(message = "Внутренняя ошибка сервера") {
    return new ApiError(500, message);
  }

  static badGateway(message = "Неверный шлюз") {
    return new ApiError(502, message);
  }

  static serviceUnavailable(message = "Сервис недоступен") {
    return new ApiError(503, message);
  }

  // Метод для создания ошибки валидации
  static validation(message = "Ошибка валидации данных", errors = []) {
    return new ApiError(400, message, errors);
  }

  // Метод для создания ошибки файла
  static fileError(message = "Ошибка при работе с файлом") {
    return new ApiError(400, message);
  }

  // Метод для создания ошибки базы данных
  static database(message = "Ошибка базы данных") {
    return new ApiError(500, message);
  }
}
