# /app/services/database_service.py
from .user_service import UserService
from .request_log_service import RequestLogService
from .security_test_result_service import SecurityTestResultService

class DatabaseService:
    @staticmethod
    def create_user_and_log_request(username, email, password_hash, endpoint):
        new_user = UserService.add_user(username, email, password_hash)
        if new_user:
            RequestLogService.log_request(new_user.id, endpoint)
            return new_user
        return None
