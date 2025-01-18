from rest_framework import serializers
from .models import Account


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    repassword = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['first_name', 'last_name','email', 'username', 'password', 'repassword']

    def create(self, validated_data):
        user = Account(email=validated_data['email'],
                    username=validated_data['username'],
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'])
        #TODO you can add list.get('key', 'default_value')
        user.set_password(validated_data['password'])
        user.save()
        return user