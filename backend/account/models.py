from django.db import models

"""
    the auth framework, includes models that are defined on
    django.contrib.auth.models:
    User -> a models with basic fields {username, pass,email ..}
    Group-> to categorized the users
    permissions -> flag for users to perform certain actions
"""

from django.conf import settings

class Profile(models.Model):
    #one user will have one profile
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, #change it with get_user
        on_delete=models.CASCADE
    )
    date_of_birth = models.DateField(blank=True, null=True)
    #the ImageField manages the storage & the validation of the img
    # photo = models.ImageField(upload_to='users/%Y/%m/%d', blank=True)
    photo = models.ImageField(default='default_profile.png', upload_to='users/%Y/%m/%d')

    def __str__(self):
        return (f"Profile of {self.user.username}")