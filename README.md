# 📚 CBC Pathways

A modern platform to help students, parents, and educators navigate the **Competency-Based Curriculum (CBC)** in Kenya by discovering:

* Subject combinations
* Schools offering those combinations
* Learning pathways
* Smart recommendations based on preferences

---

## 🚀 Overview

CBC Pathways is a **decision-support system**, not just a directory.

It enables users to:

* 🔍 Search schools by subject combinations, county, cluster, gender
* 🧠 Get personalized recommendations
* 🧭 Explore learning pathways and tracks
* 📊 Understand subject combinations and career directions
* 🏫 Discover schools offering specific combinations

---

## 🏗️ Project Structure

This is a **monorepo** with the following structure:

```txt
.
├── src/              # Backend source code (Express + Prisma)
├── prisma/           # Prisma schema & migrations
├── ui/               # Frontend (Next.js + ShadCN)
├── package.json      # Backend dependencies
```

### Important

* **Root directory = Backend**
* **Frontend lives inside `/ui`**
* When deploying frontend, set **base directory to `/ui`**

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL

### Frontend

* Next.js (App Router)
* React
* ShadCN UI
* Tailwind CSS

---

## ✨ Features

### Core

* Subject combination exploration
* School discovery with filters
* Track & pathway insights
* Recommendation engine
* Combination profiles (AI-assisted + deterministic fallback)

### Advanced

* Anonymous sessions
* Human verification (Cloudflare Turnstile)
* Recommendation-aware ranking
* School profile enrichment system (queue-based)

---

## 📊 Data Overview

* Tracks: 7
* Subject combinations: 500+
* Schools: 10,000+
* Subjects: 30+

---

## 🧪 Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/cbc-pathways.git
cd cbc-pathways
```

---

### 2. Backend Setup (Root)

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/cbc
PORT=5000

# Optional AI
GEMINI_API_KEY=

# Turnstile (optional)
TURNSTILE_SECRET_KEY=
```

Run Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Start backend:

```bash
npm run dev
```

---

### 3. Frontend Setup (`/ui`)

```bash
cd ui
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

Start frontend:

```bash
npm run dev
```

---

## 🔌 API Overview

### Schools

```http
GET /api/schools
GET /api/schools/:schoolId/profile
```

### Combinations

```http
GET /api/combinations
GET /api/combinations/:id/profile
GET /api/combinations/:id/profile?generate=true
```

### Tracks

```http
GET /api/track-profiles
```

### Recommendations

```http
POST /api/recommendations
```

---

## 🔐 Security & Protection

* Anonymous sessions via secure cookies
* Cloudflare Turnstile for human verification
* Express rate limiting (configured)
* Public data (no authentication required for browsing)

---

## 🧠 AI Usage

AI is used only for:

* Generating **combination profiles** (non-factual guidance)

AI is NOT used for:

* School factual data (motto, principal, etc.)

Fallback system ensures:

```txt
The app works even without AI enabled
```

---

## 🧪 Testing

Backend:

```bash
npm run test
```

Frontend:

```bash
cd ui
npm run test
```

E2E (if configured):

```bash
cd ui
npm run test:e2e
```

---

## 🚀 Deployment Notes

### Backend

* Deploy from **root directory**
* Requires:

  * Node.js
  * PostgreSQL

### Frontend

* Deploy from **/ui directory**
* Set base directory accordingly in your hosting provider

---

## 🔄 Future Improvements

* Automated school profile enrichment
* Admin moderation dashboard
* Advanced recommendation scoring
* Full-text search (Postgres / Meilisearch)
* Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome:

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## 📄 License

MIT License

---

## 💡 Vision

To become the **default platform for educational decision-making in CBC and beyond**, helping students confidently choose their academic and career paths.

---
