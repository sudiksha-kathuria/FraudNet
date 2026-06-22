from flask import Blueprint, jsonify
from utils.logger import get_logger
from services import ReportService

logger = get_logger(__name__)

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')

@dashboard_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """
    GET /dashboard
    
    Get dashboard analytics data
    
    Output:
    {
        "total_cases": 100,
        "critical_cases": 35,
        "high_cases": 25,
        "medium_cases": 30,
        "low_cases": 10,
        "categories": {
            "Digital Arrest": 35,
            "UPI Fraud": 25,
            ...
        },
        "daily_trends": [
            {"date": "2024-01-01", "cases": 5},
            ...
        ],
        "average_risk_score": 65.5
    }
    """
    try:
        logger.info("Retrieving dashboard data")
        
        report_service = ReportService()
        dashboard_data = report_service.get_dashboard_data()
        
        return jsonify(dashboard_data), 200
    
    except Exception as e:
        logger.error(f"Error in get_dashboard: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
