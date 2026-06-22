# ✅ CONNECTION VERIFICATION GUIDE

## 🔍 Quick Validation Checklist

Run this checklist **BEFORE** starting services to confirm connection is valid:

### 1. Verify Backend Files Exist
```bash
# Check backend structure
ls -la backend/app.py
ls -la backend/routes/
ls -la backend/services/
ls -la backend/models/
```
✅ All should exist

### 2. Verify Frontend API Client  
```bash
# Check API client is configured
cat src/services/api.js
```
✅ Should show:
- `BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'`
- Functions: `analyzeText()`, `analyzeImage()`, `getDashboardData()`, `generateReport()`

### 3. Verify Environment Configuration
```bash
# Check frontend .env
cat .env
```
✅ Should have: `VITE_API_URL=http://localhost:8000`

```bash
# Check backend .env.example
cat backend/.env.example
```
✅ Should have `GEMINI_API_KEY` placeholder

### 4. Verify Frontend Components Are Updated
```bash
# Check Analyzer.jsx uses API (not mock)
grep -n "analyzeText\|analyzeImage" src/pages/Analyzer.jsx
```
✅ Should show imports and function calls (NOT hardcoded MOCK_RESULT)

```bash
# Check Dashboard.jsx uses API
grep -n "getDashboardData" src/pages/Dashboard.jsx
```
✅ Should show useEffect hook calling API

```bash
# Check Report.jsx uses API
grep -n "generateReport" src/pages/Report.jsx
```
✅ Should show useParams and API call

---

## 🚀 Starting Services for Testing

### Terminal 1: Start Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt

# Create .env from example
cp .env.example .env

# IMPORTANT: Edit .env and add real GEMINI_API_KEY
# Get from: https://aistudio.google.com

python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * WARNING in app.run_simple
 * Running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend
```bash
npm install
npm run dev
```

**Expected output:**
```
VITE v8.x.x  ready in XXXms

  ➜  Local:   http://localhost:5173/
```

---

## ✅ Testing Real Connection

### Test 1: Backend Health Check
```bash
curl http://localhost:8000/health
```

**Expected response:**
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

✅ If you see this, **backend is working correctly**

### Test 2: Test Text Analysis API
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"message":"Your bank account has been suspended. Click here to verify."}'
```

**Expected response:**
```json
{
  "id": 1,
  "risk_score": 95,
  "risk_level": "CRITICAL",
  "scam_type": "Phishing",
  "red_flags": [...],
  "explanation": "...",
  "recommendation": "..."
}
```

✅ If you get real data, **API connection is valid**

❌ If you get mock/hardcoded data, **frontend is still using mock results**

### Test 3: Test Dashboard API
```bash
curl http://localhost:8000/api/dashboard
```

**Expected response:**
```json
{
  "total_cases": 1,
  "critical_cases": 1,
  "high_cases": 0,
  "medium_cases": 0,
  "low_cases": 0,
  "categories": {
    "Phishing": 1
  },
  "daily_trends": [...]
}
```

✅ If you see real data, **dashboard API is working**

---

## 🌐 Test in Browser

### Test 4: Open Frontend
```
Open: http://localhost:5173
```

You should see the Fraud Shield UI with:
- Analyzer page
- Dashboard page  
- Report page
- Navbar navigation

### Test 5: Test Text Analysis (Frontend)
1. Go to **Analyzer** page
2. Paste: `"Your account needs immediate verification. Click this link now."`
3. Click **Analyze for Fraud**
4. Wait 5-10 seconds (first OCR call takes longer)

**Check these:**
- ✅ Loading spinner appears
- ✅ Real API response appears (NOT mock "SMS Smishing")
- ✅ Risk level shows actual value
- ✅ Red flags are populated
- ✅ Console shows NO errors (press F12)

### Test 6: Test Dashboard (Frontend)
1. Go to **Dashboard** page
2. Check for **real data**:
   - Total cases shows correct count
   - Critical cases updated
   - Scam categories display
   - Charts show real data

✅ If Dashboard shows data from backend, **connection is valid**

### Test 7: Test Report Generation
1. Go to **Analyzer** and submit analysis
2. After result appears, click **Generate Report** button (if available)
3. Should navigate to Report page with:
   - Case ID showing analysis ID
   - NCRP formatted complaint
   - Real data from backend

---

## 🔧 Troubleshooting Invalid Connection

### ❌ Analyzer still shows mock data

**Check these:**
1. Backend is running: `curl http://localhost:8000/health`
2. Frontend imports are correct:
   ```bash
   grep "import.*analyzeText" src/pages/Analyzer.jsx
   ```
3. Browser console (F12) shows NO CORS errors
4. Check network tab - API requests should show:
   - URL: `http://localhost:8000/api/analyze-text`
   - Status: 200
   - Response: Real data (not mock)

### ❌ CORS errors in browser console

**Solution:**
1. Check backend has CORS enabled:
   ```bash
   grep "CORS" backend/app.py
   ```
2. Restart backend:
   ```bash
   # Stop: Ctrl+C
   python app.py
   ```
3. Refresh browser (Ctrl+Shift+R)

### ❌ Dashboard shows 0 cases

**Check these:**
1. Submit at least one analysis first
2. Database file exists: `backend/fraud_detection.db`
3. Backend query succeeds:
   ```bash
   curl http://localhost:8000/api/dashboard
   ```

### ❌ "Cannot reach API" error

**Solution:**
1. Backend running? `curl http://localhost:8000/health`
2. Correct port? Should be `8000`, not `5173`
3. Firewall blocking port 8000? Try: `netstat -an | grep 8000`
4. .env configured? Check `VITE_API_URL=http://localhost:8000`

---

## 📊 Connection Flow Diagram

```
User Types Message
        ↓
Frontend (Analyzer.jsx)
        ↓
Calls: analyzeText(message)
        ↓
HTTP POST to http://localhost:8000/api/analyze-text
        ↓
Flask Backend (routes/analysis.py)
        ↓
GeminiService analyzes text
        ↓
Returns JSON response
        ↓
Frontend displays real results
        ↓
User sees actual fraud assessment
```

✅ **Connection is valid** when ALL steps complete successfully

---

## 🎯 Final Validation

**Connection is VALID when:**
- ✅ `curl http://localhost:8000/health` returns healthy
- ✅ `curl http://localhost:8000/api/analyze-text` returns real data
- ✅ Frontend shows real analysis results (not mock)
- ✅ Dashboard displays real statistics
- ✅ Browser console has NO CORS errors
- ✅ Network tab shows 200 responses from backend

**Connection is INVALID when:**
- ❌ Frontend still shows mock "SMS Smishing" results
- ❌ Dashboard shows hardcoded sample data
- ❌ Browser console shows CORS errors
- ❌ Network requests return 404 or 500
- ❌ Backend endpoints don't respond

---

## 📝 Quick Commands Reference

```bash
# Start backend
cd backend && python app.py

# Start frontend  
npm run dev

# Test backend health
curl http://localhost:8000/health

# Test text analysis
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Test dashboard
curl http://localhost:8000/api/dashboard

# Check CORS
curl -H "Origin: http://localhost:5173" http://localhost:8000/health

# Check logs (backend)
cat backend/logs/*.log | tail -50

# Check if ports are in use
netstat -an | grep "8000\|5173"
```

---

## ✨ Success Indicators

When properly connected, you'll see:

1. **Browser**: Real fraud analysis results appear instantly
2. **Dashboard**: Statistics update after each analysis
3. **Console**: NO errors, only normal logs
4. **Network Tab**: Requests show 200 status
5. **Report Page**: Can generate reports with real data

**Everything working?** 🎉 Connection is valid!

---

## 🤝 Still Having Issues?

1. **Check logs**:
   ```bash
   # Backend logs
   ls -la backend/logs/
   cat backend/logs/fraud_detection_*.log | tail -100
   ```

2. **Test API directly**:
   ```bash
   node verify-connection.js
   ```

3. **Check environment**:
   ```bash
   echo "Frontend URL:" $VITE_API_URL
   echo "Backend running?" $(curl -s http://localhost:8000/health | jq .status)
   ```

4. **Review files**:
   - [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
   - [QUICKSTART.md](QUICKSTART.md)
   - [backend/app.py](backend/app.py)
   - [src/services/api.js](src/services/api.js)

---

**Connection validation complete!** ✅
