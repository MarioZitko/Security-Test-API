# /app/services/security_test_result_service.py
from app.models.base import db_session
from app.models.security_test_result import SecurityTestResult
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

class SecurityTestResultService:
    @staticmethod
    def add_test_result(user_id, test_name, result):
        try:
            new_test_result = SecurityTestResult(user_id=user_id, test_name=test_name, result=result, timestamp=datetime.now())
            db_session.add(new_test_result)
            db_session.commit()
        except SQLAlchemyError as e:
            db_session.rollback()
            print(e)
