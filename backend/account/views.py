from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from .forms import LoginForm

"""
TODO if a an authenticated user request /account/login you should redirect him to dashboard
"""
        
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

from django.contrib.auth.decorators import login_required

"""
    thanks to the decorator if the user is not logged, it will be redirected to
    login, and the next input will be filled with the dashboard url
"""

@login_required
def dashboard(request):
    return (render(request, 'account/dashboard.html', {'section': 'dashboard'}))

from .forms import UserRegistrationForm
from .models import Profile

def register(request):
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
            Profile.objects.create(user=new_user)
            return(render(request, 'account/register_done.html', {'new_user': new_user}))
    else:
        user_form = UserRegistrationForm()
    return(render(request, 'account/register.html', {'user_form': user_form}))

from .forms import UserEditForm, ProfileEditForm

@login_required
def edit(request):
    if (request.method == "POST"):
        user_form = UserEditForm(instance=request.user,
                                         data=request.POST)
        profile_form = ProfileEditForm(instance=request.user.profile,
                                         data=request.POST,
                                         files=request.FILES)
        if (user_form.is_valid() and profile_form.is_valid()):
            user_form.save()
            profile_form.save()
    else:
        user_form = UserEditForm(instance=request.user)
        profile_form = ProfileEditForm(instance=request.user.profile)
    return (render(request,
                   'account/edit.html',
                   {'user_form':user_form, 'profile_form':profile_form}))
