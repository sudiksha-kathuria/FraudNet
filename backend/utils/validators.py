import os
from werkzeug.utils import secure_filename

def validate_file(file, allowed_extensions, max_size):
    """Validate uploaded file"""
    errors = []
    
    if not file:
        errors.append('No file provided')
        return errors
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > max_size:
        errors.append(f'File size exceeds maximum limit of {max_size} bytes')
    
    # Check file extension
    if not is_allowed_file(file.filename, allowed_extensions):
        errors.append(f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}')
    
    return errors

def is_allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def validate_text_input(text, min_length=10, max_length=10000):
    """Validate text input"""
    errors = []
    
    if not text or not isinstance(text, str):
        errors.append('Text input is required and must be a string')
        return errors
    
    text = text.strip()
    
    if len(text) < min_length:
        errors.append(f'Text must be at least {min_length} characters long')
    
    if len(text) > max_length:
        errors.append(f'Text cannot exceed {max_length} characters')
    
    return errors

def validate_analysis_id(analysis_id):
    """Validate analysis ID"""
    errors = []
    
    try:
        aid = int(analysis_id)
        if aid <= 0:
            errors.append('Analysis ID must be a positive integer')
    except (TypeError, ValueError):
        errors.append('Analysis ID must be a valid integer')
    
    return errors
