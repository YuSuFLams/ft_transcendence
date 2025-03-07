from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.password_validation import validate_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import  AllowAny, IsAuthenticated
from .serializer import (AccountSerializer,
                         RegisterSerializer,
                         FriendsReqReceivedSerializer,
                         FriendsReqSentSerializer,
                         ViewProfileSerializer,
                         EditAccountSerializer,
                         ChangePassSerializer,
                         FriendsListSerializer,
                         ResetPasswordSerializer,
                         ResetPasswordSerializerSuccess,
                         OTPSerializer,)
from rest_framework.response import Response
from django.shortcuts import  redirect
from urllib.parse import urlencode
from django.conf import settings
from .authentication import IsOTP
from .models import Account, FriendList, FriendRequest, ResetPassword, Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime
import jwt, json, requests

#TODO blacklist the old access
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
        new_user = Account.objects.get(username=request.data.get('username'))
        # friend_list, created = FriendList.objects.get_or_create(user=new_user)

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

            return Response({'Refreshed':True,
                             'access':access_token},
                             status=200)
        except:
            return (Response({'Refreshed':False}, status=401))
        

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


@api_view(['GET'])
@permission_classes([AllowAny])
def lgn_42(request):
    return Response({'authorize_link': settings.API_42}, status=200)


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def VerifyOTP(request):
    OTP_serial = OTPSerializer(data=request.data)
    if OTP_serial.is_valid():
        validated = OTP_serial.validated_data
        print(f"{validated.get('form_OTP')} -- {request.user.otp_code}")
        if (validated.get('form_OTP') == request.user.otp_code):
            request.user.is_otp_verified = True
            request.user.save()
            return(Response({'Success':'OTP activated'}, status=200))
    return(Response({'Success':'False OTP'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Activate_DesactivateOTP(request):
    if  (request.user.is_otp_active and not request.user.is_otp_verified):
        return(Response('To desactivate 2FA you should verify it first', status=403))
    request.user.is_otp_active = not request.user.is_otp_active
    request.user.save()
    return(Response({'Success':True}, status=200))


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsOTP])
def check_OTP(request):
    return (Response('OTP Verified', status=200))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit(request):
    edit_user = EditAccountSerializer(instance=request.user, 
                                      data=request.data,
                                      partial=True)
    if (edit_user.is_valid()):
        edit_user.save()
        return Response(edit_user.data)
    return (Response(edit_user.errors))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        new_instance = ChangePassSerializer(instance=request.user,
                                            data=request.data)
        
        if (not new_instance.is_valid()):
            return (Response({'error':'Error the data is not valid'}, status=400))
        
        valid = new_instance.validated_data
        
        if (valid['old_password'] == valid['new_password']):
            return (Response({'error':'Your new password cannot be like the new one'}, status=400))
        
        if (not request.user.check_password(valid['old_password'])):
            return (Response({'error':'Old_password is invalid'}, status=400))
            
        if (valid['new_password'] != valid['new_password2']):
            return (Response({'error':'Passwords does not match.'}, status=400))
        
        try:
            validate_password(password=valid['new_password'])
        except:
            return (Response({'error':'New password does not comply with the requirements.'}, status=400))

        request.user.set_password(valid['new_password'])
        request.user.save()
        return (Response('Password updated successfully', status=200))
    except KeyError:
        return (Response({'error':'Required fields are missing'}, status=400))
    except:
        return (Response({'error':'Error setting new password'}, status=400))
    
"""
    overriding the dispatch method to redirect 
    the logged user from login -> dashboard
"""

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def view_profile(request, id):
    try:
        user = Account.objects.get(id=id)
    except :
        return(Response("Account not found."))
    
    context = {}
    context['username'] = user.username
    context['avatar'] = user.avatar
    context['email'] = user.email
    context['first_name'] = user.first_name

    friend_list, created = FriendList.objects.get_or_create(user=user)

    context['friends'] = friend_list.friends.all()

    is_self = False
    friendship = 0

    if (request.user.is_authenticated and request.user == user):
        is_self = True
        friend_req = FriendRequest.objects.filter(receiver=user, is_active=True)
        context['friend_req'] = friend_req
    else :
        try :
            friend_list.friends.get(id=request.user.id)
            friendship = 1 #you're friends
        except:
            if (get_friend_request_or_false(sender=request.user, receiver=user)):
                friendship = 2
                #you sent a request, we're waiting him to accept or dny, and you can cancel
            elif (get_friend_request_or_false(sender=user, receiver=request.user)):
                friendship = 3
                #he sent a request, you can accept or decline
                context['friend_req_id'] = get_friend_request_or_false(user, request.user).id

    #TODO add is_online
    context['is_self'] = is_self
    context['friendship'] = friendship
    serializer = ViewProfileSerializer(context)
    return (Response(serializer.data))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    try:
        user = Account.objects.get(id=request.user.id)
    except :
        return(Response("Account not found."))
    
    context = {}
    context['username'] = user.username
    context['avatar'] = user.avatar
    context['email'] = user.email
    context['first_name'] = user.first_name
    friend_list, created = FriendList.objects.get_or_create(user=user)
    context['friends'] = friend_list.friends.all()
    context['friend_req'] = FriendRequest.objects.filter(receiver=user,
                                                         is_active=True)
    context['is_self'] = True
    context['friendship'] = 0
    serializer = ViewProfileSerializer(context)
    return (Response(serializer.data))


#FRIENDS SYSTEM
def get_friend_request_or_false(sender, receiver):
    try:
        return (FriendRequest.objects.get(sender=sender, receiver=receiver, is_active=True))
    except FriendRequest.DoesNotExist:
        return False

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_friends(request):
    # try:
    friend_list = FriendList.objects.filter(user=request.user)
    serializer = FriendsListSerializer(friend_list, many=True)
    return (Response(serializer.data))
    # except FriendList.DoesNotExist:
    #     return (Response('You have no Friends'))

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_all_req_sent(request):
    try:
        friend_request = FriendRequest.objects.filter(sender=request.user, is_active=True)
        serializer = FriendsReqReceivedSerializer(friend_request, many=True)
        return (Response(serializer.data))
    except:
        return (Response('You got no friend requests'))

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_all_req_received(request):
    try:
        friend_request = FriendRequest.objects.filter(receiver=request.user, is_active=True)
        serializer = FriendsReqReceivedSerializer(friend_request, many=True)
        return (Response(serializer.data))
    except:
        return (Response('You did not sent any friend request'))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_req(request):
    try:
        friend_id = request.POST.get("friend_id")
        if (int(friend_id) == request.user.id):
            return (Response("You can not send a friend request to yourself", status=400))

        try:
            friend = Account.objects.get(id=friend_id)
        except Account.DoesNotExist:
            return (Response("The friend_id does not belong to any user", status=400))

        try:
            friend_req = FriendRequest.objects.get(sender=request.user,
                                            receiver=friend,
                                            is_active=True)
            return (Response("The Friend request already sent", status=400))
        except FriendRequest.DoesNotExist:
            friend_req = FriendRequest(sender=request.user, receiver=friend)
            friend_req.save()

            notif_type = 3
            msg = f"{request.user.username} requests a friendship"
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"room_{friend_id}",
                {
                    "type": "user.status",
                    "username": request.user.username,
                    "id": request.user.id,
                    "notif_type": notif_type,
                    "msg": msg,
                    "timestamp": str(datetime.now()).split('.')[0],
                })
            Notification.objects.create(sender=request.user,
                            receiver=friend,
                            notif_type=notif_type,
                            msg=msg)

            return (Response('The friend request sent successfully', status=200))
        except Exception as e:
            return (Response('Failed to send the friend request', status=400))
    except:
        return (Response("Cannot find friend_id", status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfriend_friend(request):
    try:
        friend_id = int(request.POST.get("unfriend_id"))
        if (friend_id == request.user.id):
            return (Response('You can not unfriend yourself'))
        try:
            friend = Account.objects.get(id=friend_id)
            friend_list = FriendList.objects.get(user=request.user)
            friend_list.unfriend(fake_friend=friend)
            return(Response('You unfriended successfully'))
        except:
            return(Response('Failed to unfriend'))
    except:
        return(Response('There is no unfriend_id', status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_my_req(request):
    try:
        cancel_req_id = int(request.POST.get("cancel_req_id"))
        try:
            friend = Account.objects.get(id=cancel_req_id)
            friend_list = FriendRequest.objects.get(sender=request.user, receiver=friend, is_active=True)
            friend_list.cancel()
            return(Response('You cancelled the request successfully'))
        except:
            return(Response('Failed to Cancel your request'))
    except:
        return(Response('Cannot find cancel_req_id', status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decline_friend_req(request):
    try:
        decline_friend_req = int(request.POST.get("decline_friend_req"))
        try:
            friend = Account.objects.get(id=decline_friend_req)
            friend_list = FriendRequest.objects.get(sender=friend,
                                                    receiver=request.user,
                                                    is_active=True)
            friend_list.decline()
            return(Response('You cancelled the request successfully'))
        except:
            return(Response('Failed to Cancel your request'))
    except:
        return(Response('Cannot find decline_friend_req', status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend(request):
    try:
        friend_id = request.POST.get("accept_friend_id")
        if (int(friend_id) == request.user.id):
            return (Response('You can not accept your self as a friend'))
        try:
            friend = Account.objects.get(id=int(friend_id))
            try:
                friend_req_list = FriendRequest.objects.get(sender=friend, receiver=request.user, is_active=True)
                friend_req_list.accept()

                notif_type = 4
                msg = f"{request.user.username} accepted your friendship"
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f"room_{friend_id}",
                    {
                        "type": "user.status",
                        "username": request.user.username,
                        "id": request.user.id,
                        "notif_type": notif_type,
                        "msg": msg,
                        "timestamp": str(datetime.now()).split('.')[0],
                    })
                Notification.objects.create(sender=request.user,
                                receiver=friend,
                                notif_type=notif_type,
                                msg=msg)

                return(Response({'Friendship_accepted':True}))
            except:
                return(Response('failed to accept the friendship'))
        except:
            return(Response('accept_friend_id not found', status=400))
    except:
        return(Response({'Friendship_accepted':False}))
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_account(request):
    accounts = None
    searilized = None
    query_search = request.GET.get('q')
    if (query_search):
        accounts = Account.objects.filter(username__contains=query_search)
        searilized = AccountSerializer(accounts, many=True)
    return(Response(searilized.data))
