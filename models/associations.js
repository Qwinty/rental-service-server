import { User } from "./user.js";
import { Offer } from "./offer.js";
import { Favorite } from "./favorite.js";

// Set up associations after all models are defined to avoid circular dependencies

// User -> Offer (author relationship)
User.hasMany(Offer, { as: "authoredOffers", foreignKey: "authorId" });
Offer.belongsTo(User, { as: "author", foreignKey: "authorId" });

// User <-> Offer (favorites many-to-many relationship through Favorite)
User.belongsToMany(Offer, {
  through: Favorite,
  as: "favoriteOffers",
  foreignKey: "userId",
  otherKey: "offerId",
});

Offer.belongsToMany(User, {
  through: Favorite,
  as: "favoritedByUsers",
  foreignKey: "offerId",
  otherKey: "userId",
});

// Direct associations with Favorite junction table
User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

Offer.hasMany(Favorite, { foreignKey: "offerId" });
Favorite.belongsTo(Offer, { foreignKey: "offerId" });

export { User, Offer, Favorite };
