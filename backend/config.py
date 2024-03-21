class Config:
    SECRET_KEY = 'tvoj_izuzetno_tajan_kljuc'
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://korisnik:lozinka@localhost/ime_baze'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
