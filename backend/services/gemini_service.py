import json
import google.generativeai as genai
from utils.logger import get_logger

logger = get_logger(__name__)

class GeminiService:
    """Service for Google Gemini API integration"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def analyze_for_fraud(self, text):
        """
        Analyze text for fraud using Gemini API
        Simulates multi-agent workflow:
        - Agent 1: Evidence Extraction
        - Agent 2: Fraud Classification
        - Agent 3: Risk Assessment
        - Agent 4: Citizen Advisory
        """
        try:
            prompt = self._build_analysis_prompt(text)
            response = self.model.generate_content(prompt)
            
            # Parse response
            analysis_result = self._parse_response(response.text)
            logger.info(f"Fraud analysis completed: {analysis_result.get('scam_type')}")
            
            return analysis_result
        except Exception as e:
            logger.error(f"Error in Gemini analysis: {str(e)}")
            return self._get_error_response(str(e))
    
    def _build_analysis_prompt(self, text):
        """Build the prompt for Gemini API"""
        return f"""
You are an expert fraud detection AI system. Analyze the following suspicious communication for fraud indicators.

SUSPICIOUS COMMUNICATION:
{text}

Please perform a comprehensive fraud analysis and return ONLY a valid JSON response (no markdown, no code blocks) with the following structure:
{{
    "scam_type": "Type of scam (e.g., Digital Arrest, UPI Fraud, OTP Scam, Phishing, Loan Scam, Investment Scam, Tech Support Scam, Prize Scam, etc.)",
    "risk_score": "A number between 0-100 indicating fraud risk",
    "risk_level": "Critical (80-100), High (60-79), Medium (40-59), or Low (0-39)",
    "red_flags": ["List of specific red flags found in the communication"],
    "explanation": "Detailed explanation of why this is identified as fraud",
    "recommendation": "Specific action recommendations for the user (including reporting to NCRP if critical)",
    "evidence": {{
        "phone_numbers": ["extracted phone numbers"],
        "urls": ["extracted URLs"],
        "suspicious_keywords": ["keywords indicating fraud"],
        "threats_identified": ["threats mentioned in communication"]
    }}
}}

Ensure the JSON is valid and parseable. Focus on Indian fraud patterns and scams common in India.
"""
    
    def _parse_response(self, response_text):
        """Parse Gemini response"""
        try:
            # Remove markdown code blocks if present
            cleaned_text = response_text.strip()
            if cleaned_text.startswith('```json'):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith('```'):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith('```'):
                cleaned_text = cleaned_text[:-3]
            
            result = json.loads(cleaned_text.strip())
            
            # Validate and normalize the response
            return self._validate_analysis_result(result)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini response: {str(e)}")
            logger.debug(f"Raw response: {response_text}")
            return self._get_error_response("Failed to parse fraud analysis")
    
    def _validate_analysis_result(self, result):
        """Validate and normalize analysis result"""
        # Ensure required fields exist
        defaults = {
            'scam_type': result.get('scam_type', 'Unknown'),
            'risk_score': float(result.get('risk_score', 0)),
            'risk_level': result.get('risk_level', 'Medium'),
            'red_flags': result.get('red_flags', []),
            'explanation': result.get('explanation', 'Unable to determine'),
            'recommendation': result.get('recommendation', 'Monitor account activity'),
            'evidence': result.get('evidence', {})
        }
        
        # Validate risk_score is within bounds
        if defaults['risk_score'] < 0:
            defaults['risk_score'] = 0
        elif defaults['risk_score'] > 100:
            defaults['risk_score'] = 100
        
        # Ensure risk_level is valid
        if defaults['risk_level'] not in ['Critical', 'High', 'Medium', 'Low']:
            defaults['risk_level'] = 'Medium'
        
        return defaults
    
    def _get_error_response(self, error_message):
        """Return error response in standard format"""
        return {
            'scam_type': 'Unknown',
            'risk_score': 0,
            'risk_level': 'Low',
            'red_flags': [error_message],
            'explanation': f'Analysis failed: {error_message}',
            'recommendation': 'Please try again or contact support',
            'evidence': {}
        }
    
    def generate_report_prompt(self, analysis):
        """Generate NCRP-style complaint report"""
        return f"""
Based on the following fraud analysis, generate a formal NCRP (National Cyber Crime Reporting Platform) style complaint:

Scam Type: {analysis.get('scam_type')}
Risk Level: {analysis.get('risk_level')}
Risk Score: {analysis.get('risk_score')}
Explanation: {analysis.get('explanation')}

Generate a formal, structured complaint report that includes:
1. Subject of complaint
2. Description of the fraudulent activity
3. Evidence/Red flags identified
4. Recommended action
5. Safety measures for the user

Format as a proper complaint summary suitable for filing with cybercrime authorities.
"""
