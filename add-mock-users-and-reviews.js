import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "http://localhost:5000/api";

// Mock users data
const mockUsers = [
  {
    username: "Emma Thompson",
    email: "emma.thompson@email.com",
    password: "testpass1",
    userType: "normal",
    avatarFile: "emma.jpg",
  },
  {
    username: "James Wilson",
    email: "james.wilson@email.com",
    password: "testpass2",
    userType: "pro",
    avatarFile: "james.jpg",
  },
  {
    username: "Sophia Garcia",
    email: "sophia.garcia@email.com",
    password: "testpass3",
    userType: "normal",
    avatarFile: "sophia.jpg",
  },
  {
    username: "Oliver Brown",
    email: "oliver.brown@email.com",
    password: "testpass4",
    userType: "pro",
    avatarFile: "oliver.jpg",
  },
  {
    username: "Charlotte Davis",
    email: "charlotte.davis@email.com",
    password: "testpass5",
    userType: "normal",
    avatarFile: "charlotte.jpg",
  },
  {
    username: "William Miller",
    email: "william.miller@email.com",
    password: "testpass6",
    userType: "normal",
    avatarFile: "william.jpg",
  },
  {
    username: "Amelia Anderson",
    email: "amelia.anderson@email.com",
    password: "testpass7",
    userType: "pro",
    avatarFile: "amelia.jpg",
  },
  {
    username: "Benjamin Martinez",
    email: "benjamin.martinez@email.com",
    password: "testpass8",
    userType: "normal",
    avatarFile: "benjamin.jpg",
  },
];

// Mock reviews for different offers
const mockReviews = [
  // Reviews for various offers (will be distributed across offers)
  {
    comment:
      "Absolutely fantastic stay! The location is perfect and the host was incredibly welcoming. The apartment was clean, modern, and had everything we needed for our week-long visit.",
    rating: 5,
  },
  {
    comment:
      "Good value for money. The place was comfortable and had nice amenities. The neighborhood is quiet and safe, perfect for families.",
    rating: 4,
  },
  {
    comment:
      "Amazing experience! The view from the balcony was breathtaking. Would definitely recommend this place to anyone visiting the city.",
    rating: 5,
  },
  {
    comment:
      "Decent accommodation with good transport links. The kitchen was well-equipped and the bed was comfortable. Some minor issues with heating but overall positive.",
    rating: 4,
  },
  {
    comment:
      "Outstanding hospitality! The host went above and beyond to make our stay memorable. The property exceeded all our expectations.",
    rating: 5,
  },
  {
    comment:
      "Clean and cozy place in a great location. Easy access to tourist attractions and restaurants. The Wi-Fi was fast and reliable for remote work.",
    rating: 4,
  },
  {
    comment:
      "Lovely apartment with unique character and charm. The neighborhood has great cafes and shops. Perfect for a romantic getaway.",
    rating: 5,
  },
  {
    comment:
      "Good facilities and helpful host. The place was exactly as described in the photos. Minor noise from the street but not too disruptive.",
    rating: 4,
  },
  {
    comment:
      "Exceptional stay! The apartment was stylish and comfortable. Great communication from the host and seamless check-in process.",
    rating: 5,
  },
  {
    comment:
      "Nice place with good amenities. The location is convenient for exploring the city. Would consider staying here again on future visits.",
    rating: 4,
  },
  {
    comment:
      "Perfect for our city break! The apartment was spotlessly clean and the host provided excellent local recommendations. Highly recommended!",
    rating: 5,
  },
  {
    comment:
      "Comfortable and well-maintained property. Great value considering the prime location. The kitchen had everything needed for cooking.",
    rating: 4,
  },
  {
    comment:
      "Incredible experience from start to finish! The property has so much character and the host was extremely helpful throughout our stay.",
    rating: 5,
  },
  {
    comment:
      "Good option for short stays. The place was clean and functional. Some wear and tear visible but nothing that affected our comfort.",
    rating: 4,
  },
  {
    comment:
      "Beautiful space with excellent attention to detail. The location couldn't be better for exploring local attractions and dining options.",
    rating: 5,
  },
  {
    comment:
      "Solid choice for accommodation. Everything worked well and the neighborhood felt safe. Good public transport connections nearby.",
    rating: 4,
  },
  {
    comment:
      "Absolutely loved our stay! The property has a wonderful atmosphere and the host's recommendations made our trip extra special.",
    rating: 5,
  },
  {
    comment:
      "Pleasant stay with no major issues. The apartment was clean and comfortable. Good value for the price point in this area.",
    rating: 4,
  },
  {
    comment:
      "Fantastic location and beautiful property! Everything was perfect from the comfortable beds to the well-equipped kitchen. Can't wait to return!",
    rating: 5,
  },
  {
    comment:
      "Good accommodation with reliable amenities. The host was responsive and helpful. Minor suggestions for improvement but overall satisfied.",
    rating: 4,
  },
];

// Function to create a user with avatar
async function createUserWithAvatar(userData) {
  try {
    console.log(`👤 Creating user: ${userData.username}...`);

    const form = new FormData();
    form.append("username", userData.username);
    form.append("email", userData.email);
    form.append("password", userData.password);
    form.append("userType", userData.userType);

    // Path to avatar images folder (you need to create this folder and put avatar images there)
    const avatarsPath = path.join(__dirname, "mock-avatars");
    const avatarPath = path.join(avatarsPath, userData.avatarFile);

    console.log(`🖼️ Looking for avatar: ${avatarPath}`);

    // Check if avatar file exists
    if (fs.existsSync(avatarPath)) {
      console.log(`✅ Found avatar: ${userData.avatarFile}`);
      form.append("avatar", fs.createReadStream(avatarPath));
    } else {
      console.log(`❌ Avatar not found: ${userData.avatarFile}, using default`);
      // If avatar not found, proceed without it (will use default)
    }

    const response = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: {
        ...form.getHeaders(),
      },
      body: form,
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Created user: ${userData.username}`);
      return data.user;
    } else if (response.status === 400) {
      const errorData = await response.json();
      if (
        errorData.message.includes("уже существует") ||
        errorData.message.includes("already exists")
      ) {
        console.log(`ℹ️ User ${userData.username} already exists`);
        return null; // User already exists
      }
      throw new Error(`User creation failed: ${errorData.message}`);
    } else {
      const errorText = await response.text();
      throw new Error(
        `User creation failed: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error(
      `❌ Failed to create user ${userData.username}:`,
      error.message
    );
    return null;
  }
}

// Function to get auth token for a user
async function getUserAuthToken(email, password) {
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();
    return { token: data.token, user: data.user };
  } catch (error) {
    console.error(`Failed to get auth token for ${email}:`, error.message);
    throw error;
  }
}

// Function to get all available offers
async function getAvailableOffers() {
  try {
    const response = await fetch(`${API_BASE}/offers`);

    if (!response.ok) {
      throw new Error(`Failed to fetch offers: ${response.status}`);
    }

    const offers = await response.json();
    console.log(`📋 Found ${offers.length} offers available for reviews`);
    return offers;
  } catch (error) {
    console.error("Failed to fetch offers:", error.message);
    throw error;
  }
}

// Function to create a review
async function createReview(offerId, reviewData, token) {
  try {
    const response = await fetch(`${API_BASE}/reviews/${offerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create review: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(
      `❌ Failed to create review for offer ${offerId}:`,
      error.message
    );
    throw error;
  }
}

// Function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Main function
async function main() {
  try {
    console.log("🚀 Starting mock users and reviews creation...");

    // Create avatar folder info
    const avatarsPath = path.join(__dirname, "mock-avatars");
    console.log(`📁 Please create folder: ${avatarsPath}`);
    console.log(
      `📁 And put avatar images there with names: ${mockUsers
        .map((u) => u.avatarFile)
        .join(", ")}`
    );

    if (!fs.existsSync(avatarsPath)) {
      console.log(`⚠️ Avatar folder not found. Creating it now...`);
      fs.mkdirSync(avatarsPath, { recursive: true });
      console.log(`✅ Created folder: ${avatarsPath}`);
      console.log(
        `📝 Please add avatar images to this folder before running the script again.`
      );
    }

    // Create mock users
    console.log("\n👥 Creating mock users...");
    const createdUsers = [];

    for (const userData of mockUsers) {
      const user = await createUserWithAvatar(userData);
      if (user) {
        createdUsers.push({
          ...user,
          password: userData.password, // Keep password for login
        });
      }
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`✅ Created ${createdUsers.length} users successfully!`);

    // Get available offers
    console.log("\n📋 Fetching available offers...");
    const offers = await getAvailableOffers();

    if (offers.length === 0) {
      console.log(
        "⚠️ No offers found. Please run add-test-data.js first to create offers."
      );
      return;
    }

    // Create reviews
    console.log("\n💬 Creating reviews...");
    let reviewCount = 0;

    // Shuffle both users and reviews for randomness
    const shuffledUsers = shuffleArray(createdUsers);
    const shuffledReviews = shuffleArray(mockReviews);

    // Distribute reviews across offers
    for (
      let i = 0;
      i < offers.length && reviewCount < mockReviews.length;
      i++
    ) {
      const offer = offers[i];

      // Random number of reviews per offer (1-3)
      const reviewsPerOffer = Math.floor(Math.random() * 3) + 1;

      for (
        let j = 0;
        j < reviewsPerOffer && reviewCount < mockReviews.length;
        j++
      ) {
        const user = shuffledUsers[reviewCount % shuffledUsers.length];
        const reviewData = shuffledReviews[reviewCount];

        try {
          // Get auth token for the user
          const { token } = await getUserAuthToken(user.email, user.password);

          // Create review
          await createReview(offer.id, reviewData, token);
          console.log(
            `✅ Created review for offer "${offer.title}" by ${user.username}`
          );

          reviewCount++;

          // Small delay between requests
          await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (error) {
          console.error(
            `❌ Failed to create review for offer ${offer.id}:`,
            error.message
          );
        }
      }
    }

    console.log(`\n🎉 Successfully created ${reviewCount} reviews!`);
    console.log("✅ Mock users and reviews creation completed!");
  } catch (error) {
    console.error("💥 Failed to create mock data:", error);
    process.exit(1);
  }
}

// Run the script
main();
