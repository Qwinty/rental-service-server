import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    // Serverless optimizations
    pool: {
      max: 2, // Reduce max connections for serverless
      min: 0, // Allow dropping to 0 connections
      acquire: 60000, // 60 seconds max time to get connection
      idle: 5000, // Close connections after 5 seconds of inactivity
      evict: 10000, // Check for idle connections every 10 seconds
    },
    // Connection retry logic
    retry: {
      max: 5, // Maximum retry attempts
      timeout: 30000, // 30 seconds timeout per retry
      match: [
        /ConnectionError/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ENOTFOUND/,
        /ENETUNREACH/,
        /connection.*refused/,
        /connection.*timed.*out/,
        /timeout/,
      ],
    },
    // Logging
    logging: process.env.NODE_ENV === "production" ? false : console.log,
    // SSL settings for Railway
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  }
);

export default sequelize;
