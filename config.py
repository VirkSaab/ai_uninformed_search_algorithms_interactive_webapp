import string, random

class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 20))
    SESSION_COOKIE_SECURE = True


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = "dev"
    SESSION_COOKIE_SECURE = True


class TestingConfig(Config):
    TESTING = True
    SECRET_KEY = "dev"
    SESSION_COOKIE_SECURE = True
