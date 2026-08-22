# YouTube Clone — Backend API

A REST API backend that replicates core YouTube functionality — user auth, video uploads, playlists, subscriptions, comments, likes, and community tweets — built with **Node.js**, **Express**, and **MongoDB**.

## Features

- **Authentication** — Register/login with hashed passwords (bcrypt), JWT access + refresh tokens, secure httpOnly cookies
- **User Profile** — Update account details & password, upload avatar/cover image (Cloudinary), view channel profile & watch history
- **Videos** — Upload video + thumbnail, fetch, update, delete, toggle publish status, list all videos
- **Playlists** — Create, update, delete, add/remove videos, fetch by user or playlist ID
- **Subscriptions** — Subscribe/unsubscribe toggle, list subscribers, list subscribed channels
- **Comments** — Add, update, delete, fetch comments on a video
- **Tweets** — Community-style short posts: create, update, delete, search
- **Healthcheck** — Simple endpoint to verify the API is alive

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (`jsonwebtoken`), `bcrypt` |
| File Storage | Multer (local temp) → Cloudinary |
| Pagination | `mongoose-aggregate-paginate-v2` |
| Dev tooling | Nodemon, dotenv, cors, cookie-parser |

## Project Structure

```
youtube-clone/
├── public/
│   └── temp/                 # Temporary local storage before Cloudinary upload
├── src/
│   ├── controllers/          # Request handlers (business logic)
│   ├── db/                   # MongoDB connection
│   ├── middleware/            # Auth (JWT) & Multer middleware
│   ├── models/                # Mongoose schemas (user, video, playlist, etc.)
│   ├── route/                 # Express routers
│   ├── utils/                  # ApiError, ApiResponse, asyncHandler, Cloudinary helper
│   ├── app.js                  # Express app & route mounting
│   ├── constants.js            # DB name constant
│   └── index.js                # Entry point
├── .env.sample
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account (for media uploads)

### Installation

```bash
git clone https://github.com/Inayat-dev/youtube-clone.git
cd youtube-clone
npm install
```

### Environment Variables

Copy `.env.sample` to `.env` and fill in your own values:

```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_URI=your_mongodb_connection_uri
ORIGIN=*
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=7d
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### Run the Server

```bash
npm run dev
```

The server starts on **`http://localhost:4500`**.

## Author

**Inayat** ([@Inayat-dev](https://github.com/Inayat-dev))

## License

ISC
