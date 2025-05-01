import os
from .settings import *
from .settings import BASE_DIR

# Hosts & security
ALLOWED_HOSTS = [os.environ.get('WEBSITE_HOSTNAME', '')]
CSRF_TRUSTED_ORIGINS = [f"https://{ALLOWED_HOSTS[0]}"]
DEBUG = False
SECRET_KEY = os.environ['MY_SECRET_KEY']


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", 
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

# Static files
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}
STATIC_ROOT = BASE_DIR / "staticfiles"

# Parse the Azure Postgres connection string (format: key1=val1;key2=val2;…)
raw = os.environ.get("AZURE_POSTGRESQL_CONNECTIONSTRING", "")
pairs = [p for p in raw.split(";") if p and "=" in p]
CONNECTION_STR = dict(pair.split("=", 1) for pair in pairs)

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",        # backends (plural)
        "NAME": CONNECTION_STR.get("dbname", ""),         # uppercase NAME
        "HOST": CONNECTION_STR.get("host", ""),
        "USER": CONNECTION_STR.get("user", ""),
        "PASSWORD": CONNECTION_STR.get("password", ""),
    }
}
