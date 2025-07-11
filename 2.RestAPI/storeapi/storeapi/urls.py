from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from product.views import CategoryViewSet, RegisterView, CurrentUserView, GoogleIdTokenLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from storeapi.social_urls import GoogleLogin  # імпортуємо кастомну Google в'юшку

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Реєстрація та користувач
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/user/', CurrentUserView.as_view(), name='current_user'),

    # dj-rest-auth
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    # Google OAuth endpoint
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('api/google-idtoken-login/', GoogleIdTokenLoginView.as_view(), name='google_idtoken_login'),

    # Необхідно для allauth
    path('accounts/', include('allauth.socialaccount.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
