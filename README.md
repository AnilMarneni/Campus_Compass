# CampusCompass 🎓

### Production-Grade College Discovery & Comparison Platform

CampusCompass is a modern full-stack web application that helps students discover, evaluate, compare, and shortlist colleges across India using verified academic, placement, fee, and institutional data.

Built with a production-oriented architecture using Next.js 15, TypeScript, Prisma 7, Neon PostgreSQL, and Tailwind CSS, the platform delivers a fast, responsive, and data-driven college exploration experience.

---

## ✨ Features

### 🔍 Smart College Discovery

* Search colleges by name, location, course, or institution type
* Dynamic filtering system
* Real-time debounced search
* Fast server-side rendered listings
* Clean card-based browsing experience

### 📊 Detailed College Profiles

Each college profile includes:

* Institution overview
* Fees & tuition information
* Placement statistics
* Highest and average salary packages
* Establishment details
* Campus size
* Student & faculty counts
* Accreditation & NAAC grades
* Recruiter information
* Student reviews

### ⚖️ Side-by-Side College Comparison

Compare up to 3 colleges simultaneously.

Comparison metrics include:

* Annual fees
* Ratings
* Placement rate
* Average package
* Highest package
* Establishment year
* Student count
* Accreditation

Best values are automatically highlighted for faster decision-making.

### ❤️ Saved Colleges Dashboard

Authenticated users can:

* Save favorite colleges
* Manage bookmarks
* Track shortlisted institutions

### 👤 Authentication System

* Secure email/password authentication
* Password hashing with bcrypt
* Session management using NextAuth
* Protected dashboard routes

### 📈 Data Transparency

The platform emphasizes transparency by displaying:

* Placement reporting year
* Placement data sources
* Institutional metadata
* NIRF-related reference information

---

# 🏗️ System Architecture

```text
┌─────────────────────────┐
│       Next.js 15        │
│      App Router         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Server Components (SSR) │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│      API Layer          │
│   Zod Validations       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│      Prisma ORM         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Neon PostgreSQL DB    │
└─────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Lucide React

## Backend

* Next.js Route Handlers
* Prisma 7
* Neon PostgreSQL
* Zod

## Authentication

* NextAuth.js
* bcryptjs

## Database

* PostgreSQL
* Prisma ORM

## Deployment Ready

* Vercel
* Neon Database
* Server Components
* Dynamic Rendering

---

# 📂 Project Structure

```text
campus-compass/
│
├── app/
│   ├── colleges/
│   ├── compare/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   └── api/
│
├── components/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── scripts/
│   ├── generate-data.ts
│   ├── import-nirf.ts
│   ├── enrich-colleges.ts
│   └── data/
│
└── public/
```

---

# 🗄️ Database Models

### User

Stores registered user accounts.

### College

Stores institutional data:

* Fees
* Ratings
* Placements
* NIRF metadata
* Campus details

### Course

Courses offered by each college.

### Recruiter

Top hiring companies.

### Review

Student-generated reviews and ratings.

### SavedCollege

Bookmarks created by users.

---

# 📥 Data Pipeline

CampusCompass uses a two-stage ingestion pipeline.

## Stage 1 — Import Core Data

```bash
npm run import:nirf
```

Imports:

* College records
* Institution metadata
* NIRF-related information

---

## Stage 2 — Enrichment

```bash
npm run enrich:colleges
```

Adds:

* Placement statistics
* Recruiters
* Courses
* Reviews
* Extended institutional data

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/campus-compass.git

cd campus-compass
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```bash
.env
```

Add:

```env
DATABASE_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000
```

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Run Database Migration

```bash
npx prisma db push
```

---

## 6. Seed College Data

```bash
npm run import:nirf

npm run enrich:colleges
```

---

## 7. Start Development Server

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

# 🔐 Demo Credentials

```text
Email:
aditya@example.com

Password:
admin123
```

---

# 🎯 Use Cases

### Students

* Discover colleges
* Compare institutions
* Analyze placements
* Evaluate affordability

### Parents

* Research institutions
* Compare ROI
* Understand placement outcomes

### Career Counselors

* Recommend colleges
* Create comparison reports
* Guide admission decisions

---

# 🌟 Key Highlights

✅ Full-stack TypeScript architecture

✅ Server-side rendering for SEO

✅ PostgreSQL production database

✅ Prisma ORM integration

✅ Secure authentication system

✅ Dynamic comparison engine

✅ College bookmarking system

✅ Structured data ingestion pipeline

✅ Responsive modern UI

✅ Production-ready SaaS architecture

---

# 🔮 Future Enhancements

* AI-powered college recommendations
* Predictive admission chances
* Scholarship discovery engine
* Cutoff and entrance exam analytics
* College review verification
* Alumni networking
* Real-time placement dashboards
* Personalized student profiles

---

# 🤖 AI Integration Opportunities (Gemma)

CampusCompass can leverage Google's Gemma models to provide intelligent student assistance:

### Smart College Advisor

Recommend colleges based on:

* Rank
* Budget
* Location
* Career goals

### College Comparison Summaries

Generate natural-language insights from comparison data.

### Placement Analysis

Explain placement trends and recruiter patterns.

### Student Q&A Assistant

Answer college-related questions using platform data.

### Admission Guidance

Provide personalized application roadmaps.

---

# 📄 License

This project is intended for educational, portfolio, hackathon, and learning purposes.

---

### Built with ❤️ using Next.js, Prisma, PostgreSQL, and TypeScript.
