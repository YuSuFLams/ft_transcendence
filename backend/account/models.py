from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if (not email):
            raise ValueError("Users must have an email.")
        if (not username):
            raise ValueError("Users must have a username.")
        user = self.model(email=self.normalize_email(email),
                          username=username)
        user.set_password(password)
        user.save()
        return (user)
    
    def create_superuser(self, email, username, password):
        user = self.create_user(email=self.normalize_email(email),
                                username=username,
                                password=password)
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return (user)

class Account(AbstractBaseUser):
    username        = models.CharField(max_length=60, unique=True)
    first_name      = models.CharField(max_length=30, blank=True)
    last_name       = models.CharField(max_length=30, blank=True)
    email           = models.EmailField(unique=True)
    is_admin        = models.BooleanField(default=False)
    is_staff        = models.BooleanField(default=False)
    is_superuser    = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    date_joined     = models.DateTimeField(auto_now_add=True)
    avatar          = models.ImageField(default='default_avatar.jpg', upload_to='avatars/')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = MyAccountManager()

    def has_module_perms(self, app_label):
        return self.is_superuser

    def has_perm(self, perm, obj=None):
       return self.is_admin
    #required on /admin

    def __str__(self):
        return (self.username)
