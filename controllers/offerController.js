import { Offer } from "../models/offer.js";
import { User } from "../models/user.js";
import ApiError from "../error/ApiError.js";
import {
  adaptOfferToClient,
  adaptFullOfferToClient,
} from "../adapters/offerAdapter.js";

// Получение всех предложений
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    const adaptedOffers = offers.map((offer) => adaptOfferToClient(offer));
    res.json(adaptedOffers);
  } catch (error) {
    console.error("Ошибка при получении предложений:", error);
    res.status(500).json({ error: "Ошибка сервера" });
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

    const adaptedOffer = adaptFullOfferToClient(offer, offer.author);
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
      publishDate,
      city,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features,
      commentsCount,
      latitude,
      longitude,
      userId,
    } = req.body;

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
      publishDate,
      city,
      previewImage: previewImagePath,
      photos: processedPhotos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features: parsedFeatures,
      commentsCount,
      latitude,
      longitude,
      authorId: userId,
    });

    return res.status(201).json(offer);
  } catch (error) {
    next(
      ApiError.internal("Не удалось добавить предложение: " + error.message)
    );
  }
}
