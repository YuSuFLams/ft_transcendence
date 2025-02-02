from django.shortcuts import  redirect
from django.contrib.auth.password_validation import validate_password
from .models import Account, ResetPassword
from .serializer import (ResetPasswordSerializerSuccess,
                         RegisterSerializer)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import  AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import jwt, json, requests
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.conf import settings
from urllib.parse import urlencode
from urllib.parse import unquote

# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    user_form = RegisterSerializer(data=request.data)
    if (user_form.is_valid()):
        valid = user_form.validated_data
        if (valid['password'] != valid['repassword']):
            return (Response({'error':'Passwords does not match'}, status=400))     

        try:
            validate_password(valid['password'])
        except:
            return (Response({'error':'The password does not comply with the requirements'}, status=400))

        user_form.save()
        return Response(user_form.data, status=200)
    return (Response(user_form.errors.values(), status=400))


class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            return Response({'Success':True, 'access':access_token, 'refresh':refresh_token}, status=200)
        except:
            return(Response({'success':False}, status=401))

class MyTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            req = super().post(request, *args, **kwargs)
            access_token = req.data['access']

            resp = Response()
            resp.set_cookie(
                key='access_token',
                value=access_token,
                secure=True,
                httponly=True,
                samesite='None',
                path='/'
            )
            resp.data = {'Refreshed':True}
            return resp
        except:
            return (Response({'Refreshed':False}))
        
@api_view(['GET'])
@permission_classes([AllowAny])
def lgn(request):
    base_url = settings.API_GOOGLE
    params = {
        'client_id' : settings.CLIENT_ID_GOOGLE,
        "redirect_uri" : settings.GOOGLE_REDIRECT,
        'response_type' : 'code',
        'scope' : 'openid email profile',
        'access_type' : 'offline',
        'prompt' : 'consent'
    }
    google_lgn = f'{base_url}?{urlencode(params)}'
    data = {'authorize_link': google_lgn}
    return Response(data, status=200)

@api_view(['GET'])
@permission_classes([AllowAny])
def lgn_42(request):
    data = {
        'authorize_link': settings.API_42  # Corrected typo in 'authorize_link'
    }
    return Response(data, status=200)  # Explicitly setting the status code

@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth2_callback(request):
    try:
        code = request.GET.get('code')
    except:
        return (Response({'error':'code field is required'},
                         status=400))
    
    token_url = settings.GOOGLE_OAUTH_TOKEN
    data = {
        'code':code,
        'client_id' : settings.CLIENT_ID_GOOGLE,
        'client_secret': settings.CLIENT_SECRET_GOOGLE,
        'redirect_uri' : settings.GOOGLE_REDIRECT,
        'grant_type': 'authorization_code'
    }

    try:
        response = requests.post(token_url, data=data)
        response_json = json.loads(response.content)
        id_token = response_json['id_token']
    except:
        return (Response({'error':'Incorrect response from google api'}, status=400))
    
    try:
        google_keys_url = settings.GOOGLE_JWKS
        jwks_client = jwt.PyJWKClient(google_keys_url)
        signing_key = jwks_client.get_signing_key_from_jwt(id_token)
        decoded = jwt.decode(id_token,
                            signing_key.key,
                            algorithms=['RS256'],
                            options={'verify_exp':False},
                            audience=settings.CLIENT_ID_GOOGLE)
    except:
        return (Response({'error':'Invalid signature/Failed to decode google response'}, status=400))


    tmp_email = decoded.get('email', '')
    tmp_username = decoded.get('name', '')

    user_mail = Account.objects.filter(email=tmp_email).first() or ''
    user_username = Account.objects.filter(username=tmp_username).first() or ''
    user_obj = None

    if user_mail and user_username:
        if (user_mail.id == user_username.id and user_username.is_oauth):
            user_obj = user_mail
        else:
            return (Response({'error':'Account with the same email/username exist.'}, status=403))
    elif user_mail or user_username:
        return (Response({'error':'Account with the same email/username exist'}, status=403))
    else:
        user_obj = Account(email=tmp_email,
                    username=tmp_username,
                    first_name=decoded['given_name'],
                    last_name=decoded['family_name'],
                    avatar=decoded['picture'],
                    is_oauth=True,
                    )
        user_obj.save()

    refresh_token = RefreshToken.for_user(user_obj)
    access_token = AccessToken.for_user(user_obj)

    return Response({'Success':True,
                     'access_token':str(access_token),
                     'refresh_token':str(refresh_token)})


@api_view(['GET'])
@permission_classes([AllowAny])
def oauth2_42_callback(request):
    try:
        code = request.GET.get('code')
    except:
        return(Response({'error':'Code field is required'}, status=400))

    token_url = 'https://api.intra.42.fr/oauth/token'
    data = {
        'code':code,
        'client_id' : settings.CLIENT_ID_42,
        'client_secret': settings.CLIENT_SECRET_42,
        'redirect_uri' : 'http://localhost:3000/oauth/',
        'grant_type': 'authorization_code'
    }

    try:
        response = requests.post(token_url, data=data)
        response_json = json.loads(response.content)
    except:
        return (Response({'error':'Failed to fetch data from 42 API'}, status=400))

    access_token = response_json['access_token']
    intra_me = 'https://api.intra.42.fr/v2/me'
    authorization_header = {'Authorization' : f'Bearer {access_token}'}
    try:
        response_42 = requests.get(intra_me, headers=authorization_header)
    except:
        return(Response({'error':'Cannot fetch 42 intra_me'}, status=400))

    decoded = response_42.json()
    tmp_email = decoded.get('email', '')
    tmp_username = decoded.get('login', '')

    user_mail = Account.objects.filter(email=tmp_email).first() or ''
    user_username = Account.objects.filter(username=tmp_username).first() or ''
    user_obj = None

    if user_mail and user_username:
        if (user_mail.id == user_username.id and user_username.is_oauth):
            user_obj = user_mail
        else:
            return (Response('Please use the login form.', status=403))
    elif user_mail or user_username:
        return (Response('Please use the login form.', status=403))
    else:
        user_obj = Account(email=tmp_email,
                    username=tmp_username,
                    first_name=decoded['first_name'],
                    last_name=decoded['last_name'],
                    avatar=decoded['image']['versions']['medium'],
                    is_oauth=True,
                    )
        user_obj.save()

    refresh_token = RefreshToken.for_user(user_obj)
    access_token = AccessToken.for_user(user_obj)

    return Response({'Success':True,
                     'access_token':str(access_token),
                     'refresh_token':str(refresh_token)},
                     status=200)

###### RESET PASS
from django.core.mail import send_mail
import pyotp

@api_view(['POST'])
@permission_classes([AllowAny])
def get_pub_data(request):
    try:
        user = Account.objects.get(email=request.data.get('email'))
    except Account.DoesNotExist:
        return (Response({'error':'The email is incorrect'}, status=400))
    return Response({'username':user.username, 'first_name':user.first_name, 'last_name':user.last_name}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_reset_mail(request):
    reset_email = request.data.get('email')
    if not reset_email:
        return (Response({'error': 'The email field is required'}, status=400))

    user = Account.objects.filter(email=reset_email)
    if (not user.exists()):
        return (Response({'error':'The email is incorrect'}, status=400))
    
    ####FIXME 
    # if (user.first().is_oauth):
    #     return (Response({'error':'Oauth account cannot reset the password'}, status=400))
    #### the first_name and last_name are optional, so they can be blank
    #### i think using username in case the full_name is blank is better
    ResetPassword.objects.filter(email=reset_email).delete()
    totp = pyotp.TOTP(pyotp.random_base32())
    code = totp.now()
    reseted = ResetPassword(email=reset_email, code=code)
    reseted.save()
    send_mail('Transcendence Reset Password',
            f'To reset your password, Use the secret code: {code}',
            settings.EMAIL_HOST_USER,
            [reset_email],
            fail_silently=False)
    return (Response('The reset email is sent, please check your email', status=200))

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_mail_check(request):
    try:
        reset_user = ResetPassword.objects.get(email=request.data.get('email'),
                                               code=request.data.get('code'))
        if (not reset_user.is_valid()):
            reset_user.delete()
            return (Response({'error': 'Reset token is invalid'}, status=400))
        if (reset_user.code != request.data.get('code')):
            return (Response({'error': 'The code is incorrect'}, status=400))
        return (Response({'Success': True}, status=200))
    except ResetPassword.DoesNotExist:
        return (Response({'error': 'Something went wrong'}, status=400))
    

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_mail_success(request):
    user_mail = request.data.get('email')
    if not user_mail:
        return (Response({'error':'Something went wrong'}, status=400))
    
    ####FIXME 
    # add 'code' as post parameter so the process is more secure.
    code = request.data.get('code')
    if not code:
        return (Response({'error':'Something went wrong'}, status=400))
    
    try:
        user = Account.objects.get(email=user_mail)
    except:
        return (Response({'error':'Something went wrong'}, status=400))
    
    if not ResetPassword.objects.filter(email=user_mail, code=code).exists():
        return (Response({'error':'Invalid code'}, status=400))
    new_pass_serialized = ResetPasswordSerializerSuccess(data=request.data)
    if (not new_pass_serialized.is_valid()):
        return (Response({'error': 'The new password is invalid'}  , status=400))
    
    valid = new_pass_serialized.validated_data
    user.set_password(valid['new_password1'])
    user.save()
    ResetPassword.objects.filter(email=user_mail).delete()
    return (Response({'Success': True}, status=200))