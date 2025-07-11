from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, RegisterSerializer, ProfileUpdateSerializer, ProductSerializer, \
    ProductImageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from .tokens import CustomTokenObtainPairSerializer
import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.tokens import default_token_generator as token_generator


from django.core.mail import send_mail


User = get_user_model()
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

# Create your views here.
class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    parser_classes = [MultiPartParser, FormParser]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    parser_classes = [MultiPartParser, FormParser]   # <--- додай це

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Користувач успішно зареєстрований!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # print("get data", request.data)
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"detail": "Access token required"}, status=status.HTTP_400_BAD_REQUEST)

        resp = requests.get(GOOGLE_USERINFO_URL, headers={"Authorization": f"Bearer {access_token}"})
        if resp.status_code != 200:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        userinfo = resp.json()
        
        google_id = userinfo.get("sub")               
        email = userinfo.get("email")
        phone = userinfo.get("phone_number")        
        avatar_url = userinfo.get("picture")
        username = userinfo.get("name") or email.split("@")[0]
        isGoogle = True

        if not email:
            return Response({"detail": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": username,
            "isGoogle": isGoogle,
        })


        if phone and not user.phone:
            user.phone = phone
            user.save(update_fields=["phone"])

        refresh = RefreshToken.for_user(user)

        send_mail(
            subject='Тестовий лист',
            message='Це тестовий лист від Django через smtp.ukr.net.',
            from_email='super.novakvova@ukr.net',
            recipient_list=['novakvova@gmail.com'],
            fail_silently=False,
        )

        return Response({
            "id": google_id,
            "email": email,
            "phone": phone,
            "avatar": avatar_url,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data["email"])
        except User.DoesNotExist:
            return Response(
                {"error": "Користувача з таким email не знайдено."},
                status=status.HTTP_404_NOT_FOUND,
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        frontend_url = request.data.get("frontend_url", "http://localhost:5173")
        reset_link = f"{frontend_url}/password-reset-confirm/{uid}/{token}"

        send_mail(
            subject="Відновлення паролю",
            message=f"Для відновлення паролю перейдіть за посиланням: {reset_link}",
            from_email="super.novakvova@ukr.net",
            recipient_list=[user.email],
            fail_silently=False,
            html_message=f"""
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #635985;">Відновлення паролю</h2>
                        <p>Щоб змінити пароль, перейдіть за посиланням:</p>
                        <p><a href="{reset_link}" style="background-color:#443C68; color:#fff; padding:10px 20px; text-decoration:none; border-radius:4px;">Змінити пароль</a></p>
                        <p>Якщо ви не запитували відновлення, просто ігноруйте цей лист.</p>
                    </div>
                </body>
                </html>
            """,
        )
        return Response(
            {"message": "Лист для відновлення паролю відправлено."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"error": "Недійсний код користувача."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not token_generator.check_token(user, serializer.validated_data["token"]):
            return Response(
                {"error": "Недійсний або протермінований токен."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"message": "Пароль успішно змінено."}, status=status.HTTP_200_OK
        )

class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Профіль успішно оновлено."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        avatar_url = None
        if hasattr(user, 'image') and user.image:
            try:
                avatar_url = request.build_absolute_uri(user.image.url)
            except ValueError:
                avatar_url = None

        data = {
            'username': user.username,
            'email': user.email,
            'phone': getattr(user, 'phone', ''),
            'avatarUrl': avatar_url,
        }
        return Response(data, status=status.HTTP_200_OK)