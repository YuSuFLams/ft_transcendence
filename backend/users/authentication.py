from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.backends import ModelBackend
from .models import Account

class MyJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        
        if (access_token is None):
            return (None)
        
        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
        except:
            return (None)
        return (user, validated_token)

class emailORusername(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if '@' in username:
            try:
                user = Account.objects.get(email=username)
            except:
                return None
        else:
            try:
                user = Account.objects.get(username=username)
            except:
                return None
        if user.check_password(password):
            return user
        return None