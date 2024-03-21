from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class SecurityTestResult(Base):
    __tablename__ = 'security_test_result'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    test_name = Column(String(255), nullable=False)
    result = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="test_results")
