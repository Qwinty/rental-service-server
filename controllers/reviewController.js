import { Review } from "../models/review.js";
import { User } from "../models/user.js";
import ApiError from "../error/ApiError.js";
import { adaptReviewToClient } from "../adapters/reviewAdapter.js";

const addReview = async (req, res, next) => {
  try {
    const { comment, rating } = req.body;
    const { offerId } = req.params;
    const userId = req.user.id;

    console.log("=== Добавление отзыва ===");
    console.log("userId:", userId);
    console.log("offerId:", offerId);
    console.log("comment:", comment);
    console.log("rating:", rating);

    // Валидация данных
    if (!comment || !rating) {
      return next(ApiError.badRequest("Комментарий и рейтинг обязательны"));
    }

    if (rating < 1 || rating > 5) {
      return next(ApiError.badRequest("Рейтинг должен быть от 1 до 5"));
    }

    const review = await Review.create({
      text: comment,
      rating,
      publishDate: new Date(),
      authorId: userId,
      OfferId: offerId,
    });

    console.log("Отзыв создан успешно:", review.toJSON());

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("=== Ошибка при добавлении отзыва ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Sequelize errors:", error.errors);

    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message).join(", ");
      return next(ApiError.badRequest(`Ошибки валидации: ${errors}`));
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return next(
        ApiError.badRequest("Некорректный ID пользователя или предложения")
      );
    }

    next(ApiError.internal(`Ошибка при добавлении отзыва: ${error.message}`));
  }
};

const getReviewsByOfferId = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    console.log("=== Получение отзывов ===");
    console.log("offerId:", offerId);

    const reviews = await Review.findAll({
      where: { OfferId: offerId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "avatar", "userType"],
        },
      ],
    });

    console.log(`Найдено отзывов: ${reviews.length}`);
    console.log(
      "Отзывы:",
      reviews.map((r) => r.toJSON())
    );

    const adaptedReviews = reviews.map((review) => adaptReviewToClient(review));

    res.json(adaptedReviews);
  } catch (error) {
    console.error("=== Ошибка при получении отзывов ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Sequelize errors:", error.errors);

    if (error.name === "SequelizeEagerLoadingError") {
      return next(
        ApiError.internal("Ошибка загрузки связанных данных (пользователи)")
      );
    }

    next(ApiError.internal(`Ошибка при получении отзывов: ${error.message}`));
  }
};

export { addReview, getReviewsByOfferId };
