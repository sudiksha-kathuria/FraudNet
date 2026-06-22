import os
import logging
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from database import db
from models import FraudReport
from services import (
    GeminiService,
    OCRService,
    FraudAnalysisService,
    ReportService
)
from routes import register_routes
from routes.analysis import init_analysis_routes
from utils import setup_logging

# Load environment variables
load_dotenv()

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

def create_app(config_name=None):
    """Create Flask application factory"""
    
    # Determine config
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config.get(config_name, config['default']))
    
    # Initialize database
    db.init_app(app)
    
    # Create upload folder
    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    # Configure CORS
    CORS(
        app,
        origins=app.config['CORS_ORIGINS'],
        methods=app.config['CORS_METHODS'],
        allow_headers=app.config['CORS_ALLOW_HEADERS'],
        supports_credentials=True
    )
    
    # Initialize services
    try:
        api_key = app.config['GEMINI_API_KEY']
        if not api_key:
            logger.warning("GEMINI_API_KEY not set. Fraud analysis may not work properly.")
        
        gemini_service = GeminiService(api_key)
        logger.info("Gemini service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini service: {str(e)}")
        gemini_service = None
    
    try:
        ocr_service = OCRService()
        logger.info("OCR service initialized")
    except Exception as e:
        logger.warning(f"Failed to initialize OCR service: {str(e)}")
        ocr_service = None
    
    # Initialize fraud analysis service
    fraud_analysis_service = FraudAnalysisService(gemini_service, ocr_service)
    logger.info("Fraud analysis service initialized")
    
    # Initialize route services
    init_analysis_routes(app, fraud_analysis_service, gemini_service)
    
    # Register routes
    register_routes(app)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Citizen Fraud Shield Backend is running',
            'services': {
                'gemini': 'initialized' if gemini_service else 'failed',
                'ocr': 'initialized' if ocr_service else 'failed',
                'database': 'initialized'
            }
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'name': 'Citizen Fraud Shield Backend',
            'version': '1.0.0',
            'description': 'AI-powered fraud detection system',
            'endpoints': {
                'analyze_text': 'POST /api/analyze-text',
                'analyze_image': 'POST /api/analyze-image',
                'generate_report': 'POST /api/generate-report',
                'get_analysis': 'GET /api/get-analysis/<id>',
                'dashboard': 'GET /api/dashboard',
                'health': 'GET /health'
            }
        }), 200
    
    # Request/response logging
    @app.before_request
    def log_request():
        logger.debug(f"{request.method} {request.path}")
    
    logger.info(f"Flask app initialized with config: {config_name}")
    
    return app

if __name__ == '__main__':
    from flask import request
    
    app = create_app()
    
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_DEBUG', True)
    
    logger.info(f"Starting server on {host}:{port}")
    
    app.run(host=host, port=port, debug=debug)
