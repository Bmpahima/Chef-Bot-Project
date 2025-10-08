# 🍳 ChefBot — Smart Recipe Platform (React + Node.js + MongoDB Atlas)

Generate, manage, and share recipes powered by AI. Users can upload an ingredients photo or type ingredients/intents; ChefBot creates a tailored recipe. Includes secure auth, full CRUD, and a responsive UI. The app is fully Dockerized for easy local runs.

---

## 🌟 Overview

ChefBot is a full-stack web application for intelligent recipe creation and management.

- **Frontend:** React
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
## 🧪 How to Run

## 📦 Prerequisites

- Node.js & npm
  
## ▶️ Run Backend (without Docker)

```bash
cd app/backend
cp .env.example .env         # fill real values (no quotes)
npm install
npm start                    # or: npm run dev
# → http://localhost:8000
```

## ▶️ Run Frontend (without Docker)

```bash
cd ../frontend
cp .env.example .env         # set API base (e.g., http://localhost:8000)
npm install
npm run dev                  # e.g., http://localhost:5173 or 3000
```

---

## 🐳 Run Backend (Docker)

```bash
cd ../backend
docker build -t chefbot-backend:latest .
docker run --name cb-backend -d --env-file ./.env -p 8000:8000 chefbot-backend
# → http://localhost:8000
```

# 🐳 Run Frontend (Docker)
```bash
cd ../frontend
docker build -t chefbot-frontend:latest .
docker run --name cb-frontend -d --env-file ./.env -it -p 3000:3000 chefbot-frontend
# → http://localhost:3000
```

## 🧩 Run Both with Docker Compose (from project root)

```bash
cd ..
docker compose up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Stop:
# docker compose down
```

## 📊 Tech Stack

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=ffffff)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=ffffff)
![MongoDB%20Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=ffffff)
![JWT](https://img.shields.io/badge/JSON%20Web%20Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=ffffff)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=ffffff)
![SendGrid](https://img.shields.io/badge/SendGrid-1A82E2?style=for-the-badge&logo=sendgrid&logoColor=ffffff)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=ffffff)
![Docker%20Compose](https://img.shields.io/badge/Docker%20Compose-384d54?style=for-the-badge&logo=docker&logoColor=ffffff)

