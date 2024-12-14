from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from django.contrib.auth.models import User
from .models import Identity, Flyer, Contact

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'last_name', 'email', 'password']


class ContactSerializer(serializers.ModelSerializer):
    qrcode = serializers.ImageField(use_url=True, required=False)  
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Contact
        fields = [
            'first_name', 'last_name', 'phone', 'email', 
            'job', 'address', 'country', 'qrcode', 'user'
        ]
        
class IdentitySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Identity
        fields = '__all__'

class FlyerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Flyer
        fields = '__all__'