from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from flask import current_app

Base = declarative_base()

class Database:
    def __init__(self):
        self.engine = None
        self.SessionLocal = None
    
    def init_app(self, app):
        """Initialize database with Flask app"""
        self.engine = create_engine(
            app.config['SQLALCHEMY_DATABASE_URI'],
            echo=app.config['DEBUG']
        )
        self.SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine
        )
        
        # Create all tables
        Base.metadata.create_all(bind=self.engine)
    
    def get_session(self):
        """Get database session"""
        return self.SessionLocal()
    
    def close_session(self, session):
        """Close database session"""
        if session:
            session.close()

db = Database()
