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

The build includes `public/.htaccess` for Apache hosting and also creates
physical `default.htm`, `admin/index.html`, and `admin/default.htm` files after
build so `/` and `/admin` work on IIS-style hosting without SPA rewrites.

Add these GitHub repository secrets before using it:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`
- `FTP_PORT` (optional, defaults to `21`)

## GitHub Lightsail Backend Deploy

This repo now also includes `.github/workflows/deploy-lightsail-backend.yml` for the Node/Express backend.

On every push to `master`, it will:

1. Package the backend files from this repo
2. Upload them to your AWS Lightsail server over SSH
3. Write the production `.env` file from a GitHub secret
4. Run `npm ci --omit=dev` on the Lightsail instance
5. Restart the backend with `pm2`

Add these GitHub repository secrets before using it:

- `LIGHTSAIL_HOST`
- `LIGHTSAIL_USERNAME`
- `LIGHTSAIL_SSH_KEY`
- `LIGHTSAIL_ENV_FILE`
- `LIGHTSAIL_PORT` (optional, defaults to `22`)
- `LIGHTSAIL_APP_DIR` (optional, defaults to `/home/ubuntu/storybookholidays-backend`)
- `LIGHTSAIL_PROCESS_NAME` (optional, defaults to `storybookholidays-backend`)

`LIGHTSAIL_ENV_FILE` should contain the full backend `.env` contents, for example:

```env
PORT=5001
MONGODB_URI=your-mongodb-connection-string
CLIENT_ORIGIN=https://your-frontend-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-this
ADMIN_TOKEN_SECRET=replace-with-a-long-random-secret
```

One-time setup on the Lightsail server:

1. Install Node.js and npm
2. Make sure the SSH user from `LIGHTSAIL_USERNAME` can write to `LIGHTSAIL_APP_DIR`
3. Allow your backend port in the Lightsail firewall, or put the app behind Nginx
4. For automatic restarts after a full server reboot, install PM2 globally once and enable startup:

```bash
npm install -g pm2
pm2 startup
```

### `npm run build`

Builds the frontend for production.

### `npm test`

Runs the frontend test suite.
