# Storybook Holidays

This project includes a React frontend and a simple Node.js + Express + MongoDB API for itinerary content.

## Backend Setup

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI` with your MongoDB connection string
3. Set `CLIENT_ORIGIN` to your frontend URL. You can provide multiple origins separated by commas.
4. Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_TOKEN_SECRET`
5. Start the API with `npm run server`

The API runs on `http://localhost:5001` by default.

## Frontend Admin Setup

1. Keep `REACT_APP_API_BASE_URL=http://localhost:5001` in `.env` for local development
2. Start the React app with `npm start`
3. Open `http://localhost:3000/admin`
4. Sign in with the admin username and password from your environment file

For deployed frontend builds, the app now falls back to `https://storybookholidays.onrender.com`
when `REACT_APP_API_BASE_URL` is not explicitly set.

## Backend Endpoints

### `GET /api/health`

Checks whether the API is running.

### `POST /api/itineraries`

Creates a new itinerary.

Example payload:

```json
{
  "title": "Kerala Backwater Escape",
  "destination": "Kerala",
  "description": "A relaxed houseboat and culture trip.",
  "durationDays": 3,
  "price": 12000,
  "highlights": ["Houseboat stay", "Village walk"],
  "days": [
    {
      "dayNumber": 1,
      "title": "Arrival in Kochi",
      "description": "Airport pickup and local sightseeing",
      "activities": ["Pickup", "Fort Kochi tour"]
    },
    {
      "dayNumber": 2,
      "title": "Alleppey Houseboat",
      "description": "Board the houseboat and cruise the backwaters",
      "activities": ["Check-in", "Cruise", "Dinner on board"]
    }
  ]
}
```

### `GET /api/itineraries`

Returns all itineraries.

### `GET /api/itineraries/:id`

Returns a single itinerary by MongoDB document id.

### `GET /api/packages`

Returns all saved packages from MongoDB.

### `GET /api/packages/slug/:slug`

Returns one package by slug for the public package detail page.

### `POST /api/packages`

Creates a new package. Requires `Authorization: Bearer <token>` and accepts `multipart/form-data`.

Supported fields:

- `title`
- `slug`
- `duration`
- `shortDescription`
- `contentHtml`
- `image`

### `POST /api/admin/login`

Validates the admin username and password from the environment file and returns a bearer token.

Example payload:

```json
{
  "username": "admin",
  "password": "change-me"
}
```

### `GET /api/admin/session`

Validates the stored admin bearer token.

### `PUT /api/itineraries/:id`

Updates an itinerary. Requires `Authorization: Bearer <token>`.

### `DELETE /api/itineraries/:id`

Deletes an itinerary. Requires `Authorization: Bearer <token>`.

### `PUT /api/packages/:id`

Updates a package. Requires `Authorization: Bearer <token>` and accepts `multipart/form-data`.

### `DELETE /api/packages/:id`

Deletes a package and removes its uploaded image from the server.

## Frontend Scripts

### `npm start`

Runs the React app on `http://localhost:3000`.

The admin dashboard is available at `http://localhost:3000/admin` and now supports both itinerary management and package management with a rich text editor and image upload.

## GitHub FTP Deploy

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-ftp.yml`.

On every push to `master`, it will:

1. Install dependencies
2. Build the React app
3. Upload the generated `build/` folder to your FTP server

The build includes `public/.htaccess` for Apache hosting and also creates a
physical `admin/index.html` file after build so `/admin` works on hosting that
does not support SPA rewrites.

Add these GitHub repository secrets before using it:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`
- `FTP_PORT` (optional, defaults to `21`)

### `npm run build`

Builds the frontend for production.

### `npm test`

Runs the frontend test suite.
