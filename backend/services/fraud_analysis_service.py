from utils.logger import get_logger
from utils.helpers import extract_evidence, calculate_risk_level
from database import db
from models import FraudReport

logger = get_logger(__name__)

class FraudAnalysisService:
    """Service for fraud analysis and report management"""

    def __init__(self, groq_service, ocr_service, claude_service=None):
        self.groq_service   = groq_service
        self.ocr_service    = ocr_service
        self.claude_service = claude_service

    # ── Public methods ─────────────────────────────────────────────────────────

    def analyze_text(self, text, location_city=None, location_state=None):
        """
        Analyze text for fraud.
        Uses Claude multi-agent pipeline if available, falls back to Groq.
        """
        try:
            if self.claude_service:
                logger.info("Using Claude multi-agent pipeline")
                analysis = self.claude_service.analyze_multi_agent(text)
                agents_output = analysis.get('agents', {})
            else:
                logger.info("Claude not configured — falling back to Groq")
                analysis = self.groq_service.analyze_for_fraud(text)
                evidence = extract_evidence(text)
                analysis['evidence'] = evidence
                agents_output = None

            fraud_report = FraudReport(
                input_type='text',
                extracted_text=text,
                scam_type=analysis.get('scam_type', 'Unknown'),
                risk_score=analysis.get('risk_score', 0),
                risk_level=analysis.get('risk_level', 'Medium'),
                red_flags=analysis.get('red_flags', []),
                recommendation=analysis.get('recommendation', ''),
                explanation=analysis.get('explanation', ''),
                evidence_extraction=analysis.get('evidence', {}),
                agents_output=agents_output,
                location_city=location_city,
                location_state=location_state,
                status='completed'
            )

            session = db.get_session()
            try:
                session.add(fraud_report)
                session.commit()
                report_id = fraud_report.id
                logger.info(f"Fraud report saved: {report_id}")
            finally:
                db.close_session(session)

            response = {
                'id':             report_id,
                'scam_type':      analysis.get('scam_type', 'Unknown'),
                'risk_score':     analysis.get('risk_score', 0),
                'risk_level':     analysis.get('risk_level', 'Medium'),
                'red_flags':      analysis.get('red_flags', []),
                'explanation':    analysis.get('explanation', ''),
                'recommendation': analysis.get('recommendation', ''),
                'evidence':       analysis.get('evidence', {}),
                'agents':         agents_output,
            }
            return response

        except Exception as e:
            logger.error(f"Error analyzing text: {str(e)}")
            return {
                'error': str(e),
                'scam_type': 'Unknown',
                'risk_score': 0,
                'risk_level': 'Low',
                'red_flags': [],
                'recommendation': 'An error occurred during analysis'
            }

    def analyze_image(self, image_path, location_city=None, location_state=None):
        """
        Analyze image for fraud via OCR then multi-agent analysis.
        """
        try:
            extracted_text = self.ocr_service.extract_text_from_image(image_path)

            if not extracted_text:
                logger.warning(f"No text extracted from image: {image_path}")
                return {
                    'error': 'No text could be extracted from the image',
                    'scam_type': 'Unknown',
                    'risk_score': 0,
                    'risk_level': 'Low',
                    'red_flags': ['No text extracted'],
                    'recommendation': 'Please provide a clearer image with visible text'
                }

            # Run text analysis on extracted text
            result = self.analyze_text(extracted_text, location_city, location_state)
            result['extracted_text'] = extracted_text

            # Update image path in DB
            session = db.get_session()
            try:
                report = session.query(FraudReport).filter(FraudReport.id == result['id']).first()
                if report:
                    report.input_type = 'image'
                    report.image_path = image_path
                    session.commit()
            finally:
                db.close_session(session)

            return result

        except Exception as e:
            logger.error(f"Error analyzing image: {str(e)}")
            return {
                'error': str(e),
                'scam_type': 'Unknown',
                'risk_score': 0,
                'risk_level': 'Low',
                'red_flags': [],
                'recommendation': 'An error occurred during analysis'
            }

    def get_report_by_id(self, report_id):
        """Retrieve fraud report by ID"""
        try:
            session = db.get_session()
            try:
                report = session.query(FraudReport).filter(
                    FraudReport.id == report_id
                ).first()
                if not report:
                    logger.warning(f"Report not found: {report_id}")
                    return None
                return report.to_dict()
            finally:
                db.close_session(session)
        except Exception as e:
            logger.error(f"Error retrieving report: {str(e)}")
            return None
