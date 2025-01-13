from rest_framework import serializers
from .models import Account, FriendList, FriendRequest

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

class FriendsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendList
        fields = ['friends']

class FriendsReqSentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['sender', 'timestamp']

class FriendsReqReceivedSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['receiver', 'timestamp']

class ViewProfileSerializer(serializers.Serializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    email = serializers.EmailField()
    avatar = serializers.ImageField()
    is_self = serializers.BooleanField()
    friendship = serializers.IntegerField()
    friends = serializers.ListSerializer(child=FriendsListSerializer(),
                                         read_only=True)
