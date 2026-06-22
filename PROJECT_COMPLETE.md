# Citizen Fraud Shield - Complete Project

An AI-powered fraud detection system combining a React frontend with a Flask backend to detect, analyze, and report cybercrimes and financial fraud.

## Project Structure

```
FraudNet-1/
├── src/                          # React Frontend
│   ├── components/               # React components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── pages/                    # Page components
│   │   ├── Home.jsx
│   │   ├── Analyzer.jsx          # Text/Image analysis UI
│   │   ├── Dashboard.jsx         # Analytics dashboard
│   │   ├── Report.jsx            # Report viewer
│   │   └── Contact.jsx
│   ├── services/
│   │   └── api.js                # API client
│   ├── routes/
│   │   └── AppRoutes.jsx
│   └── App.jsx
├── backend/                      # Flask Backend
│   ├── app.py                    # Main Flask app
│   ├── config.py                 # Configuration
│   ├── models/                   # Database models
│   │   └── fraud_report.py
│   ├── services/                 # Business logic
│   │   ├── gemini_service.py     # AI analysis
│   │   ├── ocr_service.py        # Image OCR
│   │   ├── fraud_analysis_service.py
│   │   └── report_service.py
│   ├── routes/                   # API endpoints
│   │   ├── analysis.py
│   │   └── dashboard.py
│   ├── database/                 # Database setup
│   ├── utils/                    # Utilities
│   │   ├── logger.py
│   │   ├── validators.py
│   │   └── helpers.py
│   ├── uploads/                  # Image storage
│   ├── requirements.txt
│   ├── .env.example
│   ├── README.md
│   ├── SETUP.md
│   ├── API_EXAMPLES.md
│   ├── IMPLEMENTATION_GUIDE.md
│   └── DEPLOYMENT_READY.md
├── package.json                  # Frontend dependencies
├── vite.config.js
├── README.md                     # Project README
└── .env.example

```

## Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:5173
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add GEMINI_API_KEY

# Run server
python app.py
# Runs on http://localhost:8000
```

## Features

### Frontend (React)
- 📱 Responsive UI with Navbar, Sidebar, Footer
- 🔍 **Analyzer Page**: Submit text or image for fraud analysis
- 📊 **Dashboard**: View fraud statistics and trends
- 📄 **Report Page**: View and download NCRP-style complaints
- 📞 **Contact Page**: Support and contact information

### Backend (Flask)
- 🤖 **AI-Powered Analysis**: Google Gemini API for fraud detection
- 🖼️ **OCR Processing**: Extract text from images using EasyOCR
- 📊 **Analytics**: Real-time fraud statistics and trends
- 💾 **Database**: SQLite persistence with SQLAlchemy ORM
- ✅ **NCRP Reports**: Generate formal complaint documents
- 📋 **Evidence Extraction**: Identify phone numbers, URLs, UPIs, emails
- 🔒 **Security**: Input validation, file handling, error management

## API Endpoints

### Analysis
- **POST** `/api/analyze-text` - Analyze text for fraud
- **POST** `/api/analyze-image` - Analyze image with OCR
- **POST** `/api/generate-report` - Generate NCRP complaint
- **GET** `/api/get-analysis/<id>` - Retrieve analysis

### Analytics
- **GET** `/api/dashboard` - Fraud statistics

### Health
- **GET** `/health` - API health check
- **GET** `/` - API information

## Technology Stack

### Frontend
- React 19.2.6
- React Router DOM 7.18.0
- Vite 8.0.12
- Axios 1.18.0

### Backend
- Flask 3.0.0
- SQLAlchemy 2.0.23
- Google Generative AI 0.3.0
- EasyOCR 1.7.1
- Pillow 10.1.0
- Flask-CORS 4.0.0

## Environment Configuration

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///fraud_detection.db
GEMINI_API_KEY=your_api_key_here
HOST=0.0.0.0
PORT=8000
MAX_FILE_SIZE=10485760
UPLOAD_FOLDER=uploads
```

## Multi-Agent Fraud Detection

The system uses Gemini API to simulate a multi-agent workflow:

```
┌─────────────────────────────────────┐
│ User Input (Text or Image)          │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Agent 1: Evidence Extraction        │
│ - Extract phone numbers             │
│ - Identify URLs                     │
│ - Find UPI IDs, emails              │
│ - Detect organization names         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Agent 2: Fraud Classification       │
│ - Digital Arrest Scam               │
│ - UPI Fraud                         │
│ - OTP Scam                          │
│ - Phishing                          │
│ - Loan Scam                         │
│ - Investment Scam                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Agent 3: Risk Assessment            │
│ - Calculate risk score (0-100)      │
│ - Determine severity level          │
│ - Identify critical threats         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Agent 4: Citizen Advisory           │
│ - Provide explanation               │
│ - Suggest next steps                │
│ - Recommend reporting               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Complete Fraud Analysis Report      │
└─────────────────────────────────────┘
```

## Fraud Types Detected

- 🚨 Digital Arrest Scams
- 💳 UPI Fraud
- 🔐 OTP Scams
- 🎣 Phishing Attacks
- 💰 Loan Scams
- 📈 Investment Scams
- 🖥️ Tech Support Scams
- 🎁 Prize/Lottery Scams
- And more...

## Risk Levels

| Level | Range | Description |
|-------|-------|-------------|
| 🔴 Critical | 80-100 | Immediate action required |
| 🟠 High | 60-79 | Strong fraud indicators |
| 🟡 Medium | 40-59 | Suspicious but uncertain |
| 🟢 Low | 0-39 | Minimal fraud indicators |

## Database Schema

### fraud_reports Table
```
id                    INTEGER PRIMARY KEY
timestamp             DATETIME
input_type            VARCHAR(10)      # 'text' or 'image'
extracted_text        TEXT
image_path            VARCHAR(255)
scam_type             VARCHAR(100)
risk_score            FLOAT            # 0-100
risk_level            VARCHAR(20)      # Critical/High/Medium/Low
red_flags             JSON             # Array of red flags
recommendation        TEXT
explanation           TEXT
evidence_extraction   JSON             # Extracted evidence
status                VARCHAR(20)      # 'completed'
```

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Google Gemini API Key ([Get one](https://aistudio.google.com))

### Installation

1. **Clone/Setup Repository**
   ```bash
   cd FraudNet-1
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # Activate venv (see above)
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env and add GEMINI_API_KEY
   python app.py
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/

## Documentation

### Frontend
- Components in `src/components/`
- Pages in `src/pages/`
- API client in `src/services/api.js`

### Backend
- **README.md** - Complete API reference
- **SETUP.md** - Installation guide
- **API_EXAMPLES.md** - Request/response examples
- **IMPLEMENTATION_GUIDE.md** - Architecture details
- **DEPLOYMENT_READY.md** - Deployment checklist

## API Testing

### Test Text Analysis
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"message":"Your account has been suspended. Click here to verify identity."}'
```

### Test Image Analysis
```bash
curl -X POST http://localhost:8000/api/analyze-image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@path/to/image.jpg"
```

### Get Dashboard
```bash
curl http://localhost:8000/api/dashboard
```

See `backend/API_EXAMPLES.md` for more examples.

## Development Workflow

1. **Start Backend**
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend** (in new terminal)
   ```bash
   npm run dev
   ```

3. **Make Changes**
   - Frontend: Changes auto-reload with Vite
   - Backend: Restart or use auto-reload

4. **Test Endpoints**
   - Use Postman, curl, or frontend UI
   - Check `backend/logs/` for debug info

## Debugging

### Backend Logs
```bash
tail -f backend/logs/fraud_detection_*.log
```

### Database Inspection
```bash
sqlite3 backend/fraud_detection.db
```

### Frontend Console
Open browser DevTools (F12)

## Performance Tips

1. **OCR Performance**: First image processing is slower (model download)
2. **API Limits**: Gemini has rate limits (free tier: 60 req/min)
3. **Database**: SQLite good for dev, use PostgreSQL for production
4. **Caching**: Implement Redis for repeated queries

## Security Considerations

- ✅ Keep `.env` files private (add to `.gitignore`)
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Secure API key storage
- ✅ Enable CORS properly
- ✅ Implement rate limiting for production
- ✅ Use environment-specific configs

## Production Deployment

### Backend
1. Use Gunicorn/uWSGI
2. Set up Nginx reverse proxy
3. Enable HTTPS/SSL
4. Use PostgreSQL
5. Set up monitoring
6. Configure backups

### Frontend
1. Build: `npm run build`
2. Deploy to CDN or web server
3. Set API URL to production backend
4. Enable compression

## Troubleshooting

### Backend Won't Start
- Check Python version (3.8+)
- Verify virtual environment activated
- Check `.env` configuration
- See `backend/SETUP.md`

### OCR Not Working
- First call downloads models (slow)
- Check image quality
- Verify Pillow installed
- Check logs for errors

### API Key Issues
- Get key from https://aistudio.google.com
- Verify key in `.env`
- Check API is enabled
- See `backend/SETUP.md`

### CORS Errors
- Verify backend running on 8000
- Check frontend API URL
- See `backend/config.py`

## Contributing

Guidelines for contributing:
1. Follow existing code style
2. Add comments for complex logic
3. Test changes thoroughly
4. Update documentation
5. Keep commits clean

## Project Statistics

- **Frontend**: ~5 pages, reusable components, responsive design
- **Backend**: ~20 files, 1000+ lines of code, comprehensive error handling
- **Documentation**: 5 detailed guides + inline comments
- **API Endpoints**: 6 main endpoints + health check
- **Database**: 1 table, persistent fraud records
- **Languages**: JavaScript/React, Python/Flask, HTML/CSS

## Future Enhancements

- [ ] User authentication
- [ ] Admin dashboard
- [ ] Bulk analysis capability
- [ ] Real-time alerts
- [ ] Integration with official cybercrime portals
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced ML models
- [ ] Blockchain evidence storage
- [ ] Community crowdsourcing

## Support

For issues or questions:
1. Check documentation files
2. Review code comments
3. Check error logs
4. Verify configuration
5. Test health endpoint

## License

This project is part of the Citizen Fraud Shield initiative.

## Contact

For support or questions about this project, refer to:
- Backend docs: `backend/README.md`
- Setup help: `backend/SETUP.md`
- API examples: `backend/API_EXAMPLES.md`

---

## Project Status

✅ **Complete and Ready for:**
- Development testing
- Production deployment
- Frontend/Backend integration
- Real fraud analysis
- Continuous improvement

**Last Updated**: 2024-01-15

**Version**: 1.0.0

**Frontend Location**: `d:\FraudNet-1`

**Backend Location**: `d:\FraudNet-1\backend`
