# ExoVision: AI-Powered Exoplanet Discovery Platform

## Project Overview

**ExoVision** is a full-stack platform that leverages artificial intelligence to automate the detection of exoplanets—planets orbiting stars outside our solar system. By analyzing astronomical data (e.g., from NASA's Kepler mission), ExoVision enables astronomers and enthusiasts to discover new worlds with speed and accuracy.

### Key Features

- **AI-Driven Exoplanet Detection:** Predicts exoplanet presence from stellar data using trained neural networks.
- **Interactive Web Interface:** Modern React-based frontend for exploring, predicting, and visualizing exoplanet data.
- **User Authentication:** Secure signup/login and personalized prediction history.
- **Prediction Management:** View and manage your previous predictions.
- **Immersive Visuals:** 3D planet scenes and animated space backgrounds.

---

## Technical Architecture

### Frontend

- **Framework:** React + TypeScript (Vite)
- **UI/UX:** Tailwind CSS, Framer Motion, Radix UI, Lucide Icons
- **State Management:** Redux Toolkit
- **API Integration:** Axios, JWT authentication
- **3D & Animation:** @react-three/fiber, drei
- **Deployment:** Vercel (CI/CD via GitHub Actions)

### Backend

- **Framework:** FastAPI (Python 3.10+)
- **AI Model:** Keras ANN trained on Kepler exoplanet dataset
- **Database:** PostgreSQL (SQLModel/SQLAlchemy)
- **Authentication:** JWT tokens, password hashing
- **Containerization:** Docker
- **Deployment:** AWS EC2 (Dockerized, behind Nginx reverse proxy, SSL via Certbot)
- **API Docs:** OpenAPI/Swagger (`/docs`)

### Machine Learning

- **Model Training:** Jupyter Notebook (`exo-model/exo.ipynb`)
- **Experiment Tracking:** MLflow
- **Model Artifacts:** Keras (`.keras`, `.h5`), Joblib, TensorFlow SavedModel

---

## Deployment Overview

### Frontend (Vercel)

- **Continuous Deployment:** On every push to `main` via GitHub Actions.
- **Production URL:** Provided by Vercel.
- **Configuration:** `vercel.json`, environment variables via Vercel dashboard.

### Backend (AWS EC2 + Docker + Nginx + Certbot)

- **Dockerized Backend:** Multi-stage Dockerfile.
- **Nginx:** Reverse proxy, SSL via Certbot.
- **Startup:** Gunicorn with Uvicorn worker for FastAPI.
- **Environment Variables:** Managed via `.env` or EC2 environment.

---

## Project Structure

```
exovision/
│
├── backend/      # FastAPI backend (Dockerized)
│   ├── app/      # Application code
│   ├── models/   # Trained ML models
│   ├── Dockerfile
│   └── ...
│
├── exo-web/      # Frontend (React + Vite + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── exo-model/    # ML experiments and notebooks
│   ├── exo.ipynb
│   ├── data/
│   ├── mlruns/
│   └── reports/
│
└── README.md
```

---

## Setup & Usage

### Backend

**Requirements:** Python 3.10+, Docker, PostgreSQL

```bash
cd backend
cp .env.example .env  # Set DB and secret keys
docker build -t exovision-backend .
docker run -d --env-file .env -p 8000:8000 exovision-backend
```

- **API Docs:** http://localhost:8000/docs

### Frontend

**Requirements:** Node.js, npm or bun

```bash
cd exo-web
npm install
npm run dev
```

- **Local URL:** http://localhost:5173

### Model Training (Optional)

```bash
cd exo-model
pip install -r requirements.txt
jupyter notebook exo.ipynb
```

---

## Deployment Details

### Frontend (Vercel)

- Push to `main` triggers GitHub Actions → Vercel build & deploy.
- Environment variables managed in Vercel dashboard.

### Backend (AWS EC2 + Docker + Nginx + Certbot)

- Backend runs in Docker container.
- Nginx reverse proxy forwards HTTPS traffic to backend.
- Certbot manages SSL certificates.
- Gunicorn serves FastAPI app with Uvicorn worker.

---

## Security & Best Practices

- Passwords hashed (bcrypt).
- JWT tokens for authentication.
- CORS enabled for frontend-backend communication.
- Environment variables for secrets and DB credentials.

---

## API Endpoints (Summary)

- `POST /auth/signup` — Register a new user
- `POST /auth/login` — Obtain JWT token
- `POST /predictions/predict` — Make a prediction
- `GET /predictions/` — List prediction history
- `GET /predictions/{prediction_id}` — Get a specific prediction
- `DELETE /predictions/{prediction_id}` — Delete a prediction

---

**ExoVision** — Exploring new worlds, one prediction at a time.