# Citizen Fraud Shield - Complete Backend Implementation

## Project Summary

A comprehensive backend for an AI-powered fraud detection system called **Citizen Fraud Shield**. The system analyzes suspicious text and images to detect fraud patterns, calculates risk scores, and generates formal complaint reports.

## What Was Built

### 1. **Core Flask Application** (`app.py`)
- Factory pattern application creation
- Environment-based configuration
- Automatic database initialization
- CORS configuration
- Error handling and logging
- Health check and root endpoints

### 2. **Database Layer** (`database/`)
- SQLAlchemy ORM integration
- Database session management
- SQLite database setup

### 3. **Data Models** (`models/`)
- **FraudReport**: Complete fraud analysis storage
  - Input data (text, image, OCR results)
  - Analysis results (scam type, risk score, red flags)
  - Evidence extraction (phones, URLs, UPIs, emails, organizations)
  - Timestamps and status tracking

### 4. **AI/ML Services** (`services/`)

#### GeminiService (`gemini_service.py`)
- Google Generative AI integration
- Multi-agent fraud analysis workflow:
  - Agent 1: Evidence Extraction (phones, URLs, UPIs, names, organizations)
  - Agent 2: Fraud Classification (Digital Arrest, UPI Fraud, OTP Scam, Phishing, Loan Scam, Investment Scam)
  - Agent 3: Risk Assessment (risk score 0-100, severity level)
  - Agent 4: Citizen Advisory (explanations, next steps, reporting)
- JSON response parsing and validation
- Error handling and fallback responses

#### OCRService (`ocr_service.py`)
- EasyOCR integration
- Multi-language support (English, Hindi)
- Image validation and preprocessing
- Text extraction from images

#### FraudAnalysisService (`fraud_analysis_service.py`)
- Orchestrates text and image analysis
- Database persistence
- Evidence extraction integration
- Complete fraud report generation

#### ReportService (`report_service.py`)
- NCRP (National Cyber Crime Reporting Platform) complaint generation
- Dashboard analytics and statistics
- Daily trend analysis
- Risk level statistics

### 5. **API Routes** (`routes/`)

#### Analysis Endpoints (`analysis.py`)
- **POST** `/api/analyze-text` - Text fraud analysis
- **POST** `/api/analyze-image` - Image fraud analysis
- **POST** `/api/generate-report` - Generate NCRP complaint
- **GET** `/api/get-analysis/<id>` - Retrieve analysis by ID

#### Dashboard Endpoints (`dashboard.py`)
- **GET** `/api/dashboard` - Fraud statistics and analytics

### 6. **Utilities** (`utils/`)

#### Logger (`logger.py`)
- Centralized logging configuration
- Daily log rotation
- File and console handlers

#### Validators (`validators.py`)
- Text input validation
- File upload validation
- Analysis ID validation

#### Helpers (`helpers.py`)
- Evidence extraction using regex patterns
- Risk level calculation
- JSON parsing utilities
- File operations

### 7. **Configuration** (`config.py`)
- Environment-based settings
- Database configuration
- API key management
- File upload limits
- CORS configuration

## File Structure

```
backend/
├── app.py                          # Main Flask application
├── config.py                       # Configuration management
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── README.md                       # API documentation
├── SETUP.md                        # Installation guide
├── run.bat                         # Windows run script
├── run.sh                          # Linux/Mac run script
├── models/
│   ├── __init__.py
│   └── fraud_report.py            # FraudReport model
├── routes/
│   ├── __init__.py
│   ├── analysis.py                # Analysis endpoints
│   └── dashboard.py               # Dashboard endpoints
├── services/
│   ├── __init__.py
│   ├── gemini_service.py          # Gemini API
│   ├── ocr_service.py             # OCR processing
│   ├── fraud_analysis_service.py  # Analysis logic
│   └── report_service.py          # Report generation
├── database/
│   └── __init__.py                # DB initialization
├── utils/
│   ├── __init__.py
│   ├── logger.py                  # Logging setup
│   ├── validators.py              # Input validation
│   └── helpers.py                 # Utility functions
├── uploads/
│   └── .gitkeep                   # Uploads directory
└── logs/                          # Application logs (created at runtime)
```

## Technology Stack

- **Framework**: Flask 3.0.0
- **Database**: SQLite with SQLAlchemy ORM
- **AI/ML**: Google Generative AI (Gemini)
- **OCR**: EasyOCR
- **Image Processing**: Pillow
- **Web Server**: Flask development server
- **CORS**: Flask-CORS
- **Environment**: python-dotenv
- **Logging**: Python logging module

## Key Features

### 1. **Multi-Agent AI Workflow**
The system simulates a multi-agent architecture using Gemini API:

```
User Input
    ↓
[Evidence Extraction Agent]
    ↓
[Fraud Classification Agent]
    ↓
[Risk Assessment Agent]
    ↓
[Citizen Advisory Agent]
    ↓
Formatted Response
```

### 2. **Fraud Detection Capabilities**
- Digital Arrest Scams
- UPI Fraud
- OTP Scams
- Phishing
- Loan Scams
- Investment Scams
- Tech Support Scams
- Prize Scams
- And more...

### 3. **Evidence Extraction**
Automatically extracts and identifies:
- Phone numbers (Indian format support)
- URLs and suspicious links
- UPI IDs
- Email addresses
- Organization names
- Suspicious keywords

### 4. **Risk Assessment**
- Risk Score: 0-100 (0 = safe, 100 = critical)
- Risk Levels:
  - **Critical** (80-100): Immediate action required
  - **High** (60-79): Strong fraud indicators
  - **Medium** (40-59): Suspicious but uncertain
  - **Low** (0-39): Minimal fraud indicators

### 5. **NCRP Complaint Generation**
Generates formal complaints with:
- Structured complaint format
- Evidence documentation
- Risk assessment summary
- Recommended actions
- Filing authority information

### 6. **Dashboard Analytics**
- Total fraud cases tracked
- Cases by risk level
- Cases by scam type
- Daily trend analysis
- Average risk score

### 7. **Database Persistence**
- Every analysis is stored
- Historical trend analysis
- Easy data export and reporting
- Audit trail

## API Endpoints

### 1. Text Analysis
```
POST /api/analyze-text
Content-Type: application/json

{
    "message": "User text to analyze"
}
```

### 2. Image Analysis
```
POST /api/analyze-image
Content-Type: multipart/form-data

image: [file]
```

### 3. Generate Report
```
POST /api/generate-report
Content-Type: application/json

{
    "analysis_id": 1
}
```

### 4. Dashboard Data
```
GET /api/dashboard
```

### 5. Get Analysis
```
GET /api/get-analysis/<id>
```

### 6. Health Check
```
GET /health
```

## Installation & Setup

### Requirements
- Python 3.8+
- pip (Python package manager)
- Google Gemini API key

### Quick Start
```bash
cd backend
cp .env.example .env
# Edit .env and add Gemini API key
pip install -r requirements.txt
python app.py
```

## Error Handling

Comprehensive error handling for:
- Invalid input (400)
- File upload errors (400)
- Missing resources (404)
- Server errors (500)
- Service failures (graceful degradation)

## Security Features

- Input validation on all endpoints
- File type and size validation
- SQL injection protection (SQLAlchemy)
- CORS configuration
- Environment variable management
- Secure file handling

## Logging

- Daily rotating logs in `logs/` directory
- Different log levels (DEBUG, INFO, WARNING, ERROR)
- File and console output
- Structured logging format

## Database Schema

### FraudReport Table
```sql
id              INTEGER PRIMARY KEY
timestamp       DATETIME
input_type      VARCHAR(10)    -- 'text' or 'image'
extracted_text  TEXT
image_path      VARCHAR(255)
scam_type       VARCHAR(100)
risk_score      FLOAT
risk_level      VARCHAR(20)    -- Critical, High, Medium, Low
red_flags       JSON           -- Array of red flags
recommendation  TEXT
explanation     TEXT
evidence_extraction JSON        -- Extracted evidence
status          VARCHAR(20)    -- 'completed'
```

## Configuration Options

Edit `.env` file:

```env
# Flask
FLASK_ENV=development
FLASK_DEBUG=True

# Database
DATABASE_URL=sqlite:///fraud_detection.db

# API
GEMINI_API_KEY=your_key_here

# Server
HOST=0.0.0.0
PORT=8000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=uploads
```

## Performance Considerations

- OCR processing may take 2-5 seconds per image (first call slower due to model loading)
- Gemini API calls have rate limits (free tier: 60 requests/minute)
- SQLite suitable for development; use PostgreSQL for production
- File uploads limited to 10MB by default

## Future Enhancements

1. Advanced ML models for pattern detection
2. Redis caching for improved performance
3. PostgreSQL for production scalability
4. Batch analysis processing
5. Integration with official cybercrime reporting systems
6. Multi-language support expansion
7. Real-time alerts and notifications
8. Administrative dashboard
9. User authentication and authorization
10. API rate limiting

## Deployment

For production deployment:

1. **Database**: Migrate to PostgreSQL
2. **Web Server**: Use Gunicorn/uWSGI + Nginx
3. **Environment**: Use production config
4. **Security**: Enable HTTPS, firewall rules
5. **Monitoring**: Set up error tracking (Sentry)
6. **Scaling**: Use load balancing

## Testing

Sample test requests are documented in SETUP.md

## Support & Documentation

- API documentation: See README.md
- Setup guide: See SETUP.md
- Code comments: In-file documentation throughout

## License

This project is part of the Citizen Fraud Shield initiative to combat cybercrime in India.

---

## Quick Reference

### Start Server
```bash
python app.py
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Scripts
- Windows: `run.bat`
- Linux/Mac: `./run.sh`

### Check Logs
```bash
tail -f logs/fraud_detection_*.log
```

### Reset Database
```bash
rm fraud_detection.db
python app.py  # Will recreate empty DB
```

### Test API
```bash
# Health check
curl http://localhost:8000/health

# Text analysis
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"message":"test message"}'

# Dashboard
curl http://localhost:8000/api/dashboard
```
