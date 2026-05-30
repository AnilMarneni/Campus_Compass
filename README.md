# CampusCompass 🎓
### Production-Grade College Discovery & Comparison Platform

CampusCompass is a state-of-the-art college search, filtering, comparison, and planning platform tailored for Indian higher education. Designed to simplify the search for premier institutes (IITs, NITs, BITS, VIT, IIMs, SRCC, etc.), the application delivers audited placement packages, NAAC accreditations, campus ratings, and curriculum details directly to students, parents, and academic counselors.

CampusCompass shifts college search from fragmented university disclosures and unreliable forums into a single, unified, high-performance web experience.

---

## 🏗️ System Architecture

CampusCompass uses a hybrid Server-Side Rendering (SSR) and Client-Side Hydration architecture powered by **Next.js 15 (App Router)**, **Prisma 7**, and **Neon PostgreSQL**.

### Request & Render Flow
```mermaid
sequenceDiagram
  autonumber
  actor Student as Student / Parent
  participant Client as Next.js Client Component
  participant Server as Next.js Server (RSC)
  database DB as Neon PostgreSQL (Prisma Client)

  Student->>Client: Inputs Search Keyword (e.g. "Computer Science")
  Client->>Server: Requests SSR Page (/colleges?search=Computer+Science)
  Server->>DB: Query name, location, courses, and areasOfStudy (ILIKE)
  DB-->>Server: Return matched College records with relations
  Server-->>Client: Stream fully-rendered React Server HTML (RSC)
  Client-->>Student: Renders premium responsive UI cards
```

### Relational Database Schema
```mermaid
erDiagram
  USER {
    String id PK
    String name
    String email
    String password
    String image
    DateTime createdAt
  }
  COLLEGE {
    String id PK
    String name
    String location
    String description
    String image
    Int fees
    Float rating
    Float placementRate
    Float averagePackage
    Float highestPackage
    Int establishedYear
    String ownershipType
    String campusSize
    String accreditation
    String naacGrade
    Int studentCount
    Int facultyCount
    Int nirfRank
    Float nirfScore
    String nirfCategory
    Int nirfYear
    String institutionType
    Int placementYear
    String placementSource
    String logo
    String website
    String affiliatedUniversity
    Float campusLifeRating
    String institutionOverview
    String whyChoose
    DateTime createdAt
    DateTime updatedAt
  }
  RECRUITER {
    String id PK
    String name
  }
  COURSE {
    String id PK
    String name
    String duration
    Int fees
    String collegeId FK
  }
  REVIEW {
    String id PK
    String userName
    Float rating
    String comment
    String collegeId FK
    DateTime createdAt
  }
  SAVED_COLLEGE {
    String id PK
    String userId FK
    String collegeId FK
  }
  AREA_OF_STUDY {
    String id PK
    String name
    String collegeId FK
  }

  COLLEGE ||--o{ COURSE : "offers"
  COLLEGE ||--o{ REVIEW : "has"
  COLLEGE ||--o{ SAVED_COLLEGE : "bookmarked_by"
  USER ||--o{ SAVED_COLLEGE : "bookmarks"
  COLLEGE }o--o{ RECRUITER : "hires_from"
  COLLEGE ||--o{ AREA_OF_STUDY : "teaches"
```

---

## 🌟 Key Features

### 1. Smart Multi-Factor Search & Filtering
* **Keyword Matching**: Search instantly across name, location, and description.
* **Relational Search**: Filter colleges by specific course names and areas of study (e.g. `CSE`, `AI`, `Data Science`).
* **Institution Categorization**: Narrow down lists by institution type (e.g., IIT, NIT, Central, State, Private).
* **Audit Statistics Sliders**: Filter based on annual fees or overall student ratings.

### 2. Side-by-Side Comparison Matrix
* Compare up to 3 colleges concurrently.
* **Sticky Column Headers**: College names and thumbnail logos remain anchored at the top of the viewport when scrolling vertically through extensive metrics tables.
* **Dynamic Highlight Engine**: Instantly flags the best-performing metrics (highest average package, lowest fees, highest campus life rating) in HSL-curated emerald badges.
* **Export PDF Report**: Easily generate and share structured comparative briefs.

### 3. Rich College Profiles
* **Executive Summary**: Comprehensive overviews, ownership type, campus size, and established years.
* **Placement Scorecard**: Verified placement rates, highest package, average packages, and corporate hiring lists.
* **Specialization Badges**: Standardized tags for all branches of study.
* **Official Resources Grid**: Interactive portal links (Website, Admissions Office, Digital brochure downloads).
* **Student Experience Scorecard**: Multi-metric breakdown (Academics, Faculty, Infrastructure, Placement rate, and Campus Life out of 5 stars).

### 4. Saved Colleges Dashboard
* Secure authentication pipeline (NextAuth + bcrypt session cookies).
* Dashboard for tracking, updating, and saving shortlisted institutions.

---

## 🛠️ Ingestion & Data Pipeline

CampusCompass decouples configuration metadata from database scripts to maintain high data reliability and easy data curation.

```text
scripts/
 ├── data/
 │    ├── college-metadata.json  (Websites, ratings, choose statements)
 │    ├── college-logos.json     (Audited logo URL registries)
 │    ├── college-areas.json     (Core branches & disciplines list)
```

The database is built and populated in a two-stage CLI process:

### Stage 1: Core Base Import
```bash
npm run import:nirf
```
Parses NIRF raw datasets to generate base college records, NIRF rankings, scores, category designations, and student/faculty counts.

### Stage 2: Relational Enrichment
```bash
npm run enrich:colleges
```
Loads files under `scripts/data/`, connects them to base records by matching names, and programmatically populates website links, logo paths, courses, recruiters, reviews, and linked `AreaOfStudy` rows.

---

## 🚀 Setup & Local Deployment

### 1. Prerequisites
Ensure you have Node.js (v18 or higher) and npm installed.

### 2. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/AnilMarneni/Campus_Compass.git
cd Campus_Compass
npm install
```

### 3. Environment Variables Config
Create a `.env` file in the root directory:
```env
# Neon PostgreSQL Database URI
DATABASE_URL="postgresql://user:pass@ep-hostname.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth session configuration
NEXTAUTH_SECRET="your-32-character-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Initialization & Generated Client
Since sandbox environments may block standard TCP ports (5432) for direct CLI push commands, use the WebSocket migration script to sync the DB schema:
```bash
# Push schema alterations using WebSocket driver
npx tsx scripts/push-db.ts

# Generate local Prisma Client bindings
npx prisma generate
```

### 5. Ingest Core and Enriched Data
```bash
# Seed the core records
npm run import:nirf

# Seed relational placements, courses, logo assets, and specializations
npm run enrich:colleges
```

### 6. Run the Application
```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧬 Engineering Decisions & Challenges

### Why Next.js 15 & React Server Components?
By leveraging React Server Components (RSC) for page layouts (`app/colleges/page.tsx` and `app/colleges/[id]/page.tsx`), we fetch data directly on the server. This yields near-zero client-side bundle sizes for static content, instant page loads, and native search-engine visibility (SEO metadata tags rendered natively on SSR).

### Bypassing TCP Blocks over WebSockets
In constrained server networks where outgoing TCP connections (port 5432) are blocked, the Prisma CLI (e.g. `prisma db push`) fails. To address this, we developed a WebSocket migration wrapper using `@neondatabase/serverless` and standard HTTP upgrades. The script [push-db.ts](file:///e:/Internship_Project/College_Comp/scripts/push-db.ts) sends raw SQL schema alterations over WebSockets, ensuring schema updates succeed in any host network.

### Performance Optimizations
* **Debounced API Search**: Prevents excessive API hits by debouncing key input.
* **Tail Tailwind CSS v4 Build**: Uses PostCSS compilation for light, clean utility sheets without large layout shifts.

---

### Built with ❤️ using Next.js 15, Prisma 7, PostgreSQL, and TypeScript.
