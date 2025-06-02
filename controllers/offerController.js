import { Offer, User, Favorite } from "../models/associations.js";
import { Op } from "sequelize";
import ApiError from "../error/ApiError.js";
import {
  adaptOfferToClient,
  adaptFullOfferToClient,
} from "../adapters/offerAdapter.js";

// Получение всех предложений
export const getAllOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll();
    let favoriteOfferIds = [];
    if (req.user && req.user.id) {
      const userFavorites = await Favorite.findAll({
        where: { userId: req.user.id },
        attributes: ["offerId"],
      });
      favoriteOfferIds = userFavorites.map((fav) => fav.offerId);
    }

    const adaptedOffers = offers.map((offer) => {
      const offerData = adaptOfferToClient(offer);
      offerData.isFavorite = favoriteOfferIds.includes(offer.id);
      return offerData;
    });
    res.json(adaptedOffers);
  } catch (error) {
    console.error("Ошибка при получении предложений:", error);
    next(
      ApiError.internal(
        "Ошибка сервера при получении предложений: " + error.message
      )
    );
  }
};

// Получение полной информации о предложении
export const getFullOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id, {
      include: { model: User, as: "author" },
    });

    if (!offer) {
      return next(ApiError.badRequest("Offer not found"));
    }

    let isFavorite = false;
    if (req.user && req.user.id) {
      const favorite = await Favorite.findOne({
        where: { userId: req.user.id, offerId: offer.id },
      });
      isFavorite = !!favorite;
    }

    const adaptedOffer = adaptFullOfferToClient(offer, offer.author);
    adaptedOffer.isFavorite = isFavorite;
    res.json(adaptedOffer);
  } catch (error) {
    next(
      ApiError.internal("Ошибка при получении предложения: " + error.message)
    );
  }
};

// Создание нового предложения
export async function createOffer(req, res, next) {
  try {
    const {
      title,
      description,
      city,
      isPremium,
      rating,
      type,
      rooms,
      guests,
      price,
      features,
      latitude,
      longitude,
    } = req.body;

    if (!req.user || !req.user.id) {
      return next(
        ApiError.unauthorized("User not authenticated for creating offer")
      );
    }

    if (!req.files?.previewImage || req.files.previewImage.length === 0) {
      return next(
        ApiError.badRequest("Превью изображение обязательно для загрузки")
      );
    }

    const previewImagePath = `/static/${req.files.previewImage[0].filename}`;

    let processedPhotos = [];
    if (req.files?.photos) {
      processedPhotos = req.files.photos.map(
        (file) => `/static/${file.filename}`
      );
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures =
          typeof features === "string" ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = features.split(",");
      }
    }

    const offer = await Offer.create({
      title,
      description,
      city,
      previewImage: previewImagePath,
      photos: processedPhotos,
      isPremium,
      rating,
      type,
      rooms,
      guests,
      price,
      features: parsedFeatures,
      latitude,
      longitude,
      authorId: req.user.id,
    });

    const adaptedOffer = adaptFullOfferToClient(offer, req.user);
    res.status(201).json(adaptedOffer);
  } catch (error) {
    next(
      ApiError.internal("Не удалось добавить предложение: " + error.message)
    );
  }
}

// Получение списка избранных предложений (для текущего пользователя)
export const getFavoriteOffers = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }

    const userWithFavorites = await User.findByPk(req.user.id, {
      include: {
        model: Offer,
        as: "favoriteOffers",
        include: { model: User, as: "author" },
      },
    });

    if (!userWithFavorites || !userWithFavorites.favoriteOffers) {
      return res.json([]);
    }

    const adaptedOffers = userWithFavorites.favoriteOffers.map((offer) => {
      const offerData = adaptOfferToClient(offer);
      offerData.isFavorite = true;
      return offerData;
    });

    res.json(adaptedOffers);
  } catch (error) {
    next(
      ApiError.internal(
        "Ошибка при получении избранных предложений: " + error.message
      )
    );
  }
};

// Добавление предложения в избранное
export const addFavorite = async (req, res, next) => {
  try {
    const { offerId } = req.params;
    if (!req.user || !req.user.id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }
    const userId = req.user.id;

    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return next(ApiError.badRequest("Предложение не найдено"));
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId, offerId },
    });

    if (existingFavorite) {
      return next(ApiError.badRequest("Предложение уже в избранном"));
    }

    await Favorite.create({ userId, offerId });

    const updatedOfferData = await Offer.findByPk(offerId, {
      include: { model: User, as: "author" },
    });
    const adaptedOffer = adaptFullOfferToClient(
      updatedOfferData,
      updatedOfferData.author
    );
    adaptedOffer.isFavorite = true;

    res.status(201).json(adaptedOffer);
  } catch (error) {
    next(
      ApiError.internal("Ошибка при добавлении в избранное: " + error.message)
    );
  }
};

// Удаление предложения из избранного
export const removeFavorite = async (req, res, next) => {
  try {
    const { offerId } = req.params;
    if (!req.user || !req.user.id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }
    const userId = req.user.id;

    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return next(ApiError.badRequest("Предложение не найдено"));
    }

    const result = await Favorite.destroy({
      where: { userId, offerId },
    });

    if (result === 0) {
      return next(ApiError.badRequest("Предложение не найдено в избранном"));
    }

    const updatedOfferData = await Offer.findByPk(offerId, {
      include: { model: User, as: "author" },
    });
    const adaptedOffer = adaptFullOfferToClient(
      updatedOfferData,
      updatedOfferData.author
    );
    adaptedOffer.isFavorite = false;

    res.status(200).json(adaptedOffer);
  } catch (error) {
    next(
      ApiError.internal("Ошибка при удалении из избранного: " + error.message)
    );
  }
};
