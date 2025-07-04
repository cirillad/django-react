from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Category
from rest_framework.response import Response
from .serializers import CategorySerializer, UserSerializer
from rest_framework import generics
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from django.conf import settings

from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model, login

User = get_user_model()

# Категорії
class CategoryViewSet(ModelViewSet):
    print("get data")
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# Реєстрація користувача
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Поточний користувач
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# Стандартний логін через Google OAuth2 adapter (очікує access_token)
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class GoogleIdTokenLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('access_token')
        print("Received token:", token)

        if not token:
            return Response({'error': 'No token provided'}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                "832425931922-ej45c79sjntg26b685f58lguq3voq3v3.apps.googleusercontent.com"
            )
            print("ID Token payload:", idinfo)

            email = idinfo.get('email')
            if not email:
                return Response({'error': 'Email not found in token'}, status=400)

            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')

            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': email, 'first_name': name}
            )

            updated = False
            if picture and (created or user.google_picture_url != picture):
                user.google_picture_url = picture
                updated = True
            if updated:
                user.save()

            # Вказуємо backend
            user.backend = settings.AUTHENTICATION_BACKENDS[0]
            login(request, user)

            # Генеруємо JWT токени
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'email': email,
                'name': name,
                'picture': picture,
                'access': access_token,
                'refresh': str(refresh),
                'detail': 'Logged in successfully',
            })

        except ValueError as e:
            print("Token validation error:", str(e))
            return Response({'error': 'Invalid ID token'}, status=400)

