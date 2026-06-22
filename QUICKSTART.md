# Quick Start Guide - Citizen Fraud Shield

Complete guide to get the full-stack application running locally.

## ⚡ 5-Minute Quick Start (Windows)

### 1. Open Command Prompt and Navigate to Project
```cmd
cd d:\FraudNet-1
```

### 2. Run the Start Script
```cmd
start.bat
```

This will automatically:
- ✅ Check for Node.js and Python
- ✅ Start Flask backend (port 8000)
- ✅ Start React frontend (port 5173)
- ✅ Install all dependencies

### 3. Open Your Browser
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

### 4. Test It Works
- Go to Analyzer page (http://localhost:5173/analyzer)
- Type: "Your account is suspended. Click here to verify."
- Click "Analyze"
- **Should see real fraud detection results** ✅

---

## 📋 Manual Setup (If start.bat doesn't work)

### Backend Setup (Terminal 1)

```bash
# 1. Navigate to backend
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env

# 6. Edit .env file and add Gemini API key
# Open .env in notepad and replace 'your_gemini_api_key_here' with actual key
# Get key from: https://aistudio.google.com

notepad .env
# OR use your preferred editor

# 7. Start Flask server
python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:8000
```

### Frontend Setup (Terminal 2)

```bash
# 1. Go to project root (NOT the backend folder)
cd d:\FraudNet-1

# 2. Install npm dependencies
npm install

# 3. Start development server
npm run dev
```

**Expected output:**
```
  VITE v8.0.12  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
```

---

## 🔑 Getting Gemini API Key

1. **Visit**: https://aistudio.google.com
2. **Sign in** with your Google account (create if needed)
3. **Click**: "Get API Key"
4. **Copy** the key
5. **Paste** into `backend/.env`:
   ```
   GEMINI_API_KEY=your_copied_key_here
   ```

---

## ✅ Verify Everything Works

### Option 1: Use Verification Script
```bash
node verify-connection.js
```

This will:
- ✅ Check if backend is running
- ✅ Verify CORS is configured
- ✅ Test database connection
- ✅ Show health status

### Option 2: Manual Test
Open browser console (F12) and run:

```javascript
// Test API call
fetch('http://localhost:8000/api/analyze-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Your bank account needs verification. Click here."
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Connected!');
  console.log('Risk Level:', data.risk_level);
  console.log('Scam Type:', data.scam_type);
})
.catch(e => console.error('❌ Error:', e.message))
```

---

## 🚀 What Happens Next

### Frontend → Backend Flow

1. **User types fraud message** on Analyzer page
2. **Frontend sends** POST request to `http://localhost:8000/api/analyze-text`
3. **Backend analyzes** using Google Gemini AI
4. **Responses include**:
   - Risk level (CRITICAL, HIGH, MEDIUM, LOW)
   - Scam type (Phishing, UPI Fraud, etc.)
   - Red flags detected
   - Recommendations
   - Evidence extracted

### Dashboard

1. **Frontend loads** Dashboard page
2. **Backend queries** database via `/api/dashboard`
3. **Shows**:
   - Total cases analyzed
   - Critical cases count
   - Statistics by scam type
   - Trends over time

---

## 🆘 Troubleshooting

### ❌ "Cannot find module 'npm'"
```
Error: npm command not found
```
**Solution**: Install Node.js from https://nodejs.org

### ❌ "ModuleNotFoundError: No module named 'flask'"
```
Error: ModuleNotFoundError: No module named 'flask'
```
**Solution**: 
```bash
cd backend
pip install -r requirements.txt
```

### ❌ "CORS error in browser console"
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Verify backend is running on port 8000
- Check `app.py` has `CORS(app, origins='*')`
- Restart backend server

### ❌ "Timeout waiting for API response"
```
Error: Network timeout after 30 seconds
```
**Solution**:
- First OCR call can take 20-30 seconds (downloads model)
- Subsequent calls are faster
- Check `timeout: 30000` in `src/services/api.js`
- Increase to `60000` if needed

### ❌ "Cannot connect to localhost:8000"
```
Error: fetch failed
```
**Solution**:
- Check backend is running: `python app.py`
- Check correct port: `http://localhost:8000/health`
- Windows firewall might block port - allow it in firewall settings

### ❌ "Gemini API key error"
```
Error: API key not valid
```
**Solution**:
- Visit https://aistudio.google.com to get key
- Copy entire key (including dashes and underscores)
- Paste in `backend/.env` without extra spaces:
  ```
  GEMINI_API_KEY=sk_test_abc123...
  ```
- Restart backend: `python app.py`

### ❌ "Database error"
```
Error: database is locked
```
**Solution**:
- Close any other processes using database
- Delete `backend/fraud_detection.db` to reset
- Backend will recreate it on next run

---

## 📁 Project Structure After Setup

```
FraudNet-1/
├── backend/                    # Flask backend
│   ├── app.py                 # Main app (run this)
│   ├── .env                   # Configuration (you create)
│   ├── requirements.txt        # Python dependencies
│   ├── venv/                  # Virtual environment (created by pip)
│   ├── fraud_detection.db     # Database (created on first run)
│   ├── config.py              # Settings
│   ├── database/              # Database setup
│   ├── models/                # Data models
│   ├── services/              # AI/OCR services
│   ├── routes/                # API endpoints
│   └── utils/                 # Helper functions
│
├── src/                       # React frontend
│   ├── services/api.js        # API client (already configured)
│   ├── pages/                 # Pages (Analyzer, Dashboard, Report)
│   ├── components/            # Reusable components
│   └── main.jsx              # Entry point
│
├── start.bat                  # Quick start (Windows)
├── start.sh                   # Quick start (Linux/Mac)
├── verify-connection.js       # Test connectivity
├── INTEGRATION_GUIDE.md       # Detailed integration info
├── .env                       # Frontend config (you create if needed)
└── package.json              # Frontend dependencies
```

---

## 🎯 Success Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:5173
- [ ] http://localhost:8000/health returns `{"status":"healthy"}`
- [ ] No CORS errors in browser console
- [ ] Can type fraud message on Analyzer page
- [ ] Real fraud detection results appear (not mock data)
- [ ] Dashboard shows statistics
- [ ] Can download NCRP report

---

## 🆙 Common Tasks

### Stop All Services
Press `Ctrl+C` in terminal windows running backend/frontend

### Reset Database
```bash
# Delete database
cd backend
rm fraud_detection.db

# Restart backend to recreate
python app.py
```

### Update Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt --upgrade

# Frontend
npm update
```

### Change API URL (if running on different host)
Edit `.env` file:
```
VITE_API_URL=http://192.168.1.100:8000
```

### Enable Debug Mode
Edit `backend/.env`:
```
FLASK_DEBUG=True
DATABASE_ECHO=True
```

---

## 📚 Further Reading

- **Integration Details**: See `INTEGRATION_GUIDE.md`
- **API Reference**: See `backend/API_REFERENCE.md`
- **Troubleshooting**: See `INTEGRATION_GUIDE.md` → "Network Troubleshooting"
- **Architecture**: See `backend/ARCHITECTURE.md`

---

## 💡 Tips

1. **Keep both terminals open** while developing
2. **Check logs** in `backend/logs/` for errors
3. **First OCR call is slow** - downloads 500MB+ model
4. **Restart backend** after changing `.env` file
5. **Clear browser cache** if UI doesn't update
6. **Use DevTools (F12)** to see network requests

---

## 🤝 Getting Help

1. **Check logs**:
   - Backend: Look in `backend/logs/` folder
   - Frontend: Check browser DevTools (F12)

2. **Run verification**:
   ```bash
   node verify-connection.js
   ```

3. **Test specific endpoint**:
   ```bash
   curl http://localhost:8000/health
   ```

4. **Common issues**: See "Troubleshooting" section above

---

## ✨ What's Next

After getting this running:
1. Test fraud detection with various inputs
2. Check database statistics on Dashboard
3. Generate NCRP complaint reports
4. Customize appearance in CSS files
5. Add more fraud types/categories
6. Deploy to production

**Happy fraud detection! 🛡️**
