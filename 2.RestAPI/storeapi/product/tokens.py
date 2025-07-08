from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        token['phone'] = user.phone if user.phone else None
        token['image'] = user.image.url if user.image else None
        token['date_joined'] = user.date_joined.strftime('%Y-%m-%d %H:%M:%S')

        return token