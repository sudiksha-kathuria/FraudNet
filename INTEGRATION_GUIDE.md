# Frontend-Backend Integration Guide

## 🔌 Connection Status

✅ **API Client Ready**: `src/services/api.js` - Configured with axios
✅ **Environment Setup**: `.env` configured with `VITE_API_URL`
✅ **Backend Ready**: Flask app running on port 8000
✅ **CORS Enabled**: Backend allows all origins

## 📋 What's Already Configured

### Frontend API Client (`src/services/api.js`)
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Available functions:
- analyzeText(message)          // POST /api/analyze-text
- analyzeImage(file)             // POST /api/analyze-image
- getDashboardData()             // GET /api/dashboard
- generateReport(id)             // POST /api/generate-report
```

### Frontend Environment (`.env`)
```
VITE_API_URL=http://localhost:8000
```

### Backend Configuration
- ✅ CORS enabled for all origins
- ✅ Error handling implemented
- ✅ Database ready
- ✅ All endpoints configured

---

## 🚀 Running Frontend + Backend Together

### Terminal 1: Start Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_api_key_here
python app.py
```

**Backend runs on**: `http://localhost:8000`

### Terminal 2: Start Frontend

```bash
# In root directory
npm install
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

---

## ✅ Verify Connection

### 1. Check Backend Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Citizen Fraud Shield Backend is running",
  "services": {
    "gemini": "initialized",
    "ocr": "initialized",
    "database": "initialized"
  }
}
```

### 2. Test API from Frontend Console
Open browser DevTools (F12) and run:

```javascript
// Test API connection
fetch('http://localhost:8000/api/analyze-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Your account has been suspended. Click here to verify."
  })
})
.then(r => r.json())
.then(data => console.log('✅ Connected!', data))
.catch(e => console.error('❌ Error:', e))
```

### 3. Test from Frontend App
- Go to http://localhost:5173/analyzer
- Enter sample fraud text
- Click Analyze
- **Should see real API response** (not mock data)

---

## 🔄 How Frontend Calls Backend

### Currently (Using Mock Data)
```javascript
// src/pages/Analyzer.jsx
async function handleAnalyze() {
  // Using MOCK_RESULT
  setResult(MOCK_RESULT);
}
```

### Should Be (Using Real API)
```javascript
import { analyzeText, analyzeImage } from '../services/api';

async function handleAnalyze() {
  try {
    if (text.trim()) {
      const result = await analyzeText(text);
      setResult(result);
    } else if (file) {
      const result = await analyzeImage(file);
      setResult(result);
    }
  } catch (error) {
    setError(error.message);
  }
}
```

---

## 📱 Pages & Their API Calls

### Analyzer Page (`/analyzer`)
```javascript
// Should call:
POST /api/analyze-text       (for text)
POST /api/analyze-image      (for images)
POST /api/generate-report    (for NCRP report)
```

### Dashboard Page (`/dashboard`)
```javascript
// Should call:
GET /api/dashboard           (for statistics)
```

### Report Page (`/report`)
```javascript
// Should call:
GET /api/get-analysis/<id>   (to retrieve analysis)
POST /api/generate-report    (to generate NCRP complaint)
```

---

## 🧪 Integration Test Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] `curl http://localhost:8000/health` returns 200
- [ ] Can make API call from browser console without CORS errors
- [ ] Text analysis returns real fraud detection
- [ ] Image upload processes OCR correctly
- [ ] Dashboard loads real statistics
- [ ] Report generation works with real data

---

## 🔧 Network Troubleshooting

### CORS Error: "Access to XMLHttpRequest blocked"

**Solution 1**: Verify backend CORS is enabled
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:8000/api/analyze-text
```

**Solution 2**: Check `.env.example` has CORS configuration
```python
# app.py - Already configured
CORS(app, origins='*')
```

### "Cannot reach API" Error

**Solution 1**: Check backend is running
```bash
curl http://localhost:8000/health
```

**Solution 2**: Verify correct port in `.env`
```
VITE_API_URL=http://localhost:8000
```

**Solution 3**: Check firewall isn't blocking port 8000

### Timeout Errors

**Solution 1**: Increase timeout in `api.js`
```javascript
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,  // Increased from 30000
});
```

**Solution 2**: Check backend isn't stuck processing
```bash
# Check server logs for errors
tail -f backend/logs/fraud_detection_*.log
```

---

## 📡 API Endpoint Reference

### Text Analysis
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"message":"Your bank account is suspended"}'
```

### Image Analysis
```bash
curl -X POST http://localhost:8000/api/analyze-image \
  -F "image=@fraud_screenshot.jpg"
```

### Dashboard
```bash
curl http://localhost:8000/api/dashboard
```

### Get Analysis by ID
```bash
curl http://localhost:8000/api/get-analysis/1
```

### Generate Report
```bash
curl -X POST http://localhost:8000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{"analysis_id":1}'
```

---

## 🔐 Environment Setup

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000
```

### Backend (`.env`)
```
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///fraud_detection.db
GEMINI_API_KEY=your_gemini_api_key_here
HOST=0.0.0.0
PORT=8000
```

---

## 📊 Data Flow Diagram

```
┌──────────────────────┐
│   React Frontend     │
│  (localhost:5173)    │
│                      │
│  ┌────────────────┐  │
│  │ Analyzer Page  │  │
│  │ Dashboard Page │  │
│  │ Report Page    │  │
│  └────────────────┘  │
└──────────┬───────────┘
           │ HTTP/JSON
           │ (axios)
           ▼
┌──────────────────────┐
│  Flask Backend       │
│  (localhost:8000)    │
│                      │
│  ┌────────────────┐  │
│  │ /api/analyze   │  │
│  │ /api/dashboard │  │
│  │ /api/generate  │  │
│  └────────────────┘  │
└──────────┬───────────┘
           │ SQLAlchemy ORM
           ▼
    ┌─────────────┐
    │  SQLite DB  │
    │  fraud_     │
    │  reports    │
    └─────────────┘
```

---

## 🎯 Next Steps

1. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Get Gemini API Key**
   - Visit https://aistudio.google.com
   - Create API key
   - Add to `backend/.env`

3. **Start Backend**
   ```bash
   cd backend
   python app.py
   ```

4. **Start Frontend** (in new terminal)
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - DevTools: F12

6. **Test Integration**
   - Go to Analyzer page
   - Submit fraud text
   - Verify real API response appears

---

## 🔄 Service Status

Check which services are running:

**Backend:**
```bash
curl http://localhost:8000/health
```

**Frontend:**
```bash
curl http://localhost:5173
# or open in browser
```

Both should return success.

---

## 📝 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS error | Backend CORS enabled by default, check if it's running |
| Cannot connect to API | Verify backend running on 8000, check firewall |
| Timeout errors | First OCR call can take 20-30 seconds |
| No database file | Created automatically on first API call |
| API key error | Get key from aistudio.google.com, add to .env |
| Module not found | Run `pip install -r requirements.txt` |

---

## ✨ Success Indicators

When properly connected:
- ✅ No CORS errors in browser console
- ✅ API calls complete in 2-5 seconds
- ✅ Real fraud analysis shows in UI
- ✅ Database stores all results
- ✅ Dashboard shows statistics
- ✅ Reports generate successfully

---

**Ready to connect?** Follow the Quick Start steps above!
