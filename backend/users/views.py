from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import Account, FriendList, FriendRequest
from .serializer import (AccountSerializer,
                         RegisterSerializer,
                         FriendsReqReceivedSerializer,
                         FriendsReqSentSerializer,
                         ViewProfileSerializer,
                         EditAccountSerializer,
                         ChangePassSerializer)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework.response import Response

"""
django.contrib.auth.views provide class based views to deal with auth:
    -> LoginView
    -> Logout

    -> PasswordChangeView
    -> PasswordChangeDoneView

    -> PasswordResetView
    -> PasswordResetDoneView
    -> PasswordResetConfirmView
    -> PasswordResetCompleteView
"""

"""
    thanks to the decorator if the user is not logged, it will be redirected to
    login, and the next input will be filled with the dashboard url
"""

# @login_required
def dashboard(request):
    return (render(request, 'users/dashboard.html', {'section': 'dashboard'}))

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    user_form = RegisterSerializer(data=request.data)
    if (user_form.is_valid()):
        valid = user_form.validated_data
        if (valid['password'] != valid['password2']):
            return (Response('Passwords does not match.'))     

        try:
            validate_password(valid['password'])
        except:
            return (Response('The password does not comply with the requirements.', status=400))

        user_form.save()
        return Response(user_form.data)
    return (Response(user_form.errors))


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
            return (Response('Error the data is not valid', status=400))
        
        valid = new_instance.validated_data
        
        if (valid['old_password'] == valid['new_password']):
            return (Response('Your new password cannot be like the new one', status=400))
        
        auth_user = authenticate(username=request.user.username, password=valid['old_password'])
        
        if (not request.user.check_password(valid['old_password'])):
            return (Response('Old_password is invalid', status=400))
            
        if (valid['new_password'] != valid['new_password2']):
            return (Response('Passwords does not match.', status=400))
        
        try:
            validate_password(password=valid['new_password'])
        except:
            return (Response('New password does not comply with the requirements.', status=400))

        request.user.set_password(valid['new_password'])
        request.user.save()
        return (Response('Password updated successfully', status=200))
    except KeyError:
        return (Response('Required fields are missing', status=400))
    except:
        return (Response('Error setting new password', status=400))


class MyLoginView(LoginView):
    def dispatch(self, request, *args, **kwargs):
        if (request.user.is_authenticated):
            return (redirect("dashboard"))
        return super().dispatch(request, *args, **kwargs)
    
"""
    overriding the dispatch method to redirect 
    the logged user from login -> dashboard
"""

@api_view(['GET'])
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
    try:
        friend_list = FriendList.objects.filter(user=request.user)
        serializer = FriendsReqSentSerializer(friend_list, many=True)
        return (Response(serializer.data))
    except:
        return (Response('You have no Friends'))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_req_sent(request):
    try:
        friend_request = FriendRequest.objects.filter(receiver=request.user, is_active=True)
        serializer = FriendsReqReceivedSerializer(friend_request, many=True)
        return (Response(serializer.data))
    except:
        return (Response('You got no friend requests'))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_req_received(request):
    try:
        friend_request = FriendRequest.objects.filter(sender=request.user, is_active=True)
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
            return (Response("You can not add send friend request to yourself"))

        friend = Account.objects.get(id=friend_id)
        try:
            friend_req = FriendRequest.objects.get(sender=request.user,
                                            receiver=friend,
                                            is_active=True)
            return (Response("The Friend request already sent"))
        except FriendRequest.DoesNotExist:
            friend_req = FriendRequest(sender=request.user, receiver=friend)
            friend_req.save()
            return (Response('The friend request sent successfully'))
        except Exception as e:
            return (Response('Failed to send the friend request'))
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
            return (Response('You can not unfriend yourself'))
        try:
            friend = Account.objects.get(id=int(friend_id))
            try:
                friend_req_list = FriendRequest.objects.get(sender=friend, receiver=request.user, is_active=True)
                friend_req_list.accept()
                return(Response({'Friendship_accepted':True}))
            except:
                return(Response('failed to accept the friendship'))
        except:
            return(Response('accept_friend_id not found', status=400))
    except:
        return(Response({'Friendship_accepted':False}))


@api_view(['POST'])
def logout(request):
    try:
        resp = Response()
        resp.data = {'Logged-out':True}
        resp.delete_cookie('refresh_token',
                           path='/',
                           samesite='None')
        resp.delete_cookie('access_token',
                            path='/',
                           samesite='None')
        
        return resp
    except:
        return(Response({'Logged-out':False}))    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return (Response({'Authenticated':True}))

"""
    Overriding post method on TokenRefreshView
    def post(self, request: Request, *args, **kwargs) -> Response:
"""

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

""" 
    Overriding post method on Token ObtainPairView
    def post(self, request: Request, *args, **kwargs) -> Response:
"""

class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            res = Response()
            res.data = {'Success':True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,  #cannot access the token from JS, protect from XSS
                secure=True, 
                samesite='None', #the cookie will sent with cross-site and same-site
                path='/' #cookie scope
            )
            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                secure=True,
                httponly=True,
                path='/'
            )
            return res
        except:
            return(Response({'success':False}))


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

@api_view(['GET'])
@permission_classes([AllowAny])
def account_list(request):
    all_users_query = Account.objects.all()
    serializer = AccountSerializer(all_users_query, many=True)
    return Response(serializer.data)

