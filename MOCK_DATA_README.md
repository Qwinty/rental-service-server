# Mock Users and Reviews Script

This document explains how to use the `add-mock-users-and-reviews.js` script to populate your database with mock users (with avatars) and reviews for existing offers.

## Prerequisites

1. **Server must be running** on `http://localhost:5000`
2. **Database must be set up** and connected
3. **Offers must exist** (run `add-test-data.js` first to create test offers)

## Setup Avatar Images

### Step 1: Create the avatars folder

The script will automatically create the folder `rental-service/server/mock-avatars/` if it doesn't exist.

### Step 2: Add avatar images

Place avatar images in the `mock-avatars` folder with these exact names:

- `emma.jpg` - Avatar for Emma Thompson
- `james.jpg` - Avatar for James Wilson  
- `sophia.jpg` - Avatar for Sophia Garcia
- `oliver.jpg` - Avatar for Oliver Brown
- `charlotte.jpg` - Avatar for Charlotte Davis
- `william.jpg` - Avatar for William Miller
- `amelia.jpg` - Avatar for Amelia Anderson
- `benjamin.jpg` - Avatar for Benjamin Martinez

### Step 3: Image requirements

- **Formats**: JPG, PNG, GIF
- **Max size**: 5MB per image
- **Recommended**: 300x300px or similar square aspect ratio for avatars

## Running the Script

```bash
# Navigate to the server directory
cd rental-service/server

# Run the script
node add-mock-users-and-reviews.js
```

## What the Script Does

### Creates 8 Mock Users

- **4 Normal users** (Emma, Sophia, Charlotte, William)
- **4 Pro users** (James, Oliver, Amelia, Benjamin)
- Each user gets a unique email, password, and avatar
- Users are created via the `/users/register` API endpoint

### Creates Mock Reviews

- **20 different review texts** with ratings 4-5
- Reviews are distributed randomly across existing offers
- Each offer gets 1-3 reviews randomly
- Reviews are created by the mock users via the `/reviews/:offerId` API endpoint

## User Credentials

After running the script, you can log in as any of these users:

| Username | Email | Password | Type |
|----------|--------|----------|------|
| Emma Thompson | <emma.thompson@email.com> | testpass1 | normal |
| James Wilson | <james.wilson@email.com> | testpass2 | pro |
| Sophia Garcia | <sophia.garcia@email.com> | testpass3 | normal |
| Oliver Brown | <oliver.brown@email.com> | testpass4 | pro |
| Charlotte Davis | <charlotte.davis@email.com> | testpass5 | normal |
| William Miller | <william.miller@email.com> | testpass6 | normal |
| Amelia Anderson | <amelia.anderson@email.com> | testpass7 | pro |
| Benjamin Martinez | <benjamin.martinez@email.com> | testpass8 | normal |

## Troubleshooting

### Script says "No offers found"

- Run `add-test-data.js` first to create test offers
- Make sure your server is running and database is connected

### Avatar images not loading

- Check that images are in the correct folder: `rental-service/server/mock-avatars/`
- Verify image names match exactly (case-sensitive)
- Check image formats are supported (JPG, PNG, GIF)
- Ensure images are under 5MB

### Users already exist

- The script will skip existing users and continue
- This is normal behavior if you've run the script before

### Reviews creation fails

- Make sure offers exist in the database
- Check that the review comment length meets requirements (40-1024 characters)
- Verify server is running and accessible

## Database Verification

You can verify the data was created by checking the database:

```sql
-- Check users
SELECT id, username, email, "userType", avatar FROM users;

-- Check reviews with user info
SELECT r.id, r.text, r.rating, r."publishDate", u.username, o.title 
FROM reviews r 
JOIN users u ON r."authorId" = u.id 
JOIN offers o ON r."OfferId" = o.id;
```

## File Structure

```
rental-service/server/
├── add-mock-users-and-reviews.js  # Main script
├── mock-avatars/                  # Avatar images folder
│   ├── emma.jpg
│   ├── james.jpg
│   ├── sophia.jpg
│   ├── oliver.jpg
│   ├── charlotte.jpg
│   ├── william.jpg
│   ├── amelia.jpg
│   └── benjamin.jpg
└── MOCK_DATA_README.md           # This file
```

## Notes

- The script includes delays between API calls to avoid overwhelming the server
- Users and reviews are created in random order for more realistic data distribution
- If avatar files are missing, users will be created with default avatars
- All passwords follow the same pattern: `testpass[1-8]` for easy testing
