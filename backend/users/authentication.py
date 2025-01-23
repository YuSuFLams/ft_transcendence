from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.backends import ModelBackend
from .models import Account
import pyotp, smtplib
from django.core.mail import send_mail
from django.conf import settings

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
            if (not user.is_otp_active):
                return user
            elif send_otp(user):
                return user
        return None
    
def send_otp(user):
    try:
        totp = pyotp.TOTP(user.otp_secret)
        now_otp = totp.now()
        send_mail(f'Your Pong code is {now_otp}',
            f'Hey {user.username}, Please Enter the code below to verify your login \n{now_otp}',
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False)
        return True
    except smtplib.SMTPException as e:
        print('[-] Failed to send the OTP code ' + e)
        return False