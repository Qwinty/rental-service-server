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
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return next(ApiError.badRequest("Рейтинг должен быть числом от 1 до 5"));
    }
    if (
      typeof comment !== "string" ||
      comment.length < 40 ||
      comment.length > 1024
    ) {
      // Example length constraints
      return next(
        ApiError.badRequest(
          "Комментарий должен быть строкой от 40 до 1024 символов"
        )
      );
    }

    const createdReview = await Review.create({
      text: comment,
      rating,
      publishDate: new Date(),
      authorId: userId,
      OfferId: parseInt(offerId, 10), // Ensure offerId is an integer
    });

    // Fetch the created review along with its author to ensure all data is present for adaptation
    const newReviewWithAuthor = await Review.findByPk(createdReview.id, {
      include: [
        {
          model: User,
          as: "author", // This alias must match the one used in adaptReviewToClient if it expects review.author
          attributes: ["id", "username", "avatar", "userType"],
        },
      ],
    });

    if (!newReviewWithAuthor) {
      return next(
        ApiError.internal("Не удалось получить созданный отзыв для адаптации")
      );
    }

    const adaptedReview = adaptReviewToClient(newReviewWithAuthor);

    console.log("Отзыв создан и адаптирован успешно:", adaptedReview);

    res.status(201).json(adaptedReview); // Send the adapted review directly
  } catch (error) {
    console.error("=== Ошибка при добавлении отзыва ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Check for Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message).join(", ");
      return next(ApiError.badRequest(`Ошибки валидации: ${errors}`));
    }
    // Check for foreign key constraint errors (e.g., invalid offerId or userId)
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return next(
        ApiError.badRequest(
          "Некорректный ID пользователя или предложения. Убедитесь, что они существуют."
        )
      );
    }
    // Catch errors if offerId is not a valid number for parseInt
    if (error instanceof TypeError && error.message.includes("parseInt")) {
      return next(ApiError.badRequest("ID предложения должен быть числом."));
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
      order: [["publishDate", "DESC"]], // Sort reviews by date, newest first
    });

    console.log(`Найдено отзывов: ${reviews.length}`);
    // console.log(
    //   "Отзывы (raw):",
    //   reviews.map((r) => r.toJSON())
    // );

    const adaptedReviews = reviews.map((review) => adaptReviewToClient(review));
    // console.log("Отзывы (adapted):", adaptedReviews);

    res.json(adaptedReviews);
  } catch (error) {
    console.error("=== Ошибка при получении отзывов ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    if (error.name === "SequelizeEagerLoadingError") {
      return next(
        ApiError.internal(
          "Ошибка загрузки связанных данных (пользователи) при получении отзывов"
        )
      );
    }

    next(ApiError.internal(`Ошибка при получении отзывов: ${error.message}`));
  }
};

export { addReview, getReviewsByOfferId };
