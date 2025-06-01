import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";
import ApiError from "../error/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к папке для изображений
const staticDir = path.resolve(__dirname, "..", "static");
const defaultsDir = path.resolve(staticDir, "defaults");

// Создаем необходимые папки
[staticDir, defaultsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Создана папка: ${dir}`);
    } catch (error) {
      console.error(`Ошибка создания папки ${dir}:`, error);
    }
  }
});

// Функция для создания дефолтного аватара если его нет
const ensureDefaultAvatar = () => {
  const defaultAvatarPath = path.join(defaultsDir, "default-avatar.jpg");

  if (!fs.existsSync(defaultAvatarPath)) {
    console.log(
      "⚠️  Внимание: Поместите дефолтное изображение аватара (200x200) в:"
    );
    console.log(`📂 ${defaultAvatarPath}`);
    console.log(
      "💡 Можете использовать любое изображение в формате JPG/PNG размером 200x200 пикселей"
    );

    // Создаем временную заглушку (опционально)
    try {
      const placeholderText =
        "Default avatar placeholder - replace with actual image";
      fs.writeFileSync(defaultAvatarPath + ".txt", placeholderText);
    } catch (error) {
      console.error("Ошибка создания заглушки:", error);
    }
  }
};

// Проверяем наличие дефолтного аватара при загрузке модуля
ensureDefaultAvatar();

// Фильтр файлов - только изображения
const fileFilter = (req, file, cb) => {
  // Проверяем MIME тип
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Неподдерживаемый тип файла: ${file.mimetype}. Допустимы: JPEG, PNG, GIF, WebP`
      ),
      false
    );
  }
};

// Настройка хранилища файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Проверяем существование папки
    if (!fs.existsSync(staticDir)) {
      try {
        fs.mkdirSync(staticDir, { recursive: true });
      } catch (error) {
        console.error("Ошибка создания папки static:", error);
        return cb(new ApiError(500, "Ошибка создания папки для файлов"), null);
      }
    }
    cb(null, staticDir);
  },
  filename: (req, file, cb) => {
    try {
      // Получаем расширение файла
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";

      // Проверяем допустимые расширения
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      if (!allowedExtensions.includes(ext)) {
        return cb(
          new ApiError(400, `Недопустимое расширение файла: ${ext}`),
          null
        );
      }

      // Генерируем уникальное имя файла
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, uniqueName);
    } catch (error) {
      console.error("Ошибка генерации имени файла:", error);
      cb(new ApiError(500, "Ошибка обработки файла"), null);
    }
  },
});

// Конфигурация multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум
    files: 10, // максимум 10 файлов
    fieldSize: 1024 * 1024, // 1MB для полей формы
  },
});

// Middleware для обработки ошибок multer (обновленный для необязательных файлов)
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return next(
          ApiError.badRequest("Размер файла превышает допустимый лимит (5MB)")
        );
      case "LIMIT_FILE_COUNT":
        return next(
          ApiError.badRequest(
            "Превышено допустимое количество файлов (максимум 10)"
          )
        );
      case "LIMIT_FIELD_VALUE":
        return next(ApiError.badRequest("Размер поля формы слишком большой"));
      case "LIMIT_UNEXPECTED_FILE":
        return next(ApiError.badRequest("Неожиданное поле файла"));
      case "MISSING_FIELD_NAME":
        return next(ApiError.badRequest("Отсутствует имя поля файла"));
      default:
        return next(
          ApiError.badRequest(`Ошибка загрузки файла: ${err.message}`)
        );
    }
  }

  if (err instanceof ApiError) {
    return next(err);
  }

  // Логируем неизвестные ошибки
  console.error("Неизвестная ошибка при загрузке файла:", err);
  return next(ApiError.internal("Ошибка обработки файла"));
};

// Функция для безопасного удаления файла
export const safeDeleteFile = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`Файл удален: ${filepath}`);
    }
  } catch (error) {
    console.error(`Ошибка удаления файла ${filepath}:`, error);
  }
};

// Middleware для проверки наличия дефолтного аватара
export const checkDefaultAvatar = (req, res, next) => {
  ensureDefaultAvatar();
  next();
};

export default upload;
