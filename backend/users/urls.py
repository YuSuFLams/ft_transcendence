from django.contrib import admin
from django.urls import path, include
from . import views
# from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    # path('oo/', include("allauth.urls")),
    path('<int:id>', views.view_profile, name='view_profile'),
    path('all', views.account_list, name='account_list'),
    path('search/', views.search_account, name='search'),
    path('login/', views.MyLoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('is_authenticated/', views.is_authenticated, name='is_authenticated'),
    path('edit/', views.edit, name='edit'),
    # path('', include('django.contrib.auth.urls')),
]
