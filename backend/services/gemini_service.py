import json
from groq import Groq
from utils.logger import get_logger

logger = get_logger(__name__)

class GeminiService:
    def __init__(self, api_key):
        self.client = Groq(api_key=api_key)
        self.model = 'llama-3.3-70b-versatile'

    def analyze_for_fraud(self, text):
        try:
            prompt = self._build_analysis_prompt(text)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        'role': 'system',
                        'content': (
                            'You are an expert fraud detection AI specializing in Indian cybercrime patterns. '
                            'You must respond ONLY with valid JSON — no markdown, no code blocks, no extra text.'
                        )
                    },
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.1,
                max_tokens=1024,
            )
            result_text = response.choices[0].message.content
            analysis = self._parse_response(result_text)
            logger.info(f"Fraud analysis completed: {analysis.get('scam_type')}")
            return analysis
        except Exception as e:
            logger.error(f"Error in Groq analysis: {str(e)}")
            return self._get_error_response(str(e))

    def _build_analysis_prompt(self, text):
        return f"""Analyze the following suspicious communication for fraud. Return ONLY a JSON object with no extra text.

SUSPICIOUS COMMUNICATION:
{text}

Return exactly this JSON structure:
{{
    "scam_type": "specific scam type (e.g. UPI Fraud, OTP Scam, Digital Arrest, Phishing, Loan Scam, Prize Scam, etc.)",
    "risk_score": <integer 0-100>,
    "risk_level": "Critical or High or Medium or Low",
    "red_flags": ["specific red flag 1", "specific red flag 2"],
    "explanation": "detailed explanation of the fraud indicators found",
    "recommendation": "step-by-step action for the victim to take",
    "evidence": {{
        "phone_numbers": ["any phone numbers found"],
        "urls": ["any URLs found"],
        "suspicious_keywords": ["urgent", "OTP", "blocked", etc.],
        "threats_identified": ["account blocked", "legal action", etc.]
    }}
}}

Rules:
- risk_score 80-100 = Critical, 60-79 = High, 40-59 = Medium, 0-39 = Low
- Focus on Indian fraud patterns (NCRP, UPI, Aadhaar, bank impersonation, etc.)
- Be specific, not generic"""

    def _parse_response(self, response_text):
        try:
            cleaned = response_text.strip()
            if cleaned.startswith('```json'):
                cleaned = cleaned[7:]
            if cleaned.startswith('```'):
                cleaned = cleaned[3:]
            if cleaned.endswith('```'):
                cleaned = cleaned[:-3]
            result = json.loads(cleaned.strip())
            return self._validate_analysis_result(result)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Groq response: {str(e)}")
            logger.debug(f"Raw response: {response_text}")
            return self._get_error_response("Failed to parse fraud analysis")

    def _validate_analysis_result(self, result):
        defaults = {
            'scam_type': result.get('scam_type', 'Unknown'),
            'risk_score': float(result.get('risk_score', 0)),
            'risk_level': result.get('risk_level', 'Medium'),
            'red_flags': result.get('red_flags', []),
            'explanation': result.get('explanation', 'Unable to determine'),
            'recommendation': result.get('recommendation', 'Monitor account activity'),
            'evidence': result.get('evidence', {})
        }
        defaults['risk_score'] = max(0, min(100, defaults['risk_score']))
        if defaults['risk_level'] not in ['Critical', 'High', 'Medium', 'Low']:
            score = defaults['risk_score']
            defaults['risk_level'] = 'Critical' if score >= 80 else 'High' if score >= 60 else 'Medium' if score >= 40 else 'Low'
        return defaults

    def _get_error_response(self, error_message):
        return {
            'scam_type': 'Unknown',
            'risk_score': 0,
            'risk_level': 'Low',
            'red_flags': [error_message],
            'explanation': f'Analysis failed: {error_message}',
            'recommendation': 'Please try again or contact support',
            'evidence': {}
        }
