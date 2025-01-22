from django.shortcuts import  redirect
from django.contrib.auth.password_validation import validate_password
from .models import Account
from .serializer import (
                         RegisterSerializer)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import  AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import jwt, json, requests
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
            return (Response('Passwords does not match.', status=400))     

        try:
            validate_password(valid['password'])
        except:
            return (Response('The password does not comply with the requirements.', status=400))

        user_form.save()
        return Response(user_form.data, status=200)
    return (Response(user_form.errors.values(), status=400))

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            return Response({'Success':True,
                             'access':access_token,
                             'refresh':refresh_token},
                             status=200)
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
    return (redirect(google_lgn))


from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.conf import settings

@api_view(['GET'])
@permission_classes([AllowAny])
def lgn_42(request):
    data = {
        'authorize_link': settings.API_42  # Corrected typo in 'authorize_link'
    }
    return Response(data, status=200)  # Explicitly setting the status code



"""
    1- get the code from the callback
    2- preparing the a request with code and params -> api_link
    3- process data
    4- check if the email exist, get the cookie JWT->ACCESS && JWT->REFRESH
    5- else create a new account and get the cookies
"""

@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth2_callback(request):
    try:
        code = request.GET.get('code')
    except:
        return (Response('Code not found', status=400))
    
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
        return (Response('Incorrect response from google api', status=400))
    
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
        return (Response('Invalid signature/Failed to decode google response', status=400))


    tmp_email = decoded.get('email', '')
    tmp_username = decoded.get('name', '')

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
        return(Response('No code found', status=400))

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
        return (Response('error'))

    access_token = response_json['access_token']
    intra_me = 'https://api.intra.42.fr/v2/me'
    authorization_header = {'Authorization' : f'Bearer {access_token}'}
    try:
        response_42 = requests.get(intra_me, headers=authorization_header)
    except:
        return(Response('Cannot fetch 42 intra_me', status=400))

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
                     'refresh_token':str(refresh_token)})