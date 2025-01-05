from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login
from .forms import UserEditForm, UserRegistrationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from .models import Account
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
    is_friend = False
    is_self = False
    if (request.user.is_authenticated and request.user == user):
        is_self = True
    #TODO add is_online
    context['is_self'] = is_self
    context['is_friend'] = is_friend
    return (render(request, 'account/profile.html', context))

def search_account(request):
    accounts = None
    if (request.method == "GET"):
        query_search = request.GET.get('q')
        if (query_search):
            accounts = Account.objects.filter(username__contains=query_search)
    return(render(request, 'account/search.html', {'accounts' : accounts, 'search' :query_search}))