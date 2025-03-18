from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.backends import ModelBackend
from .models import Account
from django.conf import settings
from rest_framework.permissions import BasePermission

#FIXME every request from the front should include Authorization header `bearer` with access token

class MyJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        auth_head = request.headers.get('Authorization')
        
        if (auth_head is None):
            return (None)
        
        try:
            auth_type = auth_head.split(" ")[0]
            if (auth_type != 'Bearer'):
                print('[-] Wrong auth Type')
                return None
            access_token = auth_head.split(" ")[1]
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
