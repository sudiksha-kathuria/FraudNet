from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from utils.logger import get_logger
from utils.validators import validate_text_input, validate_file, validate_analysis_id
from utils.helpers import generate_filename

logger = get_logger(__name__)

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api')

# Set by app factory
fraud_analysis_service = None
groq_service           = None
claude_service         = None


def init_analysis_routes(app, fraud_service, groq_svc, claude_svc=None):
    """Initialize analysis routes with services"""
    global fraud_analysis_service, groq_service, claude_service
    fraud_analysis_service = fraud_service
    groq_service           = groq_svc
    claude_service         = claude_svc


@analysis_bp.route('/analyze-text', methods=['POST'])
def analyze_text():
    """POST /api/analyze-text — analyze text for fraud"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        message        = data.get('message', '').strip()
        location_city  = data.get('location_city', None)
        location_state = data.get('location_state', None)

        errors = validate_text_input(message)
        if errors:
            return jsonify({'error': errors[0]}), 400

        logger.info(f"Analyzing text: {len(message)} characters")
        result = fraud_analysis_service.analyze_text(message, location_city, location_state)

        if 'error' in result:
            return jsonify(result), 400
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error in analyze_text: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@analysis_bp.route('/analyze-image', methods=['POST'])
def analyze_image():
    """POST /api/analyze-image — OCR + analyze image for fraud"""
    try:
        from flask import current_app

        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        location_city  = request.form.get('location_city', None)
        location_state = request.form.get('location_state', None)

        errors = validate_file(
            file,
            current_app.config['ALLOWED_EXTENSIONS'],
            current_app.config['MAX_FILE_SIZE']
        )
        if errors:
            return jsonify({'error': errors[0]}), 400

        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        filename = secure_filename(generate_filename(file.filename))
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        logger.info(f"Image saved: {filepath}")

        result = fraud_analysis_service.analyze_image(filepath, location_city, location_state)

        if 'error' in result:
            try:
                os.remove(filepath)
            except Exception:
                pass
            return jsonify(result), 400
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error in analyze_image: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@analysis_bp.route('/generate-report', methods=['POST'])
def generate_report():
    """POST /api/generate-report — generate NCRP-style complaint report"""
    try:
        from services import ReportService
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        analysis_id = data.get('analysis_id')
        errors = validate_analysis_id(analysis_id)
        if errors:
            return jsonify({'error': errors[0]}), 400

        logger.info(f"Generating report for analysis: {analysis_id}")
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
    """GET /api/get-analysis/<id> — retrieve analysis by ID"""
    try:
        logger.info(f"Retrieving analysis: {analysis_id}")
        result = fraud_analysis_service.get_report_by_id(analysis_id)
        if not result:
            return jsonify({'error': 'Analysis not found'}), 404
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error in get_analysis: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@analysis_bp.route('/check-url', methods=['GET'])
def check_url():
    """GET /api/check-url?url=<encoded_url> — VirusTotal URL safety check"""
    try:
        from flask import current_app
        import requests as req_lib
        import hashlib

        url = request.args.get('url', '').strip()
        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        vt_key = current_app.config.get('VIRUSTOTAL_API_KEY', '')
        if not vt_key:
            return jsonify({'error': 'VirusTotal API key not configured', 'malicious': 0, 'suspicious': 0, 'harmless': 0}), 200

        url_id = hashlib.sha256(url.encode()).hexdigest()
        vt_url = f"https://www.virustotal.com/api/v3/urls/{url_id}"
        headers = {'x-apikey': vt_key}

        resp = req_lib.get(vt_url, headers=headers, timeout=5)
        if resp.status_code == 200:
            stats = resp.json()['data']['attributes']['last_analysis_stats']
            return jsonify({
                'url': url,
                'malicious':  stats.get('malicious', 0),
                'suspicious': stats.get('suspicious', 0),
                'harmless':   stats.get('harmless', 0),
                'undetected': stats.get('undetected', 0),
            }), 200

        return jsonify({'url': url, 'malicious': 0, 'suspicious': 0, 'harmless': 0, 'error': 'Not found in VirusTotal'}), 200

    except Exception as e:
        logger.error(f"Error in check_url: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500
