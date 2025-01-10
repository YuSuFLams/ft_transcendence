from rest_framework import serializers
from .models import Account

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
        # if (validated_data['password'] != validated_data['password2']):
        #     return None
            # raise serializers.ErrorDetail("Passwords does not match.")
        
        user = Account(email=validated_data['email'],
                       username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

    def clean_password2(self):
        cd = self.cleaned_data
        if (cd['password'] != cd['password2']):
            raise serializers.ErrorDetail("Passwords does not match.")
        return (cd['password2'])