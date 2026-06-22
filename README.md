# FraudNet - Citizen Fraud Shield

An AI-powered fraud detection platform that helps citizens identify scams, phishing attempts, and fraudulent messages in real-time.

Built for the **ET AI Hackathon 2024**.

## Overview

FraudNet provides an intuitive interface for analyzing suspicious messages and screenshots, monitoring fraud trends across categories, and generating formal complaint reports ready for filing with law enforcement or consumer protection agencies.

## Features

- **Fraud Analyzer** - Paste suspicious SMS, emails, or chat logs and upload screenshots for AI-powered forensic analysis
- **Risk Scoring** - 1 to 10 risk score with four levels: Low, Medium, High, and Critical
- **Red Flag Detection** - Highlights specific fraud indicators within the content
- **Dashboard** - Real-time vigilance overview with scam category distribution, critical case counts, and recent analyses
- **Complaint Reports** - Auto-generated formal complaint summaries with evidence logs, confidence scores, and security context
- **Contact and Support** - Built-in support form with response-time tiers for critical security events

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios (API-ready) |
| Styling | Plain CSS (no UI library) |

## Project Structure

```
citizen-fraud-shield/
├── public/
└── src/
    ├── components/
    │   ├── Navbar.jsx          # Top navigation bar
    │   ├── Sidebar.jsx         # Left sidebar (inner pages)
    │   ├── SidebarLayout.jsx   # Layout wrapper with sidebar + outlet
    │   └── Footer.jsx          # Shared footer
    ├── pages/
    │   ├── Home.jsx            # Landing page with hero + feature grid
    │   ├── Analyzer.jsx        # Text + image fraud analysis
    │   ├── Dashboard.jsx       # Vigilance overview + stats
    │   ├── Report.jsx          # Formal complaint report generator
    │   └── Contact.jsx         # Contact and support form
    ├── routes/
    │   └── AppRoutes.jsx       # Route definitions
    ├── services/
    │   └── api.js              # Axios API client (backend-ready)
    └── App.jsx
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/sudiksha-kathuria/FraudNet.git
cd FraudNet

# Switch to the dev branch
git checkout dev

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL to your backend URL in .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:8000` |

## API Endpoints (Backend Contract)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze-text` | Analyze a suspicious text message |
| `POST` | `/analyze-image` | Analyze an uploaded screenshot |
| `GET` | `/dashboard` | Fetch dashboard stats and recent analyses |
| `POST` | `/generate-report` | Generate a formal complaint report by analysis ID |

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Stable base - README only |
| `dev` | Active development - all source code |

## Pages

| Route | Page |
|-------|------|
| `/` | Home - hero, features, stats |
| `/analyzer` | Fraud Analyzer - text + image input |
| `/dashboard` | Dashboard - vigilance overview |
| `/report` | Report Generator - formal complaint output |
| `/contact` | Contact Us - support form |
