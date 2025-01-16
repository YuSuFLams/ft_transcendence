from rest_framework import serializers
from .models import Account, FriendList, FriendRequest

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']


class EditAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['first_name', 'last_name', 'avatar']
        read_only_fields = ['email', 'username']


class ChangePassSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    new_password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['old_password', 'new_password', 'new_password2']

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['email', 'username','first_name', 'last_name', 'password1', 'password2']

    def create(self, validated_data):
        user = Account(email=validated_data['email'],
                       username=validated_data['username'])
        #TODO add first_last names
        user.set_password(validated_data['password1'])
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

class ResetPasswordSerializer(serializers.Serializer):
    reset_email = serializers.EmailField()

class ResetPasswordSerializerSuccess(serializers.Serializer):
    new_password1 = serializers.CharField(write_only=True)
    new_password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['new_password1', 'new_password']