# Setup and installation guide for Citizen Fraud Shield Backend

## Quick Start

### Windows
```bash
cd backend
run.bat
```

### Linux/Mac
```bash
cd backend
chmod +x run.sh
./run.sh
```

## Manual Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
- **Windows**: `venv\Scripts\activate`
- **Linux/Mac**: `source venv/bin/activate`

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add:
```
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### 5. Run Server
```bash
python app.py
```

Server starts at: `http://localhost:8000`

## Getting Groq API Key

1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign in or create an account
3. Click "Create API Key"
4. Copy and paste into your `.env` file

## Verify Installation

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

Expected response:
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

## API Testing

### Test Text Analysis
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"message":"Your bank account has been locked. Click here immediately to verify your identity"}'
```

### Test Image Analysis
```bash
curl -X POST http://localhost:8000/api/analyze-image \
  -F "image=@path/to/image.jpg"
```

### Get Dashboard Data
```bash
curl http://localhost:8000/api/dashboard
```

## Troubleshooting

### OCR Issues
If OCR service fails to initialize:
- Ensure Python 3.8+ is installed
- Try reinstalling easyocr: `pip install --upgrade easyocr`
- First OCR call may take time to download models

### API Key Issues
- Verify API key is correct in `.env`
- Ensure the key was generated in the Groq Console

### Database Issues
- Delete `fraud_detection.db` to reset database
- Check `logs/` directory for detailed error messages

## Development Tips

1. **Watch Mode**: Use a file watcher to auto-reload on changes
   ```bash
   pip install flask-reload
   ```

2. **View Logs**: Check real-time logs
   ```bash
   tail -f logs/fraud_detection_*.log
   ```

3. **Database Console**: Inspect SQLite database
   ```bash
   sqlite3 fraud_detection.db
   ```

4. **Test Request Data**: Save request bodies to files
   ```json
   # test_request.json
   {"message": "test text"}
   
   # Run:
   curl -X POST http://localhost:8000/api/analyze-text \
     -H "Content-Type: application/json" \
     -d @test_request.json
   ```
