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
