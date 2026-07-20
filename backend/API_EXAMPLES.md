# Citizen Fraud Shield - API Request Examples

All examples assume the server is running on `http://localhost:8000`

## 1. Analyze Text - Digital Arrest Scam

### Request
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "message": "This is an urgent message from the Central Bureau of Investigation. Your Aadhar card has been linked to multiple suspicious financial transactions. Your account has been suspended. Call immediately on 1-800-123-4567 or click https://verify-identity-now.com to verify your identity within 2 hours or your account will be permanently blocked. Do not share this message."
  }'
```

### Expected Response (200 OK)
```json
{
  "id": 1,
  "risk_score": 95,
  "risk_level": "Critical",
  "scam_type": "Digital Arrest Scam",
  "red_flags": [
    "Authority impersonation (CBI)",
    "Urgency tactics (2-hour deadline)",
    "Threat of account suspension",
    "Request for personal verification",
    "Suspicious phone number",
    "Phishing link",
    "All caps 'WARNING' text"
  ],
  "explanation": "This is a sophisticated digital arrest scam. The message impersonates an official CBI representative and threatens account suspension to create panic. The provided link is a phishing attempt to steal credentials. The urgency tactic (2-hour deadline) is a classic scam technique.",
  "recommendation": "DO NOT CLICK THE LINK OR CALL THE NUMBER. This is a fraud attempt. Report immediately to: 1) National Cyber Crime Reporting Portal (NCRP) at cybercrime.gov.in 2) Your bank's fraud department 3) Local police cyber cell. Change your passwords and enable two-factor authentication.",
  "evidence": {
    "phone_numbers": ["1-800-123-4567"],
    "urls": ["https://verify-identity-now.com"],
    "suspicious_keywords": ["urgent", "suspicious", "suspended", "blocked", "verify", "deadline"],
    "threats_identified": ["account suspended", "permanently blocked"]
  }
}
```

---

## 2. Analyze Text - UPI Fraud

### Request
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hi, I received your UPI payment request. I have initiated a refund for Rs. 5000 to your UPI ID. To confirm the refund, please share your UPI pin and MPIN immediately. Also share the OTP you receive on your phone. Transaction ID: TRX12345. Thanks!"
  }'
```

### Expected Response (200 OK)
```json
{
  "id": 2,
  "risk_score": 92,
  "risk_level": "Critical",
  "scam_type": "UPI Fraud",
  "red_flags": [
    "Requesting UPI PIN (never requested legitimately)",
    "Requesting MPIN (never requested legitimately)",
    "Requesting OTP (classic phishing technique)",
    "Fake transaction ID format",
    "Urgency in requesting sensitive information",
    "Impersonating payment system"
  ],
  "explanation": "This is a UPI-based fraud attempt. The scammer falsely claims to be refunding money and tricks the victim into sharing sensitive credentials (UPI PIN, MPIN, OTP). These are never requested by legitimate payment systems. Sharing these would allow unauthorized transactions.",
  "recommendation": "NEVER share your UPI PIN, MPIN, or OTP with anyone, not even bank staff. Report to NCRP immediately. Contact your bank's fraud department. Block the sender if in a messaging app. Monitor your UPI account for unauthorized transactions.",
  "evidence": {
    "phone_numbers": [],
    "urls": [],
    "suspicious_keywords": ["UPI pin", "MPIN", "OTP", "refund", "confirm"],
    "threats_identified": ["credential theft"]
  }
}
```

---

## 3. Analyze Text - OTP Scam

### Request
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Dear customer, we detected suspicious activity on your account. For security verification, please provide your 4-digit OTP sent to your registered mobile. Your account will be deactivated if not verified within 30 minutes. Contact support@bankhelp.co.in"
  }'
```

### Expected Response (200 OK)
```json
{
  "id": 3,
  "risk_score": 88,
  "risk_level": "Critical",
  "scam_type": "OTP Scam",
  "red_flags": [
    "Requesting OTP via message",
    "Creating false sense of urgency",
    "Threat of account deactivation",
    "Impersonating bank",
    "Suspicious email domain (bankhelp.co.in)"
  ],
  "explanation": "Classic OTP scam. Banks never request OTPs via message or email. The scammer creates urgency with threats to trick victims into sharing the OTP, which can be used to transfer funds or change account settings.",
  "recommendation": "Banks NEVER ask for OTPs. Delete this message and do not respond. If concerned, call your bank directly using the number on your ATM card. Report to NCRP. Enable additional security features like withdrawal limits.",
  "evidence": {
    "phone_numbers": [],
    "urls": [],
    "upi_ids": [],
    "emails": ["support@bankhelp.co.in"],
    "suspicious_keywords": ["OTP", "verify", "deactivated", "urgent"]
  }
}
```

---

## 4. Analyze Text - Loan Scam

### Request
```bash
curl -X POST http://localhost:8000/api/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Congratulations! You are pre-approved for a personal loan of Rs. 10 lakhs with 0% interest. No credit checks, instant approval. To proceed, deposit Rs. 5000 as processing fee to account Rajesh.upi@axis or call 7777788888. Offer valid for 24 hours only!"
  }'
```

### Expected Response (200 OK)
```json
{
  "id": 4,
  "risk_score": 85,
  "risk_level": "Critical",
  "scam_type": "Loan Scam",
  "red_flags": [
    "Unrealistic interest rate (0%)",
    "No credit checks claimed",
    "Instant approval promise",
    "Upfront processing fee demand",
    "Time-limited offer (pressure tactic)",
    "Suspicious UPI ID format"
  ],
  "explanation": "Loan scam attempting to collect upfront fees. Legitimate lenders never offer 0% interest, never bypass credit checks, and never demand upfront fees. The processing fee is a direct loss with no loan following.",
  "recommendation": "Never pay upfront fees for loans. File complaint with NCRP. The UPI ID owner is the actual fraudster. Block the sender. Report to RBI if it's a bank impersonation.",
  "evidence": {
    "phone_numbers": ["7777788888"],
    "upi_ids": ["Rajesh.upi@axis"],
    "suspicious_keywords": ["approved", "0% interest", "instant", "processing fee", "24 hours"]
  }
}
```

---

## 5. Analyze Image

### Request
```bash
curl -X POST http://localhost:8000/api/analyze-image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/suspicious_screenshot.jpg"
```

### Expected Response (200 OK)
```json
{
  "id": 5,
  "extracted_text": "Extracted text from the image...",
  "risk_score": 78,
  "risk_level": "High",
  "scam_type": "Phishing",
  "red_flags": [
    "Fake login page design",
    "Misspelled domain",
    "Suspicious form fields"
  ],
  "explanation": "Image contains a phishing page attempting to steal credentials.",
  "recommendation": "Do not enter any information. Delete the image/link. Report to NCRP.",
  "evidence": {
    "urls": ["https://secure-login-verify.com"],
    "suspicious_keywords": ["verify", "confirm", "update"]
  }
}
```

### Error Response - Invalid File Format (400)
```json
{
  "error": "File type not allowed. Allowed types: png, jpg, jpeg, gif, bmp, webp"
}
```

---

## 6. Generate Report

### Request
```bash
curl -X POST http://localhost:8000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "analysis_id": 1
  }'
```

### Expected Response (200 OK)
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
      "description": "This is a sophisticated digital arrest scam...",
      "communication_content": "This is an urgent message from the Central Bureau of Investigation...",
      "red_flags": [
        "Authority impersonation (CBI)",
        "Urgency tactics (2-hour deadline)",
        "Threat of account suspension",
        "Request for personal verification",
        "Suspicious phone number",
        "Phishing link"
      ]
    },
    "evidence": {
      "phone_numbers": ["1-800-123-4567"],
      "urls": ["https://verify-identity-now.com"],
      "suspicious_keywords": ["urgent", "suspicious", "suspended"],
      "threats_identified": ["account suspended", "permanently blocked"]
    },
    "action_recommended": "DO NOT CLICK THE LINK OR CALL THE NUMBER. This is a fraud attempt. Report immediately to: 1) NCRP 2) Your bank's fraud department 3) Local police cyber cell.",
    "reporting_instructions": [
      "Report to NCRP immediately",
      "Block any linked financial accounts",
      "Save all evidence and communication",
      "Do not respond to further communications from scammers",
      "Contact your bank/financial institution immediately",
      "File FIR with local police",
      "Monitor bank accounts for unauthorized transactions"
    ],
    "filing_authorities": [
      {
        "name": "NCRP (National Cyber Crime Reporting Portal)",
        "website": "https://www.cybercrime.gov.in",
        "recommended": true
      },
      {
        "name": "Local Cyber Police Cell",
        "website": "Contact your nearest police station",
        "recommended": true
      },
      {
        "name": "RBI (Reserve Bank of India)",
        "website": "https://www.rbi.org.in",
        "recommended": false
      }
    ]
  }
}
```

---

## 7. Get Dashboard Statistics

### Request
```bash
curl http://localhost:8000/api/dashboard
```

### Expected Response (200 OK)
```json
{
  "total_cases": 150,
  "critical_cases": 35,
  "high_cases": 45,
  "medium_cases": 50,
  "low_cases": 20,
  "categories": {
    "Digital Arrest Scam": 35,
    "UPI Fraud": 28,
    "OTP Scam": 22,
    "Phishing": 40,
    "Loan Scam": 15,
    "Investment Scam": 10
  },
  "daily_trends": [
    {
      "date": "2024-01-01",
      "cases": 5
    },
    {
      "date": "2024-01-02",
      "cases": 8
    },
    {
      "date": "2024-01-03",
      "cases": 12
    }
  ],
  "average_risk_score": 65.5
}
```

---

## 8. Retrieve Specific Analysis

### Request
```bash
curl http://localhost:8000/api/get-analysis/1
```

### Expected Response (200 OK)
```json
{
  "id": 1,
  "timestamp": "2024-01-15T10:30:45",
  "input_type": "text",
  "extracted_text": "This is an urgent message from the Central Bureau of Investigation...",
  "scam_type": "Digital Arrest Scam",
  "risk_score": 95,
  "risk_level": "Critical",
  "red_flags": [
    "Authority impersonation (CBI)",
    "Urgency tactics",
    "Threat of account suspension"
  ],
  "recommendation": "Report to NCRP immediately...",
  "explanation": "This is a sophisticated digital arrest scam...",
  "evidence_extraction": {
    "phone_numbers": ["1-800-123-4567"],
    "urls": ["https://verify-identity-now.com"],
    "upi_ids": [],
    "emails": [],
    "organizations": []
  },
  "status": "completed"
}
```

### Error Response - Not Found (404)
```json
{
  "error": "Analysis not found"
}
```

---

## 9. Health Check

### Request
```bash
curl http://localhost:8000/health
```

### Expected Response (200 OK)
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

---

## 10. Root Endpoint

### Request
```bash
curl http://localhost:8000/
```

### Expected Response (200 OK)
```json
{
  "name": "Citizen Fraud Shield Backend",
  "version": "1.0.0",
  "description": "AI-powered fraud detection system",
  "endpoints": {
    "analyze_text": "POST /api/analyze-text",
    "analyze_image": "POST /api/analyze-image",
    "generate_report": "POST /api/generate-report",
    "get_analysis": "GET /api/get-analysis/<id>",
    "dashboard": "GET /api/dashboard",
    "health": "GET /health"
  }
}
```

---

## Error Responses

### 400 Bad Request - Missing Field
```json
{
  "error": "Text must be at least 10 characters long"
}
```

### 400 Bad Request - Invalid File
```json
{
  "error": "No image file provided"
}
```

### 404 Not Found
```json
{
  "error": "Analysis not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error: [error message]"
}
```

---

## Testing with Python

```python
import requests

# Test text analysis
response = requests.post(
    'http://localhost:8000/api/analyze-text',
    json={"message": "Your account has been suspended. Click here to verify."}
)
print(response.json())

# Test image analysis
with open('suspicious_image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/analyze-image',
        files={'image': f}
    )
print(response.json())

# Get dashboard
response = requests.get('http://localhost:8000/api/dashboard')
print(response.json())
```

---

## Testing with JavaScript/Fetch

```javascript
// Test text analysis
const response = await fetch('http://localhost:8000/api/analyze-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Your bank account has been locked. Click here immediately."
  })
});
const data = await response.json();
console.log(data);

// Test image analysis
const formData = new FormData();
formData.append('image', imageFile);
const response = await fetch('http://localhost:8000/api/analyze-image', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data);

// Get dashboard
const response = await fetch('http://localhost:8000/api/dashboard');
const data = await response.json();
console.log(data);
```

---

## Tips

1. **Test with real fraud messages** for more accurate results
2. **Check logs** in `logs/fraud_detection_*.log` for debugging
3. **Images should be clear** with visible text for best OCR results
4. **First OCR call** may take 20-30 seconds as it downloads models
5. **Database persists** all analyses for later retrieval
