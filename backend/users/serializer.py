from rest_framework import serializers
from .models import Account, FriendList

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']

class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['email', 'username', 'password', 'password2']

    def create(self, validated_data):
        user = Account(email=validated_data['email'],
                       username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
    

# class ProfileViewSerializer(serializers.Serializer):
#     username        = serializers.CharField(max_length=60, unique=True)
#     first_name      = serializers.CharField(max_length=30, blank=True)
#     email           = serializers.EmailField(unique=True)
#     avatar          = serializers.ImageField()
#     friends         = serializers.ListField()

class FriendsListSerializer(serializers.Serializer):
    class Meta:
        model = FriendList
        fields = ['friends']
