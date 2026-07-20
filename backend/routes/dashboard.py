from flask import Blueprint, jsonify
from sqlalchemy import func
from utils.logger import get_logger
from services import ReportService
from database import db
from models import FraudReport

logger = get_logger(__name__)

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')


@dashboard_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """GET /api/dashboard — aggregated fraud statistics"""
    try:
        logger.info("Retrieving dashboard data")
        report_service = ReportService()
        dashboard_data = report_service.get_dashboard_data()
        return jsonify(dashboard_data), 200
    except Exception as e:
        logger.error(f"Error in get_dashboard: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@dashboard_bp.route('/live-feed', methods=['GET'])
def live_feed():
    """GET /api/live-feed — last 20 anonymised fraud reports for the ticker"""
    try:
        session = db.get_session()
        try:
            reports = (
                session.query(FraudReport)
                .order_by(FraudReport.timestamp.desc())
                .limit(20)
                .all()
            )
            data = [
                {
                    'id':             r.id,
                    'scam_type':      r.scam_type,
                    'risk_level':     r.risk_level,
                    'risk_score':     r.risk_score,
                    'timestamp':      r.timestamp.isoformat(),
                    'location_city':  r.location_city,
                    'location_state': r.location_state,
                }
                for r in reports
            ]
        finally:
            db.close_session(session)

        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error in live_feed: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@dashboard_bp.route('/heatmap', methods=['GET'])
def heatmap():
    """GET /api/heatmap — scam counts per Indian state"""
    try:
        session = db.get_session()
        try:
            rows = (
                session.query(
                    FraudReport.location_state,
                    func.count(FraudReport.id).label('count')
                )
                .filter(FraudReport.location_state.isnot(None))
                .group_by(FraudReport.location_state)
                .all()
            )
            data = [{'state': r.location_state, 'count': r.count} for r in rows]
        finally:
            db.close_session(session)

        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error in heatmap: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
