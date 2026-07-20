import anthropic
import json
from utils.logger import get_logger

logger = get_logger(__name__)

class ClaudeService:
    """Multi-agent fraud analysis using Claude claude-sonnet-4-5"""

    def __init__(self, api_key):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = 'claude-sonnet-4-5'

    def analyze_multi_agent(self, text):
        """
        Run 4 specialized agents in sequence and return combined result.
        Returns dict with keys: evidence, classification, risk, advisory
        """
        try:
            logger.info("Starting multi-agent Claude analysis")

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
                # Flattened fields for API compatibility
                'scam_type':     classification.get('scam_type', 'Unknown'),
                'risk_score':    float(risk.get('risk_score', 0)),
                'risk_level':    risk.get('risk_level', 'Medium'),
                'red_flags':     risk.get('red_flags', []),
                'explanation':   advisory.get('explanation', ''),
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
        """Call Claude and return parsed JSON."""
        msg = self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            system=system_prompt,
            messages=[{'role': 'user', 'content': user_content}]
        )
        raw = msg.content[0].text.strip()
        # Strip markdown fences if present
        if raw.startswith('```json'): raw = raw[7:]
        if raw.startswith('```'):     raw = raw[3:]
        if raw.endswith('```'):       raw = raw[:-3]
        return json.loads(raw.strip())

    def _agent_evidence(self, text):
        """Agent 1: Evidence Extraction"""
        try:
            return self._call(
                'You are Agent 1 — a forensic evidence extraction specialist for Indian cybercrime. '
                'Extract all concrete evidence from the text. Respond ONLY with valid JSON.',
                f"""Extract evidence from this suspicious message:
{text}

Return ONLY this JSON (no extra text):
{{
    "phone_numbers": ["list any phone numbers found"],
    "urls": ["list any URLs or links found"],
    "upi_ids": ["list any UPI IDs found"],
    "emails": ["list any email addresses found"],
    "organizations": ["list any organization names impersonated"],
    "suspicious_keywords": ["list urgent/threatening keywords found"]
}}"""
            )
        except Exception as e:
            logger.warning(f"Agent 1 (evidence) failed: {e}")
            return {}

    def _agent_classify(self, text):
        """Agent 2: Fraud Classification"""
        try:
            return self._call(
                'You are Agent 2 — an Indian cybercrime fraud classifier. '
                'Classify the exact type of scam from the known Indian fraud categories. '
                'Respond ONLY with valid JSON.',
                f"""Classify this suspicious message:
{text}

Return ONLY this JSON (no extra text):
{{
    "scam_type": "one of: UPI Fraud, OTP Scam, Digital Arrest Scam, Phishing, Loan Scam, Prize/Lottery Scam, Tech Support Scam, Job Scam, KYC Scam, Bank Impersonation, Investment Scam, or Other",
    "confidence": 0,
    "sub_category": "more specific description",
    "similar_known_scams": ["list 1-2 similar known scam names"]
}}"""
            )
        except Exception as e:
            logger.warning(f"Agent 2 (classification) failed: {e}")
            return {'scam_type': 'Unknown', 'confidence': 0}

    def _agent_risk(self, text):
        """Agent 3: Risk Assessment"""
        try:
            return self._call(
                'You are Agent 3 — a cybercrime risk assessment specialist. '
                'Calculate a precise risk score based on urgency, threats, financial lures, and impersonation. '
                'Respond ONLY with valid JSON.',
                f"""Assess risk for this suspicious message:
{text}

Return ONLY this JSON (no extra text):
{{
    "risk_score": 0,
    "risk_level": "Critical or High or Medium or Low",
    "red_flags": ["specific red flag 1", "specific red flag 2"],
    "severity_reason": "one sentence explaining the primary risk driver"
}}

Rules: 80-100 = Critical, 60-79 = High, 40-59 = Medium, 0-39 = Low"""
            )
        except Exception as e:
            logger.warning(f"Agent 3 (risk) failed: {e}")
            return {'risk_score': 0, 'risk_level': 'Low', 'red_flags': []}

    def _agent_advisory(self, text):
        """Agent 4: Citizen Advisory"""
        try:
            return self._call(
                'You are Agent 4 — a citizen safety advisor specializing in protecting Indians from cybercrime. '
                'Give clear, actionable advice in simple language. Respond ONLY with valid JSON.',
                f"""Advise on this suspicious message:
{text}

Return ONLY this JSON (no extra text):
{{
    "explanation": "clear explanation of what this scam is and how it works",
    "immediate_steps": ["step 1", "step 2", "step 3"],
    "report_to": ["NCRP - cybercrime.gov.in", "other relevant authority"],
    "recommendation": "one-line summary recommendation"
}}"""
            )
        except Exception as e:
            logger.warning(f"Agent 4 (advisory) failed: {e}")
            return {'explanation': 'Analysis failed', 'immediate_steps': [], 'recommendation': 'Contact support'}

    def _error_response(self, error_msg):
        return {
            'agents': {},
            'scam_type': 'Unknown',
            'risk_score': 0,
            'risk_level': 'Low',
            'red_flags': [f'Analysis error: {error_msg}'],
            'explanation': f'Multi-agent analysis failed: {error_msg}',
            'recommendation': 'Please try again',
            'evidence': {},
        }
