import os

from rest_framework import serializers
from .models import Category, CustomUser, ProductImage, Product
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import password_validation
import requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(write_only=True, required=True)  # для завантаження файлу

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProductSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    images_data = ProductImageSerializer(source='images', many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'name', 'description', 'price',
            'images', 'images_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        product = Product.objects.create(**validated_data)

        for image in images_data:
            ProductImage.objects.create(product=product, image=image)

        return product


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at', 'updated_at', 'products']
        read_only_fields = ['id', 'created_at', 'updated_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    email = serializers.EmailField(required=True) 

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'phone', 'image')  # email тут

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Паролі не співпадають."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Користувача з такою поштою не знайдено.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=6, validators=[validate_password])

class ProfileUpdateSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'phone', 'old_password', 'new_password', 'image')
        extra_kwargs = {
            'email': {'required': False},
            'phone': {'required': False},
            'username': {'required': False},
            'image': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        user = self.instance
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')

        if new_password or old_password:
            if not old_password:
                raise serializers.ValidationError({"old_password": "Введіть старий пароль."})
            if not user.check_password(old_password):
                raise serializers.ValidationError({"old_password": "Старий пароль неправильний."})
            password_validation.validate_password(new_password, user)
        return attrs

    def update(self, instance, validated_data):
        validated_data.pop('old_password', None)
        new_password = validated_data.pop('new_password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if new_password:
            instance.set_password(new_password)

        instance.save()
        return instance

class ProfileSerializer(serializers.ModelSerializer):
    avatarUrl = serializers.SerializerMethodField()

    class Meta:
        model = User  # або твоя модель профілю
        fields = ['username', 'email', 'phone', 'avatarUrl']

    def get_avatarUrl(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)  # поверне повний URL
        return None