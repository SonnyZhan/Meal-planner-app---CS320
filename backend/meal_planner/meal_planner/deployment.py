import os
import shlex
from .settings import *
from .settings import BASE_DIR

# Hosts & security
ALLOWED_HOSTS = [os.environ.get("WEBSITE_HOSTNAME", "")]
CSRF_TRUSTED_ORIGINS = [f"https://{ALLOWED_HOSTS[0]}"]
DEBUG = False
SECRET_KEY = os.environ["MY_SECRET_KEY"]

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

# ─── Parse Azure's space-delimited libpq string ────────────────────────────────
raw = os.environ.get("AZURE_POSTGRESQL_CONNECTIONSTRING", "")
# replace any semicolons with spaces, then shlex-split on whitespace
tokens = shlex.split(raw.replace(";", " "))
# build a dict of { key: value }
conn = dict(token.split("=", 1) for token in tokens if "=" in token)

# ─── Database configuration ───────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE":   "django.db.backends.postgresql",
        "NAME":     conn.get("dbname",    ""),        # e.g. "umass-meal-planner-database"
        "HOST":     conn.get("host",      ""),        # e.g. "umass-meal-planner-server.postgres.database.azure.com"
        "USER":     conn.get("user",      ""),        # your username
        "PASSWORD": conn.get("password",  ""),
        "PORT":     conn.get("port",     "5432"),
        "OPTIONS":  {"sslmode": conn.get("sslmode", "require")},
    }
}
