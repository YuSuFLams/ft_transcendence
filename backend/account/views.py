from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.views import LoginView
# from rest_framework.parsers import JSONParser

from .forms import UserEditForm, UserRegistrationForm
from .models import Account, FriendList, FriendRequest
from .serializer import AccountSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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

@login_required
def dashboard(request):
    return (render(request, 'account/dashboard.html', {'section': 'dashboard'}))

def register(request):
    if (request.user.is_authenticated):
        return (redirect("dashboard"))
    if (request.method == "POST"):
        user_form = UserRegistrationForm(request.POST)
        if (user_form.is_valid()):
            new_user = user_form.save(commit=False)
            new_user.set_password(user_form.cleaned_data['password'])
            """
                set_password() takes care of hashing the pass before saving it to db
                it uses PBKDF2 algo with SHA256 hash
            """
            new_user.save()

            #redirecting the user to dashboard, after a successfull login
            login(request, new_user)
            return (redirect('dashboard'))
    else:
        user_form = UserRegistrationForm()
    return(render(request, 'account/register.html', {'user_form': user_form}))


@login_required
def edit(request):
    if (request.method == "POST"):
        user_form = UserEditForm(instance=request.user,
                                         data=request.POST,
                                         files=request.FILES)
        if (user_form.is_valid()):
            user_form.save()
    else:
        user_form = UserEditForm(instance=request.user)
    return (render(request,
                   'account/edit.html',
                   {'user_form':user_form}))


class MyLoginView(LoginView):
    def dispatch(self, request, *args, **kwargs):
        if (request.user.is_authenticated):
            return (redirect("dashboard"))
        return super().dispatch(request, *args, **kwargs)
    
"""
    overriding the dispatch method to redirect 
    the logged user from login -> dashboard
"""

def view_profile(request, id):
    try:
        user = Account.objects.get(id=id)
    except :
        return(HttpResponse("Account not found."))
    
    context = {}
    context['username'] = user.username
    context['avatar'] = user.avatar
    context['email'] = user.email
    context['first_name'] = user.first_name
    try:
        friend_list = FriendList.objects.get(user=user)
    except FriendList.DoesNotExist:
        friend_list = FriendList(user=user)
        friend_list.save()

    context['friends'] = friend_list.friends.all()

    is_self = False
    friendship = 0 #No relations btwn you and him

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
            #else
            #  !!is_self && !!friendship  means you're just looking at a stanger profile

    #TODO add is_online
    context['is_self'] = is_self
    context['friendship'] = friendship
    return (render(request, 'account/profile.html', context))

def send_friend_req(request):
    """
        1- check if there is an old req -> if there is an active one raise execp
         -> if there isnt an active one, create new one
        2- if there is no friendrequest -> create one
    """
    if request.method == "POST":
        try:
            friend_id = request.POST.get("friend_id")
            friend = Account.objects.get(id=friend_id)
            try:
                friend_req = FriendRequest.object.get(sender=request.user,
                                                receiver=friend,
                                                is_active=True)
                raise Exception("already a friend request sent, no need to add one")
            except FriendRequest.DoesNotExist:
                friend_req = FriendRequest(sender=request.user, receiver=friend)
                friend_req.save()
            except Exception as e:
                print(e)
        except:
            print("Friend-id not found")
            

"""
API PART
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


"""Overriding post method on TokenRefreshView
    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
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

    
"""Overriding post method on Token ObtainPairView
    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_account(request):
    accounts = None
    searilized = None
    if (request.method == "GET"):
        query_search = request.GET.get('q')
        if (query_search):
            accounts = Account.objects.filter(username__contains=query_search)
            searilized = AccountSerializer(accounts, many=True)
    return(Response(searilized.data))


#API TESTING
# @csrf_exempt
def account_list(request):
    if (request.method == 'GET'):
        all_users_query = Account.objects.all()
        serializer = AccountSerializer(all_users_query, many=True)
        return HttpResponse(serializer.data)



#HELPER 
def get_friend_request_or_false(sender, receiver):
    try:
        return (FriendRequest.objects.get(sender=sender, receiver=receiver, is_active=True))
    except FriendRequest.DoesNotExist:
        return False
