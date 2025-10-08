# 🍳 ChefBot — Smart Recipe Platform (React + Node.js + MongoDB Atlas)

Generate, manage, and share recipes powered by AI. Users can upload an ingredients photo or type ingredients/intents; ChefBot creates a tailored recipe. Includes secure auth, full CRUD, and a responsive UI. The app is fully Dockerized for easy local runs.

---

## 🌟 Overview

ChefBot is a full-stack web application for intelligent recipe creation and management.

- **Frontend:** React (SPA)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (cloud)
- **AI (optional):** OpenAI for generating recipes from images/ingredients/prompts
- **Email (optional):** SendGrid for notifications
- **DevOps:** Docker & Docker Compose for consistent, reproducible environments

Core capabilities include JWT-based authentication, recipe CRUD, serving static assets under `/images`, and optional AI-assisted recipe generation. The project ships with separate containers for frontend and backend plus a Compose setup for one-command local orchestration.

---

## ✅ Features

- 🔐 **Authentication (JWT):** Register, login, and protected routes
- 🍽️ **AI-Powered Recipes (optional):** Generate recipes from an image, typed ingredients, or an intent/prompt (OpenAI)
- 📝 **Recipe Management (CRUD):** Create, view, update, and delete recipes
- 🖼️ **Static Assets:** Image hosting/serving under `/images`
- 👤 **My Recipes:** View and manage your own recipes
- 📱 **Responsive UI:** Optimized for desktop and mobile
- ✉️ **Email (optional):** SendGrid integration for notifications
- 🐳 **Containerized:** Separate Docker images for frontend and backend + Docker Compose

---

## 🛠️ Built With

- **Frontend:** React (JavaScript), Vite/CRA, CSS (Modules/vanilla)
- **Backend:** Node.js + Express, Mongoose, CORS, JSON Web Tokens (JWT)
- **Database:** MongoDB Atlas (cloud SRV connection)
- **AI (optional):** OpenAI API
- **Email (optional):** SendGrid
- **DevOps:** Docker, Docker Compose

---

# ▶️ Run Backend (without Docker)
cd app/backend
cp .env.example .env         # fill real values (no quotes)
npm install
npm start                    # or: npm run dev
# → http://localhost:8000

# ▶️ Run Frontend (without Docker)
cd ../frontend
cp .env.example .env         # set API base (e.g., http://localhost:8000)
npm install
npm run dev                  # e.g., http://localhost:5173 or 3000
# (Vite) prod-like preview:
# npm run build && npm run preview

---

# 🐳 Run Backend (Docker)
cd ../backend
docker build -t chefbot-backend:latest .
docker run --name cb-backend -d --env-file ./.env -p 8000:8000 chefbot-backend
# → http://localhost:8000

# 🐳 Run Frontend (Docker)
cd ../frontend
docker build -t chefbot-frontend:latest .
docker run --name cb-frontend -d --env-file ./.env -it -p 3000:3000 chefbot-frontend
# → http://localhost:3000

# 🧩 Run Both with Docker Compose (from project root)
cd ..
docker compose up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Stop:
# docker compose down

