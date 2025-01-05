from django.contrib import admin
from .models import Account

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'date_joined', 'is_active', 'is_staff']
    readonly_fields = ['id', 'date_joined']
 