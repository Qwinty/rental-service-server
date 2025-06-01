import { Offer } from "../models/offer.js";

// Получение всех предложений
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json(offers);
  } catch (error) {
    console.error("Ошибка при получении предложений:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
