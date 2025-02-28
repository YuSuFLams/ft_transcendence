from django.db import models
from users.models import Account

class msgModel(models.Model):
    sender = models.ForeignKey(Account, on_delete=models.PROTECT)
    msg = models.TextField()
    channel_name = models.CharField(max_length=10, null=True)
    msg_date = models.DateTimeField(auto_now_add=True)