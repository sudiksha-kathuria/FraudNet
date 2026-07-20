# Citizen Fraud Shield - Architecture & System Design

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                                 │
│                       localhost:5173                                     │
│  ┌─────────────┬──────────────┬──────────────┬──────────────────────┐   │
│  │ Home Page   │ Analyzer     │ Dashboard    │ Report & Contact     │   │
│  │             │ (Text/Image) │ (Stats)      │ Pages                │   │
│  └──────────┬──┴──────────┬───┴──────────┬───┴──────────────────────┘   │
│             │             │              │                               │
│             └─────────────┼──────────────┴────────────────────────────┐  │
│                           │                                           │  │
└───────────────────────────┼───────────────────────────────────────────┼──┘
                            │ HTTP/JSON                                 │
                            │ (CORS Enabled)                            │
                            ▼                                           │
┌─────────────────────────────────────────────────────────────────────┐│
│                    Flask Backend                                    ││
│                  localhost:8000                                     ││
│  ┌──────────────────────────────────────────────────────────────┐  ││
│  │  API Routes Layer                                            │  ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │  ││
│  │  │ /api/analyze │  │ /api/analyze │  │ /api/generate- │   │  ││
│  │  │     -text    │  │    -image    │  │     report     │   │  ││
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘   │  ││
│  │         │                │                    │             │  ││
│  │  ┌──────▼────────────────▼──────────────────┐ │             │  ││
│  │  │ /api/dashboard  │ /api/get-analysis/<id>│ │             │  ││
│  │  └────────────────────────────────────────┘ │             │  ││
│  └──────────────────┬─────────────────────────┬┘             │  ││
│  ┌──────────────────▼──────────────────────────────────────┐  │  ││
│  │  Service Layer                                         │  │  ││
│  │  ┌────────────────┐  ┌──────────────┐  ┌────────────┐ │  │  ││
│  │  │  Groq        │  │  OCR         │  │   Fraud    │ │  │  ││
│  │  │  Service       │  │  Service     │  │  Analysis  │ │  │  ││
│  │  │  (AI Analysis) │  │(EasyOCR)     │  │  Service   │ │  │  ││
│  │  └────────────────┘  └──────────────┘  └────────────┘ │  │  ││
│  │  ┌──────────────────────────────────────────────────┐ │  │  ││
│  │  │  Report Service (NCRP Reports & Analytics)      │ │  │  ││
│  │  └──────────────────────────────────────────────────┘ │  │  ││
│  └──────────────────┬─────────────────────────────────────┘  │  ││
│  ┌──────────────────▼─────────────────────────────────────────┐  │  ││
│  │  Database Layer (SQLAlchemy ORM)                           │  │  ││
│  │  ┌────────────────────────────────────────────────────┐   │  │  ││
│  │  │ fraud_reports Table                               │   │  │  ││
│  │  │ - id, timestamp, scam_type, risk_score            │   │  │  ││
│  │  │ - extracted_text, red_flags, recommendation       │   │  │  ││
│  │  │ - evidence_extraction, status                     │   │  │  ││
│  │  └────────────────────────────────────────────────────┘   │  │  ││
│  └─────────────────────┬──────────────────────────────────────┘  │  ││
└──────────────────────┼───────────────────────────────────────────┘  │
                       │ SQLite                                        │
                       ▼                                               │
          ┌────────────────────────────┐                               │
          │  fraud_detection.db         │                              │
          │  (SQLite Database)          │                              │
          └────────────────────────────┘                               │
                       ▲                                               │
                       │ (External)                                    │
┌──────────────────────┼───────────────────────────────────────────┐  │
│  External Services   │                                           │  │
│  ┌──────────────────┴──────────────────┐                        │  │
│  │  Groq (Groq)      │                        │  │
│  │  - Multi-agent fraud analysis       │                        │  │
│  │  - Natural language processing      │                        │  │
│  └─────────────────────────────────────┘                        │  │
└─────────────────────────────────────────────────────────────────┘  │
                                                                       │
                          Configuration & Utils                       │
                          ┌──────────────────────┐                    │
                          │ .env (API keys, URLs)│                    │
                          │ config.py (Settings) │                    │
                          │ logger.py (Logging)  │                    │
                          │ validators.py (Input)│                    │
                          │ helpers.py (Utils)   │                    │
                          └──────────────────────┘                    │
                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow - Text Analysis

```
User Input (Text)
       │
       ▼
   [Validation]
   - Length check
   - Format check
       │
       ▼
   [Groq Service]
   - Multi-agent analysis
   - Extract evidence
   - Calculate risk
       │
       ▼
   [Evidence Extraction]
   - Phone numbers
   - URLs
   - UPI IDs
   - Emails
   - Organizations
       │
       ▼
   [Database Storage]
   - Save to fraud_reports
   - Return analysis ID
       │
       ▼
   [Response]
   - Risk score
   - Scam type
   - Red flags
   - Recommendations
   - Evidence
```

## Data Flow - Image Analysis

```
User Uploads Image
       │
       ▼
   [File Validation]
   - Type check (jpg, png, etc.)
   - Size check (<10MB)
       │
       ▼
   [Save to Disk]
   - uploads/ folder
   - Unique filename
       │
       ▼
   [OCR Processing]
   - EasyOCR extract text
   - Multi-language support
       │
       ▼
   [Groq Analysis]
   - Analyze extracted text
   - Calculate risk
       │
       ▼
   [Evidence Extraction]
   - From extracted text
       │
       ▼
   [Database Storage]
   - Save analysis
   - Reference image path
       │
       ▼
   [Response]
   - Extracted text
   - Analysis results
   - Evidence
```

## Multi-Agent AI Workflow

```
┌──────────────────────────────────────────────────────────────┐
│ Agent 1: Evidence Extraction                                 │
│ Input: User text                                             │
│ Output: Extracted data                                       │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ • Phone Numbers  (regex pattern matching)              │   │
│ │ • URLs           (web address extraction)              │   │
│ │ • UPI IDs        (payment ID detection)                │   │
│ │ • Emails         (email pattern detection)             │   │
│ │ • Organizations  (entity recognition)                  │   │
│ │ • Keywords       (suspicious word detection)           │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ Evidence Data
                   ▼
┌──────────────────────────────────────────────────────────────┐
│ Agent 2: Fraud Classification                                │
│ Input: Evidence + Text patterns                              │
│ Output: Scam type                                            │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Classifier checks for:                                 │   │
│ │ • Authority impersonation → Digital Arrest            │   │
│ │ • Payment requests → UPI Fraud                         │   │
│ │ • OTP requests → OTP Scam                              │   │
│ │ • Credential theft → Phishing                          │   │
│ │ • Loan offers → Loan Scam                              │   │
│ │ • Investment promises → Investment Scam                │   │
│ │ • Tech problems → Tech Support Scam                    │   │
│ │ • Prize notifications → Prize Scam                     │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ Scam Type
                   ▼
┌──────────────────────────────────────────────────────────────┐
│ Agent 3: Risk Assessment                                     │
│ Input: Scam type + Evidence + Text analysis                  │
│ Output: Risk score & level                                   │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Scoring Factors:                                       │   │
│ │ • Threat severity (urgency, threats)                   │   │
│ │ • Financial risk (amount, payment methods)             │   │
│ │ • Authority impersonation (government, banks)          │   │
│ │ • Personal info requests (SSN, credentials)            │   │
│ │ • Suspicious links/files                               │   │
│ │                                                        │   │
│ │ Result: Risk Score (0-100)                             │   │
│ │ Level: Critical/High/Medium/Low                        │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ Risk Assessment
                   ▼
┌──────────────────────────────────────────────────────────────┐
│ Agent 4: Citizen Advisory                                    │
│ Input: All previous agent outputs                            │
│ Output: Advisory & recommendations                           │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Generates:                                             │   │
│ │ • Clear explanation of fraud type                      │   │
│ │ • Why it's classified as fraud                         │   │
│ │ • Immediate actions to take                            │   │
│ │ • Preventive measures                                  │   │
│ │ • Reporting instructions:                              │   │
│ │   - NCRP (National Cyber Crime Reporting Portal)      │   │
│ │   - Local police cyber cell                            │   │
│ │   - Bank/financial institution                         │   │
│ │   - RBI (if banking fraud)                             │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────┘
                   │ Complete Analysis
                   ▼
            ┌──────────────┐
            │ Final Report │
            │   (JSON)     │
            └──────────────┘
```

## Database Schema

```
fraud_reports Table
┌─────────────────────────────────────────────────────┐
│ Field              │ Type      │ Description         │
├─────────────────────────────────────────────────────┤
│ id                 │ INTEGER   │ Primary key         │
│ timestamp          │ DATETIME  │ Creation time       │
│ input_type         │ VARCHAR   │ 'text' or 'image'   │
│ extracted_text     │ TEXT      │ User input/OCR      │
│ image_path         │ VARCHAR   │ Image file path     │
│ scam_type          │ VARCHAR   │ Classification      │
│ risk_score         │ FLOAT     │ 0-100 score         │
│ risk_level         │ VARCHAR   │ Critical/High/Mid   │
│ red_flags          │ JSON      │ Array of flags      │
│ recommendation     │ TEXT      │ Action plan         │
│ explanation        │ TEXT      │ Why it's fraud      │
│ evidence_extract   │ JSON      │ Extracted data      │
│ status             │ VARCHAR   │ 'completed'         │
└─────────────────────────────────────────────────────┘
```

## Request/Response Flow

### Text Analysis Flow

```
Frontend HTTP Request
│
├─ POST /api/analyze-text
├─ Content-Type: application/json
└─ Body: {"message": "text to analyze"}
   │
   ▼
Backend Route Handler (analysis.py)
   │
   ├─ Parse JSON
   ├─ Validate input
   ├─ Call FraudAnalysisService.analyze_text()
   │
   ├─ GroqService.analyze_for_fraud()
   │  ├─ Build prompt
   │  ├─ Call Groq API
   │  ├─ Parse response
   │  └─ Validate result
   │
   ├─ Helper.extract_evidence()
   │  ├─ Regex phone numbers
   │  ├─ Find URLs
   │  ├─ Detect UPI IDs
   │  ├─ Extract emails
   │  └─ Identify organizations
   │
   ├─ Create FraudReport model
   ├─ Save to database
   │
   └─ Return JSON Response
      │
      ├─ "id": analysis_id
      ├─ "risk_score": 95
      ├─ "risk_level": "Critical"
      ├─ "scam_type": "Digital Arrest Scam"
      ├─ "red_flags": [...]
      ├─ "explanation": "..."
      ├─ "recommendation": "..."
      └─ "evidence": {...}
         │
         ▼
    Frontend Receives Response
    │
    └─ Display results to user
```

## Service Dependencies

```
app.py (Main Entry Point)
├─ config.py (Configuration)
├─ database/__init__.py (Database Setup)
│  └─ models/fraud_report.py (Data Model)
├─ services/
│  ├─ groq_service.py (AI Analysis)
│  │  └─ google.generativeai
│  ├─ ocr_service.py (Image Processing)
│  │  └─ easyocr, PIL
│  ├─ fraud_analysis_service.py (Orchestration)
│  │  ├─ groq_service.py
│  │  ├─ ocr_service.py
│  │  ├─ models/fraud_report.py
│  │  └─ database/__init__.py
│  └─ report_service.py (Analytics)
│     └─ database/__init__.py
├─ routes/
│  ├─ analysis.py (API endpoints)
│  │  └─ All services above
│  └─ dashboard.py (Dashboard endpoint)
│     └─ report_service.py
├─ utils/
│  ├─ logger.py (Logging)
│  ├─ validators.py (Validation)
│  └─ helpers.py (Utilities)
└─ Flask-CORS (Cross-origin requests)
```

## Deployment Architecture

```
Production Deployment
┌─────────────────────────────────────┐
│ Client Browser                      │
│ (React Frontend)                    │
└──────────────┬──────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────┐
│ CDN / Web Server                    │
│ (Static files, compression)         │
└──────────────┬──────────────────────┘
               │ HTTPS / Load Balancer
               ▼
┌─────────────────────────────────────┐
│ Nginx Reverse Proxy                 │
│ (SSL termination, caching)          │
└──────────────┬──────────────────────┘
               │
               ├─ App Instance 1
               ├─ App Instance 2
               └─ App Instance 3
                  (Gunicorn/uWSGI)
                  │
                  ▼
        ┌──────────────────────┐
        │ PostgreSQL Database  │
        │ (with replicas)      │
        └──────────────────────┘
                  │
        ┌────────┴────────┐
        ▼                 ▼
   [Backups]        [Analytics]
```

## Error Handling Flow

```
Request
   │
   ├─ Input Validation Error
   │  └─ 400 Bad Request
   │     └─ "error": "validation message"
   │
   ├─ File Upload Error
   │  └─ 400 Bad Request
   │     └─ "error": "file error message"
   │
   ├─ API Analysis Error
   │  ├─ Log error
   │  ├─ Gracefully degrade
   │  └─ 200 OK (with error in response)
   │     └─ "error": "analysis failed"
   │
   ├─ Database Error
   │  └─ 500 Internal Server Error
   │     └─ "error": "server error: [message]"
   │
   └─ Not Found
      └─ 404 Not Found
         └─ "error": "resource not found"
```

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns (models, services, routes, utils)
- ✅ Scalable service layer design
- ✅ Multi-agent AI workflow simulation
- ✅ Persistent data storage
- ✅ Comprehensive error handling
- ✅ Extensible API design
- ✅ Production-ready structure

All components work together to provide a complete fraud detection system.
