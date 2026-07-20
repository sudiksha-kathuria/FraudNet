# FraudNet - Citizen Fraud Shield

An AI-powered fraud detection platform that helps citizens identify scams, phishing attempts, and fraudulent messages in real-time.

Built for the **ET AI Hackathon 2024**.

## Overview

FraudNet provides an intuitive interface for analyzing suspicious messages and screenshots, monitoring fraud trends across categories, and generating formal complaint reports ready for filing with law enforcement or consumer protection agencies.

## Features

- **Multi-Agent AI Analyzer** - Suspicious messages go through 4 sequential AI agents: Evidence Extraction, Fraud Classification, Risk Assessment, and Citizen Advisory (powered by Groq llama-3.3-70b-versatile).
- **Risk Scoring & Red Flag Detection** - Precise 1-100 risk score and highlighted fraud indicators.
- **Community Pattern Badges** - Automatically alerts if the same scam type is spiking across the network (e.g. "Seen 14 times this week").
- **Dashboard & India Heatmap** - Real-time vigilance overview with a live geographic fraud heatmap, daily trend line charts, and active case distributions.
- **Live Threat Ticker** - Real-time animated ticker showing the last 20 fraud cases reported across the platform.
- **NCRP Complaint Stepper** - Auto-generated formal complaint summaries with an interactive 3-step filing guide ready for cybercrime.gov.in.
- **QuickScan Deep Linking** - Shareable `/scan?text=` links for seamless integration with WhatsApp or SMS forwarding.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios (API-ready) |
| Charts & Heatmap | Recharts |
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
    │   ├── Footer.jsx          # Shared footer
    │   ├── AgentThinking.jsx   # Accordion showing the 4-agent AI reasoning
    │   ├── IndiaHeatmap.jsx    # Recharts-based geographic fraud spread
    │   ├── TrendChart.jsx      # Daily case volume line chart
    │   ├── LiveFeed.jsx        # Real-time threat ticker
    │   ├── PatternBadge.jsx    # Community "seen X times" alert badge
    │   └── NCRPStepper.jsx     # 3-step complaint filing wizard
    ├── pages/
    │   ├── Home.jsx            # Landing page with hero + feature grid
    │   ├── Analyzer.jsx        # Text + image fraud analysis
    │   ├── Dashboard.jsx       # Vigilance overview + stats + charts
    │   ├── Report.jsx          # Formal complaint report generator
    │   ├── QuickScan.jsx       # WhatsApp deep-link handler
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
| `POST` | `/analyze-text` | Run multi-agent pipeline on a text message |
| `POST` | `/analyze-image` | Run OCR and multi-agent pipeline on screenshot |
| `GET` | `/dashboard` | Fetch dashboard stats and trends |
| `GET` | `/live-feed` | Fetch the last 20 cases for the real-time ticker |
| `GET` | `/heatmap` | Fetch scam counts per Indian state |
| `GET` | `/pattern-count` | Fetch occurrences of a specific scam type in last 7 days |
| `GET` | `/check-url` | Scan a URL using VirusTotal |
| `POST` | `/generate-report` | Generate a formal NCRP complaint by analysis ID |

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
