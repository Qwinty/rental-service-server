import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError.js";
import { User } from "../models/user.js";

// Функция для валидации email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Функция для валидации пароля
const isValidPassword = (password) => {
  // Минимум 6 символов, хотя бы одна буква и одна цифра
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

// Функция для валидации имени пользователя
const isValidUsername = (username) => {
  // От 2 до 50 символов, только буквы, цифры и пробелы
  const usernameRegex = /^[A-Za-zА-Яа-я0-9\s]{2,50}$/;
  return usernameRegex.test(username);
};

// Функция для получения дефолтного аватара
const getDefaultAvatar = () => {
  return "/static/defaults/default-avatar.jpg";
};

export const registration = async (req, res, next) => {
  try {
    const { email, password, userType, username } = req.body;

    // Детальная валидация входных данных
    if (!email) {
      return next(ApiError.badRequest("Email обязателен для заполнения"));
    }

    if (!password) {
      return next(ApiError.badRequest("Пароль обязателен для заполнения"));
    }

    if (!username) {
      return next(
        ApiError.badRequest("Имя пользователя обязательно для заполнения")
      );
    }

    if (!userType) {
      return next(
        ApiError.badRequest("Тип пользователя обязателен для заполнения")
      );
    }

    // Валидация формата данных
    if (!isValidEmail(email)) {
      return next(ApiError.badRequest("Некорректный формат email адреса"));
    }

    if (!isValidPassword(password)) {
      return next(
        ApiError.badRequest(
          "Пароль должен содержать минимум 6 символов, включая буквы и цифры"
        )
      );
    }

    if (!isValidUsername(username)) {
      return next(
        ApiError.badRequest(
          "Имя пользователя должно содержать от 2 до 50 символов (буквы, цифры, пробелы)"
        )
      );
    }

    if (!["normal", "pro"].includes(userType)) {
      return next(
        ApiError.badRequest("Тип пользователя должен быть 'normal' или 'pro'")
      );
    }

    // Проверка файла аватара (теперь необязательно)
    let avatarImage = getDefaultAvatar(); // Используем дефолтный аватар по умолчанию

    if (req.file) {
      // Если файл загружен, проверяем его
      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return next(
          ApiError.badRequest(
            "Неподдерживаемый формат файла. Допустимы: JPEG, PNG, GIF"
          )
        );
      }

      // Проверка размера файла (максимум 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        return next(
          ApiError.badRequest("Размер файла не должен превышать 5MB")
        );
      }

      // Используем загруженный файл
      avatarImage = `/static/${req.file.filename}`;
    }

    // Проверка существования пользователя
    let candidate;
    try {
      candidate = await User.findOne({ where: { email: email.toLowerCase() } });
    } catch (dbError) {
      console.error("Ошибка проверки существования пользователя:", dbError);
      return next(ApiError.internal("Ошибка при проверке данных пользователя"));
    }

    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }

    // Хеширование пароля
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 12); // Увеличиваем rounds для большей безопасности
    } catch (hashError) {
      console.error("Ошибка хеширования пароля:", hashError);
      return next(ApiError.internal("Ошибка при обработке пароля"));
    }

    // Создание пользователя
    let user;
    try {
      user = await User.create({
        email: email.toLowerCase().trim(), // Нормализуем email
        userType,
        username: username.trim(), // Убираем лишние пробелы
        avatar: avatarImage,
        password: hashPassword,
      });
    } catch (createError) {
      console.error("Ошибка создания пользователя:", createError);

      // Обрабатываем специфичные ошибки Sequelize
      if (createError.name === "SequelizeValidationError") {
        const errors = createError.errors.map((err) => err.message).join(", ");
        return next(ApiError.badRequest(`Ошибки валидации: ${errors}`));
      }

      if (createError.name === "SequelizeUniqueConstraintError") {
        return next(
          ApiError.badRequest("Пользователь с такими данными уже существует")
        );
      }

      return next(ApiError.internal("Ошибка при создании пользователя"));
    }

    // Логирование успешной регистрации
    console.log(
      `Новый пользователь зарегистрирован: ${user.email} (ID: ${user.id})`
    );

    // Успешный ответ
    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatar,
        isPro: user.userType === "pro",
        createdAt: user.createdAt,
        hasCustomAvatar: req.file ? true : false, // Указываем, загрузил ли пользователь свой аватар
      },
    });
  } catch (error) {
    // Логирование неожиданных ошибок
    console.error("Неожиданная ошибка в registration:", error);

    // Не раскрываем детали внутренних ошибок пользователю
    next(ApiError.internal("Внутренняя ошибка сервера при регистрации"));
  }
};

// Функция для получения информации о пользователе
export const getUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return next(ApiError.badRequest("Некорректный ID пользователя"));
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Исключаем пароль из ответа
    });

    if (!user) {
      return next(ApiError.badRequest("Пользователь не найден"));
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatar,
        isPro: user.userType === "pro",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        hasCustomAvatar: user.avatar !== getDefaultAvatar(),
      },
    });
  } catch (error) {
    console.error("Ошибка получения информации о пользователе:", error);
    next(ApiError.internal("Ошибка при получении данных пользователя"));
  }
};

// Функция авторизации пользователя
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return next(ApiError.badRequest("Пользователь не найден"));

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return next(ApiError.badRequest("Неверный пароль"));

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    next(ApiError.internal("Ошибка авторизации"));
  }
};

// Функция проверки статуса аутентификации
export const checkAuth = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      userType: user.userType,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isPro: user.userType === "pro",
    token,
  });
};

// Функция выхода пользователя
export const logout = (req, res) => {
  // Так как токен не хранится на сервере, просто возвращаем успешный ответ
  // Удаление токена будет производиться на клиенте
  res.json({ message: "Вы успешно вышли из системы" });
};
