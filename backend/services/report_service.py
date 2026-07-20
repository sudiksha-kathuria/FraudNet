from datetime import datetime, timedelta
from sqlalchemy import func
from utils.logger import get_logger
from database import db
from models import FraudReport

logger = get_logger(__name__)

class ReportService:
    """Service for generating reports and analytics"""
    
    def generate_ncrp_complaint(self, analysis_id, groq_service):
        """Generate NCRP-style complaint report"""
        try:
            # Get analysis from database
            session = db.get_session()
            try:
                fraud_report = session.query(FraudReport).filter(
                    FraudReport.id == analysis_id
                ).first()
                
                if not fraud_report:
                    logger.warning(f"Analysis not found: {analysis_id}")
                    return None
                
                # Build complaint
                complaint = self._build_ncrp_complaint(fraud_report)
                
                logger.info(f"NCRP complaint generated for report: {analysis_id}")
                
                return complaint
            finally:
                db.close_session(session)
        
        except Exception as e:
            logger.error(f"Error generating NCRP complaint: {str(e)}")
            return None
    
    def _build_ncrp_complaint(self, fraud_report):
        """Build structured NCRP complaint"""
        complaint = {
            'complaint_id': str(fraud_report.id),
            'complaint_date': fraud_report.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'complaint_type': 'Cyber Fraud / Scam',
            'subject': f'{fraud_report.scam_type} - Cybercrime Report',
            'risk_assessment': {
                'risk_level': fraud_report.risk_level,
                'risk_score': fraud_report.risk_score,
                'severity': 'Urgent' if fraud_report.risk_level == 'Critical' else 'High' if fraud_report.risk_level == 'High' else 'Medium'
            },
            'incident_details': {
                'type_of_fraud': fraud_report.scam_type,
                'description': fraud_report.explanation,
                'communication_content': fraud_report.extracted_text[:500] + '...' if len(fraud_report.extracted_text or '') > 500 else fraud_report.extracted_text,
                'red_flags': fraud_report.red_flags
            },
            'evidence': fraud_report.evidence_extraction or {},
            'action_recommended': fraud_report.recommendation,
            'reporting_instructions': self._get_reporting_instructions(fraud_report.risk_level),
            'filing_authorities': [
                {
                    'name': 'NCRP (National Cyber Crime Reporting Portal)',
                    'website': 'https://www.cybercrime.gov.in',
                    'recommended': True
                },
                {
                    'name': 'Local Cyber Police Cell',
                    'website': 'Contact your nearest police station',
                    'recommended': True
                },
                {
                    'name': 'RBI (Reserve Bank of India)',
                    'website': 'https://www.rbi.org.in',
                    'recommended': fraud_report.scam_type in ['UPI Fraud', 'Digital Payment Scam']
                }
            ]
        }
        
        return complaint
    
    def _get_reporting_instructions(self, risk_level):
        """Get reporting instructions based on risk level"""
        base_instructions = [
            'Report to NCRP immediately',
            'Block any linked financial accounts',
            'Save all evidence and communication',
            'Do not respond to further communications from scammers'
        ]
        
        if risk_level == 'Critical':
            base_instructions.extend([
                'Contact your bank/financial institution immediately',
                'File FIR with local police',
                'Monitor bank accounts for unauthorized transactions'
            ])
        elif risk_level == 'High':
            base_instructions.extend([
                'Contact your bank/financial institution',
                'Change passwords for all online accounts',
                'Enable two-factor authentication'
            ])
        
        return base_instructions
    
    def get_dashboard_data(self):
        """Get dashboard analytics data"""
        try:
            session = db.get_session()
            try:
                # Total cases
                total_cases = session.query(func.count(FraudReport.id)).scalar() or 0
                
                # Critical cases
                critical_cases = session.query(func.count(FraudReport.id)).filter(
                    FraudReport.risk_level == 'Critical'
                ).scalar() or 0
                
                # Cases by scam type
                scam_type_counts = session.query(
                    FraudReport.scam_type,
                    func.count(FraudReport.id).label('count')
                ).group_by(FraudReport.scam_type).all()
                
                categories = {item[0]: item[1] for item in scam_type_counts}
                
                # Daily trends (last 30 days)
                daily_trends = self._get_daily_trends(session)
                
                dashboard_data = {
                    'total_cases': total_cases,
                    'critical_cases': critical_cases,
                    'high_cases': session.query(func.count(FraudReport.id)).filter(
                        FraudReport.risk_level == 'High'
                    ).scalar() or 0,
                    'medium_cases': session.query(func.count(FraudReport.id)).filter(
                        FraudReport.risk_level == 'Medium'
                    ).scalar() or 0,
                    'low_cases': session.query(func.count(FraudReport.id)).filter(
                        FraudReport.risk_level == 'Low'
                    ).scalar() or 0,
                    'categories': categories,
                    'daily_trends': daily_trends,
                    'average_risk_score': round(
                        session.query(func.avg(FraudReport.risk_score)).scalar() or 0, 2
                    )
                }
                
                logger.info("Dashboard data retrieved successfully")
                
                return dashboard_data
            finally:
                db.close_session(session)
        
        except Exception as e:
            logger.error(f"Error retrieving dashboard data: {str(e)}")
            return {
                'total_cases': 0,
                'critical_cases': 0,
                'categories': {},
                'daily_trends': [],
                'error': str(e)
            }
    
    def _get_daily_trends(self, session, days=30):
        """Get daily case trends"""
        trends = []
        
        for i in range(days, 0, -1):
            date = datetime.utcnow().date() - timedelta(days=i)
            
            count = session.query(func.count(FraudReport.id)).filter(
                func.date(FraudReport.timestamp) == date
            ).scalar() or 0
            
            trends.append({
                'date': date.strftime('%Y-%m-%d'),
                'cases': count
            })
        
        return trends
