from django.contrib import admin
from . import models

@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'date_joined', 'is_active', 'is_staff']
    readonly_fields = ['id', 'date_joined']
 
@admin.register(models.FriendList)
class FriendListAdmin(admin.ModelAdmin):
    list_display = ['user__username', 'friends__username']
    readonly_fields = ['user']

@admin.register(models.FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver']

#TODO removing a user from admin does not work