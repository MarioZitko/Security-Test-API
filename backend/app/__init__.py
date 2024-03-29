from flask import Flask
from .routes.auth_routes import auth_bp
from .models.base import db_session, init_db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Registracija Blueprinta
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    # Inicijalizacija baze podataka
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()
    
    init_db()  # Kreira bazu podataka i tablice ako još ne postoje

    return app
