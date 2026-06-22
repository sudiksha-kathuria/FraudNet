from flask import Blueprint
from .analysis import analysis_bp
from .dashboard import dashboard_bp

def register_routes(app):
    """Register all route blueprints"""
    app.register_blueprint(analysis_bp)
    app.register_blueprint(dashboard_bp)
