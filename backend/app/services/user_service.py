from app.models.base import db_session
from app.models.user import User
from sqlalchemy.exc import SQLAlchemyError

class UserService:
    @staticmethod
    def add_user(username, email, password_hash):
        try:
            new_user = User(username=username, email=email, password_hash=password_hash)
            db_session.add(new_user)
            db_session.commit()
            return new_user
        except SQLAlchemyError as e:
            db_session.rollback()
            print(e)
            return None
