import easyocr
from PIL import Image
import os
from utils.logger import get_logger

logger = get_logger(__name__)

class OCRService:
    """Service for Optical Character Recognition using EasyOCR"""
    
    def __init__(self):
        """Initialize OCR reader"""
        try:
            self.reader = easyocr.Reader(['en', 'hi'])
            logger.info("OCR Reader initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OCR reader: {str(e)}")
            self.reader = None
    
    def extract_text_from_image(self, image_path):
        """Extract text from image using EasyOCR"""
        try:
            if not os.path.exists(image_path):
                logger.error(f"Image file not found: {image_path}")
                return None
            
            # Validate image
            try:
                Image.open(image_path)
            except Exception as e:
                logger.error(f"Invalid image file: {str(e)}")
                return None
            
            if self.reader is None:
                logger.error("OCR reader not initialized")
                return None
            
            # Extract text
            results = self.reader.readtext(image_path)
            
            # Combine extracted text
            extracted_text = '\n'.join([text[1] for text in results])
            
            logger.info(f"Text extracted from image: {len(extracted_text)} characters")
            
            return extracted_text if extracted_text.strip() else None
        
        except Exception as e:
            logger.error(f"Error extracting text from image: {str(e)}")
            return None
    
    def preprocess_image(self, image_path):
        """Preprocess image for better OCR results"""
        try:
            img = Image.open(image_path)
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Optionally enhance contrast
            from PIL import ImageEnhance
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.5)
            
            # Save preprocessed image
            preprocessed_path = image_path.replace('.', '_preprocessed.')
            img.save(preprocessed_path)
            
            logger.info(f"Image preprocessed: {preprocessed_path}")
            
            return preprocessed_path
        
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            return image_path
