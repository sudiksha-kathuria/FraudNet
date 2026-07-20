import json
from groq import Groq
from utils.logger import get_logger

logger = get_logger(__name__)


class ClaudeService:
    """
    Multi-agent fraud analysis pipeline.
    Uses Groq (llama-3.3-70b-versatile, free tier) to simulate 4 specialized agents.
    Keeps the same interface as the original Claude-based service so nothing else changes.
    """

    def __init__(self, api_key):
        self.client = Groq(api_key=api_key)
        self.model  = 'llama-3.3-70b-versatile'

    # ── Public API ─────────────────────────────────────────────────────────────

    def analyze_multi_agent(self, text):
        """
        Run 4 specialized agents in sequence.
        Returns a dict compatible with the rest of the app.
        """
        try:
            logger.info("Starting multi-agent Groq analysis (4 agents)")

            evidence       = self._agent_evidence(text)
            classification = self._agent_classify(text)
            risk           = self._agent_risk(text)
            advisory       = self._agent_advisory(text)

            result = {
                'agents': {
                    'evidence':       evidence,
                    'classification': classification,
                    'risk':           risk,
                    'advisory':       advisory,
                },
                # Flattened fields for API response compatibility
                'scam_type':      classification.get('scam_type', 'Unknown'),
                'risk_score':     float(risk.get('risk_score', 0)),
                'risk_level':     risk.get('risk_level', 'Medium'),
                'red_flags':      risk.get('red_flags', []),
                'explanation':    advisory.get('explanation', ''),
                'recommendation': '\n'.join(advisory.get('immediate_steps', [])),
                'evidence': {
                    'phone_numbers':       evidence.get('phone_numbers', []),
                    'urls':                evidence.get('urls', []),
                    'upi_ids':             evidence.get('upi_ids', []),
                    'emails':              evidence.get('emails', []),
                    'organizations':       evidence.get('organizations', []),
                    'suspicious_keywords': evidence.get('suspicious_keywords', []),
                },
            }

            logger.info(f"Multi-agent analysis complete: {result['scam_type']} ({result['risk_level']})")
            return result

        except Exception as e:
            logger.error(f"Multi-agent analysis failed: {str(e)}")
            return self._error_response(str(e))

    # ── Private helpers ────────────────────────────────────────────────────────

    def _call(self, system_prompt, user_content):
        """Single Groq call — returns parsed JSON."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user',   'content': user_content},
            ],
            temperature=0.1,
            max_tokens=1024,
        )
        raw = response.choices[0].message.content.strip()

        # Strip markdown fences if model added them
        if raw.startswith('```json'): raw = raw[7:]
        if raw.startswith('```'):     raw = raw[3:]
        if raw.endswith('```'):       raw = raw[:-3]

        return json.loads(raw.strip())

    def _agent_evidence(self, text):
        """Agent 1 — Evidence Extraction"""
        try:
            return self._call(
                'You are Agent 1, a forensic evidence extraction specialist for Indian cybercrime. '
                'Extract all concrete identifiers from the message. '
                'You MUST respond with ONLY valid JSON and nothing else.',
                f"""Extract evidence from this suspicious message:
{text}

Respond with ONLY this JSON object (no explanation, no markdown):
{{
    "phone_numbers": [],
    "urls": [],
    "upi_ids": [],
    "emails": [],
    "organizations": [],
    "suspicious_keywords": []
}}"""
            )
        except Exception as e:
            logger.warning(f"Agent 1 (evidence) failed: {e}")
            return {}

    def _agent_classify(self, text):
        """Agent 2 — Fraud Classification"""
        try:
            return self._call(
                'You are Agent 2, an Indian cybercrime fraud classifier. '
                'Identify the exact scam type from known Indian fraud categories. '
                'You MUST respond with ONLY valid JSON and nothing else.',
                f"""Classify this suspicious message:
{text}

Respond with ONLY this JSON object (no explanation, no markdown):
{{
    "scam_type": "one of: UPI Fraud, OTP Scam, Digital Arrest Scam, Phishing, Loan Scam, Prize/Lottery Scam, Tech Support Scam, Job Scam, KYC Scam, Bank Impersonation, Investment Scam, Other",
    "confidence": 0,
    "sub_category": "",
    "similar_known_scams": []
}}"""
            )
        except Exception as e:
            logger.warning(f"Agent 2 (classification) failed: {e}")
            return {'scam_type': 'Unknown', 'confidence': 0}

    def _agent_risk(self, text):
        """Agent 3 — Risk Assessment"""
        try:
            return self._call(
                'You are Agent 3, a cybercrime risk assessment specialist. '
                'Score the risk precisely based on urgency, financial threats, impersonation, and target vulnerability. '
                'You MUST respond with ONLY valid JSON and nothing else.',
                f"""Assess the risk of this suspicious message:
{text}

Respond with ONLY this JSON object (no explanation, no markdown):
{{
    "risk_score": 0,
    "risk_level": "Critical or High or Medium or Low",
    "red_flags": [],
    "severity_reason": ""
}}

Scoring rules: 80-100 = Critical, 60-79 = High, 40-59 = Medium, 0-39 = Low"""
            )
        except Exception as e:
            logger.warning(f"Agent 3 (risk) failed: {e}")
            return {'risk_score': 0, 'risk_level': 'Low', 'red_flags': []}

    def _agent_advisory(self, text):
        """Agent 4 — Citizen Advisory"""
        try:
            return self._call(
                'You are Agent 4, a citizen safety advisor for protecting Indians from cybercrime. '
                'Give clear, actionable advice in simple language relevant to India. '
                'You MUST respond with ONLY valid JSON and nothing else.',
                f"""Advise a citizen who received this suspicious message:
{text}

Respond with ONLY this JSON object (no explanation, no markdown):
{{
    "explanation": "",
    "immediate_steps": ["step 1", "step 2", "step 3"],
    "report_to": ["NCRP - cybercrime.gov.in"],
    "recommendation": ""
}}"""
            )
        except Exception as e:
            logger.warning(f"Agent 4 (advisory) failed: {e}")
            return {'explanation': 'Analysis failed', 'immediate_steps': [], 'recommendation': 'Contact support'}

    def _error_response(self, error_msg):
        return {
            'agents':         {},
            'scam_type':      'Unknown',
            'risk_score':     0,
            'risk_level':     'Low',
            'red_flags':      [f'Analysis error: {error_msg}'],
            'explanation':    f'Multi-agent analysis failed: {error_msg}',
            'recommendation': 'Please try again',
            'evidence':       {},
        }
