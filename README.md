# 🎬 CineTrack

**CineTrack** is a movie tracking mobile application inspired by Letterboxd. It allows users to discover movies, manage their watchlist, track watched movies, and rate and review their favorite films.

## ✨ Features

- 🔐 User authentication (Register / Login)
- 🎥 Discover trending and top-rated movies
- 🔎 Search movies
- 📄 View detailed movie information
- ➕ Add movies to your Watchlist
- 👀 Track watched movies in your Diary
- ⭐ Rate movies
- 📝 Write, edit, and delete reviews
- 👤 User profile with movie statistics
- 🔄 Pull-to-refresh support

## 🛠️ Tech Stack

### Mobile Application
- React Native
- Expo
- Expo Router
- JavaScript
- Zustand
- Axios
- Expo SecureStore

### Backend
- PHP
- Laravel
- Laravel Sanctum
- MySQL
- REST API

### Movie Data
- [TMDB API](https://www.themoviedb.org/)

## 📁 Project Structure

```text
CineTrack/
├── backend/                 # Laravel REST API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
│
├── CineTrack/
│   └── mobile/              # React Native application
│       ├── src/
│       │   ├── app/
│       │   ├── services/
│       │   └── store/
│       └── ...
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nacerimohamed/CineTrack.git
cd CineTrack
```

### 2. Backend Setup

```bash
cd backend
composer install
```

Create your environment file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure your MySQL database and TMDB API key in the `.env` file.

Run database migrations:

```bash
php artisan migrate
```

Start the Laravel server:

```bash
php artisan serve --host=0.0.0.0
```

The backend will run at:

`http://localhost:8000`

### 3. Mobile Setup

Open a new terminal:

```bash
cd CineTrack/mobile
npm install
```

Configure the backend API URL in the mobile API service to use your computer's local IP address when testing on a physical device.

Start Expo:

```bash
npx expo start
```

Scan the QR code using Expo Go to run the application.

## 🔑 Environment Variables

The backend requires:

- Database configuration (`DB_*`)
- TMDB API key (`TMDB_API_KEY`)
- Other Laravel environment settings

**Important:** Never commit your `.env` file or expose your API keys.

## 📱 Application

CineTrack is developed as a mobile-first application using React Native and Expo.

## 👨‍💻 Author

**Mohamed Naceri**

- GitHub: [@nacerimohamed](https://github.com/nacerimohamed)

---

*Built with passion for movies and technology.* 🎬
