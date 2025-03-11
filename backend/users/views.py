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
                         BlackListSerializer,
                         ResetPasswordSerializerSuccess,
                         OTPSerializer,)
from rest_framework.response import Response
from django.shortcuts import  redirect
from urllib.parse import urlencode
from django.conf import settings
from .authentication import IsOTP
from .models import (Account,
                     FriendList,
                     FriendRequest,
                     ResetPassword,
                     Notification,
                     BlackList)
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime
import jwt, json, requests
from django.core.mail import send_mail
import pyotp
from smtplib import SMTPException

#TODO blacklist the old access
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        user_form = RegisterSerializer(data=request.data)
        #TODO where i validate for uniq
        if (user_form.is_valid()):
            valid = user_form.validated_data
            if (valid['password'] != valid['repassword']):
                return (Response({'error':'Passwords does not match.'}, status=400))     

            validate_password(valid['password'])

            user_form.save()

            return Response(user_form.data, status=200)
        return (Response(user_form.errors, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            return Response({'access':access_token,
                             'refresh':refresh_token},
                             status=200)
        except Exception as e:
            return(Response({'error':f'{e}'}, status=401))


class MyTokenRefreshView(TokenRefreshView): #NOT CLEAN
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            req = super().post(request, *args, **kwargs)
            access_token = req.data['access']

            return Response({'access':access_token},
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
        code = request.GET['code']
    
        token_url = settings.GOOGLE_OAUTH_TOKEN
        data = {
            'code':code,
            'client_id' : settings.CLIENT_ID_GOOGLE,
            'client_secret': settings.CLIENT_SECRET_GOOGLE,
            'redirect_uri' : settings.GOOGLE_REDIRECT,
            'grant_type': 'authorization_code'
        }

        response = requests.post(token_url, data=data)
        response_json = json.loads(response.content)
        id_token = response_json['id_token']
    
        google_keys_url = settings.GOOGLE_JWKS
        jwks_client = jwt.PyJWKClient(google_keys_url)
        signing_key = jwks_client.get_signing_key_from_jwt(id_token)
        decoded = jwt.decode(id_token,
                            signing_key.key,
                            algorithms=['RS256'],
                            options={'verify_exp':False},
                            audience=settings.CLIENT_ID_GOOGLE)

        tmp_email = decoded['email']
        tmp_username = decoded['name']

        user_mail = Account.objects.filter(email=tmp_email)
        user_username = Account.objects.filter(username=tmp_username)

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

        return Response({'access_token':str(access_token),
                         'refresh_token':str(refresh_token)}, status=200)

    except KeyError:
        return(Response({'error':'code field not found'}, status=400))
    
    except requests.exceptions.RequestException:
        return (Response({'error':'Connection err on google api'}, status=400))
    
    except ValueError:
        return (Response({'error':'JSON err on load google data'}, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


#TODO learn EAFP exceptions

@api_view(['GET'])
@permission_classes([AllowAny])
def oauth2_42_callback(request):
    try:
        code = request.GET['code']

        token_url = 'https://api.intra.42.fr/oauth/token'
        data = {
            'code':code,
            'client_id' : settings.CLIENT_ID_42,
            'client_secret': settings.CLIENT_SECRET_42,
            'redirect_uri' : 'http://localhost:3000/oauth/',
            'grant_type': 'authorization_code'
        }

        response = requests.post(token_url, data=data)
        response_json = json.loads(response.content)

        access_token = response_json['access_token']
        intra_me = 'https://api.intra.42.fr/v2/me'
        authorization_header = {'Authorization' : f'Bearer {access_token}'}

        response_42 = requests.get(intra_me, headers=authorization_header)

        decoded = response_42.json()

        tmp_email = decoded['email']
        tmp_username = decoded['login']

        user_mail = Account.objects.filter(email=tmp_email) 
        user_username = Account.objects.filter(username=tmp_username)

        if user_mail and user_username:
            if (user_mail.id == user_username.id and user_username.is_oauth):
                user_obj = user_mail
            else:
                return (Response({'error':'Please use the login form.'}, status=403))
        elif user_mail or user_username:
            return (Response({'error':'Please use the login form.'}, status=403))
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

        return Response({'access_token':str(access_token),
                         'refresh_token':str(refresh_token)}, status=200)

    except KeyError:
        return(Response({'error':'code field not found'}, status=400))
    
    except requests.exceptions.RequestException:
        return (Response({'error':'Connection err on 42 api'}, status=400))
    
    except ValueError:
        return (Response({'error':'JSON err on load 42 data'}, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def VerifyOTP(request):
    try:
        OTP_serial = OTPSerializer(data=request.data)
        if OTP_serial.is_valid():
            validated = OTP_serial.validated_data
            print(f"{validated.get('form_OTP')} -- {request.user.otp_code}")
            if (validated.get('form_OTP') == request.user.otp_code):
                request.user.is_otp_verified = True
                request.user.save()
                return(Response({'Success':'OTP activated'}, status=200))
        return(Response({'error':'False OTP'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Activate_DesactivateOTP(request):
    try:
        if (request.user.is_otp_active and not request.user.is_otp_verified):
            return(Response('To desactivate 2FA you should verify it first', status=403))
        request.user.is_otp_active = not request.user.is_otp_active
        request.user.save()
        return(Response({'Success':True}, status=200))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsOTP])
def check_OTP(request):
    return (Response('OTP Verified', status=200))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit(request):
    try:
        edit_user = EditAccountSerializer(instance=request.user, 
                                        data=request.data,
                                        partial=True)
        if (edit_user.is_valid()):
            edit_user.save()
            return Response(edit_user.data, status=200)
        return (Response(edit_user.errors, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        new_instance = ChangePassSerializer(instance=request.user,
                                            data=request.data)
        
        if (not new_instance.is_valid()): #TODO user.form_errors check on register
            return (Response({'error':'Error the data is not valid'}, status=400))
        
        valid = new_instance.validated_data
        
        if (valid['old_password'] == valid['new_password']):
            return (Response({'error':'Your new password cannot be like the new one'}, status=400))
        
        if (not request.user.check_password(valid['old_password'])):
            return (Response({'error':'Old_password is invalid'}, status=400))
            
        if (valid['new_password'] != valid['new_password2']):
            return (Response({'error':'Passwords does not match.'}, status=400))
        
        validate_password(password=valid['new_password'])

        request.user.set_password(valid['new_password'])
        request.user.save()
        return (Response('Password updated successfully', status=200))
    
    except KeyError:
        return (Response({'error':'Required fields are missing'}, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))
    


def is_blocked(request, friend):
    try:
        fr_blk_obj, created = BlackList.objects.get_or_create(user=friend)
        my_blk_obj, created = BlackList.objects.get_or_create(user=request.user)
        if (request.user in fr_blk_obj.blocked.all()):
            return True
        return (friend in my_blk_obj.blocked.all())
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def view_profile(request, id):
    try:
        user = Account.objects.get(id=id)
    
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
        elif is_blocked(request, user):
            friendship = -1
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

        context['is_self'] = is_self
        context['friendship'] = friendship
        serializer = ViewProfileSerializer(context)
        return (Response(serializer.data))
    
    except Account.DoesNotExist:
        return(Response({'error':'Account not found.'}, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def me(request):
    try:
        user = Account.objects.get(id=request.user.id)
    
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
        return (Response(serializer.data, status=200))
    
    except Account.DoesNotExist:
        return(Response({'error':'Account not found.'}, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

#FRIENDS SYSTEM
def get_friend_request_or_false(sender, receiver):
    try:
        return (FriendRequest.objects.get(sender=sender, receiver=receiver, is_active=True))
    except FriendRequest.DoesNotExist:
        return False
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_friends(request):
    try:
        friend_list = FriendList.objects.filter(user=request.user)
        serializer = FriendsListSerializer(friend_list, many=True)
        return (Response(serializer.data))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_all_req_sent(request):
    try:
        friend_request = FriendRequest.objects.filter(sender=request.user, is_active=True)
        serializer = FriendsReqSentSerializer(friend_request, many=True)
        return (Response(serializer.data))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_all_req_received(request):
    try:
        friend_request = FriendRequest.objects.filter(receiver=request.user, is_active=True)
        serializer = FriendsReqReceivedSerializer(friend_request, many=True)
        return (Response(serializer.data))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_req(request):
    try:
        friend_id = int(request.POST.get("friend_id"))
        if (friend_id == request.user.id):
            return (Response({"error":"You can not send a friend request to yourself"}, status=400))

        friend = Account.objects.get(id=friend_id)

        blk_obj, created = BlackList.objects.get_or_create(user=friend)
        if (request.user in  blk_obj.blocked.all()):
            return (Response({'error':f'You can not send a friend req, cause you are blocked by {friend.username}'}, status=400))

        friend_req = FriendRequest.objects.get(sender=request.user,
                                        receiver=friend,
                                        is_active=True)
        return (Response("The Friend request already sent", status=200))
    
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
    
    except (Account.DoesNotExist, BlackList.DoesNotExist):
        return (Response("The friend_id does not belong to any user", status=400))
    
    except (KeyError, TypeError):
        return(Response({'error':'friend_id field is required'}, status=400))
    
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfriend_friend(request):
    try:
        friend_id = int(request.POST.get("unfriend_id"))
        if (friend_id == request.user.id):
            return (Response({'error':'You can not unfriend yourself'}, status=400))

        friend = Account.objects.get(id=friend_id)
        if not (request.user.friends.filter(user=friend).exists()):
            return(Response({'error':f'{friend.username} is already not your friend'}, status=400))
        friend_list = FriendList.objects.get(user=request.user)
        friend_list.unfriend(fake_friend=friend)
        return(Response(f'You unfriended {friend.username} successfully', status=200))

    except (KeyError, TypeError):
        return(Response({'error':'unfriend_id field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_my_req(request):
    try:
        cancel_req_id = int(request.POST.get("cancel_req_id"))

        friend = Account.objects.get(id=cancel_req_id)
        friend_list = FriendRequest.objects.get(sender=request.user, receiver=friend, is_active=True)
        friend_list.cancel()
        return(Response('You cancelled the request successfully', status=200))

    except (KeyError, TypeError):
        return(Response({'error':'cancel_req_id field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decline_friend_req(request):
    try:
        decline_friend_req = int(request.POST.get("decline_friend_req"))

        friend = Account.objects.get(id=decline_friend_req)
        friend_list = FriendRequest.objects.get(sender=friend,
                                                receiver=request.user,
                                                is_active=True)
        friend_list.decline()
        return(Response('You cancelled the request successfully'))

    except (KeyError, TypeError):
        return(Response({'error':'decline_friend_req field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend(request):
    try:
        friend_id = int(request.POST.get("accept_friend_id"))
        if (friend_id == request.user.id):
            return (Response({'error':'You can not accept your self as a friend'}, status=400))

        friend = Account.objects.get(id=int(friend_id))
        blk_obj, created = BlackList.objects.get_or_create(user=friend)##TODO is it needed?
        if (is_blocked(request, friend)):
            return (Response({'error':f'You can not send a friend req, cause you are blocked by {friend.username}'}, status=400))

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
        return(Response({'Friendship_accepted':True}, status=200))
    
    except (KeyError, TypeError):
        return(Response({'error':'accept_friend_id field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_account(request):
    try:
        query_search = request.GET['q']
        if (query_search):
            accounts = Account.objects.filter(username__contains=query_search)
            searilized = AccountSerializer(accounts, many=True)
        return(Response(searilized.data))
    
    except (KeyError):
        return(Response({'error':'q field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def block_user(request):
    try:
        blocked_id = int(request.POST.get("blocked_id"))
        if (blocked_id == request.user.id):
            return (Response({'error':'You can not block yourself'}, status=400))
        blocked_user = Account.objects.get(id=blocked_id)
        blacklist_obj, created = BlackList.objects.get_or_create(user=request.user)
        if blocked_user in blacklist_obj.blocked.all():
            return (Response(f'{blocked_user.username} is already blocked', status=200))

        blacklist_obj._add(blocked_user)
        return (Response(f'You blocked {blocked_user.username}', status=200))
    
    except (BlackList.DoesNotExist, Account.DoesNotExist):
        return (Response({'error':'BlackList obj/Account does not exist'}, 400))
    except (KeyError, TypeError):
        return(Response({'error':'blocked_id field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unblock_user(request):
    try:
        unblocked_id = int(request.POST.get("unblocked_id"))
        if (unblocked_id == request.user.id):
            return (Response({'error':'You can not unblock yourserf'}, status=401))
        blocked_user = Account.objects.get(id=unblocked_id)
        blacklist_obj, created = BlackList.objects.get_or_create(user=request.user)

        if blocked_user not in blacklist_obj.blocked.all():
            return (Response(f'{blocked_user.username} is already unblocked', 200))

        blacklist_obj.unblock(blocked_user)
        return (Response(f'You unblocked {blocked_user.username}', status=200))
    
    except (BlackList.DoesNotExist, Account.DoesNotExist):
        return (Response({'error':'BlackList/Account obj does not exist'}, status=400))
    except (KeyError, TypeError):
        return(Response({'error':'unblocked_id field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))
    

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def list_blocked_users(request):
    try:
        black_list = BlackList.objects.get(user=request.user)
        return (Response(BlackListSerializer(black_list).data, status=200))
    except BlackList.DoesNotExist:
        return (Response({'error':'Blacklist obj does not exist'}, status=400))
    except Exception as e:
        return (Response({'error':f'{e}'}, status=400))

###HELPER
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return (Response({'Authenticated':True}, status=200))


###RESET PASS
@api_view(['POST'])
@permission_classes([AllowAny])
def get_pub_data(request):
    try:
        user = Account.objects.get(email=request.data.get('email'))
        return Response({'username':user.username,
                         'first_name':user.first_name,
                         'last_name':user.last_name},
                         status=200)
    except Account.DoesNotExist:
        return (Response({'error':'The email is incorrect'}, status=400))
    except (KeyError, TypeError):
        return(Response({'error':'unblocked_id field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))
    

@api_view(['POST'])
@permission_classes([AllowAny])
def send_reset_mail(request):
    try:
        reset_email = request.POST['email']

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
    
    except SMTPException:
        return (Response({'error':'SMTP Failed to send the mail'}, status=400))
    except KeyError:
        return(Response({'error':'email field is required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_mail_check(request):
    try:
        reset_user = ResetPassword.objects.get(email=request.POST['email'],
                                               code=request.POST['code'])
        if (not reset_user.is_valid()):
            reset_user.delete()
            return (Response({'error': 'The Reset token is expired'}, status=400))
        if (reset_user.code != request.POST['code']):
            return (Response({'error': 'The code is incorrect'}, status=400))
        return (Response({'Success': True}, status=200))
    
    except ResetPassword.DoesNotExist:
        return (Response({'error': 'ResetPassword obj does not exist'}, status=400))
    except (KeyError):
        return(Response({'error':'email/code fields are required'}, status=400))
    except Exception as e:
        return (Response({'error':f'{e}'}, status=400))


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_mail_success(request):
    try:
        user_mail = request.POST['email']
        code = request.POST['code']
        
        user = Account.objects.get(email=user_mail)
        
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

    except Account.DoesNotExist:
        return (Response({'error':'Account obj does not exist'}, status=400))
    except KeyError:
        return(Response({'error':'email/code fields are required'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def readen_notif(request):
    try:
        unreaden_notifs = Notification.objects.filter(receiver=request.user)
        if unreaden_notifs:
            unreaden_notifs.update(is_readen=True)
            return (Response('All notifs are readen', status=200))
        return (Response('already all notifs are readen', status=200))
        
    except Notification.DoesNotExist:
        return(Response({'error':'Notification obj does not exist'}, status=400))
    except Exception as e:
        return(Response({'error':f'{e}'}, status=400))
    