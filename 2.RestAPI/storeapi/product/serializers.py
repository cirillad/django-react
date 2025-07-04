from rest_framework import serializers
from .models import Category, User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    # Додаємо поле для URL аватарки, яке повертаємо, якщо image не встановлений
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'phone', 'image', 'google_picture_url', 'avatar']
        read_only_fields = ['id', 'avatar']

    def get_avatar(self, obj):
        # Повертаємо локальну картинку, якщо є, або google_picture_url інакше
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.google_picture_url

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user