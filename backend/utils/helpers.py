import os
import json
from datetime import datetime

def allowed_file(filename, allowed_extensions):
    """Check if file is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def get_file_extension(filename):
    """Get file extension"""
    if '.' in filename:
        return filename.rsplit('.', 1)[1].lower()
    return None

def generate_filename(original_filename):
    """Generate unique filename"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
    extension = get_file_extension(original_filename)
    return f"{timestamp}{original_filename}" if extension else original_filename

def parse_json_safely(json_string, default=None):
    """Safely parse JSON string"""
    try:
        return json.loads(json_string)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else {}

def extract_evidence(text):
    """
    Extract evidence from text using simple pattern matching
    Extracts phone numbers, URLs, UPI IDs, emails, etc.
    """
    import re
    
    evidence = {
        'phone_numbers': [],
        'urls': [],
        'upi_ids': [],
        'emails': [],
        'organizations': []
    }
    
    if not text:
        return evidence
    
    # Phone numbers (Indian format)
    phone_pattern = r'(?:\+91|0)?[-.\s]?[6-9]\d{2}[-.\s]?\d{3}[-.\s]?\d{4}'
    evidence['phone_numbers'] = list(set(re.findall(phone_pattern, text)))
    
    # URLs
    url_pattern = r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)'
    evidence['urls'] = list(set(re.findall(url_pattern, text)))
    
    # UPI IDs
    upi_pattern = r'[a-zA-Z0-9._-]+@[a-zA-Z]{3,}'
    evidence['upi_ids'] = list(set(re.findall(upi_pattern, text)))
    
    # Emails
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    evidence['emails'] = list(set(re.findall(email_pattern, text)))
    
    return evidence

def calculate_risk_level(risk_score):
    """Calculate risk level based on risk score"""
    if risk_score >= 80:
        return 'Critical'
    elif risk_score >= 60:
        return 'High'
    elif risk_score >= 40:
        return 'Medium'
    else:
        return 'Low'
