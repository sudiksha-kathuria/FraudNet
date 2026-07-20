from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from utils.logger import get_logger
from utils.validators import validate_text_input, validate_file, validate_analysis_id
from utils.helpers import generate_filename

logger = get_logger(__name__)

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api')

# This will be set by app
fraud_analysis_service = None
groq_service = None

def init_analysis_routes(app, fraud_service, groq_svc):
    """Initialize analysis routes with services"""
    global fraud_analysis_service, groq_service
    fraud_analysis_service = fraud_service
    groq_service = groq_svc

@analysis_bp.route('/analyze-text', methods=['POST'])
def analyze_text():
    """
    POST /analyze-text
    
    Analyze text for fraud
    
    Input:
    {
        "message": "user text"
    }
    
    Output:
    {
        "id": 1,
        "risk_score": 95,
        "risk_level": "Critical",
        "scam_type": "Digital Arrest Scam",
        "red_flags": [...],
        "explanation": "...",
        "recommendation": "...",
        "evidence": {...}
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        message = data.get('message', '').strip()
        
        # Validate text
        errors = validate_text_input(message)
        if errors:
            return jsonify({'error': errors[0]}), 400
        
        logger.info(f"Analyzing text: {len(message)} characters")
        
        # Analyze
        result = fraud_analysis_service.analyze_text(message)
        
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error in analyze_text: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@analysis_bp.route('/analyze-image', methods=['POST'])
def analyze_image():
    """
    POST /analyze-image
    
    Analyze image for fraud
    
    Input:
    multipart/form-data image file
    
    Output:
    {
        "id": 1,
        "extracted_text": "...",
        "risk_score": 92,
        "scam_type": "...",
        "risk_level": "...",
        "red_flags": [...],
        "explanation": "...",
        "recommendation": "...",
        "evidence": {...}
    }
    """
    try:
        from flask import current_app
        
        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        errors = validate_file(
            file,
            current_app.config['ALLOWED_EXTENSIONS'],
            current_app.config['MAX_FILE_SIZE']
        )
        
        if errors:
            return jsonify({'error': errors[0]}), 400
        
        # Create uploads directory if it doesn't exist
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        # Save file
        filename = secure_filename(generate_filename(file.filename))
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        logger.info(f"Image saved: {filepath}")
        
        # Analyze
        result = fraud_analysis_service.analyze_image(filepath)
        
        if 'error' in result:
            # Clean up file on error
            try:
                os.remove(filepath)
            except:
                pass
            return jsonify(result), 400
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error in analyze_image: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@analysis_bp.route('/generate-report', methods=['POST'])
def generate_report():
    """
    POST /generate-report
    
    Generate NCRP-style complaint report
    
    Input:
    {
        "analysis_id": 1
    }
    
    Output:
    {
        "report": {
            "complaint_id": "...",
            "complaint_date": "...",
            "complaint_type": "...",
            "incident_details": {...},
            "evidence": {...},
            "action_recommended": "...",
            "reporting_instructions": [...],
            "filing_authorities": [...]
        }
    }
    """
    try:
        from services import ReportService
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        analysis_id = data.get('analysis_id')
        
        # Validate analysis_id
        errors = validate_analysis_id(analysis_id)
        if errors:
            return jsonify({'error': errors[0]}), 400
        
        logger.info(f"Generating report for analysis: {analysis_id}")
        
        # Generate report
        report_service = ReportService()
        report = report_service.generate_ncrp_complaint(analysis_id, groq_service)
        
        if not report:
            return jsonify({'error': 'Analysis not found or error generating report'}), 404
        
        return jsonify({'report': report}), 200
    
    except Exception as e:
        logger.error(f"Error in generate_report: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@analysis_bp.route('/get-analysis/<int:analysis_id>', methods=['GET'])
def get_analysis(analysis_id):
    """
    GET /get-analysis/<analysis_id>
    
    Retrieve analysis by ID
    """
    try:
        logger.info(f"Retrieving analysis: {analysis_id}")
        
        # Get analysis
        result = fraud_analysis_service.get_report_by_id(analysis_id)
        
        if not result:
            return jsonify({'error': 'Analysis not found'}), 404
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error in get_analysis: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
