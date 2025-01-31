from datetime import timedelta
from decouple import config
from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-9f^l+0p-ssb#3%wi@2hnrjvw7$&xnv!xo_3439$bl$e5=30#vq'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition
SITE_ID = 1

INSTALLED_APPS = [
    'game',
    'chat',
    'users',
    "daphne",
    'channels',
    'tournament',

    "rest_framework_simplejwt",
    "corsheaders",
    
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django.contrib.sites',
    'oauth2_provider',
]

OAUTH2_PROVIDER = {
    'ACCESS_TOKEN_EXPIRE_SECONDS': 3600 * 24 * 7,
    'SCOPES': {
        'read': 'Read scope',
        'write': 'Write scope',
        'openid': 'OpenID Connect access'
        }
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90),
    'BLACKLIST_AFTER_ROTATION': True, 
    "ROTATE_REFRESH_TOKENS": False,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",

    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_OBTAIN_SERIALIZER": "users.serializer.MyTokenObtainPairSerializer",
}

AUTHENTICATION_BACKENDS = [
    "users.authentication.emailORusername",
    "django.contrib.auth.backends.ModelBackend",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.MyJWTAuthentication',
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.AllowAny',
    ),
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',


]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',


                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = "backend.asgi.application"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Allow all origins (for development)
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://127.0.0.1:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://127.0.0.1:3000",
]

CORS_ALLOW_ALL_ORIGINS = True

#telling django, if there is no next param, after a login redirect to dash.


AUTH_USER_MODEL = 'users.Account'


####Oauth2 Google
CLIENT_SECRET_GOOGLE = config("CLIENT_SECRET_GOOGLE")
CLIENT_ID_GOOGLE = config("CLIENT_ID_GOOGLE")
API_GOOGLE = config("API_GOOGLE")

GOOGLE_JWKS = config("GOOGLE_JWKS")
GOOGLE_OAUTH_TOKEN = config("GOOGLE_OAUTH_TOKEN")
GOOGLE_REDIRECT = config("GOOGLE_REDIRECT")

####Oauth 42
CLIENT_SECRET_42 = config("CLIENT_SECRET_42")
CLIENT_ID_42 = config("CLIENT_ID_42")
API_42 = config("API_42")

####Email Config
EMAIL_BACKEND = config("EMAIL_BACKEND")
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_USE_TLS = config("EMAIL_USE_TLS")
EMAIL_PORT = config("EMAIL_PORT")
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")

#### Helpers
RESET_BASE_URI = config("RESET_BASE_URI")
RESET_TOKEN_EXP = config("RESET_TOKEN_EXP", default=300)

#TODO what if i log using oauth, and i requested to change my pass.
