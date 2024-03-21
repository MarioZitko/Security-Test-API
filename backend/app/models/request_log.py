from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class RequestLog(Base):
    __tablename__ = 'request_log'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    endpoint = Column(String(255), nullable=False)
    timestamp = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="requests")
