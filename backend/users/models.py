from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings


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

class FriendList(models.Model):
    #one user -> one friendlist
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='user')
    
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                     blank=True,
                                     related_name='friends')
    
    def __str__(self):
        return self.user.username
    
    def add_friend(self, new_friend):
        friend_list, created = FriendList.objects.get_or_create(user=self.user)
        if (new_friend not in friend_list.friends.all()):
            friend_list.friends.add(new_friend)
        else:
            print("already friends")

    def remove_friend(self, old_friend):
        friend_list = FriendList.objects.get(user=self.user)
        if (old_friend in friend_list.friends.all()):
            friend_list.friends.remove(old_friend)
            self.save() #is it essential ?
    
    def unfriend(self, fake_friend):
        self.remove_friend(fake_friend)
        fake = FriendList.objects.get(user=fake_friend)
        fake.remove_friend(self.user)

    def is_friend(self, friend):
        if friend in self.friends.all():
            return (True)
        return (False)
    

class FriendRequest(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name='sender')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE,
                                 related_name='receiver')
    
    is_active = models.BooleanField(default=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (self.sender.username)
    
    def accept(self):
        sender_list, created = FriendList.objects.get_or_create(user=self.sender)
        receiver_list, created2 = FriendList.objects.get_or_create(user=self.receiver)

        sender_list.add_friend(self.receiver)
        receiver_list.add_friend(self.sender)
        self.is_active = False
        self.save()

    def cancel(self):
        self.is_active = False
        self.save()

    def decline(self):
        self.is_active = False
        self.save()
    