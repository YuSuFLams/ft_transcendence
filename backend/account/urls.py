from django.contrib import admin
from django.urls import path, include
from . import views
# from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('<int:id>', views.view_profile, name='view_profile'),
    path('search', views.search_account, name='search'),
    path('login', views.MyLoginView.as_view(), name='login'),
    path('register/', views.register, name='register'),
    path('edit/', views.edit, name='edit'),
    path('', include('django.contrib.auth.urls')),

    #TESTING API
    path('P/', views.account_list, name='account_list'),
]
