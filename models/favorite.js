import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Favorite extends Model {}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    offerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "offers",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    timestamps: true, // manage createdAt and updatedAt
    updatedAt: false, // we only need createdAt for favorites
  }
);

export { Favorite };
