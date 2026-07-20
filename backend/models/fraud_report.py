from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from database import Base

class FraudReport(Base):
    """SQLAlchemy model for fraud reports"""
    __tablename__ = 'fraud_reports'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Input data
    input_type = Column(String(10), nullable=False)  # 'text' or 'image'
    extracted_text = Column(Text, nullable=True)
    image_path = Column(String(255), nullable=True)
    
    # Analysis results
    scam_type = Column(String(100), nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)  # Critical, High, Medium, Low
    red_flags = Column(JSON, nullable=True)
    recommendation = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    
    # Additional info
    evidence_extraction = Column(JSON, nullable=True)  # Phone numbers, URLs, UPI IDs, names, organizations
    agents_output = Column(JSON, nullable=True)         # Full multi-agent output
    status = Column(String(20), default='completed', nullable=False)

    # Location (optional, for heatmap)
    location_city  = Column(String(100), nullable=True)
    location_state = Column(String(100), nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'input_type': self.input_type,
            'extracted_text': self.extracted_text,
            'scam_type': self.scam_type,
            'risk_score': self.risk_score,
            'risk_level': self.risk_level,
            'red_flags': self.red_flags,
            'recommendation': self.recommendation,
            'explanation': self.explanation,
            'evidence_extraction': self.evidence_extraction,
            'agents_output': self.agents_output,
            'status': self.status,
            'location_city': self.location_city,
            'location_state': self.location_state,
        }
    
    def __repr__(self):
        return f'<FraudReport {self.id} - {self.scam_type} ({self.risk_level})>'
