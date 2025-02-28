from django.contrib import admin
from .models import msgModel

# Register your models here.
@admin.register(msgModel)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['sender', 'msg', 'channel_name', 'msg_date']