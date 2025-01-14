from django.urls import path, include
from . import views
# from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('all_friends/', views.account_list, name='account_list'),
    path('list_all_req_sent/', views.list_all_req_sent, name='list_all_req'),
    path('list_all_req_received/', views.list_all_req_received, name='list_all_req'),
    
    path('search/', views.search_account, name='search'),
    path('<int:id>', views.view_profile, name='view_profile'),

    path('me/friends/', views.list_all_friends, name='list_all_friends'),
    path('me/edit/', views.edit, name='edit'),
    path('me/change_password/', views.change_password, name='change_password'),
    path('me/', views.me, name='me'),
    
    path('send_friend_req/', views.send_friend_req, name='send_friend_req'),
    path('accept_friend/', views.accept_friend, name='accept_friend'),
    path('unfriend_friend/', views.unfriend_friend, name='unfriend_friend'),
    path('cancel_my_req/', views.cancel_my_req, name='cancel_my_req'),
    path('decline_friend_req/', views.decline_friend_req, name='decline_friend_req'),


    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', views.MyTokenRefreshView.as_view(), name='token_refresh'),
    
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('is_authenticated/', views.is_authenticated, name='is_authenticated'),
]
