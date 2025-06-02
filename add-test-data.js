import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "http://localhost:5000/api";

// Функция для создания тестового пользователя
async function createTestUser() {
  try {
    console.log("👤 Creating test user...");
    const response = await fetch(`${API_BASE}/users/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testuser@email.com",
        password: "testuser1",
        username: "Test User",
        userType: "normal",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Test user created successfully");
      return data;
    } else if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.message.includes("уже существует")) {
        console.log("ℹ️ Test user already exists");
        return null; // Пользователь уже существует
      }
      throw new Error(`Registration failed: ${errorData.message}`);
    } else {
      throw new Error(`Registration failed: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Failed to create test user:", error.message);
    // Не бросаем ошибку, так как пользователь может уже существовать
    return null;
  }
}

// Тестовые данные для предложений - по 3-4 для каждого города
const testOffers = [
  // PARIS (4 предложения)
  {
    title: "Luxury apartment with Eiffel Tower view",
    description:
      "Stunning luxury apartment in the heart of Paris with breathtaking views of the Eiffel Tower. Modern amenities, elegant French décor, and prime location near Champs-Élysées.",
    city: "Paris",
    type: "apartment",
    price: 280,
    rooms: 3,
    guests: 6,
    latitude: 48.8566,
    longitude: 2.3522,
    isPremium: true,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Air conditioning",
      "Balcony",
      "TV",
      "Dishwasher",
    ],
    imageFiles: [
      "paris_luxury_apartment_1.jpg",
      "paris_luxury_apartment_2.jpg",
      "paris_luxury_apartment_3.jpg",
      "paris_luxury_apartment_4.jpg",
    ],
  },
  {
    title: "Charming Montmartre studio",
    description:
      "Cozy studio in the artistic Montmartre district. Perfect for couples seeking authentic Parisian experience with cobblestone streets and local cafés nearby.",
    city: "Paris",
    type: "apartment",
    price: 150,
    rooms: 1,
    guests: 2,
    latitude: 48.8867,
    longitude: 2.3431,
    isPremium: false,
    features: ["Wi-Fi", "Kitchen", "Heating", "TV"],
    imageFiles: [
      "paris_montmartre_studio_1.jpg",
      "paris_montmartre_studio_2.jpg",
      "paris_montmartre_studio_3.jpg",
      "paris_montmartre_studio_4.jpg",
    ],
  },
  {
    title: "Industrial chic loft in Le Marais",
    description:
      "Modern loft in trendy Le Marais district with high ceilings, exposed brick walls, and contemporary design. Walking distance to museums and galleries.",
    city: "Paris",
    type: "apartment",
    price: 220,
    rooms: 2,
    guests: 4,
    latitude: 48.8566,
    longitude: 2.3614,
    isPremium: true,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Washing machine",
      "Heating",
      "TV",
      "Microwave",
    ],
    imageFiles: [
      "paris_chic_loft_1.jpg",
      "paris_chic_loft_2.jpg",
      "paris_chic_loft_3.jpg",
      "paris_chic_loft_4.jpg",
    ],
  },
  {
    title: "Classic Parisian room near Louvre",
    description:
      "Elegant room in classic Haussmann building near the Louvre Museum. Traditional French décor with modern comforts and excellent transport connections.",
    city: "Paris",
    type: "room",
    price: 95,
    rooms: 1,
    guests: 2,
    latitude: 48.8606,
    longitude: 2.3376,
    isPremium: false,
    features: ["Wi-Fi", "Shared kitchen", "Heating", "TV"],
    imageFiles: [
      "paris_classic_room_1.jpg",
      "paris_classic_room_2.jpg",
      "paris_classic_room_3.jpg",
      "paris_classic_room_4.jpg",
    ],
  },

  // AMSTERDAM (4 предложения)
  {
    title: "Historic canal house apartment",
    description:
      "Beautiful apartment in authentic 17th-century canal house. Large windows overlooking peaceful canal with traditional Dutch architecture and modern amenities.",
    city: "Amsterdam",
    type: "apartment",
    price: 180,
    rooms: 2,
    guests: 4,
    latitude: 52.3676,
    longitude: 4.9041,
    isPremium: true,
    features: ["Wi-Fi", "Kitchen", "Washing machine", "Heating", "TV"],
    imageFiles: [
      "amsterdam_canal_house_1.jpg",
      "amsterdam_canal_house_2.jpg",
      "amsterdam_canal_house_3.jpg",
      "amsterdam_canal_house_4.jpg",
    ],
  },
  {
    title: "Modern apartment in Jordaan district",
    description:
      "Contemporary apartment in the charming Jordaan neighborhood. Stylish interior with canal views, close to Anne Frank House and local markets.",
    city: "Amsterdam",
    type: "apartment",
    price: 160,
    rooms: 2,
    guests: 3,
    latitude: 52.3758,
    longitude: 4.8833,
    isPremium: false,
    features: ["Wi-Fi", "Kitchen", "Heating", "Balcony", "TV", "Microwave"],
    imageFiles: [
      "amsterdam_modern_apartment_1.jpg",
      "amsterdam_modern_apartment_2.jpg",
      "amsterdam_modern_apartment_3.jpg",
      "amsterdam_modern_apartment_4.jpg",
    ],
  },
  {
    title: "Cozy room in historic building",
    description:
      "Authentic room in historic Amsterdam building with original features. Perfect for budget travelers wanting to experience real Dutch hospitality.",
    city: "Amsterdam",
    type: "room",
    price: 85,
    rooms: 1,
    guests: 2,
    latitude: 52.3702,
    longitude: 4.8952,
    isPremium: false,
    features: ["Wi-Fi", "Shared kitchen", "Heating"],
    imageFiles: [
      "amsterdam_historic_room_1.jpg",
      "amsterdam_historic_room_2.jpg",
      "amsterdam_historic_room_3.jpg",
      "amsterdam_historic_room_4.jpg",
    ],
  },
  {
    title: "Unique houseboat experience",
    description:
      "Stay on a traditional Dutch houseboat with all modern comforts. Unique floating accommodation with stunning water views and peaceful atmosphere.",
    city: "Amsterdam",
    type: "house",
    price: 200,
    rooms: 2,
    guests: 4,
    latitude: 52.3738,
    longitude: 4.891,
    isPremium: true,
    features: ["Wi-Fi", "Kitchen", "Heating", "TV", "Balcony"],
    imageFiles: [
      "amsterdam_houseboat_1.jpg",
      "amsterdam_houseboat_2.jpg",
      "amsterdam_houseboat_3.jpg",
      "amsterdam_houseboat_4.jpg",
    ],
  },

  // BRUSSELS (3 предложения)
  {
    title: "Elegant apartment near Grand Place",
    description:
      "Sophisticated apartment steps away from the magnificent Grand Place. Belgian charm meets modern comfort in the heart of Europe's capital.",
    city: "Brussels",
    type: "apartment",
    price: 170,
    rooms: 2,
    guests: 4,
    latitude: 50.8476,
    longitude: 4.3572,
    isPremium: true,
    features: ["Wi-Fi", "Kitchen", "Heating", "TV", "Dishwasher"],
    imageFiles: [
      "brussels_grand_place_apartment_1.jpg",
      "brussels_grand_place_apartment_2.jpg",
      "brussels_grand_place_apartment_3.jpg",
      "brussels_grand_place_apartment_4.jpg",
    ],
  },
  {
    title: "Contemporary loft in EU quarter",
    description:
      "Modern loft in the European Quarter with sleek design and excellent transport links. Perfect for business travelers and city explorers.",
    city: "Brussels",
    type: "apartment",
    price: 140,
    rooms: 1,
    guests: 2,
    latitude: 50.8415,
    longitude: 4.3801,
    isPremium: false,
    features: ["Wi-Fi", "Kitchen", "Washing machine", "Heating", "TV"],
    imageFiles: [
      "brussels_modern_loft_1.jpg",
      "brussels_modern_loft_2.jpg",
      "brussels_modern_loft_3.jpg",
      "brussels_modern_loft_4.jpg",
    ],
  },
  {
    title: "Charming townhouse in Ixelles",
    description:
      "Traditional Belgian townhouse in vibrant Ixelles district. Authentic local experience with easy access to museums, restaurants, and nightlife.",
    city: "Brussels",
    type: "house",
    price: 190,
    rooms: 3,
    guests: 5,
    latitude: 50.8263,
    longitude: 4.3668,
    isPremium: false,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Washing machine",
      "Heating",
      "TV",
      "Parking",
    ],
    imageFiles: [
      "brussels_cozy_townhouse_1.jpg",
      "brussels_cozy_townhouse_2.jpg",
      "brussels_cozy_townhouse_3.jpg",
      "brussels_cozy_townhouse_4.jpg",
    ],
  },

  // HAMBURG (3 предложения)
  {
    title: "Harbor view apartment in HafenCity",
    description:
      "Modern apartment with spectacular harbor views in Hamburg's newest district. Watch ships come and go while enjoying luxury amenities and waterfront location.",
    city: "Hamburg",
    type: "apartment",
    price: 200,
    rooms: 2,
    guests: 4,
    latitude: 53.5411,
    longitude: 9.9937,
    isPremium: true,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Washing machine",
      "Heating",
      "Balcony",
      "TV",
    ],
    imageFiles: [
      "hamburg_harbor_apartment_1.jpg",
      "hamburg_harbor_apartment_2.jpg",
      "hamburg_harbor_apartment_3.jpg",
      "hamburg_harbor_apartment_4.jpg",
    ],
  },
  {
    title: "Industrial loft in Speicherstadt",
    description:
      "Converted warehouse loft in UNESCO World Heritage Speicherstadt. Unique industrial architecture with modern comforts and historic canal views.",
    city: "Hamburg",
    type: "apartment",
    price: 165,
    rooms: 2,
    guests: 3,
    latitude: 53.5438,
    longitude: 9.9988,
    isPremium: false,
    features: ["Wi-Fi", "Kitchen", "Heating", "TV", "Microwave"],
    imageFiles: [
      "hamburg_warehouse_loft_1.jpg",
      "hamburg_warehouse_loft_2.jpg",
      "hamburg_warehouse_loft_3.jpg",
      "hamburg_warehouse_loft_4.jpg",
    ],
  },
  {
    title: "Cozy studio near Reeperbahn",
    description:
      "Comfortable studio in St. Pauli district, walking distance to famous Reeperbahn entertainment area. Perfect base for exploring Hamburg's nightlife and culture.",
    city: "Hamburg",
    type: "apartment",
    price: 120,
    rooms: 1,
    guests: 2,
    latitude: 53.5496,
    longitude: 9.9599,
    isPremium: false,
    features: ["Wi-Fi", "Kitchen", "Heating", "TV"],
    imageFiles: [
      "hamburg_speicherstadt_studio_1.jpg",
      "hamburg_speicherstadt_studio_2.jpg",
      "hamburg_speicherstadt_studio_3.jpg",
      "hamburg_speicherstadt_studio_4.jpg",
    ],
  },

  // COLOGNE (3 предложения)
  {
    title: "Cathedral view apartment in Old Town",
    description:
      "Stunning apartment with direct views of Cologne Cathedral. Located in the historic center with easy access to museums, shopping, and Rhine river walks.",
    city: "Cologne",
    type: "apartment",
    price: 185,
    rooms: 2,
    guests: 4,
    latitude: 50.9375,
    longitude: 6.9603,
    isPremium: true,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Washing machine",
      "Heating",
      "Balcony",
      "TV",
    ],
    imageFiles: [
      "cologne_cathedral_view_1.jpg",
      "cologne_cathedral_view_2.jpg",
      "cologne_cathedral_view_3.jpg",
      "cologne_cathedral_view_4.jpg",
    ],
  },
  {
    title: "Medieval charm room in Altstadt",
    description:
      "Authentic room in medieval old town with original architecture. Experience Cologne's 2000-year history while enjoying modern amenities and cobblestone charm.",
    city: "Cologne",
    type: "room",
    price: 75,
    rooms: 1,
    guests: 2,
    latitude: 50.9364,
    longitude: 6.9581,
    isPremium: false,
    features: ["Wi-Fi", "Shared kitchen", "Heating"],
    imageFiles: [
      "cologne_old_town_room_1.jpg",
      "cologne_old_town_room_2.jpg",
      "cologne_old_town_room_3.jpg",
      "cologne_old_town_room_4.jpg",
    ],
  },
  {
    title: "Modern loft near Rhine river",
    description:
      "Contemporary loft with panoramic Rhine river views. Minimalist design with high-end amenities in trendy Rheinauhafen district.",
    city: "Cologne",
    type: "apartment",
    price: 155,
    rooms: 2,
    guests: 3,
    latitude: 50.928,
    longitude: 6.9625,
    isPremium: false,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Washing machine",
      "Heating",
      "TV",
      "Balcony",
    ],
    imageFiles: [
      "cologne_rhine_loft_1.jpg",
      "cologne_rhine_loft_2.jpg",
      "cologne_rhine_loft_3.jpg",
      "cologne_rhine_loft_4.jpg",
    ],
  },

  // DUSSELDORF (3 предложения)
  {
    title: "Ultra-modern apartment in Medienhafen",
    description:
      "Luxurious apartment in Düsseldorf's futuristic Medienhafen district. Cutting-edge architecture, high-end amenities, and proximity to fashion boutiques.",
    city: "Dusseldorf",
    type: "apartment",
    price: 250,
    rooms: 2,
    guests: 4,
    latitude: 51.2155,
    longitude: 6.7621,
    isPremium: true,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Air conditioning",
      "Washing machine",
      "Balcony",
      "TV",
      "Dishwasher",
    ],
    imageFiles: [
      "dusseldorf_medienhafen_apartment_1.jpg",
      "dusseldorf_medienhafen_apartment_2.jpg",
      "dusseldorf_medienhafen_apartment_3.jpg",
      "dusseldorf_medienhafen_apartment_4.jpg",
    ],
  },
  {
    title: "Charming studio in Altstadt",
    description:
      "Cozy studio in Düsseldorf's longest bar in the world - the historic Altstadt. Traditional Rhineland atmosphere with modern comforts and brewery culture.",
    city: "Dusseldorf",
    type: "apartment",
    price: 130,
    rooms: 1,
    guests: 2,
    latitude: 51.2254,
    longitude: 6.7763,
    isPremium: false,
    features: ["Wi-Fi", "Kitchen", "Heating", "TV"],
    imageFiles: [
      "dusseldorf_altstadt_studio_1.jpg",
      "dusseldorf_altstadt_studio_2.jpg",
      "dusseldorf_altstadt_studio_3.jpg",
      "dusseldorf_altstadt_studio_4.jpg",
    ],
  },
  {
    title: "Executive suite in business district",
    description:
      "Premium business suite in Düsseldorf's financial district. Perfect for business travelers with luxury amenities, city views, and excellent transport connections.",
    city: "Dusseldorf",
    type: "apartment",
    price: 195,
    rooms: 2,
    guests: 3,
    latitude: 51.2206,
    longitude: 6.7942,
    isPremium: true,
    features: [
      "Wi-Fi",
      "Kitchen",
      "Air conditioning",
      "TV",
      "Dishwasher",
      "Iron",
    ],
    imageFiles: [
      "dusseldorf_business_suite_1.jpg",
      "dusseldorf_business_suite_2.jpg",
      "dusseldorf_business_suite_3.jpg",
      "dusseldorf_business_suite_4.jpg",
    ],
  },
];

// Функция для получения токена авторизации
async function getAuthToken() {
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testuser@email.com",
        password: "testuser1",
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔍 Login response data:", JSON.stringify(data, null, 2));

    if (!data.user || !data.user.id) {
      throw new Error("User ID not found in login response");
    }

    console.log(`✅ User ID found: ${data.user.id}`);
    return { token: data.token, user: data.user };
  } catch (error) {
    console.error("Failed to get auth token:", error);
    throw error;
  }
}

// Функция для создания предложения с изображениями
async function createOfferWithImages(offerData, token, userId) {
  try {
    console.log(
      `🔍 Creating offer with userId: ${userId} (type: ${typeof userId})`
    );

    const form = new FormData();

    // Добавляем основные данные
    form.append("title", offerData.title);
    form.append("description", offerData.description);
    form.append("city", offerData.city);
    form.append("type", offerData.type);
    form.append("price", offerData.price.toString());
    form.append("rooms", offerData.rooms.toString());
    form.append("guests", offerData.guests.toString());
    form.append("latitude", offerData.latitude.toString());
    form.append("longitude", offerData.longitude.toString());
    form.append("isPremium", offerData.isPremium.toString());
    form.append("isFavorite", "false");
    form.append("rating", "4.5");
    form.append("features", JSON.stringify(offerData.features));
    form.append("userId", userId.toString());

    console.log(`✅ Added userId to form: ${userId.toString()}`);

    // Путь к изображениям в клиентской части
    const clientImagesPath = path.join(
      __dirname,
      "../client/public/generated_img"
    );
    console.log(`📂 Looking for images in: ${clientImagesPath}`);

    // Проверяем существование папки с изображениями
    if (!fs.existsSync(clientImagesPath)) {
      console.log(`❌ Images directory not found: ${clientImagesPath}`);
    } else {
      // Добавляем превью изображение (первое из списка)
      const previewImagePath = path.join(
        clientImagesPath,
        offerData.imageFiles[0]
      );
      console.log(`🖼️ Looking for preview image: ${previewImagePath}`);

      if (fs.existsSync(previewImagePath)) {
        console.log(`✅ Found preview image: ${offerData.imageFiles[0]}`);
        form.append("previewImage", fs.createReadStream(previewImagePath));
      } else {
        console.log(`❌ Preview image not found: ${offerData.imageFiles[0]}`);
        // Список доступных файлов
        const availableFiles = fs
          .readdirSync(clientImagesPath)
          .filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));
        console.log(`📋 Available image files:`, availableFiles);

        if (availableFiles.length > 0) {
          const fallbackImage = path.join(clientImagesPath, availableFiles[0]);
          console.log(`🔄 Using fallback image: ${availableFiles[0]}`);
          form.append("previewImage", fs.createReadStream(fallbackImage));
        }
      }

      // Добавляем дополнительные изображения
      offerData.imageFiles.forEach((imageFile) => {
        const imagePath = path.join(clientImagesPath, imageFile);
        if (fs.existsSync(imagePath)) {
          console.log(`✅ Found additional image: ${imageFile}`);
          form.append("photos", fs.createReadStream(imagePath));
        } else {
          console.log(`❌ Additional image not found: ${imageFile}`);
        }
      });
    }

    console.log(`🚀 Sending request to create offer: ${offerData.title}`);
    const response = await fetch(`${API_BASE}/offers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create offer: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log(`✅ Created offer: ${offerData.title}`);
    return result;
  } catch (error) {
    console.error(
      `❌ Failed to create offer ${offerData.title}:`,
      error.message
    );
    throw error;
  }
}

// Основная функция
async function main() {
  try {
    console.log("🚀 Starting test data creation...");

    // Создаем тестового пользователя (если не существует)
    await createTestUser();

    // Получаем токен авторизации
    console.log("🔐 Getting auth token...");
    const { token, user } = await getAuthToken();
    console.log(`✅ Authenticated as user: ${user.email} (ID: ${user.id})`);

    // Создаем каждое предложение
    console.log("📝 Creating offers...");
    for (const offerData of testOffers) {
      await createOfferWithImages(offerData, token, user.id);
      // Небольшая пауза между запросами
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("🎉 All test offers created successfully!");
  } catch (error) {
    console.error("💥 Failed to create test data:", error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
