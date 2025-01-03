from django.contrib import admin
from django.urls import path, include
from . import views
# from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('auth/login', views.MyLoginView.as_view(), name='login'),
    path('auth/', include('django.contrib.auth.urls')),
    path('register/', views.register, name='register'),
    path('edit/', views.edit, name='edit'),
]

"""
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path(
        "password_change/", views.PasswordChangeView.as_view(), name="password_change"
    ),
    path(
        "password_change/done/",
        views.PasswordChangeDoneView.as_view(),
        name="password_change_done",
    ),
    path("password_reset/", views.PasswordResetView.as_view(), name="password_reset"),
    path(
        "password_reset/done/",
        views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
"""
