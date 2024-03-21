from app.models.base import db_session
from app.models.request_log import RequestLog
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

class RequestLogService:
    @staticmethod
    def log_request(user_id, endpoint):
        try:
            new_request = RequestLog(user_id=user_id, endpoint=endpoint, timestamp=datetime.now())
            db_session.add(new_request)
            db_session.commit()
        except SQLAlchemyError as e:
            db_session.rollback()
            print(e)
