from django.contrib import admin
from django.urls import path, include
from . import views
# from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('fr/', views.list_all_friends, name='list_all_friends'),
    path('<int:id>', views.view_profile, name='view_profile'),
    path('all_friends/', views.account_list, name='account_list'),
    path('list_all_req_sent/', views.list_all_req_sent, name='list_all_req'),
    path('list_all_req_received/', views.list_all_req_received, name='list_all_req'),
    
    path('search/', views.search_account, name='search'),
    
    
    path('send_friend_req/', views.send_friend_req, name='send_friend_req'),
    path('accept_friend/', views.accept_friend, name='accept_friend'),
    path('unfriend_friend/', views.unfriend_friend, name='unfriend_friend'),
    path('cancel_my_req/', views.cancel_my_req, name='cancel_my_req'),

    # path('login/', views.MyLoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('is_authenticated/', views.is_authenticated, name='is_authenticated'),
    path('edit/', views.edit, name='edit'),
    # path('', include('django.contrib.auth.urls')),
]
