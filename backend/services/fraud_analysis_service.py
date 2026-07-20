from utils.logger import get_logger
from utils.helpers import extract_evidence, calculate_risk_level
from database import db
from models import FraudReport

logger = get_logger(__name__)

class FraudAnalysisService:
    """Service for fraud analysis and report management"""
    
    def __init__(self, groq_service, ocr_service):
        self.groq_service = groq_service
        self.ocr_service = ocr_service
    
    def analyze_text(self, text):
        """
        Analyze text for fraud
        
        Process:
        - Send message to Groq
        - Detect scam type
        - Calculate risk score
        - Generate explanation
        - Generate recommendations
        - Store in database
        """
        try:
            # Analyze using Groq
            analysis = self.groq_service.analyze_for_fraud(text)
            
            # Extract evidence
            evidence = extract_evidence(text)
            analysis['evidence'] = evidence
            
            # Create database record
            fraud_report = FraudReport(
                input_type='text',
                extracted_text=text,
                scam_type=analysis.get('scam_type', 'Unknown'),
                risk_score=analysis.get('risk_score', 0),
                risk_level=analysis.get('risk_level', 'Medium'),
                red_flags=analysis.get('red_flags', []),
                recommendation=analysis.get('recommendation', ''),
                explanation=analysis.get('explanation', ''),
                evidence_extraction=evidence,
                status='completed'
            )
            
            # Save to database
            session = db.get_session()
            try:
                session.add(fraud_report)
                session.commit()
                report_id = fraud_report.id
                logger.info(f"Fraud report saved: {report_id}")
            finally:
                db.close_session(session)
            
            # Return response with ID
            response = analysis.copy()
            response['id'] = report_id
            
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
    
    def analyze_image(self, image_path):
        """
        Analyze image for fraud
        
        Process:
        - Save image
        - OCR using EasyOCR
        - Extract text
        - Send text to Groq
        - Generate fraud analysis
        - Store in database
        """
        try:
            # Extract text from image
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
            
            # Analyze extracted text
            analysis = self.groq_service.analyze_for_fraud(extracted_text)
            
            # Extract evidence
            evidence = extract_evidence(extracted_text)
            analysis['evidence'] = evidence
            
            # Create database record
            fraud_report = FraudReport(
                input_type='image',
                extracted_text=extracted_text,
                image_path=image_path,
                scam_type=analysis.get('scam_type', 'Unknown'),
                risk_score=analysis.get('risk_score', 0),
                risk_level=analysis.get('risk_level', 'Medium'),
                red_flags=analysis.get('red_flags', []),
                recommendation=analysis.get('recommendation', ''),
                explanation=analysis.get('explanation', ''),
                evidence_extraction=evidence,
                status='completed'
            )
            
            # Save to database
            session = db.get_session()
            try:
                session.add(fraud_report)
                session.commit()
                report_id = fraud_report.id
                logger.info(f"Fraud report saved: {report_id}")
            finally:
                db.close_session(session)
            
            # Return response
            response = analysis.copy()
            response['id'] = report_id
            response['extracted_text'] = extracted_text
            
            return response
        
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
