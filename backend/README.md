# Citizen Fraud Shield - Backend API

An AI-powered fraud detection system using Flask, Google Groq API, and machine learning for text analysis and OCR.

## Features

- **Text Analysis**: Analyze suspicious text/messages for fraud indicators
- **Image Analysis**: Extract text from images using OCR and analyze for fraud
- **Multi-Agent AI Architecture**: 
  - Evidence Extraction
  - Fraud Classification
  - Risk Assessment
  - Citizen Advisory
- **NCRP Complaint Generation**: Generate formal complaint reports
- **Dashboard Analytics**: Real-time fraud statistics and trends
- **SQLite Database**: Persistent storage of all analyses
- **CORS Enabled**: Frontend integration ready

## Tech Stack

- **Flask**: Web framework
- **SQLAlchemy**: ORM for database
- **Google Groq API**: AI-powered fraud analysis
- **EasyOCR**: Optical character recognition
- **Pillow**: Image processing
- **Flask-CORS**: CORS support

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration management
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variables template
├── models/
│   ├── __init__.py
│   └── fraud_report.py   # SQLAlchemy FraudReport model
├── routes/
│   ├── __init__.py
│   ├── analysis.py       # Fraud analysis endpoints
│   └── dashboard.py      # Dashboard endpoints
├── services/
│   ├── __init__.py
│   ├── groq_service.py      # Groq API integration
│   ├── ocr_service.py         # OCR processing
│   ├── fraud_analysis_service.py  # Fraud analysis logic
│   └── report_service.py      # Report generation
├── database/
│   └── __init__.py       # Database initialization
├── utils/
│   ├── __init__.py
│   ├── logger.py         # Logging configuration
│   ├── validators.py     # Input validation
│   └── helpers.py        # Utility functions
├── uploads/              # Temporary image storage
└── logs/                 # Application logs
```

## Installation

### 1. Clone the repository
```bash
cd backend
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your Google Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

### 5. Run the application
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### 1. Analyze Text
**POST** `/api/analyze-text`

Analyze text for fraud indicators.

**Request:**
```json
{
    "message": "I am a customs official and you have a pending tax return. Click here to claim..."
}
```

**Response:**
```json
{
    "id": 1,
    "risk_score": 95,
    "risk_level": "Critical",
    "scam_type": "Digital Arrest Scam",
    "red_flags": [
        "Authority impersonation",
        "Urgency tactics",
        "Request for personal information"
    ],
    "explanation": "This appears to be a digital arrest scam...",
    "recommendation": "Do not click any links or provide personal information. Report to NCRP immediately.",
    "evidence": {
        "phone_numbers": [],
        "urls": [],
        "upi_ids": [],
        "emails": [],
        "organizations": ["customs", "tax"]
    }
}
```

### 2. Analyze Image
**POST** `/api/analyze-image`

Analyze image containing suspicious text/communication.

**Request:**
```
Content-Type: multipart/form-data
- image: [image file]
```

**Response:**
```json
{
    "id": 2,
    "extracted_text": "Extracted text from image...",
    "risk_score": 92,
    "scam_type": "Phishing",
    "risk_level": "High",
    "red_flags": [...],
    "explanation": "...",
    "recommendation": "...",
    "evidence": {...}
}
```

### 3. Generate Report
**POST** `/api/generate-report`

Generate NCRP-style complaint report.

**Request:**
```json
{
    "analysis_id": 1
}
```

**Response:**
```json
{
    "report": {
        "complaint_id": "1",
        "complaint_date": "2024-01-15 10:30:45",
        "complaint_type": "Cyber Fraud / Scam",
        "subject": "Digital Arrest Scam - Cybercrime Report",
        "risk_assessment": {
            "risk_level": "Critical",
            "risk_score": 95,
            "severity": "Urgent"
        },
        "incident_details": {
            "type_of_fraud": "Digital Arrest Scam",
            "description": "...",
            "communication_content": "...",
            "red_flags": [...]
        },
        "evidence": {...},
        "action_recommended": "...",
        "reporting_instructions": [...],
        "filing_authorities": [
            {
                "name": "NCRP (National Cyber Crime Reporting Portal)",
                "website": "https://www.cybercrime.gov.in",
                "recommended": true
            },
            ...
        ]
    }
}
```

### 4. Get Dashboard Data
**GET** `/api/dashboard`

Retrieve fraud statistics and analytics.

**Response:**
```json
{
    "total_cases": 150,
    "critical_cases": 35,
    "high_cases": 45,
    "medium_cases": 50,
    "low_cases": 20,
    "categories": {
        "Digital Arrest": 35,
        "UPI Fraud": 28,
        "OTP Scam": 22,
        "Phishing": 40,
        "Loan Scam": 15,
        "Investment Scam": 10
    },
    "daily_trends": [
        {"date": "2024-01-01", "cases": 5},
        {"date": "2024-01-02", "cases": 8},
        ...
    ],
    "average_risk_score": 65.5
}
```

### 5. Get Analysis by ID
**GET** `/api/get-analysis/<analysis_id>`

Retrieve a specific analysis by ID.

**Response:**
```json
{
    "id": 1,
    "timestamp": "2024-01-15T10:30:45",
    "input_type": "text",
    "extracted_text": "...",
    "scam_type": "Digital Arrest Scam",
    "risk_score": 95,
    "risk_level": "Critical",
    "red_flags": [...],
    "recommendation": "...",
    "explanation": "...",
    "evidence_extraction": {...},
    "status": "completed"
}
```

### 6. Health Check
**GET** `/health`

Check API health and service status.

**Response:**
```json
{
    "status": "healthy",
    "message": "Citizen Fraud Shield Backend is running",
    "services": {
        "groq": "initialized",
        "ocr": "initialized",
        "database": "initialized"
    }
}
```

## Database Schema

### FraudReport Table

```sql
CREATE TABLE fraud_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    input_type VARCHAR(10) NOT NULL,
    extracted_text TEXT,
    image_path VARCHAR(255),
    scam_type VARCHAR(100) NOT NULL,
    risk_score FLOAT NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    red_flags JSON,
    recommendation TEXT,
    explanation TEXT,
    evidence_extraction JSON,
    status VARCHAR(20) DEFAULT 'completed'
);
```

## AI Multi-Agent Architecture

The system simulates a multi-agent fraud detection workflow:

### Agent 1: Evidence Extraction
- Extracts phone numbers
- Identifies URLs
- Detects UPI IDs
- Extracts names and organizations

### Agent 2: Fraud Classification
- Digital Arrest Scams
- UPI Fraud
- OTP Scams
- Phishing
- Loan Scams
- Investment Scams
- Tech Support Scams
- Prize Scams

### Agent 3: Risk Assessment
- Calculates risk score (0-100)
- Determines severity level (Critical/High/Medium/Low)

### Agent 4: Citizen Advisory
- Generates explanations
- Provides next steps
- Recommends reporting instructions

## Error Handling

The API includes comprehensive error handling:

- **400**: Bad Request - Invalid input
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server error

## Logging

Application logs are stored in the `logs/` directory with daily rotation.

## Development

### Running Tests
```bash
python -m pytest
```

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8 .
```

## Configuration

Edit `config.py` or `.env` to configure:

- Database URL
- API Keys
- File upload limits
- CORS settings
- Logging levels

## Frontend Integration

The frontend expects the API at `http://localhost:8000`. Make sure to set:

```javascript
// In frontend .env
VITE_API_URL=http://localhost:8000
```

## Security Considerations

1. **API Key**: Store Groq API key in `.env`, never commit to git
2. **File Upload**: Validate and sanitize all uploaded files
3. **Input Validation**: All user inputs are validated
4. **CORS**: Configure appropriate CORS origins for production
5. **Database**: Use strong passwords and secure connection strings

## License

This project is part of the Citizen Fraud Shield initiative.

## Support

For issues or questions, please refer to the main project documentation.
