from django.contrib import admin
from . import models

@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'date_joined', 'is_active', 'is_staff']
    readonly_fields = ['id', 'date_joined']

@admin.register(models.FriendList)
class FriendListAdmin(admin.ModelAdmin):
    list_display = ['user__username', 'friends__username']
    readonly_fields = ['user', 'friends']

@admin.register(models.FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver']

@admin.register(models.ResetPassword)
class ResetPasswordAdmin(admin.ModelAdmin):
    list_display = ['email', 'token', 'created_at']
    readonly_fields = ['email', 'token', 'created_at']

@admin.register(models.Notification)
class NotifAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'notif_type', 'msg','timestamp']
    readonly_fields = ['sender', 'receiver', 'notif_type']

#TODO check this 
# @admin.register(models.BlackList)
# class BlackListAdmin(admin.ModelAdmin):
#     list_display = ['user', 'blocked', 'timestamp']