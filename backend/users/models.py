from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models.signals import pre_delete
from django.dispatch import receiver
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
                                password=password,
                                )
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
    is_oauth        = models.BooleanField(default=False)
    is_otp_active   = models.BooleanField(default=False)
    is_otp_verified = models.BooleanField(default=False)
    otp_secret      = models.CharField(max_length=32, blank=True)
    otp_code        = models.CharField(max_length=6, blank=True)
    is_online       = models.BooleanField(default=False)

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


class Notif(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name='sender_notif')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name='receiver_notif')
    msg = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)


class FriendList(models.Model):
    #one user -> one friendlist
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='friend_list')
    # you can access the friendlist from user using related_name
    #because it is one to one field
    
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                     related_name='friends')
    
    def __str__(self):
        return self.user.username
    
    def add_friend(self, new_friend):
        friend_list, created = FriendList.objects.get_or_create(user=self.user)
        if (new_friend not in friend_list.friends.all()):
            friend_list.friends.add(new_friend)
            self.save()
        else:
            print("already friends")

    def remove_friend(self, old_friend):
        try:
            friend_list = FriendList.objects.get(user=self.user)
            if (old_friend in friend_list.friends.all()):
                friend_list.friends.remove(old_friend)
                self.save() #is it essential ?
        except:
            pass

    
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
    
class ResetPassword(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


"""The utility of **kwargs
    added to prevent errs in case django signals sent
    more args
"""
@receiver(pre_delete, sender=Account)
def pre_del_account(sender, instance, **kwargs):
    try:
        friend_list = instance.friend_list
        friend_list.friends.clear() #remove all the friend relationship before removing the user
        friend_list.delete()
    except FriendList.DoesNotExist:
        pass

class Notification(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name="notif_sender")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE,
                                 related_name="notif_receiver")
    notif_type = models.IntegerField(default=-1)
    msg = models.CharField(max_length=128, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)